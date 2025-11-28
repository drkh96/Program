// ========================================
// chest-engine-core.js
// Central controller: init, answer update,
// navigation, saving/loading, and exposing
// the final ChestEngine API.
// ========================================

"use strict";

(function (global) {
  const Engine = global.ChestEngine;
  if (!Engine) {
    console.error("ChestEngine is not available. Make sure previous engine modules are loaded first.");
    return;
  }

  const state = Engine.state;
  const STEPS = Engine.steps;

  // -----------------------------
  // Update Answer (with recompute + autosave)
  // -----------------------------
  function setAnswer(stepId, value) {
    state.answers[stepId] = value;

    // --- recompute scores after every answer ---
    if (typeof Engine.recomputeDxScores === "function") {
      Engine.recomputeDxScores();
    }

    // --- save state automatically ---
    if (typeof Engine.saveState === "function") {
      Engine.saveState();
    }
  }

  // -----------------------------
  // Navigation wrappers
  // -----------------------------
  function nextStep() {
    if (state.currentIndex < STEPS.length - 1) {
      state.currentIndex++;
    }
    if (typeof Engine.saveState === "function") Engine.saveState();
  }

  function prevStep() {
    if (state.currentIndex > 0) {
      state.currentIndex--;
    }
    if (typeof Engine.saveState === "function") Engine.saveState();
  }

  function goToStep(index) {
    if (index < 0 || index >= STEPS.length) return;
    state.currentIndex = index;
    if (typeof Engine.saveState === "function") Engine.saveState();
  }

  // -----------------------------
  // Init / Reset
  // -----------------------------
  function init() {
    state.currentIndex = 0;
    state.answers = {};
    state.dxScores = {};
    state.featureMap = {};
    state.heartScore = null;
    state.peScore = null;

    if (typeof Engine.clearSavedState === "function") {
      Engine.clearSavedState();
    }
  }

  function resetCase() {
    init();
  }

  // -----------------------------
  // Export final API
  // -----------------------------
  Engine.init          = init;
  Engine.resetCase     = resetCase;
  Engine.setAnswer     = setAnswer;
  Engine.nextStep      = nextStep;
  Engine.prevStep      = prevStep;
  Engine.goToStep      = goToStep;

  // Already defined in state module:
  // Engine.getCurrentStep
  // Engine.getProgressInfo
  // Engine.getStepType
  // Engine.saveState / loadState / clearSavedState
  // Engine.getDDxGrouped (from output.js)
  // Engine.getReasoningFor (from output.js)

  global.ChestEngine = Engine;

})(window);