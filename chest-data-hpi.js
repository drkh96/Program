// ========================================
// chest-data-hPI.js (NO FILTERS VERSION)
// ========================================

"use strict";

function dx(arr){ return Array.isArray(arr) ? arr : []; }
function r(text, diseases){ return { text, diseases: Array.isArray(diseases)? diseases : [] }; }

window.CHEST_SECTIONS_HPI = [
  {
    id: "hpi",
    label: "History of Present Illness",
    steps: [

      // ========= ONSET =========
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
            label: "بداية فجائية خلال دقيقة",
            dxAdd: dx(["MI","PEMajor","Dissection"])
          },
          sudden10min: {
            label: "بداية خلال 10 دقائق",
            dxAdd: dx(["MI","PEMajor"])
          },
          gradualHours: {
            label: "بداية تدريجية لساعات",
            dxAdd: dx(["Pericarditis","Pneumonia"])
          },
          gradualDays: {
            label: "بداية لأيام",
            dxAdd: dx(["Pneumonia","GERD"])
          }
        }
      },

      // ========= SITE =========
      {
        id: "site",
        sectionId: "cardiac",
        sectionLabel: "HPI",
        question: "أين يتركّز الألم؟",
        type: "single",
        required: true,

        options: {
          retrosternal: { label: "خلف القص", dxAdd: dx(["IHD","MI","GERD"]) },
          leftChest:    { label: "الجانب الأيسر", dxAdd: dx(["IHD","MI"]) },
          pleuriticSide:{ label: "جانبي مع النفس", dxAdd: dx(["Pneumonia","PEMajor"]) },
          pointTender:  { label: "موضعي بالإصبع", dxAdd: dx(["Musculoskeletal"]) }
        }
      },

      // ========= CHARACTER =========
      {
        id: "character",
        sectionId: "cardiac",
        question: "طبيعة الألم؟",
        type: "single",
        required: true,

        options: {
          pressure:     { label: "ضاغط", dxAdd: dx(["IHD","MI"]) },
          sharpPleuritic:{ label:"طاعن مع النفس", dxAdd:dx(["Pneumonia","PEMajor"]) },
          burning:      { label: "حرقة", dxAdd: dx(["GERD"]) },
          tearingBack:  { label: "ماحق للظهر", dxAdd: dx(["Dissection"]) }
        }
      },

      // ========= RADIATION =========
      {
        id: "radiation",
        sectionId: "cardiac",
        question: "هل ينتشر الألم؟",
        type: "single",
        required: true,

        options: {
          leftArmJaw: { label: "ذراع أيسر/فك", dxAdd: dx(["MI","IHD"]) },
          backBetweenScapulae:{ label:"بين لوحي الكتف", dxAdd:dx(["Dissection","PEMajor"]) },
          none: { label: "لا يوجد" }
        }
      },

      // ========= AGGRAVATING =========
      {
        id: "aggravating",
        sectionId: "cardiac",
        question: "ما يزيد الألم؟",
        type: "single",
        required: true,

        options: {
          exertion:{ label:"الجهد", dxAdd:dx(["IHD","StableAngina"]) },
          emotionalStress:{ label:"التوتر", dxAdd:dx(["IHD","Anxiety"]) },
          deepInspiration:{ label:"الشهيق", dxAdd:dx(["PEMajor","Pneumonia"]) },
          movementPalpation:{ label:"الحركة/الضغط", dxAdd:dx(["Musculoskeletal"]) },
          postMeal:{ label:"بعد الأكل", dxAdd:dx(["GERD"]) }
        }
      },

      // ========= RELIEF =========
      {
        id: "relief",
        sectionId: "cardiac",
        question: "ما يخفف الألم؟",
        type: "single",
        required: true,

        options: {
          rest:{ label:"الراحة", dxAdd:dx(["StableAngina"]) },
          gtn:{ label:"GTN", dxAdd:dx(["IHD","StableAngina"]) },
          leaningForward:{ label:"الانحناء للأمام", dxAdd:dx(["Pericarditis"]) },
          antacids:{ label:"مضادات الحموضة", dxAdd:dx(["GERD"]) }
        }
      },

      // ========= EPISODE DURATION =========
      {
        id: "episodeDuration",
        sectionId: "cardiac",
        question: "مدة النوبة:",
        type: "single",
        required: true,

        options: {
          seconds:{ label:"ثوانٍ", dxAdd:dx(["Musculoskeletal","Anxiety"]) },
          fiveTo20:{ label:"5-20 دقيقة", dxAdd:dx(["StableAngina"]) },
          more20:{ label:">20 دقيقة", dxAdd:dx(["MI"]) }
        }
      },

      // ========= ASSOCIATED =========
      {
        id: "associated",
        sectionId: "cardiac",
        question: "أعراض مصاحبة؟",
        type: "multi",
        required: true,

        options: {
          dyspnea:{ label:"ضيق نفس", dxAdd:dx(["MI","HF","PEMajor"]) },
          diaphoresis:{ label:"تعرق", dxAdd:dx(["MI"]) },
          nausea:{ label:"غثيان", dxAdd:dx(["MI","GERD"]) },
          syncope:{ label:"إغماء", dxAdd:dx(["Arrhythmia","PEMajor"]) }
        }
      }
    ]
  }
];