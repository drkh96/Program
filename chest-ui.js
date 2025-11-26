// ========================================
// chest-ui.js
// Connect ChestEngine with the 3-card UI
// ========================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const engine = window.ChestEngine;
  if (!engine) {
    console.error("ChestEngine is not available.");
    return;
  }

  engine.init();

  // ---------- DOM elements ----------

  const elQuestionText    = document.getElementById("questionText");
  const elOptions         = document.getElementById("optionsContainer");
  const elSectionLabel    = document.getElementById("sectionLabel");
  const elStepCounter     = document.getElementById("stepCounter");
  const elSectionStepCtr  = document.getElementById("sectionStepCounter");

  const elReasonQuestion  = document.getElementById("reasonQuestion");
  const elReasonList      = document.getElementById("reasonList");

  const elDDxContainer    = document.getElementById("ddxContainer");

  const elBtnPrev         = document.getElementById("btnPrev");
  const elBtnNext         = document.getElementById("btnNext");
  // عناصر الـ case presentation modal
  const elCaseModal    = document.getElementById("caseModal");
  const elCaseContent  = document.getElementById("caseModalContent");
  const elCaseClose    = document.getElementById("caseModalClose");
  const elCaseClose2   = document.getElementById("caseModalClose2");
  const elCaseCopy     = document.getElementById("caseModalCopy");

  let lastCaseText = "";
  
  if (!elQuestionText || !elOptions || !elDDxContainer) {
    console.error("UI elements missing.");
    return;
  }

  // ---------- Helpers ----------
function renderDDx() {
  const groups = engine.getDDxGrouped();
  elDDxContainer.innerHTML = "";

  if (!groups.length) {
    const p = document.createElement("p");
    p.className = "dd-empty";
    p.textContent = "No diagnosis suggested yet. Answer more questions to build the differential diagnosis.";
    elDDxContainer.appendChild(p);
    return;
  }

  groups.forEach((g) => {
    // بطاقة خاصة لكل جهاز
    const groupDiv = document.createElement("div");
    groupDiv.className = `dd-group-card dd-group-card--${g.id}`;

    const header = document.createElement("div");
    header.className = "dd-group-header";
    header.textContent = g.label;
    groupDiv.appendChild(header);

    // جسم البطاقة اللي يحتوي الأمراض (مع scroll داخلي)
    const body = document.createElement("div");
    body.className = "dd-group-body";

    g.items.forEach((item) => {
      const diseaseDiv = document.createElement("div");
      diseaseDiv.className = "dd-disease";

      const dHeader = document.createElement("div");
      dHeader.className = "dd-item-header";

      const nameSpan = document.createElement("span");
      nameSpan.className = "dd-name";
      nameSpan.textContent = item.label;

      const scoreSpan = document.createElement("span");
      scoreSpan.className = "dd-score";
      scoreSpan.textContent = `Score: ${item.score}`;

      dHeader.appendChild(nameSpan);
      dHeader.appendChild(scoreSpan);
      diseaseDiv.appendChild(dHeader);
if (item.features && item.features.length) {

  // القائمة (مخفية بالبداية)
  const ul = document.createElement("ul");
  ul.className = "dd-features hidden";

  item.features.forEach((f) => {
    const li = document.createElement("li");
    li.textContent = f;
    ul.appendChild(li);
  });

  // زر Show/Hide
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "dd-toggle";
  toggleBtn.textContent = "Show features";

  toggleBtn.addEventListener("click", () => {
    ul.classList.toggle("hidden");
    toggleBtn.textContent = ul.classList.contains("hidden")
      ? "Show features"
      : "Hide features";
  });

  diseaseDiv.appendChild(toggleBtn);
  diseaseDiv.appendChild(ul);
}

      body.appendChild(diseaseDiv);
    });

    groupDiv.appendChild(body);
    elDDxContainer.appendChild(groupDiv);
  });
}
  // ===== Helpers to build Case Presentation =====

  function getStepAnswerLine(step) {
    const t = engine.getStepType(step);
    const val = engine.state.answers[step.id];

    if (val === undefined || val === null || val === "" ||
        (Array.isArray(val) && val.length === 0)) {
      return null;
    }

    // نص / رقم
    if (t === "text" || t === "numeric") {
      return `${step.question} ${val}`;
    }

    if (!step.options) return null;

    // خيار واحد
    if (t === "single") {
      const opt = step.options[val];
      if (!opt) return null;
      return `${step.question} ${opt.label || val}`;
    }

    // عدة خيارات
    if (t === "multi") {
      const labels = (Array.isArray(val) ? val : [])
        .map((key) => step.options[key])
        .filter(Boolean)
        .map((opt) => opt.label);
      if (!labels.length) return null;
      return `${step.question} ${labels.join(", ")}`;
    }

    return null;
  }

  function collectSectionLines(sectionId) {
    const lines = [];
    engine.steps
      .filter((s) => s.sectionId === sectionId)
      .forEach((step) => {
        const line = getStepAnswerLine(step);
        if (line) {
          lines.push("• " + line);
        }
      });
    return lines;
  }

  function buildCasePresentation() {
    const parts = [];

    // 1) Chief complaint & duration
    const ccLines = collectSectionLines("cc");
    if (ccLines.length) {
      parts.push({
        title: "Chief complaint and duration",
        lines: ccLines
      });
    }

    // 2) HPI
    const hpiLines = collectSectionLines("hpi");
    if (hpiLines.length) {
      parts.push({
        title: "History of present illness",
        lines: hpiLines
      });
    }

    // 3) ROS
    const rosLines = collectSectionLines("ros");
    if (rosLines.length) {
      parts.push({
        title: "Review of systems",
        lines: rosLines
      });
    }

    // 4) PMH
    const pmhLines = collectSectionLines("pmh");
    if (pmhLines.length) {
      parts.push({
        title: "Past medical history",
        lines: pmhLines
      });
    }

    // 5) PSH
    const pshLines = collectSectionLines("psh");
    if (pshLines.length) {
      parts.push({
        title: "Past surgical history",
        lines: pshLines
      });
    }

    // 6) Drug history
    const dhLines = collectSectionLines("dh");
    if (dhLines.length) {
      parts.push({
        title: "Drug history",
        lines: dhLines
      });
    }

    // 7) Family history
    const fhLines = collectSectionLines("fh");
    if (fhLines.length) {
      parts.push({
        title: "Family history",
        lines: fhLines
      });
    }

    // 8) Social history
    const shLines = collectSectionLines("sh");
    if (shLines.length) {
      parts.push({
        title: "Social history",
        lines: shLines
      });
    }

    // 9) Probable diagnosis
    const groups = engine.getDDxGrouped();
    const allDx = [];
    groups.forEach((g) => {
      g.items.forEach((item) => allDx.push(item));
    });
    allDx.sort((a, b) => b.score - a.score);

    if (allDx.length) {
      const main = allDx[0];
      const others = allDx.slice(1, 4).map((dx) => dx.label);
      const dxLines = [];
      dxLines.push(
        `Most likely diagnosis: ${main.label} (score ${main.score}).`
      );
      if (others.length) {
        dxLines.push(
          `Other possible diagnoses: ${others.join(", ")}.`
        );
      }

      parts.push({
        title: "Probable diagnosis",
        lines: dxLines
      });
    }

    // تحويل إلى HTML + نص خام (لـ copy)
    let html = "";
    let text = "";

    if (!parts.length) {
      html = "<p>No sufficient answers yet to build a case presentation.</p>";
      text = "No sufficient answers yet to build a case presentation.";
      return { html, text };
    }

    parts.forEach((p) => {
      html += `<div class="case-section">`;
      html += `<div class="case-section-title">${p.title}</div>`;
      p.lines.forEach((ln) => {
        html += `<p class="case-section-line">${ln}</p>`;
      });
      html += `</div>`;

      text += `${p.title}:\n`;
      text += p.lines
        .map((ln) => ln.replace(/^•\s*/, "- "))
        .join("\n");
      text += "\n\n";
    });

    return { html, text };
  }

  function openCaseModal() {
    if (!elCaseModal || !elCaseContent) return;
    const result = buildCasePresentation();
    elCaseContent.innerHTML = result.html;
    lastCaseText = result.text;
    elCaseModal.classList.remove("hidden");
  }

  function closeCaseModal() {
    if (!elCaseModal) return;
    elCaseModal.classList.add("hidden");
  }
    // ===== CASE MODAL EVENTS =====
  if (elCaseClose) {
    elCaseClose.addEventListener("click", closeCaseModal);
  }
  if (elCaseClose2) {
    elCaseClose2.addEventListener("click", closeCaseModal);
  }

  if (elCaseModal) {
    elCaseModal.addEventListener("click", (e) => {
      if (e.target === elCaseModal) {
        closeCaseModal();
      }
    });
  }

  if (elCaseCopy) {
    elCaseCopy.addEventListener("click", async () => {
      await navigator.clipboard.writeText(lastCaseText);
      alert("Case presentation copied to clipboard!");
    });
  }
  // render options for current step
// =============== NEW CLINICAL REASONING FUNCTION ===============
// هذه الدالة مسؤولة عن(عرض ال clinical reasoning)
function renderClinicalReasoning(step) {
  const val = engine.state.answers[step.id];
  const reasons = engine.getReasoningFor(step, val);

  elReasonList.innerHTML = "";

  if (!reasons.length) {
    elReasonQuestion.textContent = "Select an option to see clinical reasoning.";
    return;
  }

  elReasonQuestion.textContent = "Clinical reasoning:";

  reasons.forEach((r) => {
    const li = document.createElement("li");
    li.className = "reason-item";

    const text = document.createElement("span");
    text.className = "reason-text";
    text.textContent = r.text;

    const dis = document.createElement("span");
    dis.className = "reason-diseases";
    dis.textContent = r.diseases
  .map(d => engine.pretty[d] || d)
  .join(", ");

    li.appendChild(text);
    li.appendChild(dis);

    elReasonList.appendChild(li);
  });
}
// ===================================================================

function renderReasoning(step) {
  elOptions.innerHTML = "";
  const t = engine.getStepType(step);
  const val = engine.state.answers[step.id];

  if (t === "numeric") {
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "10";
    input.value = val !== undefined ? val : "";
    input.placeholder = "0–10";

    input.addEventListener("input", () => {
      engine.setAnswer(step.id, input.value);
      renderDDx();
      renderReasoning(step);
      renderClinicalReasoning(step);
    });

    elOptions.appendChild(input);
    return;
  }

  if (t === "text") {
    const input = document.createElement("input");
    input.type = "text";
    input.value = val || "";
    input.placeholder = "Type your answer";

    input.addEventListener("input", () => {
      engine.setAnswer(step.id, input.value);
      renderClinicalReasoning(step);
    });

    elOptions.appendChild(input);
    return;
  }

  // single/multi choice
  if (!step.options) return;

  Object.entries(step.options).forEach(([key, opt]) => {
    const row = document.createElement("label");
    row.className = "option-row";

    const input = document.createElement("input");
    input.type = t === "multi" ? "checkbox" : "radio";
    input.name = step.id;
    input.value = key;

    if (t === "multi" && Array.isArray(val) && val.includes(key)) {
      input.checked = true;
    }
    if (t === "single" && val === key) {
      input.checked = true;
    }

    input.addEventListener("change", () => {
      if (t === "multi") {
        const selected = [];
        const inputs = elOptions.querySelectorAll("input[type=checkbox]");
        inputs.forEach((chk) => {
          if (chk.checked) selected.push(chk.value);
        });
        engine.setAnswer(step.id, selected);
      } else {
        engine.setAnswer(step.id, key);
      }
      renderDDx();
      renderReasoning(step);
      renderClinicalReasoning(step);
    });

    const span = document.createElement("span");
    span.className = "option-label";
    span.textContent = opt.label || key;

    row.appendChild(input);
    row.appendChild(span);

 //============================================

    elOptions.appendChild(row);
  });
}

function renderCurrentStep() {
  const step = engine.getCurrentStep();
  if (!step) return;

  const prog = engine.getProgressInfo();

  // labels
  elSectionLabel.textContent = step.sectionLabel || "";
  elStepCounter.textContent = `Step ${prog.current} of ${prog.total}`;

  const totalInSection = engine.steps.filter(
    (s) => s.sectionId === step.sectionId
  ).length;
  const indexInSection =
    engine.steps
      .filter((s) => s.sectionId === step.sectionId)
      .findIndex((s) => s.id === step.id) + 1;

  elSectionStepCtr.textContent =
    `${step.sectionLabel} – Question ${indexInSection}/${totalInSection}`;

  // ✅ الصحيح
  elQuestionText.textContent = step.question || "";
  renderReasoning(step);      // <-- هذه الدالة ترسم الخيارات فعلياً
renderClinicalReasoning(step);

    const isFirst = (engine.state.currentIndex === 0);
  const isLast  = (engine.state.currentIndex >= engine.steps.length - 1);

  elBtnPrev.disabled = isFirst;
  elBtnNext.disabled = false;
  elBtnNext.textContent = isLast ? "Case presentation" : "Next";
}

  // ---------- Button handlers ----------

    elBtnNext.addEventListener("click", () => {
    const isLast = (engine.state.currentIndex >= engine.steps.length - 1);
    if (isLast) {
      // افتح الـ case presentation popup
      openCaseModal();
    } else {
      engine.nextStep();
      renderCurrentStep();
      renderClinicalReasoning(engine.getCurrentStep());
    }
  });
  elBtnPrev.addEventListener("click", () => {
    engine.prevStep();
    renderCurrentStep();
    renderClinicalReasoning(engine.getCurrentStep());
  });

  // ---------- Initial render ----------

  renderCurrentStep();
  renderDDx();
  renderClinicalReasoning(engine.getCurrentStep());   // ✔️ ضروري
});