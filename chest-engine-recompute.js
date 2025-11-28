// ========================================
// chest-engine-recompute.js
// Recompute all diagnosis scores using
// step responses + scoring helpers.
// ========================================

"use strict";

(function (global) {
  const Engine = global.ChestEngine;
  if (!Engine) {
    console.error("ChestEngine is not available. Make sure chest-engine-state.js and chest-engine-scoring.js are loaded.");
    return;
  }

  const STEPS     = Engine.steps || [];
  const DIAGNOSES = Engine.diagnoses || [];
  const state     = Engine.state;
  const scoring   = Engine.scoring || {};

  const applyTextHeuristics       = scoring.applyTextHeuristics;
  const calculateHeartLikeScore   = scoring.calculateHeartLikeScore;
  const calculatePEHeuristicScore = scoring.calculatePEHeuristicScore;

  if (!applyTextHeuristics || !calculateHeartLikeScore || !calculatePEHeuristicScore) {
    console.warn("Scoring helpers are missing on Engine.scoring.");
  }

  // -----------------------------
  // Internal helpers: dxScores
  // -----------------------------
  function resetDxScores() {
    const scores = {};
    (DIAGNOSES || []).forEach((dx) => {
      scores[dx.id] = 0;
    });
    state.dxScores = scores;
  }

  function ensureDx(id) {
    if (!state.dxScores) state.dxScores = {};
    if (!(id in state.dxScores)) {
      state.dxScores[id] = 0;
    }
  }

  function bumpDx(id, delta) {
    if (!id || !delta) return;
    ensureDx(id);
    state.dxScores[id] += delta;
  }

  // -----------------------------
  // Recompute all diagnosis scores
  // -----------------------------
  function recomputeDxScores() {
    resetDxScores();

    // featureMap: dxId -> Set of clinical feature texts
    const featureMap = {};

    function addFeature(dxId, text) {
      if (!dxId || !text) return;
      if (!featureMap[dxId]) featureMap[dxId] = new Set();
      featureMap[dxId].add(text);
    }

    // Traverse all steps and apply dxAdd/dxRemove or numeric logic
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

      // Numeric with getDxFromValue
      if (type === "numeric" && typeof step.getDxFromValue === "function") {
        const res = step.getDxFromValue(value);
        if (Array.isArray(res)) {
          // Two possible shapes:
          // 1) ["MI","ACS",...]
          // 2) [{add: [...], remove: [...]}, ...]
          if (res.length && typeof res[0] === "string") {
            res.forEach((id) => bumpDx(id, 2));
          } else {
            res.forEach((obj) => {
              if (!obj) return;
              (obj.add || []).forEach((id) => bumpDx(id, 2));
              (obj.remove || []).forEach((id) => bumpDx(id, -2));
            });
          }
        }

        // Reasoning for numeric steps
        if (Array.isArray(step.reasoningForNumeric)) {
          step.reasoningForNumeric.forEach((r) => {
            (r.diseases || []).forEach((dxId) => addFeature(dxId, r.text));
          });
        }
        return;
      }

      // Text steps don't directly affect dxScores in this engine
      if (type === "text") {
        return;
      }

      // Single / multi options
      if (!step.options) return;

      const handleOption = (optKey) => {
        const opt = step.options[optKey];
        if (!opt) return;

        // Basic add/remove lists
        const dxAdd    = Array.isArray(opt.dxAdd) ? opt.dxAdd : [];
        const dxRemove = Array.isArray(opt.dxRemove) ? opt.dxRemove : [];

        dxAdd.forEach((id) => bumpDx(id, 2));
        dxRemove.forEach((id) => bumpDx(id, -2));

        // Reasoning attached to option -> positive features
        if (Array.isArray(opt.reasoning)) {
          opt.reasoning.forEach((r) => {
            (r.diseases || []).forEach((dxId) => addFeature(dxId, r.text));
          });
        }
      };

      if (type === "single") {
        handleOption(value);
      } else if (type === "multi" && Array.isArray(value)) {
        value.forEach((v) => handleOption(v));
      }
    });

    // Text-based heuristics (ageText, mainSymptom, ccDuration)
    if (typeof applyTextHeuristics === "function") {
      applyTextHeuristics(addFeature, bumpDx);
    }

    // HEART-style and PE scoring
    state.heartScore = null;
    state.peScore    = null;

    if (typeof calculateHeartLikeScore === "function") {
      calculateHeartLikeScore(addFeature, bumpDx);
    }
    if (typeof calculatePEHeuristicScore === "function") {
      calculatePEHeuristicScore(addFeature, bumpDx);
    }

    // Store feature map on state for UI / DDx panel
    state.featureMap = featureMap;
  }

  // Expose on Engine
  Engine._resetDxScores     = resetDxScores;
  Engine._bumpDx            = bumpDx;
  Engine.recomputeDxScores  = recomputeDxScores;

})(window);