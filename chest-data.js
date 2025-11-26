// ========================================
// Data.js
// Chest pain history data + DDx structure
// ========================================

"use strict";

(function (global) {

  // ======================================
  // 1) DIAGNOSES & GROUPS
  // ======================================

  const DX_GROUPS = {
    cardiac:  { id: "cardiac",  label: "Cardiac",  order: 1 },
    aorta:    { id: "aorta",    label: "Aorta",    order: 2 },
    pulmonary:{ id: "pulmonary",label: "Pulmonary",order: 3 },
    pleural:  { id: "pleural",  label: "Pleura",   order: 4 },
    chestWall:{ id: "chestWall",label: "Chest wall",order: 5 },
    oesophagus:{id: "oesophagus",label:"Oesophagus",order: 6},
    neuro:    { id: "neuro",    label: "Neurologic",order: 7 },
    peripheral:{id: "peripheral",label:"Peripheral vascular",order: 8},
    hema:     { id: "hema",     label: "Hematologic",order: 9 }
  };

  const DIAGNOSES = [
    { id: "IHD",        label: "Ischemic heart disease", group: "cardiac" },
    { id: "StableAngina", label: "Stable angina",        group: "cardiac" },
    { id: "UnstableAngina", label: "Unstable angina",    group: "cardiac" },
    { id: "MI",         label: "Myocardial infarction",  group: "cardiac" },
    { id: "Myocarditis",label: "Myocarditis",            group: "cardiac" },
    { id: "Pericarditis",label:"Pericarditis",           group: "cardiac" },
    { id: "MVP",        label: "Mitral valve prolapse",  group: "cardiac" },
    { id: "HF",         label: "Heart failure",          group: "cardiac" },

    { id: "AorticAneurysm", label: "Aortic aneurysm",    group: "aorta" },
    { id: "AorticDissection", label: "Aortic dissection",group: "aorta" },

    { id: "PE",         label: "Pulmonary embolism",     group: "pulmonary" },
    { id: "PEMajor",    label: "Pulmonary embolism (major)", group: "pulmonary" },
    { id: "Pneumonia",  label: "Pneumonia",              group: "pulmonary" },
    { id: "PulmInfarct",label: "Pulmonary infarction",   group: "pulmonary" },

    { id: "Pleurisy",   label: "Pleurisy",               group: "pleural" },
    { id: "Pneumothorax", label: "Pneumothorax",         group: "pleural" },

    { id: "ChestWallPain", label: "Chest wall / costochondritis", group: "chestWall" },
    { id: "RibFracture", label: "Rib fracture",          group: "chestWall" },
    { id: "HerpesZoster", label: "Herpes zoster",        group: "chestWall" },

    { id: "Oesophagitis", label: "Oesophagitis",         group: "oesophagus" },
    { id: "EsophagealSpasm", label: "Esophageal spasm",  group: "oesophagus" },

    { id: "Stroke",     label: "Stroke (CVA)",           group: "neuro" },

    { id: "PAD",        label: "Peripheral arterial disease", group: "peripheral" },

    { id: "Anemia",     label: "Anemia",                 group: "hema" }
  ];

  // Helper to create reasoning bullets
  function r(text, diseases) {
    return { text, diseases: diseases || [] };
  }

  // Short alias to list add/remove dx
  function addDx(ids) {
    return ids || [];
  }

  // ======================================
  // 2) HISTORY SECTIONS & STEPS
  // ======================================

  const SECTIONS = [
  {
    id: "personal",
    label: "Personal data",
    steps: [

      {
        id: "name",
        sectionId: "personal",
        sectionLabel: "Personal data",
        question: "What is the patient's name?",
        type: "text"
      },

      {
        id: "ageGroup",
        sectionId: "personal",
        sectionLabel: "Personal data",
        question: "Enter the patient's age:",
        type: "text",

        getDxFromValue: function (value) {

  const n = parseInt(value);   // ← نحول النص إلى رقم

  if (isNaN(n)) return [];     // إذا مو رقم → لا شي

  const dxList = [];

  if (n < 40) {
    dxList.push({ add: [], remove: ["IHD", "MI", "PAD"] });
  }

  if (n >= 40 && n <= 65) {
    dxList.push({
      add: ["IHD", "StableAngina", "UnstableAngina", "MI", "PAD"],
      remove: []
    });
  }

  if (n > 65) {
    dxList.push({
      add: ["IHD", "MI", "HF", "AorticAneurysm", "AorticDissection"],
      remove: []
    });
  }

  return dxList;
},

        reasoningForNumeric: [
          r(
            "Age affects the probability of cardiac and vascular causes of chest pain.",
            ["IHD", "MI", "AorticDissection"]
          )
        ]
      },

      {
        id: "sex",
        sectionId: "personal",
        sectionLabel: "Personal data",
        question: "What is the patient's sex?",
        type: "single",

        options: {
          male: {
            label: "Male",
            dxAdd: addDx(["IHD", "MI", "PAD"]),
            dxRemove: addDx([]),
            reasoning: [
              r(
                "Male sex is a classical risk factor for atherosclerotic ischemic heart disease.",
                ["IHD", "MI"]
              )
            ]
          },
          female: {
            label: "Female",
            dxAdd: addDx([]),
            dxRemove: addDx([]),
            reasoning: [
              r(
                "Female sex does not exclude cardiac pain, but pre-menopausal women have lower IHD risk.",
                ["IHD"]
              )
            ]
          }
        }
      }

    ]
  },

  {
    id: "cc",
    label: "Chief complaint",
    steps: [

      {
        id: "mainSymptom",
        sectionId: "cc",
        sectionLabel: "Chief complaint",
        question: "What is the chief complaint?",
        type: "text"
      },

      {
        id: "ccDuration",
        sectionId: "cc",
        sectionLabel: "Chief complaint",
        question: "For how long has the chief complaint been present?",
        type: "text",

        getDxFromText: function (value) {
          if (!value) return [];

          const v = value.toLowerCase();

          // Acute (minutes → hours)
          if (v.includes("min") || v.includes("minute") || v.includes("hour") || v.includes("hr")) {
            return [
              { add: ["MI", "UnstableAngina", "Pneumothorax", "PEMajor"], remove: [] }
            ];
          }

          // Subacute (days)
          if (v.includes("day") || v.includes("yesterday")) {
            return [
              { add: ["Pneumonia", "Pericarditis"], remove: [] }
            ];
          }

          // Chronic (weeks)
          if (v.includes("week") || v.includes("month")) {
            return [
              { add: ["StableAngina", "HF", "PAD", "Anemia"], remove: [] }
            ];
          }

          return [];
        }
      }

    ]
  },
  
    {
      id: "hpi",
      label: "History of present illness",
      steps: [
        {
          id: "site",
          sectionId: "hpi",
          sectionLabel: "History of present illness",
          question: "Where exactly is the chest pain?",
          type: "single",
          options: {
            central: {
              label: "Central retrosternal pain",
              dxAdd: addDx(["IHD", "StableAngina", "UnstableAngina", "MI", "Myocarditis", "Pericarditis", "MVP", "AorticDissection", "AorticAneurysm", "Oesophagitis", "PEMajor"]),
              dxRemove: addDx(["Pleurisy", "Pneumothorax", "Pneumonia", "ChestWallPain", "HerpesZoster"]),
              reasoning: [
                r("Central retrosternal pain is classic for myocardial ischemia and other mediastinal causes.", ["IHD", "MI"]),
                r("Non-localized central pain makes pleural, chest wall and dermatomal causes less likely.", [])
              ]
            },
            peripheral: {
              label: "Lateral chest pain on one side",
              dxAdd: addDx(["Pleurisy", "Pneumothorax", "Pneumonia", "PulmInfarct", "HerpesZoster"]),
              dxRemove: addDx(["IHD", "MI", "AorticDissection", "Oesophagitis"]),
              reasoning: [
                r("Unilateral peripheral pain is often pleuritic, suggesting pleurisy, pneumothorax or pneumonia.", ["Pleurisy", "Pneumothorax", "Pneumonia"])
              ]
            },
            localized: {
              label: "Very localized point pain (finger tip area)",
              dxAdd: addDx(["ChestWallPain", "RibFracture"]),
              dxRemove: addDx(["MI", "Pleurisy", "Pneumothorax", "AorticDissection"]),
              reasoning: [
                r("Very localized pain is more typical of chest wall pathology such as costochondritis or rib fracture.", ["ChestWallPain", "RibFracture"])
              ]
            },
            band: {
              label: "Band-like pain following a dermatome",
              dxAdd: addDx(["HerpesZoster"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Band-like pain in a dermatomal distribution strongly suggests herpes zoster.", ["HerpesZoster"])
              ]
            }
          }
        },

        {
          id: "onset",
          sectionId: "hpi",
          sectionLabel: "History of present illness",
          question: "How did the pain start?",
          type: "single",
          options: {
            sudden: {
              label: "Suddenly (seconds to minutes)",
              dxAdd: addDx(["MI", "UnstableAngina", "PEMajor", "Pneumothorax", "AorticDissection"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Sudden onset chest pain is typical of myocardial infarction, pulmonary embolism, pneumothorax or aortic dissection.", ["MI", "PEMajor", "Pneumothorax", "AorticDissection"])
              ]
            },
            gradual: {
              label: "Gradually over hours or days",
              dxAdd: addDx(["StableAngina", "Myocarditis", "Pericarditis", "Pneumonia", "Oesophagitis", "ChestWallPain"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Gradual onset pain fits better with stable angina, pericarditis, pneumonia or oesophagitis.", ["StableAngina", "Pericarditis", "Pneumonia", "Oesophagitis"])
              ]
            }
          }
        },

        {
          id: "character",
          sectionId: "hpi",
          sectionLabel: "History of present illness",
          question: "How would you describe the character of the pain?",
          type: "single",
          options: {
            tight: {
              label: "Tightness/heaviness/pressure",
              dxAdd: addDx(["IHD", "StableAngina", "UnstableAngina", "MI", "Myocarditis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Classical heavy or tight chest pain is strongly suggestive of myocardial ischemia.", ["IHD", "MI"])
              ]
            },
            sharp: {
              label: "Sharp or stabbing pain worse with breathing",
              dxAdd: addDx(["Pleurisy", "Pericarditis", "Pneumothorax", "Pneumonia"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Sharp, pleuritic pain worsened by inspiration suggests pleurisy, pericarditis, pneumothorax or pneumonia.", ["Pleurisy", "Pericarditis", "Pneumothorax", "Pneumonia"])
              ]
            },
            burning: {
              label: "Burning pain similar to heartburn",
              dxAdd: addDx(["Oesophagitis", "EsophagealSpasm"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Burning retrosternal pain is typical of oesophagitis or oesophageal spasm.", ["Oesophagitis", "EsophagealSpasm"])
              ]
            },
            tearing: {
              label: "Tearing pain radiating to the back",
              dxAdd: addDx(["AorticDissection"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Tearing, back-radiating pain is classical for aortic dissection until proven otherwise.", ["AorticDissection"])
              ]
            }
          }
        },

        {
          id: "radiation",
          sectionId: "hpi",
          sectionLabel: "History of present illness",
          question: "Does the pain radiate anywhere?",
          type: "single",
          options: {
            arm: {
              label: "To jaw, neck, left arm or epigastrium",
              dxAdd: addDx(["IHD", "StableAngina", "UnstableAngina", "MI"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Radiation to jaw, neck or left arm is classical for ischemic cardiac pain.", ["IHD", "MI"])
              ]
            },
            back: {
              label: "To the back between the scapulae",
              dxAdd: addDx(["AorticDissection"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Inter-scapular radiation fits with aortic dissection.", ["AorticDissection"])
              ]
            },
            none: {
              label: "No radiation",
              dxAdd: addDx(["ChestWallPain", "HerpesZoster"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Pain without radiation is more typical of chest wall or localized dermatomal pain.", ["ChestWallPain", "HerpesZoster"])
              ]
            }
          }
        },

        {
          id: "relief",
          sectionId: "hpi",
          sectionLabel: "History of present illness",
          question: "What relieves the pain?",
          type: "single",
          options: {
            rest: {
              label: "Relieved by rest or nitroglycerin",
              dxAdd: addDx(["StableAngina"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Pain relieved by rest or nitrates is very typical of stable angina.", ["StableAngina"])
              ]
            },
            forward: {
              label: "Relieved by sitting up and leaning forward",
              dxAdd: addDx(["Pericarditis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Pericarditic pain characteristically improves when leaning forward.", ["Pericarditis"])
              ]
            },
            antacid: {
              label: "Relieved by antacids or sitting upright",
              dxAdd: addDx(["Oesophagitis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Improvement with antacids or upright posture suggests oesophageal reflux/oesophagitis.", ["Oesophagitis"])
              ]
            },
            avoidMovement: {
              label: "Relieved by avoiding chest wall movement",
              dxAdd: addDx(["ChestWallPain"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Pain that improves when the chest wall is kept still suggests musculoskeletal pain.", ["ChestWallPain"])
              ]
            },
            nothing: {
              label: "Nothing really relieves the pain",
              dxAdd: addDx(["MI", "PEMajor"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Severe pain not relieved by rest raises concern for myocardial infarction or major pulmonary embolism.", ["MI", "PEMajor"])
              ]
            }
          }
        },

        {
          id: "aggravating",
          sectionId: "hpi",
          sectionLabel: "History of present illness",
          question: "What makes the pain worse?",
          type: "single",
          options: {
            effort: {
              label: "Worse with exertion, emotion or cold",
              dxAdd: addDx(["StableAngina", "UnstableAngina"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Effort-related pain is classical for angina pectoris.", ["StableAngina", "UnstableAngina"])
              ]
            },
            breath: {
              label: "Worse with inspiration, cough or breathing",
              dxAdd: addDx(["Pleurisy", "Pericarditis", "Pneumothorax", "Pneumonia"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Pain aggravated by inspiration or cough points to pleural or pericardial disease or pneumothorax.", ["Pleurisy", "Pericarditis", "Pneumothorax", "Pneumonia"])
              ]
            },
            meal: {
              label: "Worse after heavy fatty meal or lying flat",
              dxAdd: addDx(["Oesophagitis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Worsening with heavy meals and lying flat suggests reflux oesophagitis.", ["Oesophagitis"])
              ]
            },
            motion: {
              label: "Worse with chest wall movement or palpation",
              dxAdd: addDx(["ChestWallPain", "RibFracture"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Pain reproduced by movement or palpation indicates musculoskeletal chest wall origin.", ["ChestWallPain", "RibFracture"])
              ]
            }
          }
        },

        {
          id: "associated",
          sectionId: "hpi",
          sectionLabel: "History of present illness",
          question: "Are there any associated symptoms?",
          type: "multi",
          options: {
            dyspnea: {
              label: "Shortness of breath",
              dxAdd: addDx(["MI", "UnstableAngina", "HF", "PEMajor"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Dyspnea accompanying chest pain suggests acute ischemia, pulmonary embolism or evolving heart failure.", ["MI", "PEMajor", "HF"])
              ]
            },
            sweating: {
              label: "Profuse sweating",
              dxAdd: addDx(["MI", "UnstableAngina"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Autonomic symptoms such as heavy sweating are typical of acute myocardial infarction.", ["MI"])
              ]
            },
            vomiting: {
              label: "Nausea or vomiting",
              dxAdd: addDx(["MI", "Oesophagitis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Nausea and vomiting may occur in acute MI or severe oesophageal reflux.", ["MI", "Oesophagitis"])
              ]
            },
            coughFever: {
              label: "Cough and fever",
              dxAdd: addDx(["Pneumonia", "Pleurisy", "HF"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Cough with fever is more suggestive of pneumonia or pleurisy; in heart failure it indicates pulmonary congestion.", ["Pneumonia", "Pleurisy", "HF"])
              ]
            },
            hemoptysis: {
              label: "Coughing up blood",
              dxAdd: addDx(["PEMajor", "Pneumonia"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Hemoptysis in the context of chest pain is a red flag for pulmonary embolism.", ["PEMajor"])
              ]
            },
            reflux: {
              label: "Regurgitation or sour/bitter taste in the mouth",
              dxAdd: addDx(["Oesophagitis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Water-brash and regurgitation strongly support oesophageal reflux.", ["Oesophagitis"])
              ]
            },
            rash: {
              label: "Vesicular rash over the painful area",
              dxAdd: addDx(["HerpesZoster"]),
              dxRemove: addDx([]),
              reasoning: [
                r("A vesicular rash in the same dermatome confirms herpes zoster as the cause of pain.", ["HerpesZoster"])
              ]
            }
          }
        },

        {
          id: "episodeDuration",
          sectionId: "hpi",
          sectionLabel: "History of present illness",
          question: "How long does each pain episode usually last?",
          type: "single",
          options: {
            short: {
              label: "5–20 minutes and relieved by rest",
              dxAdd: addDx(["StableAngina"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Brief episodes lasting 5–20 minutes and relieved by rest are typical of stable angina.", ["StableAngina"])
              ]
            },
            long: {
              label: "More than 30 minutes and not relieved by rest",
              dxAdd: addDx(["MI", "UnstableAngina"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Prolonged pain >30 minutes not relieved by rest suggests myocardial infarction or unstable angina.", ["MI", "UnstableAngina"])
              ]
            },
            hours: {
              label: "Lasting for hours or days",
              dxAdd: addDx(["Pericarditis", "Pneumonia"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Pain lasting hours to days is more in favour of pericarditis or pneumonia.", ["Pericarditis", "Pneumonia"])
              ]
            }
          }
        },

        {
          id: "course",
          sectionId: "hpi",
          sectionLabel: "History of present illness",
          question: "How has the pain evolved since it started?",
          type: "single",
          options: {
            regressive: {
              label: "Improving over time",
              dxAdd: addDx(["StableAngina"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Regressive pain fits a self-limited episode of stable angina.", ["StableAngina"])
              ]
            },
            constant: {
              label: "Constant, unchanged",
              dxAdd: addDx(["Pleurisy", "Pericarditis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Constant pleuritic chest pain can be seen in pleurisy or pericarditis.", ["Pleurisy", "Pericarditis"])
              ]
            },
            progressive: {
              label: "Getting progressively worse",
              dxAdd: addDx(["MI", "AorticDissection"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Progressively worsening chest pain is worrying for evolving MI or aortic dissection.", ["MI", "AorticDissection"])
              ]
            }
          }
        },

        {
          id: "severity",
          sectionId: "hpi",
          sectionLabel: "History of present illness",
          question: "How severe is the pain on a scale from 0 to 10?",
          type: "numeric",
          getDxFromValue: function (n) {
            if (isNaN(n)) return [];
            if (n >= 8) {
              return ["MI", "AorticDissection", "PEMajor"];
            }
            return [];
          },
          reasoningForNumeric: [
            r("Very severe pain (≥ 8/10) suggests a serious, potentially life-threatening cause.", ["MI", "AorticDissection", "PEMajor"])
          ]
        }
      ]
    },

    {
      id: "ros",
      label: "Review of systems",
      steps: [
        {
          id: "rosCVS",
          sectionId: "ros",
          sectionLabel: "Review of systems",
          question: "From the cardiovascular system, do you have any of the following?",
          type: "multi",
          options: {
            palp: {
              label: "Palpitations",
              dxAdd: addDx([]),
              dxRemove: addDx([]),
              reasoning: [
                r("Palpitations may indicate arrhythmia, which often complicates myocardial infarction.", ["MI"])
              ]
            },
            orthopnea: {
              label: "Shortness of breath when lying flat (orthopnea)",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Orthopnea is a hallmark of left-sided heart failure.", ["HF"])
              ]
            },
            pnd: {
              label: "Sudden night attacks of breathlessness (PND)",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Paroxysmal nocturnal dyspnea is strongly suggestive of heart failure.", ["HF"])
              ]
            },
            legEdema: {
              label: "Swelling of the legs",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Peripheral edema points to right-sided or global heart failure.", ["HF"])
              ]
            }
          }
        },

        {
          id: "rosResp",
          sectionId: "ros",
          sectionLabel: "Review of systems",
          question: "From the respiratory system, do you have any of the following?",
          type: "multi",
          options: {
            cough: {
              label: "Cough",
              dxAdd: addDx(["Pneumonia", "HF"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Cough in chest pain may be due to pneumonia or pulmonary congestion from heart failure.", ["Pneumonia", "HF"])
              ]
            },
            wheeze: {
              label: "Wheeze",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Wheeze can appear in acute pulmonary congestion from left-sided heart failure.", ["HF"])
              ]
            },
            exertDyspnea: {
              label: "Exertional shortness of breath",
              dxAdd: addDx(["HF", "PE"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Exertional dyspnea suggests impaired cardiac output or pulmonary vascular obstruction.", ["HF", "PE"])
              ]
            }
          }
        },

        {
          id: "rosGIT",
          sectionId: "ros",
          sectionLabel: "Review of systems",
          question: "From the gastrointestinal system, do you have any of the following?",
          type: "multi",
          options: {
            distension: {
              label: "Abdominal distension (possible ascites)",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Ascites and abdominal distension can result from right-sided heart failure with hepatic congestion.", ["HF"])
              ]
            },
            rhPain: {
              label: "Right hypochondrial pain",
              dxAdd: addDx(["HF"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Right hypochondrial discomfort reflects painful hepatomegaly from hepatic congestion.", ["HF"])
              ]
            },
            epigastric: {
              label: "Epigastric pain",
              dxAdd: addDx(["MI", "Oesophagitis"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Epigastric pain may be a gastric-type presentation of myocardial infarction or oesophagitis.", ["MI", "Oesophagitis"])
              ]
            }
          }
        },

        {
          id: "rosCNS",
          sectionId: "ros",
          sectionLabel: "Review of systems",
          question: "From the nervous system, do you have any of the following?",
          type: "multi",
          options: {
            weakRight: {
              label: "Sudden weakness of the right side",
              dxAdd: addDx(["Stroke"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Sudden unilateral weakness indicates stroke, which shares atherosclerotic risk factors with IHD.", ["Stroke", "IHD"])
              ]
            },
            weakLeft: {
              label: "Sudden weakness of the left side",
              dxAdd: addDx(["Stroke"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Any acute hemiparesis must raise suspicion of cerebrovascular accident.", ["Stroke"])
              ]
            }
          }
        },

        {
          id: "rosLM",
          sectionId: "ros",
          sectionLabel: "Review of systems",
          question: "From the locomotor/peripheral vascular system:",
          type: "multi",
          options: {
            claudication: {
              label: "Leg pain while walking that relieves with rest",
              dxAdd: addDx(["PAD", "IHD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Intermittent claudication reflects peripheral arterial disease, which has the same atherosclerotic basis as IHD.", ["PAD", "IHD"])
              ]
            }
          }
        },

        {
          id: "rosHema",
          sectionId: "ros",
          sectionLabel: "Review of systems",
          question: "From the hematologic system:",
          type: "multi",
          options: {
            fatigue: {
              label: "General fatigue",
              dxAdd: addDx(["Anemia"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Generalised fatigability suggests anemia, which can aggravate myocardial ischemia.", ["Anemia", "IHD"])
              ]
            },
            dizzy: {
              label: "Dizziness",
              dxAdd: addDx(["Anemia"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Dizziness and light-headedness may be due to reduced oxygen delivery from anemia.", ["Anemia"])
              ]
            },
            pallor: {
              label: "Pale skin or mucosa",
              dxAdd: addDx(["Anemia"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Pallor is a classic sign of anemia.", ["Anemia"])
              ]
            }
          }
        }
      ]
    },
  {
    id: "pmh",
    label: "Past medical history",
    steps: [
      {
        id: "pmhMain",
        sectionId: "pmh",
        sectionLabel: "Past medical history",
        question: "Does the patient have any chronic illnesses?",
        type: "text"
      }
    ]
  },

  {
    id: "psh",
    label: "Past surgical history",
    steps: [
      {
        id: "pshMain",
        sectionId: "psh",
        sectionLabel: "Past surgical history",
        question: "Has the patient undergone any surgeries before?",
        type: "text"
      }
    ]
  },

  {
    id: "dh",
    label: "Drug history",
    steps: [
      {
        id: "dhMain",
        sectionId: "dh",
        sectionLabel: "Drug history",
        question: "Is the patient taking any medications regularly?",
        type: "text"
      }
    ]
  },

  {
    id: "fh",
    label: "Family history",
    steps: [
      {
        id: "fhMain",
        sectionId: "fh",
        sectionLabel: "Family history",
        question: "Is there any family history of heart or lung diseases?",
        type: "text"
      }
    ]
  },

  {
    id: "sh",
    label: "Social history",
    steps: [
      {
        id: "shMain",
        sectionId: "sh",
        sectionLabel: "Social history",
        question: "What is the patient's lifestyle? (smoking, alcohol, occupation)",
        type: "text"
      }
    ]
  },
    {
      id: "pmh",
      label: "Past medical history",
      steps: [
        {
          id: "pmhChronic",
          sectionId: "pmh",
          sectionLabel: "Past medical history",
          question: "Do you have any chronic illnesses?",
          type: "multi",
          options: {
            dm: {
              label: "Diabetes mellitus",
              dxAdd: addDx(["IHD", "PAD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Diabetes is a major risk factor for atherosclerosis leading to ischemic heart disease and PAD.", ["IHD", "PAD"])
              ]
            },
            htn: {
              label: "Hypertension",
              dxAdd: addDx(["IHD", "AorticAneurysm", "AorticDissection"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Hypertension predisposes to both ischemic heart disease and aortic aneurysm/dissection.", ["IHD", "AorticDissection"])
              ]
            },
            dyslipidemia: {
              label: "Dyslipidemia",
              dxAdd: addDx(["IHD", "PAD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Hyperlipidemia drives atherosclerotic disease in coronary and peripheral arteries.", ["IHD", "PAD"])
              ]
            },
            ckd: {
              label: "Chronic kidney disease",
              dxAdd: addDx(["HF", "Anemia"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Chronic kidney disease is associated with anemia and accelerated atherosclerosis.", ["HF", "Anemia"])
              ]
            }
          }
        }
      ]
    },

    {
      id: "psh",
      label: "Past surgical history",
      steps: [
        {
          id: "pshOps",
          sectionId: "psh",
          sectionLabel: "Past surgical history",
          question: "Have you ever had any of the following procedures?",
          type: "multi",
          options: {
            cabg: {
              label: "Open-heart surgery / CABG",
              dxAdd: addDx(["IHD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Previous CABG indicates established ischemic heart disease.", ["IHD"])
              ]
            },
            pci: {
              label: "Coronary angioplasty / PCI",
              dxAdd: addDx(["IHD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Previous PCI confirms significant coronary artery disease.", ["IHD"])
              ]
            },
            amputation: {
              label: "Limb amputation due to diabetic gangrene",
              dxAdd: addDx(["PAD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Amputation for diabetic foot gangrene reflects severe peripheral arterial disease.", ["PAD"])
              ]
            },
            majorSurgery: {
              label: "Recent major surgery or prolonged immobilization",
              dxAdd: addDx(["PEMajor"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Major surgery and immobility are strong provoking factors for pulmonary embolism.", ["PEMajor"])
              ]
            }
          }
        }
      ]
    },

    {
      id: "dh",
      label: "Drug history",
      steps: [
        {
          id: "drugHistory",
          sectionId: "dh",
          sectionLabel: "Drug history",
          question: "What chronic medications are you taking?",
          type: "multi",
          options: {
            insulin: {
              label: "Insulin",
              dxAdd: addDx(["IHD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Insulin use implies long-standing diabetes, a major risk factor for IHD.", ["IHD"])
              ]
            },
            acei: {
              label: "ACE inhibitor",
              dxAdd: addDx(["HF", "IHD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("ACE inhibitors are commonly used for heart failure and ischemic heart disease.", ["HF", "IHD"])
              ]
            },
            aspirin: {
              label: "Aspirin",
              dxAdd: addDx(["IHD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Chronic aspirin use suggests secondary prevention for ischemic heart disease.", ["IHD"])
              ]
            },
            statin: {
              label: "Statin",
              dxAdd: addDx(["IHD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Statins are given for dyslipidemia and prevention of atherosclerotic events.", ["IHD"])
              ]
            },
            anticoag: {
              label: "Oral anticoagulant",
              dxAdd: addDx(["PE", "Stroke"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Long-term anticoagulation suggests previous thromboembolism or atrial fibrillation.", ["PE", "Stroke"])
              ]
            }
          }
        }
      ]
    },

    {
      id: "fh",
      label: "Family history",
      steps: [
        {
          id: "familyHistory",
          sectionId: "fh",
          sectionLabel: "Family history",
          question: "Is there any relevant family history?",
          type: "multi",
          options: {
            ihdFamily: {
              label: "Ischemic heart disease in a first-degree relative",
              dxAdd: addDx(["IHD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Family history of IHD in first-degree relatives indicates strong genetic predisposition.", ["IHD"])
              ]
            },
            suddenDeath: {
              label: "Sudden unexplained cardiac death in the family",
              dxAdd: addDx(["IHD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Sudden cardiac deaths in the family may reflect inherited arrhythmia or severe ischemic disease.", ["IHD"])
              ]
            },
            dmHtnFamily: {
              label: "Diabetes or hypertension in the family",
              dxAdd: addDx(["IHD", "PAD", "Stroke"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Family clustering of diabetes and hypertension supports atherosclerotic cardiovascular risk.", ["IHD", "Stroke"])
              ]
            }
          }
        }
      ]
    },

    {
      id: "sh",
      label: "Social history",
      steps: [
        {
          id: "socialHistory",
          sectionId: "sh",
          sectionLabel: "Social history",
          question: "What about lifestyle and habits?",
          type: "multi",
          options: {
            smoker: {
              label: "Current smoker",
              dxAdd: addDx(["IHD", "PAD", "PE", "Pneumothorax"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Smoking accelerates atherosclerosis and increases risk of IHD, PAD and pulmonary embolism; it is also a risk for pneumothorax.", ["IHD", "PAD", "PE", "Pneumothorax"])
              ]
            },
            exSmoker: {
              label: "Ex-smoker",
              dxAdd: addDx(["IHD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Ex-smokers retain cardiovascular risk for many years after quitting.", ["IHD"])
              ]
            },
            alcohol: {
              label: "Regular alcohol intake",
              dxAdd: addDx([]),
              dxRemove: addDx([]),
              reasoning: [
                r("Heavy alcohol consumption may contribute to cardiomyopathy and arrhythmia.", [])
              ]
            },
            sedentary: {
              label: "Sedentary lifestyle",
              dxAdd: addDx(["IHD", "PAD"]),
              dxRemove: addDx([]),
              reasoning: [
                r("Sedentary lifestyle promotes obesity and atherosclerotic cardiovascular disease.", ["IHD", "PAD"])
              ]
            },
            active: {
              label: "Regular physical activity",
              dxAdd: addDx([]),
              dxRemove: addDx([]),
              reasoning: [
                r("Regular exercise is protective but does not fully exclude cardiac disease.", [])
              ]
            }
          }
        }
      ]
    }

    // Section "case presentation" ممكن إضافته لاحقاً لعمل summary تلقائي
  ];

  // Expose as global
  global.ChestData = {
    dxGroups: DX_GROUPS,
    diagnoses: DIAGNOSES,
    sections: SECTIONS
  };

})(window);