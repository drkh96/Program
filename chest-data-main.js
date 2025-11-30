// ========================================
// chest-data-main.js
// Unified & CLEAN master data file
// (NO visibility filtering here)
// ========================================

"use strict";

(function () {

  // -----------------------------------
  // Load DX Groups / Diagnoses
  // -----------------------------------
  const groups  = window.CHEST_DX_GROUPS  || {};
  const dxList  = window.CHEST_DIAGNOSES  || [];

  // -----------------------------------
  // Load section-based data files
  // -----------------------------------
  const secMain  = window.CHEST_SECTIONS_MAIN       || [];   // entry selection
  const secPers  = window.CHEST_SECTIONS_PERSONAL   || [];   // personal, CC
  const secHpi   = window.CHEST_SECTIONS_HPI        || [];
  const secRos   = window.CHEST_SECTIONS_ROS        || [];
  const secBack  = window.CHEST_SECTIONS_BACKGROUND || [];

  const secPeds  = window.CHEST_SECTIONS_PEDS       || [];
  const secResp  = window.CHEST_SECTIONS_RESP       || [];
  const secSurg  = window.CHEST_SECTIONS_SURGERY    || [];
  const secObgyn = window.CHEST_SECTIONS_OBGYN      || [];

  // -----------------------------------
  // Master list (NO FILTERS)
  // -----------------------------------
  const allSections = [];

  function pushAll(arr) {
    if (arr && arr.length) allSections.push(...arr);
  }

  // ترتيب ثابت:
  pushAll(secPers);     // personal + CC
  pushAll(secMain);     // choose department/system
  pushAll(secHpi);
  pushAll(secRos);
  pushAll(secBack);

  // Specialized sections
  pushAll(secResp);
  pushAll(secSurg);
  pushAll(secObgyn);
  pushAll(secPeds);

  // -----------------------------------
  // Export CLEAN DATASET
  // -----------------------------------
  window.ChestData = {
    dxGroups:  groups,
    diagnoses: dxList,
    sections:  allSections
  };

})();