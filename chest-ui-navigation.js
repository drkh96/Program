// ========================================
// chest-ui-navigation.js
// Controls the navigation (Next, Prev) and UI updates
// ========================================

"use strict";

function renderNavBar() {
  elNavBar.innerHTML = "";
  const sections = engine.sections;
  const currentStep = engine.getCurrentStep();

  sections.forEach((sec) => {
    const firstStepInSection = engine.steps.find((s) => s.sectionId === sec.id);
    if (!firstStepInSection) return;

    const stepIndex = engine.steps.indexOf(firstStepInSection);

    const button = document.createElement("button");
    button.textContent = sec.label;
    button.dir = "rtl";
    button.classList.add("nav-button");

    if (currentStep && currentStep.sectionId === sec.id) {
      button.classList.add("nav-button--active");
    }

    button.addEventListener("click", () => {
      engine.goToStep(stepIndex);
      renderCurrentStep();
    });

    elNavBar.appendChild(button);
  });
}

function renderCurrentStep() {
  const step = engine.getCurrentStep();
  if (!step) return;

  const prog = engine.getProgressInfo();

  elSectionLabel.textContent = step.sectionLabel || "";
  elStepCounter.textContent = `Step ${prog.current} of ${prog.total}`;

  renderOptions(step);
  renderClinicalReasoning(step);
  renderNavBar();
}