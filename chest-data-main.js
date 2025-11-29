// ========================================
// chest-data-main.js
// Final merger of all data sections + Global Visibility Filter
// ========================================

"use strict";

(function () {

  const groups  = window.CHEST_DX_GROUPS  || {};
  const dxList  = window.CHEST_DIAGNOSES  || [];

  // ---------------------------
  // ملفات الداتا الرئيسية
  // ---------------------------
  const secMain  = window.CHEST_SECTIONS_MAIN       || [];   // ← main-data.js
  const secPers  = window.CHEST_SECTIONS_PERSONAL   || [];
  const secHpi   = window.CHEST_SECTIONS_HPI        || [];
  const secRos   = window.CHEST_SECTIONS_ROS        || [];
  const secBack  = window.CHEST_SECTIONS_BACKGROUND || [];
  const secPeds  = window.CHEST_SECTIONS_PEDS       || [];

  // ملفات الأقسام الأخرى (لاحقاً)
  const secResp  = window.CHEST_SECTIONS_RESP       || [];
  const secSurg  = window.CHEST_SECTIONS_SURGERY    || [];
  const secObgyn = window.CHEST_SECTIONS_OBGYN      || [];

  // استخراج Personal + CC
  const personalSection = secPers.find((s) => s.id === "personal");
  const ccSection       = secPers.find((s) => s.id === "cc");

  const allSections = [];

  // ===============================
  // دمج الأقسام بالترتيب الصحيح
  // ===============================

  if (personalSection) allSections.push(personalSection);

  if (secMain && secMain.length)
    allSections.push.apply(allSections, secMain);

  if (ccSection) allSections.push(ccSection);

  if (secHpi && secHpi.length)
    allSections.push.apply(allSections, secHpi);

  if (secRos && secRos.length)
    allSections.push.apply(allSections, secRos);

  if (secBack && secBack.length)
    allSections.push.apply(allSections, secBack);

  if (secResp && secResp.length)
    allSections.push.apply(allSections, secResp);

  if (secSurg && secSurg.length)
    allSections.push.apply(allSections, secSurg);

  if (secObgyn && secObgyn.length)
    allSections.push.apply(allSections, secObgyn);

  if (secPeds && secPeds.length)
    allSections.push.apply(allSections, secPeds);

  // ===========================================
  // GLOBAL VISIBILITY FILTER (Smart Auto-Hiding)
  // ===========================================

  window.applyGlobalVisibility = function (sections, answers) {

    const dep = answers["department"];
    const sys = answers["system"];
    const cc  = answers["mainSymptom"];

    sections.forEach(sec => {

      // 1) Hide Surgery / Peds / ObGyn if department = internal
      if (dep === "internal") {
        if (["surgery", "peds", "obgyn"].includes(sec.id)) {
          sec.hidden = true;
          return;
        }
      }

      // 2) Hide Resp + GI if system = cvs
      if (sys === "cvs") {
        if (["resp", "git"].includes(sec.id)) {
          sec.hidden = true;
          return;
        }
      }

      // 3) Hide non–chest-pain sections if CC = chestPain
      if (cc === "chestPain") {
        if (!["hpi", "ros", "pmh", "psh", "dh", "fh", "sh"].includes(sec.id)) {
          sec.hidden = true;
          return;
        }
      }

      // otherwise default visible
      sec.hidden = false;
    });

    return sections;
  };

  // تطبيق الفلتر
  const filteredSections = window.applyGlobalVisibility(
    allSections,
    window.ChestEngine?.state?.answers || {}
  );

  // ===============================
  // الإخراج النهائي
  // ===============================

  window.ChestData = {
    dxGroups:  groups,
    diagnoses: dxList,
    sections:  filteredSections
  };

})();