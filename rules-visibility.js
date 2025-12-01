// ========================================
// rules-visibility.js
// قواعد الظهور العامة — نسخة ألم الصدر فقط
// ========================================

"use strict";

(function (global) {

  // المرجع الرئيسي
  const engine = global.ChestEngine;

  // دالة أساسية يتحكم بها كل البرنامج
  global.GlobalVisibilityRules = {

    // ----------------------------------------------------
    // 1) إظهار أقسام ألم الصدر فقط عندما يكون المستخدم اختار:
    //    - Internal Medicine
    //    - Cardiovascular
    //    - Chest Pain
    // ----------------------------------------------------
    chestPainVisible(step, answers) {

      // إذا لم يختر المستخدم باطنية → إخفاء ألم الصدر
      if (answers.department !== "internal") return false;

      // إذا لم يختر جهاز القلب → إخفاء ألم الصدر
      if (answers.system !== "cvs") return false;

      // إذا لم يختر ألم الصدر → إخفاء ألم الصدر
      if (answers.mainSymptom !== "chestPain") return false;

      // إذا وصلنا إلى هنا → نسمح بظهور قسم ألم الصدر
      if (step.group === "chestPain") return true;

      // إذا الخطوة لا تنتمي لمجموعة ألم الصدر
      return true;
    },

  };


  // ======================================================
  // دمج القاعدة داخل دالة isStepVisible الخاصة بالمحرّك
  // ======================================================
  const oldFn = engine.isStepVisible.bind(engine);

  engine.isStepVisible = function (step) {

    const answers = engine.state.answers || {};

    // قاعدة ألم الصدر
    if (!GlobalVisibilityRules.chestPainVisible(step, answers)) return false;

    // القاعدة الأصلية
    return oldFn(step);
  };

})(window);