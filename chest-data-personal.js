// ========================================
// chest-data-personal.js (FIXED & CLEAN)
// ========================================

"use strict";

// dx() و r() موجودات في بقية الملفات
function dx(arr){ return Array.isArray(arr) ? arr : []; }
function r(text,diseases){ return { text, diseases: diseases || [] }; }

window.CHEST_SECTIONS_PERSONAL = [

  // ==========================================================
  // 1) PERSONAL DATA
  // ==========================================================
  {
    id: "personal",
    label: "البيانات الشخصية",
    labelEn: "Personal Data",
    steps: [

      // ❌ لا يؤثر على التشخيص
      {
        id: "name",
        sectionId: "personal",
        sectionLabel: "Personal Data",
        question: "ما اسم المريض؟",
        questionEn: "What is the patient's name?",
        type: "text",
        required: false
      },

      // ✔ يؤثر على التحليل + DDx
      {
        id: "ageText",
        sectionId: "personal",
        sectionLabel: "Personal Data",
        question: "كم عمر المريض؟",
        questionEn: "How old is the patient?",
        type: "text",
        required: true,
        reasoningForNumeric: [
          r("Older age increases likelihood of cardiac ischemia.", ["IHD","MI","ACS"])
        ]
      },

      // ✔ يؤثر على DDx
      {
        id: "sex",
        sectionId: "personal",
        sectionLabel: "Personal Data",
        question: "ما جنس المريض؟",
        questionEn: "What is the patient's sex?",
        type: "single",
        required: true,
        options: {
          male: {
            label: "ذكر",
            labelEn: "Male",
            dxAdd: dx(["IHD","MI","ACS"]),
            reasoning: [
              r("Male sex increases baseline coronary artery disease risk.", ["IHD","MI","ACS"])
            ]
          },
          female: {
            label: "أنثى",
            labelEn: "Female",
            dxAdd: dx([]),
            reasoning: [
              r("Premenopausal females have lower ischemic heart disease risk.", ["IHD"])
            ]
          }
        }
      }
    ]
  },

  // ==========================================================
  // 2) CHIEF COMPLAINT BLOCK
  // ==========================================================
  {
    id: "cc",
    label: "الشكوى الرئيسية",
    labelEn: "Chief Complaint",
    steps: [

      // ✔ يؤثر على DDx
      {
        id: "department",
        sectionId: "cc",
        sectionLabel: "Chief Complaint",
        question: "اختر القسم الرئيسي:",
        questionEn: "Choose the main department:",
        type: "single",
        required: true,
        options: {
          internal: {
            label: "الباطنية",
            labelEn: "Internal Medicine",
            dxAdd: dx(["IHD","MI","ACS","HF"]),
            reasoning: [
              r("Internal medicine cases include common cardiac causes of chest pain.", ["IHD","MI","ACS"])
            ]
          }
        }
      },

      // ✔ يؤثر على DDx
      {
        id: "system",
        sectionId: "cc",
        sectionLabel: "Chief Complaint",
        question: "اختر الجهاز:",
        questionEn: "Choose the system:",
        type: "single",
        required: true,
        options: {
          cvs: {
            label: "جهاز القلب والأوعية",
            labelEn: "Cardiovascular System",
            dxAdd: dx(["IHD","ACS","MI"]),
            reasoning: [
              r("Chest pain in the cardiovascular system suggests potential ischemic causes.", ["IHD","ACS"])
            ]
          }
        }
      },

      // ✔ يؤثر على DDx بقوة
      {
        id: "mainSymptom",
        sectionId: "cc",
        sectionLabel: "Chief Complaint",
        question: "ما هي الشكوى الرئيسية؟",
        questionEn: "What is the main presenting complaint?",
        type: "single",
        required: true,
        options: {
          chestPain: {
            label: "ألم الصدر",
            labelEn: "Chest Pain",
            dxAdd: dx(["IHD","MI","ACS","PEMajor","Pericarditis","Musculoskeletal"]),
            reasoning: [
              r(
                "Chest pain is strongly suggestive of ischemic, pulmonary, or musculoskeletal causes.",
                ["IHD","MI","ACS","PEMajor"]
              )
            ]
          }
        }
      },

      // ✔ يؤثر على DDx + reasoning
      {
        id: "ccDuration",
        sectionId: "cc",
        sectionLabel: "Chief Complaint",
        question: "منذ متى بدأ الألم؟",
        questionEn: "How long has the pain been present?",
        type: "text",
        required: true,
        reasoningForNumeric: [
          r("Short, acute duration suggests ACS or PE.", ["MI","ACS","PEMajor"]),
          r("Chronic pain may indicate musculoskeletal or reflux disease.", ["Musculoskeletal","GERD"])
        ]
      }

    ]
  }

];