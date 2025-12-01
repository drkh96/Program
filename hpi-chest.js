// ========================================
// hpi-chest.js
// السيرة المرضية الحالية HPI — ألم الصدر فقط
// ========================================

"use strict";

(function (global) {

  global.CHEST_PAIN_HPI = [

    {
      id: "hpi_chest",
      label: "History of Present Illness (Chest Pain)",
      group: "chestPain",

      steps: [

        // =========================================
        // S — Site
        // =========================================
        {
          id: "hpi_site",
          group: "chestPain",
          question: "أين يتركّز الألم؟",
          questionEn: "Where is the pain located?",
          type: "single",
          required: true,
          AffectOnDx: true,

          options: {
            retrosternal: {
              label: "خلف القص",
              labelEn: "Retrosternal"
            },
            pleuritic_side: {
              label: "جانبي ويزداد مع التنفس",
              labelEn: "Pleuritic (lateral)"
            },
            point_tenderness: {
              label: "ألم موضعي يمكن الإشارة إليه بالأصبع",
              labelEn: "Point tenderness"
            },
            chest_wall: {
              label: "ألم مرتبط بجدار الصدر",
              labelEn: "Chest wall pain"
            }
          }
        },

        // =========================================
        // O — Onset
        // =========================================
        {
          id: "hpi_onset",
          group: "chestPain",
          question: "كيف بدأت الأعراض؟",
          questionEn: "How did the symptoms start?",
          type: "single",
          required: true,
          AffectOnDx: true,

          options: {
            sudden_seconds: {
              label: "بداية فجائية خلال ثوانٍ",
              labelEn: "Sudden onset (seconds)"
            },
            minutes: {
              label: "بداية خلال عدة دقائق",
              labelEn: "Onset over minutes"
            },
            hours: {
              label: "بداية تدريجية خلال ساعات",
              labelEn: "Gradual onset (hours)"
            },
            days: {
              label: "بداية تدريجية خلال أيام",
              labelEn: "Gradual onset (days)"
            }
          }
        },

        // =========================================
        // C — Character
        // =========================================
        {
          id: "hpi_character",
          group: "chestPain",
          question: "ما طبيعة الألم؟",
          questionEn: "What is the character of the pain?",
          type: "single",
          required: true,
          AffectOnDx: true,

          options: {
            pressure: {
              label: "ضاغط",
              labelEn: "Pressure / Tightness"
            },
            burning: {
              label: "حرقان",
              labelEn: "Burning"
            },
            pleuritic_sharp: {
              label: "حاد يزداد مع التنفس",
              labelEn: "Pleuritic sharp"
            },
            tearing: {
              label: "ماحق ممتد إلى الظهر",
              labelEn: "Tearing to the back"
            }
          }
        },

        // =========================================
        // R — Radiation
        // =========================================
        {
          id: "hpi_radiation",
          group: "chestPain",
          question: "هل ينتشر الألم إلى مناطق أخرى؟",
          questionEn: "Does the pain radiate to other areas?",
          type: "single",
          required: true,
          AffectOnDx: true,

          options: {
            arm_jaw: {
              label: "الذراع الأيسر أو الفك",
              labelEn: "Left arm or jaw"
            },
            back_scapulae: {
              label: "إلى الظهر بين لوحي الكتف",
              labelEn: "Back (between scapulae)"
            },
            none: {
              label: "لا يوجد انتشار",
              labelEn: "No radiation"
            }
          }
        },

        // =========================================
        // A — Aggravating factors
        // =========================================
        {
          id: "hpi_aggravating",
          group: "chestPain",
          question: "ما الذي يزيد الألم سوءًا؟",
          questionEn: "What aggravates the pain?",
          type: "multi",
          required: false,
          AffectOnDx: true,

          options: {
            exertion: {
              label: "الجهد",
              labelEn: "Exertion"
            },
            deep_breath: {
              label: "التنفس العميق",
              labelEn: "Deep inspiration"
            },
            movement: {
              label: "الحركة أو الضغط على الصدر",
              labelEn: "Chest movement / palpation"
            },
            post_meal: {
              label: "بعد تناول الطعام",
              labelEn: "After meals"
            }
          }
        },

        // =========================================
        // R — Relieving factors
        // =========================================
        {
          id: "hpi_relieving",
          group: "chestPain",
          question: "ما الذي يخفف الألم؟",
          questionEn: "What relieves the pain?",
          type: "multi",
          required: false,
          AffectOnDx: true,

          options: {
            rest: {
              label: "الراحة",
              labelEn: "Rest"
            },
            gtn: {
              label: "النترات (GTN)",
              labelEn: "GTN"
            },
            lean_forward: {
              label: "الانحناء للأمام",
              labelEn: "Leaning forward"
            },
            antacids: {
              label: "مضادات الحموضة",
              labelEn: "Antacids"
            }
          }
        },

        // =========================================
        // A — Associated symptoms
        // =========================================
        {
          id: "hpi_associated",
          group: "chestPain",
          question: "هل توجد أعراض مصاحبة؟",
          questionEn: "Are there any associated symptoms?",
          type: "multi",
          required: false,
          AffectOnDx: true,

          options: {
            dyspnea: {
              label: "ضيق النفس",
              labelEn: "Shortness of breath"
            },
            diaphoresis: {
              label: "التعرق",
              labelEn: "Diaphoresis"
            },
            nausea: {
              label: "غثيان",
              labelEn: "Nausea"
            },
            syncope: {
              label: "إغماء",
              labelEn: "Syncope"
            },
            cough: {
              label: "سعال",
              labelEn: "Cough"
            },
            hemoptysis: {
              label: "نفث دم",
              labelEn: "Hemoptysis"
            },
            fever: {
              label: "حمّى",
              labelEn: "Fever"
            }
          }
        },

        // =========================================
        // T — Episode Duration
        // =========================================
        {
          id: "hpi_duration",
          group: "chestPain",
          question: "ما مدة كل نوبة من الألم؟",
          questionEn: "What is the duration of each pain episode?",
          type: "single",
          required: true,
          AffectOnDx: true,

          options: {
            seconds: {
              label: "ثوانٍ",
              labelEn: "Seconds"
            },
            five_20: {
              label: "٥–٢٠ دقيقة",
              labelEn: "5–20 minutes"
            },
            over_20: {
              label: "أكثر من ٢٠ دقيقة",
              labelEn: "More than 20 minutes"
            },
            continuous: {
              label: "مستمر",
              labelEn: "Continuous"
            }
          }
        },

        // =========================================
        // C — Course
        // =========================================
        {
          id: "hpi_course",
          group: "chestPain",
          question: "كيف كان سير الألم؟",
          questionEn: "How has the pain progressed?",
          type: "single",
          required: false,
          AffectOnDx: true,

          options: {
            constant: {
              label: "ثابت",
              labelEn: "Constant"
            },
            progressive: {
              label: "متزايد",
              labelEn: "Progressive"
            },
            regressive: {
              label: "متراجع",
              labelEn: "Regressive"
            },
            intermittent: {
              label: "متقطع",
              labelEn: "Intermittent"
            }
          }
        },

        // =========================================
        // S — Severity (1–10)
        // =========================================
        {
          id: "hpi_severity",
          group: "chestPain",
          question: "ما شدة الألم (من 1 إلى 10)؟",
          questionEn: "Rate the pain severity (1–10):",
          type: "text",
          required: true,
          AffectOnDx: true
        },

        // =========================================
        // Previous similar episodes
        // =========================================
        {
          id: "hpi_previous",
          group: "chestPain",
          question: "هل سبق أن حدثت نوبات مشابهة؟",
          questionEn: "Has this happened before?",
          type: "single",
          required: false,
          AffectOnDx: true,

          options: {
            yes: {
              label: "نعم",
              labelEn: "Yes"
            },
            no: {
              label: "لا",
              labelEn: "No"
            }
          }
        },

        // =========================================
        // Interventions before arrival
        // =========================================
        {
          id: "hpi_interventions",
          group: "chestPain",
          question: "هل قام المريض بأي تدخلات قبل الوصول؟",
          questionEn: "Were there any interventions done before arrival?",
          type: "text",
          required: false,
          AffectOnDx: true
        },

        // =========================================
        // Risk factors
        // =========================================
        {
          id: "hpi_risk_factors",
          group: "chestPain",
          question: "هل توجد عوامل خطر لدى المريض؟",
          questionEn: "Does the patient have risk factors?",
          type: "multi",
          required: false,
          AffectOnDx: true,

          options: {
            htn: {
              label: "ارتفاع ضغط الدم",
              labelEn: "Hypertension"
            },
            dm: {
              label: "السكري",
              labelEn: "Diabetes"
            },
            smoker: {
              label: "التدخين",
              labelEn: "Smoking"
            },
            hyperlipidemia: {
              label: "ارتفاع الدهون",
              labelEn: "Hyperlipidemia"
            },
            familyIHD: {
              label: "تاريخ عائلي لأمراض القلب",
              labelEn: "Family history of IHD"
            }
          }
        },

        // =========================================
        // Effect on activity
        // =========================================
        {
          id: "hpi_activity",
          group: "chestPain",
          question: "هل أثّر الألم على النشاط اليومي؟",
          questionEn: "Did the pain interfere with daily activity?",
          type: "single",
          required: false,
          AffectOnDx: true,

          options: {
            yes: { label: "نعم", labelEn: "Yes" },
            no: { label: "لا", labelEn: "No" }
          }
        },

        // =========================================
        // Effect on sleep
        // =========================================
        {
          id: "hpi_sleep",
          group: "chestPain",
          question: "هل أثّر الألم على النوم؟",
          questionEn: "Did the pain interfere with sleep?",
          type: "single",
          required: false,
          AffectOnDx: true,

          options: {
            yes: { label: "نعم", labelEn: "Yes" },
            no: { label: "لا", labelEn: "No" }
          }
        }

      ] // END steps

    } // END section

  ]; // END CHEST_PAIN_HPI

})(window);