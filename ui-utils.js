// =======================================================
// ui-utils.js
// Utility Functions (Clinical Processing + Formatting)
// =======================================================

"use strict";

(function (global) {

  const Utils = {

    // ---------------------------------------------------
    // Clean text (remove underscores, convert to readable)
    // ---------------------------------------------------
    clean(text) {
      if (!text) return "";
      return text.replace(/_/g, " ").trim();
    },

    // ---------------------------------------------------
    // Convert array of values to readable text
    // ---------------------------------------------------
    cleanArray(arr) {
      if (!arr || !Array.isArray(arr)) return "";
      return arr.map(v => this.clean(v));
    },


    // ---------------------------------------------------
    // Convert selected option IDs into readable bullet points
    // Used in: Clinical Reasoning + DDx Features
    // ---------------------------------------------------
    toBullets(array) {
      if (!array || !Array.isArray(array)) return [];

      return array.map(item => `• ${this.clean(item)}`);
    },


    // ---------------------------------------------------
    // Determine color type for clinical reasoning:
    //  - support → green
    //  - danger → red
    //  - neutral → blue
    // ---------------------------------------------------
    getReasonColor(reasonText) {
      const t = reasonText.toLowerCase();

      if (t.includes("increase") || t.includes("support") || t.includes("suggest"))
        return "support";        // green

      if (t.includes("severe") || t.includes("danger") || t.includes("critical") ||
          t.includes("dissection") || t.includes("shock"))
        return "danger";         // red

      return "neutral";          // blue
    },


    // ---------------------------------------------------
    // Convert raw answers into structured reasoning bullets
    // Input: { stepId: value }
    // Output: Array of { type, points[] }
    // ---------------------------------------------------
    buildReasoning(answers, reasoningMap) {

      const result = [];

      // reasoningMap structure:
      // { stepId: { optionId: [ "text1", "text2" ] } }

      Object.keys(answers).forEach(stepId => {
        const val = answers[stepId];

        const stepReason = reasoningMap[stepId];
        if (!stepReason) return;

        // SINGLE answer
        if (typeof val === "string") {
          const arr = stepReason[val];
          if (arr) {
            const color = this.getReasonColor(arr.join(" "));
            result.push({
              type: color,
              points: arr
            });
          }
        }

        // MULTI answer
        if (Array.isArray(val)) {
          val.forEach(v => {
            const arr = stepReason[v];
            if (arr) {
              const color = this.getReasonColor(arr.join(" "));
              result.push({
                type: color,
                points: arr
              });
            }
          });
        }
      });

      return result;
    },


    // ---------------------------------------------------
    // Prepare DDx list with sorting and feature extraction
    // ---------------------------------------------------
    buildDDx(dxScores, dxMeta) {

      // dxScores = { MI: 85, PE: 40, ... }
      // dxMeta = [{ id, name, features[] }]

      let dxList = dxMeta.map(dx => {

        const score = dxScores[dx.id] || 0;

        return {
          id: dx.id,
          name: dx.labelEn,     // EN ONLY
          score,
          features: dx.features || []
        };
      });

      // Sort by score (descending)
      dxList.sort((a, b) => b.score - a.score);

      return dxList;
    },


    // ---------------------------------------------------
    // Return top 3 diagnoses for the Case Scenario
    // ---------------------------------------------------
    topDx(dxList) {
      return dxList.slice(0, 3);
    }

  };

  global.UIUtils = Utils;

})(window);