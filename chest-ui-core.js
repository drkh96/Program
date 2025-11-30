// ========================================
// chest-ui-core.js (SUPER PREMIUM UI VERSION)
// ========================================

"use strict";

(function (global) {

  const Engine = global.CHEST_ENGINE;
  const STATE  = global.CHEST_ENGINE_STATE;

  if (!Engine) {
    console.error("❌ UI cannot load: CHEST_ENGINE not found");
    return;
  }

  const app = document.getElementById("historyContainer") || document.getElementById("app");
  const ddxContainer = document.getElementById("ddxContainer");
  const reasonContainer = document.getElementById("reasonContainer");

  // ================================================
  // SOUND FX
  // ================================================
  const clickSound = new Audio("click.mp3");
  function playClick() {
    try {
      clickSound.currentTime = 0;
      clickSound.play();
    } catch {}
  }

  // ================================================
  // VIBRATION
  // ================================================
  function vibrateSmall() {
    if (navigator.vibrate) navigator.vibrate(12);
  }

  // ================================================
  // PROGRESS BAR UPDATE
  // ================================================
  function updateProgressBar() {
    const bar = document.getElementById("progressBar");
    if (!bar) return;
    const p = Math.round(
      (STATE.currentIndex + 1) / Engine.totalSteps * 100
    );
    bar.style.width = p + "%";
  }

  // ================================================
  // SCROLL TO TOP
  // ================================================
  function scrollToTop() {
    const panel = document.querySelector(".panel-center") || window;
    try {
      panel.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  }

  // ================================================
  // AUTO-SAVE
  // ================================================
  function autoSave() {
    const data = JSON.stringify(STATE.answers);
    localStorage.setItem("fh_answers", data);
  }

  Engine.onStepChange = function () {
    autoSave();
  };

  // ================================================
  // HINT SYSTEM (AI-like suggestions)
  // ================================================
  function showHint(list) {
    const box = document.createElement("div");
    box.className = "hint-box";
    box.innerHTML = list.map(item => `<div class="hint">${item}</div>`).join("");

    app.appendChild(box);

    box.querySelectorAll(".hint").forEach(h => {
      h.onclick = () => {
        const input = app.querySelector("input, textarea, select");
        if (input) input.value = h.innerText;
      };
    });
  }

  // ================================================
  // RENDER STEP
  // ================================================
  function renderStep(step, answers) {
    if (!step) {
      app.innerHTML = `<p>⚠ لا توجد خطوات أخرى.</p>`;
      return;
    }

    // Container
    let html = `
      <div class="step-block question-fade question-glow">
        <h2 class="step-question">${step.question}</h2>
    `;

    // Single
    if (step.type === "single" && step.options) {
      for (const key in step.options) {
        const opt = step.options[key];
        html += `
        <label class="step-option option-row radio-option">
          <input type="radio" name="${step.id}" value="${key}"
            ${answers[step.id] === key ? "checked" : ""}>
          ${opt.label}
        </label>`;
      }
    }

    // Multi
    if (step.type === "multi" && step.options) {
      const selected = answers[step.id] || [];
      for (const key in step.options) {
        const opt = step.options[key];
        html += `
        <label class="step-option option-row">
          <input type="checkbox" name="${step.id}" value="${key}"
            ${selected.includes(key) ? "checked" : ""}>
          ${opt.label}
        </label>`;
      }
    }

    // Text
    if (step.type === "text") {
      html += `
        <textarea id="field_${step.id}" class="step-text">${answers[step.id] || ""}</textarea>
      `;
    }

    // Number
    if (step.type === "number") {
      html += `
        <input type="number" id="field_${step.id}" class="step-number"
         value="${answers[step.id] || ""}">
      `;
    }

    html += `</div>`;

    // NAVIGATION BUTTONS
    html += `
      <div class="nav-buttons">
        <button id="btnBack" class="btn btn-secondary">السابق</button>
        <button id="btnNext" class="btn btn-primary">التالي</button>
      </div>
    `;

    app.innerHTML = html;

    // HINTS BASED ON STEP ID
    if (step.id === "site") {
      showHint(["Central chest", "Left chest", "Right chest", "Epigastric"]);
    }
    if (step.id === "onset") {
      showHint(["Sudden", "Gradual", "Over minutes"]);
    }
    if (step.id === "duration") {
      showHint(["5 minutes", "30 minutes", "2 hours"]);
    }

    // Glow remove
    setTimeout(() => {
      const elem = document.querySelector(".question-glow");
      if (elem) elem.classList.remove("question-glow");
    }, 900);

    attachHandlers(step);
    updateProgressBar();
    scrollToTop();
  }

  // ================================================
  // SAVE USER INPUT
  // ================================================
  function collectAnswer(step) {
    if (step.type === "single") {
      const checked = document.querySelector(`input[name="${step.id}"]:checked`);
      return checked ? checked.value : null;
    }

    if (step.type === "multi") {
      return Array.from(
        document.querySelectorAll(`input[name="${step.id}"]:checked`)
      ).map(x => x.value);
    }

    if (step.type === "text") {
      return document.getElementById(`field_${step.id}`).value;
    }

    if (step.type === "number") {
      return document.getElementById(`field_${step.id}`).value;
    }
  }

  // ================================================
  // HANDLERS
  // ================================================
  function attachHandlers(step) {

    document.getElementById("btnBack").onclick = () => {
      playClick();
      vibrateSmall();
      Engine.back();
    };

    document.getElementById("btnNext").onclick = () => {
      playClick();
      vibrateSmall();
      const val = collectAnswer(step);
      Engine.answer(step.id, val);
      Engine.next();
    };
  }

  // ================================================
  // CONNECT UI TO ENGINE
  // ================================================
  Engine.onRender = function ({ step, answers }) {
    renderStep(step, answers);
  };

  console.log("💎 UI CORE FULLY UPGRADED");

})(window);