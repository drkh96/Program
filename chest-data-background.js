// ========================================
// chest-data-background.js
// PMH, PSH, DH, FH, SH sections
// Bilingual labels, EN reasoning
// ========================================

"use strict";

// --------------------------------------------------
// FIXED → Define dxB() and rB() globally for this file
// --------------------------------------------------
function dxB(ids) {
  return ids || [];
}

function rB(text, diseases) {
  return { text, diseases: diseases || [] };
}

window.CHEST_SECTIONS_BACKGROUND = [
  // ==============================
  // Past Medical History (PMH)
  // ==============================
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
        questionEn:
          "Does the patient have any chronic medical conditions? (select all that apply)",
        type: "multi",
        required: false,
        visibleWhen: {
          all: [
            { stepId: "department", equals: "internal" },
            { stepId: "system", equals: "cvs" },
            { stepId: "mainSymptom", equals: "chestPain" }
          ]
        },
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
                "A history of MI or coronary intervention makes current chest pain very likely to be cardiac.",
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
                "Absence of major chronic diseases reduces the burden of cardiac/thrombotic risk.",
                ["IHD", "HF", "PEMajor"]
              )
            ]
          }
        }
      }
    ]
  },

  // ==============================
  // Past Surgical History (PSH)
  // ==============================
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
        visibleWhen: {
          all: [
            { stepId: "department", equals: "internal" },
            { stepId: "system", equals: "cvs" },
            { stepId: "mainSymptom", equals: "chestPain" }
          ]
        },
        options: {
          recentMajorSurgery: {
            label: "جراحة كبرى خلال آخر 4 أسابيع",
            labelEn: "Major surgery within the last 4 weeks",
            dxAdd: dxB(["PEMajor", "DVT"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Recent major surgery with reduced mobility increases risk of DVT/PE.",
                ["PEMajor", "DVT"]
              )
            ]
          },
          prolongedImmobilisation: {
            label: "عدم حركة لأكثر من 3 أيام",
            labelEn: "Prolonged immobilisation >3 days",
            dxAdd: dxB(["DVT", "PEMajor"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Prolonged immobilisation causes venous stasis and raises DVT/PE risk.",
                ["DVT", "PEMajor"]
              )
            ]
          },
          noPSH: {
            label: "لا توجد عمليات أو عدم حركة مهم",
            labelEn: "No major surgery or significant immobilisation",
            dxAdd: dxB([]),
            dxRemove: dxB(["DVT", "PEMajor"]),
            reasoning: [
              rB(
                "Absence of surgical/immobilisation history lowers probability of provoked PE/DVT.",
                ["DVT", "PEMajor"]
              )
            ]
          }
        }
      }
    ]
  },

  // ==============================
  // Drug History (DH)
  // ==============================
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
        question: "ما الأدوية التي يتناولها المريض؟",
        questionEn: "Which medications does the patient take regularly?",
        type: "multi",
        required: false,
        visibleWhen: {
          all: [
            { stepId: "department", equals: "internal" },
            { stepId: "system", equals: "cvs" },
            { stepId: "mainSymptom", equals: "chestPain" }
          ]
        },
        options: {
          aspirin: {
            label: "أسبرين / مضادات صفائح",
            labelEn: "Aspirin / antiplatelets",
            dxAdd: dxB([]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Use of antiplatelets may indicate underlying ischemic heart disease.",
                ["IHD", "MI"]
              )
            ]
          },
          anticoagulant: {
            label: "مضادات تخثر",
            labelEn: "Anticoagulants",
            dxAdd: dxB([]),
            dxRemove: dxB(["PEMajor", "DVT"]),
            reasoning: [
              rB(
                "Anticoagulation reduces risk of thromboembolism but does not fully exclude it.",
                ["PEMajor", "DVT"]
              )
            ]
          },
          ocp: {
            label: "حبوب منع الحمل",
            labelEn: "Oral contraceptive pills",
            dxAdd: dxB(["DVT", "PEMajor"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "OCPs increase the risk of venous thromboembolism.",
                ["DVT", "PEMajor"]
              )
            ]
          },
          steroids: {
            label: "ستيرويدات / مثبطات مناعة",
            labelEn: "Steroids / immunosuppressants",
            dxAdd: dxB(["Infection"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Immunosuppression increases risk of severe infections.",
                ["Infection"]
              )
            ]
          },
          noDrugs: {
            label: "لا توجد أدوية مهمة",
            labelEn: "No significant medications",
            dxAdd: dxB([]),
            dxRemove: dxB([]),
            reasoning: [
              rB("Absence of medications gives little diagnostic weight.", [])
            ]
          }
        }
      }
    ]
  },

  // ==============================
  // Family History (FH)
  // ==============================
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
        visibleWhen: {
          all: [
            { stepId: "department", equals: "internal" },
            { stepId: "system", equals: "cvs" },
            { stepId: "mainSymptom", equals: "chestPain" }
          ]
        },
        options: {
          prematureIHD: {
            label: "إصابة قلبية مبكرة بالعائلة",
            labelEn: "Premature IHD/MI in family",
            dxAdd: dxB(["IHD", "MI"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Family history of premature IHD suggests genetic predisposition.",
                ["IHD", "MI"]
              )
            ]
          },
          suddenDeath: {
            label: "وفاة مفاجئة غير مفسّرة",
            labelEn: "Unexplained sudden death in family",
            dxAdd: dxB(["Arrhythmia"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Sudden unexplained death suggests inherited arrhythmia disorders.",
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
                "Absence of family history reduces hereditary cardiac risk.",
                ["IHD"]
              )
            ]
          }
        }
      }
    ]
  },

  // ==============================
  // Social History (SH)
  // ==============================
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
        questionEn:
          "What are the patient's habits and lifestyle? (select all that apply)",
        type: "multi",
        required: false,
        visibleWhen: {
          all: [
            { stepId: "department", equals: "internal" },
            { stepId: "system", equals: "cvs" },
            { stepId: "mainSymptom", equals: "chestPain" }
          ]
        },
        options: {
          smoker: {
            label: "مدخّن حالي",
            labelEn: "Current smoker",
            dxAdd: dxB(["IHD", "MI", "COPD"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Current smoking is a major risk factor for IHD, MI, and chronic lung disease.",
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
                "Ex-smokers still carry elevated cardiovascular risk.",
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
                "Sedentary lifestyle contributes to cardiovascular risk and HF.",
                ["IHD", "HF"]
              )
            ]
          },
          highStress: {
            label: "ضغوط نفسية عالية",
            labelEn: "High psychological stress",
            dxAdd: dxB(["Anxiety", "IHD"]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "High stress may trigger panic attacks and worsen cardiac ischemia.",
                ["Anxiety", "IHD"]
              )
            ]
          },
          noSH: {
            label: "لا توجد عوامل اجتماعية مهمة",
            labelEn: "No significant social factors",
            dxAdd: dxB([]),
            dxRemove: dxB([]),
            reasoning: [
              rB(
                "Absence of social risk factors removes some lifestyle-related risks.",
                []
              )
            ]
          }
        }
      }
    ]
  }
];