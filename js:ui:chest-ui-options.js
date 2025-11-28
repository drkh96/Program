// =========================================
// chest-ui-options.js
// Renders question options (Arabic / English)
// - Uses premium theme classes from style.css
// - Smooth clinical click feedback
// - Updates DDx + Reasoning on change
// =========================================

"use strict";

window.UIOptions = (function () {
  const engine = window.ChestEngine;

  const elOptionsContainer = document.getElementById("optionsContainer");
  const elValidation       = document.getElementById("validationMessage");

  if (!engine || !elOptionsContainer) {
    console.warn("UIOptions: engine or optionsContainer not found.");
  }

  // --------------------------------------------------
  // Utility: clear validation message
  // --------------------------------------------------
  function clearValidation() {
    if (!elValidation) return;
    elValidation.textContent = "";
    elValidation.classList.remove("validation-show");
  }

  // --------------------------------------------------
  // Utility: animate click feedback
  // --------------------------------------------------
  function animateClick(elem) {
    if (!elem) return;
    elem.style.transition =
      "transform 130ms cubic-bezier(0.19,1,0.22,1), box-shadow 130ms";

    elem.style.transform = "scale(1.04)";
    elem.style.boxShadow = "0 0 12px rgba(148, 163, 184, 0.32)";

    setTimeout(() => {
      elem.style.transform = "scale(1.0)";
      elem.style.boxShadow = "";
    }, 150);
  }

  // --------------------------------------------------
  // Render: Numeric input
  // --------------------------------------------------
  function renderNumeric(step, val, lang) {
    elOptionsContainer.innerHTML = "";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "ui-input";
    input.dir = "ltr";
    input.placeholder = step.placeholder || "Enter value";

    input.value = val ?? "";

    input.addEventListener("input", () => {
      engine.setAnswer(step.id, input.value);
      clearValidation();
    });

    elOptionsContainer.appendChild(input);
  }

  // --------------------------------------------------
  // Render: Text input
  // --------------------------------------------------
  function renderText(step, val, lang) {
    elOptionsContainer.innerHTML = "";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "ui-input";
    input.dir = lang === "en" ? "ltr" : "rtl";
    input.placeholder = step.placeholder || "Type answer...";

    input.value = val ?? "";

    input.addEventListener("input", () => {
      engine.setAnswer(step.id, input.value);
      clearValidation();
    });

    elOptionsContainer.appendChild(input);
  }

  // --------------------------------------------------
  // Render: Single / Multi choice
  // --------------------------------------------------
  function renderChoices(step, type, val, lang) {
    elOptionsContainer.innerHTML = "";
    clearValidation();

    if (!step.options) {
      elOptionsContainer.innerHTML = "<p>No options provided.</p>";
      return;
    }

    Object.entries(step.options).forEach(([key, opt]) => {
      const row = document.createElement("label");
      row.className = "option-row";
      row.setAttribute("dir", lang === "en" ? "ltr" : "rtl");

      const input = document.createElement("input");
      input.type = type === "multi" ? "checkbox" : "radio";
      input.name = step.id;
      input.value = key;

      if (type === "single" && val === key) {
        input.checked = true;
      } else if (type === "multi" && Array.isArray(val) && val.includes(key)) {
        input.checked = true;
      }

      const span = document.createElement("span");
      span.className = "option-label";

      const labelText =
        lang === "en" && opt.labelEn
          ? opt.labelEn
          : opt.label || key;

      span.textContent = labelText;

      input.addEventListener("change", () => {
        if (type === "single") {
          engine.setAnswer(step.id, key);
        } else {
          const selected = [];
          const boxes = elOptionsContainer.querySelectorAll(
            "input[type=checkbox]"
          );
          boxes.forEach((b) => {
            if (b.checked) selected.push(b.value);
          });
          engine.setAnswer(step.id, selected);
        }

        clearValidation();

        if (window.UIDDx && typeof window.UIDDx.renderDDx === "function") {
          window.UIDDx.renderDDx();
        }
        if (window.UIReasoning && typeof window.UIReasoning.render === "function") {
          window.UIReasoning.render(step);
        }
      });

      row.addEventListener("click", () => {
        animateClick(row);
      });

      row.appendChild(input);
      row.appendChild(span);
      elOptionsContainer.appendChild(row);
    });
  }

  // --------------------------------------------------
  // Main render entry
  // --------------------------------------------------
  function renderOptions(step, lang) {
    if (!step) return;
    const t = engine.getStepType(step);
    const val = engine.state.answers[step.id];

    if (t === "numeric") {
      renderNumeric(step, val, lang);
      return;
    }

    if (t === "text") {
      renderText(step, val, lang);
      return;
    }

    if (t === "single" || t === "multi") {
      renderChoices(step, t, val, lang);
      return;
    }

    elOptionsContainer.innerHTML = "<p>Unsupported question type.</p>";
  }

  return {
    renderOptions
  };
})();