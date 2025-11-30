// ========================================
// chest-engine-core.js (CLEAN VERSION)
// Central controller connecting:
// CONFIG + STATE + UI Renderer
// ========================================

"use strict";

(function (global) {

  const CONFIG = global.CHEST_ENGINE_CONFIG;
  const STATE  = global.CHEST_ENGINE_STATE;

  if (!CONFIG || !STATE) {
    console.error("❌ ENGINE CORE cannot start: Missing CONFIG or STATE");
    return;
  }

  // ======================================================
  // INTERNAL ENGINE OBJECT
  // ======================================================
  const Engine = {

    // -------------------------
    // Initialize Engine
    // -------------------------
    init() {
      STATE.init();
      this.updateUI();
    },

    // -------------------------
    // Save Answer
    // -------------------------
    answer(stepId, val) {
      STATE.save(stepId, val);
      this.updateUI();
    },

    // -------------------------
    // Next / Back Navigation
    // -------------------------
    next() {
      STATE.next();
      this.updateUI();
    },

    back() {
      STATE.back();
      this.updateUI();
    },

    // -------------------------
    // Rendering Callback (from UI)
    // -------------------------
    onRender: null,

    updateUI() {
      if (typeof this.onRender === "function") {
        this.onRender({
          step: STATE.current,
          steps: STATE.steps,
          answers: STATE.answers
        });
      }
    }
  };

  // ======================================================
  // EXPOSE TO WINDOW
  // ======================================================
  global.CHEST_ENGINE = Engine;

  console.log("✅ ENGINE CORE LOADED");

})(window);