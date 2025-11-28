// ========================================
// chest-data-background.js
// PMH, PSH, DH, FH, SH sections
// ========================================

"use strict";

function dxB(ids) {
  return ids || [];
}
function rB(text, diseases) {
  return { text, diseases: diseases || [] };
}

window.CHEST_SECTIONS_BACKGROUND = [
  {
    id: "pmh",
    label: "Past Medical History",
    steps: [
      {
        id: "pmhChronic",
        sectionId: "pmh",
        sectionLabel: "PMH",
        question: "هل لدى المريض أمراض مزمنة؟ (اختر كل ما ينطبق)",
        type: "multi",
        required: false,
        options: {
          dm: {
            label: "داء السكري",
            dxAdd: dxB(["IHD", "MI"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "داء السكري عامل خطورة قوي لتصلب الشرايين ومرض الشريان التاجي.",
                ["IHD", "MI"]
              )
            ]
          },
          htn: {
            label: "ارتفاع ضغط الدم",
            dxAdd: dxB(["IHD", "HF", "Dissection"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "ارتفاع الضغط يزيد احتمال IHD وفشل القلب وتسلخ الأبهر.",
                ["IHD", "HF", "Dissection"]
              )
            ]
          },
          dyslipid: {
            label: "اضطراب شحوم الدم",
            dxAdd: dxB(["IHD"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "اضطراب الشحوم من عوامل الخطورة الكلاسيكية للتصلب العصيدي.",
                ["IHD"]
              )
            ]
          },
          knownIHD: {
            label: "سابق IHD / MI / قسطرة أو دعامة",
            dxAdd: dxB(["IHD", "MI", "ACS"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "وجود احتشاء أو تداخل قلبي سابق يجعل الألم الحالي غالباً قلبياً.",
                ["IHD", "MI", "ACS"]
              )
            ]
          },
          prevDVTPE: {
            label: "DVT / PE سابق",
            dxAdd: dxB(["PEMajor", "DVT"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "الانصمام الرئوي أو DVT السابق يزيد احتمال تكرار الحادثة.",
                ["PEMajor", "DVT"]
              )
            ]
          },
          nonePMH: {
            label: "لا توجد أمراض مزمنة مهمة",
            dxAdd: dxB([]),
            dxRemove: dxB(["IHD", "HF", "PEMajor"]),
            reasoning: [
              rB(
                "غياب الأمراض المزمنة يقلل من عبء عوامل الخطورة القلبية والجلطية.",
                ["IHD", "HF", "PEMajor"]
              )
            ]
          }
        }
      }
    ]
  },

  {
    id: "psh",
    label: "Past Surgical History",
    steps: [
      {
        id: "pshOps",
        sectionId: "psh",
        sectionLabel: "PSH",
        question:
          "هل أجرى المريض عمليات كبرى مؤخراً أو بقي طريح الفراش لفترة طويلة؟",
        type: "multi",
        required: false,
        options: {
          recentMajorSurgery: {
            label: "جراحة كبرى خلال آخر 4 أسابيع",
            dxAdd: dxB(["PEMajor", "DVT"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "الجراحة الكبرى مع قلة الحركة من أهم عوامل الخطورة للـ DVT وPE.",
                ["PEMajor", "DVT"]
              )
            ]
          },
          prolongedImmobilisation: {
            label: "عدم حركة لأكثر من 3 أيام (سرير/جبيرة)",
            dxAdd: dxB(["DVT", "PEMajor"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "عدم الحركة المطوّل يزيد احتمال تشكل خثرات وريدية عميقة.",
                ["DVT", "PEMajor"]
              )
            ]
          },
          noPSH: {
            label: "لا توجد عمليات كبرى أو عدم حركة مهم",
            dxAdd: dxB([]),
            dxRemove: dxB(["DVT", "PEMajor"]),
            reasoning: [
              rB(
                "غياب الجراحة وعدم الحركة يقلل من احتمال PE المرتبط بهما.",
                ["DVT", "PEMajor"]
              )
            ]
          }
        }
      }
    ]
  },

  {
    id: "dh",
    label: "Drug History",
    steps: [
      {
        id: "drugHistory",
        sectionId: "dh",
        sectionLabel: "DH",
        question: "ما الأدوية التي يتناولها المريض بانتظام؟",
        type: "multi",
        required: false,
        options: {
          aspirin: {
            label: "أسبرين / مضادات صفائح",
            dxAdd: dxB([]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "استخدام الأسبرين قد يشير لوجود مرض قلبي إقفاري سابق.",
                ["IHD", "MI"]
              )
            ]
          },
          anticoagulant: {
            label: "مضادات تخثر (Warfarin / DOAC)",
            dxAdd: dxB([]),
            dxRemove: dxB(["PEMajor", "DVT"]),
            reasoning: [
              rB(
                "تناول مضادات التخثر يقلل من احتمال حدوث DVT/PE جديد، لكنه لا ينفيه تماماً.",
                ["PEMajor", "DVT"]
              )
            ]
          },
          ocp: {
            label: "حبوب منع الحمل (OCP)",
            dxAdd: dxB(["DVT", "PEMajor"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "حبوب منع الحمل من عوامل الخطورة المعروفة لتشكّل الخثرات الوريدية.",
                ["DVT", "PEMajor"]
              )
            ]
          },
          steroids: {
            label: "ستيرويدات / أدوية مثبطة للمناعة",
            dxAdd: dxB(["Infection"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "المعالجة المثبطة للمناعة تزيد قابلية الإصابة بالالتهابات.",
                ["Infection"]
              )
            ]
          },
          noDrugs: {
            label: "لا يتناول أدوية مزمنة مهمة",
            dxAdd: dxB([]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "عدم تناول أدوية مزمنة لا يضيف عامل خطورة أو حماية واضح.",
                []
              )
            ]
          }
        }
      }
    ]
  },

  {
    id: "fh",
    label: "Family History",
    steps: [
      {
        id: "familyHistory",
        sectionId: "fh",
        sectionLabel: "FH",
        question: "هل يوجد تاريخ عائلي مهم؟",
        type: "single",
        required: false,
        options: {
          prematureIHD: {
            label: "إصابة قلبية (IHD/MI) في عمر مبكر ضمن العائلة",
            dxAdd: dxB(["IHD", "MI"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "وجود IHD أو MI في عمر مبكر ضمن العائلة يزيد احتمال الاستعداد الوراثي.",
                ["IHD", "MI"]
              )
            ]
          },
          suddenDeath: {
            label: "وفاة مفاجئة غير مفسّرة في أحد الأقارب",
            dxAdd: dxB(["Arrhythmia"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "الوفاة المفاجئة قد تشير إلى اعتلال عضلة قلب أو اضطراب نظم وراثي.",
                ["Arrhythmia"]
              )
            ]
          },
          noFH: {
            label: "لا يوجد تاريخ عائلي مهم",
            dxAdd: dxB([]),
            dxRemove: dxB(["IHD"]),
            reasoning: [
              rB(
                "غياب التاريخ العائلي لا ينفي المرض لكنه يقلل عامل الخطورة الوراثي.",
                ["IHD"]
              )
            ]
          }
        }
      }
    ]
  },

  {
    id: "sh",
    label: "Social History",
    steps: [
      {
        id: "socialHistory",
        sectionId: "sh",
        sectionLabel: "SH",
        question: "ما هي العادات ونمط الحياة؟ (اختر كل ما ينطبق)",
        type: "multi",
        required: false,
        options: {
          smoker: {
            label: "مدخّن حالي",
            dxAdd: dxB(["IHD", "MI", "COPD"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "التدخين من أقوى عوامل الخطورة لأمراض القلب والرئة.",
                ["IHD", "MI", "COPD"]
              )
            ]
          },
          exSmoker: {
            label: "مدخّن سابق",
            dxAdd: dxB(["IHD", "COPD"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "التدخين السابق يبقى عامل خطورة لكن أقل من التدخين الحالي.",
                ["IHD", "COPD"]
              )
            ]
          },
          sedentary: {
            label: "قلة النشاط البدني",
            dxAdd: dxB(["IHD", "HF"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "الخمول البدني يزيد من عوامل الخطورة القلبية والوعائية.",
                ["IHD", "HF"]
              )
            ]
          },
          highStress: {
            label: "ضغوط نفسية عالية / عمل مرهق",
            dxAdd: dxB(["Anxiety", "IHD"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "الضغط النفسي قد يثير نوبات هلع، كما أنه عامل مساند لأمراض القلب.",
                ["Anxiety", "IHD"]
              )
            ]
          },
          noSH: {
            label: "لا توجد عوامل اجتماعية واضحة مؤثرة",
            dxAdd: dxB([]),
            dxRemove: dxB([]),
            reasoning: [
              rB("غياب عوامل اجتماعية واضحة لا يستبعد المرض.", [])
            ]
          }
        }
      }
    ]
  }
];