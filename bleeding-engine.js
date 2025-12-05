/* ============================================================
   BLEEDING SIMULATOR ENGINE — V2
   This engine handles:
   - State management
   - Validation
   - Pathway selection
   - Dynamic question progression
   - DDx scoring
   - Reasoning collection
   - Back system
   ============================================================ */

// =====================
// GLOBAL STATE
// =====================
const BleedingState = {
    index: 0,                             // current question index
    answers: {},                          // saved answers
    reasoning: [],                        // reasoning list
    pathway: null,                        // current active pathway
    history: [],                          // for Back
    ddxScores: {},                        // DDx scoring map
    initialized: false                    // indicates first answer
};

// =====================
// INITIALIZE DDx SCORES
// =====================
function initDDXScores() {
    BleedingState.ddxScores = {};
    bleedingDDX.forEach(d => {
        BleedingState.ddxScores[d.id] = d.baseline || 0;
    });
}

// =====================
// SAVE SNAPSHOT BEFORE CHANGE
// =====================
function pushHistory() {
    BleedingState.history.push(JSON.parse(JSON.stringify(BleedingState)));
}

// =====================
// UNDO (BACK button)
// =====================
function bleedUndo() {
    if (BleedingState.history.length === 0) return false;
    const last = BleedingState.history.pop();
    Object.assign(BleedingState, last);
    return true;
}

// =====================
// CHECK VALIDATION
// =====================
function validateAnswer(question, value) {
    if (!question.validate) return true;
    const res = question.validate(value, BleedingState.answers);
    return res === true ? true : res;   // return error message or true
}

// =====================
// GET NEXT QUESTION
// =====================
function getNextQuestion() {

    // If index beyond universal questions → start pathway
    if (BleedingState.index >= bleedingQuestions.length) return null;

    const q = bleedingQuestions[BleedingState.index];

    // Pathway organizer
    if (q.type === "pathway") {
        BleedingState.pathway = q.computePathway(BleedingState.answers);
        BleedingState.index++;
        return getNextQuestion();
    }

    // Skip questions that do not belong to current pathway
    if (q.pathway && q.pathway !== BleedingState.pathway) {
        BleedingState.index++;
        return getNextQuestion();
    }

    return q;
}

// =====================
// APPLY ANSWER
// =====================
function applyBleedingAnswer(question, value) {

    // 1) Validate
    const valid = validateAnswer(question, value);
    if (valid !== true) return { ok: false, error: valid };

    // 2) Save state before changes
    pushHistory();

    // 3) Register answer
    BleedingState.answers[question.id] = value;

    // 4) Reasoning
    if (question.reasoning) {
        const r = question.reasoning(value, BleedingState.answers);
        if (r) BleedingState.reasoning.push(r);
    }

    // 5) Update DDx Scores
    updateDDX(question.id, value);

    // 6) Move to next
    BleedingState.index++;
    BleedingState.initialized = true;

    return { ok: true };
}

// =====================
// UPDATE DDx SCORING
// =====================
function updateDDX(questionId, value) {

    bleedingDDX.forEach(disease => {

        const triggers = disease.triggers || {};
        const trigger = triggers[questionId];

        // CASE 1 — trigger is direct object mapping {yes: +3, no: -1}
        if (trigger && typeof trigger === "object") {
            if (value in trigger) BleedingState.ddxScores[disease.id] += trigger[value];
        }

        // CASE 2 — trigger is age / custom function
        if (typeof triggers.age === "function" && questionId === "age") {
            const age = parseInt(value);
            BleedingState.ddxScores[disease.id] += triggers.age(age);
        }

        // CASE 3 — triggers on chief complaint
        if (trigger && questionId === "chief_complaint") {
            if (value in trigger) BleedingState.ddxScores[disease.id] += trigger[value];
        }
    });
}

// =====================
// EXPORT FUNCTIONS
// =====================
const BleedingEngine = {
    getNextQuestion,
    applyAnswer: applyBleedingAnswer,
    undo: bleedUndo,
    initDDX: initDDXScores,
    state: BleedingState
};