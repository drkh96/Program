// ========================================
// chest-engine-recompute.js (FINAL FIXED)
// Recompute diagnosis scores + attach features
// + attach HEART & PE scores
// + final packing for DDx UI
// ========================================

"use strict";

(function (global) {
  const Engine = global.ChestEngine;
  if (!Engine) {
    console.error("ChestEngine missing. Load state + scoring first.");
    return;
  }

  const STEPS     = Engine.steps || [];
  const DIAGNOSES = Engine.diagnoses || [];
  const state     = Engine.state;

  const scoring = Engine.scoring || {};
  const applyTextHeuristics       = scoring.applyTextHeuristics;
  const calculateHeartLikeScore   = scoring.calculateHeartLikeScore;
  const calculatePEHeuristicScore = scoring.calculatePEHeuristicScore;

  // ---------------------------------------
  // Helpers
  // ---------------------------------------
  function resetDxScores() {
    state.dxScores = {};
    DIAGNOSES.forEach((dx) => {
      state.dxScores[dx.id] = 0;
    });
  }

  function ensureDx(id) {
    if (!state.dxScores[id]) state.dxScores[id] = 0;
  }

  function bumpDx(id, delta) {
    if (!id || typeof delta !== "number") return;
    ensureDx(id);
    state.dxScores[id] += delta;
  }

  // ---------------------------------------
  // Main recompute function
  // ---------------------------------------
  function recomputeDxScores() {
    resetDxScores();

    // dxId → Set(features)
    const featureMap = {};

    function addFeature(dxId, text) {
      if (!dxId || !text) return;
      if (!featureMap[dxId]) featureMap[dxId] = new Set();
      featureMap[dxId].add(text);
    }

    // ---------------------------------------
    // STEP → scoring
    // ---------------------------------------
    STEPS.forEach((step) => {
      const value = state.answers[step.id];

      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return;
      }

      const type = Engine.getStepType(step);

      // Numeric
      if (type === "numeric" && typeof step.getDxFromValue === "function") {
        const res = step.getDxFromValue(value);

        if (Array.isArray(res)) {
          if (typeof res[0] === "string") {
            // e.g. ["MI","ACS"]
            res.forEach((dxId) => bumpDx(dxId, 2));
          } else {
            // e.g. [{add:[...], remove:[...]}, ...]
            res.forEach((obj) => {
              (obj.add || []).forEach((dxId) => bumpDx(dxId, 2));
              (obj.remove || []).forEach((dxId) => bumpDx(dxId, -2));
            });
          }
        }

        if (Array.isArray(step.reasoningForNumeric)) {
          step.reasoningForNumeric.forEach((r) => {
            (r.diseases || []).forEach((dxId) => addFeature(dxId, r.text));
          });
        }

        return;
      }

      // Text → no scoring
      if (type === "text") return;

      if (!step.options) return;

      // Single / multi select
      const handleOption = (optKey) => {
        const opt = step.options[optKey];
        if (!opt) return;

        (opt.dxAdd || []).forEach((dxId) => bumpDx(dxId, 2));
        (opt.dxRemove || []).forEach((dxId) => bumpDx(dxId, -2));

        if (Array.isArray(opt.reasoning)) {
          opt.reasoning.forEach((r) => {
            (r.diseases || []).forEach((dxId) =>
              addFeature(dxId, r.text)
            );
          });
        }
      };

      if (type === "single") {
        handleOption(value);
      } else if (type === "multi") {
        value.forEach((v) => handleOption(v));
      }
    });

    // ---------------------------------------
    // Apply heuristics (age, CC, duration)
    // ---------------------------------------
    if (applyTextHeuristics) {
      applyTextHeuristics(addFeature, bumpDx);
    }

    // Reset scores
    state.heartScore = null;
    state.peScore = null;

    // HEART-style
    if (calculateHeartLikeScore) {
      calculateHeartLikeScore(addFeature, bumpDx);
    }

    // PE heuristic
    if (calculatePEHeuristicScore) {
      calculatePEHeuristicScore(addFeature, bumpDx);
    }

    // ---------------------------------------
    // FINAL PACKING FOR UI (DDx panel)
    // ---------------------------------------
    state.diagnosisList = DIAGNOSES.map((dx) => {
      return {
        id: dx.id,
        label: dx.label,
        group: dx.group,
        score: state.dxScores[dx.id] || 0,
        features: featureMap[dx.id]
          ? Array.from(featureMap[dx.id])
          : [],
        clinicalScore:
          dx.id === "IHD" ||
          dx.id === "MI" ||
          dx.id === "ACS"
            ? state.heartScore
            : dx.id === "PEMajor"
            ? state.peScore
            : null
      };
    });

    // Highest score first
    state.diagnosisList.sort((a, b) => b.score - a.score);

    // Save feature map
    state.featureMap = featureMap;
  }

  // Expose
  Engine._resetDxScores = resetDxScores;
  Engine._bumpDx = bumpDx;
  Engine.recomputeDxScores = recomputeDxScores;
})(window);