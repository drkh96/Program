// ========================================
// Data.js
// Chest pain history data (Arabic Qs + English Key Terms + English DDx)
// ========================================

"use strict";

(function (global) {

  // ======================================
  // 1) DIAGNOSES & GROUPS (All English)
  // ======================================

  const DX_GROUPS = {
    cardiac:  { id: "cardiac",  label: "Cardiac",  order: 1 },
    aorta:    { id: "aorta",    label: "Aorta",    order: 2 },
    pulmonary:{ id: "pulmonary",label: "Pulmonary",order: 3 },
    pleural:  { id: "pleural",  label: "Pleura",   order: 4 },
    chestWall:{ id: "chestWall",label: "Chest wall",order: 5 },
    oesophagus:{id: "oesophagus",label:"Oesophagus",order: 6},
    neuro:    { id: "neuro",    label: "Neurologic",order: 7 },
    peripheral:{id: "peripheral",label:"Peripheral Vascular",order: 8},
    hema:     { id: "hema",     label: "Hematologic",order: 9 },
    psych:    { id: "psych",    label: "Psychological",order: 10 }
  };

  const DIAGNOSES = [
    { 
      id: "IHD", label: "Ischemic Heart Disease", group: "cardiac",
      keyMissingFeatures: ["ECG changes (ST depression)", "Elevated Cardiac Troponin", "Signs of Heart Failure"]
    },
    { 
      id: "StableAngina", label: "Stable Angina", group: "cardiac",
      keyMissingFeatures: ["Normal resting ECG", "Normal Cardiac Troponin", "Positive Stress Test"]
    },
    { 
      id: "UnstableAngina", label: "Unstable Angina", group: "cardiac",
      keyMissingFeatures: ["ECG changes (ST depression)", "Troponin often negative"]
    },
    { 
      id: "MI", label: "Myocardial Infarction", group: "cardiac",
      keyMissingFeatures: ["ECG changes (ST elevation or new LBBB)", "Marked Troponin elevation"]
    },
    { 
      id: "ACS", label: "Acute Coronary Syndrome", group: "cardiac",
      keyMissingFeatures: ["ECG changes (any new ischemia)", "Troponin status", "Ischemia confirmed by imaging/labs"]
    },
    { id: "Myocarditis",label: "Myocarditis", group: "cardiac" },
    { 
      id: "Pericarditis", label:"Pericarditis", group: "cardiac",
      keyMissingFeatures: ["Pericardial friction rub", "Diffuse ST elevation on ECG"]
    },
    { id: "MVP", label: "Mitral Valve Prolapse",  group: "cardiac" },
    { id: "HF", label: "Heart Failure", group: "cardiac" },
    { id: "AorticAneurysm", label: "Aortic Aneurysm", group: "aorta" },
    { 
      id: "AorticDissection", label: "Aortic Dissection", group: "aorta",
      keyMissingFeatures: ["Inter-arm BP difference (> 20 mmHg)", "New Aortic Regurgitation", "Pulse deficits"]
    },
    { id: "PE", label: "Pulmonary Embolism", group: "pulmonary" },
    { 
      id: "PEMajor", label: "Pulmonary Embolism (Major)", group: "pulmonary",
      keyMissingFeatures: ["Tachypnea", "Tachycardia", "Signs of DVT", "Low O2 Saturation"]
    },
    { id: "Pneumonia",  label: "Pneumonia", group: "pulmonary" },
    { id: "PulmInfarct",label: "Pulmonary Infarction", group: "pulmonary" },
    { id: "Pleurisy", label: "Pleurisy", group: "pleural" },
    { id: "Pneumothorax", label: "Pneumothorax", group: "pleural" },
    { id: "ChestWallPain", label: "Chest Wall / Costochondritis", group: "chestWall" },
    { id: "RibFracture", label: "Rib Fracture", group: "chestWall" },
    { id: "HerpesZoster", label: "Herpes Zoster", group: "chestWall" },
    { id: "Oesophagitis", label: "Oesophagitis", group: "oesophagus" },
    { id: "EsophagealSpasm", label: "Esophageal Spasm", group: "oesophagus" },
    { id: "Stroke", label: "Stroke (CVA)", group: "neuro" },
    { id: "PAD", label: "Peripheral Arterial Disease", group: "peripheral" },
    { id: "Anemia", label: "Anemia", group: "hema" },
    { id: "PanicAttack", label: "Panic Attack / Anxiety", group: "psych",
      keyMissingFeatures: ["Normal physical exam", "Normal investigations", "Absence of organic risk factors"]
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
  // 2) HISTORY SECTIONS & STEPS (Arabic Qs + Arabic Options with English Key Terms)
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
            "Age is a critical risk factor. Low age lowers probability of cardiac events; advanced age raises the risk significantly.",
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
                "Male sex is a classical risk factor for atherosclerotic ischemic heart disease.",
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
                "Female sex does not exclude cardiac pain, but pre-menopausal women have lower IHD risk.",
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

          if (v.includes("min") || v.includes("minute") || v.includes("hour") || v.includes("hr") || v.includes("ساعة") || v.includes("دقيقة")) {
            return [
              { add: ["MI", "UnstableAngina", "ACS", "Pneumothorax", "PEMajor", "AorticDissection"], remove: [], featureText: "Acute onset (minutes/hours)" }
            ];
          }

          if (v.includes("day") || v.includes("yesterday") || v.includes("يوم")) {
            return [
              { add: ["Pneumonia", "Pericarditis"], remove: [] , featureText: "Subacute onset (days)" }
            ];
          }

          if (v.includes("week") || v.includes("month") || v.includes("أسبوع") || v.includes("شهر")) {
            return [
              { add: ["StableAngina", "HF", "PAD", "Anemia", "ChestWallPain"], remove: [], featureText: "Chronic duration (weeks/months)" }
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
              label: "ألم خلف القص مركزي (Central retrosternal)",
              dxAdd: addDx(["IHD", "StableAngina", "UnstableAngina", "MI", "ACS", "Myocarditis", "Pericarditis", "MVP", "AorticDissection", "AorticAneurysm", "Oesophagitis", "PEMajor"]),
              dxRemove: addDx(["Pleurisy", "Pneumothorax", "Pneumonia", "ChestWallPain", "HerpesZoster"]),
              reasoning: [
                r("Central retrosternal pain is classic for myocardial ischemia and other mediastinal causes.", ["IHD", "MI", "ACS"]),
                r("Non-localized central pain makes pleural, chest wall and dermatomal causes less likely.", [])
              ]
            },
            peripheral: {
              label: "ألم صدري جانبي أحادي الجانب (Lateral chest pain)",
              dxAdd: addDx(["Pleurisy", "Pneumothorax", "Pneumonia", "PulmInfarct", "HerpesZoster"]),
              dxRemove: addDx(["IHD", "MI", "ACS", "AorticDissection", "Oesophagitis"]),
              reasoning: [
                r("Unilateral peripheral pain is often pleuritic, suggesting pleurisy, pneumothorax or pneumonia.", ["Pleurisy", "Pneumothorax", "Pneumonia"])
              ]
            },
            localized: {
              label: "ألم نقطي موضعي جداً (Localized point pain)",
              dxAdd: addDx(["ChestWallPain", "RibFracture"]),
              dxRemove: addDx(["MI", "ACS", "Pleurisy", "Pneumothorax", "AorticDissection"]),
              reasoning: [
                r("Very localized pain (fingertip area) is more typical of chest wall pathology.", ["ChestWallPain", "RibFracture"])
              ]
            },
            band: {
              label: "ألم شريطي يتبع توزع جلدي (Dermatomal band)",
              dxAdd: addDx(["HerpesZoster"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Band-like pain in a dermatomal distribution strongly suggests herpes zoster.", ["HerpesZoster"])
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
                r("Sudden onset chest pain is typical of myocardial infarction, pulmonary embolism, pneumothorax or aortic dissection.", ["MI", "ACS", "PEMajor", "Pneumothorax", "AorticDissection"])
              ]
            },
            gradual: {
              label: "تدريجياً خلال ساعات أو أيام (Gradually)",
              dxAdd: addDx(["StableAngina", "Myocarditis", "Pericarditis", "Pneumonia", "Oesophagitis", "ChestWallPain"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Gradual onset pain fits better with stable angina, pericarditis, pneumonia or oesophagitis.", ["StableAngina", "Pericarditis", "Pneumonia", "Oesophagitis"])
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
              label: "ضيق / ثقل / ضغط (Tightness/Pressure)",
              dxAdd: addDx(["IHD", "StableAngina", "UnstableAngina", "MI", "ACS", "Myocarditis"]),
              dxRemove: addDx(["ChestWallPain", "Pleurisy"]),
              reasoning: [
                r("Classical heavy or tight chest pain is strongly suggestive of myocardial ischemia.", ["IHD", "MI", "ACS"])
              ]
            },
            sharp: {
              label: "ألم حاد أو طاعن يزداد مع التنفس (Sharp/Pleuritic)",
              dxAdd: addDx(["Pleurisy", "Pericarditis", "Pneumothorax", "Pneumonia"]),
              dxRemove: addDx(["MI", "ACS", "AorticDissection"]),
              reasoning: [
                r("Sharp, pleuritic pain worsened by inspiration suggests pleural or pericardial disease.", ["Pleurisy", "Pericarditis", "Pneumothorax", "Pneumonia"])
              ]
            },
            burning: {
              label: "ألم حارق مشابه لحرقة المعدة (Burning/Heartburn)",
              dxAdd: addDx(["Oesophagitis", "EsophagealSpasm"]),
              dxRemove: addDx(["MI", "ACS"]),
              reasoning: [
                r("Burning retrosternal pain is typical of oesophagitis or oesophageal spasm.", ["Oesophagitis", "EsophagealSpasm"])
              ]
            },
            tearing: {
              label: "ألم تمزيقي يشع إلى الظهر (Tearing/Back)",
              dxAdd: addDx(["AorticDissection"]),
              dxRemove: addDx(["MI", "ACS"]),
              reasoning: [
                r("Tearing, back-radiating pain is classical for aortic dissection.", ["AorticDissection"])
              ]
            },
            nonSpecific: {
              label: "غير نوعي، متقطع، عابر، أو حاد غير بلوري (Fleeting/Non-specific)",
              dxAdd: addDx(["PanicAttack"]),
              dxRemove: addDx(["MI", "ACS", "AorticDissection"]),
              reasoning: [
                r("Fleeting, sharp, non-pleuritic pain is less typical of serious causes and more of anxiety/chest wall.", ["PanicAttack", "ChestWallPain"])
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
              label: "إلى الفك، الرقبة، الذراع اليسرى، أو الشرسوف (Jaw/Arm/Epigastrium)",
              dxAdd: addDx(["IHD", "StableAngina", "UnstableAngina", "MI", "ACS"]),
              dxRemove: addDx(["ChestWallPain"]),
              reasoning: [
                r("Radiation to jaw, neck or left arm is classical for ischemic cardiac pain.", ["IHD", "MI", "ACS"])
              ]
            },
            back: {
              label: "إلى الظهر بين لوحي الكتف (Inter-scapular back)",
              dxAdd: addDx(["AorticDissection"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Inter-scapular radiation fits with aortic dissection.", ["AorticDissection"])
              ]
            },
            none: {
              label: "لا يوجد إشعاع (No radiation)",
              dxAdd: addDx(["ChestWallPain", "HerpesZoster", "PanicAttack"]),
              dxRemove: addDx(["MI", "ACS"]),
              reasoning: [
                r("Pain without radiation is more typical of localized pain or anxiety.", ["ChestWallPain", "HerpesZoster", "PanicAttack"])
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
              label: "يخف بالراحة أو باستخدام النتروغليسرين (Rest/Nitroglycerin)",
              dxAdd: addDx(["StableAngina"]),
              dxRemove: addDx(["MI", "ACS"]),
              reasoning: [
                r("Pain relieved by rest or nitrates is very typical of stable angina.", ["StableAngina"])
              ]
            },
            forward: {
              label: "يخف بالجلوس والإنحناء للأمام (Leaning forward)",
              dxAdd: addDx(["Pericarditis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Pericarditic pain characteristically improves when leaning forward.", ["Pericarditis"])
              ]
            },
            antacid: {
              label: "يخف بمضادات الحموضة أو الجلوس منتصباً (Antacids/Upright)",
              dxAdd: addDx(["Oesophagitis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Improvement with antacids or upright posture suggests oesophageal reflux/oesophagitis.", ["Oesophagitis"])
              ]
            },
            avoidMovement: {
              label: "يخف بتجنب حركة جدار الصدر (Avoiding chest movement)",
              dxAdd: addDx(["ChestWallPain"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Pain that improves when the chest wall is kept still suggests musculoskeletal pain.", ["ChestWallPain"])
              ]
            },
            nothing: {
              label: "لا يخف بأي شيء تقريباً (No relief)",
              dxAdd: addDx(["MI", "ACS", "PEMajor", "AorticDissection"]),
              dxRemove: addDx(["StableAngina"]),
              reasoning: [
                r("Severe pain not relieved by rest raises concern for acute MI or major PE.", ["MI", "ACS", "PEMajor"])
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
              label: "يزداد مع الجهد، العاطفة أو البرد (Exertion/Emotion)",
              dxAdd: addDx(["StableAngina", "UnstableAngina", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Effort-related pain is classical for angina pectoris.", ["StableAngina", "UnstableAngina", "ACS"])
              ]
            },
            breath: {
              label: "يزداد مع الشهيق، السعال أو التنفس (Inspiration/Cough)",
              dxAdd: addDx(["Pleurisy", "Pericarditis", "Pneumothorax", "Pneumonia"]),
              dxRemove: addDx(["MI", "ACS"]),
              reasoning: [
                r("Pain aggravated by inspiration points to pleural or pericardial disease.", ["Pleurisy", "Pericarditis", "Pneumothorax", "Pneumonia"])
              ]
            },
            meal: {
              label: "يزداد بعد وجبة دسمة أو عند الاستلقاء (Heavy meal/Lying flat)",
              dxAdd: addDx(["Oesophagitis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Worsening with heavy meals and lying flat suggests reflux oesophagitis.", ["Oesophagitis"])
              ]
            },
            motion: {
              label: "يزداد مع حركة جدار الصدر أو بالجس (Movement/Palpation)",
              dxAdd: addDx(["ChestWallPain", "RibFracture"]),
              dxRemove: addDx(["MI", "ACS", "AorticDissection"]),
              reasoning: [
                r("Pain reproduced by movement or palpation indicates musculoskeletal origin.", ["ChestWallPain", "RibFracture"])
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
              label: "ضيق التنفس (Dyspnea)",
              dxAdd: addDx(["MI", "ACS", "UnstableAngina", "HF", "PEMajor", "Pneumothorax"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Dyspnea suggests acute ischemia, pulmonary embolism or evolving heart failure.", ["MI", "ACS", "PEMajor", "HF"])
              ]
            },
            sweating: {
              label: "تعرق غزير (Profuse sweating)",
              dxAdd: addDx(["MI", "ACS", "UnstableAngina"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Autonomic symptoms such as heavy sweating are typical of acute myocardial infarction.", ["MI", "ACS"])
              ]
            },
            vomiting: {
              label: "غثيان أو إقياء (Nausea or vomiting)",
              dxAdd: addDx(["MI", "ACS", "Oesophagitis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Nausea and vomiting may occur in acute MI or severe oesophageal reflux.", ["MI", "ACS", "Oesophagitis"])
              ]
            },
            coughFever: {
              label: "سعال وحمى (Cough and fever)",
              dxAdd: addDx(["Pneumonia", "Pleurisy", "HF"]),
              dxRemove: addDx(["MI", "ACS"]),
              reasoning: [
                r("Cough with fever is more suggestive of pneumonia or pleurisy.", ["Pneumonia", "Pleurisy", "HF"])
              ]
            },
            hemoptysis: {
              label: "سعال مصحوب بدم (Hemoptysis)",
              dxAdd: addDx(["PEMajor", "Pneumonia"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Hemoptysis in the context of chest pain is a red flag for pulmonary embolism (PE).", ["PEMajor"])
              ]
            },
            reflux: {
              label: "قلس أو طعم حامض/مر في الفم (Regurgitation)",
              dxAdd: addDx(["Oesophagitis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Water-brash and regurgitation strongly support oesophageal reflux.", ["Oesophagitis"])
              ]
            },
            rash: {
              label: "طفح حويصلي فوق المنطقة المؤلمة (Vesicular rash)",
              dxAdd: addDx(["HerpesZoster"]),
              dxRemove: addDx([]),
              reasoning: [
                r("A vesicular rash in the same dermatome confirms herpes zoster.", ["HerpesZoster"])
              ]
            },
            anxiety: {
              label: "خفقان، رعشة، شعور بهلاك وشكاوى تنمل (Palpitations, sense of doom)",
              dxAdd: addDx(["PanicAttack"]),
              dxRemove: addDx(["AorticDissection"]),
              reasoning: [
                r("Hyperventilation symptoms and sense of doom point strongly toward a panic attack.", ["PanicAttack"])
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
                r("Fleeting pain that lasts only a few seconds virtually rules out ischemic cardiac pain.", ["PanicAttack", "ChestWallPain"])
              ]
            },
            short: {
              label: "5–20 دقيقة ويخف بالراحة (5–20 minutes, relieved by rest)",
              dxAdd: addDx(["StableAngina"]),
              dxRemove: addDx(["MI", "ACS"]),
              reasoning: [
                r("Brief episodes lasting 5–20 minutes and relieved by rest are typical of stable angina.", ["StableAngina"])
              ]
            },
            long: {
              label: "أكثر من 30 دقيقة ولا يخف بالراحة (Longer than 30 minutes, no relief)",
              dxAdd: addDx(["MI", "ACS", "UnstableAngina", "AorticDissection", "PEMajor"]),
              dxRemove: addDx(["StableAngina", "ChestWallPain"]),
              reasoning: [
                r("Prolonged pain >30 minutes not relieved by rest suggests myocardial infarction or unstable angina.", ["MI", "ACS", "UnstableAngina"])
              ]
            },
            hours: {
              label: "يستمر لساعات أو أيام (Hours or days)",
              dxAdd: addDx(["Pericarditis", "Pneumonia", "Pleurisy"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Pain lasting hours to days is more in favour of pericarditis or pneumonia.", ["Pericarditis", "Pneumonia"])
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
              label: "يتحسن بمرور الوقت (Improving)",
              dxAdd: addDx(["StableAngina"]),
              dxRemove: addDx(["MI", "ACS"]),
              reasoning: [
                r("Regressive pain fits a self-limited episode of stable angina.", ["StableAngina"])
              ]
            },
            constant: {
              label: "ثابت، لم يتغير (Constant)",
              dxAdd: addDx(["Pleurisy", "Pericarditis", "ChestWallPain"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Constant chest pain can be seen in pleurisy or pericarditis.", ["Pleurisy", "Pericarditis"])
              ]
            },
            progressive: {
              label: "يزداد سوءاً تدريجياً (Progressively worse)",
              dxAdd: addDx(["MI", "ACS", "AorticDissection", "PEMajor"]),
              dxRemove: addDx(["StableAngina"]),
              reasoning: [
                r("Progressively worsening chest pain is worrying for evolving MI or aortic dissection.", ["MI", "ACS", "AorticDissection"])
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
            if (n >= 8) {
              return ["MI", "ACS", "AorticDissection", "PEMajor"];
            }
            return [];
          },
          reasoningForNumeric: [
            r("Very severe pain (≥ 8/10) suggests a serious, potentially life-threatening cause.", ["MI", "ACS", "AorticDissection", "PEMajor"])
          ]
        }
      ]
    },

    {
      id: "ros",
      label: "مراجعة الأجهزة",
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
              reasoning: [ r("Palpitations may indicate arrhythmia, often a complication of MI.", ["MI"]) ]
            },
            orthopnea: {
              label: "ضيق التنفس عند الاستلقاء (Orthopnea)",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [ r("Orthopnea is a hallmark symptom of left-sided heart failure.", ["HF"]) ]
            },
            pnd: {
              label: "نوبات ضيق تنفس ليلي انتيابي (PND)",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [ r("Paroxysmal nocturnal dyspnea strongly suggests heart failure.", ["HF"]) ]
            },
            legEdema: {
              label: "تورم الساقين (Leg swelling/DVT risk)",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [ r("Peripheral edema indicates heart failure, or DVT risk for PE.", ["HF", "PE"]) ]
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
              reasoning: [ r("Cough with chest pain can be due to pneumonia or pulmonary congestion in heart failure.", ["Pneumonia", "HF"]) ]
            },
            wheeze: {
              label: "أزيز (Wheeze)",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [ r("Wheeze may occur in acute pulmonary congestion ('cardiac asthma').", ["HF"]) ]
            },
            exertDyspnea: {
              label: "ضيق تنفس جهدي (Exertional dyspnea)",
              dxAdd: addDx(["HF", "PE"]),
              dxRemove: addDx([]),
              reasoning: [ r("Exertional dyspnea indicates low cardiac output or pulmonary vascular obstruction.", ["HF", "PE"]) ]
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
              reasoning: [ r("Abdominal distension suggests right-sided heart failure with hepatic congestion.", ["HF"]) ]
            },
            rhPain: {
              label: "ألم في منطقة المراق الأيمن (Right hypochondrial pain)",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [ r("Right hypochondrial pain reflects tender hepatomegaly due to congestion.", ["HF"]) ]
            },
            epigastric: {
              label: "ألم شرسوفي (Epigastric pain)",
              dxAdd: addDx(["MI", "ACS", "Oesophagitis"]),
              dxRemove: addDx([]),
              reasoning: [ r("Epigastric pain can be an atypical presentation of MI or oesophagitis.", ["MI", "ACS", "Oesophagitis"]) ]
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
              label: "ضعف مفاجئ في الجانب الأيمن (Right sided weakness)",
              dxAdd: addDx(["Stroke"]),
              dxRemove: addDx([]),
              reasoning: [ r("Sudden unilateral weakness suggests a stroke, sharing risk factors with IHD.", ["Stroke", "IHD"]) ]
            },
            weakLeft: {
              label: "ضعف مفاجئ في الجانب الأيسر (Left sided weakness)",
              dxAdd: addDx(["Stroke"]),
              dxRemove: addDx([]),
              reasoning: [ r("Acute hemiparesis should raise suspicion of a vascular stroke.", ["Stroke"]) ]
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
              reasoning: [ r("Intermittent claudication reflects PAD, which shares the same atherosclerotic basis as IHD.", ["PAD", "IHD", "ACS"]) ]
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
              label: "إرهاق عام (Fatigue)",
              dxAdd: addDx(["Anemia"]),
              dxRemove: addDx([]),
              reasoning: [ r("General fatigue suggests anemia, which can exacerbate cardiac ischemia.", ["Anemia", "IHD"]) ]
            },
            dizzy: {
              label: "دوار (Dizziness)",
              dxAdd: addDx(["Anemia"]),
              dxRemove: addDx([]),
              reasoning: [ r("Dizziness may be due to reduced oxygen delivery from anemia.", ["Anemia"]) ]
            },
            pallor: {
              label: "شحوب الجلد أو الأغشية المخاطية (Pallor)",
              dxAdd: addDx(["Anemia"]),
              dxRemove: addDx([]),
              reasoning: [ r("Pallor is a classical sign of anemia.", ["Anemia"]) ]
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
              reasoning: [ r("Diabetes is a major risk factor for atherosclerosis leading to ischemic heart disease and PAD.", ["IHD", "ACS", "PAD"]) ]
            },
            htn: {
              label: "ارتفاع ضغط الدم (Hypertension)",
              dxAdd: addDx(["IHD", "ACS", "AorticAneurysm", "AorticDissection"]),
              dxRemove: addDx([]),
              reasoning: [ r("Hypertension predisposes to both ischemic heart disease and aortic aneurysm/dissection.", ["IHD", "AorticDissection"]) ]
            },
            dyslipidemia: {
              label: "اضطراب شحوم الدم (Dyslipidemia)",
              dxAdd: addDx(["IHD", "ACS", "PAD"]),
              dxRemove: addDx([]),
              reasoning: [ r("Hyperlipidemia drives atherosclerotic disease in coronary and peripheral arteries.", ["IHD", "ACS", "PAD"]) ]
            },
            ckd: {
              label: "مرض الكلى المزمن (Chronic Kidney Disease)",
              dxAdd: addDx(["HF", "Anemia"]),
              dxRemove: addDx([]),
              reasoning: [ r("Chronic kidney disease is associated with anemia and accelerated atherosclerosis.", ["HF", "Anemia"]) ]
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
              reasoning: [ r("Previous CABG indicates established ischemic heart disease.", ["IHD", "ACS"]) ]
            },
            pci: {
              label: "توسيع شريان تاجي / قسطرة (PCI)",
              dxAdd: addDx(["IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [ r("Previous PCI confirms significant coronary artery disease.", ["IHD", "ACS"]) ]
            },
            amputation: {
              label: "بتر طرف بسبب الغرغرينا السكرية (Limb amputation)",
              dxAdd: addDx(["PAD"]),
              dxRemove: addDx([]),
              reasoning: [ r("Amputation for diabetic foot gangrene reflects severe peripheral arterial disease.", ["PAD"]) ]
            },
            majorSurgery: {
              label: "جراحة كبرى حديثة أو تثبيت لفترة طويلة (Major surgery/Immobilization)",
              dxAdd: addDx(["PEMajor"]),
              dxRemove: addDx([]),
              reasoning: [ r("Major surgery and immobility are strong provoking factors for pulmonary embolism (PE).", ["PEMajor"]) ]
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
              reasoning: [ r("Insulin use implies long-standing diabetes, a major risk factor for IHD.", ["IHD", "ACS"]) ]
            },
            acei: {
              label: "مثبط الإنزيم المحول للأنجيوتنسين (ACE inhibitor)",
              dxAdd: addDx(["HF", "IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [ r("ACE inhibitors are commonly used for heart failure and ischemic heart disease.", ["HF", "IHD", "ACS"]) ]
            },
            aspirin: {
              label: "الأسبرين (Aspirin)",
              dxAdd: addDx(["IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [ r("Chronic aspirin use suggests secondary prevention for ischemic heart disease.", ["IHD", "ACS"]) ]
            },
            statin: {
              label: "الستاتين (Statin)",
              dxAdd: addDx(["IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [ r("Statins are given for dyslipidemia and prevention of atherosclerotic events.", ["IHD", "ACS"]) ]
            },
            anticoag: {
              label: "مضاد تخثر فموي (Oral anticoagulant)",
              dxAdd: addDx(["PE", "Stroke"]),
              dxRemove: addDx([]),
              reasoning: [ r("Long-term anticoagulation suggests previous thromboembolism or atrial fibrillation.", ["PE", "Stroke"]) ]
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
              label: "مرض القلب الإقفاري لدى قريب من الدرجة الأولى (Family history of IHD)",
              dxAdd: addDx(["IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [ r("Family history of IHD in first-degree relatives indicates strong genetic predisposition.", ["IHD", "ACS"]) ]
            },
            suddenDeath: {
              label: "وفاة قلبية مفاجئة غير مفسرة في العائلة (Sudden cardiac death)",
              dxAdd: addDx(["IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [ r("Sudden cardiac deaths in the family may reflect inherited arrhythmia or severe ischemic disease.", ["IHD", "ACS"]) ]
            },
            dmHtnFamily: {
              label: "سكري أو ارتفاع ضغط دم في العائلة (Family history of DM/HTN)",
              dxAdd: addDx(["IHD", "ACS", "PAD", "Stroke"]),
              dxRemove: addDx([]),
              reasoning: [ r("Family clustering of diabetes and hypertension supports atherosclerotic cardiovascular risk.", ["IHD", "ACS", "Stroke"]) ]
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
              reasoning: [ r("Smoking accelerates atherosclerosis and increases risk of IHD, PAD and pulmonary embolism.", ["IHD", "ACS", "PAD", "PE", "Pneumothorax"]) ]
            },
            exSmoker: {
              label: "مدخن سابق (Ex-smoker)",
              dxAdd: addDx(["IHD", "ACS"]),
              dxRemove: addDx([]),
              reasoning: [ r("Ex-smokers retain cardiovascular risk for many years after quitting.", ["IHD", "ACS"]) ]
            },
            alcohol: {
              label: "تناول منتظم للكحول (Regular alcohol intake)",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [ r("Heavy alcohol consumption may contribute to cardiomyopathy and arrhythmia, potentially leading to heart failure.", ["HF"]) ]
            },
            sedentary: {
              label: "نمط حياة خامل (Sedentary lifestyle)",
              dxAdd: addDx(["IHD", "ACS", "PAD"]),
              dxRemove: addDx([]),
              reasoning: [ r("Sedentary lifestyle promotes obesity and atherosclerotic cardiovascular disease.", ["IHD", "ACS", "PAD"]) ]
            },
            active: {
              label: "نشاط بدني منتظم (Regular physical activity)",
              dxAdd: addDx([]),
              dxRemove: addDx([]),
              reasoning: [ r("Regular exercise is protective but does not fully exclude cardiac disease.", []) ]
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
