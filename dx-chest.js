// ========================================
// dx-chest.js
// التشخيصات التفريقية لألم الصدر فقط
// ========================================

"use strict";

(function (global) {

  global.CHEST_PAIN_DX = [

    // ============================================
    // HEART — أمراض القلب
    // ============================================
    {
      id: "IHD",
      label: "مرض قلبي إقفاري (IHD)",
      labelEn: "Ischemic Heart Disease",
      group: "chestPain",
      keyMissingFeatures: [
        "تخطيط القلب ECG",
        "تحليل التروبونين",
        "اختبار الجهد أو CT للشرايين"
      ]
    },
    {
      id: "StableAngina",
      label: "ذبحة صدرية مستقرة",
      labelEn: "Stable Angina",
      group: "chestPain",
      keyMissingFeatures: [
        "ألم مع الجهد",
        "تخفيف الألم بالراحة",
        "تخطيط طبي/اختبار جهد"
      ]
    },
    {
      id: "UnstableAngina",
      label: "ذبحة صدرية غير مستقرة",
      labelEn: "Unstable Angina",
      group: "chestPain",
      keyMissingFeatures: [
        "ECG تغييرات نقص تروية",
        "تروبونين طبيعي أو مرتفع قليلاً",
        "قسطرة تشخيصية"
      ]
    },
    {
      id: "MI",
      label: "احتشاء عضلة القلب",
      labelEn: "Myocardial Infarction",
      group: "chestPain",
      keyMissingFeatures: [
        "تخطيط القلب",
        "تروبونين عالي",
        "تخطيط صدى للقلب"
      ]
    },
    {
      id: "Myocarditis",
      label: "التهاب عضلة القلب",
      labelEn: "Myocarditis",
      group: "chestPain",
      keyMissingFeatures: [
        "ارتفاع إنزيمات القلب",
        "التهاب فيروسي سابق",
        "صدى قلب يظهر خلل"
      ]
    },
    {
      id: "Pericarditis",
      label: "التهاب التامور الحاد",
      labelEn: "Acute Pericarditis",
      group: "chestPain",
      keyMissingFeatures: [
        "احتكاك التامور",
        "ارتفاع ST منتشر",
        "وجود انصباب تاموري"
      ]
    },
    {
      id: "MVP",
      label: "تدلي الصمام الميتزالي",
      labelEn: "Mitral Valve Prolapse",
      group: "chestPain",
      keyMissingFeatures: [
        "صوت Click",
        "صدى قلب",
        "أعراض خفقان"
      ]
    },

    // ============================================
    // AORTA — الأبهر
    // ============================================
    {
      id: "AorticAneurysm",
      label: "تمدد الشريان الأبهر",
      labelEn: "Aortic Aneurysm",
      group: "chestPain",
      keyMissingFeatures: [
        "CTA",
        "تصوير الأوعية",
        "ألم الظهر"
      ]
    },
    {
      id: "AorticDissection",
      label: "تسلخ الشريان الأبهر",
      labelEn: "Aortic Dissection",
      group: "chestPain",
      keyMissingFeatures: [
        "CTA عاجل",
        "اختلاف ضغط الدم بين الذراعين",
        "ألم ماحق إلى الظهر"
      ]
    },

    // ============================================
    // LUNG — الرئة
    // ============================================
    {
      id: "Pneumonia",
      label: "التهاب رئوي",
      labelEn: "Pneumonia",
      group: "chestPain",
      keyMissingFeatures: [
        "أشعة صدر",
        "ارتفاع الحرارة",
        "ارتفاع كريات الدم البيضاء"
      ]
    },
    {
      id: "PulmonaryInfarction",
      label: "احتشاء رئوي",
      labelEn: "Pulmonary Infarction",
      group: "chestPain",
      keyMissingFeatures: [
        "CTA",
        "D-dimer",
        "أعراض جلطة سابقة"
      ]
    },

    // ============================================
    // PLEURA — غشاء الجنب
    // ============================================
    {
      id: "Pleurisy",
      label: "التهاب الجنبة (Pleurisy)",
      labelEn: "Pleurisy",
      group: "chestPain",
      keyMissingFeatures: [
        "ألم يزداد مع التنفس",
        "احتكاك جنب",
        "صور أشعة"
      ]
    },
    {
      id: "Pneumothorax",
      label: "استرواح الصدر",
      labelEn: "Pneumothorax",
      group: "chestPain",
      keyMissingFeatures: [
        "انخماص الرئة بالأشعة",
        "نقص أصوات التنفس",
        "انحراف القصبة"
      ]
    },

    // ============================================
    // PULMONARY ARTERY — الشريان الرئوي
    // ============================================
    {
      id: "PEMajor",
      label: "انسداد رئوي كبير",
      labelEn: "Pulmonary Embolism (Major)",
      group: "chestPain",
      keyMissingFeatures: [
        "D-dimer",
        "CTA للرئة",
        "جلطة بالأطراف"
      ]
    },

    // ============================================
    // TRACHEA — القصبة الهوائية
    // ============================================
    {
      id: "Tracheitis",
      label: "التهاب القصبة الهوائية",
      labelEn: "Tracheitis",
      group: "chestPain",
      keyMissingFeatures: [
        "سعال شديد",
        "ألم في منتصف الصدر",
        "أصوات تنفس غير طبيعية"
      ]
    },
    {
      id: "TrachealSpasm",
      label: "تشنج القصبة الهوائية",
      labelEn: "Tracheal Spasm",
      group: "chestPain",
      keyMissingFeatures: [
        "صافرة تنفس",
        "ضيق نفس",
        "استجابة سريعة لموسع القصبات"
      ]
    },

    // ============================================
    // ESOPHAGUS — المريء
    // ============================================
    {
      id: "Esophagitis",
      label: "التهاب المريء",
      labelEn: "Esophagitis",
      group: "chestPain",
      keyMissingFeatures: [
        "حرقة",
        "ألم بعد الطعام",
        "استجابة لمضادات الحموضة"
      ]
    },
    {
      id: "EsophagealSpasm",
      label: "تشنج المريء",
      labelEn: "Esophageal Spasm",
      group: "chestPain",
      keyMissingFeatures: [
        "ألم يشبه الذبحة",
        "ارتباط بالطعام",
        "تحسن مع النترات"
      ]
    },

    // ============================================
    // INTERCOSTAL MUSCLES — عضلات بين الأضلاع
    // ============================================
    {
      id: "MuscleInjury",
      label: "إصابة عضلية",
      labelEn: "Intercostal Muscle Injury",
      group: "chestPain",
      keyMissingFeatures: [
        "ألم مع الحركة",
        "تحسن مع الراحة",
        "لا توجد تغيرات قلبية"
      ]
    },
    {
      id: "MuscleSpasm",
      label: "تشنج عضلي",
      labelEn: "Muscle Spasm",
      group: "chestPain",
      keyMissingFeatures: [
        "ألم موضعي",
        "يزداد مع اللمس",
        "لا يوجد ضيق نفس"
      ]
    },

    // ============================================
    // RIBS — الضلوع
    // ============================================
    {
      id: "RibFracture",
      label: "كسر في الأضلاع",
      labelEn: "Rib Fracture",
      group: "chestPain",
      keyMissingFeatures: [
        "ألم شديد موضعي",
        "تاريخ رضّ",
        "أشعة الصدر"
      ]
    },
    {
      id: "Osteoarthritis",
      label: "التهاب مفصل ضلعي غضروفي",
      labelEn: "Costovertebral Osteoarthritis",
      group: "chestPain",
      keyMissingFeatures: [
        "ألم مع الحركة",
        "ألم موضعي",
        "صور شعاعية"
      ]
    },
    {
      id: "Costochondritis",
      label: "التهاب الغضروف الضلعي",
      labelEn: "Costochondritis",
      group: "chestPain",
      keyMissingFeatures: [
        "ألم عند الضغط على جدار الصدر",
        "لا توجد علامات قلبية",
        "استجابة لمضادات الالتهاب"
      ]
    },

    // ============================================
    // NERVES — الأعصاب
    // ============================================
    {
      id: "HerpesZoster",
      label: "الهربس العصبي",
      labelEn: "Herpes Zoster",
      group: "chestPain",
      keyMissingFeatures: [
        "طفح جلدي",
        "ألم عصبي موضعي",
        "حرقان"
      ]
    }

  ]; // END CHEST_PAIN_DX

})(window);