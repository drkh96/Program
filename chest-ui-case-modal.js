// =======================================================
// chest-ui-reasoning.js (PREMIUM CLINICAL REASONING UI)
// Fully integrated with DDx + Engine updates
// =======================================================

"use strict";

(function (global) {

  const Engine = global.CHEST_ENGINE;
  if (!Engine) {
    console.warn("❌ UI-REASONING: CHEST_ENGINE not ready.");
    return;
  }

  function container() {
    return document.getElementById("reasonContainer");
  }

  // Map groups → classes for color
  const GROUP_CLASS = {
    cardiac: "cardiac",
    pulmonary: "pulmonary",
    aorta: "aorta",
    gi: "gi",
    msk: "msk",
    psych: "psych",
    other: "other"
  };

  // =====================================================
  // Main Render Function
  // =====================================================
  function renderReasoning() {
    const box = container();
    if (!box) return;

    const groups = Engine.getDDxGrouped();
    if (!groups || groups.length === 0) {
      box.innerHTML = `
        <div class="glass-card fade-royal">
          <h3 class="reason-headline">🧠 Clinical Reasoning</h3>
          <p class="reason-text">Fill history to activate reasoning.</p>
        </div>`;
      return;
    }

    let html = `<h3 class="reason-headline">🧠 Clinical Reasoning</h3>`;

    // =====================================================
    // Render each DDx Group
    // =====================================================
    groups.forEach(group => {

      const gClass = GROUP_CLASS[group.id] || "other";

      html += `
      <div class="reason-card fade-royal ${gClass}">
        <div class="device-card-header">${group.label}</div>
      `;

      group.items.forEach(dx => {

        const missingList = dx.missing || [];
        const featuresList = dx.features || [];

        html += `
          <div class="reason-item-royal">
            <div class="dd-disease-name">${dx.label}</div>

            <div class="dd-disease-score">Score: ${dx.score}</div>
        `;

        // Clinical Score (HEART / PE)
        if (dx.clinicalScore) {
          html += `
            <p class="reason-text" style="color:#7dd3fc;">
              ${dx.clinicalScore}
            </p>
          `;
        }

        // Supporting features
        if (featuresList.length > 0) {
          html += `
            <div class="pos-features-box">
              ${featuresList
                .map(f => `<div class="pos-feature-tag">${f}</div>`)
                .join("")}
            </div>
          `;
        }

        // Missing features
        if (missingList.length > 0) {
          html += `
            <p class="reason-text" style="margin-top:8px;">
              <strong class="critical">Missing:</strong><br>
              ${missingList.map(m => `• ${m}`).join("<br>")}
            </p>
          `;
        }

        html += `</div>`; // end disease
      });

      html += `</div>`; // end group
    });

    box.innerHTML = html;
  }

  // =====================================================
  // Hook into Engine → auto-update reasoning every step
  // =====================================================
  Engine.onAfterAnswer = function () {
    renderReasoning();
  };

  // =====================================================
  // Public API
  // =====================================================
  global.CHEST_UI_REASONING = { render: renderReasoning };

  console.log("💎 UI-REASONING — FULL VERSION LOADED");

})(window);