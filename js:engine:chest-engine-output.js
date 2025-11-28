// ========================================
// chest-engine-output.js
// Provides DDx grouping and reasoning API
// on top of Engine.recomputeDxScores.
// ========================================

"use strict";

(function (global) {
  const Engine = global.ChestEngine;
  if (!Engine) {
    console.error("ChestEngine is not available. Make sure previous engine modules are loaded.");
    return;
  }

  const DIAGNOSES = Engine.diagnoses || [];
  const DX_GROUPS = Engine.dxGroups || {};
  const state     = Engine.state;

  // -----------------------------
  // Grouped DDx for UI
  // -----------------------------
  function getDDxGrouped() {
    if (typeof Engine.recomputeDxScores === "function") {
      Engine.recomputeDxScores();
    }

    const dxScores = state.dxScores || {};

    // Convert to array and sort by score desc
    const rows = Object.keys(dxScores)
      .map((id) => {
        const dx = DIAGNOSES.find((d) => d.id === id) || { id, label: id, group: "other" };
        return {
          id,
          label: dx.label || id,
          group: dx.group || "other",
          score: dxScores[id] || 0,
          keyMissingFeatures: dx.keyMissingFeatures || []
        };
      })
      .filter((r) => r.score !== 0)
      .sort((a, b) => b.score - a.score);

    if (!rows.length) return [];

    const maxScore = rows[0].score || 1;

    const groupsMap = {};
    rows.forEach((row) => {
      const g = DX_GROUPS[row.group] || { id: row.group, label: row.group };
      if (!groupsMap[g.id]) {
        groupsMap[g.id] = {
          id: g.id,
          label: g.label,
          items: []
        };
      }

      const featuresSet = state.featureMap && state.featureMap[row.id];
      const features    = featuresSet ? Array.from(featuresSet) : [];

      let clinicalScore = null;
      if (
        ["IHD", "StableAngina", "UnstableAngina", "MI", "ACS", "HF"].includes(row.id) &&
        state.heartScore
      ) {
        clinicalScore = `HEART-style (H/A/R only): ${state.heartScore.score} – ${state.heartScore.category}`;
      }
      if (["PEMajor"].includes(row.id) && state.peScore) {
        clinicalScore = `PE heuristic score: ${state.peScore.score.toFixed(
          1
        )} – ${state.peScore.category}`;
      }

      groupsMap[g.id].items.push({
        id: row.id,
        label: row.label,
        score: Math.round(row.score * 10) / 10,
        level: row.score / maxScore,
        clinicalScore,
        features,
        missing: row.keyMissingFeatures || []
      });
    });

    Object.values(groupsMap).forEach((g) => {
      g.items.sort((a, b) => b.score - a.score);
    });

    const result = Object.values(groupsMap).sort((a, b) => {
      const ga = DX_GROUPS[a.id];
      const gb = DX_GROUPS[b.id];
      const oa = ga && typeof ga.order === "number" ? ga.order : 999;
      const ob = gb && typeof gb.order === "number" ? gb.order : 999;
      return oa - ob;
    });

    return result;
  }

  // -----------------------------
  // Reasoning per step
  // -----------------------------
  function getReasoningFor(step, value) {
    if (!step) return [];

    const type = Engine.getStepType(step);

    // Numeric
    if (type === "numeric") {
      if (Array.isArray(step.reasoningForNumeric)) {
        return step.reasoningForNumeric;
      }
      return [];
    }

    // Text: no predefined reasoning
    if (type === "text") return [];

    if (!step.options) return [];

    // Single
    if (type === "single") {
      const opt = step.options[value];
      if (opt && Array.isArray(opt.reasoning)) {
        return opt.reasoning;
      }
      return [];
    }

    // Multi
    if (type === "multi" && Array.isArray(value)) {
      const acc = [];
      value.forEach((v) => {
        const opt = step.options[v];
        if (opt && Array.isArray(opt.reasoning)) {
          acc.push(...opt.reasoning);
        }
      });
      return acc;
    }

    return [];
  }

  // Attach to Engine
  Engine.getDDxGrouped   = getDDxGrouped;
  Engine.getReasoningFor = getReasoningFor;

})(window);