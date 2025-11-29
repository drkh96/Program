// ========================================
// chest-data-main.js
// Merge all partial data files into window.ChestData
// ========================================

"use strict";

(function () {
  const groups  = window.CHEST_DX_GROUPS  || {};
  const dxList  = window.CHEST_DIAGNOSES  || [];

  const secEntry = window.CHEST_SECTIONS_ENTRY      || [];
  const secPers  = window.CHEST_SECTIONS_PERSONAL   || [];
  const secHpi   = window.CHEST_SECTIONS_HPI        || [];
  const secRos   = window.CHEST_SECTIONS_ROS        || [];
  const secBack  = window.CHEST_SECTIONS_BACKGROUND || [];
  const secPeds  = window.CHEST_SECTIONS_PEDS       || [];

  const allSections = []
    .concat(secEntry)
    .concat(secPers)
    .concat(secHpi)
    .concat(secRos)
    .concat(secBack)
    .concat(secPeds);

  window.ChestData = {
    dxGroups:  groups,
    diagnoses: dxList,
    sections:  allSections
  };
})();