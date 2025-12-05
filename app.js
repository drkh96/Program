/* ============================================================
   ENGINE.JS — MEDICAL LOGIC + QUESTION BANK + DDx MODEL
============================================================ */

/* ============================
   1) INITIAL DIFFERENTIAL
=============================== */

const ddx = {
  "Acute MI": 40,
  "Unstable Angina": 35,
  "Pulmonary Embolism": 30,
  "Aortic Dissection": 25,
  "GERD": 10,
  "Pneumonia": 20,
  "Pericarditis": 15,
  "Myocarditis": 10,
  "Pleurisy": 10,
  "Muscle Spasm": 10,
  "Costochondritis": 10,
  "Pneumothorax": 15,
  "Aortic Aneurysm": 10,
  "Esophagitis": 10,
  "Esophageal Spasm": 10
};

/* ============================
   2) SITE → PATHWAY
=============================== */
const firstQuestion = {
  id: "site",
  text: "Where is the pain located?",
  options: [
    { key: "retrosternal", label: "Retrosternal pain", pathway: "cardiac" },
    { key: "pleuritic_side", label: "Side pleuritic pain", pathway: "pulmonary" },
    { key: "epigastric", label: "Epigastric pain", pathway: "gi" },
    { key: "tearing_back", label: "Tearing pain to back", pathway: "aortic" },
    { key: "localized_wall", label: "Localized chest wall pain", pathway: "msk" }
  ]
};

/* ============================
   3) CARDIAC PATHWAY
=============================== */
const cardiacQuestions = [
  {
    id: "radiation",
    text: "Does the pain radiate?",
    options: [
      { key: "rad_left_arm", label: "Left arm / jaw" },
      { key: "rad_back", label: "Back" },
      { key: "rad_none", label: "No radiation" }
    ]
  },
  {
    id: "aggravation",
    text: "What aggravates the pain?",
    options: [
      { key: "agg_exertion", label: "Exertion" },
      { key: "agg_emotion", label: "Emotional stress" },
      { key: "agg_none", label: "Nothing specific" }
    ]
  },
  {
    id: "associated",
    text: "Associated symptoms?",
    options: [
      { key: "assoc_sweating", label: "Sweating" },
      { key: "assoc_sob", label: "Shortness of breath" },
      { key: "assoc_vomiting", label: "Vomiting" }
    ]
  }
];

/* ============================
   4) PULMONARY PATHWAY
=============================== */
const pulmonaryQuestions = [
  {
    id: "resp",
    text: "Respiratory symptoms?",
    options: [
      { key: "cough_yes", label: "Cough" },
      { key: "wheeze_yes", label: "Wheeze" },
      { key: "assoc_fever", label: "Fever" }
    ]
  },
  {
    id: "pleuritic",
    text: "Is it worse with inspiration?",
    options: [
      { key: "agg_inspiration", label: "Yes" },
      { key: "agg_none", label: "No" }
    ]
  },
  {
    id: "embolism",
    text: "Risk factors for PE:",
    options: [
      { key: "assoc_hemoptysis", label: "Hemoptysis" },
      { key: "immobile", label: "Immobilization" },
      { key: "prev_dvt", label: "Previous DVT" }
    ]
  }
];

/* ============================
   5) GI PATHWAY
=============================== */
const giQuestions = [
  {
    id: "relief",
    text: "Does anything relieve the pain?",
    options: [
      { key: "relief_antacids", label: "Antacids" },
      { key: "relief_none", label: "Nothing" }
    ]
  },
  {
    id: "gi_assoc",
    text: "GI symptoms:",
    options: [
      { key: "water_brush", label: "Water brush" },
      { key: "regurgitation", label: "Regurgitation" }
    ]
  }
];

/* ============================
   6) AORTIC PATHWAY
=============================== */
const aorticQuestions = [
  {
    id: "sudden",
    text: "Was the onset sudden?",
    options: [
      { key: "time_sudden", label: "Yes sudden" },
      { key: "time_gradual", label: "Gradual" }
    ]
  },
  {
    id: "neuro",
    text: "Neurological symptoms?",
    options: [
      { key: "weak_left", label: "Left sided weakness" },
      { key: "weak_right", label: "Right sided weakness" }
    ]
  }
];

/* ============================
   7) MSK PATHWAY
=============================== */
const mskQuestions = [
  {
    id: "movement",
    text: "Is pain affected by movement?",
    options: [
      { key: "agg_movement", label: "Movement worsens" },
      { key: "agg_none", label: "No relation" }
    ]
  },
  {
    id: "tenderness",
    text: "Is the area tender?",
    options: [
      { key: "palp_yes", label: "Tender" },
      { key: "palp_no", label: "Not tender" }
    ]
  }
];

/* ============================
   8) PATHWAY MAP
=============================== */
const pathwayMap = {
  cardiac: cardiacQuestions,
  pulmonary: pulmonaryQuestions,
  gi: giQuestions,
  aortic: aorticQuestions,
  msk: mskQuestions
};

/* ============================
   9) CLINICAL REASONING MAP
=============================== */
const reasoning = {
  retrosternal: "Central chest pain suggests IHD.",
  pleuritic_side: "Pleuritic pain suggests pulmonary embolism or pleurisy.",
  epigastric: "Epigastric pain may indicate GERD or MI.",
  tearing_back: "Tearing pain radiating to the back suggests Aortic Dissection.",
  localized_wall: "Localized pain suggests musculoskeletal origin.",

  rad_left_arm: "Radiation to left arm strongly indicates MI.",
  rad_back: "Radiation to the back points to aortic dissection.",
  rad_none: "No radiation is non-specific.",

  agg_exertion: "Exertional pain is classic for MI/Angina.",
  agg_emotion: "Emotional stress triggers angina.",
  agg_none: "No clear aggravation.",

  assoc_sweating: "Sweating strongly supports MI.",
  assoc_sob: "Shortness of breath may indicate MI or PE.",
  assoc_vomiting: "Vomiting may occur in MI.",
  
  cough_yes: "Cough indicates pneumonia or HF.",
  wheeze_yes: "Wheeze suggests pulmonary disease or HF.",
  assoc_fever: "Fever suggests infection (pneumonia).",

  relief_antacids: "Improvement with antacids suggests GERD.",
  
  time_sudden: "Sudden onset indicates MI or aortic dissection.",
  
  weak_left: "Left sided weakness suggests stroke.",
  weak_right: "Right sided weakness suggests stroke.",

  agg_movement: "Movement-related pain suggests MSK origin.",
  palp_yes: "Tenderness suggests MSK or costochondritis."
};

/* ============================
   10) DDx EFFECT MAP
=============================== */
const ddxEffects = {
  retrosternal: { "Acute MI": +25, "Unstable Angina": +20 },
  pleuritic_side: { "Pulmonary Embolism": +30, "Pleurisy": +20 },
  epigastric: { "GERD": +25, "Esophagitis": +20 },
  tearing_back: { "Aortic Dissection": +40 },
  localized_wall: { "Costochondritis": +30 },

  rad_left_arm: { "Acute MI": +20 },
  rad_back: { "Aortic Dissection": +20 },

  agg_exertion: { "Acute MI": +20, "Unstable Angina": +20 },
  
  assoc_sweating: { "Acute MI": +20 },
  
  cough_yes: { "Pneumonia": +20 },
  assoc_fever: { "Pneumonia": +20 }
};

/* ============================
   EXPORTS
=============================== */

window.engine = {
  ddx,
  firstQuestion,
  pathwayMap,
  reasoning,
  ddxEffects
};