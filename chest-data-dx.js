// ========================================
// chest-data-dx.js (CLEAN VERSION)
// ========================================

"use strict";

// ========================================
// GROUPS (Major Diagnostic Categories)
// ========================================
window.CHEST_DX_GROUPS = {
  cardiac:      { id: "cardiac",      label: "Cardiac",            labelAr: "قلبي",              order: 1 },
  aorta:        { id: "aorta",        label: "Aorta",              labelAr: "أبهر",              order: 2 },
  pulmonary:    { id: "pulmonary",    label: "Pulmonary",          labelAr: "رئوي",              order: 3 },
  pleural:      { id: "pleural",      label: "Pleural / Lung",     labelAr: "جنبي / رئة",        order: 4 },
  gi:           { id: "gi",           label: "Gastrointestinal",   labelAr: "هضمي",              order: 5 },
  msk:          { id: "msk",          label: "Musculoskeletal",    labelAr: "عضلي هيكلي",        order: 6 },
  psych:        { id: "psych",        label: "Psychological",      labelAr: "نفسي",              order: 7 },
  other:        { id: "other",        label: "Other / Systemic",   labelAr: "أخرى / جهازية",     order: 99 }
};

// ========================================
// DIAGNOSES LIST (Used by dxAdd())
// ========================================
window.CHEST_DIAGNOSES = [

  // ================================
  // CARDIAC
  // ================================
  {
    id: "MI",
    label: "Myocardial Infarction",
    labelAr: "احتشاء العضلة القلبية",
    group: "cardiac"
  },
  {
    id: "UnstableAngina",
    label: "Unstable Angina",
    labelAr: "ذبحة صدرية غير مستقرة",
    group: "cardiac"
  },
  {
    id: "StableAngina",
    label: "Stable Angina",
    labelAr: "ذبحة صدرية مستقرة",
    group: "cardiac"
  },
  {
    id: "Pericarditis",
    label: "Acute Pericarditis",
    labelAr: "التهاب التامور",
    group: "cardiac"
  },
  {
    id: "HF",
    label: "Heart Failure",
    labelAr: "فشل القلب",
    group: "cardiac"
  },

  // ================================
  // AORTA
  // ================================
  {
    id: "Dissection",
    label: "Aortic Dissection",
    labelAr: "تسلخ الأبهر",
    group: "aorta"
  },

  // ================================
  // PULMONARY
  // ================================
  {
    id: "PEMajor",
    label: "Pulmonary Embolism (Massive)",
    labelAr: "انسداد رئوي كبير",
    group: "pulmonary"
  },
  {
    id: "PEMinor",
    label: "Pulmonary Embolism (Small)",
    labelAr: "انسداد رئوي صغير",
    group: "pulmonary"
  },

  // ================================
  // GASTROINTESTINAL
  // ================================
  {
    id: "GERD",
    label: "Gastroesophageal Reflux",
    labelAr: "ارتجاع المريء",
    group: "gi"
  },
  {
    id: "Pancreatitis",
    label: "Acute Pancreatitis",
    labelAr: "التهاب البنكرياس",
    group: "gi"
  },

  // ================================
  // MUSCULOSKELETAL
  // ================================
  {
    id: "Costochondritis",
    label: "Costochondritis",
    labelAr: "التهاب غضاريف القفص الصدري",
    group: "msk"
  },

  // ================================
  // PSYCH
  // ================================
  {
    id: "Anxiety",
    label: "Anxiety-related chest pain",
    labelAr: "ألم صدري نفسي",
    group: "psych"
  }

];