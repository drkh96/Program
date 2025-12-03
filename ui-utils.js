/***********************************************************
 * ui-utils.js
 * All UI-related behaviors + visual enhancements
 * (Dropdowns, animations, color theming helpers, etc.)
 ***********************************************************/


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
        setTimeout(() => box.classList.add("hidden"), 180);
    }
}


/***********************************************************
 * 2) Auto-tag Feature vs Investigation dropdowns
 *    (so the CSS can apply correct color themes)
 ***********************************************************/
function classifyDDXDropdowns() {
    const all = document.querySelectorAll(".ddx-dropdown");

    all.forEach(el => {
        if (el.id.endsWith("_feat")) {
            el.classList.add("feat");       // blue theme
        }
        if (el.id.endsWith("_inv")) {
            el.classList.add("inv");        // purple theme
        }
    });
}


/***********************************************************
 * 3) Call after every DDx render
 ***********************************************************/
function afterDDXRender() {
    classifyDDXDropdowns();   // apply visual classification
}