// ========================================
// chest-engine.js
// Core logic for chest pain history trainer
// - Uses ChestData (sections + diagnoses)
// - Provides scoring, grouped DDx, and reasoning
// - HEART-style (H/A/R) and PE heuristic scores (educational only)
// - Adds text-based heuristics for age / chief complaint / duration
// - Adds localStorage helpers for state persistence
// ========================================

"use strict";

(function (global) {
  const Data = global.ChestData;
  if (!Data) {
    console.error("ChestData is not loaded.");
    return;
  }

  // -----------------------------
  // Basic data
  // -----------------------------
  const SECTIONS  = Data.sections || [];
  const DIAGNOSES = Data.diagnoses || [];
  const DX_GROUPS = Data.dxGroups || {};

  // Build flat steps array
  const STEPS = [];
  SECTIONS.forEach((section) => {
    (section.steps || []).forEach((step) => {
      STEPS.push(step);
    });
  });

  // Pretty-name map for diagnoses (id -> label)
  const PRETTY_NAME = {};
  DIAGNOSES.forEach((dx) => {
    PRETTY_NAME[dx.id] = dx.label || dx.id;
  });

  // -----------------------------
  // State
  // -----------------------------
  const state = {
    currentIndex: 0,
    answers: {}, // stepId -> value (string | string[] | number)
    dxScores: {},

    heartScore: null, // {score, category}
    peScore: null,    // {score, category}

    featureMap: {}    // dxId -> Set(text features)
  };

  const STORAGE_KEY = "chestHistoryState_v2";

  // -----------------------------
  // Helpers
  // -----------------------------
  function resetDxScores() {
    const scores = {};
    DIAGNOSES.forEach((dx) => {
      scores[dx.id] = 0;
    });
    state.dxScores = scores;
  }

  function ensureDx(id) {
    if (!id) return;
    if (!(id in state.dxScores)) {
      state.dxScores[id] = 0;
    }
  }

  function bumpDx(id, delta) {
    if (!id || !delta) return;
    ensureDx(id);
    state.dxScores[id] += delta;
  }

  function normaliseText(str) {
    if (!str) return "";
    return String(str).toLowerCase();
  }

  // Parse age from free-text field like "55 سنة" or "55 years"
  function parseAgeFromText(ageText) {
    if (!ageText) return null;
    const m = String(ageText).match(/(\d{1,3})/);
    if (!m) return null;
    const n = parseInt(m[1], 10);
    if (!Number.isFinite(n) || n <= 0 || n > 120) return null;
    return n;
  }

  // -----------------------------
  // Helper: read labels from options
  // -----------------------------
  function getStepById(id) {
    return STEPS.find((s) => s.id === id);
  }

  function getStepType(step) {
    if (!step) return "single";
    if (step.type === "numeric") return "numeric";
    if (step.type === "text") return "text";
    if (step.type === "multi") return "multi";
    return "single";
  }

  function getOptionLabel(stepId) {
    const step = getStepById(stepId);
    if (!step) return "";
    const val = state.answers[stepId];
    if (val === undefined || val === null || val === "") return "";
    if (!step.options) return String(val);

    // single-choice
    const opt = step.options[val];
    return opt && opt.label ? opt.label : String(val);
  }

  function getMultiLabels(stepId) {
    const step = getStepById(stepId);
    if (!step || !step.options) return [];
    const val = state.answers[stepId];
    if (!Array.isArray(val)) return [];
    return val
      .map((v) => {
        const opt = step.options[v];
        return opt && opt.label ? opt.label : null;
      })
      .filter(Boolean);
  }

  // -----------------------------
  // HEART-style score (H/A/R only)
  // -----------------------------
  function calculateHeartLikeScore(addFeature) {
    const ans = state.answers;
    let score = 0;

    // Age (from ageText free text)
    const ageVal = ans.ageText;
    const ageNum = parseAgeFromText(ageVal);
    let agePoints = 0;

    if (ageNum !== null) {
      if (ageNum < 45) agePoints = 0;
      else if (ageNum <= 64) agePoints = 1;
      else agePoints = 2;

      if (agePoints > 0) {
        addFeature(
          "IHD",
          `Age ${ageNum} years contributes ${agePoints} point(s) to HEART-style age component.`
        );
        addFeature(
          "MI",
          `Age ${ageNum} years contributes ${agePoints} point(s) to HEART-style age component.`
        );
      }
    }

    score += agePoints;

    // History (typical chest pain pattern)
    let historyPoints = 0;
    const site        = getOptionLabel("site");
    const character   = getOptionLabel("character");
    const aggravating = getOptionLabel("aggravating");
    const relief      = getOptionLabel("relief");
    const radiation   = getOptionLabel("radiation");

    const typicalFeatures = [];

    function hasWord(str, word) {
      if (!str) return false;
      return str.toLowerCase().indexOf(word.toLowerCase()) !== -1;
    }

    if (hasWord(site, "خلف القص") || hasWord(site, "retrosternal")) {
      typicalFeatures.push("typical location");
    }
    if (
      hasWord(character, "ضاغط") ||
      hasWord(character, "ضغط") ||
      hasWord(character, "constrict") ||
      hasWord(character, "thick") ||
      hasWord(character, "ثقل")
    ) {
      typicalFeatures.push("typical character");
    }
    if (hasWord(aggravating, "الجهد") || hasWord(aggravating, "exertion")) {
      typicalFeatures.push("worse with exertion");
    }
    if (
      hasWord(relief, "الراحة") ||
      hasWord(relief, "gtn") ||
      hasWord(relief, "نترات")
    ) {
      typicalFeatures.push("relieved by rest/GTN");
    }
    if (
      hasWord(radiation, "الذراع") ||
      hasWord(radiation, "الكتف") ||
      hasWord(radiation, "الفك") ||
      hasWord(radiation, "jaw") ||
      hasWord(radiation, "left arm")
    ) {
      typicalFeatures.push("typical radiation");
    }

    if (typicalFeatures.length >= 3) historyPoints = 2;
    else if (typicalFeatures.length >= 1) historyPoints = 1;
    else historyPoints = 0;

    if (historyPoints > 0) {
      addFeature(
        "IHD",
        `Typical anginal features (${typicalFeatures.join(
          ", "
        )}) contribute ${historyPoints} point(s) to HEART-style history.`
      );
      addFeature(
        "StableAngina",
        `Typical anginal features (${typicalFeatures.join(
          ", "
        )}) contribute ${historyPoints} point(s) to HEART-style history.`
      );
    }

    score += historyPoints;

    // Risk factors (R): PMH / FH / SH
    let riskPoints = 0;
    const pmhLabel = getMultiLabels("pmhChronic").join("، ");
    const famLabel = getOptionLabel("familyHistory");
    const shLabel  = getMultiLabels("socialHistory").join("، ");

    const riskStrings = normaliseText(
      [pmhLabel, famLabel, shLabel].join(" ")
    );

    let riskCount = 0;
    const riskKeywords = [
      "سكر",
      "diabetes",
      "ضغط",
      "hypertension",
      "مدخن",
      "smoker",
      "دهون",
      "cholesterol",
      "lipid",
      "سمنة",
      "obesity",
      "كلوي",
      "renal",
      "ckd",
      "kidney"
    ];

    riskKeywords.forEach((key) => {
      if (riskStrings.includes(key)) {
        riskCount++;
      }
    });

    if (riskCount === 0) riskPoints = 0;
    else if (riskCount <= 2) riskPoints = 1;
    else riskPoints = 2;

    if (riskPoints > 0) {
      addFeature(
        "IHD",
        `Presence of multiple cardiovascular risk factors contributes ${riskPoints} point(s) to HEART-style risk component.`
      );
      addFeature(
        "MI",
        `Presence of multiple cardiovascular risk factors contributes ${riskPoints} point(s) to HEART-style risk component.`
      );
    }

    score += riskPoints;

    // Category (educational only)
    let category;
    if (score <= 2)
      category = "Low risk (educational HEART-style H/A/R)";
    else if (score <= 4)
      category = "Moderate risk (educational HEART-style H/A/R)";
    else category = "High risk (educational HEART-style H/A/R)";

    state.heartScore = { score, category };

    // Apply gentle bumps to relevant diagnoses
    const cardiacDx = [
      "IHD",
      "StableAngina",
      "UnstableAngina",
      "MI",
      "ACS",
      "HF"
    ];
    let delta;
    if (score <= 2) delta = 1;
    else if (score <= 4) delta = 2;
    else delta = 4;
    cardiacDx.forEach((id) => bumpDx(id, delta));
  }

  // -----------------------------
  // PE heuristic ("Wells-like" educational score)
// -----------------------------
  function calculatePEHeuristicScore(addFeature) {
    const ans = state.answers;
    let score = 0;

    const onsetLabel      = getOptionLabel("onset");
    const characterLabel  = getOptionLabel("character");
    const associatedLabel = getMultiLabels("associated").join("، ");
    const rosLMLabel      = getMultiLabels("rosLM").join("، ");
    const pshOpsLabel     = getMultiLabels("pshOps").join("، ");
    const pmhLabel        = getMultiLabels("pmhChronic").join("، ");

    function has(str, key) {
      if (!str) return false;
      return str.toLowerCase().indexOf(key.toLowerCase()) !== -1;
    }

    // PE most likely: sudden pleuritic pain
    if (has(onsetLabel, "فجائي") || has(onsetLabel, "sudden")) {
      score += 3;
      addFeature(
        "PEMajor",
        "Sudden onset chest pain supports increased probability of pulmonary embolism."
      );
    }
    if (
      has(characterLabel, "طاعن") ||
      has(characterLabel, "pleuritic") ||
      has(characterLabel, "sharp")
    ) {
      score += 1.5;
      addFeature(
        "PEMajor",
        "Sharp pleuritic chest pain is compatible with pulmonary embolism."
      );
    }

    // Clinical signs of DVT (leg swelling)
    if (
      has(rosLMLabel, "تورّم") ||
      has(rosLMLabel, "swelling")
    ) {
      score += 3;
      addFeature(
        "PEMajor",
        "Clinical signs of DVT (leg swelling) strongly increase PE probability."
      );
    }

    // Recent major surgery / immobilisation
    if (
      has(pshOpsLabel, "جراحة كبرى") ||
      has(pshOpsLabel, "major") ||
      has(pshOpsLabel, "orthopedic") ||
      has(pshOpsLabel, "immobil")
    ) {
      score += 1.5;
      addFeature(
        "PEMajor",
        "Recent major surgery or immobilisation is a classic PE risk factor."
      );
    }

    // Previous DVT/PE
    if (
      has(pmhLabel, "dvt") ||
      has(pmhLabel, "deep vein") ||
      has(pmhLabel, "pulmonary embolism") ||
      has(pmhLabel, "pe")
    ) {
      score += 1.5;
      addFeature(
        "PEMajor",
        "History of previous DVT/PE increases probability of recurrence."
      );
    }

    // Hemoptysis / syncope / severe dyspnea in associated symptoms
    if (
      has(associatedLabel, "سعال مصحوب بدم") ||
      has(associatedLabel, "hemoptysis")
    ) {
      score += 1;
      addFeature(
        "PEMajor",
          "Hemoptysis with chest pain is a red-flag feature for pulmonary embolism."
      );
    }
    if (
      has(associatedLabel, "إغماء") ||
      has(associatedLabel, "syncope")
    ) {
      score += 1;
      addFeature(
        "PEMajor",
        "Syncope in the context of chest pain may indicate massive PE."
      );
    }
    if (
      has(associatedLabel, "ضيق في التنفس") ||
      has(associatedLabel, "ضيق التنفس") ||
      has(associatedLabel, "dyspnea")
    ) {
      score += 1;
      addFeature(
        "PEMajor",
        "Acute dyspnea accompanying chest pain increases suspicion for PE."
      );
    }

    // Categorise (educational, not real Wells)
    let category;
    if (score < 2)
      category = "Low PE probability (educational Wells-style heuristic)";
    else if (score <= 4)
      category =
        "Intermediate PE probability (educational Wells-style heuristic)";
    else category = "High PE probability (educational Wells-style heuristic)";

    state.peScore = { score, category };

    // Apply moderate bump to PE diagnoses
    const peDx = ["PEMajor"]; // single consolidated PE entity in data
    let delta;
    if (score < 2) delta = 0.5;
    else if (score <= 4) delta = 2;
    else delta = 4;
    peDx.forEach((id) => bumpDx(id, delta));
  }

  // -----------------------------
  // Text-based heuristics
  // (ageText, mainSymptom, ccDuration)
// -----------------------------
  function applyTextHeuristics(addFeature) {
    const ans = state.answers;

    // ----- Age -----
    const ageText = ans.ageText;
    const ageNum  = parseAgeFromText(ageText);

    if (ageNum !== null) {
      if (ageNum < 35) {
        // Younger adult
        bumpDx("Anxiety", 1.5);
        bumpDx("Musculoskeletal", 1.5);
        bumpDx("PEMajor", 1);
        bumpDx("GERD", 0.5);
        bumpDx("IHD", -1);

        addFeature(
          "Musculoskeletal",
          `Young age (${ageNum}) makes musculoskeletal and non-ischemic causes more likely overall.`
        );
      } else if (ageNum >= 35 && ageNum < 55) {
        bumpDx("IHD", 1.5);
        bumpDx("StableAngina", 1.5);
        bumpDx("MI", 1);
        bumpDx("PEMajor", 0.5);

        addFeature(
          "IHD",
          `Middle age (${ageNum}) increases baseline probability of coronary artery disease.`
        );
      } else {
        // ≥55
        bumpDx("IHD", 2.5);
        bumpDx("StableAngina", 2);
        bumpDx("MI", 2);
        bumpDx("HF", 1.5);
        bumpDx("Dissection", 1);

        addFeature(
          "IHD",
          `Older age (${ageNum}) strongly increases probability of ischemic heart disease.`
        );
        addFeature(
          "Dissection",
          `Older age (${ageNum}) is compatible with aortic pathology such as dissection.`
        );
      }
    }

    // ----- Chief complaint: mainSymptom -----
    const mainSym = normaliseText(ans.mainSymptom || "");

    if (mainSym) {
      if (
        mainSym.includes("ألم") &&
        mainSym.includes("صدر")
      ) {
        // "ألم في الصدر"
        bumpDx("IHD", 1.5);
        bumpDx("MI", 1.5);
        bumpDx("ACS", 1.5);
        bumpDx("PEMajor", 1);
        bumpDx("Pericarditis", 0.5);
        bumpDx("Musculoskeletal", 0.5);
        bumpDx("GERD", 0.5);

        addFeature(
          "IHD",
          "Primary presenting complaint is chest pain, which is typical for ischemic causes."
        );
      }

      if (
        mainSym.includes("chest pain") ||
        mainSym.includes("tightness in chest")
      ) {
        bumpDx("IHD", 1.5);
        bumpDx("ACS", 1.5);
        bumpDx("MI", 1);
        bumpDx("PEMajor", 0.5);
      }

      if (
        mainSym.includes("ضيق") &&
        mainSym.includes("نفس")
      ) {
        // ضيق نفس
        bumpDx("HF", 1.5);
        bumpDx("PEMajor", 1.5);
        bumpDx("COPD", 1);
        bumpDx("Asthma", 1);

        addFeature(
          "HF",
          "Chief complaint of breathlessness suggests heart failure or pulmonary pathology."
        );
      }

      if (mainSym.includes("palpit") || mainSym.includes("خفقان")) {
        bumpDx("Arrhythmia", 2);
        bumpDx("Anxiety", 1);

        addFeature(
          "Arrhythmia",
          "Palpitations as main complaint support a primary arrhythmic cause."
        );
      }

      if (mainSym.includes("إغماء") || mainSym.includes("syncope")) {
        bumpDx("Arrhythmia", 2);
        bumpDx("PEMajor", 1.5);
        bumpDx("Dissection", 1);

        addFeature(
          "Arrhythmia",
          "Syncope as main complaint is concerning for arrhythmia or other serious circulatory compromise."
        );
      }
    }

    // ----- Duration of complaint: ccDuration -----
    const durText = normaliseText(ans.ccDuration || "");

    if (durText) {
      const acuteWords = [
        "دقائق",
        "دقايق",
        "minute",
        "minutes",
        "min",
        "ساعة",
        "ساعات",
        "hour",
        "hours",
        "منذ ساعة",
        "منذ ساعتين"
      ];
      const subacuteWords = [
        "يوم",
        "يومين",
        "أيام",
        "days",
        "day",
        "week",
        "أسبوع"
      ];
      const chronicWords = [
        "أشهر",
        "شهور",
        "أسابيع",
        "شهور عديدة",
        "months",
        "years",
        "سنوات"
      ];

      let isAcute = false;
      let isSubacute = false;
      let isChronic = false;

      acuteWords.forEach((w) => {
        if (durText.includes(w.toLowerCase())) isAcute = true;
      });
      subacuteWords.forEach((w) => {
        if (durText.includes(w.toLowerCase())) isSubacute = true;
      });
      chronicWords.forEach((w) => {
        if (durText.includes(w.toLowerCase())) isChronic = true;
      });

      if (isAcute && !isChronic && !isSubacute) {
        // Very acute onset (hours)
        bumpDx("MI", 2);
        bumpDx("ACS", 2);
        bumpDx("PEMajor", 2);
        bumpDx("Dissection", 1.5);
        bumpDx("Pericarditis", 0.5);

        addFeature(
          "MI",
          "Very acute duration of symptoms (hours) supports acute coronary or thromboembolic events."
        );
      } else if (isSubacute && !isChronic) {
        // days to week
        bumpDx("Pneumonia", 1.5);
        bumpDx("Pericarditis", 1);
        bumpDx("HF", 0.5);
        bumpDx("IHD", 0.5);

        addFeature(
          "Pneumonia",
          "Symptoms evolving over days are compatible with an infectious or inflammatory thoracic process."
        );
      } else if (isChronic) {
        bumpDx("StableAngina", 2);
        bumpDx("GERD", 1.5);
        bumpDx("Musculoskeletal", 1.5);
        bumpDx("Anxiety", 1);
        bumpDx("MI", -1);
        bumpDx("PEMajor", -1);
        bumpDx("Dissection", -1);

        addFeature(
          "StableAngina",
          "Chronic, recurrent symptoms over months/years are more compatible with stable angina or functional/benign causes."
        );
      }
    }
  }

  // -----------------------------
  // Recompute all diagnosis scores
  // -----------------------------
  function recomputeDxScores() {
    resetDxScores();

    // featureMap: dxId -> Set(text features)
    const featureMap = {};
    function addFeature(dxId, text) {
      if (!dxId || !text) return;
      if (!featureMap[dxId]) featureMap[dxId] = new Set();
      featureMap[dxId].add(text);
    }

    // Traverse all steps and apply dxAdd/dxRemove or numeric logic
    STEPS.forEach((step) => {
      const value = state.answers[step.id];
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return;
      }

      const type = getStepType(step);

      // Numeric (kept for future compatibility, not used in current data)
      if (type === "numeric" && typeof step.getDxFromValue === "function") {
        const res = step.getDxFromValue(value);
        if (Array.isArray(res)) {
          if (res.length && typeof res[0] === "string") {
            res.forEach((id) => bumpDx(id, 2));
          } else {
            res.forEach((obj) => {
              if (!obj) return;
              (obj.add || []).forEach((id) => bumpDx(id, 2));
              (obj.remove || []).forEach((id) => bumpDx(id, -2));
            });
          }
        }

        if (Array.isArray(step.reasoningForNumeric)) {
          step.reasoningForNumeric.forEach((r) => {
            (r.diseases || []).forEach((dxId) =>
              addFeature(dxId, r.text)
            );
          });
        }
        return;
      }

      // Text steps: do not directly affect dxScores here
      if (type === "text") {
        return;
      }

      if (!step.options) return;

      const handleOption = (optKey) => {
        const opt = step.options[optKey];
        if (!opt) return;

        const dxAdd = Array.isArray(opt.dxAdd) ? opt.dxAdd : [];
        const dxRemove = Array.isArray(opt.dxRemove) ? opt.dxRemove : [];

        dxAdd.forEach((id) => bumpDx(id, 2));
        dxRemove.forEach((id) => bumpDx(id, -2));

        if (Array.isArray(opt.reasoning)) {
          opt.reasoning.forEach((r) => {
            (r.diseases || []).forEach((dxId) =>
              addFeature(dxId, r.text)
            );
          });
        }
      };

      if (type === "single") {
        handleOption(value);
      } else if (type === "multi" && Array.isArray(value)) {
        value.forEach((v) => handleOption(v));
      }
    });

    // Text-based contributions (ageText, mainSymptom, ccDuration)
    applyTextHeuristics(addFeature);

    // Apply HEART-style and PE heuristic AFTER base + text scores
    calculateHeartLikeScore(addFeature);
    calculatePEHeuristicScore(addFeature);

    state.featureMap = featureMap;
  }

  // -----------------------------
  // Grouped DDx for UI
  // -----------------------------
  function getDDxGrouped() {
    // Recompute scores before returning
    recomputeDxScores();

    const rows = Object.keys(state.dxScores)
      .map((id) => {
        const dx =
          DIAGNOSES.find((d) => d.id === id) || {
            id,
            label: id,
            group: "other"
          };
        return {
          id,
          label: dx.label || id,
          group: dx.group || "other",
          score: state.dxScores[id] || 0,
          keyMissingFeatures: dx.keyMissingFeatures || []
        };
      })
      .filter((r) => r.score !== 0)
      .sort((a, b) => b.score - a.score);

    if (!rows.length) return [];

    const maxScore = rows[0].score || 1;

    const groupsMap = {}; // groupId -> {id,label,items}
    rows.forEach((row) => {
      const g = DX_GROUPS[row.group] || {
        id: row.group,
        label: row.group
      };
      if (!groupsMap[g.id]) {
        groupsMap[g.id] = {
          id: g.id,
          label: g.label,
          items: []
        };
      }

      const featuresSet =
        state.featureMap && state.featureMap[row.id];
      const features = featuresSet ? Array.from(featuresSet) : [];

      let clinicalScore = null;
      if (
        ["IHD", "StableAngina", "UnstableAngina", "MI", "ACS", "HF"].includes(
          row.id
        ) &&
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
      const oa =
        ga && typeof ga.order === "number" ? ga.order : 999;
      const ob =
        gb && typeof gb.order === "number" ? gb.order : 999;
      return oa - ob;
    });

    return result;
  }

  // -----------------------------
  // Reasoning per step (for middle card)
// -----------------------------
  function getReasoningFor(step, value) {
    if (!step) return [];

    const type = getStepType(step);

    if (type === "numeric") {
      if (Array.isArray(step.reasoningForNumeric)) {
        return step.reasoningForNumeric;
      }
      return [];
    }

    if (type === "text") return [];

    if (!step.options) return [];

    if (type === "single") {
      const opt = step.options[value];
      if (opt && Array.isArray(opt.reasoning)) {
        return opt.reasoning;
      }
      return [];
    }

    if (type === "multi" && Array.isArray(value)) {
      const out = [];
      value.forEach((v) => {
        const opt = step.options[v];
        if (opt && Array.isArray(opt.reasoning)) {
          out.push(...opt.reasoning);
        }
      });
      return out;
    }

    return [];
  }

  // -----------------------------
  // Navigation helpers
  // -----------------------------
  function getCurrentStep() {
    if (state.currentIndex < 0) state.currentIndex = 0;
    if (state.currentIndex >= STEPS.length)
      state.currentIndex = STEPS.length - 1;
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
    const total = STEPS.length;
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
      global.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(payload)
      );
    } catch (e) {
      // ignore storage errors (private mode, etc.)
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
  // init()
  // -----------------------------
  function init() {
    resetDxScores();
    state.currentIndex = 0;
    state.answers = {};
    state.heartScore = null;
    state.peScore = null;
    state.featureMap = {};
  }

  // -----------------------------
  // Expose public API
  // -----------------------------
  global.ChestEngine = {
    sections: SECTIONS,
    steps: STEPS,
    diagnoses: DIAGNOSES,
    dxGroups: DX_GROUPS,

    state,
    init,
    getCurrentStep,
    nextStep,
    prevStep,
    goToStep,
    getProgressInfo,
    getDDxGrouped,
    getReasoningFor,
    getStepType,
    setAnswer,
    pretty: PRETTY_NAME,

    // new helpers for persistence
    saveState,
    loadState,
    clearSavedState
  };
})(window);