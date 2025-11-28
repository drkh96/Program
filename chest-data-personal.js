// ========================================
// chest-data-personal.js
// Personal data + chief complaint
// Bilingual (Arabic UI + English mirror labels)
// Reasoning text in EN only
// ========================================

"use strict";

window.CHEST_SECTIONS_PERSONAL = [
  {
    id: "personal",
    label: "البيانات الشخصية",
    labelEn: "Personal Data",
    steps: [
      {
        id: "name",
        sectionId: "personal",
        sectionLabel: "Personal Data",
        sectionLabelEn: "Personal Data",
        question: "ما اسم المريض؟ (لا يؤثر على التشخيص مباشرة)",
        questionEn: "What is the patient's name? (no direct diagnostic impact)",
        type: "text",
        required: false,
        placeholder: "اكتب اسم المريض هنا",
        placeholderEn: "Type the patient's name"
      },
      {
        id: "ageText",
        sectionId: "personal",
        sectionLabel: "Personal Data",
        sectionLabelEn: "Personal Data",
        question: "كم عمر المريض؟ (بالسنوات، نصّياً)",
        questionEn: "How old is the patient? (in years, free text)",
        type: "text",
        required: true,
        placeholder: "مثال: 55 سنة",
        placeholderEn: "e.g. 55 years"
        // ageText is parsed by the engine into age categories
      },
      {
        id: "sex",
        sectionId: "personal",
        sectionLabel: "Personal Data",
        sectionLabelEn: "Personal Data",
        question: "ما جنس المريض؟",
        questionEn: "What is the patient's sex?",
        type: "single",
        required: true,
        options: {
          male: {
            label: "ذكر",
            labelEn: "Male",
            dxAdd: ["IHD", "MI", "ACS"],
            dxRemove: [],
            reasoning: [
              {
                text: "Being a middle-aged male increases baseline risk of coronary artery disease.",
                diseases: ["IHD", "MI", "ACS"]
              }
            ]
          },
          female: {
            label: "أنثى",
            labelEn: "Female",
            dxAdd: [],
            dxRemove: [],
            reasoning: [
              {
                text: "Premenopausal females have a statistically lower risk of coronary artery disease than males of similar age.",
                diseases: ["IHD"]
              }
            ]
          }
        }
      }
    ]
  },

  {
    id: "cc",
    label: "الشكوى الرئيسية",
    labelEn: "Chief Complaint",
    steps: [
      {
        id: "mainSymptom",
        sectionId: "cc",
        sectionLabel: "Chief Complaint",
        sectionLabelEn: "Chief Complaint",
        question: "ما هي الشكوى الرئيسية؟",
        questionEn: "What is the main presenting complaint?",
        type: "text",
        required: true,
        placeholder: "مثال: ألم في الصدر عند الجهد",
        placeholderEn: "e.g. chest pain on exertion"
        // Used by the engine to infer type of presentation (chest pain / dyspnea / syncope…)
      },
      {
        id: "ccDuration",
        sectionId: "cc",
        sectionLabel: "Chief Complaint",
        sectionLabelEn: "Chief Complaint",
        question: "منذ متى بدأت الشكوى الرئيسية؟",
        questionEn: "For how long has this main complaint been present?",
        type: "text",
        required: true,
        placeholder: "مثال: منذ 3 ساعات / منذ يومين",
        placeholderEn: "e.g. for 3 hours / for 2 days"
        // Used by the engine to categorize acute vs chronic
      }
    ]
  }
];