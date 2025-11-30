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
        question: "ما اسم المريض؟",
        questionEn: "What is the patient's name?",
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
        question: "كم عمر المريض؟",
        questionEn: "How old is the patient?",
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
        type: "single",
        required: true,
        visibleWhen: {
          all: [
            { stepId: "department", equals: "internal" },
            { stepId: "system",     equals: "cvs" }
          ]
        },
        options: {
          chestPain: {
            label:   "ألم في الصدر (Chest pain)",
            labelEn: "Chest pain",
            dxAdd: dx(["IHD", "MI", "ACS", "PEMajor", "Pericarditis", "Musculoskeletal", "GERD"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Chest pain as the chief complaint significantly increases the likelihood of ischemic heart disease, acute coronary syndromes, pulmonary embolism, pericarditis, musculoskeletal chest wall pain, and sometimes reflux disease.",
                ["IHD", "MI", "ACS", "PEMajor", "Pericarditis", "Musculoskeletal", "GERD"]
              )
            ]
          },
          palpitations: {
            label:   "خفقان (Palpitations)",
            labelEn: "Palpitations",
            dxAdd: dx(["Arrhythmia", "Anxiety"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Palpitations as the main complaint point towards clinically significant arrhythmias, but can also be seen in anxiety and panic attacks.",
                ["Arrhythmia", "Anxiety"]
              )
            ]
          }
        }
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
        // Used by the engine to categorize acute vs chronic (يمكن تطويرها لاحقاً)
      }
    ]
  }
];
