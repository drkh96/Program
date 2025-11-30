// ========================================
// chest-data-main.js
// Unified CLEAN master data loader
// ========================================

"use strict";

(function () {

  // ----------------------------------------------------
  // Safety loaders (تجنب undefined errors)
  // ----------------------------------------------------
  const main       = window.CHEST_SECTIONS_MAIN       || [];
  const personal   = window.CHEST_SECTIONS_PERSONAL   || [];
  const hpi        = window.CHEST_SECTIONS_HPI        || [];
  const ros        = window.CHEST_SECTIONS_ROS        || [];
  const background = window.CHEST_SECTIONS_BACKGROUND || [];
  const peds       = window.CHEST_SECTIONS_PEDS       || [];
  const dxGroups   = window.CHEST_DX_GROUPS           || {};
  const dxList     = window.CHEST_DIAGNOSES           || [];

  // ----------------------------------------------------
  // Combine all cleanly
  // ----------------------------------------------------
  window.CHEST_DATA_MASTER = {
    main,
    personal,
    hpi,
    ros,
    background,
    peds,
    dxGroups,
    dxList
  };

})();