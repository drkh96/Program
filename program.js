/******************************************************
 *  BLEEDING TENDENCY — COMPLETE JS ENGINE
 *  One-file system: Questions + Engine + UI + DDx
 ******************************************************/

// ====================================================
// 1) STATE
// ====================================================

const EngineState = {
    step: 0,
    answers: {}
};

// ====================================================
// 2) QUESTIONS (Based on your text)
// ====================================================

const Questions = [
    {
        id: "site",
        section: "Site of bleeding",
        text: "Where is the bleeding located?",
        type: "single",
        options: [
            { value: "mucocutaneous", label: "Petechiae / Purpura / Mucosal bleeding" },
            { value: "deep", label: "Deep bleeding (joints / muscles / intracranial)" },
            { value: "local", label: "Recurrent bleeding at a single site" }
        ]
    },
    {
        id: "duration",
        section: "Duration",
        text: "Is the condition congenital or acquired?",
        type: "single",
        options: [
            { value: "congenital", label: "Since childhood (congenital)" },
            { value: "acquired", label: "Recent onset (acquired)" }
        ]
    },
    {
        id: "severity",
        section: "Severity",
        text: "Does bleeding occur spontaneously?",
        type: "single",
        options: [
            { value: "spontaneous", label: "Yes → severe defect" },
            { value: "traumaOnly", label: "Only after trauma" }
        ]
    },
    {
        id: "surgery",
        section: "Surgical bleeding",
        text: "What happened after past surgeries?",
        type: "single",
        options: [
            { value: "immediate", label: "Immediate bleeding" },
            { value: "delayed", label: "Delayed bleeding (24–48 hours)" },
            { value: "normal", label: "No abnormal bleeding" }
        ]
    },
    {
        id: "family",
        section: "Family history",
        text: "Is there a family history of bleeding?",
        type: "single",
        options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
        ]
    },
    {
        id: "drugs",
        section: "Drugs",
        text: "Which of the following medications are used?",
        type: "single",
        options: [
            { value: "antiplatelet", label: "Aspirin / Clopidogrel" },
            { value: "anticoagulant", label: "Warfarin / Heparin / DOACs" },
            { value: "herbals", label: "Herbal remedies" },
            { value: "none", label: "No medications" }
        ]
    }
];

// ====================================================
// 3) DDx GROUPS (Filtering ONLY)
// ====================================================

const DDxGroups = [

/********** 1 — Platelet Disorders (Primary Hemostasis) **********/
{
    groupId: "platelets",
    label: "Platelet Disorders",
    colorClass: "psych",
    diseases: [
        {
            name: "Immune Thrombocytopenia (ITP)",
            showIf: ans => ans.site === "mucocutaneous",
            features: [
                "Petechiae / Purpura",
                "Mucosal bleeding",
                "Normal PT & aPTT",
                "Isolated thrombocytopenia"
            ],
            investigations: [
                "CBC → ↓ platelet count",
                "Peripheral smear",
                "Bone marrow in unclear cases"
            ]
        },
        {
            name: "Drug-induced platelet dysfunction",
            showIf: ans => ans.drugs === "antiplatelet",
            features: [
                "Bleeding after minor trauma",
                "Normal platelet count",
                "Prolonged bleeding time"
            ],
            investigations: [
                "Platelet function test",
                "Bleeding time"
            ]
        }
    ]
},

/********** 2 — Von Willebrand Disease **********/
{
    groupId: "vWF",
    label: "Von Willebrand Disorder",
    colorClass: "pulmonary",
    diseases: [
        {
            name: "Von Willebrand Disease",
            showIf: ans =>
                ans.site === "mucocutaneous" &&
                ans.surgery === "immediate",
            features: [
                "Epistaxis / Menorrhagia",
                "Mucosal bleeding",
                "Prolonged bleeding after dental extraction"
            ],
            investigations: [
                "vWF antigen level",
                "Ristocetin cofactor activity",
                "Factor VIII"
            ]
        }
    ]
},

/********** 3 — Coagulation Factor Defects (Secondary Hemostasis) **********/
{
    groupId: "coag",
    label: "Coagulation Disorders",
    colorClass: "cardiac",
    diseases: [
        {
            name: "Hemophilia A (Factor VIII deficiency)",
            showIf: ans =>
                ans.site === "deep" ||
                ans.surgery === "delayed" ||
                (ans.duration === "congenital" && ans.family === "yes"),
            features: [
                "Hemarthrosis",
                "Deep bleeding",
                "Delayed surgical bleeding"
            ],
            investigations: [
                "aPTT prolonged",
                "Factor VIII level",
                "Normal PT"
            ]
        },

        {
            name: "Hemophilia B (Factor IX deficiency)",
            showIf: ans =>
                ans.site === "deep" ||
                ans.surgery === "delayed",
            features: [
                "Joint bleeds",
                "Muscle hematomas",
                "Congenital bleeding"
            ],
            investigations: [
                "aPTT prolonged",
                "Factor IX level",
                "Normal PT"
            ]
        },

        {
            name: "Vitamin K deficiency",
            showIf: ans => ans.duration === "acquired",
            features: [
                "Easy bruising",
                "Bleeding after trauma",
                "Often due to malnutrition / antibiotics"
            ],
            investigations: [
                "PT prolonged",
                "aPTT prolonged (late)",
                "Vitamin K level"
            ]
        },

        {
            name: "Liver failure",
            showIf: ans => ans.duration === "acquired",
            features: [
                "Multiple factor deficiencies",
                "Prolonged PT & aPTT",
                "Thrombocytopenia possible"
            ],
            investigations: [
                "LFTs",
                "PT / aPTT",
                "Platelet count"
            ]
        }
    ]
},

/********** 4 — Fibrinolysis Disorders **********/
{
    groupId: "fibrinolysis",
    label: "Excessive Fibrinolysis",
    colorClass: "aorta",
    diseases: [
        {
            name: "Therapeutic thrombolysis bleeding",
            showIf: ans => ans.drugs === "anticoagulant",
            features: [
                "Widespread bleeding",
                "Oozing from venipuncture sites",
                "Prolonged clot lysis"
            ],
            investigations: [
                "D-dimer ↑↑",
                "PT & aPTT prolonged",
                "Thrombin time"
            ]
        }
    ]
},

/********** 5 — Local lesions **********/
{
    groupId: "local",
    label: "Local Causes",
    colorClass: "other",
    diseases: [
        {
            name: "Local structural abnormality",
            showIf: ans => ans.site === "local",
            features: [
                "Recurrent bleeding at same site",
                "Nasal polyp / ulcer / lesion"
            ],
            investigations: [
                "Local exam",
                "Imaging if needed"
            ]
        }
    ]
},

/********** 6 — Drug-induced Coagulopathy **********/
{
    groupId: "drugcoag",
    label: "Drug-Induced Coagulation Defects",
    colorClass: "gi",
    diseases: [
        {
            name: "Warfarin toxicity",
            showIf: ans => ans.drugs === "anticoagulant",
            features: [
                "Easy bruising",
                "Bleeding gums",
                "High INR"
            ],
            investigations: [
                "PT prolonged",
                "INR",
                "Liver function tests"
            ]
        }
    ]
}

]; // END DDx GROUPS



// ====================================================
// 4) UI RENDERING ENGINE
// ====================================================

const UI = {};

// Render Question
UI.renderQuestion = function () {
    const questionCard = document.querySelector(".card-history .card-body");
    const q = Questions[EngineState.step];
    if (!q) return;

    questionCard.innerHTML = `
        <div class="section-label">${q.section}</div>
        <div class="question-text">${q.text}</div>
        <div class="options-container">
            ${q.options
                .map(
                    opt => `
                <div class="option-row radio-option" data-value="${opt.value}"
                     onclick="UI.selectOption('${q.id}', '${opt.value}', this)">
                    <span class="option-label">${opt.label}</span>
                </div>`
                )
                .join("")}
        </div>

        <div class="controls-row">
            ${
                EngineState.step > 0
                    ? `<button class="btn btn-secondary" onclick="UI.prev()">Back</button>`
                    : `<button class="btn btn-secondary" disabled>Back</button>`
            }
            <button class="btn btn-primary" onclick="UI.next()">Next</button>
        </div>
    `;
};

// Select option
UI.selectOption = function (id, value, el) {
    EngineState.answers[id] = value;
    document
        .querySelectorAll(".option-row")
        .forEach(opt => opt.classList.remove("selected"));
    el.classList.add("selected");
};

// Navigation
UI.next = function () {
    if (EngineState.step < Questions.length - 1) {
        EngineState.step++;
        UI.renderQuestion();
        UI.updateDDx();
    }
};

UI.prev = function () {
    if (EngineState.step > 0) {
        EngineState.step--;
        UI.renderQuestion();
        UI.updateDDx();
    }
};


// ====================================================
// 5) DDX RENDERING
// ====================================================

UI.updateDDx = function () {
    const container = document.getElementById("ddxContainer");
    const ans = EngineState.answers;
    container.innerHTML = "";

    DDxGroups.forEach(group => {
        const visibleDiseases = group.diseases.filter(d => d.showIf(ans));

        if (visibleDiseases.length === 0) return;

        const groupDiv = document.createElement("div");
        groupDiv.className = `device-card ${group.colorClass}`;

        groupDiv.innerHTML = `<div class="device-card-header">${group.label}</div>`;

        visibleDiseases.forEach(d => {
            const dis = document.createElement("div");
            dis.className = "dd-disease-box";

            dis.innerHTML = `
                <div class="dd-disease-name">${d.name}</div>

                <div class="toggle-btn" onclick="UI.toggleSection(this)">
                    <span class="arrow">▼</span> Features
                </div>
                <div class="toggle-section">
                    <div class="pos-features-box">
                        ${d.features
                            .map(f => `<span class="pos-feature-tag">${f}</span>`)
                            .join("")}
                    </div>
                </div>

                <div class="toggle-btn" onclick="UI.toggleSection(this)">
                    <span class="arrow">▼</span> Investigations
                </div>
                <div class="toggle-section">
                    <div class="pos-features-box">
                        ${d.investigations
                            .map(f => `<span class="pos-feature-tag">${f}</span>`)
                            .join("")}
                    </div>
                </div>
            `;

            groupDiv.appendChild(dis);
        });

        container.appendChild(groupDiv);
    });
};


// Toggle sections (Features/Investigations)
UI.toggleSection = function (btn) {
    const sec = btn.nextElementSibling;
    const arrow = btn.querySelector(".arrow");

    if (sec.classList.contains("open")) {
        sec.classList.remove("open");
        arrow.style.transform = "rotate(0deg)";
    } else {
        sec.classList.add("open");
        arrow.style.transform = "rotate(180deg)";
    }
};


// ====================================================
// 6) INIT
// ====================================================

UI.renderQuestion();
UI.updateDDx();