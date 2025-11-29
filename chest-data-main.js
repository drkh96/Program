// ========================================
// chest-data-main.js
// Final merger of all data sections
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

  // ملفات الأقسام الأخرى
  const secResp  = window.CHEST_SECTIONS_RESP       || [];
  const secSurg  = window.CHEST_SECTIONS_SURGERY    || [];
  const secObgyn = window.CHEST_SECTIONS_OBGYN      || [];

  // استخراج قسم المعلومات الشخصية والـ CC
  const personalSection = secPers.find((s) => s.id === "personal");
  const ccSection       = secPers.find((s) => s.id === "cc");

  // مصفوفة جميع الأقسام النهائية
  const allSections = [];

  // ------------------------------------
  // دمج الأقسام بالترتيب الصحيح
  // ------------------------------------

  // 1) Personal info
  if (personalSection) {
    allSections.push(personalSection);
  }

  // 2) Main-data.js (department + system)
  if (secMain && secMain.length) {
    allSections.push.apply(allSections, secMain);
  }

  // 3) Chief Complaint
  if (ccSection) {
    allSections.push(ccSection);
  }

  // 4) HPI (Chest pain or others later)
  if (secHpi && secHpi.length) {
    allSections.push.apply(allSections, secHpi);
  }

  // 5) ROS
  if (secRos && secRos.length) {
    allSections.push.apply(allSections, secRos);
  }

  // 6) Background (PMH, PSH, FH…)
  if (secBack && secBack.length) {
    allSections.push.apply(allSections, secBack);
  }

  // 7) Respiratory (if internal + resp)
  if (secResp && secResp.length) {
    allSections.push.apply(allSections, secResp);
  }

  // 8) Surgery
  if (secSurg && secSurg.length) {
    allSections.push.apply(allSections, secSurg);
  }

  // 9) Ob/Gyn
  if (secObgyn && secObgyn.length) {
    allSections.push.apply(allSections, secObgyn);
  }

  // 10) Pediatrics
  if (secPeds && secPeds.length) {
    allSections.push.apply(allSections, secPeds);
  }

  // ------------------------------------
  // إخراج البينات النهائية
  // ------------------------------------

  window.ChestData = {
    dxGroups:  groups,
    diagnoses: dxList,
    sections:  allSections
  };

})();