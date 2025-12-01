// =====================================================
// ui-case-scenario.js
// Final Case Scenario (English Only – Luxury Version)
// =====================================================

"use strict";

(function (global) {

  const ScenarioUI = {

    container: document.querySelector(".case-scenario-card"),

    generate(answers, dxTopList) {

      // ============================
      // Extracting Data
      // ============================

      const age       = answers.patient_age || "";
      const gender    = answers.patient_gender === "male" ? "male" : "female";
      const cc        = "chest pain"; // ثابت لأن النسخة الحالية خاصة بألم الصدر

      const onset     = answers.hpi_onset;
      const site      = answers.hpi_site;
      const character = answers.hpi_character;
      const radiation = answers.hpi_radiation;
      const duration  = answers.hpi_duration;
      const associated = answers.hpi_associated || [];
      const aggrav    = answers.hpi_aggravating || [];
      const relieve   = answers.hpi_relieving || [];

      const rf        = answers.hpi_risk_factors || [];

      const prev      = answers.hpi_previous;
      const sleep     = answers.hpi_sleep;
      const activity  = answers.hpi_activity;

      // ============================
      // Mapping to English phrases
      // ============================

      function toText(val) {
        if (!val) return "";
        if (typeof val === "string") return val.replace(/_/g, " ");
        if (Array.isArray(val)) return val.map(v => v.replace(/_/g, " ")).join(", ");
        return "";
      }

      // ============================
      // Building the scenario text
      // ============================

      let text = `
        <div class="scenario-title">Final Case Scenario</div>

        <div class="scenario-body">
          A ${age}-year-old ${gender} presented with ${cc}. 
          The chest pain is described as ${toText(character)}, located ${toText(site)}, 
          with an onset of ${toText(onset)} and a duration of ${toText(duration)}.

          ${radiation ? `The pain radiates to ${toText(radiation)}.` : ""}

          ${associated.length > 0 ? 
            `Associated symptoms include ${toText(associated)}.` 
            : ""}

          ${aggrav.length > 0 ? 
            `The pain is aggravated by ${toText(aggrav)}.` 
            : ""}

          ${relieve.length > 0 ? 
            `The pain is relieved by ${toText(relieve)}.` 
            : ""}

          ${rf.length > 0 ? 
            `Relevant risk factors: ${toText(rf)}.` 
            : ""}

          ${prev === "yes" ? 
            `The patient reports previous similar episodes.` : ""}

          ${activity === "yes" ? 
            `The pain interferes with daily activities.` : ""}

          ${sleep === "yes" ? 
            `It also interferes with sleep.` : ""}

          <br><br>
          Based on the provided clinical information, the top differential diagnoses are:
        </div>
      `;

      // ============================
      // Adding Top 3 DX
      // ============================

      text += `<ul class="scenario-dx-list">`;

      dxTopList.forEach(dx => {
        text += `<li><strong>${dx.name}</strong> — ${dx.score}% probability</li>`;
      });

      text += `</ul>`;

      // ============================
      // Render
      // ============================

      this.container.innerHTML = text;
    }

  };

  global.CaseScenarioUI = ScenarioUI;

})(window);