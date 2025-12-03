/***********************************************************
 * BLEEDING TENDENCY — DIFFERENTIAL DIAGNOSIS DATA SECTION
 * Each disease has:
 *  - id
 *  - group
 *  - name
 *  - baselineScore
 *  - features: []         // expandable dropdown
 *  - investigations: []   // expandable dropdown
 ***********************************************************/

const DDX_Data = [

/* =========================================================
   1) PRIMARY HEMOSTASIS — PLATELETS / VON WILLEBRAND
   ========================================================= */

{
    id: "vwf",
    group: "platelet_vwf",
    name: "Von Willebrand Disease",
    baselineScore: 2,
    features: [
        "Mucosal bleeding (nose, gums)",
        "Easy bruising",
        "Heavy menstrual bleeding",
        "Bleeding after dental procedures",
        "Family history in both males and females"
    ],
    investigations: [
        "Prolonged bleeding time",
        "Normal or mildly prolonged APTT",
        "Normal PT",
        "Low VWF antigen or activity"
    ]
},

{
    id: "itp",
    group: "platelet_vwf",
    name: "Immune Thrombocytopenia (ITP)",
    baselineScore: 1,
    features: [
        "Petechiae and purpura",
        "Easy bruising",
        "Mucosal bleeding",
        "No joint bleeding",
        "Often follows infection (children)"
    ],
    investigations: [
        "Low platelet count",
        "Normal PT and APTT",
        "Peripheral smear: few platelets",
        "Bone marrow hypertrophy (if chronic)"
    ]
},

{
    id: "drugPlatelet",
    group: "platelet_vwf",
    name: "Drug-Induced Platelet Dysfunction",
    baselineScore: 1,
    features: [
        "Bleeding after minor cuts",
        "Nose/gum bleeding",
        "History of aspirin, clopidogrel, NSAIDs, SSRIs",
        "Normal platelet count but abnormal function"
    ],
    investigations: [
        "Platelet function tests abnormal",
        "Normal PT and APTT",
        "Medication history"
    ]
},

{
    id: "uremic",
    group: "platelet_vwf",
    name: "Uremic Platelet Dysfunction",
    baselineScore: 1,
    features: [
        "Mucosal bleeding",
        "Easy bruising",
        "History of kidney failure",
        "Prolonged bleeding after procedures"
    ],
    investigations: [
        "High creatinine / urea",
        "Normal PT and APTT",
        "Bleeding time prolonged"
    ]
},

/* =========================================================
   2) COAGULATION FACTORS — SECONDARY HEMOSTASIS
   ========================================================= */

{
    id: "hemA",
    group: "coagulation",
    name: "Hemophilia A (Factor VIII Deficiency)",
    baselineScore: 2,
    features: [
        "Joint bleeding (hemarthrosis)",
        "Deep muscle hematoma",
        "Delayed post-surgical bleeding",
        "Male predominance (X-linked)",
        "Bleeding since childhood"
    ],
    investigations: [
        "Prolonged APTT",
        "Normal PT",
        "Low Factor VIII level"
    ]
},

{
    id: "hemB",
    group: "coagulation",
    name: "Hemophilia B (Factor IX Deficiency)",
    baselineScore: 2,
    features: [
        "Joint bleeding",
        "Muscle hematomas",
        "Delayed post-trauma bleeding",
        "Males affected",
        "Bleeding from childhood"
    ],
    investigations: [
        "Prolonged APTT",
        "Normal PT",
        "Low Factor IX"
    ]
},

{
    id: "factor13",
    group: "coagulation",
    name: "Factor XIII Deficiency",
    baselineScore: 1,
    features: [
        "Bleeding with normal PT/APTT",
        "Delayed bleeding hours after trauma",
        "Umbilical stump bleeding in infants",
        "Intracranial bleeding without trauma"
    ],
    investigations: [
        "Normal PT / APTT",
        "Low Factor XIII level",
        "Clot solubility test abnormal"
    ]
},

{
    id: "vitK",
    group: "coagulation",
    name: "Vitamin K Deficiency",
    baselineScore: 1,
    features: [
        "Bleeding after surgery",
        "GI bleeding",
        "History of malabsorption or antibiotics",
        "Liver disease risk factors"
    ],
    investigations: [
        "Prolonged PT (first)",
        "Prolonged APTT (later)",
        "Low Vitamin K dependent factors"
    ]
},

{
    id: "warfarin",
    group: "coagulation",
    name: "Warfarin Toxicity",
    baselineScore: 2,
    features: [
        "Bruising",
        "GI bleeding",
        "Hematuria",
        "Recent change in dose or diet",
        "INR > 3"
    ],
    investigations: [
        "Prolonged PT/INR",
        "Prolonged APTT",
        "Warfarin use history"
    ]
},

{
    id: "liverFailure",
    group: "coagulation",
    name: "Liver Disease Coagulopathy",
    baselineScore: 1,
    features: [
        "Mucosal and deep bleeding",
        "Spider nevi or jaundice",
        "Chronic alcohol use",
        "Easy bruising"
    ],
    investigations: [
        "Prolonged PT and APTT",
        "Low platelets",
        "Abnormal LFTs"
    ]
},

/* =========================================================
   3) LOCAL BLEEDING LESIONS
   ========================================================= */

{
    id: "epistaxisLocal",
    group: "local",
    name: "Local Epistaxis (Nasal Lesion)",
    baselineScore: 0,
    features: [
        "Bleeding from one nostril",
        "Triggered by nose picking or dryness",
        "Recurrent bleeding in same spot",
        "No bruising elsewhere"
    ],
    investigations: [
        "Local nasal exam",
        "No systemic abnormalities"
    ]
},

{
    id: "pepticUlcer",
    group: "local",
    name: "Peptic Ulcer Bleeding",
    baselineScore: 0,
    features: [
        "Melena or hematemesis",
        "Epigastric pain",
        "NSAID use",
        "No bruising"
    ],
    investigations: [
        "Endoscopy",
        "CBC for anemia",
        "Stool occult blood"
    ]
},

{
    id: "hemorrhoids",
    group: "local",
    name: "Hemorrhoids",
    baselineScore: 0,
    features: [
        "Bright red rectal bleeding",
        "Pain or itching",
        "Constipation"
    ],
    investigations: [
        "Rectal exam",
        "Anoscopy"
    ]
},

/* =========================================================
   4) SYSTEMIC BLEEDING CONDITIONS
   ========================================================= */

{
    id: "dic",
    group: "systemic",
    name: "Disseminated Intravascular Coagulation (DIC)",
    baselineScore: 1,
    features: [
        "Acute severe bleeding",
        "Bleeding from multiple sites",
        "Fever or sepsis history",
        "Organ failure signs"
    ],
    investigations: [
        "Prolonged PT and APTT",
        "Low fibrinogen",
        "High D-dimer",
        "Low platelets"
    ]
},

{
    id: "leukemia",
    group: "systemic",
    name: "Leukemia",
    baselineScore: 1,
    features: [
        "Bruising",
        "Recurrent infections",
        "Fatigue, weight loss",
        "Pallor"
    ],
    investigations: [
        "CBC (blasts)",
        "Bone marrow biopsy",
        "Low platelets"
    ]
},

{
    id: "aplastic",
    group: "systemic",
    name: "Aplastic Anemia",
    baselineScore: 0,
    features: [
        "Bleeding + infections + anemia",
        "Pancytopenia",
        "Fatigue"
    ],
    investigations: [
        "CBC: pancytopenia",
        "Bone marrow: hypocellular"
    ]
},

{
    id: "kidneyFail",
    group: "systemic",
    name: "Chronic Kidney Failure",
    baselineScore: 0,
    features: [
        "Easy bruising",
        "Mucosal bleeding",
        "Uremic symptoms",
        "Fatigue"
    ],
    investigations: [
        "High urea/creatinine",
        "Normal PT/APTT",
        "Prolonged bleeding time"
    ]
}

];