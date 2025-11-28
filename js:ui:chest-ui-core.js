// ========================================
// chest-ui-core.js
// Connect ChestEngine with the 3-card UI
// - step rendering
// - navigation (Prev / Next / Reset / Print)
// - validation
// - optional state persistence
// ========================================

"use strict";

(function () {
  const engine = window.ChestEngine;
  if (!engine) {
    console.error("ChestEngine is not available.");
    return;
  }

  // ---------- DOM elements ----------
  const elQuestionText     = document.getElementById("questionText");
  const elOptionsContainer = document.getElementById("optionsContainer");
  const elSectionLabel     = document.getElementById("sectionLabel");
  const elSectionStepCtr   = document.getElementById("sectionStepCounter");
  const elStepCounter      = document.getElementById("stepCounter");
  const elValidation       = document.getElementById("validationMessage");

  const elBtnPrev  = document.getElementById("btnPrev");
  const elBtnNext  = document.getElementById("btnNext");
  const elBtnReset = document.getElementById("btnReset");
  const elBtnPrint = document.getElementById("btnPrint");

  // Safety check
  if (!elQuestionText || !elOptionsContainer || !elSectionLabel || !elStepCounter || !elBtnPrev || !elBtnNext) {
    console.error("UI Core: some required DOM elements are missing.");
    return;
  }

  // -----------------------------------
  // Small fade animation helper
  // -----------------------------------
  function animateFade(elem) {
    if (!elem) return;
    elem.classList.remove("fade-in");
    // Force reflow
    void elem.offsetWidth;
    elem.classList.add("fade-in");
  }

  // -----------------------------------
  // Validation for required steps
  // -----------------------------------
  function validateStep(step) {
    if (!step || !step.required) {
      if (elValidation) {
        elValidation.textContent = "";
        elValidation.classList.remove("validation-show");
      }
      return true;
    }

    const val = engine.state.answers[step.id];
    const empty =
      val === undefined ||
      val === null ||
      val === "" ||
      (Array.isArray(val) && val.length === 0);

    if (empty) {
      if (elValidation) {
        elValidation.textContent = "Please answer this question before continuing.";
        elValidation.classList.add("validation-show");
      }
      return false;
    }

    if (elValidation) {
      elValidation.textContent = "";
      elValidation.classList.remove("validation-show");
    }
    return true;
  }

  // -----------------------------------
  // Save state (if engine supports it)
  // -----------------------------------
  function saveStateIfPossible() {
    if (typeof engine.saveState === "function") {
      try {
        engine.saveState();
      } catch (e) {
        console.warn("UI Core: saveState failed:", e);
      }
    }
  }

  // -----------------------------------
  // Render current step on the UI
  // -----------------------------------
  function renderCurrentStep() {
    const step = engine.getCurrentStep();
    if (!step) return;

    // Clear validation when changing step
    if (elValidation) {
      elValidation.textContent = "";
      elValidation.classList.remove("validation-show");
    }

    // Global progress
    const prog = engine.getProgressInfo();
    elStepCounter.textContent = `Step ${prog.current} of ${prog.total}`;

    // Section label + per-section progress
    elSectionLabel.textContent = step.sectionLabel || "";

    const stepsInSection = engine.steps.filter((s) => s.sectionId === step.sectionId);
    const indexInSection = stepsInSection.findIndex((s) => s.id === step.id) + 1;
    elSectionStepCtr.textContent = `${step.sectionLabel || ""} — Question ${indexInSection}/${stepsInSection.length}`;

    // Question text (Arabic, RTL)
    elQuestionText.textContent = step.question || "";
    elQuestionText.setAttribute("dir", "rtl");

    // Render options via UIOptions module
    if (window.UIOptions && typeof window.UIOptions.renderOptions === "function") {
      window.UIOptions.renderOptions(step);
    } else {
      elOptionsContainer.innerHTML = "<p>Options module not loaded.</p>";
    }

    // Render DDx panel
    if (window.UIDDx && typeof window.UIDDx.renderDDx === "function") {
      window.UIDDx.renderDDx();
    }

    // Render clinical reasoning for this step
    if (window.UIReasoning && typeof window.UIReasoning.render === "function") {
      window.UIReasoning.render(step);
    }

    // Step transition animation
    animateFade(elQuestionText);
    animateFade(elOptionsContainer);

    // Buttons state
    const isFirst = engine.state.currentIndex === 0;
    const isLast  = engine.state.currentIndex >= engine.steps.length - 1;

    elBtnPrev.disabled = isFirst;
    elBtnNext.textContent = isLast ? "Case Presentation" : "Next";
  }

  // -----------------------------------
  // Navigation handlers
  // -----------------------------------
  function handleNext() {
    const step = engine.getCurrentStep();
    if (!validateStep(step)) return;

    const isLast = engine.state.currentIndex >= engine.steps.length - 1;
    if (isLast) {
      // Open case modal
      if (window.UICaseModal && typeof window.UICaseModal.openModal === "function") {
        window.UICaseModal.openModal();
      } else {
        console.warn("UICaseModal module not available.");
      }
      return;
    }

    engine.nextStep();
    saveStateIfPossible();
    renderCurrentStep();
  }

  function handlePrev() {
    engine.prevStep();
    saveStateIfPossible();
    renderCurrentStep();
  }

  function handleReset() {
    if (typeof engine.resetCase === "function") {
      engine.resetCase();
    } else if (typeof engine.init === "function") {
      engine.init();
    }

    saveStateIfPossible();

    // Clear reasoning + ddx if modules exist
    if (window.UIReasoning && typeof window.UIReasoning.clear === "function") {
      window.UIReasoning.clear();
    }
    if (window.UIDDx && typeof window.UIDDx.renderDDx === "function") {
      window.UIDDx.renderDDx();
    }

    renderCurrentStep();
  }

  function handlePrint() {
    if (window.UICaseModal && typeof window.UICaseModal.printCase === "function") {
      window.UICaseModal.printCase();
    } else {
      // fallback: normal print
      window.print();
    }
  }

  // -----------------------------------
  // Init engine state (with optional loadState)
  // -----------------------------------
  function initEngineState() {
    let loaded = false;

    if (typeof engine.loadState === "function") {
      try {
        loaded = !!engine.loadState();
      } catch (e) {
        console.warn("UI Core: loadState failed:", e);
      }
    }

    if (!loaded && typeof engine.init === "function") {
      // First time: clean state
      engine.init();
    }
  }

  // -----------------------------------
  // Wire events
  // -----------------------------------
  function wireEvents() {
    if (elBtnNext) {
      elBtnNext.addEventListener("click", handleNext);
    }
    if (elBtnPrev) {
      elBtnPrev.addEventListener("click", handlePrev);
    }
    if (elBtnReset) {
      elBtnReset.addEventListener("click", handleReset);
    }
    if (elBtnPrint) {
      elBtnPrint.addEventListener("click", handlePrint);
    }
  }

  // -----------------------------------
  // Entry point
  // -----------------------------------
  function initUI() {
    initEngineState();
    wireEvents();
    renderCurrentStep();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUI);
  } else {
    initUI();
  }
})();