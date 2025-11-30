// ========================================
// chest-data-ros.js (CLEAN VERSION)
// Review of Systems – Cardiovascular only
// ========================================

"use strict";

window.CHEST_SECTIONS_ROS = [

  {
    id: "ros-cvs",
    label: "مراجعة أجهزة الجسم – القلب",
    labelEn: "Review of Systems – Cardiovascular",

    visibleWhen: {
      all: [
        { stepId: "department", equals: "internal" },
        { stepId: "system",     equals: "cvs" }
      ]
    },

    steps: [

      // ===== Palpitations =====
      {
        id: "palpitations",
        sectionId: "ros-cvs",
        sectionLabel: "ROS",

        question: "هل يعاني المريض من خفقان؟",
        questionEn: "Does the patient have palpitations?",

        type: "single",
        required: false,

        options: {
          yes: { label: "نعم", labelEn: "Yes",   dxAdd: dx(["Arrhythmia"]) },
          no:  { label: "لا",   labelEn: "No",    dxAdd: dx([]) }
        }
      },

      // ===== Dyspnea =====
      {
        id: "dyspnea",
        sectionId: "ros-cvs",
        sectionLabel: "ROS",

        question: "هل هناك ضيق نفس؟",
        questionEn: "Is there shortness of breath?",

        type: "single",

        options: {
          yes:  { label: "نعم", labelEn: "Yes",  dxAdd: dx(["HF", "MI"]) },
          no:   { label: "لا",  labelEn: "No",   dxAdd: dx([]) }
        }
      },

      // ===== Orthopnea =====
      {
        id: "orthopnea",
        sectionId: "ros-cvs",
        sectionLabel: "ROS",

        question: "هل يزداد ضيق النفس عند الاستلقاء؟",
        questionEn: "Does breathing worsen on lying down?",

        type: "single",

        options: {
          yes: {
            label: "نعم",
            labelEn: "Yes",
            dxAdd: dx(["HF"])
          },
          no: {
            label: "لا",
            labelEn: "No",
            dxAdd: dx([])
          }
        }
      }

    ]
  }

];