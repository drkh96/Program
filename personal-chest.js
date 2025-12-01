// ========================================
// personal-chest.js
// بيانات المريض — نسخة ألم الصدر فقط
// ========================================

"use strict";

(function (global) {

  global.CHEST_PAIN_PERSONAL = [

    {
      id: "personal_chest",
      label: "Personal Data",
      group: "chestPain",
      steps: [

        // ====================================
        // 1) اسم المريض — لا يؤثر على التشخيص
        // ====================================
        {
          id: "patient_name",
          group: "chestPain",
          question: "ما اسم المريض؟",
          questionEn: "What is the patient's name?",
          type: "text",
          required: false,
          AffectOnDx: false
        },

        // ====================================
        // 2) العمر — يؤثر على التشخيص
        // ====================================
        {
          id: "patient_age",
          group: "chestPain",
          question: "كم عمر المريض؟",
          questionEn: "How old is the patient?",
          type: "text",
          required: true,
          AffectOnDx: true
        },

        // ====================================
        // 3) الجنس — ذكر/أنثى
        // ====================================
        {
          id: "patient_gender",
          group: "chestPain",
          question: "ما جنس المريض؟",
          questionEn: "What is the patient's gender?",
          type: "single",
          required: true,
          AffectOnDx: true,

          options: {
            male: {
              label: "ذكر",
              labelEn: "Male"
            },
            female: {
              label: "أنثى",
              labelEn: "Female"
            }
          }
        },

        // ====================================
        // 4) المهنة
        // ====================================
        {
          id: "patient_occupation",
          group: "chestPain",
          question: "ما مهنة المريض؟",
          questionEn: "What is the patient's occupation?",
          type: "text",
          required: false,
          AffectOnDx: true
        },

        // ====================================
        // 5) الحالة الاجتماعية
        // ====================================
        {
          id: "patient_marital",
          group: "chestPain",
          question: "ما الحالة الاجتماعية للمريض؟",
          questionEn: "What is the patient's marital status?",
          type: "single",
          required: false,
          AffectOnDx: true,

          options: {
            single: {
              label: "أعزب",
              labelEn: "Single"
            },
            married: {
              label: "متزوج",
              labelEn: "Married"
            },
            widowed: {
              label: "أرمل",
              labelEn: "Widowed"
            }
          }
        },

        // ====================================
        // 6) فصيلة الدم
        // ====================================
        {
          id: "patient_blood",
          group: "chestPain",
          question: "ما فصيلة دم المريض؟",
          questionEn: "What is the patient's blood group?",
          type: "text",
          required: false,
          AffectOnDx: false
        },

        // ====================================
        // 7) عنوان السكن
        // ====================================
        {
          id: "patient_address",
          group: "chestPain",
          question: "أين يسكن المريض؟",
          questionEn: "What is the patient's address?",
          type: "text",
          required: false,
          AffectOnDx: true
        },

        // ====================================
        // 8) أقرب الأقارب
        // ====================================
        {
          id: "next_of_kin",
          group: "chestPain",
          question: "من هو أقرب الأقارب؟ (اسم + قرابة)",
          questionEn: "Who is the next of kin? (Name + Relation)",
          type: "text",
          required: false,
          AffectOnDx: false
        },

        // ====================================
        // 9) تاريخ الدخول
        // ====================================
        {
          id: "admission_date",
          group: "chestPain",
          question: "ما تاريخ دخول المريض إلى المستشفى؟",
          questionEn: "What is the patient's admission date?",
          type: "text",
          required: false,
          AffectOnDx: false
        },

        // ====================================
        // 10) تاريخ أخذ السيرة
        // ====================================
        {
          id: "history_date",
          group: "chestPain",
          question: "ما تاريخ أخذ السيرة المرضية؟",
          questionEn: "What is the history taking date?",
          type: "text",
          required: false,
          AffectOnDx: false
        }

      ] // END steps
    } // END section

  ]; // END CHEST_PAIN_PERSONAL

})(window);