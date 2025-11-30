// =========================================
// chest-ui-ddx.js  (ROYAL EDITION)
// FOCUS HISTORY – Premium DDx Interface
// =========================================

"use strict";

window.UIDDx = (function () {
  const engine = window.ChestEngine;
  const elDDxContainer = document.getElementById("ddxContainer");

  if (!engine || !elDDxContainer) {
    console.error("UIDDx: Engine or ddxContainer not found.");
  }

  // -------------------------------
  // Utility: create collapsible block (Royal)
  // -------------------------------
  function createCollapseSection(title, contentElem) {
    const wrapper = document.createElement("div");
    wrapper.className = "dd-section fade-royal";

    const header = document.createElement("button");
    header.type = "button";
    header.className = "dd-section-header";
    header.textContent = title;

    const body = document.createElement("div");
    body.className = "dd-section-body";
    body.appendChild(contentElem);

    body.style.display = "none";

    // Smooth expand
    header.addEventListener("click", () => {
      const isClosed = body.style.display === "none";
      body.style.display = isClosed ? "block" : "none";
    });

    wrapper.appendChild(header);
    wrapper.appendChild(body);
    return wrapper;
  }

  // -------------------------------
  // Main render (Royal Edition)
  // -------------------------------
  function renderDDx() {
    if (!elDDxContainer || !engine) return;

    const groups = engine.getDDxGrouped();
    elDDxContainer.innerHTML = "";

    if (!groups || !groups.length) {
      const p = document.createElement("p");
      p.className = "dd-empty fade-royal";
      p.textContent =
        "No diagnosis suggested yet. Start by answering the questions.";
      elDDxContainer.appendChild(p);
      return;
    }

    groups.forEach((group) => {
      // ---------- DEVICE CARD (Royal) ----------
      const groupCard = document.createElement("div");
groupCard.className = `device-card fade-royal ${group.id}`;
      groupCard.style.maxHeight = "300px";
      groupCard.style.overflowY = "auto";

      // ---------- HEADER ----------
      const gHeader = document.createElement("div");
      gHeader.className = "device-card-header";
      gHeader.textContent = group.label || "Group";
      groupCard.appendChild(gHeader);

      // ---------- BODY ----------
      const gBody = document.createElement("div");
      gBody.className = "dd-group-body";

      group.items.forEach((item) => {
        const diseaseBox = document.createElement("div");
        diseaseBox.className = "dd-item fade-royal";

        // HEADER: NAME + SCORE
        const header = document.createElement("div");
        header.className = "dd-item-header";

        const nameSpan = document.createElement("div");
nameSpan.className = "dd-disease-name";
        nameSpan.textContent = item.label;

        const scoreSpan = document.createElement("div");
scoreSpan.className = "dd-disease-score";
        scoreSpan.textContent = `Score: ${item.score}`;

        header.appendChild(nameSpan);
        header.appendChild(scoreSpan);
        diseaseBox.appendChild(header);

        // CLINICAL SCORE (if present)
        if (item.clinicalScore) {
          const p = document.createElement("p");
          p.className = "dd-clinical-text";
          p.textContent = item.clinicalScore;
          const sec = createCollapseSection("Clinical Risk Score", p);
          diseaseBox.appendChild(sec);
        }

        // POSITIVE FEATURES
        // Positive Features (short, colored, bullet tags)
if (item.features && item.features.length) {
  const wrap = document.createElement("div");
  wrap.className = "pos-features-box";

  item.features.forEach((f) => {
    // حول الجملة الطويلة إلى كلمة مختصرة
    const short = f
      .replace(/.*male.*/i, "Male")
      .replace(/.*female.*/i, "Female")
      .replace(/.*hypertension.*/i, "Hypertensive")
      .replace(/.*sudden.*/i, "Sudden onset")
      .replace(/.*abrupt.*/i, "Abrupt pain")
      .replace(/.*retrosternal.*/i, "Retrosternal pain")
      .replace(/.*central chest.*/i, "Central chest pain")
      .replace(/.*radiation.*/i, "Radiation")
      .replace(/.*severe.*/i, "Severe pain")
      .replace(/.*smoker.*/i, "Smoker")
      .trim();

    const tag = document.createElement("span");
    tag.className = "pos-feature-tag";
    tag.textContent = short;

    wrap.appendChild(tag);
  });

  const title = createCollapseSection("Positive Features", wrap);
  diseaseBox.appendChild(title);
}

  // -------------------------------
  // Public API
  // -------------------------------
  return {
    renderDDx
  };
})();