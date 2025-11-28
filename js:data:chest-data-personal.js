// ========================================
// chest-data-personal.js
// Personal data + chief complaint
// ========================================

"use strict";

window.CHEST_SECTIONS_PERSONAL = [
  {
    id: "personal",
    label: "البيانات الشخصية",
    steps: [
      {
        id: "name",
        sectionId: "personal",
        sectionLabel: "Personal Data",
        question: "ما اسم المريض؟ (لا يؤثر على التشخيص مباشرة)",
        type: "text",
        required: false,
        placeholder: "اكتب اسم المريض هنا"
      },
      {
        id: "ageText",
        sectionId: "personal",
        sectionLabel: "Personal Data",
        question: "كم عمر المريض؟ (بالسنوات، نصّياً)",
        type: "text",
        required: true,
        placeholder: "مثال: 55 سنة"
        // ⚠️ التأثير على التشخيص يكون من خلال الـ engine (تحليل النص إلى فئات عمرية)
      },
      {
        id: "sex",
        sectionId: "personal",
        sectionLabel: "Personal Data",
        question: "ما جنس المريض؟",
        type: "single",
        required: true,
        options: {
          male: {
            label: "ذكر",
            dxAdd: ["IHD", "MI", "ACS"],
            dxRemove: [],
            reasoning: [
              {
                text: "كون المريض ذكراً في منتصف العمر يزيد احتمال مرض الشريان التاجي.",
                diseases: ["IHD", "MI", "ACS"]
              }
            ]
          },
          female: {
            label: "أنثى",
            dxAdd: [],
            dxRemove: [],
            reasoning: [
              {
                text: "الإناث قبل سن اليأس أقل عرضة إحصائياً لمرض الشريان التاجي مقارنة بالذكور.",
                diseases: ["IHD"]
              }
            ]
          }
        }
      }
    ]
  },
  {
    id: "cc",
    label: "الشكوى الرئيسية",
    steps: [
      {
        id: "mainSymptom",
        sectionId: "cc",
        sectionLabel: "Chief Complaint",
        question: "ما هي الشكوى الرئيسية؟",
        type: "text",
        required: true,
        placeholder: "مثال: ألم في الصدر عند الجهد"
        // ⚠️ رح نستخدمها بالـ engine لتقريب نوع الألم (chest pain / dyspnea / syncope …)
      },
      {
        id: "ccDuration",
        sectionId: "cc",
        sectionLabel: "Chief Complaint",
        question: "منذ متى بدأت الشكوى الرئيسية؟",
        type: "text",
        required: true,
        placeholder: "مثال: منذ 3 ساعات / منذ يومين"
        // ⚠️ رح نستخدم الفترة (حاد/مزمن) في المنطق التشخيصي بالـ engine
      }
    ]
  }
];