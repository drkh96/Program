// ===============================================
// ui-questions.js
// Questions Card – Dynamic, Elegant, Bilingual
// ===============================================

"use strict";

(function (global) {

  const UI = {

    container: document.querySelector(".questions-card"),
    nextBtn: document.querySelector("#nextBtn"),
    backBtn: document.querySelector("#backBtn"),
    langBtn: document.querySelector("#langBtn"),
    index: 0,

    steps: [],

    init(stepsArray) {
      this.steps = stepsArray;
      this.index = 0;

      this.render();
      this.bindEvents();
      QuestionLanguage.applyToQuestionsCard();
    },

    bindEvents() {

      this.nextBtn.onclick = () => {
        if (this.index < this.steps.length - 1) {
          this.index++;
          this.render();
        }
      };

      this.backBtn.onclick = () => {
        if (this.index > 0) {
          this.index--;
          this.render();
        }
      };

      this.langBtn.onclick = () => {
        QuestionLanguage.toggle();
      };
    },

    // تحديث النص عند تغيير اللغة
    updateQuestionText() {
      this.render();
    },

    // رسم السؤال الحالي
    render() {

      const step = this.steps[this.index];
      const lang = QuestionLanguage.get();

      const qText = (lang === "ar" ? step.question : step.questionEn);

      let html = `
        <div class="question-text">${qText}</div>
        <div class="question-options">
      `;

      if (step.type === "single" || step.type === "multi") {

        Object.keys(step.options).forEach(optId => {
          const opt = step.options[optId];
          const label = (lang === "ar" ? opt.label : opt.labelEn);

          html += `
            <div class="option-item">
              <label>
                <input type="${step.type === 'single' ? 'radio' : 'checkbox'}"
                       name="${step.id}"
                       value="${optId}">
                <span>${label}</span>
              </label>
            </div>
          `;
        });

      } else if (step.type === "text") {

        html += `
          <div class="option-item">
            <input type="text" name="${step.id}" class="text-input">
          </div>
        `;
      }

      html += `</div>`;

      this.container.querySelector(".question-body").innerHTML = html;

      // تحديث زرّي التنقل
      this.backBtn.style.visibility = (this.index === 0 ? "hidden" : "visible");
      this.nextBtn.innerText = (this.index === this.steps.length - 1 ? "Finish" : "Next");
    }

  };

  global.ChestUI = UI;

})(window);