// =========================================
// chest-ui-reasoning.js (FIXED VERSION)
// Supports multi-select reasoning
// ========================================

"use strict";

window.UIReasoning = (function () {
  const engine = window.ChestEngine;
  const elReasonQuestion = document.getElementById("reasonQuestion");
  const elReasonList     = document.getElementById("reasonList");

  if (!engine || !elReasonQuestion || !elReasonList) {
    console.warn("UIReasoning: Missing DOM elements or engine.");
  }

  // Animation
  function animateReason() {
    if (!elReasonList) return;
    elReasonList.classList.remove("fade-in");
    void elReasonList.offsetWidth;
    elReasonList.classList.add("fade-in");
  }

  // ---------------------------
  // Render reasoning for a step
  // ---------------------------
  function render(step) {
    if (!step || !engine) return;

    const val = engine.state.answers[step.id];

    // If no answer yet
    if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
      elReasonQuestion.textContent = "Select an option to see clinical reasoning.";
      elReasonList.innerHTML = "";
      return;
    }

    // Handle multi-select
    let reasons = [];

    if (Array.isArray(val)) {
      val.forEach((v) => {
        const r = engine.getReasoningFor(step, v);
        if (Array.isArray(r)) reasons.push(...r);
      });
    } else {
      const r = engine.getReasoningFor(step, val);
      if (Array.isArray(r)) reasons = r;
    }

    // If still no reasons
    if (!reasons.length) {
      elReasonQuestion.textContent = "Select an option to see clinical reasoning.";
      elReasonList.innerHTML = "";
      return;
    }

    // عنوان عام
    elReasonQuestion.textContent = "Clinical Reasoning";
    elReasonQuestion.className = "reason-headline";

    // Clear list
    elReasonList.innerHTML = "";

    // Main card
    const mainCard = document.createElement("div");
    mainCard.className = "reason-card fade-royal";

    reasons.forEach((r) => {
      const item = document.createElement("div");
      item.className = "reason-item-royal";

      // النص الرئيسي
      const txt = document.createElement("div");
      txt.className = "reason-text";
      txt.textContent = r.text || "";

      // Related disease tags
      const names = r.diseases || r.related || r.dx || r.names || [];

      const dis = document.createElement("div");
      dis.className = "reason-disease-tags";

      names.forEach((nm) => {
        const tag = document.createElement("span");
        tag.className = "disease-tag";
        tag.textContent = nm;
        dis.appendChild(tag);
      });

      item.appendChild(txt);
      if (names.length) item.appendChild(dis);

      mainCard.appendChild(item);
    });

    elReasonList.appendChild(mainCard);
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