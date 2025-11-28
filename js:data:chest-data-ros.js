// ========================================
// chest-data-ros.js
// Review of Systems sections
// ========================================

"use strict";

function dxR(ids) {
  return ids || [];
}

function rR(text, diseases) {
  return { text, diseases: diseases || [] };
}

window.CHEST_SECTIONS_ROS = [
  {
    id: "ros",
    label: "Review of Systems",
    steps: [
      {
        id: "rosCVS",
        sectionId: "ros",
        sectionLabel: "ROS",
        question: "أعراض جهاز الدوران (اختر كل ما ينطبق):",
        type: "multi",
        required: false,
        options: {
          palpitations: {
            label: "خفقان",
            dxAdd: dxR(["Arrhythmia"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "الخفقان مع ألم صدري يرفع احتمال وجود اضطراب نظم.",
                ["Arrhythmia"]
              )
            ]
          },
          orthopneaPND: {
            label: "Orthopnea / PND / تورّم القدمين",
            dxAdd: dxR(["HF"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "ضيق النفس الاضطجاعي أو نوبات PND مع وذمة طرفين يدعم تشخيص فشل القلب.",
                ["HF"]
              )
            ]
          },
          noCVSsymptoms: {
            label: "لا توجد أعراض قلبية إضافية مهمة",
            dxAdd: dxR([]),
            dxRemove: dxR(["HF", "Arrhythmia"]),
            reasoning: [
              rR(
                "غياب الأعراض القلبية الإضافية يقلل من احتمال فشل القلب واضطرابات النظم الواضحة.",
                ["HF", "Arrhythmia"]
              )
            ]
          }
        }
      },
      {
        id: "rosResp",
        sectionId: "ros",
        sectionLabel: "ROS",
        question: "أعراض الجهاز التنفسي (اختر كل ما ينطبق):",
        type: "multi",
        required: false,
        options: {
          chronicCough: {
            label: "كحّة مزمنة",
            dxAdd: dxR(["COPD", "Asthma", "Pneumonia"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "الكحة المزمنة قد تشير إلى مرض رئوي مزمن كـ COPD أو ربو، أو التهاب رئوي مزمن.",
                ["COPD", "Asthma", "Pneumonia"]
              )
            ]
          },
          wheeze: {
            label: "صفير بالصدر (Wheeze)",
            dxAdd: dxR(["Asthma", "COPD"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "الصفير يشير عادة إلى انسداد في الطرق الهوائية كما في الربو أو COPD.",
                ["Asthma", "COPD"]
              )
            ]
          },
          acuteDyspnea: {
            label: "ضيق نفس حاد جديد",
            dxAdd: dxR(["PEMajor", "HF", "Pneumonia"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "ضيق النفس الحاد مع ألم صدري قد يشير إلى PE أو وذمة رئة حادة أو التهاب رئوي حاد.",
                ["PEMajor", "HF", "Pneumonia"]
              )
            ]
          },
          noRespsx: {
            label: "لا توجد أعراض تنفسية إضافية مهمة",
            dxAdd: dxR([]),
            dxRemove: dxR(["Pneumonia", "PEMajor"]),
            reasoning: [
              rR(
                "غياب الأعراض التنفسية يقلل من احتمال الالتهاب الرئوي والانصمام الرئوي الواضح إكلينيكياً.",
                ["Pneumonia", "PEMajor"]
              )
            ]
          }
        }
      },
      {
        id: "rosGIT",
        sectionId: "ros",
        sectionLabel: "ROS",
        question: "أعراض الجهاز الهضمي (اختر كل ما ينطبق):",
        type: "multi",
        required: false,
        options: {
          heartburn: {
            label: "حُرقة خلف القص / ارتجاع حمضي",
            dxAdd: dxR(["GERD"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "حُرقة خلف القص مع ارتجاع حمضي توحي بقوة بارتجاع معدي-مريئي.",
                ["GERD"]
              )
            ]
          },
          epigastricPain: {
            label: "ألم شرسوفي مرتبط بالطعام",
            dxAdd: dxR(["PepticUlcer", "GERD"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "ألم شرسوفي مع علاقة بالطعام يدعم قرحة هضمية أو GERD.",
                ["PepticUlcer", "GERD"]
              )
            ]
          },
          noGITsx: {
            label: "لا توجد أعراض هضمية إضافية مهمة",
            dxAdd: dxR([]),
            dxRemove: dxR(["GERD", "PepticUlcer"]),
            reasoning: [
              rR(
                "غياب الأعراض الهضمية يجعل GERD والقرحة أقل احتمالاً كسبب رئيسي.",
                ["GERD", "PepticUlcer"]
              )
            ]
          }
        }
      },
      {
        id: "rosCNS",
        sectionId: "ros",
        sectionLabel: "ROS",
        question: "أعراض عصبية (اختر كل ما ينطبق):",
        type: "multi",
        required: false,
        options: {
          focalDeficit: {
            label: "ضعف أو خدر في أحد الأطراف / أعراض بؤرية",
            dxAdd: dxR(["Stroke"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "الأعراض العصبية البؤرية تدعم تشخيص سكتة دماغية أو TIA.",
                ["Stroke"]
              )
            ]
          },
          noCNSsx: {
            label: "لا توجد أعراض عصبية مهمة",
            dxAdd: dxR([]),
            dxRemove: dxR(["Stroke"]),
            reasoning: [
              rR(
                "غياب الأعراض العصبية يقلل من احتمال السكتة كسبب للألم.",
                ["Stroke"]
              )
            ]
          }
        }
      },
      {
        id: "rosLM",
        sectionId: "ros",
        sectionLabel: "ROS",
        question: "أعراض الأطراف / الجهاز الحركي (اختر كل ما ينطبق):",
        type: "multi",
        required: false,
        options: {
          unilateralSwelling: {
            label: "تورّم أحادي مؤلم في الساق",
            dxAdd: dxR(["DVT", "PEMajor"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "تورّم ساق أحادي مؤلم علامة مهمة لـ DVT وبالتالي PE محتمل.",
                ["DVT", "PEMajor"]
              )
            ]
          },
          bilateralEdema: {
            label: "تورّم ثنائي في الطرفين السفليين",
            dxAdd: dxR(["HF"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "وذمة طرفين سفليين ثنائية تدعم تشخيص فشل القلب أو احتباس السوائل.",
                ["HF"]
              )
            ]
          },
          noLMsx: {
            label: "لا توجد أعراض في الأطراف مهمة",
            dxAdd: dxR([]),
            dxRemove: dxR(["DVT", "HF"]),
            reasoning: [
              rR(
                "غياب علامات DVT أو وذمة يقلل من احتمال PE وفشل القلب.",
                ["DVT", "HF"]
              )
            ]
          }
        }
      },
      {
        id: "rosHema",
        sectionId: "ros",
        sectionLabel: "ROS",
        question: "أعراض عامة / دموية (اختر كل ما ينطبق):",
        type: "multi",
        required: false,
        options: {
          weightLoss: {
            label: "نقص وزن غير مفسّر",
            dxAdd: dxR(["Cancer"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "نقص الوزن غير المفسّر قد يشير إلى خباثة كامنة.",
                ["Cancer"]
              )
            ]
          },
          feverNightSweats: {
            label: "حرارة / تعرّق ليلي",
            dxAdd: dxR(["Infection", "Pneumonia", "TB"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "الحمى والتعرق الليلي يدلان على إنتان أو مرض التهابي مزمن.",
                ["Infection", "Pneumonia", "TB"]
              )
            ]
          },
          easyBruising: {
            label: "كدمات بسهولة / نزف متكرر",
            dxAdd: dxR(["Coagulopathy"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "الكدمات السهلة والنزف قد يشيران إلى اضطراب تخثّر.",
                ["Coagulopathy"]
              )
            ]
          },
          noHemasx: {
            label: "لا توجد أعراض عامة مهمة",
            dxAdd: dxR([]),
            dxRemove: dxR(["Infection", "Cancer"]),
            reasoning: [
              rR(
                "غياب الأعراض العامة يقلل من احتمال خباثة أو إنتان مزمن.",
                ["Infection", "Cancer"]
              )
            ]
          }
        }
      }
    ]
  }
];