// ========================================
// chest-ui.js
// Connect ChestEngine with the 3-card UI
// Arabic Questions / English UI / LTR layout
// With validation, reset, localStorage, and print
// ========================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const engine = window.ChestEngine;
  if (!engine) {
    console.error("ChestEngine is not available.");
    return;
  }

  // -----------------------------------
  // Init engine + try to load saved state
  // -----------------------------------
  engine.init();
  // حاول تحميل الحالة من localStorage إذا موجودة
  engine.loadState && engine.loadState();

  // ---------- DOM elements ----------

  const elQuestionText   = document.getElementById("questionText");
  const elOptions        = document.getElementById("optionsContainer");
  const elSectionLabel   = document.getElementById("sectionLabel");
  const elStepCounter    = document.getElementById("stepCounter");
  const elSectionStepCtr = document.getElementById("sectionStepCounter");

  const elReasonQuestion = document.getElementById("reasonQuestion");
  const elReasonList     = document.getElementById("reasonList");

  const elDDxContainer   = document.getElementById("ddxContainer");
  const elNavBar         = document.querySelector(".nav-bar");

  const elBtnPrev        = document.getElementById("btnPrev");
  const elBtnNext        = document.getElementById("btnNext");
  const elBtnReset       = document.getElementById("btnReset");
  const elBtnPrint       = document.getElementById("btnPrint");

  const elValidationMsg  = document.getElementById("validationMessage");

  // Case presentation modal
  const elCaseModal      = document.getElementById("caseModal");
  const elCaseContent    = document.getElementById("caseModalContent");
  const elCaseClose      = document.getElementById("caseModalClose");
  const elCaseClose2     = document.getElementById("caseModalClose2");
  const elCaseCopy       = document.getElementById("caseModalCopy");

  let lastCaseText = "";

  if (
    !elQuestionText ||
    !elOptions ||
    !elDDxContainer ||
    !elNavBar ||
    !elBtnPrev ||
    !elBtnNext
  ) {
    console.error("UI elements missing.");
    return;
  }

  // Small helper: get step type via engine
  function getStepType(step) {
    return engine.getStepType(step);
  }

  // -----------------------------------
  // DDX rendering
  // -----------------------------------
  function renderDDx() {
    const groups = engine.getDDxGrouped();
    elDDxContainer.innerHTML = "";

    if (!groups.length) {
      const p = document.createElement("p");
      p.className = "dd-empty";
      p.textContent =
        "No diagnosis suggested yet. Answer more questions to build the differential diagnosis.";
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

        // Clinical scores (HEART-style / PE heuristic)
        if (item.clinicalScore) {
          const scoreDiv = document.createElement("div");
          scoreDiv.className =
            "dd-clinical-score dd-score-status--" +
            (item.clinicalScore.toLowerCase().includes("heart")
              ? "heart"
              : item.clinicalScore.toLowerCase().includes("pe")
              ? "wells"
              : "wells");
          scoreDiv.textContent = item.clinicalScore;
          diseaseDiv.appendChild(scoreDiv);

          if (
            item.clinicalScore.toLowerCase().includes("high risk") ||
            item.clinicalScore.toLowerCase().includes("high pe")
          ) {
            scoreSpan.style.color = "#f87171";
          }
        }

        // Positive features list (from engine featureMap)
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
          toggleBtn.textContent = "Show Supporting Features";

          toggleBtn.addEventListener("click", () => {
            ul.classList.toggle("hidden");
            toggleBtn.textContent = ul.classList.contains("hidden")
              ? "Show Supporting Features"
              : "Hide Supporting Features";
          });

          diseaseDiv.appendChild(toggleBtn);
          diseaseDiv.appendChild(ul);
        }

        // Missing / key next steps
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

  // -----------------------------------
  // Clinical reasoning (center card)
// -----------------------------------
  function renderClinicalReasoning(step) {
    const val = engine.state.answers[step.id];
    const reasons = engine.getReasoningFor(step, val);

    elReasonList.innerHTML = "";

    if (!reasons.length) {
      elReasonQuestion.textContent =
        "Select an option to see clinical reasoning.";
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
      dis.textContent = (r.diseases || [])
        .map((d) => (engine.pretty && engine.pretty[d]) || d)
        .join(", ");

      li.appendChild(text);
      if (dis.textContent.trim()) {
        li.appendChild(dis);
      }

      elReasonList.appendChild(li);
    });
  }

  // -----------------------------------
  // Options (right card)
// -----------------------------------
  function renderOptions(step) {
    elOptions.innerHTML = "";
    const t = getStepType(step);
    const val = engine.state.answers[step.id];

    // Numeric (kept for compatibility, though currently not used)
    if (t === "numeric") {
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.max = "100";

      input.value = val !== undefined ? val : "";
      if (step.placeholder) {
        input.placeholder = step.placeholder;
      } else {
        input.placeholder = "Enter numeric value";
      }

      input.addEventListener("input", () => {
        engine.setAnswer(step.id, input.value);
        engine.saveState && engine.saveState();
        renderDDx();
        renderClinicalReasoning(step);
        clearValidation();
      });

      elOptions.appendChild(input);
      return;
    }

    // Free text (name, ageText, mainSymptom, ccDuration)
    if (t === "text") {
      const input = document.createElement("input");
      input.type = "text";
      input.value = val || "";
      input.placeholder = step.placeholder || "Type your answer here...";

      input.addEventListener("input", () => {
        engine.setAnswer(step.id, input.value);
        engine.saveState && engine.saveState();
        renderDDx(); // متأثرة بالعمر/الشكوى/المدة
        renderClinicalReasoning(step);
        clearValidation();
      });

      elOptions.appendChild(input);
      return;
    }

    // Single / multi choice
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

        engine.saveState && engine.saveState();
        renderDDx();
        renderClinicalReasoning(step);
        clearValidation();
      });

      const span = document.createElement("span");
      span.className = "option-label";
      span.textContent = opt.label || key;

      row.appendChild(input);
      row.appendChild(span);
      elOptions.appendChild(row);
    });
  }

  // -----------------------------------
  // Validation
  // -----------------------------------
  function clearValidation() {
    if (!elValidationMsg) return;
    elValidationMsg.textContent = "";
  }

  function validateCurrentStep() {
    if (!elValidationMsg) return true;

    const step = engine.getCurrentStep();
    if (!step) return true;

    const required = !!step.required;
    if (!required) {
      clearValidation();
      return true;
    }

    const t   = getStepType(step);
    const val = engine.state.answers[step.id];

    let valid = true;

    if (t === "text") {
      valid = !!val && String(val).trim().length > 0;
    } else if (t === "numeric") {
      valid = val !== undefined && val !== null && String(val).trim() !== "";
    } else if (t === "single") {
      valid = val !== undefined && val !== null && val !== "";
    } else if (t === "multi") {
      valid = Array.isArray(val) && val.length > 0;
    }

    if (!valid) {
      elValidationMsg.textContent = "رجاءً أجب على هذا السؤال قبل المتابعة.";
      return false;
    }

    clearValidation();
    return true;
  }

  // -----------------------------------
  // Helpers for narrative (case story)
// -----------------------------------
  function getAnswersForSection(sectionId) {
    const answers = {};
    engine.steps
      .filter((s) => s.sectionId === sectionId)
      .forEach((step) => {
        const val = engine.state.answers[step.id];

        if (
          val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0)
        ) {
          return;
        }

        const t = getStepType(step);

        if (t === "single" && step.options && step.options[val]) {
          answers[step.id] = step.options[val].label;
        } else if (t === "multi" && step.options) {
          answers[step.id] = (Array.isArray(val) ? val : [])
            .map((key) => step.options[key])
            .filter(Boolean)
            .map((opt) => opt.label)
            .join("، ");
        } else {
          answers[step.id] = val;
        }
      });

    return answers;
  }

  // Helper: get negatives from multi options (labels of not-selected, excluding "no..." and "none")
  function getNegativesForStep(stepId) {
    const step = engine.steps.find((s) => s.id === stepId);
    if (!step || !step.options) return [];

    const selected = engine.state.answers[stepId];
    const selectedArr = Array.isArray(selected) ? selected : [];

    const negatives = [];
    Object.entries(step.options).forEach(([key, opt]) => {
      if (selectedArr.includes(key)) return;
      const label = opt.label || "";
      const lower = label.toLowerCase();
      // استبعد خيارات من نوع "لا توجد أعراض"
      if (
        lower.includes("لا توجد") ||
        lower.includes("no significant") ||
        lower.includes("no important")
      ) {
        return;
      }
      negatives.push(label);
    });

    return negatives;
  }

  // -----------------------------------
  // Build case presentation (narrative + text)
// -----------------------------------
  function buildCasePresentation() {
    const parts = [];
    let rawText = "";

    const personal = getAnswersForSection("personal");
    const cc       = getAnswersForSection("cc");
    const hpi      = getAnswersForSection("hpi");
    const ros      = getAnswersForSection("ros");
    const pmh      = getAnswersForSection("pmh");
    const psh      = getAnswersForSection("psh");
    const dh       = getAnswersForSection("dh");
    const fh       = getAnswersForSection("fh");
    const sh       = getAnswersForSection("sh");

    // raw access (for name/age/sex)
    const fullPersonalRaw = engine.state.answers;

    // 1) Opening line (personal + chief complaint)
    if (Object.keys(personal).length > 0 || Object.keys(cc).length > 0) {
      const name =
        fullPersonalRaw.name && String(fullPersonalRaw.name).trim()
          ? fullPersonalRaw.name
          : "";
      const ageText =
        fullPersonalRaw.ageText && String(fullPersonalRaw.ageText).trim()
          ? fullPersonalRaw.ageText
          : "";
      const sexLabel = personal.sex || "";

      let line = "المريض ";

      if (name) {
        line += `المسمّى <b>${name}</b>, `;
      }

      if (ageText || sexLabel) {
        line += "هو/هي ";
        if (ageText) line += `<b>${ageText}</b>`;
        if (ageText && sexLabel) line += "، ";
        if (sexLabel) line += `<b>${sexLabel}</b>`;
        line += "، ";
      }

      const mainSym =
        fullPersonalRaw.mainSymptom &&
        String(fullPersonalRaw.mainSymptom).trim()
          ? fullPersonalRaw.mainSymptom
          : "ألم في الصدر";
      const ccDur =
        fullPersonalRaw.ccDuration &&
        String(fullPersonalRaw.ccDuration).trim()
          ? fullPersonalRaw.ccDuration
          : "";

      if (ccDur) {
        line += `يشتكي أساساً من <b>${mainSym}</b> منذ <b>${ccDur}</b>.`;
      } else {
        line += `يشتكي أساساً من <b>${mainSym}</b>.`;
      }

      parts.push({
        title: "Opening / Chief Complaint",
        lines: [line]
      });
    }

    // 2) HPI narrative
    if (Object.keys(hpi).length > 0) {
      const lines = [];

      const onset    = hpi.onset || "";
      const site     = hpi.site || "";
      const char     = hpi.character || "";
      const rad      = hpi.radiation || "";
      const aggr     = hpi.aggravating || "";
      const relief   = hpi.relief || "";
      const epiDur   = hpi.episodeDuration || "";
      const course   = hpi.course || "";
      const assoc    = hpi.associated || "";
      const redFlags = hpi.redFlags || "";

      if (onset || site) {
        let l = "بدأ الألم ";
        if (onset) l += `بوصف: <b>${onset}</b>`;
        if (site) l += `، ويتمركز في: <b>${site}</b>`;
        l += ".";
        lines.push(l);
      }

      if (char || rad) {
        let l = "طبيعة الألم تُوصف بأنها ";
        if (char) l += `<b>${char}</b>`;
        if (rad) {
          if (char) l += "، مع انتشار نحو ";
          else l += "مع انتشار نحو ";
          l += `<b>${rad}</b>`;
        }
        l += ".";
        lines.push(l);
      }

      if (aggr || relief) {
        let l = "يزداد الألم مع ";
        if (aggr) l += `<b>${aggr}</b>`;
        else l += "عوامل غير محددة";

        if (relief) {
          l += "، ويتحسّن مع ";
          l += `<b>${relief}</b>`;
        }
        l += ".";
        lines.push(l);
      }

      if (epiDur || course) {
        let l = "";
        if (epiDur) l += `مدة كل نوبة تُقدّر بـ <b>${epiDur}</b>`;
        if (course) {
          if (epiDur) l += "، وسير الألم بشكل عام ";
          else l += "سير الألم بشكل عام ";
          l += `<b>${course}</b>`;
        }
        l += ".";
        lines.push(l);
      }

      if (assoc) {
        lines.push(`توجد أعراض مصاحبة تشمل: <b>${assoc}</b>.`);
      }

      if (redFlags) {
        lines.push(
          `العلامات الخطرة المُبلغ عنها تشمل: <b>${redFlags}</b>.`
        );
      } else {
        // ممكن نستنتج غياب بعض الـ red flags من خيارات غير مختارة، لكن نكتفي بالإيجابيات هنا
      }

      // Associated negatives (من multi associated)
      const assocNeg = getNegativesForStep("associated");
      if (assocNeg.length) {
        lines.push(
          `وينفي المريض وجود: <b>${assocNeg.join("، ")}</b> كأعراض مصاحبة.`
        );
      }

      parts.push({
        title: "History of Present Illness (HPI)",
        lines
      });
    }

    // 3) ROS
    if (Object.keys(ros).length > 0) {
      const lines = [];

      if (ros.rosCVS) {
        lines.push(`على مستوى الجهاز القلبي الوعائي: <b>${ros.rosCVS}</b>.`);
        const neg = getNegativesForStep("rosCVS");
        if (neg.length) {
          lines.push(
            `وينفي المريض أعراضاً قلبية أخرى مثل: <b>${neg.join(
              "، "
            )}</b>.`
          );
        }
      }
      if (ros.rosResp) {
        lines.push(`أعراض الجهاز التنفسي: <b>${ros.rosResp}</b>.`);
        const neg = getNegativesForStep("rosResp");
        if (neg.length) {
          lines.push(
            `وينفي وجود أعراض تنفسية إضافية مثل: <b>${neg.join(
              "، "
            )}</b>.`
          );
        }
      }
      if (ros.rosGIT) {
        lines.push(`أعراض الجهاز الهضمي: <b>${ros.rosGIT}</b>.`);
        const neg = getNegativesForStep("rosGIT");
        if (neg.length) {
          lines.push(
            `ولا يشتكي من أعراض هضمية أخرى مثل: <b>${neg.join(
              "، "
            )}</b>.`
          );
        }
      }
      if (ros.rosCNS) {
        lines.push(`أعراض عصبية: <b>${ros.rosCNS}</b>.`);
      }
      if (ros.rosLM) {
        lines.push(`أعراض متعلقة بالأطراف/الحركي: <b>${ros.rosLM}</b>.`);
      }
      if (ros.rosHema) {
        lines.push(`أعراض عامة/دموية: <b>${ros.rosHema}</b>.`);
      }

      if (lines.length) {
        parts.push({
          title: "Review of Systems (ROS)",
          lines
        });
      }
    }

    // 4) Background history
    if (pmh.pmhChronic) {
      parts.push({
        title: "Past Medical History (PMH)",
        lines: [`يُذكر في التاريخ المرضي السابق: <b>${pmh.pmhChronic}</b>.`]
      });
    }
    if (psh.pshOps) {
      parts.push({
        title: "Past Surgical History (PSH)",
        lines: [`تاريخ جراحي يشمل: <b>${psh.pshOps}</b>.`]
      });
    }
    if (dh.drugHistory) {
      parts.push({
        title: "Drug History (DH)",
        lines: [`الأدوية المزمنة الحالية تشمل: <b>${dh.drugHistory}</b>.`]
      });
    }
    if (fh.familyHistory) {
      parts.push({
        title: "Family History (FH)",
        lines: [`التاريخ العائلي: <b>${fh.familyHistory}</b>.`]
      });
    }
    if (sh.socialHistory) {
      parts.push({
        title: "Social History (SH)",
        lines: [`عادات ونمط الحياة: <b>${sh.socialHistory}</b>.`]
      });
    }

    // 5) Differential diagnosis summary
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
        `أكثر تشخيص مرجّح حسب المعطيات الحالية هو: <b>${main.label}</b> (Score: ${main.score}).`
      );
      if (others.length) {
        dxLines.push(
          `تشخيصات تفاضلية أخرى محتملة تشمل: <b>${others.join(
            "، "
          )}</b>.`
        );
      }

      if (main.clinicalScore) {
        dxLines.push(`Risk stratification: <b>${main.clinicalScore}</b>.`);
      }

      // دمج الفحوصات الناقصة من أعلى 2–3 تشخيصات
      const keyTests = new Set();
      allDx.slice(0, 3).forEach((dx) => {
        (dx.missing || []).forEach((m) => keyTests.add(m));
      });
      const testsArr = Array.from(keyTests);
      if (testsArr.length) {
        dxLines.push(
          `لإكمال التقييم، يُنصح بإجراء الفحوصات التالية بحسب التشخيصات الأكثر احتمالاً: <b>${testsArr.join(
            "، "
          )}</b>.`
        );
      }

      parts.push({
        title: "Differential Diagnosis (DDx) Summary",
        lines: dxLines
      });
    }

    // Final HTML + raw text (for copy/print)
    let html = "";
    if (!parts.length) {
      html = "<p>No sufficient answers yet to build a case presentation.</p>";
      rawText =
        "No sufficient answers yet to build a case presentation. Please answer more questions first.";
      return { html, text: rawText };
    }

    parts.forEach((p) => {
      html += `<div class="case-section">`;
      html += `<div class="case-section-title">${p.title}</div>`;

      rawText += `${p.title}:\n`;

      p.lines.forEach((ln) => {
        const formattedLine = ln.replace(
          /\*\*(.*?)\*\*/g,
          "<b>$1</b>"
        );
        html += `<p class="case-section-line">${formattedLine}</p>`;
        rawText += `- ${ln.replace(/<[^>]+>/g, "")}\n`;
      });

      html += `</div>\n`;
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

  // -----------------------------------
  // Navigation bar (bottom)
// -----------------------------------
  function renderNavBar() {
    elNavBar.innerHTML = "";
    const sections = engine.sections;
    const currentStep = engine.getCurrentStep();

    sections.forEach((sec) => {
      const firstStepInSection = engine.steps.find(
        (s) => s.sectionId === sec.id
      );
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

  // -----------------------------------
  // Render one step
  // -----------------------------------
  function renderCurrentStep() {
    const step = engine.getCurrentStep();
    if (!step) return;

    const prog = engine.getProgressInfo();

    elSectionLabel.textContent = step.sectionLabel || "";
    elStepCounter.textContent = `Step ${prog.current} of ${prog.total}`;

    const stepsInSection = engine.steps.filter(
      (s) => s.sectionId === step.sectionId
    );
    const totalInSection = stepsInSection.length;
    const indexInSection =
      stepsInSection.findIndex((s) => s.id === step.id) + 1;

    elSectionStepCtr.textContent = `${step.sectionLabel} – Question ${indexInSection}/${totalInSection}`;

    elQuestionText.textContent = step.question || "";
    elQuestionText.dir = "rtl";

    renderOptions(step);
    renderClinicalReasoning(step);
    renderNavBar();

    const isFirst = engine.state.currentIndex === 0;
    const isLast = engine.state.currentIndex >= engine.steps.length - 1;

    elBtnPrev.disabled = isFirst;
    elBtnNext.disabled = false;

    elBtnPrev.textContent = "Previous";
    elBtnNext.textContent = isLast ? "Case Presentation" : "Next";
  }

  // -----------------------------------
  // Footer buttons (Next, Prev, Reset, Print)
// -----------------------------------
  elBtnNext.addEventListener("click", () => {
    // validation أولاً
    const ok = validateCurrentStep();
    if (!ok) return;

    renderDDx();

    const isLast = engine.state.currentIndex >= engine.steps.length - 1;
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
    clearValidation();
  });

  if (elBtnReset) {
    elBtnReset.addEventListener("click", () => {
      const confirmReset = window.confirm(
        "This will clear all answers and restart the case. Continue?"
      );
      if (!confirmReset) return;

      engine.init();
      engine.clearSavedState && engine.clearSavedState();
      clearValidation();
      renderCurrentStep();
      renderDDx();
      renderClinicalReasoning(engine.getCurrentStep());
      closeCaseModal();
    });
  }

  if (elBtnPrint) {
    elBtnPrint.addEventListener("click", () => {
      const result = buildCasePresentation();
      const groups = engine.getDDxGrouped();

      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      let ddxHtml = "";
      if (groups.length) {
        ddxHtml += "<h2>Differential Diagnosis Summary</h2>";
        groups.forEach((g) => {
          ddxHtml += `<h3>${g.label}</h3><ul>`;
          g.items.forEach((item) => {
            ddxHtml += `<li>${item.label} (Score: ${item.score})</li>`;
          });
          ddxHtml += "</ul>";
        });
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Chest Pain Case - Printable</title>
            <meta charset="UTF-8" />
            <style>
              body {
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                margin: 20px;
                line-height: 1.6;
              }
              h1, h2, h3 {
                margin-bottom: 0.5rem;
              }
              .case-section-title {
                font-weight: 600;
                margin-top: 1rem;
              }
              .case-section-line {
                margin: 0.25rem 0;
              }
            </style>
          </head>
          <body>
            <h1>Chest Pain Case Presentation</h1>
            ${result.html}
            ${ddxHtml}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    });
  }

  // -----------------------------------
  // Modal events
  // -----------------------------------
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
      try {
        await navigator.clipboard.writeText(lastCaseText || "");
        alert("Case presentation copied to clipboard!");
      } catch (err) {
        console.error("Clipboard error:", err);
      }
    });
  }

  // -----------------------------------
  // Initial render
  // -----------------------------------
  renderCurrentStep();
  renderDDx();
  renderClinicalReasoning(engine.getCurrentStep());
});