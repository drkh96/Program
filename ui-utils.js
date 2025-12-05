/* ============================================================
   UI UTILITIES — GLOBAL HELPER FUNCTIONS
   Used by bleeding-ui.js for:
   - Smooth collapsing
   - DOM helpers
   - Scrolling
   ============================================================ */


/* ------------------------------------------------------------
   COLLAPSE ELEMENT (open/close with smooth animation)
------------------------------------------------------------ */
function toggleCollapse(element) {
    if (!element) return;

    if (element.classList.contains("open")) {
        element.style.maxHeight = "0px";
        element.classList.remove("open");
    } else {
        element.style.maxHeight = element.scrollHeight + "px";
        element.classList.add("open");
    }
}


/* ------------------------------------------------------------
   AUTO-SCROLL TO ELEMENT
------------------------------------------------------------ */
function scrollToView(el, offset = 120) {
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
}


/* ------------------------------------------------------------
   CREATE ELEMENT WITH CLASS + TEXT
------------------------------------------------------------ */
function makeEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.innerText = text;
    return el;
}


/* ------------------------------------------------------------
   CLEAR CHILDREN
------------------------------------------------------------ */
function clear(el) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
}


/* ------------------------------------------------------------
   ADD CLICK SOUND (OPTIONAL)
------------------------------------------------------------ */
function clickSound() {
    // You can add a sound file if desired
    // const audio = new Audio("click.mp3");
    // audio.play();
}


/* ------------------------------------------------------------
   EXPORT UTILITIES
------------------------------------------------------------ */
const UIUtils = {
    toggleCollapse,
    scrollToView,
    makeEl,
    clear,
    clickSound,
};