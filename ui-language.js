// ===============================================
// ui-language.js
// Language Controller (Questions Card Only)
// ===============================================

"use strict";

(function (global) {

  const Lang = {
    current: "ar", // default Arabic for Questions Card

    // تغيير اللغة بين عربي ↔ إنجليزي
    toggle() {
      this.current = (this.current === "ar" ? "en" : "ar");
      this.applyToQuestionsCard();
    },

    // الحصول على اللغة الحالية
    get() {
      return this.current;
    },

    // تطبيق إعدادات اللغة على بطاقة الأسئلة فقط
    applyToQuestionsCard() {
      const card = document.querySelector(".questions-card");
      if (!card) return;

      if (this.current === "ar") {
        card.setAttribute("dir", "rtl");
        card.classList.remove("lang-en");
        card.classList.add("lang-ar");
      } else {
        card.setAttribute("dir", "ltr");
        card.classList.remove("lang-ar");
        card.classList.add("lang-en");
      }

      // تحديث النصوص عبر المحرك
      if (global.ChestUI && global.ChestUI.updateQuestionText) {
        global.ChestUI.updateQuestionText();
      }
    }
  };

  global.QuestionLanguage = Lang;

})(window);