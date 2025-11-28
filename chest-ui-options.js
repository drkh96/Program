// =========================================
// chest-ui-options.js
// Renders question options (Arabic only)
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
  // Utility: animate click feedback (official clinical style)
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
  // Render: Numeric input (we treat as free text visually)
  // --------------------------------------------------
  function renderNumeric(step, val) {
    elOptionsContainer.innerHTML = "";

    const input = document.createElement("input");
    input.type = "text";             // يظهر كنص (مثل العمر النصّي)
    input.className = "ui-input";
    input.dir = "ltr";               // بيانات مثل 55-year-old male
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
  // (used for: name, ageText, chief complaint, duration, etc.)
// --------------------------------------------------
  function renderText(step, val) {
    elOptionsContainer.innerHTML = "";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "ui-input";
    input.dir = "ltr"; // نص إنجليزي أو mix (تقدر تغيره لاحقاً)
    input.placeholder = step.placeholder || "Type answer...";

    input.value = val ?? "";

    input.addEventListener("input", () => {
      engine.setAnswer(step.id, input.value);
      clearValidation();
    });

    elOptionsContainer.appendChild(input);
  }

  // --------------------------------------------------
  // Render: Single / Multi choice (Arabic RTL)
  // --------------------------------------------------
  function renderChoices(step, type, val) {
    elOptionsContainer.innerHTML = "";
    clearValidation();

    if (!step.options) {
      elOptionsContainer.innerHTML = "<p>No options provided.</p>";
      return;
    }

    Object.entries(step.options).forEach(([key, opt]) => {
      const row = document.createElement("label");
      row.className = "option-row";
      row.setAttribute("dir", "rtl");

      const input = document.createElement("input");
      input.type = type === "multi" ? "checkbox" : "radio";
      input.name = step.id;
      input.value = key;

      // Pre-fill
      if (type === "single" && val === key) {
        input.checked = true;
      } else if (type === "multi" && Array.isArray(val) && val.includes(key)) {
        input.checked = true;
      }

      // Text (Arabic label)
      const span = document.createElement("span");
      span.className = "option-label";
      span.textContent = opt.label || key;

      // Change handler (core logic)
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

        // Update DDx + Reasoning
        if (window.UIDDx && typeof window.UIDDx.renderDDx === "function") {
          window.UIDDx.renderDDx();
        }
        if (window.UIReasoning && typeof window.UIReasoning.render === "function") {
          window.UIReasoning.render(step);
        }
      });

      // Row click animation (visual only)
      row.addEventListener("click", (ev) => {
        // نخلي الأنيميشن على الصف، والـ input يشتغل بشكل طبيعي
        // (ما نمنع السلوك الافتراضي)
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
  function renderOptions(step) {
    if (!step) return;

    const t = engine.getStepType(step);
    const val = engine.state.answers[step.id];

    if (t === "numeric") {
      renderNumeric(step, val);
      return;
    }

    if (t === "text") {
      renderText(step, val);
      return;
    }

    if (t === "single" || t === "multi") {
      renderChoices(step, t, val);
      return;
    }

    // Unknown type fallback
    elOptionsContainer.innerHTML = "<p>Unsupported question type.</p>";
  }

  // --------------------------------------------------
  // Public API
  // --------------------------------------------------
  return {
    renderOptions
  };
})();