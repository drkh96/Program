/* ============================================================
   BLEEDING SIMULATOR — UI HANDLER (Front-End Controller)
   ------------------------------------------------------------
   Responsible for:
   - Rendering questions
   - Showing reasoning
   - Updating DDx panel
   - Handling buttons (Next, Back)
   - Coordinating with BleedingEngine
   ============================================================ */


/* --------------------------
   DOM ELEMENTS
--------------------------- */
const qPanel = document.getElementById("question-panel");
const rPanel = document.getElementById("reasoning-panel");
const dPanel = document.getElementById("ddx-panel");

const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");
const errorBox = document.getElementById("error-box");


/* ============================================================
   START THE ENGINE
============================================================ */
BleedingEngine.initDDX();


/* ============================================================
   RENDER NEXT QUESTION
============================================================ */
function renderQuestion() {

    const question = BleedingEngine.getNextQuestion();

    // No more questions → show summary later (optional)
    if (!question) {
        qPanel.innerHTML = `<div class="finished-text">All questions completed.</div>`;
        nextBtn.style.display = "none";
        return;
    }

    // Reset UI
    errorBox.innerHTML = "";
    qPanel.innerHTML = "";

    // Render question text
    const qText = document.createElement("div");
    qText.className = "question-text";
    qText.innerText = question.text;
    qPanel.appendChild(qText);


    /* ================================
       TYPE: TEXT
    ================================= */
    if (question.type === "text") {
        const input = document.createElement("input");
        input.type = "text";
        input.id = "q-input";
        input.className = "text-input";
        qPanel.appendChild(input);
    }


    /* ================================
       TYPE: SINGLE OPTION
    ================================= */
    if (question.type === "single") {
        question.options.forEach(opt => {
            const btn = document.createElement("div");
            btn.className = "option-btn";
            btn.innerText = opt;

            btn.onclick = () => {
                handleAnswer(question, opt);
            };

            qPanel.appendChild(btn);
        });
    }


    /* ================================
       TYPE: PATHWAY (auto skip)
    ================================= */
    if (question.type === "pathway") {
        const result = BleedingEngine.applyAnswer(question, null);
        if (!result.ok) return; 
        renderQuestion();
        return;
    }
}


/* ============================================================
   HANDLE ANSWER CLICK
============================================================ */
function handleAnswer(question, value) {

    const result = BleedingEngine.applyAnswer(question, value);

    if (!result.ok) {
        errorBox.innerText = result.error;
        return;
    }

    renderReasoning();
    renderDDX();
    renderQuestion();
}


/* ============================================================
   HANDLE NEXT BUTTON (for text questions)
============================================================ */
nextBtn.onclick = () => {
    const question = BleedingEngine.getNextQuestion();
    if (!question) return;

    if (question.type === "text") {
        const val = document.getElementById("q-input").value.trim();
        handleAnswer(question, val);
    }
};


/* ============================================================
   HANDLE BACK BUTTON
============================================================ */
backBtn.onclick = () => {
    const ok = BleedingEngine.undo();
    if (!ok) return;

    renderReasoning();
    renderDDX();
    renderQuestion();
};


/* ============================================================
   RENDER REASONING PANEL
============================================================ */
function renderReasoning() {

    const list = BleedingEngine.state.reasoning;
    rPanel.innerHTML = ""; 

    list.forEach((text, i) => {

        const block = document.createElement("div");
        block.className = "reason-block";

        const header = document.createElement("div");
        header.className = "reason-header";
        header.innerHTML = `Reasoning #${i+1}`;

        const body = document.createElement("div");
        body.className = "reason-body";
        body.innerText = text;

        header.onclick = () => {
            body.classList.toggle("open");
        };

        block.appendChild(header);
        block.appendChild(body);
        rPanel.appendChild(block);
    });
}


/* ============================================================
   RENDER DDx PANEL (Dynamic, Sorted)
============================================================ */
function renderDDX() {

    // Hide DDx until first answer
    if (!BleedingEngine.state.initialized) {
        dPanel.innerHTML = `<div class="ddx-placeholder">DDx will appear after first answer.</div>`;
        return;
    }

    const scores = BleedingEngine.state.ddxScores;

    // Convert to array and sort
    const list = Object.keys(scores)
        .map(id => ({
            id: id,
            score: scores[id],
            data: bleedingDDX.find(d => d.id === id)
        }))
        .sort((a, b) => b.score - a.score);

    dPanel.innerHTML = "";

    list.forEach(item => {

        const card = document.createElement("div");
        card.className = "ddx-card";

        const title = document.createElement("div");
        title.className = "ddx-name";
        title.innerText = `${item.data.name} (${item.score})`;

        // Collapsible features
        const feat = document.createElement("div");
        feat.className = "ddx-section";
        feat.innerHTML = "<b>Features:</b><br>" + item.data.features.join("<br>");

        const inv = document.createElement("div");
        inv.className = "ddx-section";
        inv.innerHTML = "<b>Investigations:</b><br>" + item.data.investigations.join("<br>");

        card.appendChild(title);
        card.appendChild(feat);
        card.appendChild(inv);

        dPanel.appendChild(card);
    });
}


/* ============================================================
   START UI
============================================================ */
renderQuestion();
renderDDX();
renderReasoning();