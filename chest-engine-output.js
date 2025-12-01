// =======================================================
// chest-engine-output.js
// Formats dxScores + metadata → ready for UI
// =======================================================

"use strict";

(function (global) {

  const Engine = global.ChestEngine;
  const State  = global.ChestEngineState;

  if (!Engine) {
    console.error("ChestEngine not loaded");
    return;
  }

  const Output = {

    // ===================================================
    // (1) Convert dxScores into full objects ready for UI
    // ===================================================
    getDxList() {

      const dxScores = State.dxScores || {};
      const dxMeta   = global.CHEST_PAIN_DX || [];

      // -----------------------------------------------
      // دمج النتائج + الميتاداتا
      // -----------------------------------------------
      let dxList = dxMeta.map(dx => {

        const score = dxScores[dx.id] || 0;

        return {
          id: dx.id,
          name: dx.labelEn,              // English only
          group: dx.group,               // chestPain
          features: dx.keyMissingFeatures || [],
          score: parseFloat(score.toFixed(1))
        };
      });

      // -----------------------------------------------
      // ترتيب الأعلى احتمالاً
      // -----------------------------------------------
      dxList.sort((a, b) => b.score - a.score);

      return dxList;
    },

    // ===================================================
    // (2) Top 3 diagnoses for case scenario
    // ===================================================
    getTopThreeDx() {

      const list = this.getDxList();
      return list.slice(0, 3);
    }
  };

  // expose:
  global.ChestEngine.getDxList      = Output.getDxList.bind(Output);
  global.ChestEngine.getTopThreeDx = Output.getTopThreeDx.bind(Output);

})(window);