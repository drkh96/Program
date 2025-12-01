// =======================================================
// ui-layout.js
// Controls: iPad Split Layout + Mobile Stacking Layout
// =======================================================

"use strict";

(function (global) {

  const Layout = {

    init() {
      this.leftPanel  = document.querySelector(".left-panel");
      this.rightPanel = document.querySelector(".right-panel");

      this.questionsCard = document.querySelector(".questions-card");
      this.analysisCard  = document.querySelector(".analysis-card");
      this.ddxCard       = document.querySelector(".ddx-card");

      this.applyLayout();
      this.bindResize();
    },

    // ===================================================
    // Change layout automatically depending on screen size
    // ===================================================
    applyLayout() {

      const width = window.innerWidth;

      // iPad Mode: Side-by-side layout
      if (width >= 900) {
        this.leftPanel.style.display  = "flex";
        this.leftPanel.style.flexDirection = "column";
        this.leftPanel.style.width = "48%";

        this.rightPanel.style.display = "block";
        this.rightPanel.style.width   = "52%";

        // Questions + Analysis stacked
        this.questionsCard.style.marginBottom = "18px";

      } else {
        // Mobile Mode: vertical stacking
        this.leftPanel.style.width = "100%";
        this.rightPanel.style.width = "100%";

        this.leftPanel.style.display = "block";
        this.rightPanel.style.display = "block";

        this.questionsCard.style.marginBottom = "20px";
        this.analysisCard.style.marginBottom  = "20px";
        this.ddxCard.style.marginBottom       = "20px";
      }
    },

    // ===================================================
    // Update layout when screen resizes
    // ===================================================
    bindResize() {
      window.addEventListener("resize", () => {
        this.applyLayout();
      });
    }

  };

  global.UILayout = Layout;

})(window);