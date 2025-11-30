// =============================
// chest-ids.js
// Clean helper functions
// =============================

"use strict";

/**
 * Return an array of disease IDs
 * Example: dx(["mi","pe"])
 */
function dx(ids) {
  return Array.isArray(ids) ? ids : [];
}

/**
 * Return a reasoning block
 * Example: r("Chest pain worsens with exertion", ["mi"])
 */
function r(text, diseases) {
  return {
    text: text || "",
    diseases: Array.isArray(diseases) ? diseases : []
  };
}