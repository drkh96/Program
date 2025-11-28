// ========================================
// chest-data-hpi.js
// Detailed HPI (all choices, dxAdd/dxRemove + reasoning)
// ========================================

"use strict";

function dx(ids) {
  return ids || [];
}

function r(text, diseases) {
  return { text, diseases: diseases || [] };
}

window.CHEST_SECTIONS_HPI = [
  {
    id: "hpi",
    label: "History of Present Illness",
    steps: [
      {
        id: "onset",
        sectionId: "hpi",
        sectionLabel: "HPI",
        question: "كيف كانت بداية الألم؟",
        type: "single",
        required: true,
        options: {
          sudden1min: {
            label: "بداية فجائية خلال أقل من دقيقة، ألم شديد جداً",
            dxAdd: dx(["MI", "PEMajor", "Dissection"]),
            dxRemove: dx(["GERD", "Musculoskeletal"]),
            reasoning: [
              r(
                "البداية الفجائية جداً لألم صدري شديد ترفع بقوة احتمال احتشاء القلب، الانصمام الرئوي أو تسلخ الأبهر.",
                ["MI", "PEMajor", "Dissection"]
              )
            ]
          },
          sudden10min: {
            label: "بداية سريعة خلال 10 دقائق",
            dxAdd: dx(["MI", "UnstableAngina", "PEMajor"]),
            dxRemove: dx(["GERD"]),
            reasoning: [
              r(
                "بداية خلال دقائق ما زالت تلميحاً لسبب حاد مثل ACS أو PE أكثر من الأسباب المزمنة.",
                ["MI", "UnstableAngina", "PEMajor"]
              )
            ]
          },
          gradualHours: {
            label: "بداية تدريجية على مدى ساعات",
            dxAdd: dx(["Pericarditis", "Pneumonia", "Musculoskeletal"]),
            dxRemove: dx(["MI", "Dissection"]),
            reasoning: [
              r(
                "البداية التدريجية على مدى ساعات توحي بأسباب التهابية كالتامور والالتهاب الرئوي، أو ألم عضلي.",
                ["Pericarditis", "Pneumonia", "Musculoskeletal"]
              )
            ]
          },
          gradualDays: {
            label: "بداية تدريجية على مدى أيام",
            dxAdd: dx(["Pneumonia", "GERD", "Musculoskeletal"]),
            dxRemove: dx(["MI", "PEMajor", "Dissection"]),
            reasoning: [
              r(
                "تطور الألم على مدى أيام يقلل احتمال الحالات الوعائية الحادة ويرجح أسباباً التهابية أو عضلية أو هضمية.",
                ["Pneumonia", "GERD", "Musculoskeletal"]
              )
            ]
          }
        }
      },

      {
        id: "site",
        sectionId: "hpi",
        sectionLabel: "HPI",
        question: "أين يتركّز الألم؟",
        type: "single",
        required: true,
        options: {
          retrosternal: {
            label: "خلف القص (Retrosternal)",
            dxAdd: dx(["IHD", "MI", "ACS", "GERD"]),
            dxRemove: dx(["Musculoskeletal"]),
            reasoning: [
              r(
                "ألم خلف القص هو المكان النموذجي لألم نقص تروية عضلة القلب، ويمكن أن يحدث أيضاً في الارتجاع المريئي.",
                ["IHD", "MI", "ACS", "GERD"]
              )
            ]
          },
          leftChest: {
            label: "النصف الأيسر من الصدر",
            dxAdd: dx(["IHD", "MI", "Musculoskeletal"]),
            dxRemove: [],
            reasoning: [
              r(
                "ألم النصف الأيسر قد يكون قلبي المنشأ أو من جدار الصدر؛ يعتمد على باقي الصفات.",
                ["IHD", "Musculoskeletal"]
              )
            ]
          },
          pleuriticSide: {
            label: "موضع جانبي يزداد مع التنفس",
            dxAdd: dx(["Pleuritis", "Pneumonia", "PEMajor"]),
            dxRemove: dx(["IHD", "MI"]),
            reasoning: [
              r(
                "الألم الجانبي المرتبط بالتنفس يوحي بأسباب جنبـيّة أو رئوية أكثر من السبب القلبي.",
                ["Pleuritis", "Pneumonia", "PEMajor"]
              )
            ]
          },
          pointTender: {
            label: "موضع صغير يمكن الإشارة إليه بإصبع واحد",
            dxAdd: dx(["Musculoskeletal"]),
            dxRemove: dx(["MI", "PEMajor"]),
            reasoning: [
              r(
                "الألم شديد التوضّع الذي يمكن الإشارة إليه بإصبع غالباً يكون من جدار الصدر (عضلي/ضلعي).",
                ["Musculoskeletal"]
              )
            ]
          }
        }
      },

      {
        id: "character",
        sectionId: "hpi",
        sectionLabel: "HPI",
        question: "ما هي طبيعة الألم؟",
        type: "single",
        required: true,
        options: {
          pressure: {
            label: "ضاغط / ثقل / انقباض",
            dxAdd: dx(["IHD", "MI", "ACS"]),
            dxRemove: dx(["Musculoskeletal"]),
            reasoning: [
              r(
                "الإحساس بالثقل أو الضغط أو الانقباض وصف نموذجي لألم نقص التروية القلبية.",
                ["IHD", "MI", "ACS"]
              )
            ]
          },
          sharpPleuritic: {
            label: "طاعن يزداد مع التنفس (Pleuritic sharp pain)",
            dxAdd: dx(["Pleuritis", "Pneumonia", "PEMajor"]),
            dxRemove: dx(["IHD"]),
            reasoning: [
              r(
                "الألم الطاعن المرتبط بالشهيق يشير عادة إلى التهاب جنب أو انصمام رئوي أو التهاب رئوي.",
                ["Pleuritis", "Pneumonia", "PEMajor"]
              )
            ]
          },
          burning: {
            label: "حرقة خلف القص خاصة بعد الأكل",
            dxAdd: dx(["GERD", "PepticUlcer"]),
            dxRemove: dx(["MI"]),
            reasoning: [
              r(
                "حرقة خلف القص بعد الطعام تشير بقوة إلى GERD أو قرحة هضمية.",
                ["GERD", "PepticUlcer"]
              )
            ]
          },
          tearingBack: {
            label: "ألم حارق/ماحق ينتشر إلى الظهر (Tearing to back)",
            dxAdd: dx(["Dissection"]),
            dxRemove: [],
            reasoning: [
              r(
                "ألم صدري ماحق يمتد إلى الظهر بين لوحي الكتف علامة إنذار لتسلخ الأبهر.",
                ["Dissection"]
              )
            ]
          }
        }
      },

      {
        id: "radiation",
        sectionId: "hpi",
        sectionLabel: "HPI",
        question: "هل ينتشر الألم إلى مكان آخر؟",
        type: "single",
        required: true,
        options: {
          leftArmJaw: {
            label: "الذراع الأيسر / الفك السفلي / الرقبة",
            dxAdd: dx(["MI", "IHD", "ACS"]),
            dxRemove: [],
            reasoning: [
              r(
                "انتشار الألم إلى الذراع الأيسر أو الفك السفلي وصف كلاسيكي للألم القلبي الإقفاري.",
                ["MI", "IHD", "ACS"]
              )
            ]
          },
          backBetweenScapulae: {
            label: "إلى الظهر بين لوحي الكتف",
            dxAdd: dx(["Dissection", "PEMajor"]),
            dxRemove: [],
            reasoning: [
              r(
                "انتشار الألم إلى الظهر بين لوحي الكتف مع بداية حادة يثير الشك في تسلخ الأبهر أو PE.",
                ["Dissection", "PEMajor"]
              )
            ]
          },
          none: {
            label: "لا يوجد انتشار واضح",
            dxAdd: dx([]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "غياب الانتشار لا ينفي السبب القلبي لكنه أقل نموذجية لاحتشاء نموذجي.",
                ["MI"]
              )
            ]
          }
        }
      },

      {
        id: "aggravating",
        sectionId: "hpi",
        sectionLabel: "HPI",
        question: "ما الذي يزيد الألم سوءاً؟",
        type: "single",
        required: true,
        options: {
          exertion: {
            label: "الجهد / صعود الدرج / المشي السريع",
            dxAdd: dx(["IHD", "StableAngina", "ACS"]),
            dxRemove: dx(["Pleuritis"]),
            reasoning: [
              r(
                "الألم الذي يزيد مع الجهد ويخف مع الراحة سلوك نموذجي للذبحة الصدرية.",
                ["IHD", "StableAngina", "ACS"]
              )
            ]
          },
          emotionalStress: {
            label: "الانفعال النفسي / التوتر",
            dxAdd: dx(["IHD", "Anxiety"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "الانفعال النفسي قد يثير الذبحة أو نوبة هلع؛ التمييز يعتمد على بقية القصة.",
                ["IHD", "Anxiety"]
              )
            ]
          },
          deepInspiration: {
            label: "الشهيق العميق أو الكحة",
            dxAdd: dx(["Pleuritis", "Pneumonia", "PEMajor"]),
            dxRemove: dx(["StableAngina"]),
            reasoning: [
              r(
                "ازدياد الألم مع الشهيق يشير عادة لأسباب جنبيّة أو رئوية أكثر من نقص التروية.",
                ["Pleuritis", "Pneumonia", "PEMajor"]
              )
            ]
          },
          movementPalpation: {
            label: "حركة الجذع أو الضغط على جدار الصدر",
            dxAdd: dx(["Musculoskeletal"]),
            dxRemove: dx(["MI", "PEMajor"]),
            reasoning: [
              r(
                "تفاقم الألم مع حركة الصدر أو الضغط الموضع غالباً يدل على ألم عضلي/ضلعي.",
                ["Musculoskeletal"]
              )
            ]
          },
          postMeal: {
            label: "بعد الأكل أو عند الانحناء للأمام",
            dxAdd: dx(["GERD", "PepticUlcer"]),
            dxRemove: dx(["IHD"]),
            reasoning: [
              r(
                "ارتباط الألم بالطعام أو الانحناء للأمام يلمّح بقوة لأسباب مريئية/هضمية.",
                ["GERD", "PepticUlcer"]
              )
            ]
          },
          none: {
            label: "لا توجد علاقة واضحة",
            dxAdd: dx([]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "عدم وجود علاقة واضحة لا يحدد التشخيص لكنه يقلل من نوعية بعض الأنماط الكلاسيكية.",
                ["IHD"]
              )
            ]
          }
        }
      },

      {
        id: "relief",
        sectionId: "hpi",
        sectionLabel: "HPI",
        question: "ما الذي يخفف الألم؟",
        type: "single",
        required: true,
        options: {
          rest: {
            label: "الراحة بعد الجهد",
            dxAdd: dx(["StableAngina"]),
            dxRemove: dx(["MI"]),
            reasoning: [
              r(
                "تحسن الألم خلال دقائق من إيقاف الجهد سلوك نموذجي للذبحة المستقرة أكثر من الاحتشاء.",
                ["StableAngina"]
              )
            ]
          },
          gtn: {
            label: "أقراص النترات تحت اللسان (GTN)",
            dxAdd: dx(["IHD", "StableAngina"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "استجابة سريعة للنترات تدعم تشخيص ألم قلبي إقفاري، لكنها ليست نوعية 100٪.",
                ["IHD", "StableAngina"]
              )
            ]
          },
          leaningForward: {
            label: "الجلوس والانحناء للأمام",
            dxAdd: dx(["Pericarditis"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "تحسن الألم عند الجلوس والانحناء للأمام وصف كلاسيكي لالتهاب التامور.",
                ["Pericarditis"]
              )
            ]
          },
          antacids: {
            label: "مضادات الحموضة / PPI",
            dxAdd: dx(["GERD", "PepticUlcer"]),
            dxRemove: dx(["MI"]),
            reasoning: [
              r(
                "تحسن الألم بعد مضادات الحموضة يوحي بألم مريئي/معدي أكثر من الاحتشاء.",
                ["GERD", "PepticUlcer"]
              )
            ]
          },
          nothing: {
            label: "لا شيء يخفف الألم بشكل واضح",
            dxAdd: dx(["MI", "PEMajor", "Dissection"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "عدم وجود عامل مريح واضح مع ألم شديد مستمر يثير القلق من حالة خطرة مثل MI أو PE أو تسلخ الأبهر.",
                ["MI", "PEMajor", "Dissection"]
              )
            ]
          }
        }
      },

      {
        id: "episodeDuration",
        sectionId: "hpi",
        sectionLabel: "HPI",
        question: "ما مدة كل نوبة من الألم؟",
        type: "single",
        required: true,
        options: {
          seconds: {
            label: "ثوانٍ إلى أقل من دقيقة",
            dxAdd: dx(["Musculoskeletal", "Anxiety"]),
            dxRemove: dx(["StableAngina", "MI"]),
            reasoning: [
              r(
                "الألم الذي يستمر لثوانٍ غالباً لا يكون إقفارياً؛ يشير لأسباب عضلية أو قلق.",
                ["Musculoskeletal", "Anxiety"]
              )
            ]
          },
          fiveTo20: {
            label: "5–20 دقيقة (نموذجي لنوبة الذبحة)",
            dxAdd: dx(["StableAngina", "IHD"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "مدة 5–20 دقيقة هي المدة النموذجية لنوبة الذبحة الصدرية.",
                ["StableAngina", "IHD"]
              )
            ]
          },
          more20: {
            label: "> 20 دقيقة دون تحسن",
            dxAdd: dx(["MI", "UnstableAngina", "Pericarditis"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "استمرار الألم لأكثر من 20 دقيقة دون تحسن يثير الشك في MI أو ذبحة غير مستقرة.",
                ["MI", "UnstableAngina", "Pericarditis"]
              )
            ]
          },
          hoursDays: {
            label: "لساعات أو أيام",
            dxAdd: dx(["Pericarditis", "Pneumonia", "Musculoskeletal", "GERD"]),
            dxRemove: dx(["MI", "UnstableAngina"]),
            reasoning: [
              r(
                "الألم المستمر لساعات/أيام أكثر توافقاً مع التهاب أو ألم عضلي أو GERD.",
                ["Pericarditis", "Pneumonia", "Musculoskeletal", "GERD"]
              )
            ]
          }
        }
      },

      {
        id: "course",
        sectionId: "hpi",
        sectionLabel: "HPI",
        question: "كيف تصف سير الألم منذ بدايته؟",
        type: "single",
        required: true,
        options: {
          intermittent: {
            label: "يأتي على شكل نوبات متكررة مع فترات خالية",
            dxAdd: dx(["StableAngina", "GERD", "Musculoskeletal"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "النمط النوبي المتكرر مع فترات خالية يشير غالباً إلى ذبحة مستقرة أو GERD أو ألم عضلي.",
                ["StableAngina", "GERD", "Musculoskeletal"]
              )
            ]
          },
          progressive: {
            label: "ألم يزداد تدريجياً في الشدة أو التكرار",
            dxAdd: dx(["UnstableAngina", "MI", "PEMajor"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "تفاقم الألم في الشدة/التكرار علامة إنذار لذبحة غير مستقرة أو MI أو PE.",
                ["UnstableAngina", "MI", "PEMajor"]
              )
            ]
          },
          constant: {
            label: "ألم ثابت الشدة تقريباً",
            dxAdd: dx(["Pericarditis", "Pneumonia", "Musculoskeletal"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "الألم الثابت قد يرافق التهاب التامور أو الالتهاب الرئوي أو ألم جدار الصدر.",
                ["Pericarditis", "Pneumonia", "Musculoskeletal"]
              )
            ]
          },
          improving: {
            label: "يتحسن تدريجياً منذ الذروة",
            dxAdd: dx([]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "تحسن الألم مع الوقت قد يشير إلى أن السبب الحاد بدأ بالانحسار، لكنه غير نوعي.",
                []
              )
            ]
          }
        }
      },

      {
        id: "associated",
        sectionId: "hpi",
        sectionLabel: "HPI",
        question: "هل توجد أعراض مصاحبة للألم؟ (اختر كل ما ينطبق)",
        type: "multi",
        required: true,
        options: {
          dyspnea: {
            label: "ضيق في التنفس",
            dxAdd: dx(["MI", "HF", "PEMajor", "Pneumonia"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "ضيق النفس مع ألم صدري يرفع احتمال MI أو HF أو PE أو التهاب رئوي.",
                ["MI", "HF", "PEMajor", "Pneumonia"]
              )
            ]
          },
          diaphoresis: {
            label: "تعرّق شديد",
            dxAdd: dx(["MI", "ACS"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "التعرّق الشديد مع ألم صدري وصف كلاسيكي لاحتشاء عضلة القلب.",
                ["MI", "ACS"]
              )
            ]
          },
          nausea: {
            label: "غثيان / تقيؤ",
            dxAdd: dx(["MI", "GERD"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "الغثيان أو التقيؤ يمكن أن يرافق MI أو GERD، ويحتاج إلى الربط بسياق القصة.",
                ["MI", "GERD"]
              )
            ]
          },
          syncope: {
            label: "إغماء أو شبه إغماء",
            dxAdd: dx(["Arrhythmia", "PEMajor", "Dissection"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "الإغماء مع ألم صدري علامة إنذار لاضطراب نظم، PE كبير أو تسلخ الأبهر.",
                ["Arrhythmia", "PEMajor", "Dissection"]
              )
            ]
          },
          hemoptysis: {
            label: "سعال مصحوب بدم",
            dxAdd: dx(["PEMajor", "Pneumonia"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "نفث دموي مع ألم صدري يثير الشك في PE أو التهاب رئوي متقدم.",
                ["PEMajor", "Pneumonia"]
              )
            ]
          },
          anxietyFeatures: {
            label: "تسارع نفس، شعور بالموت، رجفة (نوبة هلع)",
            dxAdd: dx(["Anxiety"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "أعراض نوبة الهلع قد تفسّر الألم، لكن يجب دوماً استبعاد الأسباب العضوية أولاً.",
                ["Anxiety"]
              )
            ]
          },
          none: {
            label: "لا توجد أعراض مصاحبة مهمة",
            dxAdd: dx([]),
            dxRemove: dx(["PEMajor", "HF", "Pneumonia"]),
            reasoning: [
              r(
                "غياب الأعراض المصاحبة الرئيسية يقلل قليلاً من احتمال بعض الأسباب الشديدة مثل PE أو HF أو التهاب رئوي واضح.",
                ["PEMajor", "HF", "Pneumonia"]
              )
            ]
          }
        }
      },

      // -----------------------------
      // Red flags section
      // -----------------------------
      {
        id: "redFlags",
        sectionId: "hpi",
        sectionLabel: "HPI",
        question: "Red Flags: هل توجد أي من العلامات الخطرة التالية؟",
        type: "multi",
        required: true,
        options: {
          tearingBack: {
            label: "ألم تمزّقي مفاجئ ممتد إلى الظهر",
            dxAdd: dx(["Dissection"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "ألم تمزّقي مفاجئ إلى الظهر علامة إنذار قوية لتسلخ الأبهر.",
                ["Dissection"]
              )
            ]
          },
          suddenSevereDyspnea: {
            label: "ضيق نفس حاد مفاجئ مع ألم صدري",
            dxAdd: dx(["PEMajor", "HF"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "ضيق نفس حاد مفاجئ مع ألم صدري يرفع احتمال PE أو وذمة رئة حادة.",
                ["PEMajor", "HF"]
              )
            ]
          },
          hypotensionShock: {
            label: "علامات هبوط ضغط / صدمة (دوخة شديدة، برودة أطراف)",
            dxAdd: dx(["MI", "PEMajor", "Dissection"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "علامات الصدمة مع ألم صدري تدل على حالة مهددة للحياة مثل MI كبير أو PE ضخم أو تسلخ أبهر.",
                ["MI", "PEMajor", "Dissection"]
              )
            ]
          },
          none: {
            label: "لا توجد علامات خطورة واضحة",
            dxAdd: dx([]),
            dxRemove: dx(["Dissection", "PEMajor"]),
            reasoning: [
              r(
                "غياب العلامات الخطرة لا ينفي الحالات الشديدة لكنه يقلل احتمالها نسبياً.",
                ["Dissection", "PEMajor"]
              )
            ]
          }
        }
      }
    ]
  }
];