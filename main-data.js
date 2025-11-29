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
        options: {
          internal: { label: "باطنية (Internal Medicine)" },
          surgery:  { label: "جراحة (Surgery)" },
          peds:     { label: "أطفال (Pediatrics)" },
          obgyn:    { label: "نسائية / توليد (Ob/Gyn)" }
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
        visibleWhen: { stepId: "department", equals: "internal" },
        options: {
          cvs:  { label: "جهاز القلب والأوعية (CVS)" },
          resp: { label: "الجهاز التنفسي (Respiratory)" }
          // باقي الأجهزة نضيفها مستقبلاً
        }
      }
    ]
  }
];