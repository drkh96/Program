// ========================================
// chest-engine-state.js  (CLEAN VERSION)
// Manages current step, answers & navigation
// ========================================

"use strict";

(function (global) {

  const Config = global.CHEST_ENGINE_CONFIG;

  if (!Config) {
    console.error("❌ CHEST_ENGINE_CONFIG not loaded.");
    return;
  }

  const SECTIONS = Config.sections || [];
  const STEPS    = Config.steps || [];

  // ====================================================
  // INTERNAL STATE
  // ====================================================
  const State = {
    index: 0,          // current step
    answers: {},       // saved user answers
    visibleSteps: []   // dynamically filtered steps
  };

  // ====================================================
  // FILTER STEPS BY visibleWhen
  // ====================================================
  function isStepVisible(step) {
    if (!step.visibleWhen) return true;

    const rule = step.visibleWhen;

    // ---- (1) single condition ----
    if (rule.stepId && rule.equals !== undefined) {
      return State.answers[rule.stepId] === rule.equals;
    }

    // ---- (2) all: [ ... ] ----
    if (rule.all && Array.isArray(rule.all)) {
      return rule.all.every((cond) =>
        State.answers[cond.stepId] === cond.equals
      );
    }

    return true;
  }

  function rebuildVisibleSteps() {
    State.visibleSteps = STEPS.filter(isStepVisible);
  }

  // ====================================================
  // NAVIGATION
  // ====================================================
  function getCurrentStep() {
    return State.visibleSteps[State.index] || null;
  }

  function goNext() {
    if (State.index < State.visibleSteps.length - 1) {
      State.index++;
    }
  }

  function goPrev() {
    if (State.index > 0) {
      State.index--;
    }
  }

  // ====================================================
  // SAVE ANSWER
  // ====================================================
  function saveAnswer(stepId, value) {
    State.answers[stepId] = value;
    rebuildVisibleSteps();
  }

  // ====================================================
  // EXPORT API
  // ====================================================
  global.CHEST_ENGINE_STATE = {
    init() {
      rebuildVisibleSteps();
      State.index = 0;
    },

    get answers() {
      return State.answers;
    },

    get steps() {
      return State.visibleSteps;
    },

    get current() {
      return getCurrentStep();
    },

    next() {
      goNext();
    },

    back() {
      goPrev();
    },

    save(stepId, val) {
      saveAnswer(stepId, val);
    }
  };

  console.log("✅ ENGINE STATE LOADED");

})(window);