// ======================================================
// chest-engine-core.js
// Main Controller for Chest Engine
// ======================================================

"use strict";

(function (global) {

  //------------------------------------------------------
  // اختصار للوصول إلى State بسهولة
  //------------------------------------------------------
  const State = global.ChestEngineState;

  //------------------------------------------------------
  // ChestEngine Object
  //------------------------------------------------------
  const ChestEngine = {

    // ===================================================
    // (1) INIT — تحميل البيانات + بناء الخطوات
    // ===================================================
    init(data) {

      if (!data || !data.sections) {
        console.error("ChestEngine.init: No data provided");
        return;
      }

      // حفظ الداتا الخام
      this.data = data;

      // بناء قائمة الخطوات من الأقسام
      this.buildStepsFromSections(data.sections);

      // ضبط نقطة الانطلاق
      State.currentStepIndex = 0;
      State.dataLoaded = true;
    },

    // ===================================================
    // (2) تحويل الأقسام إلى خطوات موحدة
    // ===================================================
    buildStepsFromSections(sections) {
      const steps = [];

      sections.forEach(section => {
        if (!section.steps) return;

        section.steps.forEach(step => {
          steps.push(step);
        });
      });

      // حفظها داخل state
      State.steps = steps;
    },

    // ===================================================
    // (3) الحصول على جميع الخطوات
    // ===================================================
    get steps() {
      return State.steps || [];
    },

    // ===================================================
    // (4) الخطوة الحالية
    // ===================================================
    getCurrentStep() {
      return this.steps[State.currentStepIndex] || null;
    },

    // ===================================================
    // (5) الذهاب للسؤال التالي (UI تستخدمه)
    // ===================================================
    goNext() {
      if (State.currentStepIndex < this.steps.length - 1) {
        State.currentStepIndex++;
      }
    },

    // ===================================================
    // (6) الرجوع للسؤال السابق
    // ===================================================
    goBack() {
      if (State.currentStepIndex > 0) {
        State.currentStepIndex--;
      }
    },

    // ===================================================
    // (7) هل السؤال مرئي؟ (Visibility Rules)
    // ===================================================
    isStepVisible(step) {
      // إذا يوجد قواعد عامة:
      if (global.GlobalVisibilityRules &&
          global.GlobalVisibilityRules.chestPainVisible) {

        const ok = global.GlobalVisibilityRules.chestPainVisible(
          step,
          State.answers
        );
        if (!ok) return false;
      }

      return true;
    },

    // ===================================================
    // (8) تخزين إجابة جديدة
    // ===================================================
    saveAnswer(stepId, value) {
      State.answers[stepId] = value;
    },

    // ===================================================
    // (9) إرجاع جميع الإجابات
    // ===================================================
    getAllAnswers() {
      return State.answers;
    },

    // ===================================================
    // (10) تسجيل اللغة لبطاقة الأسئلة فقط
    // ===================================================
    setLanguage(lang) {
      State.questionLanguage = lang;
    },

    getLanguage() {
      return State.questionLanguage;
    }

  };

  //------------------------------------------------------
  // تعريض المحرك للعالم
  //------------------------------------------------------
  global.ChestEngine = ChestEngine;

})(window);