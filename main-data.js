// ========================================
// main-data.js
// GLOBAL ROUTING → Department → System
// ========================================

"use strict";

window.CHEST_SECTIONS_MAIN = [

  // ========== 1) اختيار القسم الرئيسي ==========
  {
    id: "department",
    label: "Main Department",
    steps: [
      {
        id: "department",
        question: "اختر القسم الرئيسي:",
        questionEn: "Choose the main department:",
        type: "single",
        required: true,
        options: {
          internal: { label: "Internal Medicine" },
          surgery:  { label: "Surgery" },
          peds:     { label: "Pediatrics" },
          obgyn:    { label: "Ob/Gyn" }
        }
      }
    ]
  },

  // ========== 2) اختيار الجهاز داخل الباطنية ==========
  {
    id: "system-internal",
    label: "Internal Medicine Systems",
    visibleWhen: { stepId: "department", equals: "internal" },
    steps: [
      {
        id: "system",
        question: "اختر الجهاز داخل الباطنية:",
        questionEn: "Choose the internal medicine system:",
        type: "single",
        required: true,
        options: {
          cvs:  { label: "Cardiovascular System" },
          resp: { label: "Respiratory System" },
          git:  { label: "Gastrointestinal System" },
          renal:{ label: "Renal / Urology" },
          endo: { label: "Endocrine" }
        }
      }
    ]
  },

  // ========== 3) Placeholder للأقسام الأخرى ==========
  {
    id: "system-surgery",
    label: "Surgery Systems",
    visibleWhen: { stepId: "department", equals: "surgery" },
    steps: [
      {
        id: "system",
        question: "اختر النظام:",
        questionEn: "Choose system:",
        type: "single",
        options: {
          general: { label: "General Surgery" },
          trauma:  { label: "Trauma" }
        }
      }
    ]
  },

  {
    id: "system-peds",
    label: "Pediatrics Systems",
    visibleWhen: { stepId: "department", equals: "peds" },
    steps: [
      {
        id: "system",
        question: "اختر الجهاز:",
        questionEn: "Choose system:",
        type: "single",
        options: {
          general: { label: "General Pediatrics" }
        }
      }
    ]
  },

  {
    id: "system-obgyn",
    label: "Ob/Gyn Systems",
    visibleWhen: { stepId: "department", equals: "obgyn" },
    steps: [
      {
        id: "system",
        question: "اختر الجهاز:",
        questionEn: "Choose system:",
        type: "single",
        options: {
          obst:  { label: "Obstetrics" },
          gyn:   { label: "Gynecology" }
        }
      }
    ]
  }

];