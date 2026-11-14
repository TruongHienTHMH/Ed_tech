/**
 * MODULE 12: HỘP THOẠI CÂU HỎI THƯỜNG GẶP (FAQ MODAL DIALOG)
 */
function showFaqModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName("faqs")) setupFaqsTab(ss);

  var template = createModalTemplate("FaqModal");
  var html = template.evaluate().setWidth(580).setHeight(620).setTitle("❓ Thêm Câu Hỏi Thường Gặp - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "❓ Thêm Câu Hỏi Thường Gặp");
}

function saveFaqFromModal(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("faqs") || (setupFaqsTab(ss), ss.getSheetByName("faqs"));

  var q = (data.question || "").toString().trim();
  var a = (data.answer || "").toString().trim();
  if (!q || !a) throw new Error("Câu hỏi và Câu trả lời không được để trống.");

  var nextId = (data.id || ("faq-" + sheet.getLastRow())).toString().trim();
  var category = (data.category || "CHUNG").toString().trim();
  var sortOrder = Number(data.sort_order) || sheet.getLastRow();

  sheet.appendRow([
    sanitizeFormula(nextId),
    sanitizeFormula(category),
    sanitizeFormula(q),
    sanitizeFormula(a),
    data.is_active === true,
    sortOrder
  ]);

  ss.toast("🎉 Đã thêm câu hỏi FAQ: " + q.substring(0, 30) + "...", "DataWithLy CMS", 5);
  return { success: true, id: nextId, question: q };
}

