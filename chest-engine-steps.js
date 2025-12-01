// =======================================================
// chest-engine-steps.js
// Visibility-Aware Step Navigation
// =======================================================

"use strict";

(function (global) {

  const Engine = global.ChestEngine;
  const State  = global.ChestEngineState;

  const Steps = {

    // ---------------------------------------------------
    // Get ONLY visible steps
    // ---------------------------------------------------
    getVisibleSteps() {
      return Engine.steps.filter(step => Engine.isStepVisible(step));
    },

    // ---------------------------------------------------
    // Get current visible step
    // ---------------------------------------------------
    getCurrentVisibleStep() {

      const visible = this.getVisibleSteps();
      const index = State.currentStepIndex;

      return visible[index] || null;
    },

    // ---------------------------------------------------
    // Move to next visible step
    // ---------------------------------------------------
    nextVisible() {

      const visible = this.getVisibleSteps();

      if (State.currentStepIndex < visible.length - 1) {
        State.currentStepIndex++;
      }
    },

    // ---------------------------------------------------
    // Move to previous visible step
    // ---------------------------------------------------
    prevVisible() {

      if (State.currentStepIndex > 0) {
        State.currentStepIndex--;
      }
    }
  };

  global.ChestEngineSteps = Steps;

})(window);