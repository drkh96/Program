// ========================================
// chest-data-ros.js (NO FILTERS VERSION)
// ========================================

"use strict";

function dxR(ids) {
  return ids || [];
}

function rR(text, diseases) {
  return { text, diseases: diseases || [] };
}

window.CHEST_SECTIONS_ROS = [
  {
    id: "ros",
    label: "Review of Systems",
    labelEn: "Review of Systems",
    steps: [

      // ========================= CVS =========================
      {
        id: "rosCVS",
        sectionId: "ros",
        sectionLabel: "ROS",
        sectionLabelEn: "ROS",
        question: "أعراض جهاز الدوران (اختر كل ما ينطبق):",
        questionEn: "Cardiovascular symptoms (select all that apply):",
        type: "multi",
        required: false,

        options: {
          palpitations: {
            label: "خفقان",
            labelEn: "Palpitations",
            dxAdd: dxR(["Arrhythmia"]),
            reasoning: [
              rR("Palpitations with chest discomfort raise suspicion for arrhythmia.", ["Arrhythmia"])
            ]
          },
          orthopneaPND: {
            label: "Orthopnea / PND / تورّم القدمين",
            labelEn: "Orthopnea / PND / ankle swelling",
            dxAdd: dxR(["HF"]),
            reasoning: [
              rR("Orthopnea and edema strongly indicate heart failure.", ["HF"])
            ]
          },
          noCVSsymptoms: {
            label: "لا توجد أعراض قلبية إضافية مهمة",
            labelEn: "No additional significant cardiovascular symptoms",
            dxAdd: dxR([]),
            dxRemove: dxR(["HF", "Arrhythmia"]),
            reasoning: [
              rR("Absence of CVS symptoms lowers HF and arrhythmia likelihood.", ["HF", "Arrhythmia"])
            ]
          }
        }
      },

      // ========================= RESP =========================
      {
        id: "rosResp",
        sectionId: "ros",
        sectionLabel: "ROS",
        sectionLabelEn: "ROS",
        question: "أعراض الجهاز التنفسي (اختر كل ما ينطبق):",
        questionEn: "Respiratory symptoms (select all that apply):",
        type: "multi",
        required: false,

        options: {
          chronicCough: {
            label: "كحّة مزمنة",
            labelEn: "Chronic cough",
            dxAdd: dxR(["COPD", "Asthma", "Pneumonia"]),
            reasoning: [
              rR("Chronic cough suggests COPD, asthma, or chronic infection.", ["COPD", "Asthma", "Pneumonia"])
            ]
          },
          wheeze: {
            label: "صفير بالصدر (Wheeze)",
            labelEn: "Wheeze",
            dxAdd: dxR(["Asthma", "COPD"]),
            reasoning: [
              rR("Wheezing indicates airway obstruction.", ["Asthma", "COPD"])
            ]
          },
          acuteDyspnea: {
            label: "ضيق نفس حاد جديد",
            labelEn: "New acute dyspnea",
            dxAdd: dxR(["PEMajor", "HF", "Pneumonia"]),
            reasoning: [
              rR("Acute dyspnea suggests PE, HF, or pneumonia.", ["PEMajor", "HF", "Pneumonia"])
            ]
          },
          noRespsx: {
            label: "لا توجد أعراض تنفسية إضافية مهمة",
            labelEn: "No significant respiratory symptoms",
            dxAdd: dxR([]),
            dxRemove: dxR(["Pneumonia", "PEMajor"]),
            reasoning: [
              rR("No respiratory symptoms lowers PE/pneumonia likelihood.", ["Pneumonia", "PEMajor"])
            ]
          }
        }
      },

      // ========================= GIT =========================
      {
        id: "rosGIT",
        sectionId: "ros",
        sectionLabel: "ROS",
        sectionLabelEn: "ROS",
        question: "أعراض الجهاز الهضمي (اختر كل ما ينطبق):",
        questionEn: "Gastrointestinal symptoms (select all that apply):",
        type: "multi",
        required: false,

        options: {
          heartburn: {
            label: "حُرقة خلف القص / ارتجاع حمضي",
            labelEn: "Heartburn / reflux",
            dxAdd: dxR(["GERD"]),
            reasoning: [
              rR("Burning chest pain with reflux is typical of GERD.", ["GERD"])
            ]
          },
          epigastricPain: {
            label: "ألم شرسوفي مرتبط بالطعام",
            labelEn: "Epigastric pain related to meals",
            dxAdd: dxR(["PepticUlcer", "GERD"]),
            reasoning: [
              rR("Epigastric pain with food supports PUD or GERD.", ["PepticUlcer", "GERD"])
            ]
          },
          noGITsx: {
            label: "لا توجد أعراض هضمية إضافية مهمة",
            labelEn: "No significant GI symptoms",
            dxAdd: dxR([]),
            dxRemove: dxR(["GERD", "PepticUlcer"]),
            reasoning: [
              rR("Absence of GI symptoms lowers GERD/PUD likelihood.", ["GERD", "PepticUlcer"])
            ]
          }
        }
      },

      // ========================= CNS =========================
      {
        id: "rosCNS",
        sectionId: "ros",
        sectionLabel: "ROS",
        sectionLabelEn: "ROS",
        question: "أعراض عصبية (اختر كل ما ينطبق):",
        questionEn: "Neurological symptoms (select all that apply):",
        type: "multi",
        required: false,

        options: {
          focalDeficit: {
            label: "ضعف أو خدر في أحد الأطراف / أعراض بؤرية",
            labelEn: "Focal weakness / numbness",
            dxAdd: dxR(["Stroke"]),
            reasoning: [
              rR("Focal deficits strongly suggest stroke or TIA.", ["Stroke"])
            ]
          },
          noCNSsx: {
            label: "لا توجد أعراض عصبية مهمة",
            labelEn: "No significant neurological symptoms",
            dxAdd: dxR([]),
            dxRemove: dxR(["Stroke"]),
            reasoning: [
              rR("No neurological symptoms lowers stroke likelihood.", ["Stroke"])
            ]
          }
        }
      },

      // ========================= LIMBS / MSK =========================
      {
        id: "rosLM",
        sectionId: "ros",
        sectionLabel: "ROS",
        sectionLabelEn: "ROS",
        question: "أعراض الأطراف (اختر كل ما ينطبق):",
        questionEn: "Limb symptoms (select all that apply):",
        type: "multi",
        required: false,

        options: {
          unilateralSwelling: {
            label: "تورّم أحادي مؤلم في الساق",
            labelEn: "Unilateral painful leg swelling",
            dxAdd: dxR(["DVT", "PEMajor"]),
            reasoning: [
              rR("Unilateral swelling is classic for DVT → possible PE.", ["DVT", "PEMajor"])
            ]
          },
          bilateralEdema: {
            label: "تورّم ثنائي في الطرفين",
            labelEn: "Bilateral leg edema",
            dxAdd: dxR(["HF"]),
            reasoning: [
              rR("Bilateral edema suggests HF or fluid overload.", ["HF"])
            ]
          },
          noLMsx: {
            label: "لا توجد أعراض في الأطراف مهمة",
            labelEn: "No significant limb symptoms",
            dxAdd: dxR([]),
            dxRemove: dxR(["DVT", "HF"]),
            reasoning: [
              rR("Absence of limb findings lowers DVT and HF likelihood.", ["DVT", "HF"])
            ]
          }
        }
      },

      // ========================= GENERAL / HEMA =========================
      {
        id: "rosHema",
        sectionId: "ros",
        sectionLabel: "ROS",
        sectionLabelEn: "ROS",
        question: "أعراض عامة / دموية (اختر كل ما ينطبق):",
        questionEn: "General / hematologic symptoms (select all that apply):",
        type: "multi",
        required: false,

        options: {
          weightLoss: {
            label: "نقص وزن غير مفسّر",
            labelEn: "Unintentional weight loss",
            dxAdd: dxR(["Cancer"]),
            reasoning: [
              rR("Unexplained weight loss may suggest malignancy.", ["Cancer"])
            ]
          },
          feverNightSweats: {
            label: "حرارة / تعرّق ليلي",
            labelEn: "Fever / night sweats",
            dxAdd: dxR(["Infection", "Pneumonia", "TB"]),
            reasoning: [
              rR("Fever/night sweats indicate infection or TB.", ["Infection", "Pneumonia", "TB"])
            ]
          },
          easyBruising: {
            label: "كدمات بسهولة / نزف متكرر",
            labelEn: "Easy bruising / bleeding",
            dxAdd: dxR(["Coagulopathy"]),
            reasoning: [
              rR("Easy bruising indicates coagulopathy.", ["Coagulopathy"])
            ]
          },
          noHemasx: {
            label: "لا توجد أعراض عامة مهمة",
            labelEn: "No significant general symptoms",
            dxAdd: dxR([]),
            dxRemove: dxR(["Infection", "Cancer"]),
            reasoning: [
              rR("No systemic symptoms lowers infection/malignancy likelihood.", ["Infection", "Cancer"])
            ]
          }
        }
      }
    ]
  }
];