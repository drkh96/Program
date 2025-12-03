/***********************************************************
 * ui-utils.js
 * Full UI Behavior Layer:
 * - Smooth Dropdowns
 * - Feature/Investigation Tagging
 * - Progress Bar Controller
 * - Back (Undo)
 * - Restart Simulation
 ***********************************************************/


/***********************************************************
 * 0) GLOBAL HISTORY STACK (UNDO SUPPORT)
 ***********************************************************/
const AnswerHistory = [];


/***********************************************************
 * 1) Smooth Dropdown Animation
 ***********************************************************/
function toggleDropdown(id) {
    const box = document.getElementById(id);
    if (!box) return;

    if (box.classList.contains("hidden")) {
        // OPEN
        box.classList.remove("hidden");
        box.style.maxHeight = box.scrollHeight + "px";
        box.style.opacity = "1";
        box.style.transform = "translateX(0)";
    } else {
        // CLOSE
        box.style.maxHeight = "0px";
        box.style.opacity = "0";
        box.style.transform = "translateX(-6px)";
        setTimeout(() => box.classList.add("hidden"), 200);
    }
}


/***********************************************************
 * 2) Auto-tag dropdowns as Feature vs Investigation
 ***********************************************************/
function classifyDDXDropdowns() {
    const all = document.querySelectorAll(".ddx-dropdown");

    all.forEach(el => {
        if (el.id.endsWith("_feat")) el.classList.add("feat");  // soft blue
        if (el.id.endsWith("_inv")) el.classList.add("inv");    // soft purple
    });
}


/***********************************************************
 * 3) Progress Bar Controller
 ***********************************************************/
function updateProgressBar() {
    const bar = document.getElementById("progressFill");
    if (!bar) return;

    const total = Questions.length;
    const index = EngineState.currentIndex;
    const percent = Math.floor((index / total) * 100);

    bar.style.width = percent + "%";
}


/***********************************************************
 * 4) RECORD STATE BEFORE ANSWER (For BACK/UNDO)
 ***********************************************************/
function recordStateBeforeAnswer(qid, value) {
    AnswerHistory.push({
        qid,
        answersSnapshot: { ...EngineState.answers },
        ddxSnapshot: { ...EngineState.ddxScores },
        reasoningSnapshot: [...EngineState.reasoning],
        indexSnapshot: EngineState.currentIndex
    });
}


/***********************************************************
 * 5) UNDO LAST ANSWER (BACK BUTTON)
 ***********************************************************/
function undoLastAnswer() {
    if (AnswerHistory.length === 0) return false;

    const last = AnswerHistory.pop();

    // restore state exactly as it was
    EngineState.answers = { ...last.answersSnapshot };
    EngineState.ddxScores = { ...last.ddxSnapshot };
    EngineState.reasoning = [...last.reasoningSnapshot];
    EngineState.currentIndex = last.indexSnapshot;

    return true;
}


/***********************************************************
 * 6) Restart Simulation Completely
 ***********************************************************/
function restartSimulation() {
    // reset engine values
    EngineState.currentIndex = 0;
    EngineState.answers = {};
    EngineState.reasoning = [];

    // reset ddx scores to baseline
    EngineState.ddxScores = {};
    DDX_Data.forEach(d => {
        EngineState.ddxScores[d.id] = d.baselineScore;
    });

    // clear history
    AnswerHistory.length = 0;

    // re-render UI
    renderCurrentQuestion();
    renderReasoning();
    renderDDx();
    updateProgressBar();
}


/***********************************************************
 * 7) Called after every DDx render
 ***********************************************************/
function afterDDXRender() {
    classifyDDXDropdowns();
}