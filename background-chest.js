// ========================================
// background-chest.js
// خلفية المريض — ألم الصدر فقط
// PMH + PSH + DH + FH + SH
// ========================================

"use strict";

(function (global) {

  global.CHEST_PAIN_BACKGROUND = [

    {
      id: "background_chest",
      label: "Background History (Chest Pain)",
      group: "chestPain",

      steps: [

        // =========================================
        // PAST MEDICAL HISTORY
        // =========================================
        {
          id: "pmh_chest",
          group: "chestPain",
          question: "هل يعاني المريض من أمراض مزمنة؟",
          questionEn: "Does the patient have chronic illnesses?",
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
              labelEn: "Diabetes mellitus"
            },
            asthma: {
              label: "الربو",
              labelEn: "Asthma"
            },
            epilepsy: {
              label: "الصرع",
              labelEn: "Epilepsy"
            },
            previous_ihd: {
              label: "تاريخ مرض قلبي سابق",
              labelEn: "Previous ischemic heart disease"
            },
            previous_mi: {
              label: "احتشاء عضلة القلب سابقًا",
              labelEn: "Previous myocardial infarction"
            },
            heart_failure: {
              label: "قصور قلب سابق",
              labelEn: "Previous heart failure"
            }
          }
        },

        // =========================================
        // PAST SURGICAL HISTORY
        // =========================================
        {
          id: "psh_chest",
          group: "chestPain",
          question: "هل أجرى المريض عمليات جراحية سابقة؟",
          questionEn: "Has the patient undergone previous surgeries?",
          type: "multi",
          required: false,
          AffectOnDx: true,

          options: {
            cabg: {
              label: "جراحة مجازة الشريان التاجي (CABG)",
              labelEn: "Coronary artery bypass graft (CABG)"
            },
            pci: {
              label: "قسطرة أو تدخل تاجي (PCI)",
              labelEn: "Percutaneous coronary intervention (PCI)"
            },
            amputation: {
              label: "بتر طرف بسبب جلطة سكري",
              labelEn: "Amputation due to diabetic gangrene"
            },
            blood_transfusion: {
              label: "نقل دم سابق",
              labelEn: "Previous blood transfusion"
            }
          }
        },

        // =========================================
        // DRUG HISTORY
        // =========================================
        {
          id: "dh_chest",
          group: "chestPain",
          question: "ما الأدوية التي يتناولها المريض حاليًا؟",
          questionEn: "What medications is the patient currently taking?",
          type: "multi",
          required: false,
          AffectOnDx: true,

          options: {
            aspirin: {
              label: "أسبرين",
              labelEn: "Aspirin"
            },
            statins: {
              label: "ستاتين",
              labelEn: "Statin"
            },
            insulin: {
              label: "إنسولين",
              labelEn: "Insulin"
            },
            acei: {
              label: "مثبطات الإنزيم المحول (ACEI)",
              labelEn: "ACE inhibitors"
            },
            anticoagulants: {
              label: "مضادات التخثر",
              labelEn: "Anticoagulants"
            }
          }
        },

        // =========================================
        // ALLERGIES
        // =========================================
        {
          id: "allergies_chest",
          group: "chestPain",
          question: "هل لدى المريض حساسية تجاه أدوية؟",
          questionEn: "Does the patient have any drug allergies?",
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
        // FAMILY HISTORY
        // =========================================
        {
          id: "fh_chest",
          group: "chestPain",
          question: "هل توجد أمراض قلبية في العائلة؟",
          questionEn: "Is there a family history of heart disease?",
          type: "multi",
          required: false,
          AffectOnDx: true,

          options: {
            ihd_family: {
              label: "مرض قلبي إقفاري",
              labelEn: "Ischemic heart disease"
            },
            sudden_death: {
              label: "وفاة مفاجئة",
              labelEn: "Sudden cardiac death"
            },
            htn_family: {
              label: "ارتفاع ضغط الدم",
              labelEn: "Hypertension"
            },
            dm_family: {
              label: "السكري",
              labelEn: "Diabetes"
            }
          }
        },

        // =========================================
        // SOCIAL HISTORY
        // =========================================
        {
          id: "sh_chest",
          group: "chestPain",
          question: "ما الجوانب الاجتماعية المتعلقة بصحة المريض؟",
          questionEn: "What are the relevant social factors?",
          type: "multi",
          required: false,
          AffectOnDx: true,

          options: {
            smoking: {
              label: "التدخين",
              labelEn: "Smoking"
            },
            ex_smoker: {
              label: "مدخن سابق",
              labelEn: "Ex-smoker"
            },
            alcohol: {
              label: "شرب الكحول",
              labelEn: "Alcohol intake"
            },
            sedentary: {
              label: "قلة النشاط البدني",
              labelEn: "Sedentary lifestyle"
            },
            exercise: {
              label: "ممارسة الرياضة",
              labelEn: "Exercises"
            },
            occupation_risk: {
              label: "مخاطر مهنية",
              labelEn: "Occupational hazards"
            },
            pets: {
              label: "تربية الحيوانات",
              labelEn: "Pets at home"
            },
            hygiene: {
              label: "مصادر المياه والصرف الصحي",
              labelEn: "Water supply & sanitation"
            }
          }
        }

      ] // END steps

    } // END section

  ]; // END CHEST_PAIN_BACKGROUND

})(window);