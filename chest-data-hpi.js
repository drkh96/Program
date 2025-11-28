// ========================================
// chest-data-hpi.js
// Detailed HPI (bilingual labels, EN reasoning)
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
    labelEn: "History of Present Illness",
    steps: [
      {
        id: "onset",
        sectionId: "hpi",
        sectionLabel: "HPI",
        sectionLabelEn: "HPI",
        question: "كيف كانت بداية الألم؟",
        questionEn: "How did the chest pain start?",
        type: "single",
        required: true,
        options: {
          sudden1min: {
            label: "بداية فجائية خلال أقل من دقيقة، ألم شديد جداً",
            labelEn: "Sudden onset within < 1 minute, very severe pain",
            dxAdd: dx(["MI", "PEMajor", "Dissection"]),
            dxRemove: dx(["GERD", "Musculoskeletal"]),
            reasoning: [
              r(
                "Very sudden onset of severe chest pain strongly raises concern for acute myocardial infarction, pulmonary embolism, or aortic dissection.",
                ["MI", "PEMajor", "Dissection"]
              )
            ]
          },
          sudden10min: {
            label: "بداية سريعة خلال 10 دقائق",
            labelEn: "Rapid onset over about 10 minutes",
            dxAdd: dx(["MI", "UnstableAngina", "PEMajor"]),
            dxRemove: dx(["GERD"]),
            reasoning: [
              r(
                "Pain developing over a few minutes still suggests an acute vascular or thrombotic cause (ACS or PE) more than chronic conditions.",
                ["MI", "UnstableAngina", "PEMajor"]
              )
            ]
          },
          gradualHours: {
            label: "بداية تدريجية على مدى ساعات",
            labelEn: "Gradual onset over several hours",
            dxAdd: dx(["Pericarditis", "Pneumonia", "Musculoskeletal"]),
            dxRemove: dx(["MI", "Dissection"]),
            reasoning: [
              r(
                "Gradual onset over hours is more compatible with inflammatory causes such as pericarditis or pneumonia, or musculoskeletal pain.",
                ["Pericarditis", "Pneumonia", "Musculoskeletal"]
              )
            ]
          },
          gradualDays: {
            label: "بداية تدريجية على مدى أيام",
            labelEn: "Gradual onset over several days",
            dxAdd: dx(["Pneumonia", "GERD", "Musculoskeletal"]),
            dxRemove: dx(["MI", "PEMajor", "Dissection"]),
            reasoning: [
              r(
                "Pain evolving over days makes acute vascular emergencies less likely and favors inflammatory, musculoskeletal, or gastrointestinal causes.",
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
        sectionLabelEn: "HPI",
        question: "أين يتركّز الألم؟",
        questionEn: "Where is the pain mainly located?",
        type: "single",
        required: true,
        options: {
          retrosternal: {
            label: "خلف القص (Retrosternal)",
            labelEn: "Retrosternal (behind the sternum)",
            dxAdd: dx(["IHD", "MI", "ACS", "GERD"]),
            dxRemove: dx(["Musculoskeletal"]),
            reasoning: [
              r(
                "Retrosternal pain is the classic location for ischemic cardiac pain, and may also occur with esophageal reflux.",
                ["IHD", "MI", "ACS", "GERD"]
              )
            ]
          },
          leftChest: {
            label: "النصف الأيسر من الصدر",
            labelEn: "Left side of the chest",
            dxAdd: dx(["IHD", "MI", "Musculoskeletal"]),
            dxRemove: [],
            reasoning: [
              r(
                "Left-sided chest pain can be cardiac or musculoskeletal; other features are needed to differentiate.",
                ["IHD", "Musculoskeletal"]
              )
            ]
          },
          pleuriticSide: {
            label: "موضع جانبي يزداد مع التنفس",
            labelEn: "Lateral chest pain that worsens with breathing",
            dxAdd: dx(["Pleuritis", "Pneumonia", "PEMajor"]),
            dxRemove: dx(["IHD", "MI"]),
            reasoning: [
              r(
                "Lateral pain that is clearly pleuritic (worse with inspiration) suggests pleural or pulmonary pathology rather than typical ischemic pain.",
                ["Pleuritis", "Pneumonia", "PEMajor"]
              )
            ]
          },
          pointTender: {
            label: "موضع صغير يمكن الإشارة إليه بإصبع واحد",
            labelEn: "Very focal pain that can be pointed to with one finger",
            dxAdd: dx(["Musculoskeletal"]),
            dxRemove: dx(["MI", "PEMajor"]),
            reasoning: [
              r(
                "Highly localized pain that can be pinpointed with one finger usually indicates chest wall or musculoskeletal origin.",
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
        sectionLabelEn: "HPI",
        question: "ما هي طبيعة الألم؟",
        questionEn: "What is the character of the pain?",
        type: "single",
        required: true,
        options: {
          pressure: {
            label: "ضاغط / ثقل / انقباض",
            labelEn: "Pressure, heaviness, or tightness",
            dxAdd: dx(["IHD", "MI", "ACS"]),
            dxRemove: dx(["Musculoskeletal"]),
            reasoning: [
              r(
                "A pressure-like, heavy, or constricting pain is typical of ischemic cardiac chest pain.",
                ["IHD", "MI", "ACS"]
              )
            ]
          },
          sharpPleuritic: {
            label: "طاعن يزداد مع التنفس (Pleuritic sharp pain)",
            labelEn: "Sharp, stabbing pain that worsens with breathing",
            dxAdd: dx(["Pleuritis", "Pneumonia", "PEMajor"]),
            dxRemove: dx(["IHD"]),
            reasoning: [
              r(
                "Sharp, pleuritic pain that worsens with inspiration suggests pleurisy, pneumonia, or pulmonary embolism.",
                ["Pleuritis", "Pneumonia", "PEMajor"]
              )
            ]
          },
          burning: {
            label: "حرقة خلف القص خاصة بعد الأكل",
            labelEn: "Burning retrosternal pain especially after meals",
            dxAdd: dx(["GERD", "PepticUlcer"]),
            dxRemove: dx(["MI"]),
            reasoning: [
              r(
                "Retrosternal burning after meals strongly points toward gastroesophageal reflux or peptic ulcer disease.",
                ["GERD", "PepticUlcer"]
              )
            ]
          },
          tearingBack: {
            label: "ألم حارق/ماحق ينتشر إلى الظهر (Tearing to back)",
            labelEn: "Tearing or ripping pain radiating to the back",
            dxAdd: dx(["Dissection"]),
            dxRemove: [],
            reasoning: [
              r(
                "Sudden tearing pain radiating to the back between the scapulae is highly suspicious for aortic dissection.",
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
        sectionLabelEn: "HPI",
        question: "هل ينتشر الألم إلى مكان آخر؟",
        questionEn: "Does the pain radiate anywhere?",
        type: "single",
        required: true,
        options: {
          leftArmJaw: {
            label: "الذراع الأيسر / الفك السفلي / الرقبة",
            labelEn: "Left arm, jaw, or neck",
            dxAdd: dx(["MI", "IHD", "ACS"]),
            dxRemove: [],
            reasoning: [
              r(
                "Radiation to the left arm, jaw, or neck is classic for ischemic cardiac pain.",
                ["MI", "IHD", "ACS"]
              )
            ]
          },
          backBetweenScapulae: {
            label: "إلى الظهر بين لوحي الكتف",
            labelEn: "To the back between the shoulder blades",
            dxAdd: dx(["Dissection", "PEMajor"]),
            dxRemove: [],
            reasoning: [
              r(
                "Radiation to the interscapular area with acute severe pain raises concern for aortic dissection or pulmonary embolism.",
                ["Dissection", "PEMajor"]
              )
            ]
          },
          none: {
            label: "لا يوجد انتشار واضح",
            labelEn: "No clear radiation",
            dxAdd: dx([]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Absence of radiation does not exclude cardiac ischemia, but typical MI pain usually has some radiation.",
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
        sectionLabelEn: "HPI",
        question: "ما الذي يزيد الألم سوءاً؟",
        questionEn: "What makes the pain worse?",
        type: "single",
        required: true,
        options: {
          exertion: {
            label: "الجهد / صعود الدرج / المشي السريع",
            labelEn: "Physical exertion (stairs, fast walking)",
            dxAdd: dx(["IHD", "StableAngina", "ACS"]),
            dxRemove: dx(["Pleuritis"]),
            reasoning: [
              r(
                "Pain that is reliably provoked by exertion and improves with rest is typical for stable angina.",
                ["IHD", "StableAngina", "ACS"]
              )
            ]
          },
          emotionalStress: {
            label: "الانفعال النفسي / التوتر",
            labelEn: "Emotional stress or anxiety",
            dxAdd: dx(["IHD", "Anxiety"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Emotional stress can trigger both angina and panic attacks; clinical context is needed to differentiate.",
                ["IHD", "Anxiety"]
              )
            ]
          },
          deepInspiration: {
            label: "الشهيق العميق أو الكحة",
            labelEn: "Deep inspiration or coughing",
            dxAdd: dx(["Pleuritis", "Pneumonia", "PEMajor"]),
            dxRemove: dx(["StableAngina"]),
            reasoning: [
              r(
                "Pain that worsens clearly with deep inspiration usually indicates pleural or pulmonary pathology rather than ischemic angina.",
                ["Pleuritis", "Pneumonia", "PEMajor"]
              )
            ]
          },
          movementPalpation: {
            label: "حركة الجذع أو الضغط على جدار الصدر",
            labelEn: "Trunk movement or palpation of the chest wall",
            dxAdd: dx(["Musculoskeletal"]),
            dxRemove: dx(["MI", "PEMajor"]),
            reasoning: [
              r(
                "Pain reproduced by movement or palpation strongly suggests a musculoskeletal chest wall source.",
                ["Musculoskeletal"]
              )
            ]
          },
          postMeal: {
            label: "بعد الأكل أو عند الانحناء للأمام",
            labelEn: "After meals or when bending forward",
            dxAdd: dx(["GERD", "PepticUlcer"]),
            dxRemove: dx(["IHD"]),
            reasoning: [
              r(
                "Pain related to meals or bending forward strongly supports an esophageal or gastric cause rather than typical angina.",
                ["GERD", "PepticUlcer"]
              )
            ]
          },
          none: {
            label: "لا توجد علاقة واضحة",
            labelEn: "No clear relationship",
            dxAdd: dx([]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Lack of a clear aggravating factor does not define the diagnosis but reduces the typicality of some classic patterns.",
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
        sectionLabelEn: "HPI",
        question: "ما الذي يخفف الألم؟",
        questionEn: "What relieves the pain?",
        type: "single",
        required: true,
        options: {
          rest: {
            label: "الراحة بعد الجهد",
            labelEn: "Rest after exertion",
            dxAdd: dx(["StableAngina"]),
            dxRemove: dx(["MI"]),
            reasoning: [
              r(
                "Pain that improves within minutes of stopping exertion is typical for stable angina and less typical for myocardial infarction.",
                ["StableAngina"]
              )
            ]
          },
          gtn: {
            label: "أقراص النترات تحت اللسان (GTN)",
            labelEn: "Sublingual nitrates (GTN)",
            dxAdd: dx(["IHD", "StableAngina"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Rapid response to nitrates supports an ischemic cardiac cause, although it is not 100% specific.",
                ["IHD", "StableAngina"]
              )
            ]
          },
          leaningForward: {
            label: "الجلوس والانحناء للأمام",
            labelEn: "Sitting up and leaning forward",
            dxAdd: dx(["Pericarditis"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Pain that improves when sitting forward is a classic feature of pericarditis.",
                ["Pericarditis"]
              )
            ]
          },
          antacids: {
            label: "مضادات الحموضة / PPI",
            labelEn: "Antacids or proton pump inhibitors",
            dxAdd: dx(["GERD", "PepticUlcer"]),
            dxRemove: dx(["MI"]),
            reasoning: [
              r(
                "Improvement after antacids suggests an esophageal or gastric source rather than myocardial infarction.",
                ["GERD", "PepticUlcer"]
              )
            ]
          },
          nothing: {
            label: "لا شيء يخفف الألم بشكل واضح",
            labelEn: "Nothing clearly relieves the pain",
            dxAdd: dx(["MI", "PEMajor", "Dissection"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Persistent, severe pain not relieved by usual measures is concerning for serious causes such as MI, large PE, or aortic dissection.",
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
        sectionLabelEn: "HPI",
        question: "ما مدة كل نوبة من الألم؟",
        questionEn: "What is the duration of each pain episode?",
        type: "single",
        required: true,
        options: {
          seconds: {
            label: "ثوانٍ إلى أقل من دقيقة",
            labelEn: "Seconds to < 1 minute",
            dxAdd: dx(["Musculoskeletal", "Anxiety"]),
            dxRemove: dx(["StableAngina", "MI"]),
            reasoning: [
              r(
                "Very brief chest pain lasting only seconds is rarely ischemic and more often musculoskeletal or anxiety-related.",
                ["Musculoskeletal", "Anxiety"]
              )
            ]
          },
          fiveTo20: {
            label: "5–20 دقيقة (نموذجي لنوبة الذبحة)",
            labelEn: "5–20 minutes (typical for angina attack)",
            dxAdd: dx(["StableAngina", "IHD"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Episodes lasting 5–20 minutes are typical for stable angina.",
                ["StableAngina", "IHD"]
              )
            ]
          },
          more20: {
            label: "> 20 دقيقة دون تحسن",
            labelEn: "> 20 minutes without significant improvement",
            dxAdd: dx(["MI", "UnstableAngina", "Pericarditis"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Pain persisting for more than 20 minutes without relief raises suspicion for MI or unstable angina.",
                ["MI", "UnstableAngina", "Pericarditis"]
              )
            ]
          },
          hoursDays: {
            label: "لساعات أو أيام",
            labelEn: "For many hours or days",
            dxAdd: dx(["Pericarditis", "Pneumonia", "Musculoskeletal", "GERD"]),
            dxRemove: dx(["MI", "UnstableAngina"]),
            reasoning: [
              r(
                "Chest pain lasting for hours or days is more compatible with inflammatory, musculoskeletal, or reflux-related causes than acute coronary occlusion.",
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
        sectionLabelEn: "HPI",
        question: "كيف تصف سير الألم منذ بدايته؟",
        questionEn: "How has the pain evolved over time?",
        type: "single",
        required: true,
        options: {
          intermittent: {
            label: "يأتي على شكل نوبات متكررة مع فترات خالية",
            labelEn: "Intermittent attacks with pain-free intervals",
            dxAdd: dx(["StableAngina", "GERD", "Musculoskeletal"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Recurrent episodes separated by pain-free intervals suggest stable angina, reflux, or musculoskeletal pain.",
                ["StableAngina", "GERD", "Musculoskeletal"]
              )
            ]
          },
          progressive: {
            label: "ألم يزداد تدريجياً في الشدة أو التكرار",
            labelEn: "Pain progressively increasing in frequency or severity",
            dxAdd: dx(["UnstableAngina", "MI", "PEMajor"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Worsening chest pain over time is a warning sign for unstable angina, MI, or sometimes pulmonary embolism.",
                ["UnstableAngina", "MI", "PEMajor"]
              )
            ]
          },
          constant: {
            label: "ألم ثابت الشدة تقريباً",
            labelEn: "Pain of fairly constant intensity",
            dxAdd: dx(["Pericarditis", "Pneumonia", "Musculoskeletal"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Constant chest pain is more typical of pericarditis, pneumonia, or chest wall pain than classic exertional angina.",
                ["Pericarditis", "Pneumonia", "Musculoskeletal"]
              )
            ]
          },
          improving: {
            label: "يتحسن تدريجياً منذ الذروة",
            labelEn: "Gradually improving since its peak",
            dxAdd: dx([]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Gradual improvement suggests a resolving acute process but is not diagnostic by itself.",
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
        sectionLabelEn: "HPI",
        question: "هل توجد أعراض مصاحبة للألم؟ (اختر كل ما ينطبق)",
        questionEn: "Are there any associated symptoms? (select all that apply)",
        type: "multi",
        required: true,
        options: {
          dyspnea: {
            label: "ضيق في التنفس",
            labelEn: "Shortness of breath",
            dxAdd: dx(["MI", "HF", "PEMajor", "Pneumonia"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Dyspnea accompanying chest pain increases the likelihood of MI, heart failure, pulmonary embolism, or pneumonia.",
                ["MI", "HF", "PEMajor", "Pneumonia"]
              )
            ]
          },
          diaphoresis: {
            label: "تعرّق شديد",
            labelEn: "Marked diaphoresis (sweating)",
            dxAdd: dx(["MI", "ACS"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Profuse sweating with chest pain is a classic feature of acute myocardial infarction.",
                ["MI", "ACS"]
              )
            ]
          },
          nausea: {
            label: "غثيان / تقيؤ",
            labelEn: "Nausea or vomiting",
            dxAdd: dx(["MI", "GERD"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Nausea or vomiting may occur with MI or gastroesophageal reflux; overall context is needed.",
                ["MI", "GERD"]
              )
            ]
          },
          syncope: {
            label: "إغماء أو شبه إغماء",
            labelEn: "Syncope or near-syncope",
            dxAdd: dx(["Arrhythmia", "PEMajor", "Dissection"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Syncope in the context of chest pain is alarming for arrhythmia, massive PE, or aortic dissection.",
                ["Arrhythmia", "PEMajor", "Dissection"]
              )
            ]
          },
          hemoptysis: {
            label: "سعال مصحوب بدم",
            labelEn: "Coughing up blood (hemoptysis)",
            dxAdd: dx(["PEMajor", "Pneumonia"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Hemoptysis with chest pain suggests pulmonary embolism or advanced pneumonia.",
                ["PEMajor", "Pneumonia"]
              )
            ]
          },
          anxietyFeatures: {
            label: "تسارع نفس، شعور بالموت، رجفة (نوبة هلع)",
            labelEn: "Hyperventilation, feeling of doom, tremor (panic attack)",
            dxAdd: dx(["Anxiety"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Classic panic-attack features can explain chest pain, but organic causes must always be excluded first.",
                ["Anxiety"]
              )
            ]
          },
          none: {
            label: "لا توجد أعراض مصاحبة مهمة",
            labelEn: "No significant associated symptoms",
            dxAdd: dx([]),
            dxRemove: dx(["PEMajor", "HF", "Pneumonia"]),
            reasoning: [
              r(
                "Absence of major associated symptoms slightly lowers the probability of some severe conditions such as PE, overt HF, or obvious pneumonia.",
                ["PEMajor", "HF", "Pneumonia"]
              )
            ]
          }
        }
      },

      {
        id: "redFlags",
        sectionId: "hpi",
        sectionLabel: "HPI",
        sectionLabelEn: "HPI",
        question: "Red Flags: هل توجد أي من العلامات الخطرة التالية؟",
        questionEn: "Red flags: are any of the following present?",
        type: "multi",
        required: true,
        options: {
          tearingBack: {
            label: "ألم تمزّقي مفاجئ ممتد إلى الظهر",
            labelEn: "Sudden tearing pain radiating to the back",
            dxAdd: dx(["Dissection"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "A sudden tearing pain to the back is a classic red flag for aortic dissection.",
                ["Dissection"]
              )
            ]
          },
          suddenSevereDyspnea: {
            label: "ضيق نفس حاد مفاجئ مع ألم صدري",
            labelEn: "Acute severe dyspnea with chest pain",
            dxAdd: dx(["PEMajor", "HF"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Sudden severe dyspnea with chest pain raises strong suspicion for pulmonary embolism or acute pulmonary edema.",
                ["PEMajor", "HF"]
              )
            ]
          },
          hypotensionShock: {
            label: "علامات هبوط ضغط / صدمة (دوخة شديدة، برودة أطراف)",
            labelEn: "Signs of hypotension or shock (marked dizziness, cold extremities)",
            dxAdd: dx(["MI", "PEMajor", "Dissection"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Shock-like features with chest pain indicate a life-threatening process such as large MI, massive PE, or aortic dissection.",
                ["MI", "PEMajor", "Dissection"]
              )
            ]
          },
          none: {
            label: "لا توجد علامات خطورة واضحة",
            labelEn: "No obvious red-flag features",
            dxAdd: dx([]),
            dxRemove: dx(["Dissection", "PEMajor"]),
            reasoning: [
              r(
                "Absence of classical red-flag signs lowers but does not completely exclude severe pathology.",
                ["Dissection", "PEMajor"]
              )
            ]
          }
        }
      }
    ]
  }
];