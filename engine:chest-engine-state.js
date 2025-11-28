// ========================================
// chest-engine-state.js
// Core state, navigation & persistence
// (no scoring / DDx logic here)
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

  // -----------------------------
  // State object
  // -----------------------------
  const state = {
    currentIndex: 0,
    answers: {},      // stepId -> value (string | string[] | number)

    // هذي الحقول راح تستخدم لاحقاً في ملفات scoring
    dxScores: {},     // dxId -> score (filled by scoring module)
    heartScore: null, // {score, category}
    peScore: null,    // {score, category}
    featureMap: {}    // dxId -> Set of feature strings
  };

  // -----------------------------
  // Helpers
  // -----------------------------
  function getStepType(step) {
    if (!step) return "single";
    if (step.type === "numeric") return "numeric";
    if (step.type === "text")    return "text";
    if (step.type === "multi")   return "multi";
    return "single";
  }

  function getStepById(id) {
    return STEPS.find((s) => s.id === id);
  }

  function getCurrentStep() {
    if (state.currentIndex < 0) state.currentIndex = 0;
    if (state.currentIndex >= STEPS.length) {
      state.currentIndex = STEPS.length - 1;
    }
    return STEPS[state.currentIndex];
  }

  function nextStep() {
    if (state.currentIndex < STEPS.length - 1) {
      state.currentIndex += 1;
    }
  }

  function prevStep() {
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
    }
  }

  function goToStep(idx) {
    if (idx < 0 || idx >= STEPS.length) return;
    state.currentIndex = idx;
  }

  function getProgressInfo() {
    const current = state.currentIndex + 1;
    const total   = STEPS.length;
    return { current, total };
  }

  function setAnswer(stepId, value) {
    state.answers[stepId] = value;
  }

  // -----------------------------
  // LocalStorage helpers
  // -----------------------------
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
      if (
        typeof parsed.currentIndex === "number" &&
        parsed.currentIndex >= 0 &&
        parsed.currentIndex < STEPS.length
      ) {
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

  // -----------------------------
  // Init
  // -----------------------------
  function init() {
    state.currentIndex = 0;
    state.answers = {};
    state.dxScores = {};
    state.heartScore = null;
    state.peScore = null;
    state.featureMap = {};
  }

  // -----------------------------
  // Expose base ChestEngine object
  // (other engine modules will extend this)
// -----------------------------
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
    setAnswer,

    saveState,
    loadState,
    clearSavedState
  };

  global.ChestEngine = Engine;

})(window);