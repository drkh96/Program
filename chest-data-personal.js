// ========================================
// chest-data-personal.js (CLEAN VERSION)
// ========================================

"use strict";

// ----------------------------------------
// PERSONAL SECTION DATA
// ----------------------------------------

window.CHEST_SECTIONS_PERSONAL = [

  {
    id: "personal",
    label: "البيانات الشخصية",
    labelEn: "Personal Data",

    steps: [

      // ===== 1. Name =====
      {
        id: "name",
        sectionId: "personal",
        sectionLabel: "Personal Data",

        question: "ما اسم المريض؟",
        questionEn: "What is the patient's name?",

        type: "text",
        required: false,
        placeholder: "اكتب اسم المريض هنا"
      },

      // ===== 2. Age =====
      {
        id: "age",
        sectionId: "personal",
        sectionLabel: "Personal Data",

        question: "ما عمر المريض؟",
        questionEn: "What is the patient's age?",

        type: "number",
        required: false,
        placeholder: "اكتب عمر المريض"
      },

      // ===== 3. Gender =====
      {
        id: "gender",
        sectionId: "personal",
        sectionLabel: "Personal Data",

        question: "ما جنس المريض؟",
        questionEn: "What is the patient's gender?",

        type: "single",
        required: false,

        options: {
          male:   { label: "ذكر" },
          female: { label: "أنثى" }
        }
      }

    ]
  }

];