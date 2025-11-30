// ========================================
// chest-engine-config.js  (CLEAN VERSION)
// Connects CHEST_DATA_MASTER → ENGINE
// ========================================

"use strict";

(function (global) {

  const Data = global.CHEST_DATA_MASTER;

  if (!Data) {
    console.error("❌ FATAL: CHEST_DATA_MASTER not loaded.");
    return;
  }

  // ----------------------------------------
  // 1) Load All Sections From All Data Files
  // ----------------------------------------
  const ALL_SECTIONS = [
    ...Data.main,
    ...Data.personal,
    ...Data.hpi,
    ...Data.ros,
    ...Data.background,
    ...Data.peds
  ];

  // ----------------------------------------
  // 2) Flatten all steps into a single list
  // ----------------------------------------
  const ALL_STEPS = [];
  ALL_SECTIONS.forEach((section) => {
    if (section.steps && Array.isArray(section.steps)) {
      section.steps.forEach((step) => {
        ALL_STEPS.push(step);
      });
    }
  });

  // ----------------------------------------
  // 3) Diagnoses List
  // ----------------------------------------
  const DIAGNOSES = Data.dxList || [];
  const DIAG_GROUPS = Data.dxGroups || {};

  // Pretty name mapping
  const DX_PRETTY = {};
  DIAGNOSES.forEach((dx) => {
    DX_PRETTY[dx.id] = dx.label || dx.id;
  });

  // ----------------------------------------
  // 4) Export to Global ENGINE
  // ----------------------------------------
  global.CHEST_ENGINE_CONFIG = {
    sections: ALL_SECTIONS,
    steps: ALL_STEPS,
    diagnoses: DIAGNOSES,
    dxGroups: DIAG_GROUPS,
    dxPretty: DX_PRETTY
  };

  console.log("✅ ENGINE CONFIG LOADED");

})(window);