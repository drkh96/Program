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
      // 1) اختيار الفرع الرئيسي
      {
        id: "department",
        sectionId: "entry",
        sectionLabel: "Department",
        question: "اختر القسم الرئيسي للحالة:",
        type: "single",
        required: true,

        // ✔ خيارات صحيحة داخل options
        options: {
          internal: { label: "Internal Medicine" },
          surgery:  { label: "Surgery" },
          peds:     { label: "Pediatrics" },
          obgyn:    { label: "Ob/Gyn" }
        }
      },

      // 2) اختيار الجهاز – للبــاطنية فقط
      {
        id: "system",
        sectionId: "entry",
        sectionLabel: "System",
        question: "اختر الجهاز داخل الباطنية:",
        type: "single",
        required: true,

        // ✔ الشرط صحيح
        visibleWhen: { stepId: "department", equals: "internal" },

        // ✔ خيارات صحيحة داخل options
        options: {
          cvs:  { label: "Cardiovascular System" },
          resp: { label: "Respiratory System" }
          // باقي الأجهزة نضيفها لاحقاً
        }
      }
    ]
  }
];