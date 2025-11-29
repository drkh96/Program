// ========================================
// chest-ui-core.js
// Connect ChestEngine with the 3-card UI
// - step rendering
// - navigation (Prev / Next / Reset / Print)
// - validation
// - language toggle (Arabic / English)
// ========================================

"use strict";

(function () {
  const engine = window.ChestEngine;
  if (!engine) {
    console.error("ChestEngine is not available.");
    return;
  }

  // ---------- لغة الواجهة ----------
  const LANG_STORAGE_KEY = "chest_lang";
  try {
    const savedLang = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (savedLang === "en" || savedLang === "ar") {
      window.APP_LANG = savedLang;
    } else {
      window.APP_LANG = "ar";
    }
  } catch (e) {
    window.APP_LANG = "ar";
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
  const elBtnLang  = document.getElementById("btnToggleLang");

  // Safety check
  if (
    !elQuestionText ||
    !elOptionsContainer ||
    !elSectionLabel ||
    !elStepCounter ||
    !elBtnPrev ||
    !elBtnNext
  ) {
    console.error("UI Core: some required DOM elements are missing.");
    return;
  }

  // -----------------------------------
  // Small fade animation helper
  // -----------------------------------
  function animateFade(elem) {
    if (!elem) return;
    elem.classList.remove("fade-in");
    void elem.offsetWidth;
    elem.classList.add("fade-in");
  }

  // -----------------------------------
  // Validation for required steps
  // -----------------------------------
    // -----------------------------------
  // Small click animation helper
  // تستعملها UIOptions لما تضغط على الخيار
  // -----------------------------------
  function animateClick(elem) {
    if (!elem) return;
    elem.classList.remove("clicked");
    // force reflow حتى تعيد الأنيميشن من جديد
    void elem.offsetWidth;
    elem.classList.add("clicked");

    // اختياري: نشيل الكلاس بعد شوية حتى ما يبقى ملتصق
    setTimeout(() => {
      elem.classList.remove("clicked");
    }, 180);
  }
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
  // زر اللغة: تحديث النص
  // -----------------------------------
  function updateLangButton() {
    if (!elBtnLang) return;
    const lang = window.APP_LANG === "en" ? "en" : "ar";
    if (lang === "en") {
      elBtnLang.textContent = "التبديل إلى عربي";
    } else {
      elBtnLang.textContent = "Switch to English";
    }
  }

  // -----------------------------------
  // Render current step on the UI
  // -----------------------------------
  function renderCurrentStep() {
    const step = engine.getCurrentStep();
    if (!step) return;

    const lang = window.APP_LANG === "en" ? "en" : "ar";
    const isEnglish = lang === "en";

    // Clear validation when changing step
    if (elValidation) {
      elValidation.textContent = "";
      elValidation.classList.remove("validation-show");
    }

    // Global progress
    const prog = engine.getProgressInfo();
    elStepCounter.textContent = `Step ${prog.current} of ${prog.total}`;

    // Section label + per-section progress (تظل إنجليزيّة مثل ما هي)
    elSectionLabel.textContent = step.sectionLabel || "";

    const stepsInSection = engine.steps.filter(
      (s) => s.sectionId === step.sectionId
    );
    const indexInSection =
      stepsInSection.findIndex((s) => s.id === step.id) + 1;
    elSectionStepCtr.textContent = `${step.sectionLabel || ""} — Question ${indexInSection}/${stepsInSection.length}`;

    // Question text: عربي / إنجليزي حسب اللغة
    const qText =
      isEnglish && step.questionEn
        ? step.questionEn
        : step.question || "";

    elQuestionText.textContent = qText;
    elQuestionText.setAttribute(isEnglish ? "dir" : "dir", isEnglish ? "ltr" : "rtl");

    // Render options via UIOptions module (مع اللغة)
    if (window.UIOptions && typeof window.UIOptions.renderOptions === "function") {
      window.UIOptions.renderOptions(step, lang);
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
      engine.init();
    }
  }

  // -----------------------------------
  // Wire events
  // -----------------------------------
  function wireEvents() {
    if (elBtnNext) elBtnNext.addEventListener("click", handleNext);
    if (elBtnPrev) elBtnPrev.addEventListener("click", handlePrev);
    if (elBtnReset) elBtnReset.addEventListener("click", handleReset);
    if (elBtnPrint) elBtnPrint.addEventListener("click", handlePrint);

    if (elBtnLang) {
      elBtnLang.addEventListener("click", () => {
        window.APP_LANG = window.APP_LANG === "en" ? "ar" : "en";
        try {
          window.localStorage.setItem(LANG_STORAGE_KEY, window.APP_LANG);
        } catch (e) {}
        updateLangButton();
        renderCurrentStep();
      });
    }
  }

  // -----------------------------------
  // Entry point
  // -----------------------------------
  function initUI() {
    updateLangButton();
    initEngineState();
    wireEvents();
    renderCurrentStep();
  }

  document.addEventListener("DOMContentLoaded", initUI);
})();