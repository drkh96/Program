// ========================================
// chest-engine.js
// Core logic for chest pain history engine (Updated with Wells Score)
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
      st.sectionLabel = st.sectionLabel || sec.label || "";
      st.sectionId = st.sectionId || sec.id;
      STEPS.push(st);
    });
  });

  // Diagnosis index
  const PRETTY_NAME = {
      IHD: "Ischemic Heart Disease",
      StableAngina: "Stable Angina",
      UnstableAngina: "Unstable Angina",
      MI: "Myocardial Infarction",
      ACS: "Acute Coronary Syndrome (ACS)",
      HF: "Heart Failure",
      Pneumothorax: "Pneumothorax",
      Pleurisy: "Pleurisy",
      Pneumonia: "Pneumonia",
      PEMajor: "Pulmonary Embolism (Major)",
      Myocarditis: "Myocarditis",
      Pericarditis: "Pericarditis",
      PanicAttack: "Panic attack / Anxiety",
      AorticDissection: "Aortic Dissection",
      PAD: "Peripheral Arterial Disease",
      Oesophagitis: "Oesophagitis",
      EsophagealSpasm: "Esophageal Spasm",
      ChestWallPain: "Chest Wall Pain"
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
    answers: {},
    dxScores: {},
    wellsScore: 0
  };

  function resetDxScores() {
    state.dxScores = {};
    (Data.diagnoses || []).forEach((dx) => {
      state.dxScores[dx.id] = {
        score: 0,
        features: []
      };
    });
    state.wellsScore = 0;
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
// Apply one option effect (WEIGHTED SCORING)
// --------------------------------------

function applyOptionEffect(step, optKey) {
  if (!step || !step.options) return;
  const opt = step.options[optKey];
  if (!opt) return;

  const feature = opt.label || optKey;

  (opt.dxAdd || []).forEach((dxId) => {
    let weight = 2; // Default weight

    // Red Flags (+10)
    if (dxId === "AorticDissection" && (feature.includes("تمزيقي") || feature.includes("يشع إلى الظهر"))) {
        weight = 10; 
    }
    
    // High Weight (+5) for strong clinical indicators
    else if (dxId === "MI" || dxId === "ACS") {
      if (feature.includes("تعرق غزير") || feature.includes("إلى الفك") || feature.includes("أكثر من 30 دقيقة")) {
        weight = 5; 
      }
    } 
    else if (dxId === "PEMajor") {
      if (feature.includes("سعال مصحوب بدم") || feature.includes("جراحة كبرى حديثة") || feature.includes("أكثر من 30 دقيقة")) {
        weight = 5; 
      }
    } 
    else if (dxId === "UnstableAngina") {
        if (feature.includes("أكثر من 30 دقيقة") || feature.includes("يزداد سوءاً")) {
            weight = 3; 
        }
    }

    bumpDx(dxId, weight, feature);
  });

  (opt.dxRemove || []).forEach((dxId) => {
    bumpDx(dxId, -1, null); // Standard removal penalty
  });
}

// --------------------------------------
// Wells' Criteria for Pulmonary Embolism (PE)
// --------------------------------------

function calculateWellsScore() {
  let score = 0;
  const ans = state.answers;
  
  // 1. Signs/symptoms of DVT (3 points)
  if (Array.isArray(ans.rosCVS) && ans.rosCVS.includes('legEdema')) {
    score += 3;
  }

  // 2. PE is #1 diagnosis OR equally likely (3 points)
  const onset = ans.onset;
  const character = ans.character;
  if (onset === 'sudden' && character === 'sharp') {
      score += 3; 
  }

  // 4. Immobilization (>= 3 days) or surgery in the previous 4 weeks (1.5 points)
  if (Array.isArray(ans.pshOps) && ans.pshOps.includes('majorSurgery')) {
    score += 1.5;
  }

  // 5. Previous DVT/PE (1.5 points) - نستخدم مضادات التخثر كبديل مقترح
  if (Array.isArray(ans.drugHistory) && ans.drugHistory.includes('anticoag')) {
    score += 1.5;
  }
  
  // 6. Hemoptysis (1 point)
  if (Array.isArray(ans.associated) && ans.associated.includes('hemoptysis')) {
    score += 1;
  }
  
  // 7. Malignancy (1 point) - غير متوفرة في الأسئلة الحالية

  state.wellsScore = score;
  
  // تطبيق نقاط إضافية على PE بناءً على نتيجة Wells Score
  // Low Risk: (Score < 2) -> لا يوجد نقاط إضافية
  // Moderate Risk: (Score 2 - 6) -> +5
  // High Risk: (Score > 6) -> +10
  if (score > 6) {
    bumpDx('PE', 10, `Wells Score High Risk: ${score} points`);
    bumpDx('PEMajor', 10, `Wells Score High Risk: ${score} points`);
  } else if (score >= 2) {
    bumpDx('PE', 5, `Wells Score Moderate Risk: ${score} points`);
    bumpDx('PEMajor', 5, `Wells Score Moderate Risk: ${score} points`);
  }
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

      if (t === "single") {
        applyOptionEffect(step, val);
      } else if (t === "multi") {
        if (Array.isArray(val)) {
          val.forEach((v) => applyOptionEffect(step, v));
        }
      } else if (t === "numeric") {
        const num = parseInt(val, 10);
        
        if (!isNaN(num) && typeof step.getDxFromValue === "function") {
          const rulesOrDxList = step.getDxFromValue(num) || [];
          
          rulesOrDxList.forEach(item => {
            if (typeof item === 'object' && (item.add || item.remove)) {
              // Age logic
              const feature = step.reasoningForNumeric && step.reasoningForNumeric.length > 0 ? step.reasoningForNumeric[0].text : "Numeric value influence";
              (item.add || []).forEach(dxId => bumpDx(dxId, 2, feature));
              (item.remove || []).forEach(dxId => bumpDx(dxId, -1, null));
            } 
            else if (typeof item === 'string') { 
              // Severity logic (Red Flag)
              const feature = step.reasoningForNumeric && step.reasoningForNumeric.length > 0 ? step.reasoningForNumeric[0].text : "Severe pain";
              bumpDx(item, 7, feature); 
            }
          });
        }
      } else if (t === "text" && typeof step.getDxFromText === "function") {
        const dxRules = step.getDxFromText(val) || [];
        dxRules.forEach(rule => {
          const feature = rule.featureText || "Duration/text analysis"; 
          (rule.add || []).forEach(dxId =>
            bumpDx(dxId, 2, feature)
          );
          (rule.remove || []).forEach(dxId =>
            bumpDx(dxId, -1, feature)
          );
        });
      }
    });
    
    // Run Wells Score Calculation
    calculateWellsScore();
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
  // Build DDx list grouped by system (INCLUDE MISSING FEATURES)
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
      if (!obj || obj.score < 1) return; 
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
      
      let wellsStatus = null;
      if (dxId === 'PE' || dxId === 'PEMajor') {
          const score = state.wellsScore;
          let risk = 'Low';
          if (score >= 2 && score <= 6) risk = 'Moderate';
          else if (score > 6) risk = 'High';
          
          wellsStatus = `Wells Score: ${score} (${risk} Risk)`;
      }

      groups[gId].items.push({
        id: dxId,
        label: dxMeta.label,
        score: obj.score,
        features: obj.features || [],
        missing: dxMeta.keyMissingFeatures || [], 
        wells: wellsStatus 
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
