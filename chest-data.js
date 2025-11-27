// ========================================
// Data.js
// Chest pain history data + DDx structure (Arabic Version)
// ========================================

"use strict";

(function (global) {

  // ======================================
  // 1) DIAGNOSES & GROUPS
  // ======================================

  const DX_GROUPS = {
    cardiac:  { id: "cardiac",  label: "القلب",  order: 1 },
    aorta:    { id: "aorta",    label: "الأبهر",    order: 2 },
    pulmonary:{ id: "pulmonary",label: "الرئة",order: 3 },
    pleural:  { id: "pleural",  label: "الغشاء البلوري",   order: 4 },
    chestWall:{ id: "chestWall",label: "جدار الصدر",order: 5 },
    oesophagus:{id: "oesophagus",label:"المريء",order: 6},
    neuro:    { id: "neuro",    label: "الجهاز العصبي",order: 7 },
    peripheral:{id: "peripheral",label:"الأوعية المحيطية",order: 8},
    hema:     { id: "hema",     label: "أمراض الدم",order: 9 },
    psych:    { id: "psych",    label: "نفسي/نفساني",order: 10 }
  };

  const DIAGNOSES = [
    { 
      id: "IHD",        
      label: "مرض القلب الإقفاري (Ischemic Heart Disease)", 
      group: "cardiac",
      keyMissingFeatures: [
        "تغيرات تخطيط القلب (ECG changes)",
        "ارتفاع تروبونين القلب (Elevated Troponin)",
        "علامات فشل القلب (Signs of Heart Failure)"
      ]
    },
    { 
      id: "StableAngina", 
      label: "الذبحة الصدرية المستقرة (Stable Angina)",        
      group: "cardiac",
      keyMissingFeatures: [
        "تخطيط قلب طبيعي وقت الراحة (Normal resting ECG)",
        "تروبونين قلب طبيعي (Normal Troponin)",
        "فحص الجهد إيجابي (Positive Stress Test)"
      ]
    },
    { 
      id: "UnstableAngina", 
      label: "الذبحة الصدرية غير المستقرة (Unstable Angina)",    
      group: "cardiac",
      keyMissingFeatures: [
        "تغيرات تخطيط القلب (ECG changes: ST depression)",
        "تروبونين القلب غالباً سلبي (Troponin often negative)"
      ]
    },
    { 
      id: "MI",         
      label: "احتشاء عضلة القلب (Myocardial Infarction)",  
      group: "cardiac",
      keyMissingFeatures: [
        "ارتفاع مقطع ST أو حصار حزمة أيسر جديد في تخطيط القلب (ST elevation or new LBBB)",
        "ارتفاع التروبونين بشكل كبير (Marked Troponin elevation)"
      ]
    },
    { 
      id: "ACS",        
      label: "متلازمة الشريان التاجي الحادة (Acute Coronary Syndrome)", 
      group: "cardiac",
      keyMissingFeatures: [
        "تغيرات تخطيط القلب الدالة على نقص التروية (ECG changes)",
        "حالة تروبونين القلب (Troponin status)",
        "تأكيد نقص التروية بالتصوير/الفحوصات (Ischemia confirmed by imaging/labs)"
      ]
    },
    { id: "Myocarditis",label: "التهاب عضلة القلب (Myocarditis)", group: "cardiac" },
    { 
      id: "Pericarditis",
      label:"التهاب التامور (Pericarditis)",           
      group: "cardiac",
      keyMissingFeatures: [
        "احتكاك تاموري في السمع (Pericardial friction rub)",
        "ارتفاع ST منتشر في تخطيط القلب (Diffuse ST elevation)",
        "انصباب تاموري في الصدى (Pericardial effusion)"
      ]
    },
    { id: "MVP",        label: "تدلي الصمام التاجي (Mitral Valve Prolapse)",  group: "cardiac" },
    { id: "HF",         label: "فشل القلب (Heart Failure)",          group: "cardiac" },

    { id: "AorticAneurysm", label: "توسع الأبهر (Aortic Aneurysm)",    group: "aorta" },
    { 
      id: "AorticDissection", 
      label: "تسلخ الأبهر (Aortic Dissection)",
      group: "aorta",
      keyMissingFeatures: [
        "اختلاف ضغط الدم بين الذراعين (> 20 مم زئبقي) (Inter-arm BP difference)",
        "نفخة قلس أبهري جديدة (New Aortic Regurgitation)",
        "نقص النبضات (Pulse deficits)"
      ]
    },

    { id: "PE",         label: "انصمام رئوي (Pulmonary Embolism)",     group: "pulmonary" },
    { 
      id: "PEMajor",    
      label: "انصمام رئوي كبير (Pulmonary Embolism - Major)", 
      group: "pulmonary",
      keyMissingFeatures: [
        "زيادة سرعة التنفس (Tachypnea)",
        "تسرع القلب (Tachycardia)",
        "علامات جلطة الأوردة العميقة (Signs of DVT)",
        "انخفاض إشباع الأكسجين (Low O2 Saturation)"
      ]
    },
    { id: "Pneumonia",  label: "التهاب رئوي (Pneumonia)",              group: "pulmonary" },
    { id: "PulmInfarct",label: "احتشاء رئوي (Pulmonary Infarct)",   group: "pulmonary" },

    { id: "Pleurisy",   label: "التهاب الغشاء البلوري (Pleurisy)",               group: "pleural" },
    { id: "Pneumothorax", label: "استرواح الصدر (Pneumothorax)",         group: "pleural" },

    { id: "ChestWallPain", label: "ألم جدار الصدر / التهاب الغضاريف الضلعية (Chest Wall Pain)", group: "chestWall" },
    { id: "RibFracture", label: "كسر ضلعي (Rib Fracture)",          group: "chestWall" },
    { id: "HerpesZoster", label: "الهربس النطاقي (Herpes Zoster)",        group: "chestWall" },

    { id: "Oesophagitis", label: "التهاب المريء (Oesophagitis)",         group: "oesophagus" },
    { id: "EsophagealSpasm", label: "تشنج المريء (Esophageal Spasm)",  group: "oesophagus" },

    { id: "Stroke",     label: "سكتة دماغية (Stroke)",           group: "neuro" },

    { id: "PAD",        label: "مرض الشريان المحيطي (Peripheral Arterial Disease)", group: "peripheral" },

    { id: "Anemia",     label: "فقر الدم (Anemia)",                 group: "hema" },
    
    { 
      id: "PanicAttack", 
      label: "نوبة هلع / قلق (Panic Attack / Anxiety)", 
      group: "psych",
      keyMissingFeatures: [
        "فحص سريري طبيعي (Normal physical exam)",
        "نتائج تحاليل واستقصاءات طبيعية (Normal investigations)",
        "غياب عوامل الخطر للأسباب العضوية (Absence of organic risk factors)"
      ]
    }
  ];

  // Helper to create reasoning bullets
  function r(text, diseases) {
    return { text, diseases: diseases || [] };
  }

  // Short alias to list add/remove dx
  function addDx(ids) {
    return ids || [];
  }

  // ======================================
  // 2) HISTORY SECTIONS & STEPS
  // ======================================

  const SECTIONS = [
  {
    id: "personal",
    label: "البيانات الشخصية",
    steps: [

      {
        id: "name",
        sectionId: "personal",
        sectionLabel: "البيانات الشخصية",
        question: "ما هو اسم المريض؟",
        type: "text"
      },

      {
        id: "ageGroup",
        sectionId: "personal",
        sectionLabel: "البيانات الشخصية",
        question: "أدخل عمر المريض (بالسنوات):",
        type: "numeric",

        getDxFromValue: function (value) {

          const n = parseInt(value);
          if (isNaN(n) || n < 0) return [];

          const dxList = [];

          if (n < 30) {
            dxList.push({
              add: ["Myocarditis", "Pericarditis", "Pneumothorax"],
              remove: ["IHD", "MI", "ACS", "AorticDissection", "PAD"]
            });
          }

          if (n >= 40 && n <= 65) {
            dxList.push({
              add: ["IHD", "StableAngina", "UnstableAngina", "MI", "ACS", "PAD"],
              remove: []
            });
          }

          if (n > 65) {
            dxList.push({
              add: ["IHD", "MI", "HF", "AorticAneurysm", "AorticDissection", "ACS"],
              remove: []
            });
          }

          return dxList;
        },

        reasoningForNumeric: [
          r(
            "يؤثر العمر على احتمالية الأسباب القلبية والوعائية لألم الصدر.",
            ["IHD", "MI", "AorticDissection"]
          )
        ]
      },

      {
        id: "sex",
        sectionId: "personal",
        sectionLabel: "البيانات الشخصية",
        question: "ما هو جنس المريض؟",
        type: "single",

        options: {
          male: {
            label: "ذكر (Male)",
            dxAdd: addDx(["IHD", "MI", "ACS", "PAD"]),
            dxRemove: addDx([]),
            reasoning: [
              r(
                "الجنس الذكري هو عامل خطر كلاسيكي لمرض القلب الإقفاري التصلبي الشرياني.",
                ["IHD", "MI", "ACS"]
              )
            ]
          },
          female: {
            label: "أنثى (Female)",
            dxAdd: addDx([]),
            dxRemove: addDx([]),
            reasoning: [
              r(
                "الجنس الأنثوي لا يستبعد الألم القلبي، لكن النساء قبل سن اليأس لديهن خطر أقل للإقفار.",
                ["IHD"]
              )
            ]
          }
        }
      }

    ]
  },

  {
    id: "cc",
    label: "الشكوى الرئيسية",
    steps: [

      {
        id: "mainSymptom",
        sectionId: "cc",
        sectionLabel: "الشكوى الرئيسية",
        question: "ما هي الشكوى الرئيسية؟",
        type: "text"
      },

      {
        id: "ccDuration",
        sectionId: "cc",
        sectionLabel: "الشكوى الرئيسية",
        question: "منذ متى والشكوى الرئيسية موجودة؟",
        type: "text",

        getDxFromText: function (value) {
          if (!value) return [];

          const v = value.toLowerCase();

                   // Acute (minutes → hours)
          if (v.includes("min") || v.includes("minute") || v.includes("hour") || v.includes("hr") || v.includes("ساعة") || v.includes("دقيقة")) {
            return [
              { add: ["MI", "UnstableAngina", "ACS", "Pneumothorax", "PEMajor", "AorticDissection"], remove: [], featureText: "بدء حاد (دقائق/ساعات) (Acute onset)" }
            ];
          }

          // Subacute (days)
          if (v.includes("day") || v.includes("yesterday") || v.includes("يوم")) {
            return [
              { add: ["Pneumonia", "Pericarditis"], remove: [] , featureText: "بدء تحت حاد (أيام) (Subacute onset)" }
            ];
          }

          // Chronic (weeks)
          if (v.includes("week") || v.includes("month") || v.includes("أسبوع") || v.includes("شهر")) {
            return [
              { add: ["StableAngina", "HF", "PAD", "Anemia", "ChestWallPain"], remove: [], featureText: "مدة مزمنة (أسابيع/أشهر) (Chronic duration)" }
            ];
          }

          return [];
        }
      }

    ]
  },
  
    {
      id: "hpi",
      label: "تاريخ المرض الحالي",
      steps: [
        {
          id: "site",
          sectionId: "hpi",
          sectionLabel: "تاريخ المرض الحالي",
          question: "أين يقع ألم الصدر بالضبط؟",
          type: "single",
          options: {
            central: {
              label: "ألم خلف القص مركزي (Central retrosternal pain)",
              dxAdd: addDx(["IHD", "StableAngina", "UnstableAngina", "MI", "ACS", "Myocarditis", "Pericarditis", "MVP", "AorticDissection", "AorticAneurysm", "Oesophagitis", "PEMajor"]),
              dxRemove: addDx(["Pleurisy", "Pneumothorax", "Pneumonia", "ChestWallPain", "HerpesZoster"]),
              reasoning: [
                r("الألم خلف القص الكلاسيكي يشير للإقفار القلبي وأسباب المنصف الأخرى.", ["IHD", "MI", "ACS"]),
                r("الألم المركزي يقلل من احتمالية الأسباب البلورية أو جدار الصدر.", [])
              ]
            },
            peripheral: {
              label: "ألم صدري جانبي أحادي الجانب (Lateral chest pain)",
              dxAdd: addDx(["Pleurisy", "Pneumothorax", "Pneumonia", "PulmInfarct", "HerpesZoster"]),
              dxRemove: addDx(["IHD", "MI", "ACS", "AorticDissection", "Oesophagitis"]),
              reasoning: [
                r("الألم الجانبي أحادي الجانب غالباً ما يكون بلورياً (يزداد مع التنفس).", ["Pleurisy", "Pneumothorax", "Pneumonia"])
              ]
            },
            localized: {
              label: "ألم نقطي موضعي جداً (Localized point pain)",
              dxAdd: addDx(["ChestWallPain", "RibFracture"]),
              dxRemove: addDx(["MI", "ACS", "Pleurisy", "Pneumothorax", "AorticDissection"]),
              reasoning: [
                r("الألم الموضعي جداً (كطرف الإصبع) نموذجي لآفة جدار الصدر.", ["ChestWallPain", "RibFracture"])
              ]
            },
            band: {
              label: "ألم شريطي يتبع توزع جلدي (Band-like pain)",
              dxAdd: addDx(["HerpesZoster"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الألم الشريطي في توزع جلدي معين يشير بقوة إلى الهربس النطاقي.", ["HerpesZoster"])
              ]
            }
          }
        },

        {
          id: "onset",
          sectionId: "hpi",
          sectionLabel: "تاريخ المرض الحالي",
          question: "كيف بدأ الألم؟",
          type: "single",
          options: {
            sudden: {
              label: "فجأة (خلال ثوانٍ إلى دقائق) (Suddenly)",
              dxAdd: addDx(["MI", "ACS", "UnstableAngina", "PEMajor", "Pneumothorax", "AorticDissection"]),
              dxRemove: addDx([]),
              reasoning: [
                r("البدء المفاجئ نموذجي لاحتشاء القلب، الانصمام الرئوي، استرواح الصدر، أو تسلخ الأبهر.", ["MI", "ACS", "PEMajor", "Pneumothorax", "AorticDissection"])
              ]
            },
            gradual: {
              label: "تدريجياً خلال ساعات أو أيام (Gradually)",
              dxAdd: addDx(["StableAngina", "Myocarditis", "Pericarditis", "Pneumonia", "Oesophagitis", "ChestWallPain"]),
              dxRemove: addDx([]),
              reasoning: [
                r("البدء التدريجي يتناسب مع الذبحة المستقرة، التهاب التامور، التهاب الرئة، أو التهاب المريء.", ["StableAngina", "Pericarditis", "Pneumonia", "Oesophagitis"])
              ]
            }
          }
        },

        {
          id: "character",
          sectionId: "hpi",
          sectionLabel: "تاريخ المرض الحالي",
          question: "كيف تصف طبيعة الألم؟",
          type: "single",
          options: {
            tight: {
              label: "ضيق / ثقل / ضغط (Tightness/Heaviness/Pressure)",
              dxAdd: addDx(["IHD", "StableAngina", "UnstableAngina", "MI", "ACS", "Myocarditis"]),
              dxRemove: addDx(["ChestWallPain", "Pleurisy"]),
              reasoning: [
                r("الألم الكلاسيكي الثقيل أو الضيق يشير بقوة لنقص التروية القلبية.", ["IHD", "MI", "ACS"])
              ]
            },
            sharp: {
              label: "ألم حاد أو طاعن يزداد مع التنفس (Sharp or Stabbing)",
              dxAdd: addDx(["Pleurisy", "Pericarditis", "Pneumothorax", "Pneumonia"]),
              dxRemove: addDx(["MI", "ACS", "AorticDissection"]),
              reasoning: [
                r("الألم الحاد الذي يزداد مع الشهيق يوحي بمرض بلوري أو تاموري.", ["Pleurisy", "Pericarditis", "Pneumothorax", "Pneumonia"])
              ]
            },
            burning: {
              label: "ألم حارق مشابه لحرقة المعدة (Burning pain)",
              dxAdd: addDx(["Oesophagitis", "EsophagealSpasm"]),
              dxRemove: addDx(["MI", "ACS"]),
              reasoning: [
                r("الألم خلف القص الحارق هو نموذجي لالتهاب أو تشنج المريء.", ["Oesophagitis", "EsophagealSpasm"])
              ]
            },
            tearing: {
              label: "ألم تمزيقي يشع إلى الظهر (Tearing pain)",
              dxAdd: addDx(["AorticDissection"]),
              dxRemove: addDx(["MI", "ACS"]),
              reasoning: [
                r("الألم التمزيقي الذي يشع إلى الظهر هو علامة كلاسيكية لتسلخ الأبهر.", ["AorticDissection"])
              ]
            },
            nonSpecific: {
              label: "غير نوعي، متقطع، عابر، أو حاد غير بلوري (Non-specific/Fleeting)",
              dxAdd: addDx(["PanicAttack"]),
              dxRemove: addDx(["MI", "ACS", "AorticDissection"]),
              reasoning: [
                r("الألم العابر (Fleeting pain) غير النموذجي يشير أكثر لنوبة الهلع أو جدار الصدر.", ["PanicAttack", "ChestWallPain"])
              ]
            }
          }
        },

        {
          id: "radiation",
          sectionId: "hpi",
          sectionLabel: "تاريخ المرض الحالي",
          question: "هل يشع الألم إلى أي مكان؟",
          type: "single",
          options: {
            arm: {
              label: "إلى الفك، الرقبة، الذراع اليسرى، أو الشرسوف (To jaw, neck, left arm/epigastrium)",
              dxAdd: addDx(["IHD", "StableAngina", "UnstableAngina", "MI", "ACS"]),
              dxRemove: addDx(["ChestWallPain"]),
              reasoning: [
                r("الإشعاع للفك أو الذراع اليسرى كلاسيكي للألم القلبي الإقفاري.", ["IHD", "MI", "ACS"])
              ]
            },
            back: {
              label: "إلى الظهر بين لوحي الكتف (To the back between the scapulae)",
              dxAdd: addDx(["AorticDissection"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الإشعاع بين لوحي الكتف يتناسب مع تسلخ الأبهر.", ["AorticDissection"])
              ]
            },
            none: {
              label: "لا يوجد إشعاع (No radiation)",
              dxAdd: addDx(["ChestWallPain", "HerpesZoster", "PanicAttack"]),
              dxRemove: addDx(["MI", "ACS"]),
              reasoning: [
                r("الألم بدون إشعاع هو أكثر شيوعاً في ألم جدار الصدر أو نوبات الهلع.", ["ChestWallPain", "HerpesZoster", "PanicAttack"])
              ]
            }
          }
        },

        {
          id: "relief",
          sectionId: "hpi",
          sectionLabel: "تاريخ المرض الحالي",
          question: "ما الذي يخفف الألم؟",
          type: "single",
          options: {
            rest: {
              label: "يخف بالراحة أو باستخدام النتروغليسرين (Relieved by rest or nitroglycerin)",
              dxAdd: addDx(["StableAngina"]),
              dxRemove: addDx(["MI", "ACS"]),
              reasoning: [
                r("الألم الذي يخف بالراحة والنترات نموذجي للذبحة الصدرية المستقرة.", ["StableAngina"])
              ]
            },
            forward: {
              label: "يخف بالجلوس والإنحناء للأمام (Relieved by leaning forward)",
              dxAdd: addDx(["Pericarditis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الألم التاموري يتحسن بالانحناء للأمام بشكل مميز.", ["Pericarditis"])
              ]
            },
            antacid: {
              label: "يخف بمضادات الحموضة أو الجلوس منتصباً (Relieved by antacids or sitting upright)",
              dxAdd: addDx(["Oesophagitis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("التحسن بمضادات الحموضة يقترح الارتجاع المريئي/التهاب المريء.", ["Oesophagitis"])
              ]
            },
            avoidMovement: {
              label: "يخف بتجنب حركة جدار الصدر (Relieved by avoiding movement)",
              dxAdd: addDx(["ChestWallPain"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الألم الذي يتحسن عند تثبيت الصدر يشير إلى ألم هيكلي عضلي.", ["ChestWallPain"])
              ]
            },
            nothing: {
              label: "لا يخف بأي شيء تقريباً (Nothing relieves the pain)",
              dxAdd: addDx(["MI", "ACS", "PEMajor", "AorticDissection"]),
              dxRemove: addDx(["StableAngina"]),
              reasoning: [
                r("الألم الشديد الذي لا يخف يثير القلق لاحتشاء القلب أو تسلخ الأبهر.", ["MI", "ACS", "PEMajor"])
              ]
            }
          }
        },

        {
          id: "aggravating",
          sectionId: "hpi",
          sectionLabel: "تاريخ المرض الحالي",
          question: "ما الذي يزيد الألم سوءاً؟",
          type: "single",
          options: {
            effort: {
              label: "يزداد مع الجهد، العاطفة أو البرد (Worse with exertion, emotion or cold)",
              dxAdd: addDx(["StableAngina", "UnstableAngina", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الألم المرتبط بالجهد كلاسيكي للذبحة الصدرية.", ["StableAngina", "UnstableAngina", "ACS"])
              ]
            },
            breath: {
              label: "يزداد مع الشهيق، السعال أو التنفس (Worse with inspiration, cough or breathing)",
              dxAdd: addDx(["Pleurisy", "Pericarditis", "Pneumothorax", "Pneumonia"]),
              dxRemove: addDx(["MI", "ACS"]),
              reasoning: [
                r("الألم الذي يتفاقم مع التنفس يشير إلى مرض بلوري أو تاموري.", ["Pleurisy", "Pericarditis", "Pneumothorax", "Pneumonia"])
              ]
            },
            meal: {
              label: "يزداد بعد وجبة دسمة أو عند الاستلقاء (Worse after meal or lying flat)",
              dxAdd: addDx(["Oesophagitis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("التفاقم مع الوجبات والاستلقاء يشير إلى التهاب المريء الارتجاعي.", ["Oesophagitis"])
              ]
            },
            motion: {
              label: "يزداد مع حركة جدار الصدر أو بالجس (Worse with movement or palpation)",
              dxAdd: addDx(["ChestWallPain", "RibFracture"]),
              dxRemove: addDx(["MI", "ACS", "AorticDissection"]),
              reasoning: [
                r("الألم الذي يُستنسخ بالحركة أو الجس يدل على مصدر هيكلي عضلي.", ["ChestWallPain", "RibFracture"])
              ]
            }
          }
        },

        {
          id: "associated",
          sectionId: "hpi",
          sectionLabel: "تاريخ المرض الحالي",
          question: "هل توجد أي أعراض مرافقة؟",
          type: "multi",
          options: {
            dyspnea: {
              label: "ضيق التنفس (Shortness of breath)",
              dxAdd: addDx(["MI", "ACS", "UnstableAngina", "HF", "PEMajor", "Pneumothorax"]),
              dxRemove: addDx([]),
              reasoning: [
                r("ضيق التنفس المرافق يوحي بإقفار حاد، انصمام رئوي، أو فشل قلب متطور.", ["MI", "ACS", "PEMajor", "HF"])
              ]
            },
            sweating: {
              label: "تعرق غزير (Profuse sweating)",
              dxAdd: addDx(["MI", "ACS", "UnstableAngina"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الأعراض الودية مثل التعرق الغزير نموذجية لاحتشاء عضلة القلب الحاد.", ["MI", "ACS"])
              ]
            },
            vomiting: {
              label: "غثيان أو إقياء (Nausea or vomiting)",
              dxAdd: addDx(["MI", "ACS", "Oesophagitis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الغثيان والإقياء قد يحدثان في احتشاء القلب الحاد أو الارتجاع المريئي الشديد.", ["MI", "ACS", "Oesophagitis"])
              ]
            },
            coughFever: {
              label: "سعال وحمى (Cough and fever)",
              dxAdd: addDx(["Pneumonia", "Pleurisy", "HF"]),
              dxRemove: addDx(["MI", "ACS"]),
              reasoning: [
                r("السعال مع الحمى يوحي بالتهاب الرئة أو الغشاء البلوري.", ["Pneumonia", "Pleurisy", "HF"])
              ]
            },
            hemoptysis: {
              label: "سعال مصحوب بدم (Hemoptysis)",
              dxAdd: addDx(["PEMajor", "Pneumonia"]),
              dxRemove: addDx([]),
              reasoning: [
                r("نفث الدم مع ألم الصدر هو علامة حمراء (Red Flag) للانصمام الرئوي.", ["PEMajor"])
              ]
            },
            reflux: {
              label: "قلس أو طعم حامض/مر في الفم (Regurgitation or sour/bitter taste)",
              dxAdd: addDx(["Oesophagitis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("القلس والحموضة يدعمان بقوة الارتجاع المريئي.", ["Oesophagitis"])
              ]
            },
            rash: {
              label: "طفح حويصلي فوق المنطقة المؤلمة (Vesicular rash)",
              dxAdd: addDx(["HerpesZoster"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الطفح الحويصلي في نفس التوزع الجلدي يؤكد الهربس النطاقي.", ["HerpesZoster"])
              ]
            },
            anxiety: {
              label: "خفقان، رعشة، شعور بهلاك وشكاوى تنمل (Palpitations, tremor, sense of doom)",
              dxAdd: addDx(["PanicAttack"]),
              dxRemove: addDx(["AorticDissection"]),
              reasoning: [
                r("أعراض فرط التهوية والشعور بالهلاك تشير بقوة لنوبة الهلع.", ["PanicAttack"])
              ]
            }
          }
        },

        {
          id: "episodeDuration",
          sectionId: "hpi",
          sectionLabel: "تاريخ المرض الحالي",
          question: "كم تستمر نوبة الألم الواحدة عادةً؟",
          type: "single",
          options: {
            seconds: {
              label: "بضع ثوانٍ (عابر) (Fleeting seconds)",
              dxAdd: addDx(["PanicAttack", "ChestWallPain"]),
              dxRemove: addDx(["MI", "ACS", "StableAngina"]),
              reasoning: [
                r("الألم العابر الذي يستمر لثوانٍ فقط يستبعد بشكل شبه كامل الألم القلبي الإقفاري.", ["PanicAttack", "ChestWallPain"])
              ]
            },
            short: {
              label: "5–20 دقيقة ويخف بالراحة (5–20 minutes and relieved by rest)",
              dxAdd: addDx(["StableAngina"]),
              dxRemove: addDx(["MI", "ACS"]),
              reasoning: [
                r("النوبات القصيرة التي تخف بالراحة نموذجية للذبحة المستقرة.", ["StableAngina"])
              ]
            },
            long: {
              label: "أكثر من 30 دقيقة ولا يخف بالراحة (More than 30 minutes, not relieved by rest)",
              dxAdd: addDx(["MI", "ACS", "UnstableAngina", "AorticDissection", "PEMajor"]),
              dxRemove: addDx(["StableAngina", "ChestWallPain"]),
              reasoning: [
                r("الألم المطول (> 30 دقيقة) الذي لا يخف بالراحة يقترح احتشاء قلب أو ذبحة غير مستقرة.", ["MI", "ACS", "UnstableAngina"])
              ]
            },
            hours: {
              label: "يستمر لساعات أو أيام (Lasting for hours or days)",
              dxAdd: addDx(["Pericarditis", "Pneumonia", "Pleurisy"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الألم الذي يستمر لساعات أو أيام يرجح التهاب التامور أو الرئة.", ["Pericarditis", "Pneumonia"])
              ]
            }
          }
        },

        {
          id: "course",
          sectionId: "hpi",
          sectionLabel: "تاريخ المرض الحالي",
          question: "كيف تطور الألم منذ بدايته؟",
          type: "single",
          options: {
            regressive: {
              label: "يتحسن بمرور الوقت (Improving over time)",
              dxAdd: addDx(["StableAngina"]),
              dxRemove: addDx(["MI", "ACS"]),
              reasoning: [
                r("الألم التراجعي يتناسب مع نوبة محددة ذاتياً من الذبحة المستقرة.", ["StableAngina"])
              ]
            },
            constant: {
              label: "ثابت، لم يتغير (Constant, unchanged)",
              dxAdd: addDx(["Pleurisy", "Pericarditis", "ChestWallPain"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الألم الصدري البلوري الثابت يمكن رؤيته في التهاب الغشاء البلوري أو التامور.", ["Pleurisy", "Pericarditis"])
              ]
            },
            progressive: {
              label: "يزداد سوءاً تدريجياً (Getting progressively worse)",
              dxAdd: addDx(["MI", "ACS", "AorticDissection", "PEMajor"]),
              dxRemove: addDx(["StableAngina"]),
              reasoning: [
                r("الألم المتفاقم مقلق لتطور احتشاء القلب أو تسلخ الأبهر.", ["MI", "ACS", "AorticDissection"])
              ]
            }
          }
        },

        {
          id: "severity",
          sectionId: "hpi",
          sectionLabel: "تاريخ المرض الحالي",
          question: "ما هي شدة الألم على مقياس من 0 إلى 10؟",
          type: "numeric",
          getDxFromValue: function (n) {
            if (isNaN(n)) return [];
            // Red Flag Score for severity
            if (n >= 8) {
              return ["MI", "ACS", "AorticDissection", "PEMajor"];
            }
            return [];
          },
          reasoningForNumeric: [
            r("الألم الشديد جداً (8/10 فما فوق) يوحي بسبب خطير يهدد الحياة.", ["MI", "ACS", "AorticDissection", "PEMajor"])
          ]
        }
      ]
    },

    {
      id: "ros",
      label: "مراجعة الأجهزة (Review of Systems)",
      steps: [
        {
          id: "rosCVS",
          sectionId: "ros",
          sectionLabel: "مراجعة الأجهزة",
          question: "من الجهاز القلبي الوعائي، هل لديك أي مما يلي؟",
          type: "multi",
          options: {
            palp: {
              label: "خفقان (Palpitations)",
              dxAdd: addDx([]),
              dxRemove: addDx([]),
              reasoning: [
                r("الخفقان قد يشير إلى اضطراب نظم، وهو ما يعقد احتشاء القلب غالباً.", ["MI"])
              ]
            },
            orthopnea: {
              label: "ضيق التنفس عند الاستلقاء (Orthopnea)",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [
                r("ضيق التنفس الاضطجاعي هو سمة مميزة لفشل القلب الأيسر.", ["HF"])
              ]
            },
            pnd: {
              label: "نوبات ضيق تنفس ليلي انتيابي (PND)",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [
                r("ضيق التنفس الليلي الانتيابي يشير بقوة إلى فشل القلب.", ["HF"])
              ]
            },
            legEdema: {
              label: "تورم الساقين (Swelling of the legs)",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الوذمة المحيطية تشير إلى فشل القلب الأيمن أو العالمي.", ["HF"])
              ]
            }
          }
        },

        {
          id: "rosResp",
          sectionId: "ros",
          sectionLabel: "مراجعة الأجهزة",
          question: "من الجهاز التنفسي، هل لديك أي مما يلي؟",
          type: "multi",
          options: {
            cough: {
              label: "سعال (Cough)",
              dxAdd: addDx(["Pneumonia", "HF"]),
              dxRemove: addDx([]),
              reasoning: [
                r("السعال مع ألم الصدر قد يكون بسبب التهاب الرئة أو احتقان رئوي من فشل القلب.", ["Pneumonia", "HF"])
              ]
            },
            wheeze: {
              label: "أزيز (Wheeze)",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الأزيز قد يظهر في الاحتقان الرئوي الحاد من فشل القلب الأيسر.", ["HF"])
              ]
            },
            exertDyspnea: {
              label: "ضيق تنفس جهدي (Exertional shortness of breath)",
              dxAdd: addDx(["HF", "PE"]),
              dxRemove: addDx([]),
              reasoning: [
                r("ضيق التنفس الجهدي يشير إلى ضعف النتاج القلبي أو انسداد الأوعية الرئوية.", ["HF", "PE"])
              ]
            }
          }
        },

        {
          id: "rosGIT",
          sectionId: "ros",
          sectionLabel: "مراجعة الأجهزة",
          question: "من الجهاز الهضمي، هل لديك أي مما يلي؟",
          type: "multi",
          options: {
            distension: {
              label: "انتفاخ بطني (استسقاء محتمل) (Abdominal distension)",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الاستسقاء والانتفاخ البطني ينتجان عن فشل القلب الأيمن مع احتقان كبدي.", ["HF"])
              ]
            },
            rhPain: {
              label: "ألم في منطقة المراق الأيمن (Right hypochondrial pain)",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الانزعاج في المراق الأيمن يعكس تضخماً كبدياً مؤلماً بسبب الاحتقان.", ["HF"])
              ]
            },
            epigastric: {
              label: "ألم شرسوفي (Epigastric pain)",
              dxAdd: addDx(["MI", "ACS", "Oesophagitis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الألم الشرسوفي قد يكون مظهراً معدياً لاحتشاء القلب أو التهاب المريء.", ["MI", "ACS", "Oesophagitis"])
              ]
            }
          }
        },

        {
          id: "rosCNS",
          sectionId: "ros",
          sectionLabel: "مراجعة الأجهزة",
          question: "من الجهاز العصبي، هل لديك أي مما يلي؟",
          type: "multi",
          options: {
            weakRight: {
              label: "ضعف مفاجئ في الجانب الأيمن (Sudden weakness of the right side)",
              dxAdd: addDx(["Stroke"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الضعف المفاجئ أحادي الجانب يدل على سكتة دماغية، والتي تشترك بعوامل الخطر مع مرض القلب الإقفاري.", ["Stroke", "IHD"])
              ]
            },
            weakLeft: {
              label: "ضعف مفاجئ في الجانب الأيسر (Sudden weakness of the left side)",
              dxAdd: addDx(["Stroke"]),
              dxRemove: addDx([]),
              reasoning: [
                r("أي شلل نصفي حاد يجب أن يثير الشك بسكتة دماغية وعائية.", ["Stroke"])
              ]
            }
          }
        },

        {
          id: "rosLM",
          sectionId: "ros",
          sectionLabel: "مراجعة الأجهزة",
          question: "من الجهاز الحركي/الوعائي المحيطي:",
          type: "multi",
          options: {
            claudication: {
              label: "ألم في الساق أثناء المشي يخف بالراحة (Intermittent claudication)",
              dxAdd: addDx(["PAD", "IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [
                r("العرج المتقطع يعكس مرض الشريان المحيطي، الذي له نفس الأساس التصلبي الشرياني لمرض القلب الإقفاري.", ["PAD", "IHD", "ACS"])
              ]
            }
          }
        },

        {
          id: "rosHema",
          sectionId: "ros",
          sectionLabel: "مراجعة الأجهزة",
          question: "من الجهاز الدموي:",
          type: "multi",
          options: {
            fatigue: {
              label: "إرهاق عام (General fatigue)",
              dxAdd: addDx(["Anemia"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الإرهاق العام يوحي بفقر الدم، والذي يمكن أن يفاقم نقص التروية القلبية.", ["Anemia", "IHD"])
              ]
            },
            dizzy: {
              label: "دوار (Dizziness)",
              dxAdd: addDx(["Anemia"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الدوار والدوران قد يكونان بسبب نقص إيصال الأكسجين من فقر الدم.", ["Anemia"])
              ]
            },
            pallor: {
              label: "شحوب الجلد أو الأغشية المخاطية (Pale skin or mucosa)",
              dxAdd: addDx(["Anemia"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الشحوب علامة كلاسيكية لفقر الدم.", ["Anemia"])
              ]
            }
          }
        }
      ]
    },

    {
      id: "pmh",
      label: "التاريخ المرضي السابق",
      steps: [
        {
          id: "pmhChronic",
          sectionId: "pmh",
          sectionLabel: "التاريخ المرضي السابق",
          question: "هل لديك أي أمراض مزمنة؟",
          type: "multi",
          options: {
            dm: {
              label: "داء السكري (Diabetes Mellitus)",
              dxAdd: addDx(["IHD", "ACS", "PAD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("السكري هو عامل خطر رئيسي للتصلب الشرياني المؤدي للإقفار القلبي ومرض الشريان المحيطي.", ["IHD", "ACS", "PAD"])
              ]
            },
            htn: {
              label: "ارتفاع ضغط الدم (Hypertension)",
              dxAdd: addDx(["IHD", "ACS", "AorticAneurysm", "AorticDissection"]),
              dxRemove: addDx([]),
              reasoning: [
                r("ارتفاع ضغط الدم يهيئ لكل من مرض القلب الإقفاري وتسلخ/توسع الأبهر.", ["IHD", "AorticDissection"])
              ]
            },
            dyslipidemia: {
              label: "اضطراب شحوم الدم (Dyslipidemia)",
              dxAdd: addDx(["IHD", "ACS", "PAD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("فرط شحوم الدم يدفع مرض التصلب الشرياني في الشرايين التاجية والمحيطية.", ["IHD", "ACS", "PAD"])
              ]
            },
            ckd: {
              label: "مرض الكلى المزمن (Chronic Kidney Disease)",
              dxAdd: addDx(["HF", "Anemia"]),
              dxRemove: addDx([]),
              reasoning: [
                r("مرض الكلى المزمن يرتبط بفقر الدم وتسارع التصلب الشرياني.", ["HF", "Anemia"])
              ]
            }
          }
        }
      ]
    },

    {
      id: "psh",
      label: "التاريخ الجراحي السابق",
      steps: [
        {
          id: "pshOps",
          sectionId: "psh",
          sectionLabel: "التاريخ الجراحي السابق",
          question: "هل خضعت لأي من الإجراءات التالية؟",
          type: "multi",
          options: {
            cabg: {
              label: "عملية قلب مفتوح / مجازة تاجية (CABG)",
              dxAdd: addDx(["IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [
                r("جراحة المجازة التاجية السابقة تشير إلى مرض قلب إقفاري مؤكد.", ["IHD", "ACS"])
              ]
            },
            pci: {
              label: "توسيع شريان تاجي / قسطرة (PCI)",
              dxAdd: addDx(["IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [
                r("القسطرة التاجية السابقة تؤكد وجود مرض شريان تاجي هام.", ["IHD", "ACS"])
              ]
            },
            amputation: {
              label: "بتر طرف بسبب الغرغرينا السكرية (Limb amputation)",
              dxAdd: addDx(["PAD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("البتر بسبب القدم السكرية يعكس مرض شريان محيطي شديد.", ["PAD"])
              ]
            },
            majorSurgery: {
              label: "جراحة كبرى حديثة أو تثبيت لفترة طويلة (Recent major surgery or prolonged immobilization)",
              dxAdd: addDx(["PEMajor"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الجراحة الكبرى والجمود عوامل محرضة قوية للانصمام الرئوي.", ["PEMajor"])
              ]
            }
          }
        }
      ]
    },

    {
      id: "dh",
      label: "تاريخ الأدوية",
      steps: [
        {
          id: "drugHistory",
          sectionId: "dh",
          sectionLabel: "تاريخ الأدوية",
          question: "ما هي الأدوية المزمنة التي تتناولها؟",
          type: "multi",
          options: {
            insulin: {
              label: "الأنسولين (Insulin)",
              dxAdd: addDx(["IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [
                r("استخدام الأنسولين يدل على سكري طويل الأمد، وهو عامل خطر رئيسي للإقفار القلبي.", ["IHD", "ACS"])
              ]
            },
            acei: {
              label: "مثبط الإنزيم المحول للأنجيوتنسين (ACE inhibitor)",
              dxAdd: addDx(["HF", "IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [
                r("تستخدم مثبطات ACE عادةً لفشل القلب ومرض القلب الإقفاري.", ["HF", "IHD", "ACS"])
              ]
            },
            aspirin: {
              label: "الأسبرين (Aspirin)",
              dxAdd: addDx(["IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الاستخدام المزمن للأسبرين يشير إلى وقاية ثانوية لمرض القلب الإقفاري.", ["IHD", "ACS"])
              ]
            },
            statin: {
              label: "الستاتين (Statin)",
              dxAdd: addDx(["IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [
                r("تُعطى الستاتينات لاضطراب شحوم الدم والوقاية من أحداث التصلب الشرياني.", ["IHD", "ACS"])
              ]
            },
            anticoag: {
              label: "مضاد تخثر فموي (Oral anticoagulant)",
              dxAdd: addDx(["PE", "Stroke"]),
              dxRemove: addDx([]),
              reasoning: [
                r("مضادات التخثر تشير إلى خثار صمي سابق أو رجفان أذيني.", ["PE", "Stroke"])
              ]
            }
          }
        }
      ]
    },

    {
      id: "fh",
      label: "التاريخ العائلي",
      steps: [
        {
          id: "familyHistory",
          sectionId: "fh",
          sectionLabel: "التاريخ العائلي",
          question: "هل يوجد تاريخ عائلي ذي صلة؟",
          type: "multi",
          options: {
            ihdFamily: {
              label: "مرض القلب الإقفاري لدى قريب من الدرجة الأولى (IHD in a first-degree relative)",
              dxAdd: addDx(["IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [
                r("التاريخ العائلي لمرض القلب الإقفاري يشير إلى استعداد وراثي قوي.", ["IHD", "ACS"])
              ]
            },
            suddenDeath: {
              label: "وفاة قلبية مفاجئة غير مفسرة في العائلة (Sudden unexplained cardiac death)",
              dxAdd: addDx(["IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الوفيات القلبية المفاجئة في العائلة قد تعكس اضطراب نظم موروث أو مرض إقفاري شديد.", ["IHD", "ACS"])
              ]
            },
            dmHtnFamily: {
              label: "سكري أو ارتفاع ضغط دم في العائلة (Diabetes or Hypertension in the family)",
              dxAdd: addDx(["IHD", "ACS", "PAD", "Stroke"]),
              dxRemove: addDx([]),
              reasoning: [
                r("تجمع السكري وارتفاع الضغط في العائلة يدعم خطر الأوعية القلبية التصلبية.", ["IHD", "ACS", "Stroke"])
              ]
            }
          }
        }
      ]
    },

    {
      id: "sh",
      label: "التاريخ الاجتماعي",
      steps: [
        {
          id: "socialHistory",
          sectionId: "sh",
          sectionLabel: "التاريخ الاجتماعي",
          question: "ماذا عن نمط الحياة والعادات؟ (التدخين، الكحول، المهنة)",
          type: "multi",
          options: {
            smoker: {
              label: "مدخن حالي (Current smoker)",
              dxAdd: addDx(["IHD", "ACS", "PAD", "PE", "Pneumothorax"]),
              dxRemove: addDx([]),
              reasoning: [
                r("التدخين يسرّع التصلب الشرياني ويزيد خطر الإقفار، وهو أيضاً عامل خطر لاسترواح الصدر.", ["IHD", "ACS", "PAD", "PE", "Pneumothorax"])
              ]
            },
            exSmoker: {
              label: "مدخن سابق (Ex-smoker)",
              dxAdd: addDx(["IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [
                r("المدخنون السابقون يحتفظون بخطر قلبي وعائي لسنوات عديدة بعد الإقلاع.", ["IHD", "ACS"])
              ]
            },
            alcohol: {
              label: "تناول منتظم للكحول (Regular alcohol intake)",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [
                r("الاستهلاك المفرط للكحول قد يساهم في اعتلال عضلة القلب وفشل القلب.", ["HF"])
              ]
            },
            sedentary: {
              label: "نمط حياة خامل (Sedentary lifestyle)",
              dxAdd: addDx(["IHD", "ACS", "PAD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("نمط الحياة الخامل يعزز السمنة وأمراض القلب الوعائية التصلبية.", ["IHD", "ACS", "PAD"])
              ]
            },
            active: {
              label: "نشاط بدني منتظم (Regular physical activity)",
              dxAdd: addDx([]),
              dxRemove: addDx([]),
              reasoning: [
                r("التمارين المنتظمة واقية ولكنها لا تستبعد تماماً أمراض القلب.", [])
              ]
            }
          }
        }
      ]
    }
    
  ];

  // Expose as global
  global.ChestData = {
    dxGroups: DX_GROUPS,
    diagnoses: DIAGNOSES,
    sections: SECTIONS
  };

})(window);
