/******************************************************
 * BLEEDING TENDENCY — DATA SECTION
 * This file contains:
 * 1) Personal Information Questions
 * 2) Chief Complaint
 * 3) Duration of Complaint
 * 4) Entry Question A+
 * 5) Dynamic Pathway Questions
 ******************************************************/

const Questions = [

/* =====================================================
   1) PERSONAL INFORMATION — ONE QUESTION AT A TIME
   ===================================================== */

{
    id: "name",
    section: "Personal Information",
    text: "What is the patient's name?",
    type: "text",
    affectsDDx: false,   // لا يؤثر على التشخيص
    reasoning: (v) => `Patient is identified as ${v}.`
},

{
    id: "age",
    section: "Personal Information",
    text: "How old is the patient?",
    type: "text",    // المريض يكتب رقم لكن الحقل text
    parse: (v) => {
        let age = parseInt(v);
        return isNaN(age) ? null : age;
    },
    affectsDDx: true,
    reasoning: (age) => {
        if (!age) return "Age unclear.";

        if (age <= 14)
            return "Pediatric age → consider hemophilia, ITP, congenital disorders.";
        if (age <= 40)
            return "Young adult → vWF disease, ITP, menstrual bleeding possible.";
        if (age <= 65)
            return "Middle-aged → consider liver disease and drug-related bleeding.";
        return "Elderly → bleeding often due to anticoagulants, liver disease, or malignancy.";
    }
},

{
    id: "sex",
    section: "Personal Information",
    text: "What is the patient's sex?",
    type: "single",
    options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" }
    ],
    affectsDDx: true,
    reasoning: (sex) => {
        if (sex === "male") return "Male → hemophilia significantly more likely.";
        if (sex === "female") return "Female → consider menorrhagia and vWF disease.";
        return "";
    }
},

{
    id: "occupation",
    section: "Personal Information",
    text: "What is the patient's occupation?",
    type: "single",
    options: [
        { value: "office", label: "Office worker" },
        { value: "manual", label: "Manual labor worker" },
        { value: "healthcare", label: "Healthcare worker" },
        { value: "student", label: "Student" },
        { value: "retired", label: "Retired / elderly" },
        { value: "housewife", label: "Housewife" },
        { value: "athlete", label: "Athlete" }
    ],
    affectsDDx: true,
    reasoning: (job) => {
        switch(job) {
            case "manual": 
                return "Manual labor → bruising may be trauma-related OR excessive bleeding.";
            case "retired":
                return "Retired → higher chance of anticoagulant use or liver disease.";
            case "healthcare":
                return "Healthcare worker → increased medication exposure.";
            case "housewife":
                return "Housewife → menorrhagia relevance in bleeding history.";
            default:
                return "Occupation does not strongly modify bleeding etiology.";
        }
    }
},

/* =====================================================
   2) CHIEF COMPLAINT
   ===================================================== */

{
    id: "chiefComplaint",
    section: "Chief Complaint",
    text: "Why is the patient seeking medical attention today?",
    type: "single",
    options: [
        { value: "bruising", label: "I bruise easily" },
        { value: "noseGumBleeding", label: "Bleeding from nose or gums" },
        { value: "smallCuts", label: "Prolonged bleeding after small cuts" },
        { value: "heavyMenses", label: "Heavy menstrual bleeding" },
        { value: "jointBleeding", label: "Joint swelling with blood" },
        { value: "postSurgery", label: "Bleeding too much after surgery/dental work" },
        { value: "recurrentSpot", label: "Bleeding repeatedly from the same spot" },
        { value: "giBleeding", label: "Blood in stool or vomit" }
    ],
    affectsDDx: true,
    reasoning: (complaint) => {
        switch(complaint) {
            case "bruising":
                return "Bruising easily → platelet dysfunction vs vWF disease.";
            case "noseGumBleeding":
                return "Mucosal bleeding → primary hemostasis problem.";
            case "smallCuts":
                return "Bleeding after small cuts → platelet/vWF defect.";
            case "heavyMenses":
                return "Menorrhagia → vWF deficiency commonly suspected in females.";
            case "jointBleeding":
                return "Joint bleeding (hemarthrosis) → coagulation factor deficiency (hemophilia).";
            case "postSurgery":
                return "Post-surgical bleeding → immediate = platelet / delayed = coagulation.";
            case "recurrentSpot":
                return "Recurrent bleeding from one site → local lesion.";
            case "giBleeding":
                return "GI bleeding → systemic, local GI lesion, or anticoagulant effect.";
        }
    }
},

/* =====================================================
   3) DURATION OF COMPLAINT (NEW REQUEST)
   ===================================================== */

{
    id: "duration",
    section: "Chief Complaint",
    text: "How long has the bleeding problem been occurring?",
    type: "single",
    options: [
        { value: "sinceChildhood", label: "Since childhood" },
        { value: "years", label: "For many years" },
        { value: "months", label: "For several months" },
        { value: "weeks", label: "For several weeks" },
        { value: "days", label: "For a few days" },
        { value: "sudden", label: "Sudden onset" }
    ],
    affectsDDx: true,
    reasoning: (d) => {
        switch(d) {
            case "sinceChildhood":
                return "Since childhood → suggests congenital disorder such as hemophilia or vWF.";
            case "years":
                return "Chronic bleeding → suggests inherited disorder or chronic liver disease.";
            case "months":
                return "Several months → consider ITP, malignancy, liver disease.";
            case "weeks":
                return "Weeks → acquired causes likely.";
            case "days":
                return "Acute onset → drugs, infection, DIC possible.";
            case "sudden":
                return "Sudden severe bleeding → DIC, trauma, anticoagulant toxicity.";
        }
    }
},

/* =====================================================
   4) ENTRY QUESTION A+ (THE MASTER PATHWAY SELECTOR)
   ===================================================== */

{
    id: "bleedingSite",
    section: "Bleeding Characteristics",
    text: "Where do you notice the bleeding?",
    type: "single",
    options: [
        { value: "mucosal", label: "Nose / gums / mouth" },
        { value: "skinBruising", label: "Bruising or petechiae" },
        { value: "smallCuts", label: "Prolonged bleeding after small cuts" },
        { value: "joint", label: "Bleeding inside joints" },
        { value: "muscle", label: "Deep muscle bleeding / hematomas" },
        { value: "singleSpot", label: "Bleeding always from one place" },
        { value: "postProcedure", label: "Bleeding after procedures" },
        { value: "gi", label: "Blood in stool or vomit" },
        { value: "urine", label: "Blood in urine" },
        { value: "resp", label: "Coughing or vomiting blood" }
    ],
    affectsDDx: true,
    reasoning: (b) => {
        switch(b) {
            case "mucosal":
            case "skinBruising":
            case "smallCuts":
                return "Primary hemostasis defect → platelet or vWF disease.";
            case "joint":
            case "muscle":
                return "Deep bleeding → coagulation factor deficiency (hemophilia).";
            case "singleSpot":
                return "Localized bleeding → local lesion.";
            case "postProcedure":
                return "Procedure bleeding → immediate = platelet/vWF, delayed = coagulation.";
            case "gi":
                return "GI bleeding → local GI lesion or systemic coagulopathy.";
            case "urine":
                return "Hematuria → possible renal lesion or systemic bleeding.";
            case "resp":
                return "Hemoptysis → pulmonary pathology or systemic bleeding.";
        }
    }
}

]; // END OF QUESTIONS