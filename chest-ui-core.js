// ========================================
// chest-ui-core.js
// Connect ChestEngine with the 3-card UI
// ========================================

"use strict";

// =====================
// GLOBAL STEP FILTER
// =====================
function isStepVisible(step) {
  const ans = window.ChestEngine.state.answers;

  const dep = ans["department"];
  if (!dep) return false;

  if (dep === "internal") {
    const system = ans["system"];

    if (!system) return step.sectionId === "entry";
    if (system === "cvs") return step.sectionId === "cardiac";
    if (system === "resp") return step.sectionId === "respiratory";
    return false;
  }

  if (dep === "peds") return step.sectionId === "peds";
  if (dep === "surgery") return step.sectionId === "surgery";

  return false;
}

// ========================================
// MAIN UI CORE
// ========================================
(function () {
  const engine = window.ChestEngine;
  window._uiRender = renderCurrentStep;
  window._uiEngine = engine;

  if (!engine) {
    console.error("ChestEngine is not available.");
    return;
  }

  // DOM elements
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
  if (
    !elQuestionText ||
    !elOptionsContainer ||
    !elSectionLabel ||
    !elSectionStepCtr ||
    !elStepCounter ||
    !elBtnPrev ||
    !elBtnNext
  ) {
    console.error("UI Core: some required DOM elements are missing.");
    return;
  }

  // Fade animation helper
  function animateFade(elem) {
    if (!elem) return;
    elem.classList.remove("fade-in");
    void elem.offsetWidth;
    elem.classList.add("fade-in");
  }

  // validation
  function validateStep(step) {
    if (!step || !step.required) {
      elValidation.textContent = "";
      elValidation.classList.remove("validation-show");
      return true;
    }

    const val = engine.state.answers[step.id];
    const empty =
      val === undefined ||
      val === null ||
      val === "" ||
      (Array.isArray(val) && val.length === 0);

    if (empty) {
      elValidation.textContent = "Please answer this question before continuing.";
      elValidation.classList.add("validation-show");
      return false;
    }

    elValidation.textContent = "";
    elValidation.classList.remove("validation-show");
    return true;
  }

  // Save state
  function saveStateIfPossible() {
    if (typeof engine.saveState === "function") {
      try {
        engine.saveState();
      } catch {}
    }
  }

  // ========================================
  // RENDER CURRENT STEP
  // ========================================
  function renderCurrentStep() {
    let step = engine.getCurrentStep();
    if (!step) return;

    // ⭐ ADDED — تخطي الأسئلة المخفية تلقائياً
    while (step && !isStepVisible(step)) {
      engine.nextStep();
      step = engine.getCurrentStep();
    }
    if (!step) return;

    // clear validation
    elValidation.textContent = "";
    elValidation.classList.remove("validation-show");

    // Progress info
    const prog = engine.getProgressInfo();
    elStepCounter.textContent = `Step ${prog.current} of ${prog.total}`;

    elSectionLabel.textContent = step.sectionLabel || "";
   

    // ⭐ ADDED — اتجاه السؤال عند الإنجليزية
    const text = appLang === "en" ? step.questionEn : step.question;
    elQuestionText.textContent = text || "";
    elQuestionText.setAttribute("dir", appLang === "en" ? "ltr" : "rtl");
    elQuestionText.style.textAlign = appLang === "en" ? "left" : "right";

    // Render options
    if (window.UIOptions) {
      window.UIOptions.renderOptions(step, appLang);
    } else {
      elOptionsContainer.innerHTML = "<p>Options module not loaded.</p>";
    }

    // Render DDx & Reasoning
    if (window.UIDDx) UIDDx.renderDDx();
    if (window.UIReasoning) UIReasoning.render(step);

    animateFade(elQuestionText);
    animateFade(elOptionsContainer);

    // Buttons
    const isFirst = engine.state.currentIndex === 0;
    const isLast = engine.state.currentIndex >= engine.steps.length - 1;

    elBtnPrev.disabled = isFirst;
    elBtnNext.textContent = isLast ? "Case Presentation" : "Next";
  }

  // -----------------------------------
  // Navigation
  // -----------------------------------
  function handleNext() {
    const step = engine.getCurrentStep();
    if (!validateStep(step)) return;

    const isLast = engine.state.currentIndex >= engine.steps.length - 1;

    if (isLast) {
      // ⭐ ADDED — بعد آخر سؤال افتح الكيس برزنتيشن
      if (window.UICaseModal) window.UICaseModal.openModal();
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
    if (engine.resetCase) engine.resetCase();
    else engine.init();

    saveStateIfPossible();

    if (window.UIReasoning) UIReasoning.clear();
    if (window.UIDDx) UIDDx.renderDDx();

    renderCurrentStep();
  }

  function handlePrint() {
    if (window.UICaseModal) window.UICaseModal.printCase();
    else window.print();
  }

  // -----------------------------------
  // Init engine
  // -----------------------------------
  function initEngineState() {
    let loaded = false;

    if (engine.loadState) {
      try {
        loaded = !!engine.loadState();
      } catch {}
    }

    if (!loaded) engine.init();
  }

  // Wire events
  function wireEvents() {
    elBtnNext.addEventListener("click", handleNext);
    elBtnPrev.addEventListener("click", handlePrev);
    elBtnReset.addEventListener("click", handleReset);
    elBtnPrint.addEventListener("click", handlePrint);
  }

  // init
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

// ========================
// Language Toggle
// ========================
let appLang = "ar";

function setLanguage(lang) {
  appLang = lang;
  document.documentElement.setAttribute("lang", lang);
  if (window._uiRender) window._uiRender();
}

document.querySelector(".lang-toggle").addEventListener("click", () => {
  const btn = document.querySelector(".lang-toggle");

  if (appLang === "ar") {
    setLanguage("en");
    btn.textContent = "العربية";
  } else {
    setLanguage("ar");
    btn.textContent = "English";
  }
});