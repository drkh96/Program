// ========================================
// chest-data-peds.js
// Pediatric-Specific History (for child cases)
// ========================================

"use strict";

window.CHEST_SECTIONS_PEDS = [
  {
    id: "peds",
    label: "Pediatric History",
    steps: [
      {
        id: "pedsIsChildCase",
        sectionId: "peds",
        sectionLabel: "Pediatrics",
        question: "Is this a pediatric case?",
        type: "single",
        required: true,
        // 👇 يظهر فقط إذا القسم PEDS
        visibleWhen: {
          stepId: "department",
          equals: "peds"
        },
        options: {
          yes: { label: "Yes, child patient" },
          no:  { label: "No, adult patient" }
        }
      },
      {
        id: "pedsInformant",
        sectionId: "peds",
        sectionLabel: "Pediatrics",
        question: "Who is giving the history?",
        type: "single",
        required: false,
        // 👇 يظهر فقط إذا القسم PEDS
        visibleWhen: {
          stepId: "department",
          equals: "peds"
        },
        options: {
          mother:      { label: "Mother" },
          father:      { label: "Father" },
          bothParents: { label: "Both parents" },
          caregiver:   { label: "Caregiver / relative" },
          patientSelf: { label: "Older child (self)" }
        }
      },
      {
        id: "pedsBirth",
        sectionId: "peds",
        sectionLabel: "Pediatrics",
        question: "Birth history:",
        type: "multi",
        required: false,
        // 👇 يظهر فقط إذا القسم PEDS
        visibleWhen: {
          stepId: "department",
          equals: "peds"
        },
        options: {
          term:              { label: "Term delivery" },
          preterm:           { label: "Preterm delivery" },
          cs:                { label: "Cesarean section" },
          nvd:               { label: "Normal vaginal delivery" },
          nicu:              { label: "NICU admission" },
          birthComplication: { label: "Birth complications" }
        }
      },
      {
        id: "pedsFeeding",
        sectionId: "peds",
        sectionLabel: "Pediatrics",
        question: "Feeding history:",
        type: "multi",
        required: false,
        // 👇 يظهر فقط إذا القسم PEDS
        visibleWhen: {
          stepId: "department",
          equals: "peds"
        },
        options: {
          exclusiveBF:  { label: "Exclusive breast feeding (first 6 months)" },
          mixedFeeding: { label: "Mixed feeding" },
          formula:      { label: "Formula feeding" },
          poorFeeding:  { label: "Poor feeding / feeding difficulty" }
        }
      },
      {
        id: "pedsVaccination",
        sectionId: "peds",
        sectionLabel: "Pediatrics",
        question: "Vaccination status:",
        type: "single",
        required: false,
        // 👇 يظهر فقط إذا القسم PEDS
        visibleWhen: {
          stepId: "department",
          equals: "peds"
        },
        options: {
          complete:   { label: "Complete for age" },
          incomplete: { label: "Incomplete" },
          unknown:    { label: "Unknown" }
        }
      },
      {
        id: "pedsDevelopment",
        sectionId: "peds",
        sectionLabel: "Pediatrics",
        question: "Developmental history:",
        type: "multi",
        required: false,
        // 👇 يظهر فقط إذا القسم PEDS
        visibleWhen: {
          stepId: "department",
          equals: "peds"
        },
        options: {
          normal:      { label: "Normal milestones for age" },
          motorDelay:  { label: "Motor delay" },
          speechDelay: { label: "Speech / language delay" },
          socialDelay: { label: "Social / behavioral concerns" },
          learning:    { label: "School performance problems" }
        }
      },
      {
        id: "pedsExposure",
        sectionId: "peds",
        sectionLabel: "Pediatrics",
        question: "Exposure and environment:",
        type: "multi",
        required: false,
        // 👇 يظهر فقط إذا القسم PEDS
        visibleWhen: {
          stepId: "department",
          equals: "peds"
        },
        options: {
          daycare:      { label: "Attends daycare / school" },
          sickContacts: { label: "Contact with sick persons" },
          pets:         { label: "Pets at home" },
          smokingHouse: { label: "Smoking exposure in house" },
          recentTravel: { label: "Recent travel" }
        }
      }
    ]
  }
];