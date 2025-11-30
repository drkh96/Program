// =======================================================
// chest-ui-reasoning.js — ADVANCED AI CLINICAL ENGINE
// Full diagnostic reasoning + severity + red flags
// =======================================================

"use strict";

(function (global) {

  const Engine = global.CHEST_ENGINE;
  if (!Engine) {
    console.warn("❌ ADVANCED-AI: CHEST_ENGINE not ready.");
    return;
  }

  function container() {
    return document.getElementById("reasonContainer");
  }

  // Group color classes
  const GROUP_CLASS = {
    cardiac: "cardiac",
    pulmonary: "pulmonary",
    aorta: "aorta",
    gi: "gi",
    msk: "msk",
    psych: "psych",
    other: "other"
  };

  // =======================================================
  // 1) AI Clinical Summary Generator
  // =======================================================
  function generateAISummary(mainDx, features) {
    if (!mainDx) return "No diagnostic pattern detected yet.";

    let summary = `
      The clinical pattern suggests <strong>${mainDx.label}</strong> as the leading diagnosis. 
      The case shows features that align with this condition, including:<br><br>
      ${features.map(f => "• " + f).join("<br>")}
      <br><br>
      This combination of findings forms a pattern commonly encountered in patients 
      with <strong>${mainDx.label}</strong>.
    `;

    return summary;
  }

  // =======================================================
  // 2) Severity Predictor
  // =======================================================
  function predictSeverity(features, missing, score) {
    let severity = "Low Risk";

    if (score > 14 || features.includes("severe chest pain") || features.includes("hypotension")) {
      severity = "🚨 EMERGENCY RISK";
    } else if (score > 8 || features.includes("shortness of breath")) {
      severity = "⚠️ Moderate Risk";
    } else if (score > 3) {
      severity = "🟡 Mild–Moderate Risk";
    }

    return severity;
  }

  // =======================================================
  // 3) Red Flags Detector
  // =======================================================
  function detectRedFlags(features) {
    const flags = [];

    const redCriteria = [
      "radiation to left arm",
      "diaphoresis",
      "syncope",
      "acute tearing pain",
      "hypotension",
      "sudden severe dyspnea"
    ];

    redCriteria.forEach(flag => {
      if (features.some(f => f.toLowerCase().includes(flag))) {
        flags.push(flag);
      }
    });

    return flags;
  }

  // =======================================================
  // 4) What to Do Next (Clinical Actions)
  // =======================================================
  function nextSteps(mainDx) {
    if (!mainDx) return "Not enough data to suggest next steps.";

    switch (mainDx.id) {
      case "MI":
      case "ACS":
        return `
          • Obtain ECG immediately<br>
          • Measure Troponin levels<br>
          • Start aspirin unless contraindicated<br>
          • Prepare for urgent cardiology evaluation
        `;
      case "PEMajor":
        return `
          • D-dimer if low/intermediate risk<br>
          • CT Pulmonary Angiography<br>
          • Start oxygen<br>
          • Assess hemodynamic stability
        `;
      case "AorticDissection":
        return `
          • Urgent CT-Aorta<br>
          • Control BP aggressively<br>
          • Surgical team consultation immediately
        `;
      default:
        return `
          • Complete vital signs<br>
          • ECG + CXR baseline<br>
          • Appropriate labs based on pattern
        `;
    }
  }

  // =======================================================
  // 5) Render Function
  // =======================================================
  function renderReasoning() {
    const box = container();
    if (!box) return;

    const groups = Engine.getDDxGrouped();
    if (!groups || groups.length === 0) {
      box.innerHTML = `
        <h3 class="reason-headline">🧠 AI Clinical Reasoning</h3>
        <p class="reason-text">Provide more history to unlock AI analysis.</p>
      `;
      return;
    }

    const allDx = [];
    groups.forEach(g => g.items.forEach(i => allDx.push(i)));
    const mainDx = allDx[0];

    const features = mainDx.features || [];
    const missing = mainDx.missing || [];

    const severity = predictSeverity(features, missing, mainDx.score);
    const redFlags = detectRedFlags(features);

    let html = `
      <h3 class="reason-headline">🧠 Advanced AI Clinical Reasoning</h3>
      
      <div class="reason-card fade-royal">
        <div class="device-card-header">PRIMARY DIAGNOSIS</div>
        <p class="reason-text"><strong>${mainDx.label}</strong> is currently the most likely diagnosis.</p>
      </div>

      <div class="reason-card fade-royal">
        <div class="device-card-header">AI Summary</div>
        <p class="reason-text">${generateAISummary(mainDx, features)}</p>
      </div>

      <div class="reason-card fade-royal">
        <div class="device-card-header">Severity Prediction</div>
        <p class="reason-text"><strong>${severity}</strong></p>
      </div>

      <div class="reason-card fade-royal">
        <div class="device-card-header">Red Flags</div>
        <p class="reason-text">
          ${
            redFlags.length > 0
              ? redFlags.map(f => "• " + f).join("<br>")
              : "No major red flags detected."
          }
        </p>
      </div>

      <div class="reason-card fade-royal">
        <div class="device-card-header">Recommended Next Steps</div>
        <p class="reason-text">${nextSteps(mainDx)}</p>
      </div>
    `;

    box.innerHTML = html;
  }

  // =======================================================
  // Auto update after each answer
  // =======================================================
  Engine.onAfterAnswer = function () {
    renderReasoning();
  };

  global.CHEST_UI_REASONING = { render: renderReasoning };

  console.log("🤖 ADVANCED AI REASONING READY");

})(window);