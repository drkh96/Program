// ========================================
// chest-data-dx.js
// Diagnoses & groups definitions
// ========================================

"use strict";

window.CHEST_DX_GROUPS = {
  cardiac:  { id: "cardiac",  label: "Cardiac",            order: 1 },
  aorta:    { id: "aorta",    label: "Aorta",              order: 2 },
  pulmonary:{ id: "pulmonary",label: "Pulmonary",          order: 3 },
  pleural:  { id: "pleural",  label: "Pleural / Lung",     order: 4 },
  gi:       { id: "gi",       label: "Gastrointestinal",   order: 5 },
  msk:      { id: "msk",      label: "Musculoskeletal",    order: 6 },
  psych:    { id: "psych",    label: "Psychological",      order: 7 },
  other:    { id: "other",    label: "Other / Systemic",   order: 99 }
};

window.CHEST_DIAGNOSES = [
  // Cardiac
  {
    id: "IHD",
    label: "Ischemic Heart Disease (Chronic Coronary Syndrome)",
    group: "cardiac",
    keyMissingFeatures: [
      "ECG showing ischemic changes",
      "Serial cardiac troponin",
      "Stress test or imaging for inducible ischemia"
    ]
  },
  {
    id: "StableAngina",
    label: "Stable Angina",
    group: "cardiac",
    keyMissingFeatures: [
      "Normal troponin",
      "Reproducible chest pain with exertion",
      "Stress test / CT coronary angiography"
    ]
  },
  {
    id: "UnstableAngina",
    label: "Unstable Angina",
    group: "cardiac",
    keyMissingFeatures: [
      "Ischemic ECG changes (ST depression / T inversion)",
      "Troponin negative or minimally elevated",
      "Coronary angiography"
    ]
  },
  {
    id: "MI",
    label: "Acute Myocardial Infarction",
    group: "cardiac",
    keyMissingFeatures: [
      "ECG (ST elevation / new LBBB / STEMI or NSTEMI patterns)",
      "Marked troponin elevation",
      "Echocardiography for wall-motion abnormalities"
    ]
  },
  {
    id: "ACS",
    label: "Acute Coronary Syndrome (overall)",
    group: "cardiac",
    keyMissingFeatures: [
      "ECG changes suggestive of ischemia",
      "Serial troponin",
      "Risk stratification (HEART score etc.)"
    ]
  },
  {
    id: "HF",
    label: "Heart Failure / Acute Pulmonary Edema",
    group: "cardiac",
    keyMissingFeatures: [
      "Chest X-ray for pulmonary congestion",
      "BNP / NT-proBNP",
      "Echocardiography for LV dysfunction"
    ]
  },
  {
    id: "Pericarditis",
    label: "Acute Pericarditis",
    group: "cardiac",
    keyMissingFeatures: [
      "Pericardial friction rub",
      "Diffuse ST elevation / PR depression on ECG",
      "Pericardial effusion on echocardiogram"
    ]
  },
  {
    id: "Arrhythmia",
    label: "Clinically Significant Arrhythmia",
    group: "cardiac",
    keyMissingFeatures: [
      "12-lead ECG / telemetry monitoring",
      "Electrolytes, Thyroid function tests",
      "Holter / event monitor if intermittent"
    ]
  },

  // Aorta
  {
    id: "Dissection",
    label: "Aortic Dissection",
    group: "aorta",
    keyMissingFeatures: [
      "CT angiography / TEE for aorta",
      "Blood pressure differential between arms",
      "Neurologic / limb ischemic signs"
    ]
  },

  // Pulmonary
  {
    id: "PEMajor",
    label: "Pulmonary Embolism (moderate/high risk)",
    group: "pulmonary",
    keyMissingFeatures: [
      "D-dimer (if low-intermediate probability)",
      "CT pulmonary angiography",
      "Lower limb Doppler ultrasound for DVT"
    ]
  },
  {
    id: "Pneumonia",
    label: "Pneumonia",
    group: "pulmonary",
    keyMissingFeatures: [
      "Chest X-ray with consolidation",
      "Inflammatory markers (CRP/WBC)",
      "Sputum culture if indicated"
    ]
  },
  {
    id: "COPD",
    label: "COPD Exacerbation",
    group: "pulmonary",
    keyMissingFeatures: [
      "Spirometry / PFTs",
      "ABG in moderate/severe exacerbation",
      "Chest X-ray to exclude pneumonia"
    ]
  },
  {
    id: "Asthma",
    label: "Asthma Exacerbation",
    group: "pulmonary",
    keyMissingFeatures: [
      "Peak flow / spirometry",
      "Response to bronchodilators"
    ]
  },

  // Pleural / Lung surface
  {
    id: "Pleuritis",
    label: "Pleuritic Chest Pain (Pleurisy / small effusion)",
    group: "pleural",
    keyMissingFeatures: [
      "Chest X-ray for effusion",
      "Ultrasound if effusion suspected"
    ]
  },

  // GI
  {
    id: "GERD",
    label: "Gastroesophageal Reflux Disease",
    group: "gi",
    keyMissingFeatures: [
      "Response to PPI / antacids",
      "Upper endoscopy in alarm symptoms"
    ]
  },
  {
    id: "PepticUlcer",
    label: "Peptic Ulcer Disease",
    group: "gi",
    keyMissingFeatures: [
      "Upper GI endoscopy",
      "H. pylori testing"
    ]
  },

  // Musculoskeletal
  {
    id: "Musculoskeletal",
    label: "Musculoskeletal / Costochondritis",
    group: "msk",
    keyMissingFeatures: [
      "Reproducible tenderness on palpation",
      "Normal cardiac / pulmonary investigations"
    ]
  },

  // Psych
  {
    id: "Anxiety",
    label: "Panic / Anxiety Related Chest Pain",
    group: "psych",
    keyMissingFeatures: [
      "Exclusion of organic causes",
      "Temporal relation to stress / panic attacks"
    ]
  },

  // Other / Systemic
  {
    id: "Cancer",
    label: "Underlying Malignancy",
    group: "other"
  },
  {
    id: "Infection",
    label: "Systemic Infection / Sepsis",
    group: "other"
  },
  {
    id: "Coagulopathy",
    label: "Coagulopathy / Bleeding tendency",
    group: "other"
  },
  {
    id: "PAD",
    label: "Peripheral Arterial Disease",
    group: "other"
  },
  {
    id: "DVT",
    label: "Deep Vein Thrombosis",
    group: "other"
  },
  {
    id: "Stroke",
    label: "Stroke / TIA",
    group: "other"
  }
];