// ========================================
// chest-ui.js
// Connect ChestEngine with the 3-card UI (Arabic/RTL)
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
    p.textContent = "لم يتم اقتراح تشخيص بعد. أجب على المزيد من الأسئلة لبناء التشخيص التفريقي.";
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
      scoreSpan.textContent = `النقاط: ${item.score}`;

      dHeader.appendChild(nameSpan);
      dHeader.appendChild(scoreSpan);
      diseaseDiv.appendChild(dHeader);
      
      // 💡 NEW: Display Wells Score if available
      if (item.wells) {
          const wellsDiv = document.createElement("div");
          wellsDiv.className = "dd-wells-score";
          wellsDiv.textContent = `Wells Score: ${item.wells.split(' (')[0]} - خطر ${item.wells.includes('High') ? 'مرتفع' : item.wells.includes('Moderate') ? 'متوسط' : 'منخفض'}`;
          diseaseDiv.appendChild(wellsDiv);
          
          if (item.wells.includes('High Risk')) {
              scoreSpan.style.color = '#f87171'; // أحمر لتنبيه الخطر
          }
      }

      // 💡 LOGIC FOR POSITIVE FEATURES (EXISTING)
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
        toggleBtn.textContent = "إظهار الميزات الإيجابية";

        toggleBtn.addEventListener("click", () => {
          ul.classList.toggle("hidden");
          toggleBtn.textContent = ul.classList.contains("hidden")
            ? "إظهار الميزات الإيجابية"
            : "إخفاء الميزات الإيجابية";
        });

        diseaseDiv.appendChild(toggleBtn);
        diseaseDiv.appendChild(ul);
      }
      
      // 💡 NEW LOGIC: Display Missing/Key findings
      if (item.missing && item.missing.length) {
        const missingDiv = document.createElement("div");
        missingDiv.className = "dd-missing-box";
        
        const missingHeader = document.createElement("div");
        missingHeader.className = "dd-missing-header";
        missingHeader.textContent = "الخطوات الرئيسية التالية:";
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
  // ===== Helpers to build Case Presentation (NARRATIVE SUMMARY) =====
  
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
              .join("، ");
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

    // 1) PATIENT DEMOGRAPHICS (Personal data)
    if (Object.keys(personal).length > 0) {
      let line = "";
      if (personal.name && personal.name !== "المريض") line += `المريض **${personal.name}**`;
      else line += `المريض`;
      
      const age = personal.ageGroup || "عمر غير معلوم";
      const sex = personal.sex ? personal.sex.toLowerCase().split(' ')[0] : "جنس غير معلوم";

      line += ` هو **${sex}** يبلغ من العمر **${age}** سنة ويشتكي من ألم صدري.`;
      
      parts.push({ title: "البيانات الشخصية", lines: [line] });
    }

    // 2) CHIEF COMPLAINT (CC)
    if (cc.mainSymptom || cc.ccDuration) {
      let line = "الشكوى الرئيسية هي **" + (cc.mainSymptom || "ألم صدري") + "**";
      if (cc.ccDuration) {
        line += "، وهي موجودة منذ **" + cc.ccDuration + "**.";
      } else {
        line += ".";
      }
      parts.push({ title: "الشكوى الرئيسية ومدة المرض", lines: [line] });
    }

    // 3) HISTORY OF PRESENT ILLNESS (HPI)
    if (Object.keys(hpi).length > 0) {
        let lines = [];
        
        // Onset and Site
        let hpiLine1 = "بدأ الألم **" + (hpi.onset || "تدريجياً") + "**";
        hpiLine1 += "، ويقع بشكل رئيسي في **" + (hpi.site || "خلف القص مركزياً") + "**.";
        lines.push(hpiLine1);

        // Character and Radiation
        let hpiLine2 = "وصف الألم هو **" + (hpi.character || "ضيق/ضغط") + "**";
        if (hpi.radiation && !hpi.radiation.includes("لا يوجد")) {
            hpiLine2 += "، مع إشعاع **" + hpi.radiation + "**.";
        } else {
            hpiLine2 += "، و**لا يوجد إشعاع محدد** له.";
        }
        lines.push(hpiLine2);

        // Modifying Factors
        let hpiLine3 = "يزداد الألم سوءاً عادةً **مع " + (hpi.aggravating || "الجهد") + "**";
        hpiLine3 += "، ويخف **بـ " + (hpi.relief || "لا شيء مهم") + "**.";
        lines.push(hpiLine3);
        
        // Severity and Course
        let hpiLine4 = "كل نوبة تستمر **" + (hpi.episodeDuration || "5-20 دقيقة") + "**.";
        if (hpi.severity) {
            hpiLine4 += ` شدة الألم مقدرة بـ **${hpi.severity}/10**`;
        }
        hpiLine4 += `، ومسار الألم العام هو **${hpi.course || "ثابت"}**.`
        lines.push(hpiLine4);

        // Associated Symptoms
        if (hpi.associated) {
             lines.push(`الأعراض المرافقة تشمل: **${hpi.associated}**.`);
        }
        
        parts.push({ title: "تاريخ المرض الحالي (HPI)", lines: lines });
    }
    
    // 4) REVIEW OF SYSTEMS (ROS)
    if (Object.keys(ros).length > 0) {
        let lines = [];
        if (ros.rosCVS) lines.push(`**القلبي الوعائي:** ${ros.rosCVS}`);
        if (ros.rosResp) lines.push(`**التنفسي:** ${ros.rosResp}`);
        if (ros.rosGIT) lines.push(`**الهضمي:** ${ros.rosGIT}`);
        if (ros.rosCNS) lines.push(`**الجهاز العصبي:** ${ros.rosCNS}`);
        if (ros.rosLM) lines.push(`**الحركي/الوعائي المحيطي:** ${ros.rosLM}`);
        if (ros.rosHema) lines.push(`**الدموي:** ${ros.rosHema}`);
        
        if (lines.length > 0) {
             parts.push({ title: "مراجعة الأجهزة (ROS)", lines: lines });
        }
    }
    
    // 5) PMH, PSH, DH, FH, SH (As lists)
    if (pmh.pmhChronic) {
      parts.push({ title: "التاريخ المرضي السابق (PMH)", lines: [`تاريخ إيجابي لـ: **${pmh.pmhChronic}**`] });
    }
    if (psh.pshOps) {
      parts.push({ title: "التاريخ الجراحي السابق (PSH)", lines: [`أُجريت له: **${psh.pshOps}**`] });
    }
    if (dh.drugHistory) {
      parts.push({ title: "تاريخ الأدوية (DH)", lines: [`يتناول حالياً: **${dh.drugHistory}**`] });
    }
    if (fh.familyHistory) {
      parts.push({ title: "التاريخ العائلي (FH)", lines: [`تاريخ عائلي ذو صلة بـ: **${fh.familyHistory}**`] });
    }
    if (sh.socialHistory) {
      parts.push({ title: "التاريخ الاجتماعي (SH)", lines: [`عوامل نمط الحياة تشمل: **${sh.socialHistory}**`] });
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
        `التشخيص الأكثر ترجيحاً: **${main.label}** (النقاط: ${main.score}).`
      );
      if (others.length) {
        dxLines.push(
          `تشخيصات أخرى في التشخيص التفريقي: **${others.join("، ")}**.`
        );
      }
      
      if (main.wells) {
          dxLines.push(`**Wells Score** للاشتباه بالانصمام الرئوي: ${main.wells.split(' (')[0]} (خطر ${main.wells.includes('High') ? 'مرتفع' : main.wells.includes('Moderate') ? 'متوسط' : 'منخفض'}).`);
      }


      parts.push({
        title: "ملخص التشخيص التفريقي (DDx)",
        lines: dxLines
      });
    }

    // تحويل إلى HTML + نص خام (لـ copy)
    let html = "";
    let rawText = "";

    if (!parts.length) {
      html = "<p>لا توجد إجابات كافية لبناء عرض الحالة بعد.</p>";
      rawText = "لا توجد إجابات كافية لبناء عرض الحالة بعد.";
      return { html, text: rawText };
    }

    parts.forEach((p) => {
      html += `<div class="case-section">`;
      html += `<div class="case-section-title">${p.title}</div>`;
      
      rawText += `${p.title}:\n`;

      p.lines.forEach((ln) => {
        // تحويل النص الغامق **...** إلى HTML
        const formattedLine = ln
          .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
          .replace(/^•\s*/, '');
          
        html += `<p class="case-section-line">${formattedLine}</p>`;
        
        // للنص الخام (raw text)، نحذف علامات الـ Markdown ونضيف -
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
      alert("تم نسخ عرض الحالة إلى الحافظة!");
    });
  }
  
function renderClinicalReasoning(step) {
  const val = engine.state.answers[step.id];
  const reasons = engine.getReasoningFor(step, val);

  elReasonList.innerHTML = "";

  if (!reasons.length) {
    elReasonQuestion.textContent = "اختر خياراً لعرض المنطق السريري.";
    return;
  }

  elReasonQuestion.textContent = "المنطق السريري:";

  reasons.forEach((r) => {
    const li = document.createElement("li");
    li.className = "reason-item";

    const text = document.createElement("span");
    text.className = "reason-text";
    text.textContent = r.text;

    const dis = document.createElement("span");
    dis.className = "reason-diseases";
    // يتم عرض الأسماء الإنجليزية هنا للحفاظ على المصطلحات الدقيقة
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
    input.max = "100"; 
    input.value = val !== undefined ? val : "";
    input.placeholder = step.id === "severity" ? "0–10" : "العمر بالسنوات"; 

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
    input.placeholder = "أدخل إجابتك هنا...";

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

function renderCurrentStep() {
  const step = engine.getCurrentStep();
  if (!step) return;

  const prog = engine.getProgressInfo();

  // labels
  elSectionLabel.textContent = step.sectionLabel || "";
  elStepCounter.textContent = `الخطوة ${prog.current} من ${prog.total}`;

  const totalInSection = engine.steps.filter(
    (s) => s.sectionId === step.sectionId
  ).length;
  const indexInSection =
    engine.steps
      .filter((s) => s.sectionId === step.sectionId)
      .findIndex((s) => s.id === step.id) + 1;

  elSectionStepCtr.textContent =
    `${step.sectionLabel} – السؤال ${indexInSection}/${totalInSection}`;

  elQuestionText.textContent = step.question || "";
  renderReasoning(step);      
  renderClinicalReasoning(step);

  const isFirst = (engine.state.currentIndex === 0);
  const isLast  = (engine.state.currentIndex >= engine.steps.length - 1);

  elBtnPrev.disabled = isFirst;
  elBtnNext.disabled = false;
  elBtnNext.textContent = isLast ? "عرض الحالة" : "التالي";
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
  renderClinicalReasoning(engine.getCurrentStep()); 
});
