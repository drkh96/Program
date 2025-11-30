// ========================================
// chest-data-background.js (CLEAN VERSION)
// PMH, PSH, DH, FH, SH
// ========================================

"use strict";

window.CHEST_SECTIONS_BACKGROUND = [

  // ==============================
  // 1) PAST MEDICAL HISTORY
  // ==============================
  {
    id: "pmh",
    label: "الأمراض السابقة",
    labelEn: "Past Medical History",

    visibleWhen: {
      all: [
        { stepId: "department", equals: "internal" }
      ]
    },

    steps: [

      {
        id: "pmhChronic",
        sectionId: "pmh",
        sectionLabel: "PMH",

        question: "هل لدى المريض أمراض مزمنة؟ (اختر كل ما ينطبق)",
        questionEn: "Does the patient have any chronic medical conditions?",

        type: "multi",

        options: {
          htn: { label: "ارتفاع ضغط الدم", labelEn: "Hypertension", dxAdd: dx(["HF"]) },
          dm:  { label: "السكري",           labelEn: "Diabetes Mellitus", dxAdd: dx(["MI"]) },
          ihd: { label: "مرض الشريان التاجي", labelEn: "Ischemic heart disease", dxAdd: dx(["IHD"]) }
        }
      }

    ]
  },

  // ==============================
  // 2) PAST SURGICAL HISTORY
  // ==============================
  {
    id: "psh",
    label: "العمليات السابقة",
    labelEn: "Past Surgical History",

    visibleWhen: {
      all: [
        { stepId: "department", equals: "internal" }
      ]
    },

    steps: [
      {
        id: "pshOperations",
        sectionId: "psh",
        sectionLabel: "PSH",

        question: "هل أُجريت للمريض أي عمليات جراحية؟",
        questionEn: "Has the patient undergone any surgeries?",

        type: "text",
        required: false,
        placeholder: "اكتب تفاصيل العمليات إن وجدت"
      }
    ]
  },

  // ==============================
  // 3) DRUG HISTORY
  // ==============================
  {
    id: "dh",
    label: "الأدوية",
    labelEn: "Drug History",

    visibleWhen: {
      all: [
        { stepId: "department", equals: "internal" }
      ]
    },

    steps: [
      {
        id: "drugs",
        sectionId: "dh",
        sectionLabel: "DH",

        question: "ما الأدوية التي يستخدمها المريض؟",
        questionEn: "What medications is the patient taking?",

        type: "text",
        placeholder: "اكتب الأدوية الحالية"
      }
    ]
  },

  // ==============================
  // 4) FAMILY HISTORY
  // ==============================
  {
    id: "fh",
    label: "التاريخ العائلي",
    labelEn: "Family History",

    visibleWhen: {
      all: [
        { stepId: "department", equals: "internal" }
      ]
    },

    steps: [
      {
        id: "fhMain",
        sectionId: "fh",
        sectionLabel: "FH",

        question: "هل توجد أمراض وراثية في العائلة؟",
        questionEn: "Are there any hereditary diseases in the family?",

        type: "text",
        placeholder: "اكتب التاريخ العائلي إن وجد"
      }
    ]
  },

  // ==============================
  // 5) SOCIAL HISTORY
  // ==============================
  {
    id: "sh",
    label: "التاريخ الاجتماعي",
    labelEn: "Social History",

    visibleWhen: {
      all: [
        { stepId: "department", equals: "internal" }
      ]
    },

    steps: [
      {
        id: "smoke",
        sectionId: "sh",
        sectionLabel: "SH",

        question: "هل المريض مدخن؟",
        questionEn: "Does the patient smoke?",

        type: "single",

        options: {
          yes: { label: "نعم", labelEn: "Yes", dxAdd: dx(["COPD"]) },
          no:  { label: "لا",   labelEn: "No",  dxAdd: dx([]) }
        }
      }
    ]
  }

];