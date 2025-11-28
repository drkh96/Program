// ========================================
// chest-data-background.js
// PMH, PSH, DH, FH, SH sections
// Bilingual labels, EN reasoning
// ========================================

"use strict";

function dxB(ids) {
  return ids || [];
}
function rB(text, diseases) {
  return { text, diseases: diseases || [] };
}

window.CHEST_SECTIONS_BACKGROUND = [
  {
    id: "pmh",
    label: "Past Medical History",
    labelEn: "Past Medical History",
    steps: [
      {
        id: "pmhChronic",
        sectionId: "pmh",
        sectionLabel: "PMH",
        sectionLabelEn: "PMH",
        question: "هل لدى المريض أمراض مزمنة؟ (اختر كل ما ينطبق)",
        questionEn: "Does the patient have any chronic medical conditions? (select all that apply)",
        type: "multi",
        required: false,
        options: {
          dm: {
            label: "داء السكري",
            labelEn: "Diabetes mellitus",
            dxAdd: dxB(["IHD", "MI"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Diabetes mellitus is a strong risk factor for atherosclerosis and coronary artery disease.",
                ["IHD", "MI"]
              )
            ]
          },
          htn: {
            label: "ارتفاع ضغط الدم",
            labelEn: "Hypertension",
            dxAdd: dxB(["IHD", "HF", "Dissection"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Hypertension increases the risk of ischemic heart disease, heart failure, and aortic dissection.",
                ["IHD", "HF", "Dissection"]
              )
            ]
          },
          dyslipid: {
            label: "اضطراب شحوم الدم",
            labelEn: "Dyslipidemia",
            dxAdd: dxB(["IHD"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Dyslipidemia is a classic risk factor for atherosclerotic coronary disease.",
                ["IHD"]
              )
            ]
          },
          knownIHD: {
            label: "سابق IHD / MI / قسطرة أو دعامة",
            labelEn: "Previous IHD / MI / PCI or stent",
            dxAdd: dxB(["IHD", "MI", "ACS"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "A history of MI or coronary intervention makes current chest pain very likely to be cardiac in origin.",
                ["IHD", "MI", "ACS"]
              )
            ]
          },
          prevDVTPE: {
            label: "DVT / PE سابق",
            labelEn: "Previous DVT / PE",
            dxAdd: dxB(["PEMajor", "DVT"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Past DVT or PE markedly increases the risk of recurrent venous thromboembolism.",
                ["PEMajor", "DVT"]
              )
            ]
          },
          nonePMH: {
            label: "لا توجد أمراض مزمنة مهمة",
            labelEn: "No significant chronic medical diseases",
            dxAdd: dxB([]),
            dxRemove: dxB(["IHD", "HF", "PEMajor"]),
            reasoning: [
              rB(
                "Absence of major chronic diseases reduces the burden of cardiac and thrombotic risk factors.",
                ["IHD", "HF", "PEMajor"]
              )
            ]
          }
        }
      }
    ]
  },

  {
    id: "psh",
    label: "Past Surgical History",
    labelEn: "Past Surgical History",
    steps: [
      {
        id: "pshOps",
        sectionId: "psh",
        sectionLabel: "PSH",
        sectionLabelEn: "PSH",
        question:
          "هل أجرى المريض عمليات كبرى مؤخراً أو بقي طريح الفراش لفترة طويلة؟",
        questionEn:
          "Has the patient had major surgery recently or prolonged immobilization?",
        type: "multi",
        required: false,
        options: {
          recentMajorSurgery: {
            label: "جراحة كبرى خلال آخر 4 أسابيع",
            labelEn: "Major surgery within the last 4 weeks",
            dxAdd: dxB(["PEMajor", "DVT"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Recent major surgery with reduced mobility is a major risk factor for DVT and pulmonary embolism.",
                ["PEMajor", "DVT"]
              )
            ]
          },
          prolongedImmobilisation: {
            label: "عدم حركة لأكثر من 3 أيام (سرير/جبيرة)",
            labelEn: "Prolonged immobilisation >3 days (bed-bound or cast)",
            dxAdd: dxB(["DVT", "PEMajor"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Prolonged immobilisation increases venous stasis and risk of DVT and subsequent PE.",
                ["DVT", "PEMajor"]
              )
            ]
          },
          noPSH: {
            label: "لا توجد عمليات كبرى أو عدم حركة مهم",
            labelEn: "No major surgery or significant immobilisation",
            dxAdd: dxB([]),
            dxRemove: dxB(["DVT", "PEMajor"]),
            reasoning: [
              rB(
                "Absence of recent surgery or immobilisation lowers the probability of provoked DVT/PE.",
                ["DVT", "PEMajor"]
              )
            ]
          }
        }
      }
    ]
  },

  {
    id: "dh",
    label: "Drug History",
    labelEn: "Drug History",
    steps: [
      {
        id: "drugHistory",
        sectionId: "dh",
        sectionLabel: "DH",
        sectionLabelEn: "DH",
        question: "ما الأدوية التي يتناولها المريض بانتظام؟",
        questionEn: "Which medications does the patient take regularly?",
        type: "multi",
        required: false,
        options: {
          aspirin: {
            label: "أسبرين / مضادات صفائح",
            labelEn: "Aspirin / antiplatelet agents",
            dxAdd: dxB([]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Use of aspirin or antiplatelets often indicates known ischemic heart disease.",
                ["IHD", "MI"]
              )
            ]
          },
          anticoagulant: {
            label: "مضادات تخثر (Warfarin / DOAC)",
            labelEn: "Anticoagulants (warfarin / DOAC)",
            dxAdd: dxB([]),
            dxRemove: dxB(["PEMajor", "DVT"]),
            reasoning: [
              rB(
                "Therapeutic anticoagulation reduces the probability of a new DVT/PE, although it does not completely exclude it.",
                ["PEMajor", "DVT"]
              )
            ]
          },
          ocp: {
            label: "حبوب منع الحمل (OCP)",
            labelEn: "Oral contraceptive pills",
            dxAdd: dxB(["DVT", "PEMajor"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Combined oral contraceptives are a well-known risk factor for venous thromboembolism.",
                ["DVT", "PEMajor"]
              )
            ]
          },
          steroids: {
            label: "ستيرويدات / أدوية مثبطة للمناعة",
            labelEn: "Steroids / immunosuppressive drugs",
            dxAdd: dxB(["Infection"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Immunosuppression increases susceptibility to infections, including pneumonia and systemic sepsis.",
                ["Infection"]
              )
            ]
          },
          noDrugs: {
            label: "لا يتناول أدوية مزمنة مهمة",
            labelEn: "No significant chronic medications",
            dxAdd: dxB([]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Absence of chronic medication does not strongly modify risk, but suggests fewer known chronic conditions.",
                []
              )
            ]
          }
        }
      }
    ]
  },

  {
    id: "fh",
    label: "Family History",
    labelEn: "Family History",
    steps: [
      {
        id: "familyHistory",
        sectionId: "fh",
        sectionLabel: "FH",
        sectionLabelEn: "FH",
        question: "هل يوجد تاريخ عائلي مهم؟",
        questionEn: "Is there any relevant family history?",
        type: "single",
        required: false,
        options: {
          prematureIHD: {
            label: "إصابة قلبية (IHD/MI) في عمر مبكر ضمن العائلة",
            labelEn: "Premature IHD/MI in a first-degree relative",
            dxAdd: dxB(["IHD", "MI"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Premature coronary disease in first-degree relatives suggests a genetic predisposition to IHD.",
                ["IHD", "MI"]
              )
            ]
          },
          suddenDeath: {
            label: "وفاة مفاجئة غير مفسّرة في أحد الأقارب",
            labelEn: "Unexplained sudden death in a relative",
            dxAdd: dxB(["Arrhythmia"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Unexplained sudden death in the family may indicate inherited cardiomyopathy or channelopathy causing arrhythmia.",
                ["Arrhythmia"]
              )
            ]
          },
          noFH: {
            label: "لا يوجد تاريخ عائلي مهم",
            labelEn: "No relevant family history",
            dxAdd: dxB([]),
            dxRemove: dxB(["IHD"]),
            reasoning: [
              rB(
                "Lack of positive family history reduces hereditary contribution to ischemic heart disease risk.",
                ["IHD"]
              )
            ]
          }
        }
      }
    ]
  },

  {
    id: "sh",
    label: "Social History",
    labelEn: "Social History",
    steps: [
      {
        id: "socialHistory",
        sectionId: "sh",
        sectionLabel: "SH",
        sectionLabelEn: "SH",
        question: "ما هي العادات ونمط الحياة؟ (اختر كل ما ينطبق)",
        questionEn: "What are the patient's habits and lifestyle? (select all that apply)",
        type: "multi",
        required: false,
        options: {
          smoker: {
            label: "مدخّن حالي",
            labelEn: "Current smoker",
            dxAdd: dxB(["IHD", "MI", "COPD"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Current smoking is a major risk factor for ischemic heart disease, MI, and chronic lung disease.",
                ["IHD", "MI", "COPD"]
              )
            ]
          },
          exSmoker: {
            label: "مدخّن سابق",
            labelEn: "Ex-smoker",
            dxAdd: dxB(["IHD", "COPD"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "A history of smoking remains a cardiovascular and respiratory risk factor, although less than active smoking.",
                ["IHD", "COPD"]
              )
            ]
          },
          sedentary: {
            label: "قلة النشاط البدني",
            labelEn: "Sedentary lifestyle",
            dxAdd: dxB(["IHD", "HF"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Low physical activity contributes to cardiovascular risk and predisposes to heart failure.",
                ["IHD", "HF"]
              )
            ]
          },
          highStress: {
            label: "ضغوط نفسية عالية / عمل مرهق",
            labelEn: "High psychological stress / demanding job",
            dxAdd: dxB(["Anxiety", "IHD"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "High stress may trigger panic attacks and is also associated with increased cardiac risk.",
                ["Anxiety", "IHD"]
              )
            ]
          },
          noSH: {
            label: "لا توجد عوامل اجتماعية واضحة مؤثرة",
            labelEn: "No clearly relevant social factors",
            dxAdd: dxB([]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Absence of obvious social risk factors does not exclude disease but removes some lifestyle-related risks.",
                []
              )
            ]
          }
        }
      }
    ]
  }
];