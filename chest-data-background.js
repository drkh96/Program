// ========================================
// chest-data-background.js (NO FILTERS VERSION)
// ========================================

"use strict";

function dxB(ids) { return ids || []; }
function rB(text, diseases) { return { text, diseases: diseases || [] }; }

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
        questionEn: "Does the patient have any chronic medical conditions? (select all that apply)",
        type: "multi",
        required: false,

        options: {
          dm: {
            label: "داء السكري",
            labelEn: "Diabetes mellitus",
            dxAdd: dxB(["IHD", "MI"]),
            reasoning: [
              rB("Diabetes mellitus is a strong risk factor for atherosclerosis and CAD.", ["IHD", "MI"])
            ]
          },
          htn: {
            label: "ارتفاع ضغط الدم",
            labelEn: "Hypertension",
            dxAdd: dxB(["IHD", "HF", "Dissection"]),
            reasoning: [
              rB("Hypertension increases risk of IHD, HF, and aortic dissection.", ["IHD", "HF", "Dissection"])
            ]
          },
          dyslipid: {
            label: "اضطراب شحوم الدم",
            labelEn: "Dyslipidemia",
            dxAdd: dxB(["IHD"]),
            reasoning: [
              rB("Dyslipidemia predisposes to coronary atherosclerosis.", ["IHD"])
            ]
          },
          knownIHD: {
            label: "سابق IHD / MI / قسطرة أو دعامة",
            labelEn: "Previous IHD / MI / PCI or stent",
            dxAdd: dxB(["IHD", "MI", "ACS"]),
            reasoning: [
              rB("Past MI or PCI strongly increases chance of recurrent cardiac pain.", ["IHD", "MI", "ACS"])
            ]
          },
          prevDVTPE: {
            label: "DVT / PE سابق",
            labelEn: "Previous DVT / PE",
            dxAdd: dxB(["PEMajor", "DVT"]),
            reasoning: [
              rB("Previous VTE greatly increases risk of recurrence.", ["PEMajor", "DVT"])
            ]
          },
          nonePMH: {
            label: "لا توجد أمراض مزمنة مهمة",
            labelEn: "No significant chronic diseases",
            dxAdd: dxB([]),
            dxRemove: dxB(["IHD", "HF", "PEMajor"]),
            reasoning: [
              rB("No chronic diseases reduces baseline cardiac/thrombotic risk.", ["IHD", "HF", "PEMajor"])
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
        question: "هل أجرى المريض عمليات كبرى أو بقي طريح الفراش؟",
        questionEn: "Major surgery or prolonged immobilisation?",
        type: "multi",
        required: false,

        options: {
          recentMajorSurgery: {
            label: "جراحة كبرى خلال آخر 4 أسابيع",
            labelEn: "Major surgery within the last 4 weeks",
            dxAdd: dxB(["PEMajor", "DVT"]),
            reasoning: [
              rB("Recent major surgery increases DVT/PE risk.", ["PEMajor", "DVT"])
            ]
          },
          prolongedImmobilisation: {
            label: "عدم حركة لأكثر من 3 أيام",
            labelEn: "Prolonged immobilisation >3 days",
            dxAdd: dxB(["DVT", "PEMajor"]),
            reasoning: [
              rB("Immobility leads to venous stasis and thrombosis.", ["DVT", "PEMajor"])
            ]
          },
          noPSH: {
            label: "لا توجد عمليات مهمة",
            labelEn: "No major surgery or immobilisation",
            dxAdd: dxB([]),
            dxRemove: dxB(["DVT", "PEMajor"]),
            reasoning: [
              rB("No surgical history lowers VTE risk.", ["DVT", "PEMajor"])
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
        questionEn: "Which medications does the patient take?",
        type: "multi",
        required: false,

        options: {
          aspirin: {
            label: "أسبرين",
            labelEn: "Aspirin / antiplatelets",
            reasoning: [
              rB("Antiplatelets suggest known IHD.", ["IHD", "MI"])
            ]
          },
          anticoagulant: {
            label: "مضادات تخثر",
            labelEn: "Anticoagulants",
            dxRemove: dxB(["PEMajor", "DVT"]),
            reasoning: [
              rB("Anticoagulants reduce but do not eliminate VTE risk.", ["PEMajor", "DVT"])
            ]
          },
          ocp: {
            label: "حبوب منع الحمل",
            labelEn: "OCPs",
            dxAdd: dxB(["DVT", "PEMajor"]),
            reasoning: [
              rB("OCPs increase DVT/PE risk.", ["DVT", "PEMajor"])
            ]
          },
          steroids: {
            label: "ستيرويدات",
            labelEn: "Steroids",
            dxAdd: dxB(["Infection"]),
            reasoning: [
              rB("Steroids predispose to infections.", ["Infection"])
            ]
          },
          noDrugs: {
            label: "لا توجد أدوية مهمة",
            labelEn: "No significant drugs",
            reasoning: [
              rB("No medications gives little diagnostic weight.", [])
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
        questionEn: "Any relevant family history?",
        type: "single",
        required: false,

        options: {
          prematureIHD: {
            label: "إصابة قلبية مبكرة بالعائلة",
            labelEn: "Premature IHD",
            dxAdd: dxB(["IHD", "MI"]),
            reasoning: [
              rB("Family history increases hereditary IHD risk.", ["IHD", "MI"])
            ]
          },
          suddenDeath: {
            label: "وفاة مفاجئة",
            labelEn: "Sudden unexplained death",
            dxAdd: dxB(["Arrhythmia"]),
            reasoning: [
              rB("Sudden death suggests inherited arrhythmia.", ["Arrhythmia"])
            ]
          },
          noFH: {
            label: "لا يوجد تاريخ عائلي",
            labelEn: "No family history",
            dxRemove: dxB(["IHD"]),
            reasoning: [
              rB("No FH reduces hereditary cardiac risk.", ["IHD"])
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
        question: "ما هي العادات ونمط الحياة؟",
        questionEn: "Lifestyle and habits?",
        type: "multi",
        required: false,

        options: {
          smoker: {
            label: "مدخّن",
            labelEn: "Smoker",
            dxAdd: dxB(["IHD", "MI", "COPD"])
          },
          exSmoker: {
            label: "مدخّن سابق",
            labelEn: "Ex-smoker",
            dxAdd: dxB(["IHD", "COPD"])
          },
          sedentary: {
            label: "قلة نشاط",
            labelEn: "Sedentary lifestyle",
            dxAdd: dxB(["IHD", "HF"])
          },
          highStress: {
            label: "توتر نفسي عالي",
            labelEn: "High stress",
            dxAdd: dxB(["Anxiety", "IHD"])
          },
          noSH: {
            label: "لا شيء مهم",
            labelEn: "No significant social factors"
          }
        }
      }
    ]
  }
];