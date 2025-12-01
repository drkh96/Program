// =======================================================
// chest-engine-collect.js
// Collects all Answers from the Questions UI into Engine
// =======================================================

"use strict";

(function (global) {

  const Engine = global.ChestEngine;
  const State  = global.ChestEngineState;

  if (!Engine) {
    console.error("ChestEngine not found");
    return;
  }

  const Collector = {

    // ===================================================
    // Collect answers from the UI and store in EngineState
    // ===================================================
    collectAnswers() {

      const allSteps = Engine.steps;

      allSteps.forEach(step => {

        let value = null;

        // -------------------------------
        // SINGLE CHOICE
        // -------------------------------
        if (step.type === "single") {

          const selected = document.querySelector(
            `input[name="${step.id}"]:checked`
          );

          value = selected ? selected.value : null;
        }

        // -------------------------------
        // MULTI CHOICE
        // -------------------------------
        else if (step.type === "multi") {

          const selectedList = document.querySelectorAll(
            `input[name="${step.id}"]:checked`
          );

          value = [];
          selectedList.forEach(item => {
            value.push(item.value);
          });
        }

        // -------------------------------
        // TEXT INPUT
        // -------------------------------
        else if (step.type === "text") {

          const input = document.querySelector(
            `input[name="${step.id}"]`
          );

          value = input ? input.value.trim() : "";
        }

        // -------------------------------
        // SAVE ANSWER INTO ENGINE STATE
        // -------------------------------
        if (value !== null) {
          Engine.saveAnswer(step.id, value);
        }

      });

      return State.answers;
    }
  };

  // expose:
  global.ChestEngine.collectAnswers = Collector.collectAnswers;

})(window);