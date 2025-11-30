// ========================================
// chest-engine-config.js
// Loads sections, steps, diagnoses, and base mappings
// ========================================

"use strict";

(function (global) {

  const Data = global.ChestData;
  if (!Data) {
    console.error("ChestData is not loaded.");
    return;
  }

  // -----------------------------
  // 1) SECTIONS (as provided by ChestData)
  // -----------------------------
  const SECTIONS = Data.sections || [];

  // -----------------------------
  // 2) Build STEPS (Flattened)
  // -----------------------------
  const STEPS = [];
  SECTIONS.forEach((sec) => {
    (sec.steps || []).forEach((st) => {
      // Ensure each step inherits section data
      st.sectionId = st.sectionId || sec.id;
      st.sectionLabel = st.sectionLabel || sec.label || "";
      STEPS.push(st);
    });
  });

  // -----------------------------
  // 3) Diagnoses List & Pretty Names
  // -----------------------------
  const DIAGNOSES = Data.diagnoses || [];

  const PRETTY_NAME = {};
  DIAGNOSES.forEach((dx) => {
    PRETTY_NAME[dx.id] = dx.label || dx.id;
  });

  // -----------------------------
  // 4) Diagnosis Groups (Colors / Order / UI Grouping)
  // -----------------------------
  const DX_GROUPS = Data.dxGroups || {};

  // -----------------------------
  // 5) Expose config globally
  // -----------------------------
  global.ChestConfig = {
    SECTIONS,
    STEPS,
    DIAGNOSES,
    PRETTY_NAME,
    DX_GROUPS
  };

})(window);