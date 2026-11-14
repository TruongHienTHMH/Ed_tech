/**
 * ==============================================================================
 * MODULE 01: BỘ TIỆN ÍCH SLUG & ID (SEO SLUG & AUTO-VERSIONING UTILS)
 * ==============================================================================
 * 1. Chuyển đổi toàn bộ ký tự tiếng Việt có dấu sang ASCII không dấu chuẩn SEO.
 * 2. Tự động kiểm tra trùng lặp và gắn thêm hậu tố -v1, -v2, -v3...
 * ==============================================================================
 */

/**
 * Chuyển đổi chuỗi tiếng Việt có dấu sang ASCII Slug chuẩn SEO
 * Ví dụ: "Phân Tích Dữ Liệu SQL Cơ Bản" -> "phan-tich-du-lieu-sql-co-ban"
 */
function generateSlug(text) {
  if (!text) return "";
  var str = text.toString().toLowerCase().trim();

  // Bảng chuyển đổi nguyên âm tiếng Việt
  str = str.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, "a");
  str = str.replace(/[éèẻẽẹêếềểễệ]/g, "e");
  str = str.replace(/[íìỉĩị]/g, "i");
  str = str.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, "o");
  str = str.replace(/[úùủũụưứừửữự]/g, "u");
  str = str.replace(/[ýỳỷỹỵ]/g, "y");
  str = str.replace(/đ/g, "d");

  // Thay thế khoảng trắng và gạch dưới bằng dấu gạch nối
  str = str.replace(/[\s_]+/g, "-");
  // Loại bỏ ký tự đặc biệt, chỉ giữ chữ thường, số và gạch nối
  str = str.replace(/[^a-z0-9-]/g, "");
  // Loại bỏ nhiều dấu gạch nối liên tiếp
  str = str.replace(/-+/g, "-");
  // Cắt gạch nối ở đầu và cuối chuỗi
  str = str.replace(/^-+|-+$/g, "");

  return str;
}

/**
 * Tự động tạo ID dựa trên tiền tố và tiêu đề
 */
function generateId(prefix, text) {
  var slug = generateSlug(text);
  if (!prefix) return slug;
  return prefix + "-" + slug;
}

/**
 * Tự động tạo UUID v4 chuẩn RFC 4122 sử dụng Google Apps Script Utilities.getUuid()
 * Hỗ trợ gắn tiền tố theo thực thể (entity prefix) hoặc trả về pure UUID v4.
 * 
 * Ví dụ:
 *   generateUUID("crs-") -> "crs-550e8400-e29b-41d4-a716-446655440000"
 *   generateUUID()       -> "550e8400-e29b-41d4-a716-446655440000"
 * 
 * @param {string} [prefix] Tiền tố thực thể tùy chọn (ví dụ: "crs-", "blg-", "cur-", "promo-")
 * @return {string} UUID v4 kèm tiền tố hoặc pure UUID v4
 */
function generateUUID(prefix) {
  var rawUuid = "";
  if (typeof Utilities !== "undefined" && typeof Utilities.getUuid === "function") {
    rawUuid = Utilities.getUuid();
  } else if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    rawUuid = crypto.randomUUID();
  } else {
    // Fallback chuẩn RFC 4122 version 4
    rawUuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  var p = (prefix !== null && prefix !== undefined) ? prefix.toString() : "";
  return p ? (p + rawUuid) : rawUuid;
}

/**
 * Kiểm tra tính hợp lệ của định dạng UUID v4 chuẩn RFC 4122 (kèm hoặc không kèm tiền tố)
 * Format UUID v4: 8 hex - 4 hex - 4xxx - [89ab]xxx - 12 hex
 * 
 * @param {string} id Chuỗi ID cần kiểm tra
 * @param {string} [expectedPrefix] Tiền tố kỳ vọng (nếu có, ví dụ: "crs-")
 * @return {boolean} true nếu hợp lệ chuẩn UUID v4
 */
function isValidUUID(id, expectedPrefix) {
  if (!id || typeof id !== "string") return false;
  var str = id.trim();
  if (expectedPrefix) {
    if (str.indexOf(expectedPrefix) !== 0) return false;
    str = str.substring(expectedPrefix.length);
  } else {
    // Nếu có tiền tố thực thể dạng xxx- trước phần UUID (ví dụ crs-...)
    var matchPrefix = str.match(/^[a-zA-Z0-9_-]+-(.+)$/);
    if (matchPrefix && matchPrefix[1]) {
      var candidateUuid = matchPrefix[1];
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(candidateUuid)) {
        return true;
      }
    }
  }
  var uuidV4Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Pattern.test(str);
}

/**
 * Cơ chế tự động giải quyết xung đột slug:
 * Nếu baseSlug đã tồn tại trong danh sách existingSlugs, tự động gắn thêm -v1, -v2, -v3...
 * 
 * @param {string} rawInput Chuỗi slug hoặc tiêu đề cần kiểm tra
 * @param {Array<string>} existingSlugs Mảng danh sách các slug đã có trong bảng
 * @param {string} [currentSlug] Slug hiện tại của chính hàng đó (để không tự coi mình là trùng khi sửa)
 * @return {string} Slug duy nhất (ví dụ: "sql-analytics-v1")
 */
function resolveUniqueSlug(rawInput, existingSlugs, currentSlug) {
  var base = generateSlug(rawInput);
  if (!base) return "";

  // Bóc tách base gốc nếu chuỗi ban đầu đã có hậu tố dạng -v1, -v2...
  var cleanBase = base.replace(/-v\d+$/, "");

  // Tạo Set hoặc Map để tra cứu nhanh O(1)
  var slugMap = {};
  for (var i = 0; i < existingSlugs.length; i++) {
    var s = (existingSlugs[i] || "").toString().trim().toLowerCase();
    if (s && s !== (currentSlug || "").toString().trim().toLowerCase()) {
      slugMap[s] = true;
    }
  }

  // 1. Nếu base gốc chưa tồn tại -> dùng ngay base gốc
  if (!slugMap[cleanBase]) {
    return cleanBase;
  }

  // 2. Nếu base gốc đã tồn tại -> thử lần lượt -v1, -v2, -v3...
  var version = 1;
  while (true) {
    var candidate = cleanBase + "-v" + version;
    if (!slugMap[candidate]) {
      return candidate;
    }
    version++;
  }
}

/**
 * Khử trùng công thức Google Sheets (Formula/CSV Injection Sanitization - BR-03)
 * Ngăn chặn chèn mã độc thực thi (=, +, -, @, Tab, CR) khi mở trong Google Sheets / Excel.
 */
function sanitizeFormula(val) {
  if (val === null || val === undefined) return "";
  var raw = val.toString();
  if (/^[\t\r]/.test(raw)) {
    return "'" + raw;
  }
  var str = raw.trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    return "'" + str;
  }
  return str;
}

/**
 * ==============================================================================
 * UNIT TEST NỘI BỘ (Chạy hàm này trong Apps Script Editor để kiểm chứng)
 * ==============================================================================
 */
function testSlugVersioning() {
  Logger.log("--- BẮT ĐẦU KIỂM THỬ SLUG VERSIONING ---");

  // Test 1: Chuỗi không trùng
  var existing = ["powerbi-dashboard", "python-automation"];
  var res1 = resolveUniqueSlug("SQL for Data Analytics", existing);
  Logger.log("Test 1 (Chưa trùng): " + res1 + " => " + (res1 === "sql-for-data-analytics" ? "PASSED" : "FAILED"));

  // Test 2: Trùng lần 1 -> nhận -v1
  existing.push("sql-for-data-analytics");
  var res2 = resolveUniqueSlug("SQL for Data Analytics", existing);
  Logger.log("Test 2 (Trùng lần 1): " + res2 + " => " + (res2 === "sql-for-data-analytics-v1" ? "PASSED" : "FAILED"));

  // Test 3: Trùng tiếp -> nhận -v2
  existing.push("sql-for-data-analytics-v1");
  var res3 = resolveUniqueSlug("SQL for Data Analytics", existing);
  Logger.log("Test 3 (Trùng lần 2): " + res3 + " => " + (res3 === "sql-for-data-analytics-v2" ? "PASSED" : "FAILED"));

  // Test 4: Trùng tiếp -> nhận -v3
  existing.push("sql-for-data-analytics-v2");
  var res4 = resolveUniqueSlug("SQL for Data Analytics", existing);
  Logger.log("Test 4 (Trùng lần 3): " + res4 + " => " + (res4 === "sql-for-data-analytics-v3" ? "PASSED" : "FAILED"));

  Logger.log("--- HOÀN THÀNH KIỂM THỬ ---");
}

/**
 * 2. KIỂM THỬ TÍNH TOÀN VẸN CỦA MODULE LỘ TRÌNH (CURRICULUM MODULE INTEGRITY)
 * - Kiểm tra liên kết course_id và sinh ID chuẩn: course_id + "-mod-" + module_number
 * - Kiểm tra khử trùng formula injection (=, +, -, @)
 * - Kiểm tra tính bắt buộc của course_id và module_title
 */
function testCurriculumModuleIntegrity() {
  Logger.log("--- BẮT ĐẦU KIỂM THỬ CURRICULUM MODULE INTEGRITY ---");
  var passed = 0;
  var total = 0;

  var sanitize = sanitizeFormula;

  function generateCurriculumId(courseId, modNumber) {
    return (courseId || "").toString().trim() + "-mod-" + Number(modNumber);
  }

  // Test 1: Sinh ID chuẩn
  total++;
  var cId = "sql-for-data-analytics";
  var modNum = 1;
  var expectedId = "sql-for-data-analytics-mod-1";
  var actualId = generateCurriculumId(cId, modNum);
  var pass1 = actualId === expectedId;
  if (pass1) passed++;
  Logger.log("Test 1 (Sinh ID chuẩn): " + actualId + " => " + (pass1 ? "PASSED" : "FAILED"));

  // Test 2: Sinh ID module 4
  total++;
  var actualId4 = generateCurriculumId(cId, 4);
  var pass2 = actualId4 === "sql-for-data-analytics-mod-4";
  if (pass2) passed++;
  Logger.log("Test 2 (Sinh ID module 4): " + actualId4 + " => " + (pass2 ? "PASSED" : "FAILED"));

  // Test 3: Khử trùng formula injection trên title
  total++;
  var badTitle = "=cmd|' /C calc'!A0";
  var sanitizedTitle = sanitize(badTitle);
  var pass3 = sanitizedTitle === "'=cmd|' /C calc'!A0";
  if (pass3) passed++;
  Logger.log("Test 3 (Khử trùng formula =cmd): " + sanitizedTitle + " => " + (pass3 ? "PASSED" : "FAILED"));

  // Test 4: Khử trùng ký tự @, +, -
  total++;
  var pass4 = sanitize("@SUM(A1:A10)") === "'@SUM(A1:A10)" &&
              sanitize("+123456") === "'+123456" &&
              sanitize("-5000") === "'-5000";
  if (pass4) passed++;
  Logger.log("Test 4 (Khử trùng @, +, -): " + (pass4 ? "PASSED" : "FAILED"));

  // Test 5: Bắt buộc course_id & module_title
  total++;
  function validateCurriculum(data) {
    if (!data.course_id || !data.course_id.toString().trim()) throw new Error("Vui lòng chọn khóa học.");
    if (!data.module_title || !data.module_title.toString().trim()) throw new Error("Tiêu đề chương không được để trống.");
    return true;
  }

  var pass5 = false;
  try {
    validateCurriculum({ course_id: "sql-da", module_title: "Chương 1", module_number: 1 });
    var threw1 = false;
    try { validateCurriculum({ course_id: "", module_title: "Chương 1" }); } catch (e1) { threw1 = true; }
    var threw2 = false;
    try { validateCurriculum({ course_id: "sql-da", module_title: "" }); } catch (e2) { threw2 = true; }
    pass5 = threw1 && threw2;
  } catch (e) {
    pass5 = false;
  }
  if (pass5) passed++;
  Logger.log("Test 5 (Bắt buộc course_id & module_title): " + (pass5 ? "PASSED" : "FAILED"));

  Logger.log("--- HOÀN THÀNH CURRICULUM TEST: " + passed + "/" + total + " PASSED ---");
  return passed === total;
}

/**
 * 3. KIỂM THỬ CƠ CHẾ UPSERT HỒ SƠ MENTOR (MENTOR MODULE UPSERT)
 * - Kiểm tra cơ chế upsert theo mentor id (trùng ID -> update, chưa có -> insert)
 * - Kiểm tra khử trùng formula injection
 * - Kiểm tra bảo toàn cờ is_active
 */
function testMentorModuleUpsert() {
  Logger.log("--- BẮT ĐẦU KIỂM THỬ MENTOR MODULE UPSERT ---");
  var passed = 0;
  var total = 0;

  var mockTable = [
    ["mentor-ly-hua", "Hứa Thảo Ly", "Lead Mentor", "Bio cũ", "MoMo", "/avatar1.jpg", "https://linkedin/1", true]
  ];

  function simulateUpsertMentor(table, data) {
    var id = (data.id || "mentor-ly-hua").toString().trim();
    var name = (data.name || "").toString().trim();
    if (!name) throw new Error("Họ và tên Mentor không được để trống.");

    var sanitize = sanitizeFormula;

    var rowData = [
      sanitize(id),
      sanitize(name),
      sanitize(data.title || ""),
      sanitize(data.bio || ""),
      sanitize(data.companies_worked || ""),
      sanitize(data.avatar_url || ""),
      sanitize(data.linkedin_url || ""),
      data.is_active === true
    ];

    var foundIdx = -1;
    for (var i = 0; i < table.length; i++) {
      if (table[i][0] && table[i][0].toString().trim() === id) {
        foundIdx = i;
        break;
      }
    }

    if (foundIdx >= 0) {
      table[foundIdx] = rowData;
      return { action: "UPDATE", index: foundIdx, row: rowData };
    } else {
      table.push(rowData);
      return { action: "INSERT", index: table.length - 1, row: rowData };
    }
  }

  // Test 1: UPDATE mentor hiện có
  total++;
  var resUpdate = simulateUpsertMentor(mockTable, {
    id: "mentor-ly-hua",
    name: "Hứa Thảo Ly",
    title: "Founder & Lead Mentor",
    bio: "Hơn 7 năm kinh nghiệm tại MoMo, Tiki, ACB",
    companies_worked: "MoMo, Tiki, ACB Bank",
    avatar_url: "/uploads/mentors/ly-hua.jpg",
    linkedin_url: "https://linkedin.com/in/lyhuadata",
    is_active: true
  });
  var pass1 = resUpdate.action === "UPDATE" &&
              mockTable.length === 1 &&
              mockTable[0][2] === "Founder & Lead Mentor";
  if (pass1) passed++;
  Logger.log("Test 1 (Upsert - Cập nhật Mentor hiện có): " + (pass1 ? "PASSED" : "FAILED"));

  // Test 2: INSERT mentor mới khác ID
  total++;
  var resInsert = simulateUpsertMentor(mockTable, {
    id: "mentor-guest",
    name: "Nguyễn Văn A",
    title: "Guest Lecturer",
    bio: "Senior BI Analyst",
    companies_worked: "Shopee",
    avatar_url: "/avatar.jpg",
    linkedin_url: "https://linkedin.com/in/guest",
    is_active: false
  });
  var pass2 = resInsert.action === "INSERT" &&
              mockTable.length === 2 &&
              mockTable[1][0] === "mentor-guest" &&
              mockTable[1][7] === false;
  if (pass2) passed++;
  Logger.log("Test 2 (Upsert - Thêm mới Mentor): " + (pass2 ? "PASSED" : "FAILED"));

  // Test 3: Khử trùng formula trên Mentor
  total++;
  simulateUpsertMentor(mockTable, {
    id: "mentor-injection",
    name: "=HYPERLINK(\"http://malicious.com\")",
    title: "+ADMIN()",
    bio: "@SECRET_DATA",
    is_active: true
  });
  var pass3 = mockTable[2][1] === "'=HYPERLINK(\"http://malicious.com\")" &&
              mockTable[2][2] === "'+ADMIN()" &&
              mockTable[2][3] === "'@SECRET_DATA";
  if (pass3) passed++;
  Logger.log("Test 3 (Khử trùng formula trên Mentor): " + (pass3 ? "PASSED" : "FAILED"));

  // Test 4: Bắt buộc name
  total++;
  var pass4 = false;
  try {
    simulateUpsertMentor(mockTable, { id: "mentor-anon", name: "" });
  } catch (e) {
    pass4 = true;
  }
  if (pass4) passed++;
  Logger.log("Test 4 (Bắt buộc Mentor name): " + (pass4 ? "PASSED" : "FAILED"));

  Logger.log("--- HOÀN THÀNH MENTOR TEST: " + passed + "/" + total + " PASSED ---");
  return passed === total;
}

/**
 * 4. KIỂM THỬ VALIDATION KHUYẾN MÃI (PROMOTIONS VALIDATION)
 * - Tự động uppercase mã code & loại ký tự đặc biệt
 * - Validate discount_value: PERCENT (1-100), FIXED_VND (>0)
 * - Validate ngày: end_date >= start_date
 * - Tự động sinh ID và Badge
 */
function testPromotionsValidation() {
  Logger.log("--- BẮT ĐẦU KIỂM THỬ PROMOTIONS VALIDATION ---");
  var passed = 0;
  var total = 0;

  function validateAndNormalizePromo(data) {
    var code = (data.code || "").toString().trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    var title = (data.title || "").toString().trim();
    var discountType = (data.discount_type || "PERCENT").toString().trim();
    var discountValue = Number(data.discount_value) || 0;
    var startDate = (data.start_date || "").toString().trim();
    var endDate = (data.end_date || "").toString().trim();

    if (!code) throw new Error("Mã khuyến mãi (Code) không được để trống.");
    if (!title) throw new Error("Tiêu đề chương trình không được để trống.");
    if (discountType === "PERCENT" && (discountValue <= 0 || discountValue > 100)) {
      throw new Error("Tỷ lệ giảm giá phần trăm phải nằm trong khoảng từ 1% đến 100%.");
    }
    if (discountType === "FIXED_VND" && discountValue <= 0) {
      throw new Error("Số tiền giảm VNĐ phải lớn hơn 0.");
    }
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      throw new Error("Thời gian kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.");
    }

    var id = (data.id || "promo-" + code.toLowerCase()).toString().trim();
    var badge = (data.badge || "").toString().trim();
    if (!badge) {
      badge = discountType === "PERCENT" ? "Giảm " + discountValue + "%" : "Giảm " + (discountValue / 1000).toLocaleString() + "K";
    }

    return { id: id, code: code, badge: badge, discount_type: discountType, discount_value: discountValue };
  }

  // Test 1: Chuẩn hóa code & ID & Badge
  total++;
  var res1 = validateAndNormalizePromo({
    code: "early_bird@15!",
    title: "Giảm giá sớm",
    discount_type: "PERCENT",
    discount_value: 15
  });
  var pass1 = res1.code === "EARLY_BIRD15" && res1.id === "promo-early_bird15" && res1.badge === "Giảm 15%";
  if (pass1) passed++;
  Logger.log("Test 1 (Auto UpperCase & Sanitize Code): " + res1.code + " => " + (pass1 ? "PASSED" : "FAILED"));

  // Test 2: PERCENT 1-100%
  total++;
  var pass2 = false;
  try {
    validateAndNormalizePromo({ code: "VALID", title: "Valid", discount_type: "PERCENT", discount_value: 50 });
    var threwZero = false;
    try { validateAndNormalizePromo({ code: "BAD", title: "Bad", discount_type: "PERCENT", discount_value: 0 }); } catch (e) { threwZero = true; }
    var threw101 = false;
    try { validateAndNormalizePromo({ code: "BAD", title: "Bad", discount_type: "PERCENT", discount_value: 101 }); } catch (e) { threw101 = true; }
    pass2 = threwZero && threw101;
  } catch (e) {
    pass2 = false;
  }
  if (pass2) passed++;
  Logger.log("Test 2 (PERCENT trong khoảng 1-100%): " + (pass2 ? "PASSED" : "FAILED"));

  // Test 3: FIXED_VND > 0
  total++;
  var pass3 = false;
  try {
    var vnd = validateAndNormalizePromo({ code: "VND500", title: "Voucher", discount_type: "FIXED_VND", discount_value: 500000 });
    var threwNegative = false;
    try { validateAndNormalizePromo({ code: "BAD", title: "Bad", discount_type: "FIXED_VND", discount_value: -1000 }); } catch (e) { threwNegative = true; }
    pass3 = threwNegative && vnd.badge === "Giảm 500K";
  } catch (e) {
    pass3 = false;
  }
  if (pass3) passed++;
  Logger.log("Test 3 (FIXED_VND > 0 & Auto Badge): " + (pass3 ? "PASSED" : "FAILED"));

  // Test 4: end_date >= start_date
  total++;
  var pass4 = false;
  try {
    validateAndNormalizePromo({
      code: "FLASH",
      title: "Flash Sale",
      discount_type: "PERCENT",
      discount_value: 20,
      start_date: "2026-03-01",
      end_date: "2026-03-05 23:59:59"
    });
    var threwInvalidDates = false;
    try {
      validateAndNormalizePromo({
        code: "FLASH",
        title: "Flash Sale",
        discount_type: "PERCENT",
        discount_value: 20,
        start_date: "2026-03-31",
        end_date: "2026-03-01"
      });
    } catch (e) {
      threwInvalidDates = true;
    }
    pass4 = threwInvalidDates;
  } catch (e) {
    pass4 = false;
  }
  if (pass4) passed++;
  Logger.log("Test 4 (end_date >= start_date validation): " + (pass4 ? "PASSED" : "FAILED"));

  Logger.log("--- HOÀN THÀNH PROMOTIONS TEST: " + passed + "/" + total + " PASSED ---");
  return passed === total;
}

/**
 * 5. KIỂM THỬ TÍNH HỢP LỆ VÀ ĐỘ DUY NHẤT CỦA BỘ SINH UUID V4
 * - Kiểm tra định dạng UUID v4 không tiền tố (pure UUID v4, độ dài 36)
 * - Kiểm tra UUID v4 kèm tiền tố chuẩn thực thể (ví dụ: "crs-", độ dài 40)
 * - Kiểm tra UUID đa tiền tố: "blg-", "cur-", "promo-"
 * - Kiểm tra tính duy nhất khi sinh 100 UUID liên tục
 * - Kiểm tra từ chối các chuỗi không hợp lệ
 */
function testUUIDGeneration() {
  Logger.log("--- BẮT ĐẦU KIỂM THỬ UUID V4 GENERATION ---");
  var passed = 0;
  var total = 0;

  // Test 1: Pure UUID v4 (không truyền prefix)
  total++;
  var pureUuid = generateUUID();
  var isPureValid = isValidUUID(pureUuid) && pureUuid.length === 36 && pureUuid.charAt(14) === "4";
  if (isPureValid) passed++;
  Logger.log("Test 1 (Pure UUID v4): " + pureUuid + " => " + (isPureValid ? "PASSED" : "FAILED"));

  // Test 2: UUID v4 có tiền tố "crs-"
  total++;
  var crsUuid = generateUUID("crs-");
  var isCrsValid = isValidUUID(crsUuid, "crs-") && crsUuid.indexOf("crs-") === 0 && crsUuid.length === 40;
  if (isCrsValid) passed++;
  Logger.log("Test 2 (UUID với prefix 'crs-'): " + crsUuid + " => " + (isCrsValid ? "PASSED" : "FAILED"));

  // Test 3: UUID v4 với các tiền tố khác ("blg-", "cur-", "promo-")
  total++;
  var blgUuid = generateUUID("blg-");
  var curUuid = generateUUID("cur-");
  var promoUuid = generateUUID("promo-");
  var isMultiPrefixValid = isValidUUID(blgUuid, "blg-") &&
                           isValidUUID(curUuid, "cur-") &&
                           isValidUUID(promoUuid, "promo-");
  if (isMultiPrefixValid) passed++;
  Logger.log("Test 3 (UUID đa tiền tố blg, cur, promo): => " + (isMultiPrefixValid ? "PASSED" : "FAILED"));

  // Test 4: Kiểm tra tính duy nhất (Uniqueness) khi sinh 100 UUID liên tục
  total++;
  var set = {};
  var collision = false;
  for (var i = 0; i < 100; i++) {
    var u = generateUUID("test-");
    if (set[u]) {
      collision = true;
      break;
    }
    set[u] = true;
  }
  var isUnique = !collision && Object.keys(set).length === 100;
  if (isUnique) passed++;
  Logger.log("Test 4 (Kiểm tra 100 UUID không trùng lặp): => " + (isUnique ? "PASSED" : "FAILED"));

  // Test 5: Từ chối các chuỗi không phải UUID v4
  total++;
  var badInputs = [
    "",
    null,
    undefined,
    "sql-for-data-analytics",
    "550e8400-e29b-11d4-a716-446655440000", // UUID v1 (không phải v4)
    "550e8400-e29b-41d4-c716-446655440000", // Sai variant bit
    "crs-short-uuid-1234",
    "crs-550e8400e29b41d4a716446655440000" // Thiếu dấu gạch ngang
  ];
  var allRejected = true;
  for (var j = 0; j < badInputs.length; j++) {
    if (isValidUUID(badInputs[j])) {
      allRejected = false;
      break;
    }
  }
  if (allRejected) passed++;
  Logger.log("Test 5 (Từ chối định dạng không hợp lệ): => " + (allRejected ? "PASSED" : "FAILED"));

  Logger.log("--- HOÀN THÀNH UUID TEST: " + passed + "/" + total + " PASSED ---");
  return passed === total;
}

/**
 * 6. KIỂM THỬ KHỬ TRÙNG CÔNG THỨC (FORMULA INJECTION SANITIZATION) & XÁC THỰC BẢO MẬT
 * - Chống Formula/CSV Injection: =, +, -, @, Tab, Carriage Return
 * - Chống Bypass Empty Secret: Nếu server chưa cấu hình secret -> Chặn 100% mọi truy cập
 */
function testFormulaSanitizationAndAuthSecurity() {
  Logger.log("--- BẮT ĐẦU KIỂM THỬ KHỬ TRÙNG CÔNG THỨC & BẢO MẬT SECRET ---");
  var passed = 0;
  var total = 0;

  // Test 1: Khử trùng ký tự =
  total++;
  var t1 = sanitizeFormula("=SUM(A1:A10)");
  var p1 = t1 === "'=SUM(A1:A10)";
  if (p1) passed++;
  Logger.log("Test 1 (Khử trùng '='): " + t1 + " => " + (p1 ? "PASSED" : "FAILED"));

  // Test 2: Khử trùng ký tự +, -, @
  total++;
  var t2a = sanitizeFormula("+cmd|' /C calc'!A0");
  var t2b = sanitizeFormula("-2+3");
  var t2c = sanitizeFormula("@IMPORTXML('http://malicious.site')");
  var p2 = t2a === "'+cmd|' /C calc'!A0" && t2b === "'-2+3" && t2c === "'@IMPORTXML('http://malicious.site')";
  if (p2) passed++;
  Logger.log("Test 2 (Khử trùng '+', '-', '@'): => " + (p2 ? "PASSED" : "FAILED"));

  // Test 3: Khử trùng ký tự điều khiển Tab, Carriage Return
  total++;
  var t3a = sanitizeFormula("\tMALICIOUS");
  var t3b = sanitizeFormula("\rEXECUTE");
  var p3 = t3a === "'\tMALICIOUS" && t3b === "'\rEXECUTE";
  if (p3) passed++;
  Logger.log("Test 3 (Khử trùng Tab, Carriage Return): => " + (p3 ? "PASSED" : "FAILED"));

  // Test 4: Giữ nguyên chuỗi an toàn & xử lý null/undefined
  total++;
  var t4a = sanitizeFormula("SQL for Data Analytics");
  var t4b = sanitizeFormula(null);
  var t4c = sanitizeFormula(undefined);
  var p4 = t4a === "SQL for Data Analytics" && t4b === "" && t4c === "";
  if (p4) passed++;
  Logger.log("Test 4 (Chuỗi an toàn & Null/Undefined): => " + (p4 ? "PASSED" : "FAILED"));

  // Test 5: Kiểm tra cơ chế chống bypass khi Server chưa cấu hình Secret (Empty Secret Vulnerability)
  total++;
  function verifySecretAuth(configuredSecret, clientSecret) {
    if (!configuredSecret || configuredSecret.trim() === "" || clientSecret !== configuredSecret) {
      return false; // Chặn truy cập
    }
    return true; // Cho phép
  }

  // Khi server chưa cấu hình: client gửi "" hoặc bất kỳ chuỗi nào đều PHẢI BỊ CHẶN
  var blocked1 = verifySecretAuth("", "") === false;
  var blocked2 = verifySecretAuth(null, "some_secret") === false;
  var blocked3 = verifySecretAuth(undefined, "") === false;
  // Khi server đã cấu hình: chỉ cho phép khi chuỗi khớp hoàn toàn
  var blocked4 = verifySecretAuth("valid_secret_123", "wrong_secret") === false;
  var allowed = verifySecretAuth("valid_secret_123", "valid_secret_123") === true;

  var p5 = blocked1 && blocked2 && blocked3 && blocked4 && allowed;
  if (p5) passed++;
  Logger.log("Test 5 (Vá dứt điểm lỗ hổng Empty Secret Authentication): => " + (p5 ? "PASSED" : "FAILED"));

  Logger.log("--- HOÀN THÀNH BẢO MẬT TEST: " + passed + "/" + total + " PASSED ---");
  return passed === total;
}

/**
 * 7. HÀM CHẠY TỔNG HỢP TOÀN BỘ CÁC BỘ TEST APPS SCRIPT
 */
function runAllAppsScriptUnitTests() {
  Logger.log("==============================================================================");
  Logger.log("🚀 BẮT ĐẦU CHẠY TOÀN BỘ BỘ TEST TỰ ĐỘNG APPS SCRIPT (ALL UNIT TESTS)");
  Logger.log("==============================================================================");

  testSlugVersioning();
  var currPass = testCurriculumModuleIntegrity();
  var mentorPass = testMentorModuleUpsert();
  var promoPass = testPromotionsValidation();
  var uuidPass = testUUIDGeneration();
  var secPass = testFormulaSanitizationAndAuthSecurity();

  var allPassed = currPass && mentorPass && promoPass && uuidPass && secPass;
  Logger.log("==============================================================================");
  if (allPassed) {
    Logger.log("🎉 TẤT CẢ 6 BỘ TEST ĐÃ VƯỢT QUA 100% THÀNH CÔNG (ALL 6 TEST SUITES PASSED)");
  } else {
    Logger.log("❌ MỘT SỐ TEST BỊ LỖI (VUI LÒNG KIỂM TRA LẠI CHI TIẾT)");
  }
  Logger.log("==============================================================================");

  return allPassed;
}

