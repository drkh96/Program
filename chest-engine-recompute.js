// ========================================
// chest-engine-recompute.js (CLEAN VERSION)
// Minimal recompute — NO scoring yet
// ========================================

"use strict";

(function (global) {

  const CONFIG = global.CHEST_ENGINE_CONFIG;
  const STATE  = global.CHEST_ENGINE_STATE;
  const ENGINE = global.CHEST_ENGINE;

  if (!CONFIG || !STATE || !ENGINE) {
    console.error("❌ RECOMPUTE ENGINE: Missing modules.");
    return;
  }

  const DIAGNOSES = CONFIG.diagnoses || [];

  // ----------------------------------------
  // Reset & recompute (NO scoring yet)
  // ----------------------------------------
  function recomputeDxScores() {

    // 1) Reset scores
    const dxScores = {};
    DIAGNOSES.forEach(dx => {
      dxScores[dx.id] = 0;
    });

    // 2) Minimal system:
    // Only dxAdd from step.options → +1
    STATE.steps.forEach(step => {

      const answer = STATE.answers[step.id];
      if (!answer) return;

      // Single
      if (step.type === "single" && step.options?.[answer]) {
        const opt = step.options[answer];
        if (Array.isArray(opt.dxAdd)) {
          opt.dxAdd.forEach(dx => dxScores[dx]++);
        }
      }

      // Multi
      if (step.type === "multi" && Array.isArray(answer)) {
        answer.forEach(val => {
          const opt = step.options?.[val];
          if (opt && Array.isArray(opt.dxAdd)) {
            opt.dxAdd.forEach(dx => dxScores[dx]++);
          }
        });
      }
    });

    // Save inside STATE
    STATE.dxScores = dxScores;

    // Build final diagnosisList for UI
    STATE.diagnosisList = DIAGNOSES.map(dx => ({
      id: dx.id,
      label: dx.label,
      group: dx.group,
      score: dxScores[dx.id] || 0
    })).sort((a, b) => b.score - a.score);
  }

  // ----------------------------------------
  // Expose API
  // ----------------------------------------
  ENGINE.recomputeDxScores = recomputeDxScores;

  console.log("✅ RECOMPUTE ENGINE LOADED (minimal)");

})(window);