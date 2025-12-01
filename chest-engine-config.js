// =======================================================
// chest-engine-config.js
// Global Configuration for Chest Engine
// =======================================================

"use strict";

(function (global) {

  const EngineConfig = {

    // هل نسمح بطباعة معلومات debug في console؟
    debug: false,

    // هل نسمح باستخدام خطوات غير مرئية؟ (لا)
    allowHiddenSteps: false,

    // هل نسمح بإعادة الإجابة بعد الانتهاء؟ (نتركها false)
    allowEditingAfterFinish: false,

    // هل نسمح للخطوات أن تُعاد كتابتها من الواجهة؟ (لا)
    freezeSteps: true,

    // احتياطي لمستقبل البرنامج (أجهزة أخرى)
    defaultDepartment: "internal",
    defaultSystem: "cvs"
  };

  global.ChestEngineConfig = EngineConfig;

})(window);