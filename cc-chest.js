// ========================================
// cc-chest.js
// الشكوى الرئيسية — نسخة ألم الصدر فقط
// ========================================

"use strict";

(function (global) {

  global.CHEST_PAIN_CC = [

    {
      id: "cc_chest",
      label: "Chief Complaint",
      group: "chestPain",

      steps: [

        // ====================================
        // 1) الشكوى الرئيسية
        // ====================================
        {
          id: "mainSymptom",
          group: "chestPain",
          question: "ما هي الشكوى الرئيسية للمريض؟",
          questionEn: "What is the patient's main complaint?",
          type: "single",
          required: true,
          AffectOnDx: true,

          options: {
            chestPain: {
              label: "ألم في الصدر",
              labelEn: "Chest pain"
            }
          }
        },

        // ====================================
        // 2) مدة الشكوى
        // ====================================
        {
          id: "cc_duration",
          group: "chestPain",
          question: "منذ متى يعاني المريض من هذه الشكوى؟",
          questionEn: "For how long has the patient had this complaint?",
          type: "text",
          required: true,
          AffectOnDx: true
        }

      ] // END steps
    } // END section

  ]; // END CHEST_PAIN_CC

})(window);