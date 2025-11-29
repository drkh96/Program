// ========================================
// chest-data-hPI.js
// Detailed HPI (all choices, dxAdd/dxRemove + reasoning)
// ========================================

"use strict";

window.CHEST_SECTIONS_HPI = [
  {
    id: "hpi",
    label: "History of Present Illness",
    steps: [
      {
        id: "onset",
        sectionId: "hpi",
        sectionLabel: "HPI",
        sectionLabelEn: "HPI",
        question: "كيف كانت بداية الألم؟",
        questionEn: "How did the pain start?",
        type: "single",
        required: true,
        visibleWhen: {
          all: [
            { stepId: "department",  equals: "internal" },
            { stepId: "system",      equals: "cvs" },
            { stepId: "mainSymptom", equals: "chestPain" }
          ]
        },
        options: {
          sudden1min: {
            label: "بداية فجائية خلال أقل من دقيقة، ألم شديد جداً",
            labelEn: "Sudden onset within less than 1 minute, very severe pain",
            dxAdd: ["MI", "PEMajor", "Dissection"],
            dxRemove: ["GERD", "Musculoskeletal"],
            reasoning: [
              {
                text: "Very abrupt onset of severe chest pain strongly suggests acute MI, pulmonary embolism or aortic dissection.",
                diseases: ["MI", "PEMajor", "Dissection"]
              }
            ]
          },
          sudden10min: {
            label: "بداية سريعة خلال 10 دقائق",
            labelEn: "Rapid onset over about 10 minutes",
            dxAdd: ["MI", "UnstableAngina", "PEMajor"],
            dxRemove: ["GERD"],
            reasoning: [
              {
                text: "Onset over several minutes still supports an acute vascular cause such as ACS or PE rather than a chronic process.",
                diseases: ["MI", "UnstableAngina", "PEMajor"]
              }
            ]
          },
          gradualHours: {
            label: "بداية تدريجية على مدى ساعات",
            labelEn: "Gradual onset over several hours",
            dxAdd: ["Pericarditis", "Pneumonia", "Musculoskeletal"],
            dxRemove: ["MI", "Dissection"],
            reasoning: [
              {
                text: "Gradual onset over hours is more compatible with inflammatory causes such as pericarditis or pneumonia or chest wall pain.",
                diseases: ["Pericarditis", "Pneumonia", "Musculoskeletal"]
              }
            ]
          },
          gradualDays: {
            label: "بداية تدريجية على مدى أيام",
            labelEn: "Gradual onset over days",
            dxAdd: ["Pneumonia", "GERD", "Musculoskeletal"],
            dxRemove: ["MI", "PEMajor", "Dissection"],
            reasoning: [
              {
                text: "Symptoms evolving over days decrease the likelihood of acute vascular catastrophes and favor inflammatory, musculoskeletal or GI causes.",
                diseases: ["Pneumonia", "GERD", "Musculoskeletal"]
              }
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
        visibleWhen: {
          all: [
            { stepId: "department",  equals: "internal" },
            { stepId: "system",      equals: "cvs" },
            { stepId: "mainSymptom", equals: "chestPain" }
          ]
        },
        options: {
          retrosternal: {
            label: "خلف القص (Retrosternal)",
            labelEn: "Retrosternal (behind the sternum)",
            dxAdd: ["IHD", "MI", "ACS", "GERD"],
            dxRemove: ["Musculoskeletal"],
            reasoning: [
              {
                text: "Retrosternal pain is the classic location for ischemic cardiac pain, but can also occur with reflux disease.",
                diseases: ["IHD", "MI", "ACS", "GERD"]
              }
            ]
          },
          leftChest: {
            label: "النصف الأيسر من الصدر",
            labelEn: "Left side of the chest",
            dxAdd: ["IHD", "MI", "Musculoskeletal"],
            dxRemove: [],
            reasoning: [
              {
                text: "Left-sided chest pain may be cardiac or musculoskeletal depending on other features.",
                diseases: ["IHD", "Musculoskeletal"]
              }
            ]
          },
          pleuriticSide: {
            label: "موضع جانبي يزداد مع التنفس",
            labelEn: "Lateral chest pain worse with breathing",
            dxAdd: ["Pleuritis", "Pneumonia", "PEMajor"],
            dxRemove: ["IHD", "MI"],
            reasoning: [
              {
                text: "Lateral pleuritic pain is more suggestive of pleural or pulmonary disease than ischemic heart disease.",
                diseases: ["Pleuritis", "Pneumonia", "PEMajor"]
              }
            ]
          },
          pointTender: {
            label: "موضع صغير يمكن الإشارة إليه بإصبع واحد",
            labelEn: "Small, well-localised point tenderness",
            dxAdd: ["Musculoskeletal"],
            dxRemove: ["MI", "PEMajor"],
            reasoning: [
              {
                text: "Very localised, fingertip pain is typical of chest wall / musculoskeletal causes rather than MI or PE.",
                diseases: ["Musculoskeletal"]
              }
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
        visibleWhen: {
          all: [
            { stepId: "department",  equals: "internal" },
            { stepId: "system",      equals: "cvs" },
            { stepId: "mainSymptom", equals: "chestPain" }
          ]
        },
        options: {
          pressure: {
            label: "ضاغط / ثقل / انقباض",
            labelEn: "Pressure / heaviness / tightness",
            dxAdd: ["IHD", "MI", "ACS"],
            dxRemove: ["Musculoskeletal"],
            reasoning: [
              {
                text: "Pressure-like or constricting chest pain is the typical description of ischemic cardiac pain.",
                diseases: ["IHD", "MI", "ACS"]
              }
            ]
          },
          sharpPleuritic: {
            label: "طاعن يزداد مع التنفس (Pleuritic sharp pain)",
            labelEn: "Sharp, pleuritic pain worse on inspiration",
            dxAdd: ["Pleuritis", "Pneumonia", "PEMajor"],
            dxRemove: ["IHD"],
            reasoning: [
              {
                text: "Sharp inspiratory pain usually indicates pleural, pulmonary or PE-related pathology rather than classic ischemic pain.",
                diseases: ["Pleuritis", "Pneumonia", "PEMajor"]
              }
            ]
          },
          burning: {
            label: "حرقة خلف القص خاصة بعد الأكل",
            labelEn: "Burning retrosternal pain especially after meals",
            dxAdd: ["GERD", "PepticUlcer"],
            dxRemove: ["MI"],
            reasoning: [
              {
                text: "Burning post-prandial retrosternal pain strongly suggests GERD or peptic ulcer rather than MI.",
                diseases: ["GERD", "PepticUlcer"]
              }
            ]
          },
          tearingBack: {
            label: "ألم حارق/ماحق ينتشر إلى الظهر (Tearing to back)",
            labelEn: "Severe tearing pain radiating to the back",
            dxAdd: ["Dissection"],
            dxRemove: [],
            reasoning: [
              {
                text: "Sudden tearing chest pain radiating to the back is a classic red flag for aortic dissection.",
                diseases: ["Dissection"]
              }
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
        visibleWhen: {
          all: [
            { stepId: "department",  equals: "internal" },
            { stepId: "system",      equals: "cvs" },
            { stepId: "mainSymptom", equals: "chestPain" }
          ]
        },
        options: {
          leftArmJaw: {
            label: "الذراع الأيسر / الفك السفلي / الرقبة",
            labelEn: "Left arm, jaw or neck",
            dxAdd: ["MI", "IHD", "ACS"],
            dxRemove: [],
            reasoning: [
              {
                text: "Radiation to the left arm or jaw is classical for ischemic cardiac pain.",
                diseases: ["MI", "IHD", "ACS"]
              }
            ]
          },
          backBetweenScapulae: {
            label: "إلى الظهر بين لوحي الكتف",
            labelEn: "To the back between the scapulae",
            dxAdd: ["Dissection", "PEMajor"],
            dxRemove: [],
            reasoning: [
              {
                text: "Radiation to the interscapular back, especially with sudden onset, raises suspicion of aortic dissection or PE.",
                diseases: ["Dissection", "PEMajor"]
              }
            ]
          },
          none: {
            label: "لا يوجد انتشار واضح",
            labelEn: "No clear radiation",
            dxAdd: [],
            dxRemove: [],
            reasoning: [
              {
                text: "Absence of radiation does not exclude MI, but is less typical for classic infarction.",
                diseases: ["MI"]
              }
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
        visibleWhen: {
          all: [
            { stepId: "department",  equals: "internal" },
            { stepId: "system",      equals: "cvs" },
            { stepId: "mainSymptom", equals: "chestPain" }
          ]
        },
        options: {
          exertion: {
            label: "الجهد / صعود الدرج / المشي السريع",
            labelEn: "Physical exertion (stairs, fast walking)",
            dxAdd: ["IHD", "StableAngina", "ACS"],
            dxRemove: ["Pleuritis"],
            reasoning: [
              {
                text: "Pain provoked by exertion and relieved by rest is typical of angina due to coronary artery disease.",
                diseases: ["IHD", "StableAngina", "ACS"]
              }
            ]
          },
          emotionalStress: {
            label: "الانفعال النفسي / التوتر",
            labelEn: "Emotional stress or anxiety",
            dxAdd: ["IHD", "Anxiety"],
            dxRemove: [],
            reasoning: [
              {
                text: "Emotional stress may trigger both angina and panic attacks; interpretation depends on the full story.",
                diseases: ["IHD", "Anxiety"]
              }
            ]
          },
          deepInspiration: {
            label: "الشهيق العميق أو الكحة",
            labelEn: "Deep inspiration or coughing",
            dxAdd: ["Pleuritis", "Pneumonia", "PEMajor"],
            dxRemove: ["StableAngina"],
            reasoning: [
              {
                text: "Pleuritic pain worsened by deep breathing suggests pleural or pulmonary pathology rather than stable angina.",
                diseases: ["Pleuritis", "Pneumonia", "PEMajor"]
              }
            ]
          },
          movementPalpation: {
            label: "حركة الجذع أو الضغط على جدار الصدر",
            labelEn: "Trunk movement or palpation of the chest wall",
            dxAdd: ["Musculoskeletal"],
            dxRemove: ["MI", "PEMajor"],
            reasoning: [
              {
                text: "Pain that increases with movement or local palpation is typical of musculoskeletal chest wall pain.",
                diseases: ["Musculoskeletal"]
              }
            ]
          },
          postMeal: {
            label: "بعد الأكل أو عند الانحناء للأمام",
            labelEn: "After meals or bending forward",
            dxAdd: ["GERD", "PepticUlcer"],
            dxRemove: ["IHD"],
            reasoning: [
              {
                text: "Pain linked to meals or bending forwards strongly suggests esophageal or gastric causes.",
                diseases: ["GERD", "PepticUlcer"]
              }
            ]
          },
          none: {
            label: "لا توجد علاقة واضحة",
            labelEn: "No clear relationship",
            dxAdd: [],
            dxRemove: [],
            reasoning: [
              {
                text: "Lack of a clear aggravating factor does not rule out disease but makes classic patterns less obvious.",
                diseases: ["IHD"]
              }
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
        visibleWhen: {
          all: [
            { stepId: "department",  equals: "internal" },
            { stepId: "system",      equals: "cvs" },
            { stepId: "mainSymptom", equals: "chestPain" }
          ]
        },
        options: {
          rest: {
            label: "الراحة بعد الجهد",
            labelEn: "Rest after exertion",
            dxAdd: ["StableAngina"],
            dxRemove: ["MI"],
            reasoning: [
              {
                text: "Pain that reliably settles within minutes of rest is typical for stable angina rather than MI.",
                diseases: ["StableAngina"]
              }
            ]
          },
          gtn: {
            label: "أقراص النترات تحت اللسان (GTN)",
            labelEn: "Sublingual GTN tablets",
            dxAdd: ["IHD", "StableAngina"],
            dxRemove: [],
            reasoning: [
              {
                text: "Rapid response to GTN supports ischemic cardiac pain, although it is not 100% specific.",
                diseases: ["IHD", "StableAngina"]
              }
            ]
          },
          leaningForward: {
            label: "الجلوس والانحناء للأمام",
            labelEn: "Sitting up and leaning forward",
            dxAdd: ["Pericarditis"],
            dxRemove: [],
            reasoning: [
              {
                text: "Improvement of pain when leaning forward is a classic feature of pericarditis.",
                diseases: ["Pericarditis"]
              }
            ]
          },
          antacids: {
            label: "مضادات الحموضة / PPI",
            labelEn: "Antacids / PPIs",
            dxAdd: ["GERD", "PepticUlcer"],
            dxRemove: ["MI"],
            reasoning: [
              {
                text: "Symptom relief with antacids suggests an upper GI cause rather than MI.",
                diseases: ["GERD", "PepticUlcer"]
              }
            ]
          },
          nothing: {
            label: "لا شيء يخفف الألم بشكل واضح",
            labelEn: "Nothing clearly relieves the pain",
            dxAdd: ["MI", "PEMajor", "Dissection"],
            dxRemove: [],
            reasoning: [
              {
                text: "Persistent, unrelieved severe chest pain is worrisome for MI, PE or aortic dissection.",
                diseases: ["MI", "PEMajor", "Dissection"]
              }
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
        questionEn: "How long does each episode of pain last?",
        type: "single",
        required: true,
        visibleWhen: {
          all: [
            { stepId: "department",  equals: "internal" },
            { stepId: "system",      equals: "cvs" },
            { stepId: "mainSymptom", equals: "chestPain" }
          ]
        },
        options: {
          seconds: {
            label: "ثوانٍ إلى أقل من دقيقة",
            labelEn: "Seconds to less than 1 minute",
            dxAdd: ["Musculoskeletal", "Anxiety"],
            dxRemove: ["StableAngina", "MI"],
            reasoning: [
              {
                text: "Very brief pains lasting only seconds are rarely ischemic and more likely musculoskeletal or anxiety-related.",
                diseases: ["Musculoskeletal", "Anxiety"]
              }
            ]
          },
          fiveTo20: {
            label: "5–20 دقيقة (نموذجي لنوبة الذبحة)",
            labelEn: "5–20 minutes (typical for angina attack)",
            dxAdd: ["StableAngina", "IHD"],
            dxRemove: [],
            reasoning: [
              {
                text: "Episodes lasting 5–20 minutes are typical for stable angina.",
                diseases: ["StableAngina", "IHD"]
              }
            ]
          },
          more20: {
            label: "> 20 دقيقة دون تحسن",
            labelEn: "> 20 minutes without improvement",
            dxAdd: ["MI", "UnstableAngina", "Pericarditis"],
            dxRemove: [],
            reasoning: [
              {
                text: "Pain lasting more than 20 minutes without improvement is concerning for MI or unstable angina.",
                diseases: ["MI", "UnstableAngina", "Pericarditis"]
              }
            ]
          },
          hoursDays: {
            label: "لساعات أو أيام",
            labelEn: "For many hours or days",
            dxAdd: ["Pericarditis", "Pneumonia", "Musculoskeletal", "GERD"],
            dxRemove: ["MI", "UnstableAngina"],
            reasoning: [
              {
                text: "Very prolonged pain over hours or days is more in keeping with inflammatory, musculoskeletal or GI causes.",
                diseases: ["Pericarditis", "Pneumonia", "Musculoskeletal", "GERD"]
              }
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
        visibleWhen: {
          all: [
            { stepId: "department",  equals: "internal" },
            { stepId: "system",      equals: "cvs" },
            { stepId: "mainSymptom", equals: "chestPain" }
          ]
        },
        options: {
          intermittent: {
            label: "يأتي على شكل نوبات متكررة مع فترات خالية",
            labelEn: "Comes in intermittent attacks with pain-free intervals",
            dxAdd: ["StableAngina", "GERD", "Musculoskeletal"],
            dxRemove: [],
            reasoning: [
              {
                text: "Intermittent recurrent attacks with pain-free intervals fit stable angina, GERD or chest wall pain.",
                diseases: ["StableAngina", "GERD", "Musculoskeletal"]
              }
            ]
          },
          progressive: {
            label: "ألم يزداد تدريجياً في الشدة أو التكرار",
            labelEn: "Pain gradually increasing in severity or frequency",
            dxAdd: ["UnstableAngina", "MI", "PEMajor"],
            dxRemove: [],
            reasoning: [
              {
                text: "Progressive worsening is a red flag for unstable angina, evolving MI or PE.",
                diseases: ["UnstableAngina", "MI", "PEMajor"]
              }
            ]
          },
          constant: {
            label: "ألم ثابت الشدة تقريباً",
            labelEn: "Pain of roughly constant intensity",
            dxAdd: ["Pericarditis", "Pneumonia", "Musculoskeletal"],
            dxRemove: [],
            reasoning: [
              {
                text: "Constant chest pain can be seen in pericarditis, pneumonia or chest wall pain.",
                diseases: ["Pericarditis", "Pneumonia", "Musculoskeletal"]
              }
            ]
          },
          improving: {
            label: "يتحسن تدريجياً منذ الذروة",
            labelEn: "Gradually improving since the peak",
            dxAdd: [],
            dxRemove: [],
            reasoning: [
              {
                text: "Gradual improvement suggests that an acute process is resolving, but is not specific for any single diagnosis.",
                diseases: []
              }
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
        questionEn: "Are there any associated symptoms? (pick all that apply)",
        type: "multi",
        required: true,
        visibleWhen: {
          all: [
            { stepId: "department",  equals: "internal" },
            { stepId: "system",      equals: "cvs" },
            { stepId: "mainSymptom", equals: "chestPain" }
          ]
        },
        options: {
          dyspnea: {
            label: "ضيق في التنفس",
            labelEn: "Shortness of breath",
            dxAdd: ["MI", "HF", "PEMajor", "Pneumonia"],
            dxRemove: [],
            reasoning: [
              {
                text: "Dyspnea with chest pain raises the possibility of MI, heart failure, PE or pneumonia.",
                diseases: ["MI", "HF", "PEMajor", "Pneumonia"]
              }
            ]
          },
          diaphoresis: {
            label: "تعرّق شديد",
            labelEn: "Profuse sweating",
            dxAdd: ["MI", "ACS"],
            dxRemove: [],
            reasoning: [
              {
                text: "Marked diaphoresis with chest pain is a classic presentation of acute MI.",
                diseases: ["MI", "ACS"]
              }
            ]
          },
          nausea: {
            label: "غثيان / تقيؤ",
            labelEn: "Nausea / vomiting",
            dxAdd: ["MI", "GERD"],
            dxRemove: [],
            reasoning: [
              {
                text: "Nausea or vomiting may accompany MI or upper GI pathology such as GERD.",
                diseases: ["MI", "GERD"]
              }
            ]
          },
          syncope: {
            label: "إغماء أو شبه إغماء",
            labelEn: "Syncope or near-syncope",
            dxAdd: ["Arrhythmia", "PEMajor", "Dissection"],
            dxRemove: [],
            reasoning: [
              {
                text: "Syncope with chest pain is alarming for arrhythmia, massive PE or aortic dissection.",
                diseases: ["Arrhythmia", "PEMajor", "Dissection"]
              }
            ]
          },
          hemoptysis: {
            label: "سعال مصحوب بدم",
            labelEn: "Coughing up blood (hemoptysis)",
            dxAdd: ["PEMajor", "Pneumonia"],
            dxRemove: [],
            reasoning: [
              {
                text: "Hemoptysis with chest pain suggests PE or advanced pneumonia.",
                diseases: ["PEMajor", "Pneumonia"]
              }
            ]
          },
          anxietyFeatures: {
            label: "تسارع نفس، شعور بالموت، رجفة (نوبة هلع)",
            labelEn: "Rapid breathing, fear of dying, tremor (panic-like)",
            dxAdd: ["Anxiety"],
            dxRemove: [],
            reasoning: [
              {
                text: "Typical panic-attack features may explain chest pain but organic causes must be excluded first.",
                diseases: ["Anxiety"]
              }
            ]
          },
          none: {
            label: "لا توجد أعراض مصاحبة مهمة",
            labelEn: "No significant associated symptoms",
            dxAdd: [],
            dxRemove: ["PEMajor", "HF", "Pneumonia"],
            reasoning: [
              {
                text: "Absence of major associated symptoms slightly reduces the likelihood of PE, overt HF or clear pneumonia.",
                diseases: ["PEMajor", "HF", "Pneumonia"]
              }
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
        visibleWhen: {
          all: [
            { stepId: "department",  equals: "internal" },
            { stepId: "system",      equals: "cvs" },
            { stepId: "mainSymptom", equals: "chestPain" }
          ]
        },
        options: {
          tearingBack: {
            label: "ألم تمزّقي مفاجئ ممتد إلى الظهر",
            labelEn: "Sudden tearing pain radiating to the back",
            dxAdd: ["Dissection"],
            dxRemove: [],
            reasoning: [
              {
                text: "Sudden tearing chest-to-back pain is a classic emergency sign of aortic dissection.",
                diseases: ["Dissection"]
              }
            ]
          },
          suddenSevereDyspnea: {
            label: "ضيق نفس حاد مفاجئ مع ألم صدري",
            labelEn: "Sudden severe dyspnea with chest pain",
            dxAdd: ["PEMajor", "HF"],
            dxRemove: [],
            reasoning: [
              {
                text: "Abrupt severe dyspnea with chest pain strongly suggests PE or acute pulmonary edema.",
                diseases: ["PEMajor", "HF"]
              }
            ]
          },
          hypotensionShock: {
            label: "علامات هبوط ضغط / صدمة (دوخة شديدة، برودة أطراف)",
            labelEn: "Signs of hypotension or shock (marked dizziness, cold extremities)",
            dxAdd: ["MI", "PEMajor", "Dissection"],
            dxRemove: [],
            reasoning: [
              {
                text: "Shock features with chest pain are life-threatening and may indicate large MI, massive PE or aortic dissection.",
                diseases: ["MI", "PEMajor", "Dissection"]
              }
            ]
          },
          none: {
            label: "لا توجد علامات خطورة واضحة",
            labelEn: "No obvious red-flag signs",
            dxAdd: [],
            dxRemove: ["Dissection", "PEMajor"],
            reasoning: [
              {
                text: "Absence of classic red-flag signs reduces—but does not eliminate—the probability of dissection or massive PE.",
                diseases: ["Dissection", "PEMajor"]
              }
            ]
          }
        }
      }
    ]
  }
];