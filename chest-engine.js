// ========================================
// chest-engine.js
// Core logic for chest pain history engine
// ========================================

"use strict";

(function (global) {

  const Data = global.ChestData;
  if (!Data) {
    console.error("ChestData is not loaded.");
    return;
  }

  // --------------------------------------
  // Build flat STEPS array from sections
  // --------------------------------------

  const SECTIONS = Data.sections || [];

  const STEPS = [];
  SECTIONS.forEach((sec) => {
    (sec.steps || []).forEach((st) => {
      // تأكيد وجود sectionLabel
      st.sectionLabel = st.sectionLabel || sec.label || "";
      st.sectionId = st.sectionId || sec.id;
      STEPS.push(st);
    });
  });

  // Diagnosis index
  // Pretty names for diseases
const PRETTY_NAME = {
  IHD: "Ischemic Heart Disease",
  StableAngina: "Stable Angina",
  UnstableAngina: "Unstable Angina",
  MI: "Myocardial Infarction",
  HF: "Heart Failure",
  Pneumothorax: "Pneumothorax",
  PneumothoraxMajor: "Pneumothorax (Major)",
  Pleurisy: "Pleurisy",
  PNA: "Pneumonia",
  PEMajor: "Pulmonary Embolism – Major",
  PEMinor: "Pulmonary Embolism – Minor",
  Myocarditis: "Myocarditis",
  Pericarditis: "Pericarditis",
  Anxiety: "Anxiety-Related Chest Pain",
  AorticDissection: "Aortic Dissection"
};
  const DIAG_MAP = {};
  (Data.diagnoses || []).forEach((dx) => {
    DIAG_MAP[dx.id] = dx;
  });

  // --------------------------------------
  // Engine state
  // --------------------------------------

  const state = {
    currentIndex: 0,
    answers: {},   // stepId -> value or [values] or scalar
    dxScores: {}   // dxId -> { score, features[] }
  };

  function resetDxScores() {
    state.dxScores = {};
    (Data.diagnoses || []).forEach((dx) => {
      state.dxScores[dx.id] = {
        score: 0,
        features: []
      };
    });
  }

  // helper to add score/feature
  function bumpDx(dxId, delta, featureText) {
    if (!dxId || !state.dxScores[dxId]) return;
    const obj = state.dxScores[dxId];
    obj.score += delta;
    if (featureText && !obj.features.includes(featureText)) {
      obj.features.push(featureText);
    }
  }

  // --------------------------------------
  // Step type
  // --------------------------------------

  function getStepType(step) {
    if (!step) return "single";
    if (step.type === "multi") return "multi";
    if (step.type === "numeric") return "numeric";
    if (step.type === "text") return "text";
    return "single";
  }
// --------------------------------------
// Apply one option effect
// --------------------------------------

function applyOptionEffect(step, optKey) {
  if (!step || !step.options) return;
  const opt = step.options[optKey];
  if (!opt) return;

  // بدل ما نكتب: question → option
  // نخزن فقط نص الخيار نفسه كـ feature
  const feature = opt.label || optKey;

  (opt.dxAdd || []).forEach((dxId) => {
    bumpDx(dxId, 2, feature);
  });

  (opt.dxRemove || []).forEach((dxId) => {
    bumpDx(dxId, -1, null);
  });
}
  
  // --------------------------------------
  // Recompute all diagnoses
  // --------------------------------------

  function recomputeDx() {
  resetDxScores();

  STEPS.forEach((step) => {
    const t = getStepType(step);
    const val = state.answers[step.id];

    if (val === undefined || val === null || val === "") return;

    if (t === "multi") {
      if (Array.isArray(val)) {
        val.forEach((v) => applyOptionEffect(step, v));
      }
    } else if (t === "single") {
      applyOptionEffect(step, val);
    } else if (t === "numeric") {
      const num = parseInt(val, 10);
      if (!isNaN(num) && typeof step.getDxFromValue === "function") {
        const dxList = step.getDxFromValue(num) || [];
        const feature = " → very severe pain";
        dxList.forEach((dxId) => bumpDx(dxId, 2, feature));
      }
    } else if (t === "text" && typeof step.getDxFromText === "function") {
      const dxRules = step.getDxFromText(val) || [];
      dxRules.forEach(rule => {
        (rule.add || []).forEach(dxId =>
          bumpDx(dxId, 2, "duration")
        );
        (rule.remove || []).forEach(dxId =>
          bumpDx(dxId, -1, "duration")
        );
      });
    }
  });
}
  // --------------------------------------
  // Public: set answer for a step
  // --------------------------------------

  function setAnswer(stepId, value) {
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return;
    const t = getStepType(step);

    if (t === "multi") {
      state.answers[stepId] = Array.isArray(value) ? value.slice() : [];
    } else if (t === "numeric") {
      state.answers[stepId] = value;
    } else {
      state.answers[stepId] = value;
    }

    recomputeDx();
  }

  // --------------------------------------
  // Navigation
  // --------------------------------------

  function getCurrentStep() {
    return STEPS[state.currentIndex] || null;
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
    const total = STEPS.length;
    const current = state.currentIndex + 1;
    return {
      current,
      total
    };
  }

  // --------------------------------------
  // Build DDx list grouped by system
  // --------------------------------------

  function getDDxGrouped() {
    const groups = {};

    // init
    Object.values(Data.dxGroups || {}).forEach((g) => {
      groups[g.id] = {
        id: g.id,
        label: g.label,
        order: g.order,
        items: []
      };
    });

    Object.entries(state.dxScores).forEach(([dxId, obj]) => {
      if (!obj || obj.score <= 0) return;
      const dxMeta = DIAG_MAP[dxId];
      if (!dxMeta) return;
      const gId = dxMeta.group || "other";

      if (!groups[gId]) {
        groups[gId] = {
          id: gId,
          label: gId,
          order: 99,
          items: []
        };
      }

      groups[gId].items.push({
        id: dxId,
        label: dxMeta.label,
        score: obj.score,
        features: obj.features || []
      });
    });

    const sortedGroups = Object.values(groups)
      .map((g) => {
        g.items.sort((a, b) => b.score - a.score);
        return g;
      })
      .filter((g) => g.items.length > 0)
      .sort((a, b) => a.order - b.order);

    return sortedGroups;
  }

  // --------------------------------------
  // Clinical reasoning for current step & option
  // --------------------------------------

  function getReasoningFor(step, value) {
    if (!step) return [];
    const type = getStepType(step);

    if (type === "numeric") {
      return step.reasoningForNumeric || [];
    }

    if (!step.options) return [];
    if (type === "multi" && Array.isArray(value)) {
      // collect all selected options reasoning
      const out = [];
      value.forEach((v) => {
        const opt = step.options[v];
        if (opt && Array.isArray(opt.reasoning)) {
          out.push(...opt.reasoning);
        }
      });
      return out;
    } else {
      const opt = step.options[value];
      if (opt && Array.isArray(opt.reasoning)) {
        return opt.reasoning;
      }
    }
    return [];
  }

  // --------------------------------------
  // Init
  // --------------------------------------

  function init() {
    resetDxScores();
  }

  // --------------------------------------
  // Public API
  // --------------------------------------

  global.ChestEngine = {
  sections: SECTIONS,
  steps: STEPS,
  state,
  init,
  getCurrentStep,
  nextStep,
  prevStep,
  goToStep,
  setAnswer,
  getProgressInfo,
  getDDxGrouped,
  getReasoningFor,
  getStepType,
  pretty: PRETTY_NAME,
};

})(window);