// =========================================
// chest-ui-case-modal.js
// Builds full English case presentation
// + Copy + Print
// ========================================

"use strict";

window.UICaseModal = (function () {
  const engine = window.ChestEngine;

  const elCaseModal    = document.getElementById("caseModal");
  const elCaseContent  = document.getElementById("caseModalContent");
  const elCaseClose    = document.getElementById("caseModalClose");
  const elCaseClose2   = document.getElementById("caseModalClose2");
  const elCaseCopy     = document.getElementById("caseModalCopy");

  let lastCaseText = "";

  if (!engine || !elCaseModal || !elCaseContent) {
    console.warn("UICaseModal: Missing engine or modal DOM.");
  }

  // ---------------------------------------
  // Helper: collect narrative answers per section
  // ---------------------------------------
  function getSectionNarrative(sectionId) {
    const answers = {};
    const steps = engine.steps.filter((s) => s.sectionId === sectionId);

    steps.forEach((step) => {
      const val = engine.state.answers[step.id];
      if (
        val === undefined ||
        val === null ||
        val === "" ||
        (Array.isArray(val) && val.length === 0)
      ) {
        return;
      }

      const t = engine.getStepType(step);

      if ((t === "single" || t === "multi") && step.options) {
        if (t === "single") {
          const opt = step.options[val];
          if (opt && opt.label) {
            answers[step.id] = opt.label;
          } else {
            answers[step.id] = val;
          }
        } else if (t === "multi") {
          const arr = Array.isArray(val) ? val : [];
          const labels = arr
            .map((k) => step.options[k])
            .filter(Boolean)
            .map((o) => o.label);
          if (labels.length) {
            answers[step.id] = labels.join(", ");
          }
        }
      } else {
        // text / numeric
        answers[step.id] = val;
      }
    });

    return answers;
  }

  // ---------------------------------------
  // Build the full case presentation
  // ---------------------------------------
  function buildCasePresentation() {
    const parts = [];
    let rawText = "";

    const personal = getSectionNarrative("personal");
    const cc       = getSectionNarrative("cc");
    const hpi      = getSectionNarrative("hpi");
    const ros      = getSectionNarrative("ros");
    const pmh      = getSectionNarrative("pmh");
    const psh      = getSectionNarrative("psh");
    const dh       = getSectionNarrative("dh");
    const fh       = getSectionNarrative("fh");
    const sh       = getSectionNarrative("sh");

    // 1) Personal + CC
    if (Object.keys(personal).length > 0 || Object.keys(cc).length > 0) {
      let name = personal.name || "The patient";
      let age  = personal.ageText || personal.ageGroup || "unknown age";
      let sex  = personal.sex || "unknown sex";

      if (typeof sex === "string" && sex.includes("(")) {
        sex = sex.split("(")[0].trim();
      }

      let ccText = cc.mainSymptom || "chest pain";
      let ccDur  = cc.ccDuration || "";

      let line = `${name} is a ${age} ${sex.toLowerCase()} presenting with ${ccText}`;
      if (ccDur) {
        line += ` for ${ccDur}.`;
      } else {
        line += ".";
      }

      parts.push({
        title: "Introduction & Chief Complaint",
        lines: [line]
      });
    }

    // 2) HPI
    if (Object.keys(hpi).length > 0) {
      const lines = [];

      const onset  = hpi.onset       || "gradual onset";
      const site   = hpi.site        || "central chest";
      const char   = hpi.character   || "pressure-like pain";
      const rad    = hpi.radiation   || null;
      const agg    = hpi.aggravating || "exertion";
      const rel    = hpi.relief      || "rest does not clearly relieve it";
      const epDur  = hpi.episodeDuration || null;
      const sev    = hpi.severity    || null;
      const course = hpi.course      || "no clear change over time";
      const assoc  = hpi.associated  || null;

      let l1 = `The pain started with ${onset} and is located mainly in the ${site}.`;
      lines.push(l1);

      let l2 = `It is described as ${char}`;
      if (rad && !rad.includes("لا يوجد")) {
        l2 += ` and radiates to ${rad}.`;
      } else {
        l2 += " with no significant radiation.";
      }
      lines.push(l2);

      let l3 = `It is typically worsened by ${agg} and partially relieved by ${rel}.`;
      lines.push(l3);

      let l4 = "Regarding timing, ";
      if (epDur) {
        l4 += `each episode lasts around ${epDur}, `;
      } else {
        l4 += "the episode duration is not clearly specified, ";
      }
      if (sev) {
        l4 += `with an intensity of about ${sev}/10, `;
      }
      l4 += `and the overall course has been ${course}.`;
      lines.push(l4);

      if (assoc) {
        lines.push(`Associated symptoms include: ${assoc}.`);
      }

      parts.push({
        title: "History of Present Illness (HPI)",
        lines
      });
    }

    // 3) ROS (positives only)
    if (Object.keys(ros).length > 0) {
      const lines = [];
      if (ros.rosCVS)  lines.push(`Cardiovascular: ${ros.rosCVS}.`);
      if (ros.rosResp) lines.push(`Respiratory: ${ros.rosResp}.`);
      if (ros.rosGIT)  lines.push(`Gastrointestinal: ${ros.rosGIT}.`);
      if (ros.rosCNS)  lines.push(`Neurological: ${ros.rosCNS}.`);
      if (ros.rosLM)   lines.push(`Musculoskeletal/Peripheral: ${ros.rosLM}.`);
      if (ros.rosHema) lines.push(`Hematologic: ${ros.rosHema}.`);

      if (lines.length) {
        parts.push({
          title: "Review of Systems (relevant positives)",
          lines
        });
      }
    }

    // 4) Background history
    if (Object.keys(pmh).length > 0) {
      const arr = [];
      if (pmh.pmhChronic) arr.push(pmh.pmhChronic);
      if (arr.length) {
        parts.push({
          title: "Past Medical History",
          lines: [`Known history of: ${arr.join(", ")}.`]
        });
      }
    }

    if (Object.keys(psh).length > 0) {
      if (psh.pshOps) {
        parts.push({
          title: "Past Surgical History",
          lines: [`Past surgeries/procedures: ${psh.pshOps}.`]
        });
      }
    }

    if (Object.keys(dh).length > 0) {
      if (dh.drugHistory) {
        parts.push({
          title: "Drug History",
          lines: [`Current medications: ${dh.drugHistory}.`]
        });
      }
    }

    if (Object.keys(fh).length > 0) {
      if (fh.familyHistory) {
        parts.push({
          title: "Family History",
          lines: [`Family history of: ${fh.familyHistory}.`]
        });
      }
    }

    if (Object.keys(sh).length > 0) {
      if (sh.socialHistory) {
        parts.push({
          title: "Social History",
          lines: [`Social/Lifestyle factors: ${sh.socialHistory}.`]
        });
      }
    }

    // 5) DDx Summary
    const groups = engine.getDDxGrouped();
    const allDx = [];
    groups.forEach((g) => g.items.forEach((it) => allDx.push(it)));

    allDx.sort((a, b) => b.score - a.score);

    if (allDx.length > 0) {
      const main  = allDx[0];
      const other = allDx.slice(1, 4); // top 3 others

      const dxLines = [];
      dxLines.push(
        `Most likely diagnosis: ${main.label} (score ${main.score}).`
      );
      if (other.length) {
        dxLines.push(
          "Other important differentials: " +
            other.map((d) => d.label).join(", ") +
            "."
        );
      }
      if (main.clinicalScore) {
        dxLines.push("Clinical risk score: " + main.clinicalScore + ".");
      }

      parts.push({
        title: "Differential Diagnosis Summary",
        lines: dxLines
      });
    }

    // 6) Build HTML + raw text
    let html = "";
    if (!parts.length) {
      html = "<p>No sufficient data yet to build a case presentation.</p>";
      rawText = "No sufficient data yet to build a case presentation.";
      return { html, text: rawText };
    }

    parts.forEach((p) => {
      html += `<section class="case-section">`;
      html += `<h3 class="case-section-title">${p.title}</h3>`;
      rawText += p.title + ":\n";

      p.lines.forEach((ln) => {
        html += `<p class="case-section-line">${ln}</p>`;
        rawText += "- " + ln + "\n";
      });

      html += `</section>`;
      rawText += "\n";
    });

    return { html, text: rawText.trim() };
  }

  // ---------------------------------------
  // Modal control
  // ---------------------------------------
  function openModal() {
    if (!elCaseModal || !elCaseContent) return;

    const result = buildCasePresentation();
    elCaseContent.innerHTML = result.html;
    lastCaseText = result.text;

    elCaseModal.classList.remove("hidden");
  }

  function closeModal() {
    if (!elCaseModal) return;
    elCaseModal.classList.add("hidden");
  }

  async function copyCase() {
    try {
      await navigator.clipboard.writeText(lastCaseText || "");
      alert("Case presentation copied to clipboard.");
    } catch (err) {
      console.error("Clipboard error:", err);
      alert("Unable to copy. Please try manually.");
    }
  }

  function printCase() {
    window.print();
  }

  // ---------------------------------------
  // Event bindings
  // ---------------------------------------
  if (elCaseClose) {
    elCaseClose.addEventListener("click", closeModal);
  }
  if (elCaseClose2) {
    elCaseClose2.addEventListener("click", closeModal);
  }
  if (elCaseModal) {
    elCaseModal.addEventListener("click", (e) => {
      if (e.target === elCaseModal) {
        closeModal();
      }
    });
  }
  if (elCaseCopy) {
    elCaseCopy.addEventListener("click", copyCase);
  }

  // ---------------------------------------
  // Public API
  // ---------------------------------------
  return {
    openModal,
    closeModal,
    copyCase,
    printCase
  };
})();