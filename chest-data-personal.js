// ========================================
// chest-data-personal.js (FIXED & CLEAN)
// ========================================

"use strict";

// --- Prevent crashes from undefined helpers ---
function dx(arr) {
  return Array.isArray(arr) ? arr : [];
}

function r(text, diseases) {
  return {
    text: text || "",
    diseases: Array.isArray(diseases) ? diseases : []
  };
}

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
        question: "كم عمر المريض؟",
        questionEn: "How old is the patient?",
        type: "text",
        required: true,
        placeholder: "مثال: 55 سنة",
        placeholderEn: "e.g. 55 years"
      },
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
            dxAdd: ["IHD", "MI", "ACS"],
            reasoning: [
              r(
                "Being a middle-aged male increases baseline risk of coronary artery disease.",
                ["IHD", "MI", "ACS"]
              )
            ]
          },
          female: {
            label: "أنثى",
            labelEn: "Female",
            dxAdd: [],
            reasoning: [
              r(
                "Premenopausal females have lower baseline coronary artery disease risk.",
                ["IHD"]
              )
            ]
          }
        }
      }
    ]
  },

  // ============================================
  // FIXED — Chief Complaint now uses correct sectionId
  // ============================================
  {
    id: "cc",
    label: "الشكوى الرئيسية",
    labelEn: "Chief Complaint",
    steps: [
      {
        id: "mainSymptom",
        sectionId: "cardiac",      // FIXED
        sectionLabel: "Chief Complaint",
        question: "ما هي الشكوى الرئيسية؟",
        questionEn: "What is the main presenting complaint?",
        type: "single",
        required: true,

        options: {
          chestPain: {
            label: "ألم في الصدر",
            labelEn: "Chest pain",
            dxAdd: dx(["IHD", "MI", "ACS", "PEMajor", "Pericarditis", "Musculoskeletal", "GERD"]),
            reasoning: [
              r(
                "Chest pain increases probability of ischemic, thromboembolic, inflammatory, or musculoskeletal causes.",
                ["IHD", "MI", "ACS", "PEMajor", "Pericarditis", "Musculoskeletal", "GERD"]
              )
            ]
          },

          palpitations: {
            label: "خفقان",
            labelEn: "Palpitations",
            dxAdd: dx(["Arrhythmia", "Anxiety"]),
            reasoning: [
              r(
                "Palpitations suggest arrhythmias or anxiety-related causes.",
                ["Arrhythmia", "Anxiety"]
              )
            ]
          }
        }
      },

      {
        id: "ccDuration",
        sectionId: "cardiac",    // FIXED
        sectionLabel: "Chief Complaint",
        question: "منذ متى بدأت الشكوى؟",
        questionEn: "For how long has this complaint been present?",
        type: "text",
        required: true,
        placeholder: "مثال: منذ 3 ساعات / يومين",
        placeholderEn: "e.g. for 3 hours / 2 days"
      }
    ]
  }
];