// ========================================
// chest-engine-output.js (CLEAN VERSION)
// Provides basic DDx grouping (no scoring yet)
// ========================================

"use strict";

(function (global) {

  const CONFIG = global.CHEST_ENGINE_CONFIG;
  const STATE  = global.CHEST_ENGINE_STATE;

  if (!CONFIG || !STATE) {
    console.error("❌ OUTPUT ENGINE: Missing CONFIG or STATE.");
    return;
  }

  const DIAGNOSES = CONFIG.diagnoses || [];
  const DX_GROUPS = CONFIG.dxGroups || {};

  // ======================================================
  // 1) Return DDx grouped (NO SCORES YET)
  // ======================================================
  function getDDxGrouped() {

    // Placeholder: no scoring yet
    const rows = DIAGNOSES.map(dx => ({
      id: dx.id,
      label: dx.label,
      group: dx.group || "other",
      score: 0,
      level: 0,
      clinicalScore: null,
      features: [],
      missing: []
    }));

    // Grouping
    const groupsMap = {};
    rows.forEach(row => {
      const g = DX_GROUPS[row.group] || { id: row.group, label: row.group, order: 999 };
      if (!groupsMap[g.id]) {
        groupsMap[g.id] = {
          id: g.id,
          label: g.label,
          order: g.order || 999,
          items: []
        };
      }
      groupsMap[g.id].items.push(row);
    });

    // Sort groups by order
    const result = Object.values(groupsMap).sort((a, b) => a.order - b.order);

    return result;
  }

  // ======================================================
  // 2) Reasoning placeholder
  // ======================================================
  function getReasoningFor(step, value) {
    return [];  // add later when scoring is added
  }

  // ======================================================
  // Export API
  // ======================================================
  global.CHEST_ENGINE.getDDxGrouped   = getDDxGrouped;
  global.CHEST_ENGINE.getReasoningFor = getReasoningFor;

  console.log("✅ OUTPUT ENGINE LOADED (placeholder)");

})(window);