// ========================================
// chest-data-hPI.js (FIXED, CLEAN, WORKING)
// ========================================

"use strict";

// Ensure dx() and r() exist (needed globally)
function dx(arr) {
  return Array.isArray(arr) ? arr : [];
}

function r(text, diseases) {
  return { text, diseases: Array.isArray(diseases) ? diseases : [] };
}

window.CHEST_SECTIONS_HPI = [
  {
    id: "hpi",
    label: "History of Present Illness",
    steps: [

      // =========================
      // ONSET
      // =========================
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
            labelEn: "Sudden onset <1 min, very severe",
            dxAdd: dx(["MI", "PEMajor", "Dissection"]),
            dxRemove: dx(["GERD", "Musculoskeletal"]),
            reasoning: [
              r("Very abrupt severe chest pain → MI, PE or aortic dissection.", ["MI", "PEMajor", "Dissection"])
            ]
          },
          sudden10min: {
            label: "بداية سريعة خلال 10 دقائق",
            labelEn: "Rapid onset within 10 minutes",
            dxAdd: dx(["MI", "UnstableAngina", "PEMajor"]),
            dxRemove: dx(["GERD"]),
            reasoning: [
              r("Onset over minutes → ACS or PE.", ["MI", "UnstableAngina", "PEMajor"])
            ]
          },
          gradualHours: {
            label: "بداية تدريجية لساعات",
            labelEn: "Gradual over hours",
            dxAdd: dx(["Pericarditis", "Pneumonia", "Musculoskeletal"]),
            dxRemove: dx(["MI", "Dissection"]),
            reasoning: [
              r("Gradual hours → inflammatory causes.", ["Pericarditis", "Pneumonia", "Musculoskeletal"])
            ]
          },
          gradualDays: {
            label: "بداية تدريجية لأيام",
            labelEn: "Gradual over days",
            dxAdd: dx(["Pneumonia", "GERD", "Musculoskeletal"]),
            dxRemove: dx(["MI", "PEMajor", "Dissection"]),
            reasoning: [
              r("Days → pneumonia, GERD or musculoskeletal.", ["Pneumonia", "GERD", "Musculoskeletal"])
            ]
          }
        }
      },

      // =========================
      // SITE
      // =========================
      {
        id: "site",
        sectionId: "cardiac",
        sectionLabel: "HPI",
        question: "أين يتركّز الألم؟",
        questionEn: "Where is the pain located?",
        type: "single",
        required: true,

        options: {
          retrosternal: {
            label: "خلف القص",
            labelEn: "Retrosternal",
            dxAdd: dx(["IHD", "MI", "ACS", "GERD"]),
            reasoning: [
              r("Retrosternal → ischemic or reflux.", ["IHD", "MI", "ACS", "GERD"])
            ]
          },
          leftChest: {
            label: "النصف الأيسر",
            labelEn: "Left chest",
            dxAdd: dx(["IHD", "MI", "Musculoskeletal"]),
            reasoning: [
              r("Left chest → cardiac or musculoskeletal.", ["IHD", "Musculoskeletal"])
            ]
          },
          pleuriticSide: {
            label: "جانبي مع التنفس",
            labelEn: "Lateral pleuritic",
            dxAdd: dx(["Pleuritis", "Pneumonia", "PEMajor"]),
            dxRemove: dx(["IHD", "MI"]),
            reasoning: [
              r("Pleuritic → pleural/lung disease.", ["Pleuritis", "Pneumonia", "PEMajor"])
            ]
          },
          pointTender: {
            label: "موضع صغير بالإصبع",
            labelEn: "Point tenderness",
            dxAdd: dx(["Musculoskeletal"]),
            dxRemove: dx(["MI", "PEMajor"]),
            reasoning: [
              r("Fingertip pain → musculoskeletal.", ["Musculoskeletal"])
            ]
          }
        }
      },

      // =========================
      // CHARACTER
      // =========================
      {
        id: "character",
        sectionId: "cardiac",
        question: "طبيعة الألم؟",
        questionEn: "Character of pain?",
        type: "single",
        required: true,

        options: {
          pressure: {
            label: "ضاغط",
            labelEn: "Pressure",
            dxAdd: dx(["IHD", "MI", "ACS"]),
            reasoning: [
              r("Pressure pain → ischemic.", ["IHD", "MI", "ACS"])
            ]
          },
          sharpPleuritic: {
            label: "طاعن مع النفس",
            labelEn: "Pleuritic sharp",
            dxAdd: dx(["Pleuritis", "Pneumonia", "PEMajor"]),
            dxRemove: dx(["IHD"]),
            reasoning: [
              r("Pleuritic → lung/pleura.", ["Pleuritis", "Pneumonia", "PEMajor"])
            ]
          },
          burning: {
            label: "حرقة",
            labelEn: "Burning",
            dxAdd: dx(["GERD", "PepticUlcer"]),
            reasoning: [
              r("Burning → GERD/ulcer.", ["GERD", "PepticUlcer"])
            ]
          },
          tearingBack: {
            label: "ماحق للظهر",
            labelEn: "Tearing to back",
            dxAdd: dx(["Dissection"]),
            reasoning: [
              r("Tearing back → dissection!", ["Dissection"])
            ]
          }
        }
      },

      // =========================
      // RADIATION
      // =========================
      {
        id: "radiation",
        sectionId: "cardiac",
        question: "هل ينتشر الألم؟",
        questionEn: "Pain radiation?",
        type: "single",
        required: true,

        options: {
          leftArmJaw: {
            label: "ذراع أيسر/فك",
            labelEn: "Left arm/jaw",
            dxAdd: dx(["MI", "IHD", "ACS"]),
            reasoning: [
              r("Arm/jaw → classic ischemia.", ["MI", "IHD", "ACS"])
            ]
          },
          backBetweenScapulae: {
            label: "بين لوحي الكتف",
            labelEn: "Between scapulae",
            dxAdd: dx(["Dissection", "PEMajor"]),
            reasoning: [
              r("Back radiation → dissection/PE.", ["Dissection", "PEMajor"])
            ]
          },
          none: {
            label: "لا يوجد",
            labelEn: "None",
            dxAdd: dx([]),
            reasoning: [
              r("No radiation is less typical for MI.", ["MI"])
            ]
          }
        }
      },

      // =========================
      // AGGRAVATING
      // =========================
      {
        id: "aggravating",
        sectionId: "cardiac",
        question: "ما يزيد الألم؟",
        questionEn: "What worsens the pain?",
        type: "single",
        required: true,

        options: {
          exertion: {
            label: "الجهد",
            labelEn: "Exertion",
            dxAdd: dx(["IHD", "StableAngina", "ACS"]),
            reasoning: [
              r("Exertional → ischemia.", ["IHD", "StableAngina", "ACS"])
            ]
          },
          emotionalStress: {
            label: "التوتر",
            labelEn: "Stress",
            dxAdd: dx(["IHD", "Anxiety"]),
            reasoning: [
              r("Stress → ischemia or panic.", ["IHD", "Anxiety"])
            ]
          },
          deepInspiration: {
            label: "الشهيق",
            labelEn: "Deep inspiration",
            dxAdd: dx(["Pleuritis", "Pneumonia", "PEMajor"]),
            reasoning: [
              r("Worse on inspiration → pleural.", ["Pleuritis", "Pneumonia", "PEMajor"])
            ]
          },
          movementPalpation: {
            label: "الحركة/الضغط",
            labelEn: "Movement/palpation",
            dxAdd: dx(["Musculoskeletal"]),
            reasoning: [
              r("Movement pain → musculoskeletal.", ["Musculoskeletal"])
            ]
          },
          postMeal: {
            label: "بعد الأكل",
            labelEn: "Post-meal",
            dxAdd: dx(["GERD", "PepticUlcer"]),
            reasoning: [
              r("Meal-related → GERD/ulcer.", ["GERD", "PepticUlcer"])
            ]
          }
        }
      },

      // =========================
      // RELIEF
      // =========================
      {
        id: "relief",
        sectionId: "cardiac",
        question: "ما يخفف الألم؟",
        questionEn: "What relieves the pain?",
        type: "single",
        required: true,

        options: {
          rest: {
            label: "الراحة",
            labelEn: "Rest",
            dxAdd: dx(["StableAngina"]),
            reasoning: [r("Relieved by rest → stable angina.", ["StableAngina"])]
          },
          gtn: {
            label: "GTN",
            labelEn: "GTN",
            dxAdd: dx(["IHD", "StableAngina"]),
            reasoning: [r("GTN response → ischemic.", ["IHD", "StableAngina"])]
          },
          leaningForward: {
            label: "الانحناء للأمام",
            labelEn: "Leaning forward",
            dxAdd: dx(["Pericarditis"]),
            reasoning: [r("Better leaning forward → pericarditis.", ["Pericarditis"])]
          },
          antacids: {
            label: "مضادات الحموضة",
            labelEn: "Antacids",
            dxAdd: dx(["GERD", "PepticUlcer"]),
            reasoning: [r("Relieved by antacids → GERD.", ["GERD", "PepticUlcer"])]
          }
        }
      },

      // =========================
      // EPISODE DURATION
      // =========================
      {
        id: "episodeDuration",
        sectionId: "cardiac",
        question: "مدة النوبة",
        questionEn: "Episode duration?",
        type: "single",
        required: true,

        options: {
          seconds: {
            label: "ثوانٍ",
            labelEn: "Seconds",
            dxAdd: dx(["Musculoskeletal", "Anxiety"]),
            dxRemove: dx(["StableAngina", "MI"]),
            reasoning: [
              r("Seconds → not ischemic.", ["Musculoskeletal", "Anxiety"])
            ]
          },
          fiveTo20: {
            label: "5–20 دقيقة",
            labelEn: "5–20 min",
            dxAdd: dx(["StableAngina"]),
            reasoning: [
              r("5–20 min → stable angina.", ["StableAngina"])
            ]
          },
          more20: {
            label: ">20 دقيقة",
            labelEn: ">20 min",
            dxAdd: dx(["MI", "UnstableAngina"]),
            reasoning: [
              r("Long pain → MI.", ["MI", "UnstableAngina"])
            ]
          }
        }
      },

      // =========================
      // ASSOCIATED SYMPTOMS
      // =========================
      {
        id: "associated",
        sectionId: "cardiac",
        question: "أعراض مصاحبة؟",
        questionEn: "Associated symptoms?",
        type: "multi",
        required: true,

        options: {
          dyspnea: {
            label: "ضيق نفس",
            labelEn: "Dyspnea",
            dxAdd: dx(["MI", "HF", "PEMajor", "Pneumonia"]),
            reasoning: [
              r("Dyspnea + chest pain → MI/PE/HF.", ["MI", "HF", "PEMajor", "Pneumonia"])
            ]
          },
          diaphoresis: {
            label: "تعرق",
            labelEn: "Diaphoresis",
            dxAdd: dx(["MI", "ACS"]),
            reasoning: [
              r("Sweating → MI.", ["MI", "ACS"])
            ]
          },
          nausea: {
            label: "غثيان",
            labelEn: "Nausea",
            dxAdd: dx(["MI", "GERD"]),
            reasoning: [
              r("Nausea → MI or GERD.", ["MI", "GERD"])
            ]
          },
          syncope: {
            label: "إغماء",
            labelEn: "Syncope",
            dxAdd: dx(["Arrhythmia", "PEMajor", "Dissection"]),
            reasoning: [
              r("Syncope → Arrhythmia/PE.", ["Arrhythmia", "PEMajor", "Dissection"])
            ]
          }
        }
      }
    ]
  }
];