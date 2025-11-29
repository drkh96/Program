// ========================================
// chest-data-entry.js
// Top-level entry section (department + system)
// ========================================

"use strict";

window.CHEST_SECTIONS_ENTRY = [
  {
    id: "entry",
    label: "Entry",
    steps: [
      {
        id: "department",
        sectionId: "entry",
        sectionLabel: "Department",
        question: "Select department:",
        type: "single",
        required: true,
        options: {
          internal: { label: "Internal Medicine" },
          surgery:  { label: "Surgery" },
          peds:     { label: "Pediatrics" },
          obgyn:    { label: "Obstetrics & Gynecology" }
        }
      },
      {
        id: "system",
        sectionId: "entry",
        sectionLabel: "System",
        question: "Select system to focus on:",
        type: "single",
        required: true,
        options: {
          cvs:     { label: "Cardiovascular" },
          resp:    { label: "Respiratory" },
          git:     { label: "Gastrointestinal" },
          neuro:   { label: "Neurology" },
          renal:   { label: "Renal / Genitourinary" },
          msk:     { label: "Musculoskeletal" },
          general: { label: "General / Fever" }
        }
      }
    ]
  }
];