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
  // Helper: evaluate a single condition
  // visibleWhen: { stepId, equals / equalsAny / notEquals }
  // or: { all: [ { stepId, equals }, ... ] }
  // -----------------------------
  function evaluateCondition(cond, answers) {
    if (!cond) return true;

    // AND of multiple conditions
    if (Array.isArray(cond.all)) {
      return cond.all.every((c) => evaluateCondition(c, answers));
    }

    if (!cond.stepId) return true;

    const val = answers[cond.stepId];

    // equals (for single or multi answers)
    if (Object.prototype.hasOwnProperty.call(cond, "equals")) {
      const target = cond.equals;
      if (Array.isArray(val)) {
        return val.includes(target);
      }
      return val === target;
    }

    // equalsAny: one of several values
    if (Array.isArray(cond.equalsAny)) {
      if (Array.isArray(val)) {
        return cond.equalsAny.some((t) => val.includes(t));
      }
      return cond.equalsAny.includes(val);
    }

    // notEquals
    if (Object.prototype.hasOwnProperty.call(cond, "notEquals")) {
      const target = cond.notEquals;
      if (Array.isArray(val)) {
        return !val.includes(target);
      }
      return val !== target;
    }

    return true;
  }

  function isStepVisible(step, answers) {
    if (!step || !step.visibleWhen) return true;
    return evaluateCondition(step.visibleWhen, answers || {});
  }

  function findNextVisibleIndex(fromIndex) {
    let idx = fromIndex + 1;
    while (idx < STEPS.length) {
      if (isStepVisible(STEPS[idx], state.answers)) return idx;
      idx++;
    }
    // إذا ماكو شيء بعده، نبقى على نفس السؤال الأخير
    return fromIndex;
  }

  function findPrevVisibleIndex(fromIndex) {
    let idx = fromIndex - 1;
    while (idx >= 0) {
      if (isStepVisible(STEPS[idx], state.answers)) return idx;
      idx--;
    }
    // إذا رجعنا للبداية، نبقى على أول واحد
    return 0;
  }

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
  // Navigation wrappers (with skipping hidden steps)
  // -----------------------------
  function nextStep() {
    const newIndex = findNextVisibleIndex(state.currentIndex);
    state.currentIndex = newIndex;
    if (typeof Engine.saveState === "function") Engine.saveState();
  }

  function prevStep() {
    const newIndex = findPrevVisibleIndex(state.currentIndex);
    state.currentIndex = newIndex;
    if (typeof Engine.saveState === "function") Engine.saveState();
  }

  function goToStep(index) {
    if (index < 0 || index >= STEPS.length) return;
    // نتأكد إنه نروح لأقرب سؤال ظاهر
    let target = index;
    if (!isStepVisible(STEPS[target], state.answers)) {
      // جرّب نتحرك للأمام أولاً
      target = findNextVisibleIndex(target - 1);
      // إذا بقى مخفي، نرجع للخلف
      if (!isStepVisible(STEPS[target], state.answers)) {
        target = findPrevVisibleIndex(index + 1);
      }
    }
    state.currentIndex = target;
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
  Engine.init      = init;
  Engine.resetCase = resetCase;
  Engine.setAnswer = setAnswer;
  Engine.nextStep  = nextStep;
  Engine.prevStep  = prevStep;
  Engine.goToStep  = goToStep;

  global.ChestEngine = Engine;
})(window);