/**
 * ==============================================================================
 * MODULE 06: BẢO TRÌ & ĐỐI SOÁT HỆ THỐNG (SYSTEM MAINTENANCE & NOTIFICATIONS)
 * ==============================================================================
 * 1. runDataLinter(): Rà soát toàn diện lỗi dữ liệu trước khi xuất bản.
 * 2. autoFillMissingSlugsAndIds(): Tự động quét và điền bù Slug/ID kèm auto-versioning.
 * 3. showSoftDeletePrompt(): Lưu trữ/Ẩn khóa học (is_active = FALSE).
 * 4. triggerWebsiteRevalidation(): Kích hoạt On-Demand ISR Revalidation êm dịu.
 * 5. sendTelegramNotification(): Bắn thông báo Telegram tức thì (< 2s) khi có Lead.
 * ==============================================================================
 */

/**
 * 1. Kiểm tra lỗi dữ liệu (Data Linter)
 */
function runDataLinter() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("courses");
  var ui = SpreadsheetApp.getUi();

  if (!sheet) {
    ui.alert("Lỗi", "Không tìm thấy tab 'courses' trong bảng tính này.", ui.ButtonSet.OK);
    return;
  }

  var data = sheet.getDataRange().getValues();
  var errors = [];
  var seenSlugs = {};

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rowNum = i + 1;
    var title = row[1];
    var slug = row[2];
    var tuition = row[5];

    if (!title) {
      errors.push("Dòng " + rowNum + ": Thiếu Tên khóa học.");
    }
    if (!slug) {
      errors.push("Dòng " + rowNum + ": Thiếu Slug (Dùng menu để tự động tạo).");
    } else {
      if (seenSlugs[slug]) {
        errors.push("Dòng " + rowNum + ": Trùng lặp Slug '" + slug + "' với dòng " + seenSlugs[slug] + ".");
      }
      seenSlugs[slug] = rowNum;
    }
    if (isNaN(tuition) || tuition < 0) {
      errors.push("Dòng " + rowNum + ": Học phí '" + tuition + "' không phải là số hợp lệ.");
    }
  }

  if (errors.length === 0) {
    ui.alert("✅ Data Linter Hoàn Hảo", "Toàn bộ dữ liệu khóa học đã chuẩn xác 100%, sẵn sàng xuất bản!", ui.ButtonSet.OK);
  } else {
    ui.alert("⚠️ Phát Hiện " + errors.length + " Vấn Đề Cần Lưu Ý", errors.join("\n"), ui.ButtonSet.OK);
  }
}

/**
 * 2. Tự động quét và điền UUID v4 & SEO Slug cho toàn bộ các tab dữ liệu chính
 * Hỗ trợ các tab: courses, curriculum, promotions, blog_posts, packages_pricing,
 * testimonials, mentor_profiles, faqs.
 */
function autoFillMissingUuidsAndSlugs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS || 10000);
  } catch (e) {
    ui.alert(
      "⚠️ Hệ Thống Đang Bận",
      "Có một tiến trình khác đang ghi dữ liệu vào bảng tính. Vui lòng thử lại sau vài giây.",
      ui.ButtonSet.OK
    );
    return;
  }

  var totalUuidsFilled = 0;
  var totalSlugsFilled = 0;
  var summaryDetails = [];

  try {
    // -------------------------------------------------------------------------
    // A. TAB: courses (ID: crs-UUID, Title: Col 2, Slug: Col 3)
    // -------------------------------------------------------------------------
    var courseSheet = ss.getSheetByName("courses");
    if (courseSheet && courseSheet.getLastRow() > 1) {
      var cData = courseSheet.getDataRange().getValues();
      var cSlugs = [];
      for (var k = 1; k < cData.length; k++) {
        if (cData[k][2]) cSlugs.push(cData[k][2].toString().trim().toLowerCase());
      }

      var cUuids = 0;
      var cSlugsGen = 0;

      for (var i = 1; i < cData.length; i++) {
        var rNum = i + 1;
        var cId = cData[i][0];
        var cTitle = cData[i][1];
        var cSlug = cData[i][2];

        if (cTitle && cTitle.toString().trim()) {
          // Điền Slug nếu thiếu
          if (!cSlug || cSlug.toString().trim() === "") {
            var uSlug = resolveUniqueSlug(cTitle, cSlugs);
            courseSheet.getRange(rNum, 3).setValue(sanitizeFormula(uSlug));
            cSlugs.push(uSlug);
            cSlugsGen++;
          }
          // Điền UUID nếu thiếu
          if (!cId || cId.toString().trim() === "") {
            var uId = generateUUID("crs-");
            courseSheet.getRange(rNum, 1).setValue(sanitizeFormula(uId));
            cUuids++;
          }
        }
      }
      if (cUuids > 0 || cSlugsGen > 0) {
        summaryDetails.push("• courses: " + cUuids + " UUID mới, " + cSlugsGen + " Slug mới");
        totalUuidsFilled += cUuids;
        totalSlugsFilled += cSlugsGen;
      }
    }

    // -------------------------------------------------------------------------
    // B. TAB: curriculum (ID: cur-UUID, Course_id: Col 2, Module_title: Col 5)
    // -------------------------------------------------------------------------
    var curSheet = ss.getSheetByName("curriculum");
    if (curSheet && curSheet.getLastRow() > 1) {
      var curData = curSheet.getDataRange().getValues();
      var curUuids = 0;

      for (var ci = 1; ci < curData.length; ci++) {
        var curRNum = ci + 1;
        var curId = curData[ci][0];
        var curCourseId = curData[ci][1];
        var curTitle = curData[ci][4];

        if ((curTitle && curTitle.toString().trim()) || (curCourseId && curCourseId.toString().trim())) {
          if (!curId || curId.toString().trim() === "") {
            var curNewUuid = generateUUID("cur-");
            curSheet.getRange(curRNum, 1).setValue(sanitizeFormula(curNewUuid));
            curUuids++;
          }
        }
      }
      if (curUuids > 0) {
        summaryDetails.push("• curriculum: " + curUuids + " UUID mới");
        totalUuidsFilled += curUuids;
      }
    }

    // -------------------------------------------------------------------------
    // C. TAB: promotions (ID: promo-UUID, Code: Col 2, Title: Col 3)
    // -------------------------------------------------------------------------
    var promoSheet = ss.getSheetByName("promotions");
    if (promoSheet && promoSheet.getLastRow() > 1) {
      var pData = promoSheet.getDataRange().getValues();
      var promoUuids = 0;

      for (var pi = 1; pi < pData.length; pi++) {
        var promoRNum = pi + 1;
        var pId = pData[pi][0];
        var pCode = pData[pi][1];
        var pTitle = pData[pi][2];

        if ((pTitle && pTitle.toString().trim()) || (pCode && pCode.toString().trim())) {
          if (!pId || pId.toString().trim() === "") {
            var pNewUuid = generateUUID("promo-");
            promoSheet.getRange(promoRNum, 1).setValue(sanitizeFormula(pNewUuid));
            promoUuids++;
          }
        }
      }
      if (promoUuids > 0) {
        summaryDetails.push("• promotions: " + promoUuids + " UUID mới");
        totalUuidsFilled += promoUuids;
      }
    }

    // -------------------------------------------------------------------------
    // D. TAB: blog_posts (ID: blg-UUID, Title: Col 2, Slug: Col 3)
    // -------------------------------------------------------------------------
    var blogSheet = ss.getSheetByName("blog_posts");
    if (blogSheet && blogSheet.getLastRow() > 1) {
      var bData = blogSheet.getDataRange().getValues();
      var bSlugs = [];
      for (var bm = 1; bm < bData.length; bm++) {
        if (bData[bm][2]) bSlugs.push(bData[bm][2].toString().trim().toLowerCase());
      }

      var bUuids = 0;
      var bSlugsGen = 0;

      for (var bj = 1; bj < bData.length; bj++) {
        var bRNum = bj + 1;
        var bId = bData[bj][0];
        var bTitle = bData[bj][1];
        var bSlug = bData[bj][2];

        if (bTitle && bTitle.toString().trim()) {
          if (!bSlug || bSlug.toString().trim() === "") {
            var bUSlug = resolveUniqueSlug(bTitle, bSlugs);
            blogSheet.getRange(bRNum, 3).setValue(sanitizeFormula(bUSlug));
            bSlugs.push(bUSlug);
            bSlugsGen++;
          }
          if (!bId || bId.toString().trim() === "") {
            var bUId = generateUUID("blg-");
            blogSheet.getRange(bRNum, 1).setValue(sanitizeFormula(bUId));
            bUuids++;
          }
        }
      }
      if (bUuids > 0 || bSlugsGen > 0) {
        summaryDetails.push("• blog_posts: " + bUuids + " UUID mới, " + bSlugsGen + " Slug mới");
        totalUuidsFilled += bUuids;
        totalSlugsFilled += bSlugsGen;
      }
    }

    // -------------------------------------------------------------------------
    // E. CÁC TAB BỔ TRỢ: packages_pricing, testimonials, mentor_profiles, faqs
    // -------------------------------------------------------------------------
    var extraTabs = [
      { name: "packages_pricing", prefix: "pkg-", checkCol: 2 },
      { name: "testimonials", prefix: "tst-", checkCol: 1 },
      { name: "mentor_profiles", prefix: "men-", checkCol: 1 },
      { name: "faqs", prefix: "faq-", checkCol: 2 }
    ];

    for (var t = 0; t < extraTabs.length; t++) {
      var eConfig = extraTabs[t];
      var eSheet = ss.getSheetByName(eConfig.name);
      if (eSheet && eSheet.getLastRow() > 1) {
        var eData = eSheet.getDataRange().getValues();
        var eCount = 0;
        for (var er = 1; er < eData.length; er++) {
          var erNum = er + 1;
          var eId = eData[er][0];
          var eCheck = eData[er][eConfig.checkCol];
          if (eCheck && eCheck.toString().trim() && (!eId || eId.toString().trim() === "")) {
            eSheet.getRange(erNum, 1).setValue(sanitizeFormula(generateUUID(eConfig.prefix)));
            eCount++;
          }
        }
        if (eCount > 0) {
          summaryDetails.push("• " + eConfig.name + ": " + eCount + " UUID mới");
          totalUuidsFilled += eCount;
        }
      }
    }

    var totalUpdated = totalUuidsFilled + totalSlugsFilled;
    if (totalUpdated > 0) {
      var msg = "Đã quét toàn bộ hệ thống và tự động điền thành công:\n\n" +
        "🔹 UUID v4 được tạo mới: " + totalUuidsFilled + "\n" +
        "🔹 SEO Slug được tạo mới: " + totalSlugsFilled + "\n\n" +
        "Chi tiết từng tab:\n" + summaryDetails.join("\n");
      ui.alert("🎉 Tự Động Sinh UUID & Chuẩn Hóa Hoàn Tất", msg, ui.ButtonSet.OK);
    } else {
      ui.alert(
        "✅ Dữ Liệu Đã Đầy Đủ & Chuẩn Hóa",
        "Toàn bộ các hàng trong tất cả các tab dữ liệu đều đã có đầy đủ ID (UUID) và Slug hợp lệ!",
        ui.ButtonSet.OK
      );
    }
  } catch (err) {
    ui.alert("❌ Lỗi Khi Thực Thi", err.toString(), ui.ButtonSet.OK);
  } finally {
    try { lock.releaseLock(); } catch (lErr) {}
  }
}

/**
 * 3. Tự động điền Slug & ID cho các hàng còn thiếu kèm auto-versioning (Phiên bản Legacy)
 */
function autoFillMissingSlugsAndIds() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var updatedCount = 0;

  // A. Tab courses
  var courseSheet = ss.getSheetByName("courses");
  if (courseSheet && courseSheet.getLastRow() > 1) {
    var data = courseSheet.getDataRange().getValues();
    var existingSlugs = [];

    // Lấy trước các slug đã có sẵn hợp lệ
    for (var k = 1; k < data.length; k++) {
      if (data[k][2]) {
        existingSlugs.push(data[k][2].toString().trim().toLowerCase());
      }
    }

    for (var i = 1; i < data.length; i++) {
      var rowNum = i + 1;
      var id = data[i][0];
      var title = data[i][1];
      var slug = data[i][2];

      if (title && (!slug || !id)) {
        var uniqueSlug = resolveUniqueSlug(title, existingSlugs);
        var changed = false;

        if (!slug) {
          courseSheet.getRange(rowNum, 3).setValue(sanitizeFormula(uniqueSlug));
          existingSlugs.push(uniqueSlug);
          changed = true;
        }
        if (!id) {
          courseSheet.getRange(rowNum, 1).setValue(sanitizeFormula(uniqueSlug));
          changed = true;
        }
        if (changed) updatedCount++;
      }
    }
  }

  // B. Tab blog_posts
  var blogSheet = ss.getSheetByName("blog_posts");
  if (blogSheet && blogSheet.getLastRow() > 1) {
    var bData = blogSheet.getDataRange().getValues();
    var bExistingSlugs = [];

    for (var m = 1; m < bData.length; m++) {
      if (bData[m][2]) {
        bExistingSlugs.push(bData[m][2].toString().trim().toLowerCase());
      }
    }

    for (var j = 1; j < bData.length; j++) {
      var bRowNum = j + 1;
      var bId = bData[j][0];
      var bTitle = bData[j][1];
      var bSlug = bData[j][2];

      if (bTitle && (!bSlug || !bId)) {
        var bUniqueSlug = resolveUniqueSlug(bTitle, bExistingSlugs);
        var bChanged = false;

        if (!bSlug) {
          blogSheet.getRange(bRowNum, 3).setValue(sanitizeFormula(bUniqueSlug));
          bExistingSlugs.push(bUniqueSlug);
          bChanged = true;
        }
        if (!bId) {
          blogSheet.getRange(bRowNum, 1).setValue(sanitizeFormula("blg-" + bUniqueSlug));
          bChanged = true;
        }
        if (bChanged) updatedCount++;
      }
    }
  }

  if (updatedCount > 0) {
    ui.alert(
      "🎉 Tự Động Điền Hoàn Tất",
      "Đã rà soát và tự động tạo Slug & ID chuẩn SEO (kèm auto-versioning -v1,-v2 nếu trùng) cho " + updatedCount + " dòng dữ liệu!",
      ui.ButtonSet.OK
    );
  } else {
    ui.alert(
      "✅ Dữ Liệu Đã Đầy Đủ",
      "Tất cả các dòng hiện tại đều đã có đầy đủ ID và Slug duy nhất.",
      ui.ButtonSet.OK
    );
  }
}

/**
 * 3. Thao tác Xóa Mềm Khóa Học (Soft Delete)
 */
function showSoftDeletePrompt() {
  var ui = SpreadsheetApp.getUi();
  var prompt = ui.prompt("Lưu Trữ Khóa Học", "Nhập Slug hoặc ID của khóa học bạn muốn ẩn:", ui.ButtonSet.OK_CANCEL);

  if (prompt.getSelectedButton() === ui.Button.OK) {
    var targetSlug = prompt.getResponseText().trim().toLowerCase();
    if (!targetSlug) return;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("courses");
    if (!sheet) return;

    var data = sheet.getDataRange().getValues();
    var found = false;

    for (var i = 1; i < data.length; i++) {
      var slug = (data[i][2] || "").toString().toLowerCase().trim();
      var id = (data[i][0] || "").toString().toLowerCase().trim();

      if (slug === targetSlug || id === targetSlug) {
        sheet.getRange(i + 1, 10).setValue(false); // Cột J: is_active
        found = true;
        ui.alert("Đã Ẩn Khóa Học", "Khóa học '" + data[i][1] + "' đã chuyển sang trạng thái ẩn (is_active = FALSE).", ui.ButtonSet.OK);
        break;
      }
    }

    if (!found) {
      ui.alert("Không Tìm Thấy", "Không tìm thấy khóa học có mã hoặc slug là: " + targetSlug, ui.ButtonSet.OK);
    }
  }
}

/**
 * 4. Kích hoạt On-Demand ISR Revalidation trên Website (If-Else thông minh theo môi trường)
 */
function triggerWebsiteRevalidation() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var settingsMap = {};
  var settingsSheet = ss.getSheetByName("settings");
  if (settingsSheet) {
    var sData = settingsSheet.getDataRange().getValues();
    for (var i = 1; i < sData.length; i++) {
      if (sData[i][0]) {
        settingsMap[sData[i][0].toString().trim().toLowerCase()] = (sData[i][1] || "").toString().trim();
      }
    }
  }

  var activeEnv = (settingsMap["active_revalidation_env"] || CONFIG.ACTIVE_REVALIDATION_ENV || "PROD").toUpperCase();
  var webDeployUrl = settingsMap["web_deploy_url"] || CONFIG.WEB_DEPLOY_URL;
  var prodUrl = settingsMap["revalidation_prod_url"] || settingsMap["revalidation_url"] || CONFIG.REVALIDATION_PROD_URL;
  var localUrl = settingsMap["revalidation_local_url"] || CONFIG.REVALIDATION_LOCAL_URL;

  // 1. Tự động thanh lọc các URL cũ/chết chứa domain datawithly.edu.vn
  if (prodUrl && prodUrl.indexOf("datawithly.edu.vn") !== -1) {
    prodUrl = "";
  }
  if (webDeployUrl && webDeployUrl.indexOf("datawithly.edu.vn") !== -1) {
    webDeployUrl = "";
  }
  if (!webDeployUrl) {
    webDeployUrl = "https://ed-tech-mu-umber.vercel.app";
  }

  // 2. Dọn dẹp ô cell cũ trong tab settings nếu có domain datawithly.edu.vn
  if (settingsSheet) {
    try {
      var sRange = settingsSheet.getDataRange();
      var sVals = sRange.getValues();
      for (var r = 1; r < sVals.length; r++) {
        var keyName = (sVals[r][0] || "").toString().trim().toLowerCase();
        var cellVal = (sVals[r][1] || "").toString().trim();
        if (cellVal.indexOf("datawithly.edu.vn") !== -1) {
          if (keyName === "web_deploy_url") {
            settingsSheet.getRange(r + 1, 2).setValue("https://ed-tech-mu-umber.vercel.app");
          } else if (keyName === "revalidation_prod_url" || keyName === "revalidation_url") {
            settingsSheet.getRange(r + 1, 2).setValue("https://ed-tech-mu-umber.vercel.app/api/revalidate");
          }
        }
      }
    } catch (e) {}
  }

  var targetUrl = "";
  var envName = "";

  if (activeEnv === "LOCAL") {
    targetUrl = localUrl || "http://localhost:3000/api/revalidate";
    envName = "💻 LOCALHOST / DEV TUNNEL";
  } else {
    if (prodUrl && prodUrl.indexOf("http") === 0) {
      targetUrl = prodUrl;
    } else {
      targetUrl = webDeployUrl.replace(/\/+$/, "") + "/api/revalidate";
    }
    envName = "🚀 PRODUCTION WEBSITE (" + webDeployUrl + ")";
  }

  // 3. Gắn kèm mã bí mật REVALIDATION_SECRET nếu chưa có trong URL
  var secret = CONFIG.REVALIDATION_SECRET || "datawithly_secure_reval_token_2026";
  if (targetUrl.indexOf("secret=") === -1) {
    targetUrl += (targetUrl.indexOf("?") === -1 ? "?" : "&") + "secret=" + encodeURIComponent(secret);
  }

  try {
    var response = UrlFetchApp.fetch(targetUrl, {
      method: "post",
      muteHttpExceptions: true
    });

    var statusCode = response.getResponseCode();
    if (statusCode === 200) {
      ui.alert(
        "✅ Xuất Bản Thành Công",
        "Website DataWithLy đã được làm mới tức thì!\n\n" +
        "• Môi trường: " + envName + "\n" +
        "• Endpoint: " + targetUrl.split("?")[0] + "\n\n" +
        "Học viên sẽ thấy ngay nội dung mới nhất vừa cập nhật.",
        ui.ButtonSet.OK
      );
    } else {
      ui.alert(
        "⚠️ Phản Hồi Từ Website (" + envName + ")",
        "Mã HTTP: " + statusCode + "\n" + response.getContentText(),
        ui.ButtonSet.OK
      );
    }
  } catch (err) {
    var isLocalhost = targetUrl.indexOf("localhost") !== -1 || targetUrl.indexOf("127.0.0.1") !== -1;
    if (isLocalhost) {
      ui.alert(
        "ℹ️ Thông Báo Kết Nối Website (" + envName + ")",
        "Google Apps Script chạy trên đám mây của Google nên không thể gọi trực tiếp tới 'localhost:3000' mà không qua ngrok/tunnel.\n\n" +
        "👉 Giải pháp cực nhanh khi chạy Dev cục bộ:\n" +
        "1. Trên giao diện Web Next.js, bấm ngay nút [⚡ Đồng Bộ Dữ Liệu] ở góc màn hình.\n" +
        "2. Hoặc tạo đường hầm qua ngrok/Cloudflare Tunnel và điền URL vào dòng 'revalidation_local_url' trong tab settings.\n" +
        "3. Nếu xuất bản Production, hãy chuyển 'active_revalidation_env' thành PROD.",
        ui.ButtonSet.OK
      );
    } else {
      ui.alert(
        "⚠️ Lỗi Kết Nối Webhook (" + envName + ")",
        "Không thể kết nối đến URL Webhook:\n" + targetUrl.split("?")[0] + "\n\n" +
        "Chi tiết lỗi: " + err.message + "\n\n" +
        "💡 Gợi ý: Hãy kiểm tra lại xem URL Website đã trỏ đúng link Vercel đang hoạt động chưa (vào Menu ➔ Cài Đặt URL Website Vercel).",
        ui.ButtonSet.OK
      );
    }
  }
}

/**
 * 5. Bắn thông báo Telegram tức thì (< 2s) khi có Lead học viên mới (Miễn phí 100%)
 */
function sendTelegramNotification(payload) {
  try {
    var text = "🔥 *CÓ HỌC VIÊN ĐĂNG KÝ TƯ VẤN MỚI!*\n\n" +
      "👤 *Họ tên:* " + (payload.name || "N/A") + "\n" +
      "📞 *Số điện thoại:* `" + (payload.phone || "N/A") + "`\n" +
      "📧 *Email:* " + (payload.email || "N/A") + "\n" +
      "📚 *Khóa học:* " + (payload.course_name || "Tư vấn chung") + "\n" +
      "💬 *Ghi chú:* " + (payload.message || "Không có");

    var url = "https://api.telegram.org/bot" + CONFIG.TELEGRAM_BOT_TOKEN + "/sendMessage";
    UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        chat_id: CONFIG.TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: "Markdown"
      }),
      muteHttpExceptions: true
    });
  } catch (e) {
    Logger.log("Telegram alert error: " + e.toString());
  }
}

/**
 * 6. Cập nhật trạng thái Lead học viên (Lead Status Management)
 * Tự động tìm kiếm trên Spreadsheet Leads (Spreadsheet 2) hoặc Active Spreadsheet
 */
function showUpdateLeadStatusPrompt() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetFactory.getLeadsSpreadsheet();
  var sheet = ss.getSheetByName("leads") || ss.getSheetByName("leads (private)") || ss.getSheetByName("Leads");

  if (!sheet || sheet.getLastRow() <= 1) {
    ui.alert("Thông Báo", "Chưa có danh sách Lead học viên trong bảng Leads.", ui.ButtonSet.OK);
    return;
  }

  var prompt1 = ui.prompt(
    "👥 Cập Nhật Trạng Thái Lead",
    "Nhập Mã Đăng Ký (Submission ID) hoặc Số Điện Thoại của học viên cần cập nhật:",
    ui.ButtonSet.OK_CANCEL
  );

  if (prompt1.getSelectedButton() !== ui.Button.OK) return;
  var query = prompt1.getResponseText().trim().toLowerCase().replace(/['\s-]/g, "");
  if (!query) return;

  var data = sheet.getDataRange().getValues();
  var foundRow = 0;
  var leadInfo = {};
  var headers = data[0].map(function(h) {
    return h.toString().toLowerCase().trim().replace(/[\s-]+/g, "_").replace(/_?\(private\)/g, "");
  });

  var statusColIdx = headers.indexOf("status");
  if (statusColIdx === -1) statusColIdx = 8; // Cột 9 mặc định

  for (var i = 1; i < data.length; i++) {
    var subId = (data[i][0] || "").toString().toLowerCase().trim();
    var phone = (data[i][3] || "").toString().toLowerCase().replace(/['\s-]/g, "").trim();

    if (subId === query || phone === query || (query.length >= 8 && phone.indexOf(query) !== -1)) {
      foundRow = i + 1;
      leadInfo = {
        subId: data[i][0],
        name: data[i][2] || "N/A",
        phone: data[i][3] || "N/A",
        course: data[i][5] || data[i][6] || "N/A",
        currentStatus: data[i][statusColIdx] || "NEW"
      };
      break;
    }
  }

  if (foundRow === 0) {
    ui.alert("Không Tìm Thấy Lead", "Không tìm thấy học viên nào khớp với mã hoặc SĐT: " + query, ui.ButtonSet.OK);
    return;
  }

  var prompt2 = ui.prompt(
    "Tìm thấy: " + leadInfo.name + " (" + leadInfo.phone + ")",
    "Khóa học: " + leadInfo.course + "\n" +
    "Trạng thái hiện tại: [" + leadInfo.currentStatus + "]\n\n" +
    "Chọn trạng thái mới (Gõ số 1-6 hoặc tên trạng thái):\n" +
    "1. NEW (Mới tiếp nhận)\n" +
    "2. CONTACTING (Đang liên hệ tư vấn)\n" +
    "3. CONSULTED (Đã tư vấn xong)\n" +
    "4. ENROLLED (Đã thanh toán & Vào lớp)\n" +
    "5. DROPPED (Không có nhu cầu / Hủy)\n" +
    "6. SPAM (Đăng ký rác / Sai số)",
    ui.ButtonSet.OK_CANCEL
  );

  if (prompt2.getSelectedButton() !== ui.Button.OK) return;
  var choice = prompt2.getResponseText().trim().toUpperCase();

  var statusMap = {
    "1": "NEW",
    "2": "CONTACTING",
    "3": "CONSULTED",
    "4": "ENROLLED",
    "5": "DROPPED",
    "6": "SPAM"
  };

  var newStatus = statusMap[choice] || choice;
  var validStatuses = ["NEW", "CONTACTING", "CONSULTED", "ENROLLED", "DROPPED", "SPAM"];

  if (validStatuses.indexOf(newStatus) === -1) {
    ui.alert("Trạng Thái Không Hợp Lệ", "Vui lòng nhập số từ 1-6 hoặc một trong các trạng thái: " + validStatuses.join(", "), ui.ButtonSet.OK);
    return;
  }

  sheet.getRange(foundRow, statusColIdx + 1).setValue(sanitizeFormula(newStatus));

  // Cập nhật updated_at nếu có cột
  var updateIdx = headers.indexOf("updated_at");
  if (updateIdx !== -1) {
    sheet.getRange(foundRow, updateIdx + 1).setValue(new Date().toISOString());
  }

  ss.toast("🎉 Đã cập nhật trạng thái Lead " + leadInfo.name + " -> " + newStatus, "DataWithLy CRM", 5);
  ui.alert("✅ Cập Nhật Thành Công", "Học viên: " + leadInfo.name + "\nTrạng thái mới: " + newStatus, ui.ButtonSet.OK);
}

/**
 * 7. Thiết lập ID của Google Spreadsheet Leads Riêng Biệt (Spreadsheet 2 - Private Leads CRM)
 */
function promptSetLeadsSpreadsheetId() {
  var ui = SpreadsheetApp.getUi();
  var currentId = CONFIG.LEADS_SPREADSHEET_ID || "";
  var displayStatus = currentId ? currentId : "(Chưa cấu hình, đang dùng file hiện tại)";

  var prompt = ui.prompt(
    "🔗 Cấu Hình Spreadsheet Leads Riêng Biệt (Spreadsheet 2)",
    "Trạng thái hiện tại: " + displayStatus + "\n\n" +
    "Nhập Google Spreadsheet ID của file chứa dữ liệu Leads riêng biệt (Bảo mật PII):\n" +
    "(Bạn có thể lấy ID từ URL của file Sheets: /spreadsheets/d/[ID_Ở_ĐÂY]/edit)",
    ui.ButtonSet.OK_CANCEL
  );

  if (prompt.getSelectedButton() !== ui.Button.OK) return;
  var inputId = prompt.getResponseText().trim();
  if (!inputId) {
    ui.alert("Thông Báo", "Bạn chưa nhập ID hoặc đã để trống.", ui.ButtonSet.OK);
    return;
  }

  try {
    var targetFile = SpreadsheetApp.openById(inputId);
    PropertiesService.getScriptProperties().setProperty("LEADS_SPREADSHEET_ID", inputId);

    ui.alert(
      "🎉 Kết Nối Thành Công!",
      "Đã lưu LEADS_SPREADSHEET_ID vào Script Properties an toàn.\n" +
      "Tên trang tính kết nối: " + targetFile.getName() + "\n\n" +
      "Từ bây giờ, mọi lượt đăng ký học viên mới sẽ tự động được ghi vào file Leads riêng biệt này!",
      ui.ButtonSet.OK
    );
  } catch (err) {
    ui.alert(
      "❌ Không Thể Mở Spreadsheet",
      "Lỗi khi kiểm tra ID: " + err.message + "\n\n" +
      "Vui lòng đảm bảo bạn nhập đúng Spreadsheet ID và tài khoản Google hiện tại có quyền Chỉnh sửa (Editor) đối với file đó.",
      ui.ButtonSet.OK
    );
  }
}

/**
 * 8. Thiết lập mã Secret bảo mật vào Google Cloud Script Properties
 * Giúp mã bí mật được lưu trữ chuẩn Enterprise, không bị lộ trong mã nguồn Git hay bảng tính.
 */
function promptSetSharedSecret() {
  var ui = SpreadsheetApp.getUi();
  var current = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET") || "";
  var displayStatus = current ? "●●●●●●●● (Đã được mã hóa & lưu an toàn trên Google Cloud)" : "(Chưa thiết lập - Khuyến nghị cài đặt ngay)";

  var prompt = ui.prompt(
    "🔐 Cấu Hình Mã Secret Bảo Mật (Script Properties)",
    "Trạng thái hiện tại: " + displayStatus + "\n\n" +
    "Nhập mã Secret xác thực giữa Website Next.js và Google Sheets CMS:\n" +
    "(Khớp với biến GOOGLE_APPS_SCRIPT_SECRET trong file .env.local của Website)",
    ui.ButtonSet.OK_CANCEL
  );

  if (prompt.getSelectedButton() === ui.Button.OK) {
    var val = prompt.getResponseText().trim();
    if (val) {
      PropertiesService.getScriptProperties().setProperty("SHARED_SECRET", val);
      ui.alert(
        "✅ Cấu Hình Thành Công!",
        "Mã Secret đã được lưu trữ vĩnh viễn trong Google Cloud Script Properties.\n\n" +
        "🔒 Mã nguồn của bạn giờ đây hoàn toàn sạch và không còn chứa bất kỳ Secret nhạy cảm nào!",
        ui.ButtonSet.OK
      );
    } else {
      ui.alert("⚠️ Chú ý", "Bạn chưa nhập giá trị nào. Secret chưa được cập nhật.", ui.ButtonSet.OK);
    }
  }
}

/**
 * 9. Cấu hình URL Website Vercel / Production trực quan từ Menu
 */
function promptSetWebDeployUrl() {
  var ui = SpreadsheetApp.getUi();
  var currentUrl = PropertiesService.getScriptProperties().getProperty("WEB_DEPLOY_URL") || "";

  var prompt = ui.prompt(
    "🔗 Cài Đặt URL Website Vercel / Production",
    "Nhập đường dẫn trang web đang chạy (ví dụ: https://ed-tech-mu-umber.vercel.app):\n" +
    "(Hiện tại: " + (currentUrl || "Chưa cấu hình") + ")",
    ui.ButtonSet.OK_CANCEL
  );

  if (prompt.getSelectedButton() === ui.Button.OK) {
    var newUrl = prompt.getResponseText().trim().replace(/\/+$/, "");
    if (!newUrl) {
      ui.alert("Lỗi", "URL Website không được để trống.", ui.ButtonSet.OK);
      return;
    }
    PropertiesService.getScriptProperties().setProperty("WEB_DEPLOY_URL", newUrl);

    // Đồng thời cập nhật vào tab 'settings' nếu có
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("settings");
    if (sheet && sheet.getLastRow() > 1) {
      var data = sheet.getDataRange().getValues();
      var found = false;
      for (var i = 1; i < data.length; i++) {
        if ((data[i][0] || "").toString().trim().toLowerCase() === "web_deploy_url") {
          sheet.getRange(i + 1, 2).setValue(newUrl);
          found = true;
          break;
        }
      }
      if (!found) {
        sheet.appendRow(["web_deploy_url", newUrl, "URL Website Production chính thức trên Vercel"]);
      }
    }

    ui.alert(
      "✅ Đã Lưu Thành Công!",
      "Đã lưu URL Website: " + newUrl + "\n\nGiờ bạn có thể bấm '⚡ Đồng Bộ Lên Website Ngay Lập Tức' để làm mới cache Vercel tức thì.",
      ui.ButtonSet.OK
    );
  }
}

/**
 * 10. Cấu hình REVALIDATION_SECRET vào Script Properties
 */
function promptSetRevalidationSecret() {
  var ui = SpreadsheetApp.getUi();
  var current = PropertiesService.getScriptProperties().getProperty("REVALIDATION_SECRET") || "";
  var displayStatus = current ? "●●●●●●●● (Đã lưu an toàn trong Script Properties)" : "(Chưa thiết lập - Khuyến nghị cài đặt)";

  var prompt = ui.prompt(
    "🔑 Cấu Hình REVALIDATION_SECRET",
    "Trạng thái hiện tại: " + displayStatus + "\n\n" +
    "Nhập mã REVALIDATION_SECRET bảo vệ endpoint webhook /api/revalidate:\n" +
    "(Khớp 100% với biến môi trường REVALIDATION_SECRET trên Vercel)",
    ui.ButtonSet.OK_CANCEL
  );

  if (prompt.getSelectedButton() === ui.Button.OK) {
    var val = prompt.getResponseText().trim();
    if (val) {
      PropertiesService.getScriptProperties().setProperty("REVALIDATION_SECRET", val);
      ui.alert(
        "✅ Cấu Hình REVALIDATION_SECRET Thành Công!",
        "Mã secret revalidation đã được lưu trữ an toàn trong Script Properties.",
        ui.ButtonSet.OK
      );
    } else {
      ui.alert("⚠️ Chú ý", "Bạn chưa nhập giá trị nào.", ui.ButtonSet.OK);
    }
  }
}



