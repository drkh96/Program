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
        options: {
          sudden1min: {
            label: "بداية فجائية خلال أقل من دقيقة، ألم شديد جداً",
            labelEn: "Sudden onset within less than 1 minute, very severe pain",
            dxAdd: dx(["MI", "PEMajor", "Dissection"]),
            dxRemove: dx(["GERD", "Musculoskeletal"]),
            reasoning: [
              r(
                "Very abrupt onset of severe chest pain strongly suggests acute MI, pulmonary embolism or aortic dissection.",
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
                "Onset over several minutes still supports an acute vascular cause such as ACS or PE rather than a chronic process.",
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
                "Gradual onset over hours is more compatible with inflammatory causes such as pericarditis or pneumonia or chest wall pain.",
                ["Pericarditis", "Pneumonia", "Musculoskeletal"]
              )
            ]
          },
          gradualDays: {
            label: "بداية تدريجية على مدى أيام",
            labelEn: "Gradual onset over days",
            dxAdd: dx(["Pneumonia", "GERD", "Musculoskeletal"]),
            dxRemove: dx(["MI", "PEMajor", "Dissection"]),
            reasoning: [
              r(
                "Symptoms evolving over days decrease the likelihood of acute vascular catastrophes and favor inflammatory, musculoskeletal or GI causes.",
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
                "Retrosternal pain is the classic location for ischemic cardiac pain, but can also occur with reflux disease.",
                ["IHD", "MI", "ACS", "GERD"]
              )
            ]
          },
          leftChest: {
            label: "النصف الأيسر من الصدر",
            labelEn: "Left side of the chest",
            dxAdd: dx(["IHD", "MI", "Musculoskeletal"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Left-sided chest pain may be cardiac or musculoskeletal depending on other features.",
                ["IHD", "Musculoskeletal"]
              )
            ]
          },
          pleuriticSide: {
            label: "موضع جانبي يزداد مع التنفس",
            labelEn: "Lateral chest pain worse with breathing",
            dxAdd: dx(["Pleuritis", "Pneumonia", "PEMajor"]),
            dxRemove: dx(["IHD", "MI"]),
            reasoning: [
              r(
                "Lateral pleuritic pain is more suggestive of pleural or pulmonary disease than ischemic heart disease.",
                ["Pleuritis", "Pneumonia", "PEMajor"]
              )
            ]
          },
          pointTender: {
            label: "موضع صغير يمكن الإشارة إليه بإصبع واحد",
            labelEn: "Small, well-localised point tenderness",
            dxAdd: dx(["Musculoskeletal"]),
            dxRemove: dx(["MI", "PEMajor"]),
            reasoning: [
              r(
                "Very localised, fingertip pain is typical of chest wall / musculoskeletal causes rather than MI or PE.",
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
            labelEn: "Pressure / heaviness / tightness",
            dxAdd: dx(["IHD", "MI", "ACS"]),
            dxRemove: dx(["Musculoskeletal"]),
            reasoning: [
              r(
                "Pressure-like or constricting chest pain is the typical description of ischemic cardiac pain.",
                ["IHD", "MI", "ACS"]
              )
            ]
          },
          sharpPleuritic: {
            label: "طاعن يزداد مع التنفس (Pleuritic sharp pain)",
            labelEn: "Sharp, pleuritic pain worse on inspiration",
            dxAdd: dx(["Pleuritis", "Pneumonia", "PEMajor"]),
            dxRemove: dx(["IHD"]),
            reasoning: [
              r(
                "Sharp inspiratory pain usually indicates pleural, pulmonary or PE-related pathology rather than classic ischemic pain.",
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
                "Burning post-prandial retrosternal pain strongly suggests GERD or peptic ulcer rather than MI.",
                ["GERD", "PepticUlcer"]
              )
            ]
          },
          tearingBack: {
            label: "ألم حارق/ماحق ينتشر إلى الظهر (Tearing to back)",
            labelEn: "Severe tearing pain radiating to the back",
            dxAdd: dx(["Dissection"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Sudden tearing chest pain radiating to the back is a classic red flag for aortic dissection.",
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
            labelEn: "Left arm, jaw or neck",
            dxAdd: dx(["MI", "IHD", "ACS"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Radiation to the left arm or jaw is classical for ischemic cardiac pain.",
                ["MI", "IHD", "ACS"]
              )
            ]
          },
          backBetweenScapulae: {
            label: "إلى الظهر بين لوحي الكتف",
            labelEn: "To the back between the scapulae",
            dxAdd: dx(["Dissection", "PEMajor"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Radiation to the interscapular back, especially with sudden onset, raises suspicion of aortic dissection or PE.",
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
                "Absence of radiation does not exclude MI, but is less typical for classic infarction.",
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
                "Pain provoked by exertion and relieved by rest is typical of angina due to coronary artery disease.",
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
                "Emotional stress may trigger both angina and panic attacks; interpretation depends on the full story.",
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
                "Pleuritic pain worsened by deep breathing suggests pleural or pulmonary pathology rather than stable angina.",
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
                "Pain that increases with movement or local palpation is typical of musculoskeletal chest wall pain.",
                ["Musculoskeletal"]
              )
            ]
          },
          postMeal: {
            label: "بعد الأكل أو عند الانحناء للأمام",
            labelEn: "After meals or bending forward",
            dxAdd: dx(["GERD", "PepticUlcer"]),
            dxRemove: dx(["IHD"]),
            reasoning: [
              r(
                "Pain linked to meals or bending forwards strongly suggests esophageal or gastric causes.",
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
                "Lack of a clear aggravating factor does not rule out disease but makes classic patterns less obvious.",
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
                "Pain that reliably settles within minutes of rest is typical for stable angina rather than MI.",
                ["StableAngina"]
              )
            ]
          },
          gtn: {
            label: "أقراص النترات تحت اللسان (GTN)",
            labelEn: "Sublingual GTN tablets",
            dxAdd: dx(["IHD", "StableAngina"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Rapid response to GTN supports ischemic cardiac pain, although it is not 100% specific.",
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
                "Improvement of pain when leaning forward is a classic feature of pericarditis.",
                ["Pericarditis"]
              )
            ]
          },
          antacids: {
            label: "مضادات الحموضة / PPI",
            labelEn: "Antacids / PPIs",
            dxAdd: dx(["GERD", "PepticUlcer"]),
            dxRemove: dx(["MI"]),
            reasoning: [
              r(
                "Symptom relief with antacids suggests an upper GI cause rather than MI.",
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
                "Persistent, unrelieved severe chest pain is worrisome for MI, PE or aortic dissection.",
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
        questionEn: "How long does each episode of pain last?",
        type: "single",
        required: true,
        options: {
          seconds: {
            label: "ثوانٍ إلى أقل من دقيقة",
            labelEn: "Seconds to less than 1 minute",
            dxAdd: dx(["Musculoskeletal", "Anxiety"]),
            dxRemove: dx(["StableAngina", "MI"]),
            reasoning: [
              r(
                "Very brief pains lasting only seconds are rarely ischemic and more likely musculoskeletal or anxiety-related.",
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
            labelEn: "> 20 minutes without improvement",
            dxAdd: dx(["MI", "UnstableAngina", "Pericarditis"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Pain lasting more than 20 minutes without improvement is concerning for MI or unstable angina.",
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
                "Very prolonged pain over hours or days is more in keeping with inflammatory, musculoskeletal or GI causes.",
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
            labelEn: "Comes in intermittent attacks with pain-free intervals",
            dxAdd: dx(["StableAngina", "GERD", "Musculoskeletal"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Intermittent recurrent attacks with pain-free intervals fit stable angina, GERD or chest wall pain.",
                ["StableAngina", "GERD", "Musculoskeletal"]
              )
            ]
          },
          progressive: {
            label: "ألم يزداد تدريجياً في الشدة أو التكرار",
            labelEn: "Pain gradually increasing in severity or frequency",
            dxAdd: dx(["UnstableAngina", "MI", "PEMajor"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Progressive worsening is a red flag for unstable angina, evolving MI or PE.",
                ["UnstableAngina", "MI", "PEMajor"]
              )
            ]
          },
          constant: {
            label: "ألم ثابت الشدة تقريباً",
            labelEn: "Pain of roughly constant intensity",
            dxAdd: dx(["Pericarditis", "Pneumonia", "Musculoskeletal"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Constant chest pain can be seen in pericarditis, pneumonia or chest wall pain.",
                ["Pericarditis", "Pneumonia", "Musculoskeletal"]
              )
            ]
          },
          improving: {
            label: "يتحسن تدريجياً منذ الذروة",
            labelEn: "Gradually improving since the peak",
            dxAdd: dx([]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Gradual improvement suggests that an acute process is resolving, but is not specific for any single diagnosis.",
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
        questionEn: "Are there any associated symptoms? (pick all that apply)",
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
                "Dyspnea with chest pain raises the possibility of MI, heart failure, PE or pneumonia.",
                ["MI", "HF", "PEMajor", "Pneumonia"]
              )
            ]
          },
          diaphoresis: {
            label: "تعرّق شديد",
            labelEn: "Profuse sweating",
            dxAdd: dx(["MI", "ACS"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Marked diaphoresis with chest pain is a classic presentation of acute MI.",
                ["MI", "ACS"]
              )
            ]
          },
          nausea: {
            label: "غثيان / تقيؤ",
            labelEn: "Nausea / vomiting",
            dxAdd: dx(["MI", "GERD"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Nausea or vomiting may accompany MI or upper GI pathology such as GERD.",
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
                "Syncope with chest pain is alarming for arrhythmia, massive PE or aortic dissection.",
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
                "Hemoptysis with chest pain suggests PE or advanced pneumonia.",
                ["PEMajor", "Pneumonia"]
              )
            ]
          },
          anxietyFeatures: {
            label: "تسارع نفس، شعور بالموت، رجفة (نوبة هلع)",
            labelEn: "Rapid breathing, fear of dying, tremor (panic-like)",
            dxAdd: dx(["Anxiety"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Typical panic-attack features may explain chest pain but organic causes must be excluded first.",
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
                "Absence of major associated symptoms slightly reduces the likelihood of PE, overt HF or clear pneumonia.",
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
                "Sudden tearing chest-to-back pain is a classic emergency sign of aortic dissection.",
                ["Dissection"]
              )
            ]
          },
          suddenSevereDyspnea: {
            label: "ضيق نفس حاد مفاجئ مع ألم صدري",
            labelEn: "Sudden severe dyspnea with chest pain",
            dxAdd: dx(["PEMajor", "HF"]),
            dxRemove: dx([]),
            reasoning: [
              r(
                "Abrupt severe dyspnea with chest pain strongly suggests PE or acute pulmonary edema.",
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
                "Shock features with chest pain are life-threatening and may indicate large MI, massive PE or aortic dissection.",
                ["MI", "PEMajor", "Dissection"]
              )
            ]
          },
          none: {
            label: "لا توجد علامات خطورة واضحة",
            labelEn: "No obvious red-flag signs",
            dxAdd: dx([]),
            dxRemove: dx(["Dissection", "PEMajor"]),
            reasoning: [
              r(
                "Absence of classic red-flag signs reduces—but does not eliminate—the probability of dissection or massive PE.",
                ["Dissection", "PEMajor"]
              )
            ]
          }
        }
      }
    ]
  }
];