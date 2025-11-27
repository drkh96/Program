// ========================================
// chest-ui.js
// Connect ChestEngine with the 3-card UI (Arabic Questions / English UI / LTR Alignment)
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
  const elNavBar          = document.querySelector(".nav-bar");

  const elBtnPrev         = document.getElementById("btnPrev");
  const elBtnNext         = document.getElementById("btnNext");
  
  const elCaseModal    = document.getElementById("caseModal");
  const elCaseContent  = document.getElementById("caseModalContent");
  const elCaseClose    = document.getElementById("caseModalClose");
  const elCaseClose2   = document.getElementById("caseModalClose2");
  const elCaseCopy     = document.getElementById("caseModalCopy");

  let lastCaseText = "";
  
  if (!elQuestionText || !elOptions || !elDDxContainer || !elNavBar) {
    console.error("UI elements missing.");
    return;
  }

  // --- Rendering Functions ---

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
    const groupDiv = document.createElement("div");
    groupDiv.className = `dd-group-card dd-group-card--${g.id}`; 

    const header = document.createElement("div");
    header.className = "dd-group-header";
    header.textContent = g.label; 
    groupDiv.appendChild(header);

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
      
      // Display Clinical Scores (Wells or HEART)
      if (item.clinicalScore) {
          const scoreDiv = document.createElement("div");
          scoreDiv.className = `dd-score-status dd-score-status--${item.clinicalScore.includes('HEART') ? 'heart' : 'wells'}`;
          scoreDiv.textContent = item.clinicalScore;
          diseaseDiv.appendChild(scoreDiv);
          
          if (item.clinicalScore.includes('High Risk')) {
              scoreSpan.style.color = '#f87171';
              scoreDiv.style.color = '#f87171'; 
          } else if (item.clinicalScore.includes('Moderate Risk')) {
              scoreDiv.style.color = '#ffc400'; 
          }
      }

      // LOGIC FOR POSITIVE FEATURES
      if (item.features && item.features.length) {
        const ul = document.createElement("ul");
        ul.className = "dd-features hidden"; 

        item.features.forEach((f) => {
          const li = document.createElement("li");
          li.textContent = f;
          ul.appendChild(li);
        });

        const toggleBtn = document.createElement("button");
        toggleBtn.className = "dd-toggle";
        toggleBtn.textContent = "Show Positive Features"; 

        toggleBtn.addEventListener("click", () => {
          ul.classList.toggle("hidden");
          toggleBtn.textContent = ul.classList.contains("hidden")
            ? "Show Positive Features"
            : "Hide Positive Features";
        });

        diseaseDiv.appendChild(toggleBtn);
        diseaseDiv.appendChild(ul);
      }
      
      // LOGIC: Display Missing/Key findings
      if (item.missing && item.missing.length) {
        const missingDiv = document.createElement("div");
        missingDiv.className = "dd-missing-box";
        
        const missingHeader = document.createElement("div");
        missingHeader.className = "dd-missing-header";
        missingHeader.textContent = "Key Next Steps:"; 
        missingDiv.appendChild(missingHeader);

        const missingUl = document.createElement("ul");
        missingUl.className = "dd-missing-list";

        item.missing.forEach((m) => {
          const li = document.createElement("li");
          li.textContent = m;
          missingUl.appendChild(li);
        });

        missingDiv.appendChild(missingUl);
        diseaseDiv.appendChild(missingDiv);
      }


      body.appendChild(diseaseDiv);
    });

    groupDiv.appendChild(body);
    elDDxContainer.appendChild(groupDiv);
  });
}

function renderClinicalReasoning(step) {
  const val = engine.state.answers[step.id];
  const reasons = engine.getReasoningFor(step, val);

  elReasonList.innerHTML = "";

  if (!reasons.length) {
    elReasonQuestion.textContent = "Select an option to see clinical reasoning.";
    return;
  }

  elReasonQuestion.textContent = "Clinical Reasoning:";

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
  
function renderReasoning(step) {
  elOptions.innerHTML = "";
  const t = engine.getStepType(step);
  const val = engine.state.answers[step.id];

  if (t === "numeric") {
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "100"; 
    input.value = val !== undefined ? val : "";
    input.placeholder = step.id === "severity" ? "0–10" : "Age in years"; 

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
    input.placeholder = "Type your answer here...";

    input.addEventListener("input", () => {
      engine.setAnswer(step.id, input.value);
      if (step.getDxFromText) {
         renderDDx();
      }
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
    row.dir = "rtl"; 

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
      renderClinicalReasoning(step);
    });

    const span = document.createElement("span");
    span.className = "option-label";
    span.textContent = opt.label || key; 

    row.appendChild(input);
    row.appendChild(span);

    elOptions.appendChild(row);
  });
}

function getSectionNarrative(sectionId) {
    const answers = {};
    engine.steps
        .filter((s) => s.sectionId === sectionId)
        .forEach((step) => {
            const val = engine.state.answers[step.id];

            if (val === undefined || val === null || val === "" ||
                (Array.isArray(val) && val.length === 0)) {
                return;
            }

            const t = engine.getStepType(step);
            
            if (t === "single" && step.options && step.options[val]) {
                answers[step.id] = step.options[val].label;
            } else if (t === "multi" && step.options) {
                answers[step.id] = (Array.isArray(val) ? val : [])
                    .map((key) => step.options[key])
                    .filter(Boolean)
                    .map((opt) => opt.label)
                    .join(", "); 
            } else {
                answers[step.id] = val;
            }
        });
        return answers;
}

function buildCasePresentation() {
    const parts = [];
    let textSummary = "";
    
    const personal = getSectionNarrative("personal");
    const cc = getSectionNarrative("cc");
    const hpi = getSectionNarrative("hpi");
    const ros = getSectionNarrative("ros");
    const pmh = getSectionNarrative("pmh");
    const psh = getSectionNarrative("psh");
    const dh = getSectionNarrative("dh");
    const fh = getSectionNarrative("fh");
    const sh = getSectionNarrative("sh");

    // 1) PATIENT DEMOGRAPHICS 
    if (Object.keys(personal).length > 0) {
      let line = "";
      if (personal.name) line += `Patient **${personal.name}**`;
      
      const age = personal.ageGroup || "unknown age";
      const sex = personal.sex ? personal.sex.split('(')[0].trim() : "unknown sex";

      line += ` is a **${age}** year old **${sex}** presenting with chest pain.`;
      
      parts.push({ title: "Patient Data", lines: [line] });
    }

    // 2) CHIEF COMPLAINT (CC)
    if (cc.mainSymptom || cc.ccDuration) {
      let line = "The chief complaint is **" + (cc.mainSymptom || "Chest Pain") + "**";
      if (cc.ccDuration) {
        line += " that has been present for **" + cc.ccDuration + "**.";
      } else {
        line += ".";
      }
      parts.push({ title: "Chief Complaint and Duration", lines: [line] });
    }

    // 3) HISTORY OF PRESENT ILLNESS (HPI)
    if (Object.keys(hpi).length > 0) {
        let lines = [];
        
        // Onset and Site
        let hpiLine1 = "The pain started **" + (hpi.onset || "gradually") + "**";
        hpiLine1 += " and is primarily **" + (hpi.site || "central retrosternal") + "**.";
        lines.push(hpiLine1);

        // Character and Radiation
        let hpiLine2 = "The character of the pain is described as **" + (hpi.character || "tightness/pressure") + "**";
        if (hpi.radiation && !hpi.radiation.includes("لا يوجد")) {
            hpiLine2 += ", radiating **" + hpi.radiation + "**.";
        } else {
            hpiLine2 += " and has **no specific radiation**.";
        }
        lines.push(hpiLine2);

        // Modifying Factors
        let hpiLine3 = "It is typically **worse with " + (hpi.aggravating || "exertion") + "**";
        hpiLine3 += " and **relieved by " + (hpi.relief || "nothing significant") + "**.";
        lines.push(hpiLine3);
        
        // Severity and Course
        let hpiLine4 = "Each episode lasts **" + (hpi.episodeDuration || "5-20 minutes") + "**.";
        if (hpi.severity) {
            hpiLine4 += ` The severity is rated as **${hpi.severity}/10**`;
        }
        hpiLine4 += `, and the overall course is **${hpi.course || "constant"}**.`
        lines.push(hpiLine4);

        // Associated Symptoms
        if (hpi.associated) {
             lines.push(`Associated symptoms include: **${hpi.associated}**.`);
        }
        
        parts.push({ title: "History of Present Illness (HPI)", lines: lines });
    }
    
    // 4) REVIEW OF SYSTEMS (ROS)
    if (Object.keys(ros).length > 0) {
        let lines = [];
        if (ros.rosCVS) lines.push(`**Cardiovascular:** ${ros.rosCVS}`);
        if (ros.rosResp) lines.push(`**Respiratory:** ${ros.rosResp}`);
        if (ros.rosGIT) lines.push(`**Gastrointestinal:** ${ros.rosGIT}`);
        if (ros.rosCNS) lines.push(`**Nervous System:** ${ros.rosCNS}`);
        if (ros.rosLM) lines.push(`**Locomotor/Peripheral:** ${ros.rosLM}`);
        if (ros.rosHema) lines.push(`**Hematologic:** ${ros.rosHema}`);
        
        if (lines.length > 0) {
             parts.push({ title: "Review of Systems (ROS) - Pertinent Positives", lines: lines });
        }
    }
    
    // 5) PMH, PSH, DH, FH, SH (As lists)
    if (pmh.pmhChronic) {
      parts.push({ title: "Past Medical History (PMH)", lines: [`Positive history of: **${pmh.pmhChronic}**`] });
    }
    if (psh.pshOps) {
      parts.push({ title: "Past Surgical History (PSH)", lines: [`History of: **${psh.pshOps}**`] });
    }
    if (dh.drugHistory) {
      parts.push({ title: "Drug History (DH)", lines: [`Currently taking: **${dh.drugHistory}**`] });
    }
    if (fh.familyHistory) {
      parts.push({ title: "Family History (FH)", lines: [`Relevant history of: **${fh.familyHistory}**`] });
    }
    if (sh.socialHistory) {
      parts.push({ title: "Social History (SH)", lines: [`Lifestyle factors include: **${sh.socialHistory}**`] });
    }

    // 6) Probable diagnosis
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
        `Most likely diagnosis: **${main.label}** (Score: ${main.score}).`
      );
      if (others.length) {
        dxLines.push(
          `Other diagnoses in the differential: **${others.join(", ")}**.`
        );
      }
      
      if (main.clinicalScore) {
          dxLines.push(`**Clinical Score Risk:** ${main.clinicalScore}.`);
      }


      parts.push({
        title: "Differential Diagnosis (DDx) Summary",
        lines: dxLines
      });
    }

    // Output generation (HTML and raw text)
    let html = "";
    let rawText = "";

    if (!parts.length) {
      html = "<p>No sufficient answers yet to build a case presentation.</p>";
      rawText = "No sufficient answers yet to build a case presentation.";
      return { html, text: rawText };
    }

    parts.forEach((p) => {
      html += `<div class="case-section">`;
      html += `<div class="case-section-title">${p.title}</div>`;
      
      rawText += `${p.title}:\n`;

      p.lines.forEach((ln) => {
        const formattedLine = ln
          .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
          .replace(/^•\s*/, '');
          
        html += `<p class="case-section-line">${formattedLine}</p>`;
        
        rawText += `- ${ln.replace(/\*\*/g, '').replace(/^•\s*/, '')}\n`;
      });
      html += `</div>`;

      rawText += "\n";
    });

    return { html, text: rawText };
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

  
// 💡 NEW: Render Navigation Bar
function renderNavBar() {
    elNavBar.innerHTML = '';
    const sections = engine.sections;
    const currentStep = engine.getCurrentStep();
    
    sections.forEach((sec) => {
        // Find the index of the first step in this section
        const firstStepInSection = engine.steps.find(s => s.sectionId === sec.id);
        if (!firstStepInSection) return;

        const stepIndex = engine.steps.indexOf(firstStepInSection);

        const button = document.createElement('button');
        button.textContent = sec.label; 
        button.dir = "rtl";
        button.classList.add('nav-button');

        // Highlight the active section
        if (currentStep && currentStep.sectionId === sec.id) {
            button.classList.add('active');
        }
        
        // Non-linear Navigation
        button.addEventListener('click', () => {
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

  elQuestionText.textContent = step.question || ""; 
  elQuestionText.dir = "rtl"; 

  renderReasoning(step);      
  renderClinicalReasoning(step);
  renderNavBar(); // Render navigation bar on every step change

  const isFirst = (engine.state.currentIndex === 0);
  const isLast  = (engine.state.currentIndex >= engine.steps.length - 1);

  elBtnPrev.disabled = isFirst;
  elBtnNext.disabled = false;
  
  document.getElementById("btnPrev").textContent = "Previous";
  document.getElementById("btnNext").textContent = isLast ? "Case Presentation" : "Next";
}

  // ---------- Button handlers ----------

       elBtnNext.addEventListener("click", () => {
    renderDDx(); 
    
    const isLast = (engine.state.currentIndex >= engine.steps.length - 1);
    if (isLast) {
      openCaseModal();
    } else {
      engine.nextStep();
      renderCurrentStep();
    }
  });

  elBtnPrev.addEventListener("click", () => {
    engine.prevStep();
    renderCurrentStep();
  });


  // ===== Event Listeners for Modal =====
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
  // --------------------------------------

  // ---------- Initial render ----------

  renderCurrentStep();
  renderDDx();
  renderClinicalReasoning(engine.getCurrentStep()); 
});
