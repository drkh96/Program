/***********************************************************
 * BLEEDING TENDENCY — ENGINE (FULL UNIFIED VERSION)
 ***********************************************************/

/* =========================================================
   ENGINE STATE — holds all progress and scores
   ========================================================= */
const EngineState = {
    currentIndex: 0,       // which question we are on
    answers: {},           // user answers
    reasoning: [],         // accumulated reasoning
    ddxScores: {},         // disease scores
    completed: false
};


/* =========================================================
   INITIALIZE DDx SCORES FROM DDX_Data
   ========================================================= */
function initDDxScores() {
    DDX_Data.forEach(d => {
        EngineState.ddxScores[d.id] = d.baselineScore || 0;
    });
}

initDDxScores();


/***********************************************************
 * PROCESS ANSWER
 * This function:
 *  - Saves the answer
 *  - Parses it (if question has parser)
 *  - Generates reasoning
 *  - Updates DDx scores
 *  - Moves to next question
 ***********************************************************/
function handleAnswer(questionId, value) {

    const question = Questions.find(q => q.id === questionId);
    if (!question) return;

    // Parse if needed
    let parsedValue = value;
    if (question.parse) {
        parsedValue = question.parse(value);
    }

    // Save answer
    EngineState.answers[questionId] = parsedValue;

    // Generate reasoning
    if (question.reasoning) {
        const r = question.reasoning(parsedValue);
        if (r) {
            EngineState.reasoning.push({
                from: questionId,
                text: r
            });
        }
    }

    // Update DDx based on this question
    updateDDxFromQuestion(questionId, parsedValue);

    // Go to next question
    EngineState.currentIndex++;
}


/***********************************************************
 * UPDATE DDx SCORES BASED ON EACH ANSWER
 ***********************************************************/
function updateDDxFromQuestion(qid, value) {

    /* AGE EFFECTS ---------------------------------------- */
    if (qid === "age") {
        let age = value;
        if (!age) return;

        if (age <= 14) {
            adjust("hemA", +3);
            adjust("hemB", +3);
            adjust("itp", +2);
            adjust("vwf", +2);
            adjust("drugPlatelet", -2);
            adjust("liverFailure", -2);
        }
        else if (age <= 40) {
            adjust("vwf", +2);
            adjust("itp", +1);
        }
        else if (age <= 65) {
            adjust("liverFailure", +2);
            adjust("warfarin", +2);
        }
        else {
            adjust("warfarin", +3);
            adjust("liverFailure", +2);
            adjust("leukemia", +2);
            adjust("hemA", -3);
            adjust("hemB", -3);
        }
    }

    /* SEX EFFECTS ---------------------------------------- */
    if (qid === "sex") {
        if (value === "male") {
            adjust("hemA", +2);
            adjust("hemB", +2);
        }
        if (value === "female") {
            adjust("vwf", +2);
        }
    }

    /* OCCUPATION EFFECTS ------------------------------------ */
    if (qid === "occupation") {
        switch(value) {
            case "retired":
                adjust("warfarin", +2);
                adjust("liverFailure", +1);
                break;
            case "manual":
                adjust("epistaxisLocal", +1);
                break;
        }
    }

    /* CHIEF COMPLAINT EFFECTS ------------------------------- */
    if (qid === "chiefComplaint") {
        switch(value) {
            case "bruising":
            case "noseGumBleeding":
            case "smallCuts":
                adjust("vwf", +2);
                adjust("itp", +2);
                adjust("drugPlatelet", +1);
                adjust("hemA", -2);
                adjust("hemB", -2);
                break;

            case "jointBleeding":
                adjust("hemA", +3);
                adjust("hemB", +3);
                adjust("itp", -3);
                adjust("vwf", -2);
                break;

            case "postSurgery":
                adjust("vwf", +1);
                adjust("hemA", +1);
                adjust("hemB", +1);
                break;

            case "recurrentSpot":
                adjust("epistaxisLocal", +3);
                break;

            case "giBleeding":
                adjust("pepticUlcer", +2);
                adjust("liverFailure", +1);
                adjust("warfarin", +1);
                break;
        }
    }

    /* DURATION EFFECT --------------------------------------- */
    if (qid === "duration") {
        switch(value) {
            case "sinceChildhood":
                adjust("hemA", +3);
                adjust("hemB", +3);
                adjust("vwf", +2);
                break;

            case "months":
                adjust("itp", +1);
                adjust("leukemia", +1);
                break;

            case "days":
            case "sudden":
                adjust("dic", +3);
                adjust("warfarin", +1);
                break;
        }
    }

    /* BLEEDING SITE EFFECT (Entry Question A+) --------------- */
    if (qid === "bleedingSite") {
        switch(value) {
            case "mucosal":
            case "skinBruising":
            case "smallCuts":
                adjust("vwf", +2);
                adjust("itp", +2);
                adjust("drugPlatelet", +1);
                adjust("hemA", -2);
                break;

            case "joint":
                adjust("hemA", +3);
                adjust("hemB", +3);
                adjust("factor13", +1);
                break;

            case "muscle":
                adjust("hemA", +2);
                adjust("hemB", +2);
                adjust("factor13", +1);
                break;

            case "singleSpot":
                adjust("epistaxisLocal", +3);
                break;

            case "postProcedure":
                adjust("vwf", +1);
                adjust("hemA", +1);
                adjust("hemB", +1);
                break;

            case "gi":
                adjust("pepticUlcer", +2);
                adjust("liverFailure", +1);
                break;

            case "urine":
                adjust("kidneyFail", +2);
                break;

            case "resp":
                adjust("dic", +1);
                break;
        }
    }
}


/***********************************************************
 * UTILITY: ADJUST DDx SCORE
 ***********************************************************/
function adjust(id, amount) {
    EngineState.ddxScores[id] += amount;
}