// ========================================
// chest-engine-state.js  (FIXED & CLEAN VERSION)
// Core state, navigation & persistence
// Supports visible-step filtering
// ========================================

"use strict";

(function (global) {
  const Config = global.ChestConfig;
  if (!Config) {
    console.error("ChestConfig is not available. Make sure chest-engine-config.js is loaded first.");
    return;
  }

  const SECTIONS  = Config.SECTIONS;
  const STEPS     = Config.STEPS;
  const DIAGNOSES = Config.DIAGNOSES;
  const DX_GROUPS = Config.DX_GROUPS;
  const PRETTY    = Config.PRETTY_NAME;

  const STORAGE_KEY = "chestHistoryState_v2";

  // ==============================
  // MAIN STATE
  // ==============================
  const state = {
    currentIndex: 0,
    answers: {},

    dxScores: {},
    heartScore: null,
    peScore: null,
    featureMap: {}
  };

  // ==============================
  // STEP HELPERS
  // ==============================
  function getStepType(step) {
    if (!step) return "single";
    if (step.type === "numeric") return "numeric";
    if (step.type === "text")    return "text";
    if (step.type === "multi")   return "multi";
    return "single";
  }

  function getStepById(id) {
    const step = STEPS.find((s) => s.id === id);
    if (!step) {
      console.warn("ChestEngine: step not found:", id);
    }
    return step;
  }

  // Return ALL visible steps depending on user selection
  function getVisibleSteps() {
    if (typeof isStepVisible !== "function") return STEPS;
    return STEPS.filter((s) => isStepVisible(s));
  }

  function getCurrentStep() {
    const visible = getVisibleSteps();
    if (!visible.length) return null;

    if (state.currentIndex < 0) state.currentIndex = 0;
    if (state.currentIndex >= visible.length) {
      state.currentIndex = visible.length - 1;
    }

    return visible[state.currentIndex];
  }

  function nextStep() {
    const visible = getVisibleSteps();
    if (state.currentIndex < visible.length - 1) {
      state.currentIndex += 1;
    }
  }

  function prevStep() {
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
    }
  }

  function goToStep(idx) {
    const visible = getVisibleSteps();
    if (idx < 0 || idx >= visible.length) return;
    state.currentIndex = idx;
  }

  // ==============================
  // CORRECT PROGRESS COUNTER
  // ==============================
  function getProgressInfo() {
    const visible = getVisibleSteps();
    const currentStep = getCurrentStep();

    const currentIndex = visible.indexOf(currentStep) + 1;
    const total = visible.length;

    return {
      current: currentIndex > 0 ? currentIndex : 1,
      total
    };
  }

  function setAnswer(stepId, value) {
    state.answers[stepId] = value;
  }

  // ==============================
  // LOCAL STORAGE
  // ==============================
  function saveState() {
    try {
      const payload = {
        answers: state.answers,
        currentIndex: state.currentIndex
      };
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("Unable to save state:", e);
    }
  }

  function loadState() {
    try {
      const raw = global.localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return false;

      if (parsed.answers && typeof parsed.answers === "object") {
        state.answers = parsed.answers;
      }

      if (typeof parsed.currentIndex === "number") {
        state.currentIndex = parsed.currentIndex;
      } else {
        state.currentIndex = 0;
      }

      return true;
    } catch (e) {
      console.warn("Unable to load state:", e);
      return false;
    }
  }

  function clearSavedState() {
    try {
      global.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Unable to clear saved state:", e);
    }
  }

  // ==============================
  // INIT
  // ==============================
  function init() {
    state.currentIndex = 0;
    state.answers = {};
    state.dxScores = {};
    state.heartScore = null;
    state.peScore = null;
    state.featureMap = {};
  }

  // ==============================
  // EXPOSE ENGINE
  // ==============================
  const Engine = {
    sections:  SECTIONS,
    steps:     STEPS,
    diagnoses: DIAGNOSES,
    dxGroups:  DX_GROUPS,
    pretty:    PRETTY,

    state,

    init,
    getCurrentStep,
    nextStep,
    prevStep,
    goToStep,
    getProgressInfo,

    getStepType,
    getStepById,
    getVisibleSteps,
    setAnswer,

    saveState,
    loadState,
    clearSavedState
  };

  global.ChestEngine = Engine;

})(window);