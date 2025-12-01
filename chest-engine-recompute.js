// =======================================================
// chest-engine-recompute.js
// Runs scoring rules and produces dxScores
// =======================================================

"use strict";

(function (global) {

  const Engine = global.ChestEngine;
  const State  = global.ChestEngineState;

  if (!Engine) {
    console.error("ChestEngine not loaded");
    return;
  }

  const Recompute = {

    // ===================================================
    // (1) Run scoring based on answers + rules-scoring.js
    // ===================================================
    recompute() {

      const answers = State.answers || {};
      const steps   = Engine.steps;

      // Reset scores
      const scores = {};

      // ---------------------------------------------------
      // CALL SCORING RULES
      // GlobalScoringRules.apply(step, answer, scores)
      // ---------------------------------------------------
      steps.forEach(step => {

        const value = answers[step.id];
        if (!value) return;

        if (global.GlobalScoringRules &&
            typeof global.GlobalScoringRules.apply === "function") {

          global.GlobalScoringRules.apply(step, value, scores);
        }
      });

      // ---------------------------------------------------
      // Normalize output (convert undefined → 0)
      // ---------------------------------------------------
      Object.keys(scores).forEach(dxId => {
        if (!scores[dxId]) scores[dxId] = 0;
      });

      // ---------------------------------------------------
      // Save to engine state
      // ---------------------------------------------------
      State.dxScores = scores;
    }

  };

  // expose engine function:
  global.ChestEngine.recomputeScores = function () {
    Recompute.recompute();
  };

})(window);