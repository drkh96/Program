// ========================================
// chest-data-peds.js (CLEAN VERSION)
// Pediatric History – Basic structure
// ========================================

"use strict";

window.CHEST_SECTIONS_PEDS = [

  {
    id: "peds",
    label: "Pediatric History",
    labelEn: "Pediatric History",

    // يظهر فقط إذا اختار المستخدم قسم الأطفال
    visibleWhen: {
      stepId: "department",
      equals: "peds"
    },

    steps: [

      // ========== 1) Child Case? ==========
      {
        id: "pedsIsChildCase",
        sectionId: "peds",
        sectionLabel: "Pediatrics",

        question: "هل الحالة لطفل؟",
        questionEn: "Is this a child case?",

        type: "single",
        required: true,

        options: {
          yes: { label: "نعم، طفل", labelEn: "Yes, child patient" },
          no:  { label: "لا، بالغ", labelEn: "No, adult patient" }
        }
      },

      // ========== 2) Informant ==========
      {
        id: "pedsInformant",
        sectionId: "peds",
        sectionLabel: "Pediatrics",

        question: "من يقدّم المعلومات؟",
        questionEn: "Who is giving the history?",

        type: "single",
        required: false,

        visibleWhen: {
          stepId: "pedsIsChildCase",
          equals: "yes"
        },

        options: {
          mother:  { label: "الأم",       labelEn: "Mother" },
          father:  { label: "الأب",       labelEn: "Father" },
          caregiver:{ label:"مقدّم رعاية", labelEn: "Caregiver" }
        }
      },

      // ========== 3) Feeding ==========
      {
        id: "pedsFeeding",
        sectionId: "peds",
        sectionLabel: "Pediatrics",

        question: "كيف تغذية الطفل؟",
        questionEn: "How is the child's feeding?",

        type: "single",
        required: false,

        visibleWhen: {
          stepId: "pedsIsChildCase",
          equals: "yes"
        },

        options: {
          good:    { label: "جيدة", labelEn: "Good" },
          poor:    { label: "ضعيفة", labelEn: "Poor" },
          formula: { label: "حليب صناعي", labelEn: "Formula feeding" },
          breast:  { label: "رضاعة طبيعية", labelEn: "Breastfeeding" }
        }
      }

    ]
  }

];