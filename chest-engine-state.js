// ======================================================
// chest-engine-state.js
// Central State Storage for the Chest Engine
// ======================================================

"use strict";

(function (global) {

  const EngineState = {

    // ---------------------------------------------------
    // حالة عامة للبرنامج
    // ---------------------------------------------------
    dataLoaded: false,     // هل تم تحميل الداتا؟
    steps: [],             // جميع الخطوات المجمّعة
    currentStepIndex: 0,   // رقم الخطوة الحالية
    answers: {},           // إجابات المستخدم
    dxScores: {},          // نتائج التشخيص التفريقي

    // لغة بطاقة الأسئلة فقط:
    questionLanguage: "ar",  

    // ---------------------------------------------------
    // إعادة تهيئة البرنامج بالكامل
    // ---------------------------------------------------
    reset() {
      this.currentStepIndex = 0;
      this.answers = {};
      this.dxScores = {};
      this.dataLoaded = false;
    }

  };

  global.ChestEngineState = EngineState;

})(window);