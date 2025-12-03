/***********************************************************
 * BLEEDING TENDENCY — FULL UI RENDERING SYSTEM
 ***********************************************************/


/* ROOT DOM ELEMENTS */
const qPanel = document.getElementById("questionsCard");
const reasoningPanel = document.getElementById("reasoningCardBody");
const ddxPanel = document.getElementById("ddxContainer");
const nextBtn = document.getElementById("btnNext");
const backBtn = document.getElementById("btnBack");
const restartBtn = document.getElementById("btnRestart");


/***********************************************************
 * MAIN RENDER FUNCTION — Displays the current question
 ***********************************************************/
function renderCurrentQuestion() {
    let index = EngineState.currentIndex;

    // Finished all questions
    if (index >= Questions.length) {
        renderFinalCase();
        updateProgressBar();
        return;
    }

    let q = Questions[index];

    qPanel.innerHTML = `
        <div class="section-label">${q.section}</div>
        <div class="step-counter">Step ${index + 1} of ${Questions.length}</div>

        <div class="question-text fade-in">${q.text}</div>

        <div class="options-container" id="optionsBox"></div>
    `;

    const optionsBox = document.getElementById("optionsBox");

    if (q.type === "single") {
        nextBtn.style.display = "none";

        q.options.forEach(opt => {
            let row = document.createElement("div");
            row.className = "option-row radio-option";
            row.innerHTML = `
                <label class="option-label">
                    <input type="radio" name="${q.id}" value="${opt.value}">
                    ${opt.label}
                </label>
            `;
            row.onclick = () => {
                row.querySelector("input").checked = true;

                recordStateBeforeAnswer(q.id, opt.value); // ← BACK SUPPORT
                handleAnswer(q.id, opt.value);

                updatePanels();
                renderCurrentQuestion();
            };
            optionsBox.appendChild(row);
        });
    }

    else if (q.type === "text") {
        optionsBox.innerHTML = `
            <input type="text" id="input_${q.id}" placeholder="Enter here..." class="option-row">
        `;

        nextBtn.style.display = "block";
        nextBtn.onclick = () => {
            const v = document.getElementById(`input_${q.id}`).value.trim();
            if (!v) return;

            recordStateBeforeAnswer(q.id, v); // ← BACK SUPPORT
            handleAnswer(q.id, v);

            updatePanels();
            renderCurrentQuestion();
        };
    }

    updateProgressBar(); // ← Progress bar update
}


/***********************************************************
 * UPDATE REASONING + DDX PANELS AFTER EACH ANSWER
 ***********************************************************/
function updatePanels() {
    renderReasoning();
    renderDDx();
}


/***********************************************************
 * REASONING PANEL
 ***********************************************************/
function renderReasoning() {
    reasoningPanel.innerHTML = "";

    EngineState.reasoning.forEach(r => {
        let block = document.createElement("div");
        block.className = "reason-item-royal";

        block.innerHTML = `
            <div class="reason-text">${r.text}</div>
        `;

        reasoningPanel.appendChild(block);
    });
}


/***********************************************************
 * DDX PANEL — Diseases sorted by highest scores
 ***********************************************************/
function renderDDx() {
    ddxPanel.innerHTML = "";

    // Sort diseases by score
    let sorted = DDX_Data
        .map(d => ({ ...d, score: EngineState.ddxScores[d.id] }))
        .sort((a, b) => b.score - a.score);

    sorted.forEach(d => {
        let card = document.createElement("div");
        card.className = `device-card fade-royal ${getDDxGroupClass(d.group)}`;

        card.innerHTML = `
            <div class="device-card-header">${d.name}</div>

            <div class="dd-disease-box">

                <div class="dd-section">
                    <button class="ddx-toggle" onclick="toggleDropdown('${d.id}_feat')">▶ Features</button>
                    <div class="ddx-dropdown hidden" id="${d.id}_feat">
                        ${d.features.map(f => `<div class="dd-line">• ${f}</div>`).join("")}
                    </div>
                </div>

                <div class="dd-section">
                    <button class="ddx-toggle" onclick="toggleDropdown('${d.id}_inv')">▶ Investigations</button>
                   <div class="ddx-dropdown hidden inv" id="${d.id}_inv">
                        ${d.investigations.map(i => `<div class="dd-line">• ${i}</div>`).join("")}
                    </div>
                </div>

            </div>
        `;

        ddxPanel.appendChild(card);
    });

    afterDDXRender();
}


/***********************************************************
 * BACK BUTTON LOGIC
 ***********************************************************/
backBtn.onclick = () => {
    const ok = undoLastAnswer();
    if (!ok) return;

    renderCurrentQuestion();
    renderReasoning();
    renderDDx();
    updateProgressBar();
};


/***********************************************************
 * RESTART BUTTON LOGIC
 ***********************************************************/
restartBtn.onclick = () => {
    restartSimulation();
};


/***********************************************************
 * MAP GROUP TO CSS COLOR CLASS
 ***********************************************************/
function getDDxGroupClass(group) {
    switch(group) {
        case "platelet_vwf": return "card-pulmonary";
        case "coagulation": return "card-cardiac";
        case "local": return "card-gi";
        case "systemic": return "card-other";
        default: return "card-other";
    }
}


/***********************************************************
 * FINAL CASE SUMMARY
 ***********************************************************/
function renderFinalCase() {
    qPanel.innerHTML = `
        <div class="scenario-block fade-in">
            <div class="scenario-title">Final Case Summary</div>

            <div class="scenario-text">
                <strong>Name:</strong> ${EngineState.answers.name || "Unknown"}<br>
                <strong>Age:</strong> ${EngineState.answers.age || "Unknown"}<br>
                <strong>Sex:</strong> ${EngineState.answers.sex || "Unknown"}<br>
                <strong>Occupation:</strong> ${EngineState.answers.occupation || "Unknown"}<br><br>

                <strong>Chief Complaint:</strong> ${EngineState.answers.chiefComplaint}<br>
                <strong>Duration:</strong> ${EngineState.answers.duration}<br>
            </div>

            <div class="scenario-text">
                <strong>Clinical Reasoning Summary:</strong><br>
                ${EngineState.reasoning.map(r => `• ${r.text}`).join("<br>")}
            </div>

            <div class="scenario-text">
                <strong>Most Likely Diagnosis:</strong><br>
                ${getTopDDx()}
            </div>
        </div>
    `;

    nextBtn.style.display = "none";
    updateProgressBar();
}


/***********************************************************
 * HELPER — GET HIGHEST SCORE DIAGNOSIS
 ***********************************************************/
function getTopDDx() {
    let sorted = Object.entries(EngineState.ddxScores)
        .sort((a, b) => b[1] - a[1]);

    let topId = sorted[0][0];
    let disease = DDX_Data.find(d => d.id === topId);
    return disease ? disease.name : "No clear diagnosis";
}


/***********************************************************
 * INITIAL RENDER
 ***********************************************************/
renderCurrentQuestion();
renderDDx();
renderReasoning();
updateProgressBar();