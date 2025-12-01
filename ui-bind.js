// =======================================================
// ui-bind.js
// Connects ENGINE ⇆ UI (Questions, Reasoning, DDx, Scenario)
// =======================================================

"use strict";

(function (global) {

  const Binder = {

    init() {

      // 1) تشغيل المحرك الأساسي
      const engine = global.ChestEngine;
      engine.init(global.ChestData);

      // 2) تحضير واجهة الأسئلة
      const steps = engine.steps;
      global.ChestUI.init(steps);

      // 3) تفعيل تصميم الواجهة
      global.UILayout.init();

      // 4) عند إنهاء الأسئلة → ننتقل للمرحلة التالية
      this.bindFinishButton();
    },

    // ====================================================================
    // عندما يضغط المستخدم "Finish" في بطاقة الأسئلة → توليد النتائج
    // ====================================================================
    bindFinishButton() {

      const nextBtn = document.querySelector("#nextBtn");
      const engine = global.ChestEngine;

      nextBtn.addEventListener("click", () => {

        // إذا وصلنا لآخر سؤال في الأسئلة
        if (nextBtn.innerText === "Finish") {

          // 1) محرك جمع الإجابات
          const answers = engine.collectAnswers();

          // 2) إعادة حساب التشخيصات
          engine.recomputeScores();

          // 3) بناء التحليل السريري (English only)
          const reasoning = this.buildClinicalReasoning(answers);
          global.ClinicalAnalysisUI.render(reasoning);

          // 4) بناء التشخيصات التفريقية (English only)
          const ddx = this.buildDDx(engine.state.dxScores);
          global.DDxUI.render(ddx);

          // 5) بناء الـ Case Scenario (English only)
          const dxTop3 = UIUtils.topDx(ddx.flatMap(device => device.diseases));
          global.CaseScenarioUI.generate(answers, dxTop3);
        }
      });
    },


    // ====================================================================
    // (A) BUILD CLINICAL REASONING
    // ====================================================================
    buildClinicalReasoning(answers) {

      // لكل خطوة، نحتاج map يحتوي أسباب كل خيار
      // سيتم التخزين لاحقاً على شكل:
      // { stepId : { optionId : [ "reason1", "reason2" ] } }

      const reasoningMap = global.REASONING_MAP || {};

      return UIUtils.buildReasoning(answers, reasoningMap);
    },


    // ====================================================================
    // (B) BUILD DIFFERENTIAL DIAGNOSIS
    // ====================================================================
    buildDDx(dxScores) {

      // meta data for dx (from dx-chest.js)
      const dxMeta = global.CHEST_PAIN_DX.map(dx => {
        return {
          id: dx.id,
          labelEn: dx.labelEn,
          features: dx.keyMissingFeatures || []
        };
      });

      const dxList = UIUtils.buildDDx(dxScores, dxMeta);

      // تقسيم التشخيصات على شكل أجهزة:
      // (النسخة الحالية: قسم واحد "Chest Pain")
      return [
        {
          deviceName: "Chest Pain System",
          diseases: dxList
        }
      ];
    }

  };

  global.UIBinder = Binder;

})(window);