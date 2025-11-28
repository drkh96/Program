// =========================================
// chest-ui-ddx.js
// Detailed DDx panel (Medscape-style)
// - Colored groups (cardiac, aortic, etc.)
// - Collapsible sections (features, tests, scores)
// - Uses classes styled in style.css theme
// =========================================

"use strict";

window.UIDDx = (function () {
  const engine = window.ChestEngine;
  const elDDxContainer = document.getElementById("ddxContainer");

  if (!engine || !elDDxContainer) {
    console.error("UIDDx: Engine or ddxContainer not found.");
  }

  // -------------------------------
  // Utility: create collapsible block
  // -------------------------------
  function createCollapseSection(title, contentElem) {
    const wrapper = document.createElement("div");
    wrapper.className = "dd-section";

    const header = document.createElement("button");
    header.type = "button";
    header.className = "dd-section-header";
    header.textContent = title;

    const body = document.createElement("div");
    body.className = "dd-section-body";
    body.appendChild(contentElem);

    // default collapsed
    body.style.display = "none";

    header.addEventListener("click", () => {
      const isHidden = body.style.display === "none";
      body.style.display = isHidden ? "block" : "none";
    });

    wrapper.appendChild(header);
    wrapper.appendChild(body);
    return wrapper;
  }

  // -------------------------------
  // Main render
  // -------------------------------
  function renderDDx() {
    if (!elDDxContainer || !engine) return;

    const groups = engine.getDDxGrouped();
    elDDxContainer.innerHTML = "";

    if (!groups || !groups.length) {
      const p = document.createElement("p");
      p.className = "dd-empty";
      p.textContent =
        "No diagnosis suggested yet. Start by answering the questions.";
      elDDxContainer.appendChild(p);
      return;
    }

    groups.forEach((group) => {
      const groupCard = document.createElement("div");
      groupCard.className = `dd-group-card dd-group-card--${group.id}`;

      // Group header
      const gHeader = document.createElement("div");
      gHeader.className = "dd-group-header";
      gHeader.textContent = group.label || "Group";
      groupCard.appendChild(gHeader);

      // Group body
      const gBody = document.createElement("div");
      gBody.className = "dd-group-body";

      group.items.forEach((item) => {
        const diseaseBox = document.createElement("div");
        diseaseBox.className = "dd-item";

        // Top line: Name + Score
        const header = document.createElement("div");
        header.className = "dd-item-header";

        const nameSpan = document.createElement("span");
        nameSpan.className = "dd-name";
        nameSpan.textContent = item.label;

        const scoreSpan = document.createElement("span");
        scoreSpan.className = "dd-score";
        scoreSpan.textContent = `Score: ${item.score}`;

        header.appendChild(nameSpan);
        header.appendChild(scoreSpan);
        diseaseBox.appendChild(header);

        // Clinical score (if present) → collapsible
        if (item.clinicalScore) {
          const p = document.createElement("p");
          p.className = "dd-clinical-text";
          p.textContent = item.clinicalScore;
          const sec = createCollapseSection("Clinical Risk Score", p);
          diseaseBox.appendChild(sec);
        }

        // Positive features → collapsible
        if (item.features && item.features.length) {
          const ul = document.createElement("ul");
          ul.className = "dd-features-list";

          item.features.forEach((f) => {
            const li = document.createElement("li");
            li.textContent = f;
            ul.appendChild(li);
          });

          const sec = createCollapseSection("Positive Features", ul);
          diseaseBox.appendChild(sec);
        }

        // Missing key tests → collapsible
        if (item.missing && item.missing.length) {
          const ul = document.createElement("ul");
          ul.className = "dd-missing-list";

          item.missing.forEach((m) => {
            const li = document.createElement("li");
            li.textContent = m;
            ul.appendChild(li);
          });

          const sec = createCollapseSection("Missing Key Tests", ul);
          diseaseBox.appendChild(sec);
        }

        gBody.appendChild(diseaseBox);
      });

      groupCard.appendChild(gBody);
      elDDxContainer.appendChild(groupCard);
    });
  }

  // -------------------------------
  // Public API
  // -------------------------------
  return {
    renderDDx
  };
})();