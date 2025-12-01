// =======================================================
// chest-engine-options.js
// Option Utilities for Steps (validation + normalization)
// =======================================================

"use strict";

(function (global) {

  const Engine = global.ChestEngine;

  const Options = {

    // ---------------------------------------------------
    // Return array of option IDs for a step
    // ---------------------------------------------------
    getOptionIds(step) {
      if (!step || !step.options) return [];
      return Object.keys(step.options);
    },

    // ---------------------------------------------------
    // Check if option exists in this step
    // ---------------------------------------------------
    isValidOption(step, optionId) {
      if (!step || !step.options) return false;
      return !!step.options[optionId];
    },

    // ---------------------------------------------------
    // Clean multi answer (remove invalid options)
    // ---------------------------------------------------
    cleanMulti(step, values) {
      if (!Array.isArray(values)) return [];
      return values.filter(v => this.isValidOption(step, v));
    },

    // ---------------------------------------------------
    // Clean single answer
    // ---------------------------------------------------
    cleanSingle(step, value) {
      if (!value) return null;
      return this.isValidOption(step, value) ? value : null;
    },

    // ---------------------------------------------------
    // Return readable label (auto-detect language)
    // ---------------------------------------------------
    getLabel(step, optionId) {

      const lang = Engine.getLanguage();
      const opt  = step.options[optionId];

      if (!opt) return "";

      return lang === "ar" ? opt.label : opt.labelEn;
    }

  };

  global.ChestEngineOptions = Options;

})(window);