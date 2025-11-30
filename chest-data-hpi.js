// ========================================
// chest-data-hpi.js (CLEAN VERSION)
// ========================================

"use strict";

// --------------------------------------------------
// HPI DATA – CURRENTLY FOR CARDIAC ONLY
// --------------------------------------------------

window.CHEST_SECTIONS_HPI = [

  {
    id: "cardiac",
    label: "HPI – Cardiac",
    labelEn: "HPI – Cardiac",

    steps: [

      // ========== Onset ==========
      {
        id: "onset",
        sectionId: "cardiac",
        sectionLabel: "HPI",

        question: "كيف كانت بداية الألم؟",
        questionEn: "How did the pain start?",

        type: "single",
        required: true,

        options: {
          sudden1min: {
            label: "بداية فجائية خلال أقل من دقيقة، ألم شديد جداً",
            labelEn: "Sudden onset (<1 min), very severe",
            dxAdd: dx(["MI", "PEMajor", "Dissection"])
          },

          gradual: {
            label: "بداية تدريجية",
            labelEn: "Gradual onset",
            dxAdd: dx(["StableAngina", "GERD"])
          }
        }
      },

      // ========== Location ==========
      {
        id: "location",
        sectionId: "cardiac",
        sectionLabel: "HPI",

        question: "أين يقع الألم؟",
        questionEn: "Where is the pain located?",

        type: "single",
        required: true,

        options: {
          central: {
            label: "منتصف الصدر",
            labelEn: "Central chest",
            dxAdd: dx(["MI", "UnstableAngina"])
          },

          leftSide: {
            label: "الجهة اليسرى",
            labelEn: "Left side",
            dxAdd: dx(["Pericarditis"])
          },

          epigastric: {
            label: "المنطقة الشرسوفية (فوق المعدة)",
            labelEn: "Epigastric",
            dxAdd: dx(["GERD", "Pancreatitis"])
          }
        }
      },

      // ========== Radiation ==========
      {
        id: "radiation",
        sectionId: "cardiac",
        sectionLabel: "HPI",

        question: "هل يمتد الألم؟",
        questionEn: "Does the pain radiate?",

        type: "single",

        options: {
          leftArm: {
            label: "يمتد إلى الذراع اليسرى",
            labelEn: "To left arm",
            dxAdd: dx(["MI"])
          },
          jaw: {
            label: "يمتد إلى الفك",
            labelEn: "To jaw",
            dxAdd: dx(["MI"])
          },
          back: {
            label: "يمتد إلى الظهر",
            labelEn: "To back",
            dxAdd: dx(["Dissection"])
          },
          none: {
            label: "لا",
            labelEn: "None",
            dxAdd: dx([])
          }
        }
      }

    ]
  }

];