// ========================================
// chest-data-ros.js
// Review of Systems (bilingual labels, EN reasoning)
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
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "Palpitations with chest discomfort raise suspicion for clinically significant arrhythmia.",
                ["Arrhythmia"]
              )
            ]
          },
          orthopneaPND: {
            label: "Orthopnea / PND / تورّم القدمين",
            labelEn: "Orthopnea / PND / ankle swelling",
            dxAdd: dxR(["HF"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "Orthopnea, PND, and peripheral edema are classic features of heart failure.",
                ["HF"]
              )
            ]
          },
          noCVSsymptoms: {
            label: "لا توجد أعراض قلبية إضافية مهمة",
            labelEn: "No additional significant cardiovascular symptoms",
            dxAdd: dxR([]),
            dxRemove: dxR(["HF", "Arrhythmia"]),
            reasoning: [
              rR(
                "Absence of additional cardiovascular symptoms lowers the likelihood of overt heart failure or major arrhythmia.",
                ["HF", "Arrhythmia"]
              )
            ]
          }
        }
      },
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
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "Chronic cough suggests underlying chronic lung disease such as COPD or asthma, or chronic infection.",
                ["COPD", "Asthma", "Pneumonia"]
              )
            ]
          },
          wheeze: {
            label: "صفير بالصدر (Wheeze)",
            labelEn: "Wheeze",
            dxAdd: dxR(["Asthma", "COPD"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "Wheezing usually reflects airway obstruction as seen in asthma or COPD.",
                ["Asthma", "COPD"]
              )
            ]
          },
          acuteDyspnea: {
            label: "ضيق نفس حاد جديد",
            labelEn: "New acute shortness of breath",
            dxAdd: dxR(["PEMajor", "HF", "Pneumonia"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "Acute dyspnea with chest pain may indicate pulmonary embolism, acute heart failure, or acute pneumonia.",
                ["PEMajor", "HF", "Pneumonia"]
              )
            ]
          },
          noRespsx: {
            label: "لا توجد أعراض تنفسية إضافية مهمة",
            labelEn: "No additional significant respiratory symptoms",
            dxAdd: dxR([]),
            dxRemove: dxR(["Pneumonia", "PEMajor"]),
            reasoning: [
              rR(
                "Absence of respiratory symptoms makes overt pneumonia and clinically obvious PE less likely.",
                ["Pneumonia", "PEMajor"]
              )
            ]
          }
        }
      },
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
            labelEn: "Retrosternal heartburn / acid reflux",
            dxAdd: dxR(["GERD"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "Retrosternal burning with acid reflux is typical for GERD.",
                ["GERD"]
              )
            ]
          },
          epigastricPain: {
            label: "ألم شرسوفي مرتبط بالطعام",
            labelEn: "Epigastric pain related to meals",
            dxAdd: dxR(["PepticUlcer", "GERD"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "Epigastric pain related to food supports peptic ulcer disease or GERD.",
                ["PepticUlcer", "GERD"]
              )
            ]
          },
          noGITsx: {
            label: "لا توجد أعراض هضمية إضافية مهمة",
            labelEn: "No additional significant gastrointestinal symptoms",
            dxAdd: dxR([]),
            dxRemove: dxR(["GERD", "PepticUlcer"]),
            reasoning: [
              rR(
                "Absence of GI symptoms makes GERD and peptic ulcer disease less likely as the primary cause.",
                ["GERD", "PepticUlcer"]
              )
            ]
          }
        }
      },
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
            labelEn: "Focal weakness or numbness / focal deficits",
            dxAdd: dxR(["Stroke"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "Focal neurological deficits support a diagnosis of stroke or TIA.",
                ["Stroke"]
              )
            ]
          },
          noCNSsx: {
            label: "لا توجد أعراض عصبية مهمة",
            labelEn: "No significant neurological symptoms",
            dxAdd: dxR([]),
            dxRemove: dxR(["Stroke"]),
            reasoning: [
              rR(
                "Lack of neurological symptoms makes stroke less likely as a cause of the presentation.",
                ["Stroke"]
              )
            ]
          }
        }
      },
      {
        id: "rosLM",
        sectionId: "ros",
        sectionLabel: "ROS",
        sectionLabelEn: "ROS",
        question: "أعراض الأطراف / الجهاز الحركي (اختر كل ما ينطبق):",
        questionEn: "Limb / musculoskeletal symptoms (select all that apply):",
        type: "multi",
        required: false,
        options: {
          unilateralSwelling: {
            label: "تورّم أحادي مؤلم في الساق",
            labelEn: "Painful unilateral leg swelling",
            dxAdd: dxR(["DVT", "PEMajor"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "Unilateral painful leg swelling is a key sign of DVT and therefore raises suspicion for PE.",
                ["DVT", "PEMajor"]
              )
            ]
          },
          bilateralEdema: {
            label: "تورّم ثنائي في الطرفين السفليين",
            labelEn: "Bilateral leg edema",
            dxAdd: dxR(["HF"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "Bilateral lower-limb edema supports heart failure or fluid overload.",
                ["HF"]
              )
            ]
          },
          noLMsx: {
            label: "لا توجد أعراض في الأطراف مهمة",
            labelEn: "No significant limb symptoms",
            dxAdd: dxR([]),
            dxRemove: dxR(["DVT", "HF"]),
            reasoning: [
              rR(
                "Absence of limb swelling or DVT signs lowers the probability of PE and overt heart failure.",
                ["DVT", "HF"]
              )
            ]
          }
        }
      },
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
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "Unintentional weight loss raises suspicion for underlying malignancy.",
                ["Cancer"]
              )
            ]
          },
          feverNightSweats: {
            label: "حرارة / تعرّق ليلي",
            labelEn: "Fever or night sweats",
            dxAdd: dxR(["Infection", "Pneumonia", "TB"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "Fever and night sweats suggest infection or chronic inflammatory disease such as TB.",
                ["Infection", "Pneumonia", "TB"]
              )
            ]
          },
          easyBruising: {
            label: "كدمات بسهولة / نزف متكرر",
            labelEn: "Easy bruising or recurrent bleeding",
            dxAdd: dxR(["Coagulopathy"]),
            dxRemove: dxR([]),
            reasoning: [
              rR(
                "Easy bruising and frequent bleeding episodes suggest an underlying coagulopathy.",
                ["Coagulopathy"]
              )
            ]
          },
          noHemasx: {
            label: "لا توجد أعراض عامة مهمة",
            labelEn: "No significant general or hematologic symptoms",
            dxAdd: dxR([]),
            dxRemove: dxR(["Infection", "Cancer"]),
            reasoning: [
              rR(
                "Absence of systemic symptoms makes chronic infection and advanced malignancy less likely.",
                ["Infection", "Cancer"]
              )
            ]
          }
        }
      }
    ]
  }
];