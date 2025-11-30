// ========================================
// main-data.js
// Main routing: Department → System
// ========================================

"use strict";

window.CHEST_SECTIONS_MAIN = [
  {
    id: "entry",
    label: "Case Type",
    steps: [

      // 1) اختيار القسم الرئيسي
      {
        id: "department",
        sectionId: "entry",
        sectionLabel: "Department",

        question:    "اختر القسم الرئيسي للحالة:",
        questionEn:  "Choose the main department:",

        type: "single",
        required: true,

        options: {
          internal: { label: "Internal Medicine" },
          surgery:  { label: "Surgery" },
          peds:     { label: "Pediatrics" },
          obgyn:    { label: "Ob/Gyn" }
        }
      },

      // 2) اختيار الجهاز داخل الباطنية فقط
      {
        id: "system",
        sectionId: "entry",
        sectionLabel: "System",

        question:   "اختر الجهاز داخل الباطنية:",
        questionEn: "Choose the internal medicine system:",

        type: "single",
        required: true,

        visibleWhen: { stepId: "department", equals: "internal" },

        options: {
          cvs:  { label: "Cardiovascular System" },
          resp: { label: "Respiratory System" }
        }
      }
    ]
  }
];