// =========================================
// chest-ui-reasoning.js
// Clinical Reasoning panel (English UI)
// Uses engine.getReasoningFor(step, value)
// ========================================

"use strict";

window.UIReasoning = (function () {
  const engine = window.ChestEngine;
  const elReasonQuestion = document.getElementById("reasonQuestion");
  const elReasonList     = document.getElementById("reasonList");

  if (!engine || !elReasonQuestion || !elReasonList) {
    console.warn("UIReasoning: Missing DOM elements or engine.");
  }

  // Small fade animation
  function animateReason() {
  if (!elReasonList) return;

  elReasonList.classList.remove("fade-in");
  void elReasonList.offsetWidth;
  elReasonList.classList.add("fade-in");
}

  // Render reasoning for a given step
  function render(step) {
    if (!step || !engine || !elReasonQuestion || !elReasonList) return;

    const val = engine.state.answers[step.id];
    const reasons = engine.getReasoningFor(step, val) || [];

    elReasonList.innerHTML = "";

    if (!reasons.length) {
      elReasonQuestion.textContent = "Select an option to see clinical reasoning.";
      return;
    }

    elReasonQuestion.textContent = "Clinical reasoning for this choice:";

    reasons.forEach((r) => {
      const li = document.createElement("li");
      li.className = "reason-item";

      const text = document.createElement("div");
      text.className = "reason-text";
      text.textContent = r.text; // النص من الداتا (تقدر تخليه إنجليزي لاحقاً)

      const dis = document.createElement("div");
      dis.className = "reason-diseases";

      const diseaseNames = (r.diseases || []).map((d) => {
        if (engine.pretty && engine.pretty[d]) return engine.pretty[d];
        return d;
      });

      if (diseaseNames.length) {
        dis.textContent = "Supports / affects: " + diseaseNames.join(", ");
      } else {
        dis.textContent = "";
      }

      li.appendChild(text);
      if (dis.textContent.trim()) {
        li.appendChild(dis);
      }

      elReasonList.appendChild(li);
    });

    animateReason();
  }

  function clear() {
    elReasonQuestion.textContent = "Select an option to see clinical reasoning.";
    elReasonList.innerHTML = "";
  }

  return {
    render,
    clear
  };
})();