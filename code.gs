/**
 * Islamabad Home Care Services — Google Apps Script backend
 * Deploy: Extensions > Apps Script > Deploy > New deployment > Web app
 *   Execute as: Me | Who has access: Anyone
 * Then paste the Web App URL into CONFIG.backend.googleAppsScriptUrl in script.js.
 */

// ===== CONFIGURATION: replace these two values only =====
const CONFIG = {
  SPREADSHEET_ID: "1CqcsC-mJRNSaQxw5trXER4YQ2aNR7JAuHBbsWT5XSoY",
  SHEET_NAME: "Appointments"
};
// ========================================================

const HEADERS = ["Timestamp", "Form Type", "Full Name", "Phone", "WhatsApp", "Email", "Service",
  "Preferred Date", "Preferred Time", "Location", "Message", "Status", "Rating"];
const FORM_TYPES = ["appointment", "contact", "feedback"];
const REQUIRED = {
  appointment: ["fullName", "phone", "service", "date", "time"],
  contact: ["fullName", "phone", "message"],
  feedback: ["fullName", "message", "rating"]
};

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return respond(false, "Invalid request.");
    let data;
    try { data = JSON.parse(e.postData.contents); } catch (err) { return respond(false, "Invalid JSON."); }
    if (data.website) return respond(false, "Rejected."); // honeypot

    const type = clean(data.formType, 20).toLowerCase();
    if (FORM_TYPES.indexOf(type) === -1) return respond(false, "Unknown form type.");

    const rec = {
      fullName: clean(data.fullName, 100), phone: clean(data.phone, 20), whatsapp: clean(data.whatsapp, 20),
      email: clean(data.email, 120), service: clean(data.service, 120), date: clean(data.date, 20),
      time: clean(data.time, 10), rating: clean(data.rating, 1), location: clean(data.location, 200),
      message: clean((data.subject ? data.subject + ": " : "") + (data.message || ""), 2000)
    };

    const missing = REQUIRED[type].filter(function (k) { return !rec[k]; });
    if (missing.length) return respond(false, "Missing fields: " + missing.join(", "));
    if (rec.phone && !/^\+?[0-9\s\-]{10,15}$/.test(rec.phone)) return respond(false, "Invalid phone.");
    if (type === "feedback" && !/^[1-5]$/.test(rec.rating)) return respond(false, "Invalid rating.");
    if (rec.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rec.email)) return respond(false, "Invalid email.");

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      getSheet().appendRow([new Date(), type, rec.fullName, rec.phone, rec.whatsapp, rec.email, rec.service,
        rec.date, rec.time, rec.location, rec.message, "New", rec.rating]);
    } finally { lock.releaseLock(); }

    return respond(true, "Saved.");
  } catch (err) {
    console.error(err);
    return respond(false, "Server error.");
  }
}

function doGet() { return respond(false, "POST requests only."); }

function getSheet() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  let sh = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.insertSheet(CONFIG.SHEET_NAME);
  if (sh.getLastRow() === 0) { sh.appendRow(HEADERS); sh.setFrozenRows(1); }
  return sh;
}

// Strips HTML, limits length, and neutralises spreadsheet formula injection
function clean(v, max) {
  let s = (v === undefined || v === null ? "" : String(v)).replace(/<[^>]*>/g, "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);
  if (/^[=+\-@]/.test(s) && !/^\+?[0-9\s\-]+$/.test(s)) s = "'" + s;
  return s;
}

function respond(success, message) {
  return ContentService.createTextOutput(JSON.stringify({ success: success, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}
