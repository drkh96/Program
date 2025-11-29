// =============================
// chest-ids.js
// Common helpers for all data
// =============================
"use strict";

function dx(ids) {
  return ids || [];
}

function r(text, diseases) {
  return { text, diseases: diseases || [] };
}

function dxR(ids) {
  return ids || [];
}

function rR(text, diseases) {
  return { text, diseases: diseases || [] };
}

function dxB(ids) {
  return ids || [];
}

function rB(text, diseases) {
  return { text, diseases: diseases || [] };
}
// ========================================
// Step IDs used by the scoring engine
// ========================================
window.ChestIds = {
  steps: {
    ageText: "ageText",
    mainSymptom: "mainSymptom",
    ccDuration: "ccDuration",

    site: "site",
    onset: "onset",
    character: "character",
    radiation: "radiation",
    aggravating: "aggravating",
    relief: "relief",
    episodeDuration: "episodeDuration",
    course: "course",
    associated: "associated",
    redFlags: "redFlags",

    pmhChronic: "pmhChronic",
    familyHistory: "familyHistory",
    socialHistory: "socialHistory",
    pshOps: "pshOps",

    rosLM: "rosLM"
  }
};