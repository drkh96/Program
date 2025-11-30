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
// نجيب أول سبب ونحوّله إلى عنوان
if (reasons.length > 0) {
  elReasonQuestion.textContent = reasons[0].text;   // عنوان سريري
  elReasonQuestion.className = "reason-headline";
}
  // بطاقة رئيسية كبيرة
  
  const mainCard = document.createElement("div");
  mainCard.className = "reason-card fade-royal";

  reasons.forEach((r) => {
    const item = document.createElement("div");
    item.className = "reason-item-royal";

    const txt = document.createElement("div");
    txt.className = "reason-text";
    txt.textContent = r.text;

    // بطاقة الأمراض (Tags)
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