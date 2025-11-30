// =========================================
// chest-ui-ddx.js (PREMIUM VERSION)
// Shows grouped DDx with animation + glass style
// =========================================

"use strict";

(function (global) {

  const Engine = global.CHEST_ENGINE;
  if (!Engine) {
    console.warn("❌ UI-DDX cannot load: CHEST_ENGINE missing.");
    return;
  }

  function container() {
    return document.getElementById("ddxContainer");
  }

  // Render DDx groups
  function renderDDx() {
    const div = container();
    if (!div) return;

    const groups = Engine.getDDxGrouped();
    if (!groups || groups.length === 0) {
      div.innerHTML = `
        <div class="glass-card fade-royal" style="padding:16px;">
          <h3 style="color:#93c5fd;">🩺 Differential Diagnosis</h3>
          <p class="dd-empty">No diagnoses yet. Continue filling the history.</p>
        </div>`;
      return;
    }

    // Add animation
    div.classList.add("ddx-refresh");
    setTimeout(() => div.classList.remove("ddx-refresh"), 280);

    let html = `<h3 class="reason-headline" style="margin-bottom:12px;">
                  🩺 Differential Diagnosis
                </h3>`;

    // Each group = cardiac, pulmonary...
    groups.forEach(group => {
      html += `
        <div class="device-card ${group.id}">
          <div class="device-card-header">${group.label}</div>
      `;

      group.items.forEach(dx => {

        const barWidth = Math.min(100, dx.score * 10);

        html += `
          <div class="dd-disease-box fade-royal">
            <div class="dd-disease-name">${dx.label}</div>
            <div class="dd-disease-score">Score: ${dx.score}</div>

            <div style="
              height:6px;
              margin-top:6px;
              background:rgba(255,255,255,0.08);
              border-radius: 999px;
              overflow:hidden;">
              <div style="
                width:${barWidth}%;
                height:100%;
                background:linear-gradient(90deg,#38bdf8,#0ea5e9);
                border-radius:999px;">
              </div>
            </div>
      `;

        if (dx.clinicalScore) {
          html += `<p style="margin-top:8px;color:#7dd3fc;font-size:0.8rem;">
                    ${dx.clinicalScore}
                  </p>`;
        }

        if (dx.features && dx.features.length) {
          html += `<div class="pos-features-box">`;
          dx.features.forEach(f => {
            html += `<div class="pos-feature-tag">${f}</div>`;
          });
          html += `</div>`;
        }

        html += `</div>`; // disease box
      });

      html += `</div>`; // device-card
    });

    div.innerHTML = html;
  }

  // PUBLIC API
  global.CHEST_UI_DDX = {
    render: renderDDx
  };

  console.log("💎 UI-DDX UPGRADED");

})(window);