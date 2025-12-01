// ========================================
// ros-chest.js
// Review of Systems — خاص بألم الصدر فقط
// ========================================

"use strict";

(function (global) {

  global.CHEST_PAIN_ROS = [

    {
      id: "ros_chest",
      label: "Review of Systems (Chest Pain)",
      group: "chestPain",

      steps: [

        // =========================================
        // GENERAL
        // =========================================
        {
          id: "ros_general",
          group: "chestPain",
          question: "هل توجد أعراض عامة؟",
          questionEn: "Are there any general symptoms?",
          type: "multi",
          required: false,
          AffectOnDx: true,

          options: {
            fever: {
              label: "حمّى",
              labelEn: "Fever"
            },
            weight_loss: {
              label: "نقص وزن",
              labelEn: "Weight loss"
            },
            night_sweats: {
              label: "تعرق ليلي",
              labelEn: "Night sweats"
            },
            fatigue: {
              label: "إرهاق عام",
              labelEn: "General fatigue"
            }
          }
        },

        // =========================================
        // CARDIOVASCULAR
        // =========================================
        {
          id: "ros_cvs",
          group: "chestPain",
          question: "هل توجد أعراض قلبية؟",
          questionEn: "Are there any cardiovascular symptoms?",
          type: "multi",
          required: false,
          AffectOnDx: true,

          options: {
            palpitations: {
              label: "خفقان",
              labelEn: "Palpitations"
            },
            orthopnea: {
              label: "ضيق نفس عند الاستلقاء",
              labelEn: "Orthopnea"
            },
            pnd: {
              label: "نوبات ضيق النفس الليلية",
              labelEn: "Paroxysmal nocturnal dyspnea"
            },
            edema: {
              label: "تورّم الأطراف",
              labelEn: "Peripheral edema"
            },
            syncope: {
              label: "إغماء",
              labelEn: "Syncope"
            }
          }
        },

        // =========================================
        // RESPIRATORY
        // =========================================
        {
          id: "ros_respiratory",
          group: "chestPain",
          question: "هل توجد أعراض تنفسية؟",
          questionEn: "Are there any respiratory symptoms?",
          type: "multi",
          required: false,
          AffectOnDx: true,

          options: {
            cough: {
              label: "سعال",
              labelEn: "Cough"
            },
            sputum: {
              label: "بلغم",
              labelEn: "Sputum"
            },
            wheeze: {
              label: "صفير",
              labelEn: "Wheeze"
            },
            hemoptysis: {
              label: "نفث دم",
              labelEn: "Hemoptysis"
            }
          }
        },

        // =========================================
        // GASTROINTESTINAL — مهم لأنه مرتبط بـ GERD & MI
        // =========================================
        {
          id: "ros_gi",
          group: "chestPain",
          question: "هل توجد أعراض هضمية؟",
          questionEn: "Are there any gastrointestinal symptoms?",
          type: "multi",
          required: false,
          AffectOnDx: true,

          options: {
            nausea: {
              label: "غثيان",
              labelEn: "Nausea"
            },
            vomiting: {
              label: "استفراغ",
              labelEn: "Vomiting"
            },
            regurgitation: {
              label: "ارتجاع",
              labelEn: "Regurgitation"
            },
            epigastric_pain: {
              label: "ألم شرسوفي",
              labelEn: "Epigastric pain"
            }
          }
        },

        // =========================================
        // NEUROLOGICAL
        // =========================================
        {
          id: "ros_neuro",
          group: "chestPain",
          question: "هل توجد أعراض عصبية؟",
          questionEn: "Are there any neurological symptoms?",
          type: "multi",
          required: false,
          AffectOnDx: true,

          options: {
            weakness: {
              label: "ضعف في أحد الأطراف",
              labelEn: "Limb weakness"
            },
            numbness: {
              label: "تنميل",
              labelEn: "Numbness"
            },
            dizziness: {
              label: "دوخة",
              labelEn: "Dizziness"
            },
            speech_issue: {
              label: "مشاكل في الكلام",
              labelEn: "Speech difficulty"
            }
          }
        },

        // =========================================
        // MUSCULOSKELETAL
        // =========================================
        {
          id: "ros_msk",
          group: "chestPain",
          question: "هل توجد أعراض عضلية هيكلية؟",
          questionEn: "Are there any musculoskeletal symptoms?",
          type: "multi",
          required: false,
          AffectOnDx: true,

          options: {
            muscle_pain: {
              label: "ألم عضلي",
              labelEn: "Muscle pain"
            },
            joint_swelling: {
              label: "تورّم المفاصل",
              labelEn: "Joint swelling"
            },
            chest_wall_tenderness: {
              label: "ألم عند الضغط على جدار الصدر",
              labelEn: "Chest wall tenderness"
            }
          }
        },

        // =========================================
        // HEMATOLOGICAL
        // =========================================
        {
          id: "ros_heme",
          group: "chestPain",
          question: "هل توجد أعراض دموية؟",
          questionEn: "Are there any hematologic symptoms?",
          type: "multi",
          required: false,
          AffectOnDx: true,

          options: {
            pallor: {
              label: "شحوب",
              labelEn: "Pallor"
            },
            easy_fatigue: {
              label: "إرهاق مع الجهد",
              labelEn: "Easy fatigability"
            },
            bleeding: {
              label: "قابلية للنزيف",
              labelEn: "Bleeding tendency"
            }
          }
        }

      ] // END steps
    } // END section

  ]; // END CHEST_PAIN_ROS

})(window);