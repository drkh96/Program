// ===============================================
// ui-differentials.js
// Differential Diagnosis – Device Cards + Sliders
// ===============================================

"use strict";

(function (global) {

  const DDxUI = {

    container: document.querySelector(".ddx-card"),

    render(deviceList) {

      let html = `<div class="ddx-title">Differential Diagnosis</div>`;

      deviceList.forEach(device => {

        html += `
          <div class="device-block">
            <div class="device-title">${device.deviceName}</div>

            <div class="device-slider">
        `;

        device.diseases.forEach(dx => {

          const scoreColor =
            dx.score >= 70 ? "red" :
            dx.score >= 40 ? "yellow" :
                             "green";

          html += `
            <div class="dx-card ${scoreColor}">
              <div class="dx-name">${dx.name}</div>
              <div class="dx-score">${dx.score}%</div>

              <ul class="dx-features">
                ${dx.features.map(f => `<li>${f}</li>`).join("")}
              </ul>
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      });

      this.container.innerHTML = html;
    }

  };

  global.DDxUI = DDxUI;

})(window);