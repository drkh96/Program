/* ============================================================
   BLEEDING TENDENCY – DYNAMIC QUESTION SYSTEM (PATHWAY VERSION)
   ------------------------------------------------------------
   Pathways:
   - Platelet / vWF (mucosal bleeding, bruising, heavy menses)
   - Coagulation (joint bleeding, hemarthrosis, post-surgical bleed)
   - Drug-Induced (aspirin, NSAIDs, anticoagulants)
   - Local Bleeding (single-site recurrent bleeding)
   ============================================================ */

const bleedingQuestions = [

/* ============================================================
   1) UNIVERSAL QUESTIONS (ALWAYS ASKED FIRST)
   ============================================================ */

{
    id: "patient_name",
    text: "What is the patient’s name?",
    type: "text",
    validate: v => v.trim().length > 0 || "Name is required.",
    reasoning: v => `Patient identified: ${v}.`
},

{
    id: "age",
    text: "How old is the patient?",
    type: "text",
    validate: (v) => {
        if (!v.trim()) return "Age is required.";
        const n = parseInt(v);
        if (isNaN(n) || n < 0 || n > 120) return "Enter a valid age.";
        return true;
    },
    reasoning: (v) => {
        const age = parseInt(v);
        if (age <= 14) return "Young age increases likelihood of congenital bleeding disorders.";
        if (age >= 65) return "Older age increases risks of liver disease or anticoagulant-related bleeding.";
        return "Age documented.";
    }
},

{
    id: "sex",
    text: "What is the patient’s sex?",
    type: "single",
    options: ["male", "female"],
    validate: v => !!v || "Please select one.",
    reasoning: (v) =>
        v === "male"
        ? "Male sex raises suspicion for hemophilia (X-linked disorders)."
        : "Female sex increases likelihood of von Willebrand disease."
},

{
    id: "chief_complaint",
    text: "What is the main bleeding complaint?",
    type: "single",
    options: [
        "bruising",
        "nose/gum bleeding",
        "joint bleeding",
        "heavy menses",
        "post-surgical bleeding",
        "recurrent bleeding from one spot"
    ],
    validate: v => !!v || "Please select a complaint.",
    reasoning: (v) => {
        switch(v){
            case "bruising": return "Bruising suggests platelet or vWF dysfunction.";
            case "nose/gum bleeding": return "Mucosal bleeding strongly indicates platelet/vWF issues.";
            case "joint bleeding": return "Joint bleeding strongly indicates coagulation factor deficiency (hemophilia).";
            case "heavy menses": return "Heavy menses is classic for von Willebrand disease.";
            case "post-surgical bleeding": return "Post-procedure bleeding suggests coagulation factor deficiency.";
            case "recurrent bleeding from one spot": return "Single-site repeated bleeding suggests a local structural cause.";
        }
    }
},

{
    id: "onset",
    text: "When did the bleeding problem start?",
    type: "single",
    options: ["since childhood", "months", "weeks", "days"],
    validate: (v, ans) => {
        if (!v) return "Select an onset.";
        if (v === "since childhood" && ans.age && parseInt(ans.age) < 2)
            return "Childhood onset is not compatible with age < 2.";
        return true;
    },
    reasoning: (v) => {
        if (v === "since childhood") return "Chronic childhood onset suggests congenital disorders.";
        if (v === "days") return "Acute onset indicates acquired causes.";
        return "Onset documented.";
    }
},

{
    id: "severity",
    text: "How severe is the bleeding?",
    type: "single",
    options: ["mild","moderate","severe"],
    validate: v => !!v || "Choose a severity.",
    reasoning: v => 
        v === "severe"
        ? "Severe bleeding strongly suggests coagulation factor deficiency or major platelet dysfunction."
        : "Severity recorded."
},

/* ============================================================
   2) PATHWAY TRIGGER – Decides which pathway to enter
   ============================================================ */

{
    id: "pathway_selector",
    type: "pathway",
    computePathway: (answers) => {
        const cc = answers.chief_complaint;

        if (cc === "bruising") return "platelet";
        if (cc === "nose/gum bleeding") return "vWF";
        if (cc === "heavy menses") return "vWF";
        if (cc === "joint bleeding") return "coagulation";
        if (cc === "post-surgical bleeding") return "coagulation";
        if (cc === "recurrent bleeding from one spot") return "local";

        return "general";
    }
},

/* ============================================================
   3) PLATELET PATHWAY QUESTIONS
   ============================================================ */

{
    id: "platelet_1",
    pathway: "platelet",
    text: "Does the patient have petechiae (tiny pinpoint bleeding spots)?",
    type: "single",
    options: ["yes","no"],
    validate: v => !!v || "Please choose an answer.",
    reasoning: v =>
        v === "yes"
        ? "Petechiae strongly indicate platelet dysfunction (ITP, drug-induced, vWF)."
        : "Absence of petechiae lowers likelihood of severe platelet dysfunction."
},

{
    id: "platelet_2",
    pathway: "platelet",
    text: "Does bleeding occur after minor trauma?",
    type: "single",
    options: ["yes","no"],
    reasoning: v => 
        v === "yes"
        ? "Bleeding after minimal trauma suggests platelet/vWF dysfunction."
        : "Normal trauma response reduces platelet disorder suspicion."
},

{
    id: "platelet_3",
    pathway: "platelet",
    text: "Does the patient bruise easily and frequently?",
    type: "single",
    options: ["yes","no"],
    reasoning: v =>
        v === "yes"
        ? "Frequent bruising is consistent with platelet or vWF disorders."
        : "Absence of easy bruising lowers suspicion."
},

/* ============================================================
   4) vWF PATHWAY QUESTIONS
   ============================================================ */

{
    id: "vwf_1",
    pathway: "vWF",
    text: "Is there mucosal bleeding (nose, gums, menstrual, GI)?",
    type: "single",
    options: ["yes","no"],
    reasoning: v =>
        v === "yes"
        ? "Mucosal bleeding is classic for von Willebrand disease."
        : "Absence of mucosal bleeding slightly reduces vWF probability."
},

{
    id: "vwf_2",
    pathway: "vWF",
    text: "Is bleeding prolonged after minor procedures (dental extraction, injections)?",
    type: "single",
    options: ["yes","no"],
    reasoning: v =>
        v === "yes"
        ? "Prolonged mucosal or procedural bleeding strongly supports vWF deficiency."
        : "Normal procedural bleeding reduces vWF suspicion."
},

{
    id: "vwf_3",
    pathway: "vWF",
    text: "Is there a family history of mucosal bleeding or vWF disorder?",
    type: "single",
    options: ["yes","no"],
    reasoning: v =>
        v === "yes"
        ? "Family history supports inherited vWF deficiency."
        : "No family history lowers inherited vWF likelihood."
},

/* ============================================================
   5) COAGULATION PATHWAY (Hemophilia / Factor Deficiency)
   ============================================================ */

{
    id: "coag_1",
    pathway: "coagulation",
    text: "Has the patient experienced joint swelling or hemarthrosis?",
    type: "single",
    options: ["yes","no"],
    reasoning: v =>
        v === "yes"
        ? "Hemarthrosis is a hallmark of hemophilia (factor VIII/IX deficiency)."
        : "Absence of hemarthrosis reduces hemophilia likelihood."
},

{
    id: "coag_2",
    pathway: "coagulation",
    text: "Is bleeding prolonged after injury or surgery?",
    type: "single",
    options: ["yes","no"],
    reasoning: v =>
        v === "yes"
        ? "Prolonged bleeding after injury indicates coagulation factor deficiency."
        : "Normal clotting after trauma reduces coagulation disorder suspicion."
},

{
    id: "coag_3",
    pathway: "coagulation",
    text: "Are male relatives affected by similar bleeding episodes?",
    type: "single",
    options: ["yes","no"],
    reasoning: v =>
        v === "yes"
        ? "Male relatives affected suggests X-linked hemophilia."
        : "Absence of male-pattern family history lowers hemophilia likelihood."
},

/* ============================================================
   6) LOCAL BLEEDING PATHWAY (Structural lesion)
   ============================================================ */

{
    id: "local_1",
    pathway: "local",
    text: "Is the bleeding always from the same exact spot?",
    type: "single",
    options: ["yes","no"],
    reasoning: v =>
        v === "yes"
        ? "Recurrent bleeding from one site suggests a local structural problem."
        : "If bleeding varies, systemic causes are more likely."
},

{
    id: "local_2",
    pathway: "local",
    text: "Any trauma or injury to that area?",
    type: "single",
    options: ["yes","no"],
    reasoning: v =>
        v === "yes"
        ? "Local trauma can explain recurrent site-specific bleeding."
        : "No trauma → suspect vascular abnormalities."
},

/* ============================================================
   7) DRUG-INDUCED BLEEDING PATHWAY
   ============================================================ */

{
    id: "drug_1",
    pathway: "drug",
    text: "Is the patient using aspirin regularly?",
    type: "single",
    options: ["yes","no"],
    reasoning: v =>
        v === "yes"
        ? "Aspirin irreversibly inhibits platelets, increasing bleeding tendency."
        : "No aspirin use documented."
},

{
    id: "drug_2",
    pathway: "drug",
    text: "Is the patient taking NSAIDs?",
    type: "single",
    options: ["yes","no"],
    reasoning: v =>
        v === "yes"
        ? "NSAIDs impair platelet aggregation and can worsen mucosal bleeding."
        : "No NSAID-related risk."
},

{
    id: "drug_3",
    pathway: "drug",
    text: "Is the patient on anticoagulants (warfarin, DOACs, heparin)?",
    type: "single",
    options: ["yes","no"],
    reasoning: v =>
        v === "yes"
        ? "Anticoagulants directly increase bleeding risk."
        : "No anticoagulant exposure."
},

];