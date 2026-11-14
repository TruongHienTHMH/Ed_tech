/**
 * MODULE 10: HỘP THOẠI QUẢN TRỊ GÓI COMBO & BẢNG GIÁ (PACKAGE PRICING MODAL)
 */
function showPackageModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName("packages_pricing")) setupPackagesPricingTab(ss);

  var template = createModalTemplate("PackageModal");
  var html = template.evaluate().setWidth(620).setHeight(680).setTitle("📦 Quản Trị Gói Combo & Bảng Giá - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "📦 Quản Trị Gói Combo & Bảng Giá");
}

function savePackageFromModal(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("packages_pricing") || (setupPackagesPricingTab(ss), ss.getSheetByName("packages_pricing"));

  var name = (data.name || "").toString().trim();
  var packageId = (data.package_id || "").toString().trim();
  if (!name || !packageId) throw new Error("Tên gói và Mã gói không được để trống.");

  var id = (data.id || ("pkg-" + packageId)).toString().trim();
  var salePrice = Number(data.sale_price) || 0;
  var origPrice = Number(data.original_price) || salePrice;
  var sortOrder = Number(data.sort_order) || sheet.getLastRow();

  var rowData = [
    sanitizeFormula(id), sanitizeFormula(packageId), sanitizeFormula(name), origPrice, salePrice,
    sanitizeFormula(data.badge),
    sanitizeFormula(data.features_list),
    data.is_popular === true,
    data.is_active === true,
    sortOrder
  ];

  // Kiểm tra UPDATE nếu trùng package_id hoặc id
  var lastRow = sheet.getLastRow();
  var foundRow = 0;
  if (lastRow > 1) {
    var existing = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    for (var i = 0; i < existing.length; i++) {
      if (existing[i][0] === id || existing[i][1] === packageId) {
        foundRow = i + 2;
        break;
      }
    }
  }

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, 10).setValues([rowData]);
    sheet.getRange(foundRow, 4, 1, 2).setNumberFormat("#,##0 \"đ\"");
    ss.toast("🎉 Đã cập nhật gói combo: " + name, "DataWithLy CMS", 5);
  } else {
    sheet.appendRow(rowData);
    var newR = sheet.getLastRow();
    sheet.getRange(newR, 4, 1, 2).setNumberFormat("#,##0 \"đ\"");
    ss.toast("🎉 Đã thêm mới gói combo: " + name, "DataWithLy CMS", 5);
  }

  return { success: true, id: id, package_id: packageId, name: name };
}

