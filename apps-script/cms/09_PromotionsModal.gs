/**
 * MODULE 09: HỘP THOẠI QUẢN TRỊ KHUYẾN MÃI (PROMOTIONS MODAL DIALOG)
 */
function showPromotionsModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var courseSheet = ss.getSheetByName("courses") || (setupCoursesTab(ss), ss.getSheetByName("courses"));
  var promoSheet = ss.getSheetByName("promotions") || (setupPromotionsTab(ss), ss.getSheetByName("promotions"));

  var coursesList = [];
  var lastRow = courseSheet.getLastRow();
  if (lastRow > 1) {
    var vals = courseSheet.getRange(2, 1, lastRow - 1, 2).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i][0] && vals[i][1]) {
        coursesList.push({ id: vals[i][0].toString().trim(), title: vals[i][1].toString().trim() });
      }
    }
  }

  var existingCodes = [];
  var promoLastRow = promoSheet.getLastRow();
  if (promoLastRow > 1) {
    var pVals = promoSheet.getRange(2, 2, promoLastRow - 1, 1).getValues();
    for (var p = 0; p < pVals.length; p++) {
      if (pVals[p][0]) existingCodes.push(pVals[p][0].toString().trim().toUpperCase());
    }
  }

  var template = createModalTemplate("PromotionsModal");
  template.coursesList = coursesList;
  template.existingCodes = existingCodes;
  var html = template.evaluate().setWidth(620).setHeight(720).setTitle("🏷️ Quản Trị Khuyến Mãi & Flash Sale - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "🏷️ Quản Trị Khuyến Mãi & Flash Sale");
}

function addNewPromotionFromModal(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("promotions") || (setupPromotionsTab(ss), ss.getSheetByName("promotions"));

  var code = (data.code || "").toString().trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  var title = (data.title || "").toString().trim();
  if (!code || !title) throw new Error("Mã code và Tiêu đề khuyến mãi không được để trống.");

  var type = (data.discount_type || "PERCENT").toString().trim();
  var val = Number(data.discount_value) || 0;
  var pId = (data.id || "promo-" + code.toLowerCase()).toString().trim();
  var badge = (data.badge || "").toString().trim();
  if (!badge) {
    badge = type === "PERCENT" ? "Giảm " + val + "%" : "Giảm " + (val / 1000).toLocaleString() + "K";
  }

  var rowData = [
    sanitizeFormula(pId), sanitizeFormula(code), sanitizeFormula(title), sanitizeFormula(type), val,
    sanitizeFormula(data.start_date), sanitizeFormula(data.end_date),
    sanitizeFormula(data.applicable_courses || "ALL"),
    sanitizeFormula(badge), data.is_active === true, Number(data.sort_order) || sheet.getLastRow()
  ];

  // Kiểm tra UPDATE nếu trùng mã code hoặc ID
  var lastRow = sheet.getLastRow();
  var foundRow = 0;
  if (lastRow > 1) {
    var existing = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    for (var i = 0; i < existing.length; i++) {
      var rId = existing[i][0] ? existing[i][0].toString().trim().toLowerCase() : "";
      var rCode = existing[i][1] ? existing[i][1].toString().trim().toUpperCase() : "";
      if (rId === pId.toLowerCase() || rCode === code) {
        foundRow = i + 2;
        break;
      }
    }
  }

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, 11).setValues([rowData]);
    if (type === "FIXED_VND") {
      sheet.getRange(foundRow, 5).setNumberFormat("#,##0 \"đ\"");
    } else {
      sheet.getRange(foundRow, 5).setNumberFormat("0\"%\"");
    }
    ss.toast("🎉 Đã cập nhật mã khuyến mãi: " + code, "DataWithLy CMS", 5);
  } else {
    sheet.appendRow(rowData);
    var newRow = sheet.getLastRow();
    if (type === "FIXED_VND") {
      sheet.getRange(newRow, 5).setNumberFormat("#,##0 \"đ\"");
    } else {
      sheet.getRange(newRow, 5).setNumberFormat("0\"%\"");
    }
    ss.toast("🎉 Đã tạo mã khuyến mãi: " + code, "DataWithLy CMS", 5);
  }
  return { success: true, id: pId, code: code, badge: badge };
}
