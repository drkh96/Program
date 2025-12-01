// ===============================================
// ui-analysis.js
// Clinical Reasoning – English Only (Luxury Version)
// ===============================================

"use strict";

(function (global) {

  const Analysis = {

    container: document.querySelector(".analysis-card"),

    render(reasonsList) {

      let html = `<div class="analysis-title">Clinical Reasoning</div>`;

      reasonsList.forEach(reason => {

        const color =
          reason.type === "support" ? "green" :
          reason.type === "danger"  ? "red"   :
                                      "blue";

        html += `
          <div class="analysis-item ${color}">
            <ul>
              ${reason.points.map(p => `<li>${p}</li>`).join("")}
            </ul>
          </div>
        `;
      });

      this.container.innerHTML = html;
    }

  };

  global.ClinicalAnalysisUI = Analysis;

})(window);