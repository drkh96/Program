/* ============================================================
   BLEEDING TENDENCY — DIFFERENTIAL DIAGNOSIS SYSTEM
   ------------------------------------------------------------
   Compatible with dynamic pathways from bleeding-data.js
   Groups:
   - Platelet disorders
   - von Willebrand disease
   - Coagulation factor deficiency (Hemophilia A/B)
   - Systemic / Liver disease
   - Drug-induced bleeding
   - Local structural bleeding
   ============================================================ */

const bleedingDDX = [

/* ============================================================
   PLATELET DISORDERS
   ============================================================ */

{
    id: "itp",
    name: "Immune Thrombocytopenia (ITP)",
    group: "platelet",
    baseline: 1,
    triggers: {
        platelet_1: { yes: +3 },        // petechiae
        platelet_2: { yes: +2 },        // bleeding after minor trauma
        platelet_3: { yes: +2 },        // easy bruising
        drug_2:     { yes: +1 }         // NSAIDs worsen platelet dysfunction
    },
    features: [
        "Petechiae",
        "Easy bruising",
        "Mucosal bleeding",
        "Normal PT/PTT, low platelets"
    ],
    investigations: [
        "CBC (low platelets)",
        "Peripheral smear",
        "Exclude infections & medications"
    ]
},

{
    id: "aspirin_effect",
    name: "Aspirin-Induced Platelet Dysfunction",
    group: "platelet",
    baseline: 0,
    triggers: {
        drug_1: { yes: +3 },           // aspirin use
        platelet_3: { yes: +1 }
    },
    features: [
        "Mucosal bleeding",
        "Bruising",
        "Normal platelet count with dysfunction"
    ],
    investigations: [
        "Bleeding time prolonged",
        "Platelet function assay"
    ]
},

/* ============================================================
   von WILLEBRAND DISEASE
   ============================================================ */

{
    id: "vwf",
    name: "Von Willebrand Disease",
    group: "vWF",
    baseline: 2,
    triggers: {
        chief_complaint: {
            "nose/gum bleeding": +2,
            "heavy menses": +3
        },
        vwf_1: { yes: +3 },    // mucosal bleeding
        vwf_2: { yes: +2 },    // prolonged bleeding after procedures
        vwf_3: { yes: +2 },    // family history
        platelet_3: { yes: +1 }
    },
    features: [
        "Mucosal bleeding",
        "Heavy menses",
        "Epistaxis",
        "Prolonged bleeding after dental extraction"
    ],
    investigations: [
        "VWF antigen",
        "VWF activity (ristocetin)",
        "Factor VIII activity"
    ]
},

/* ============================================================
   COAGULATION DISORDERS — HEMOPHILIA A/B
   ============================================================ */

{
    id: "hemA",
    name: "Hemophilia A (Factor VIII deficiency)",
    group: "coagulation",
    baseline: 1,
    triggers: {
        coag_1: { yes: +3 },  // hemarthrosis
        coag_2: { yes: +2 },  // prolonged bleeding after injury
        coag_3: { yes: +3 },  // male relatives affected
        sex:    { male: +1 },
        onset:  { "since childhood": +2 }
    },
    features: [
        "Joint bleeding",
        "Deep tissue bleeding",
        "Prolonged postoperative bleeding",
        "Elevated aPTT"
    ],
    investigations: [
        "Factor VIII level",
        "PT normal, aPTT prolonged"
    ]
},

{
    id: "hemB",
    name: "Hemophilia B (Factor IX deficiency)",
    group: "coagulation",
    baseline: 1,
    triggers: {
        coag_1: { yes: +3 },
        coag_2: { yes: +2 },
        coag_3: { yes: +3 },
        sex:    { male: +1 },
        onset:  { "since childhood": +2 }
    },
    features: [
        "Joint bleeding",
        "Deep muscle bleeding",
        "Prolonged aPTT"
    ],
    investigations: [
        "Factor IX level",
        "PT normal, aPTT prolonged"
    ]
},

/* ============================================================
   LIVER DISEASE / SYSTEMIC DISORDERS
   ============================================================ */

{
    id: "liver_disease",
    name: "Liver Disease (Coagulation Factor Synthesis Failure)",
    group: "systemic",
    baseline: 0,
    triggers: {
        severity: { severe: +1 },
        age:      (age) => age >= 50 ? +1 : 0
    },
    features: [
        "Epistaxis",
        "Bruising",
        "Prolonged PT/INR",
        "Low synthesis of clotting factors"
    ],
    investigations: [
        "Liver function tests",
        "INR/PT",
        "Ultrasound liver"
    ]
},

/* ============================================================
   DRUG-INDUCED BLEEDING
   ============================================================ */

{
    id: "warfarin_effect",
    name: "Warfarin or Anticoagulant Effect",
    group: "drug",
    baseline: 1,
    triggers: {
        drug_3: { yes: +4 },   // anticoagulants
        severity: { severe: +1 }
    },
    features: [
        "Severe bleeding",
        "Prolonged PT/INR",
        "History of anticoagulant use"
    ],
    investigations: [
        "INR/PT",
        "Medication review"
    ]
},

/* ============================================================
   LOCAL BLEEDING
   ============================================================ */

{
    id: "local_lesion",
    name: "Local Structural Lesion",
    group: "local",
    baseline: 0,
    triggers: {
        local_1: { yes: +3 },    // same spot bleeding
        local_2: { yes: +2 }     // trauma
    },
    features: [
        "Repeated bleeding at one anatomical site",
        "Possible vascular malformation",
        "Bleeding not correlated with systemic disorders"
    ],
    investigations: [
        "ENT exam / local inspection",
        "Endoscopy (if GI)",
        "Imaging if structural lesion suspected"
    ]
}

];