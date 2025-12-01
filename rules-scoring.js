// ========================================
// rules-scoring.js
// محرك تأثير التشخيص لألم الصدر فقط
// لا يعتمد على أي ملف آخر
// ========================================

"use strict";

(function (global) {

  const engine = global.ChestEngine;

  if (!engine) {
    console.error("ChestEngine not found.");
    return;
  }

  // -------------------------------------------------------
  // 1) دالة إضافة نقاط للتشخيص
  // -------------------------------------------------------
  function bumpDx(dxId, value, scores) {
    if (!scores[dxId]) scores[dxId] = 0;
    scores[dxId] += value;
  }

  // -------------------------------------------------------
  // 2) القواعد الأساسية الخاصة بألم الصدر
  //    هذه القواعد تُطبَّق على كل إجابة
  // -------------------------------------------------------
  global.GlobalScoringRules = {

    apply(step, answer, scores) {

      // ============================
      // SITE — موقع الألم
      // ============================
      if (step.id === "hpi_site") {
        switch (answer) {

          case "retrosternal":
            bumpDx("IHD", 1, scores);
            bumpDx("MI", 1, scores);
            bumpDx("ACS", 0.8, scores);
            bumpDx("GERD", 0.3, scores);
            break;

          case "pleuritic_side":
            bumpDx("Pleurisy", 1, scores);
            bumpDx("PEMajor", 0.8, scores);
            bumpDx("Pneumonia", 0.6, scores);
            break;

          case "point_tenderness":
            bumpDx("Musculoskeletal", 1, scores);
            bumpDx("Costochondritis", 1, scores);
            break;

          case "chest_wall":
            bumpDx("MuscleInjury", 1, scores);
            bumpDx("MuscleSpasm", 1, scores);
            break;
        }
      }

      // ============================
      // ONSET — بداية الألم
      // ============================
      if (step.id === "hpi_onset") {
        switch (answer) {

          case "sudden_seconds":
            bumpDx("MI", 1, scores);
            bumpDx("PEMajor", 1, scores);
            bumpDx("AorticDissection", 1, scores);
            break;

          case "minutes":
            bumpDx("ACS", 1, scores);
            break;

          case "hours":
            bumpDx("Pericarditis", 0.7, scores);
            bumpDx("Pneumonia", 0.4, scores);
            break;

          case "days":
            bumpDx("GERD", 0.5, scores);
            bumpDx("Musculoskeletal", 0.5, scores);
            break;
        }
      }

      // ============================
      // CHARACTER — طبيعة الألم
      // ============================
      if (step.id === "hpi_character") {
        switch (answer) {

          case "pressure":
            bumpDx("MI", 1, scores);
            bumpDx("IHD", 1, scores);
            break;

          case "burning":
            bumpDx("GERD", 1, scores);
            bumpDx("Esophagitis", 1, scores);
            break;

          case "pleuritic_sharp":
            bumpDx("Pleurisy", 1, scores);
            bumpDx("PEMajor", 1, scores);
            break;

          case "tearing":
            bumpDx("AorticDissection", 2, scores);
            bumpDx("AorticAneurysm", 1, scores);
            break;
        }
      }

      // ============================
      // RADIATION — انتشار الألم
      // ============================
      if (step.id === "hpi_radiation") {
        switch (answer) {

          case "arm_jaw":
            bumpDx("MI", 2, scores);
            bumpDx("IHD", 1, scores);
            break;

          case "back_scapulae":
            bumpDx("AorticDissection", 2, scores);
            break;
        }
      }

      // ============================
      // AGGRAVATING FACTORS
      // ============================
      if (step.id === "hpi_aggravating") {

        if (answer.includes("exertion")) {
          bumpDx("IHD", 1, scores);
          bumpDx("StableAngina", 1, scores);
        }

        if (answer.includes("deep_breath")) {
          bumpDx("Pleurisy", 1, scores);
          bumpDx("PEMajor", 1, scores);
        }

        if (answer.includes("movement")) {
          bumpDx("Musculoskeletal", 1, scores);
          bumpDx("Costochondritis", 1, scores);
        }

        if (answer.includes("post_meal")) {
          bumpDx("GERD", 1, scores);
          bumpDx("Esophagitis", 0.5, scores);
        }
      }

      // ============================
      // RELIEVING FACTORS
      // ============================
      if (step.id === "hpi_relieving") {

        if (answer.includes("rest")) {
          bumpDx("StableAngina", 1, scores);
        }

        if (answer.includes("gtn")) {
          bumpDx("IHD", 1, scores);
        }

        if (answer.includes("lean_forward")) {
          bumpDx("Pericarditis", 1, scores);
        }

        if (answer.includes("antacids")) {
          bumpDx("GERD", 1, scores);
        }
      }

      // ============================
      // ASSOCIATED SYMPTOMS
      // ============================
      if (step.id === "hpi_associated") {

        if (answer.includes("dyspnea")) {
          bumpDx("MI", 1, scores);
          bumpDx("HF", 1, scores);
          bumpDx("PEMajor", 1, scores);
        }

        if (answer.includes("diaphoresis")) {
          bumpDx("MI", 2, scores);
        }

        if (answer.includes("nausea")) {
          bumpDx("MI", 1, scores);
          bumpDx("GERD", 0.5, scores);
        }

        if (answer.includes("syncope")) {
          bumpDx("Arrhythmia", 1, scores);
          bumpDx("PEMajor", 1, scores);
          bumpDx("AorticDissection", 1, scores);
        }

        if (answer.includes("cough")) {
          bumpDx("Pneumonia", 1, scores);
        }

        if (answer.includes("hemoptysis")) {
          bumpDx("PEMajor", 2, scores);
        }

        if (answer.includes("fever")) {
          bumpDx("Pneumonia", 1, scores);
          bumpDx("Pericarditis", 0.5, scores);
        }
      }

      // ============================
      // EPISODE DURATION
      // ============================
      if (step.id === "hpi_duration") {
        switch (answer) {

          case "seconds":
            bumpDx("Musculoskeletal", 1, scores);
            bumpDx("Anxiety", 0.5, scores);
            break;

          case "5_20_minutes":
            bumpDx("StableAngina", 1, scores);
            break;

          case "over_20":
            bumpDx("MI", 2, scores);
            break;

          case "continuous":
            bumpDx("GERD", 1, scores);
            bumpDx("Pericarditis", 1, scores);
            break;
        }
      }

    } // END apply()

  };

  // -------------------------------------------------------
  // دمج المحرك داخل ChestEngine
  // -------------------------------------------------------
  const oldRecompute = engine.recomputeScores.bind(engine);

  engine.recomputeScores = function () {

    const scores = {};
    const answers = engine.state.answers;

    const allSteps = engine.steps;

    allSteps.forEach(step => {
      const value = answers[step.id];
      if (!value) return;

      GlobalScoringRules.apply(step, value, scores);
    });

    engine.state.dxScores = scores;

    oldRecompute();
  };

})(window);