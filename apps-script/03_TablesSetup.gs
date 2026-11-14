/**
 * ==============================================================================
 * MODULE 03: KHỞI TẠO BẢNG DỮ LIỆU CHUẨN HÓA (DATABASE TABLES SETUP)
 * ==============================================================================
 * 1. setupDataWithLyTables(): Tự động tạo 12 Tab chuẩn hóa kèm dữ liệu mẫu & Dropdown.
 * 2. Cài đặt chi tiết từng Tab:
 *    1. courses
 *    2. curriculum
 *    3. packages_pricing
 *    4. student_projects
 *    5. mentor_profiles
 *    6. testimonials
 *    7. faqs
 *    8. trust_metrics
 *    9. settings
 *    10. blog_posts
 *    11. leads (private)
 *    12. promotions
 * ==============================================================================
 */

/**
 * ==============================================================================
 * DESIGN PATTERN 2: SCHEMA REGISTRY (TABLE SCHEMAS REGISTRY)
 * ==============================================================================
 * Từ điển quản lý cấu trúc chuẩn hóa cho 11 Tabs CMS Content và 1 Tab Leads CRM
 * ==============================================================================
 */
var CMS_TABLE_SCHEMAS = {
  courses: {
    sheetName: "courses",
    headers: ["id", "title", "slug", "tag", "tagline", "tuition_vnd", "original_tuition_vnd", "duration", "level", "is_active", "is_featured", "sort_order", "description", "cover_image_url", "start_date", "end_date"],
    headerColor: "#8B1D2C"
  },
  curriculum: {
    sheetName: "curriculum",
    headers: ["id", "course_id", "course_name", "week", "day", "date", "session_title", "session_desc", "sub_content", "duration", "sort_order"],
    headerColor: "#8B1D2C"
  },
  packages_pricing: {
    sheetName: "packages_pricing",
    headers: ["id", "package_id", "name", "original_price", "sale_price", "badge", "features_list", "is_popular", "is_active", "sort_order"],
    headerColor: "#1F242F"
  },
  student_projects: {
    sheetName: "student_projects",
    headers: ["project_id", "title", "category", "author_name", "tools", "metrics", "image_url", "sort_order", "is_active"],
    headerColor: "#1F242F"
  },
  mentor_profiles: {
    sheetName: "mentor_profiles",
    headers: ["id", "name", "title", "bio", "companies_worked", "avatar_url", "linkedin_url", "is_active"],
    headerColor: "#1F242F"
  },
  testimonials: {
    sheetName: "testimonials",
    headers: ["id", "student_name", "role", "company", "avatar_url", "course_id", "rating", "review_text", "is_featured", "is_active"],
    headerColor: "#1F242F"
  },
  faqs: {
    sheetName: "faqs",
    headers: ["id", "category", "question", "answer", "is_active", "sort_order"],
    headerColor: "#1F242F"
  },
  trust_metrics: {
    sheetName: "trust_metrics",
    headers: ["metric_key", "number_display", "label", "icon_name", "is_active", "sort_order"],
    headerColor: "#1F242F"
  },
  settings: {
    sheetName: "settings",
    headers: ["key", "value", "description"],
    headerColor: "#1F242F"
  },
  blog_posts: {
    sheetName: "blog_posts",
    headers: ["id", "title", "slug", "category", "excerpt", "author_name", "published_at", "is_active"],
    headerColor: "#1F242F"
  },
  promotions: {
    sheetName: "promotions",
    headers: ["id", "code", "title", "discount_type", "discount_value", "start_date", "end_date", "applicable_courses", "badge", "is_active", "sort_order"],
    headerColor: "#8B1D2C"
  },
  leads: {
    sheetName: "leads",
    headers: ["submission_id", "timestamp", "name", "phone", "email", "coaching_course", "target_or_goal", "attendance_commitment", "status", "notes", "assigned_to", "source", "updated_at"],
    headerColor: "#7F1D1D"
  }
};

/**
 * 1. setupDataWithLyTables(): Tự động tạo toàn bộ các Tab chuẩn hóa kèm dữ liệu mẫu & Dropdown.
 */
function setupDataWithLyTables() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();

  var confirm = ui.alert(
    "Khởi Tạo Hệ Thống Bảng DataWithLy CMS",
    "Hệ thống sẽ tự động tạo đủ 12 Tab chuẩn hóa (Courses, Curriculum, Packages, Student Projects, Mentors, Testimonials, FAQs, Trust, Settings, Blogs, Leads Private, và Promotions) kèm dữ liệu mẫu và Dropdown Validation.\n\nBạn có muốn tiếp tục không?",
    ui.ButtonSet.YES_NO
  );

  if (confirm !== ui.Button.YES) return;

  try {
    setupCoursesTab(ss);
    setupCurriculumTab(ss);
    setupPackagesPricingTab(ss);
    setupStudentProjectsTab(ss);
    setupMentorProfilesTab(ss);
    setupTestimonialsTab(ss);
    setupFaqsTab(ss);
    setupTrustMetricsTab(ss);
    setupSettingsTab(ss);
    setupBlogPostsTab(ss);
    setupLeadsPrivateTab(ss);
    setupPromotionsTab(ss);

    // Xóa Sheet1 mặc định nếu rỗng
    var sheet1 = ss.getSheetByName("Sheet1") || ss.getSheetByName("Trang tính1");
    if (sheet1 && ss.getSheets().length > 1) {
      try { ss.deleteSheet(sheet1); } catch (e) {}
    }

    ui.alert(
      "🎉 Cài Đặt Hoàn Tất 100%!",
      "Đã khởi tạo thành công 12 Tab dữ liệu chuẩn hóa, cài đặt xong Dropdown Validation và nạp dữ liệu mẫu.\n\nBây giờ bạn có thể mở trang http://localhost:3000/tests-data để kiểm tra đồng bộ ngay!",
      ui.ButtonSet.OK
    );
  } catch (err) {
    ui.alert("❌ Lỗi Khi Cài Đặt", err.toString(), ui.ButtonSet.OK);
  }
}

/**
 * Khởi tạo riêng 11 Tab CMS Content cho Spreadsheet 1 (Content Master)
 * Không chứa tab Leads, an toàn tuyệt đối khi phân quyền cho Marketing / Biên tập viên.
 */
function setupCmsContentSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();

  var confirm = ui.alert(
    "Khởi Tạo 11 Tab CMS Content Master (Spreadsheet 1)",
    "Hệ thống sẽ tạo đủ 11 Tab nội dung (Courses, Curriculum, Packages, Student Projects, Mentors, Testimonials, FAQs, Trust, Settings, Blogs, Promotions) kèm dữ liệu mẫu chuẩn Figma.\n\nFile này sẽ KHÔNG chứa tab Leads cá nhân để bảo mật PII.\n\nBạn có muốn tiếp tục không?",
    ui.ButtonSet.YES_NO
  );

  if (confirm !== ui.Button.YES) return;

  try {
    setupCoursesTab(ss);
    setupCurriculumTab(ss);
    setupPackagesPricingTab(ss);
    setupStudentProjectsTab(ss);
    setupMentorProfilesTab(ss);
    setupTestimonialsTab(ss);
    setupFaqsTab(ss);
    setupTrustMetricsTab(ss);
    setupSettingsTab(ss);
    setupBlogPostsTab(ss);
    setupPromotionsTab(ss);

    // Xóa Sheet1 mặc định nếu rỗng
    var sheet1 = ss.getSheetByName("Sheet1") || ss.getSheetByName("Trang tính1");
    if (sheet1 && ss.getSheets().length > 1) {
      try { ss.deleteSheet(sheet1); } catch (e) {}
    }

    ui.alert(
      "🎉 Cài Đặt Hoàn Tất 100%!",
      "Đã khởi tạo thành công 11 Tab nội dung CMS Content Master.\nTrang tính này an toàn tuyệt đối để chia sẻ cho các biên tập viên nội dung!",
      ui.ButtonSet.OK
    );
  } catch (err) {
    ui.alert("❌ Lỗi Khi Cài Đặt", err.toString(), ui.ButtonSet.OK);
  }
}

/**
 * Khởi tạo Tab Leads CRM trên Spreadsheet 2 (Private Leads & CRM)
 * Chuẩn hóa 100% theo thiết kế Figma Node 12-3320 với Dropdown Selection.
 */
function setupDedicatedLeadsSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();

  var confirm = ui.alert(
    "🔒 Khởi Tạo Bảng Leads CRM Chuẩn Figma 12-3320 (Spreadsheet 2)",
    "Thao tác này sẽ tạo bảng 'leads' với 13 cột chuyên biệt cho quản trị tuyển sinh và chăm sóc khách hàng:\n" +
    "- Cột Dropdown: Khóa coaching quan tâm (SQL, Looker Studio, Combo, 1-1)\n" +
    "- Cột Dropdown: Cam kết xuất hiện đúng giờ\n" +
    "- Cột Dropdown: Trạng thái Lead CRM (NEW, CONTACTING, CONSULTED, ENROLLED, DROPPED, SPAM)\n" +
    "- Cột: Ghi chú tư vấn, Phân công tư vấn viên, Kênh đăng ký (source)\n\n" +
    "Bạn có muốn tiếp tục không?",
    ui.ButtonSet.YES_NO
  );

  if (confirm !== ui.Button.YES) return;

  try {
    setupLeadsDatabaseSpreadsheet(ss, "leads");

    ui.alert(
      "🎉 Cài Đặt Thành Công!",
      "Đã thiết lập xong bảng Leads CRM bảo mật PII trên trang tính này!\n" +
      "Bạn có thể sao chép ID của Spreadsheet này và dùng lệnh [🔗 Cài Đặt ID Spreadsheet Leads Riêng] trên file CMS Content để liên kết.",
      ui.ButtonSet.OK
    );
  } catch (err) {
    ui.alert("❌ Lỗi Khi Cài Đặt", err.toString(), ui.ButtonSet.OK);
  }
}

/**
 * Helper: Tạo hoặc định dạng lại dòng tiêu đề header
 */
function getOrCreateSheetWithHeader(ss, sheetName, headers, headerColor) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setBackground(headerColor || "#1F242F")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontSize(10)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);
  return sheet;
}

/**
 * TAB 1: courses (Khóa học)
 */
function setupCoursesTab(ss) {
  var headers = [
    "id", "title", "slug", "tag", "tagline",
    "tuition_vnd", "original_tuition_vnd", "duration",
    "level", "is_active", "is_featured", "sort_order",
    "description", "cover_image_url", "start_date", "end_date"
  ];
  var sheet = getOrCreateSheetWithHeader(ss, "courses", headers, "#8B1D2C");

  var booleanRule = SpreadsheetApp.newDataValidation().requireValueInList(["TRUE", "FALSE"], true).build();
  sheet.getRange("J2:J100").setDataValidation(booleanRule);
  sheet.getRange("K2:K100").setDataValidation(booleanRule);

  var tagRule = SpreadsheetApp.newDataValidation().requireValueInList(["SQL", "Dashboard", "Python", "End-to-End"], true).build();
  sheet.getRange("D2:D100").setDataValidation(tagRule);

  var levelRule = SpreadsheetApp.newDataValidation().requireValueInList(["Beginner", "Intermediate", "Advanced"], true).build();
  sheet.getRange("I2:I100").setDataValidation(levelRule);

  sheet.getRange("F2:G100").setNumberFormat("#,##0 \"đ\"");

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "end-to-end-analytics",
      "End-to-End Analytics with SQL & Dashboard",
      "end-to-end-analytics",
      "End-to-End",
      "Xây dựng nền tảng Data Analytics toàn diện từ truy vấn đến trực quan hóa",
      5690000, 6780000, "27 buổi",
      "Beginner", true, true, 1,
      "Xây dựng nền tảng Data Analytics toàn diện, từ truy vấn và xử lý dữ liệu với SQL đến tư duy phân tích, trực quan hóa và thiết kế Dashboard hoàn chỉnh cho doanh nghiệp.",
      "/assets/figma/c4ad4d89a999588201cc5ccd2a39ca7dd43febe3.png",
      "2026-03-15",
      "2026-05-30"
    ]);

    sheet.appendRow([
      "sql-for-data-analytics",
      "Khóa SQL for Data Analytics",
      "sql-for-data-analytics",
      "SQL",
      "Làm quen với Database và SQL, xây dựng khả năng truy vấn và tổng hợp dữ liệu",
      2990000, 3500000, "12 buổi",
      "Beginner", true, true, 2,
      "Làm quen với Database và SQL, xây dựng khả năng truy vấn, lọc, biến đổi và tối ưu dữ liệu từ các hệ thống cơ sở dữ liệu lớn trong thực tế doanh nghiệp.",
      "/assets/figma/05ab7dcc030820120da8f65c6b464967f554e0d8.png",
      "2026-03-20",
      "2026-04-30"
    ]);

    sheet.appendRow([
      "data-analytical-thinking",
      "Khóa Data Analytical Thinking",
      "data-analytical-thinking",
      "Dashboard",
      "Học cách xác định vấn đề, lựa chọn metrics, phân tích dữ liệu và thiết kế báo cáo",
      3790000, 4500000, "15 buổi",
      "Intermediate", true, true, 3,
      "Học cách xác định vấn đề kinh doanh, phân rã chỉ số (Metrics Tree), phân tích dữ liệu chuyên sâu và trực quan hóa Dashboard phục vụ quyết định quản trị.",
      "/assets/figma/b1c9fe6fd2d3dafb5b4b32d30320f68d7cde1f5c.png",
      "2026-04-05",
      "2026-05-20"
    ]);
  }
}

/**
 * TAB 2: curriculum (Đề cương & Lộ trình chi tiết theo từng Buổi học)
 */
function setupCurriculumTab(ss) {
  var headers = [
    "id", "course_id", "course_name", "week", "day", "date",
    "session_title", "session_desc", "sub_content", "duration", "sort_order"
  ];
  var sheet = getOrCreateSheetWithHeader(ss, "curriculum", headers, "#8B1D2C");

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "cur-sql-01",
      "sql-for-data-analytics",
      "SQL for Data Analytics: Từ Cơ Bản Đến Nâng Cao",
      1,
      1,
      "TH10 03",
      "Buổi 1: Làm quen Database & Cú pháp truy vấn cơ bản",
      "Hiểu kiến trúc Relational Database, cài đặt DBeaver, thực hành SELECT, WHERE, ORDER BY, GROUP BY.",
      "Tổng quan về cơ sở dữ liệu quan hệ (RDBMS) trong doanh nghiệp\nCài đặt DBeaver và kết nối hệ quản trị PostgreSQL / MySQL\nCú pháp SELECT, ALIAS, DISTINCT, toán tử lọc WHERE, AND/OR/IN/BETWEEN\nThực hành truy vấn cơ bản trên bộ dữ liệu E-commerce thực tế",
      "3 giờ",
      1
    ]);
    sheet.appendRow([
      "cur-sql-02",
      "sql-for-data-analytics",
      "SQL for Data Analytics: Từ Cơ Bản Đến Nâng Cao",
      1,
      2,
      "TH10 05",
      "Buổi 2: Các hàm biến đổi dữ liệu (Scalar & Aggregate Functions)",
      "Xử lý chuỗi văn bản, ngày tháng, ép kiểu CAST và tính toán tổng hợp SUM/AVG/COUNT.",
      "Xử lý chuỗi với LIKE, CONCAT, SUBSTRING, TRIM, UPPER/LOWER\nXử lý ngày tháng chuyên sâu: DATE_TRUNC, EXTRACT, INTERVAL\nPhân nhóm và tính toán tổng hợp với GROUP BY và điều kiện lọc HAVING\nBài tập tính doanh thu theo tháng và tần suất mua sắm",
      "3 giờ",
      2
    ]);
    sheet.appendRow([
      "cur-sql-03",
      "sql-for-data-analytics",
      "SQL for Data Analytics: Từ Cơ Bản Đến Nâng Cao",
      2,
      3,
      "TH10 26",
      "Buổi 3: Kết hợp bảng nâng cao với JOINs (INNER, LEFT, RIGHT, FULL)",
      "Tư duy quan hệ dữ liệu nhiều bảng, liên kết dữ liệu khách hàng, đơn hàng và sản phẩm.",
      "Mô hình Entity-Relationship (ERD) và khóa chính (PK) / khóa ngoại (FK)\nBản chất đại số của INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN\nXử lý bẫy NULL values và phép nhân Cartesian (Cartesian Explosion)\nThực hành trích xuất dữ liệu tổng hợp đa chiều từ 5 bảng liên kết",
      "3 giờ",
      3
    ]);
    sheet.appendRow([
      "cur-sql-04",
      "sql-for-data-analytics",
      "SQL for Data Analytics: Từ Cơ Bản Đến Nâng Cao",
      2,
      4,
      "TH10 28",
      "Buổi 4: Bài thực hành 1 (Hands-on Lab 1) - Báo cáo Doanh thu & Giỏ hàng",
      "Tự tay viết script phân tích toàn bộ quy trình giỏ hàng, doanh số và tỉ lệ drop-off.",
      "Đọc yêu cầu bài toán kinh doanh từ Stakeholder\nXác định bảng nguồn, viết truy vấn kết nối đơn hàng, coupon, hoàn trả\nTính toán AOV (Average Order Value) và tỉ lệ áp mã giảm giá\nMentor review code trực tiếp và chỉ ra các lỗi logic thường gặp",
      "3 giờ",
      4
    ]);
  }
}

/**
 * TAB 3: packages_pricing (Gói Combo & Học phí)
 */
function setupPackagesPricingTab(ss) {
  var headers = [
    "id", "package_id", "name", "original_price", "sale_price",
    "badge", "features_list", "is_popular", "is_active", "sort_order"
  ];
  var sheet = getOrCreateSheetWithHeader(ss, "packages_pricing", headers, "#1F242F");

  var booleanRule = SpreadsheetApp.newDataValidation().requireValueInList(["TRUE", "FALSE"], true).build();
  sheet.getRange("H2:H100").setDataValidation(booleanRule);
  sheet.getRange("I2:I100").setDataValidation(booleanRule);
  sheet.getRange("D2:E100").setNumberFormat("#,##0 \"đ\"");

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "pkg-combo-e2e", "combo-end-to-end-analytics", "End-to-End Analytics with SQL & Dashboard",
      6780000, 5690000, "TIẾT KIỆM ~16%",
      "Lộ trình được thiết kế sẵn từ A-Z\nNội dung nối tiếp mạch lạc thực chiến\nTiết kiệm lên đến 1,080,000vnđ\nCommunity với hơn 1,200+ members\nUpdate nội dung kiến thức trọn đời",
      true, true, 1
    ]);
    sheet.appendRow([
      "pkg-sql-single", "single-sql-course", "Khóa SQL for Data Analytics",
      3500000, 2990000, "Khóa Lẻ",
      "12 buổi học trực tiếp qua Google Meet\nTruy vấn & xử lý dữ liệu thực chiến\nThực hành với dataset từ doanh nghiệp\nHỗ trợ sửa bài tập 1-1 qua nhóm học tập",
      false, true, 2
    ]);
    sheet.appendRow([
      "pkg-thinking-single", "single-analytical-thinking", "Khóa Data Analytical Thinking",
      4500000, 3790000, "Khóa Lẻ",
      "15 buổi học tư duy phân tích số liệu\nXây dựng Metrics Tree và Business Case Study\nThiết kế Dashboard trực quan cho C-Level\nHoàn thiện 01 Capstone Project chuẩn Portfolio",
      false, true, 3
    ]);
  }
}

/**
 * TAB 4: student_projects (Dự án Học viên Tiêu biểu theo PRD M05)
 */
function setupStudentProjectsTab(ss) {
  var headers = [
    "project_id", "title", "category", "author_name",
    "tools", "metrics", "image_url", "sort_order", "is_active"
  ];
  var sheet = getOrCreateSheetWithHeader(ss, "student_projects", headers, "#1F242F");

  var booleanRule = SpreadsheetApp.newDataValidation().requireValueInList(["TRUE", "FALSE"], true).build();
  sheet.getRange("I2:I100").setDataValidation(booleanRule);

  var categoryRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["E-commerce", "Entertainment", "Finance", "Healthcare", "EdTech", "Logistics"], false)
    .build();
  sheet.getRange("C2:C100").setDataValidation(categoryRule);

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "proj-ecommerce-retention", "E-Commerce Cohort Retention Analysis", "E-commerce",
      "Trần Minh Đức (K7)", "SQL, Cohort Analysis, Power BI",
      "Tối ưu hóa tỷ lệ giữ chân khách hàng (Retention Rate) tăng 18% sau 30 ngày",
      "/assets/figma/2643f19ffd20e9e83bc82fe8862b51f3796c7604.png", 1, true
    ]);
    sheet.appendRow([
      "proj-fintech-churn", "Fintech Customer Churn & Early Warning Dashboard", "Finance",
      "Lê Phương Thảo (K8)", "SQL, Data Studio, Metrics Tree",
      "Dự báo sớm 85% nhóm người dùng có nguy cơ rời bỏ ứng dụng ví điện tử",
      "/assets/figma/973e833b234c55daebe419eefe02eb6e80f7d86d.png", 2, true
    ]);
    sheet.appendRow([
      "proj-logistics-sla", "Logistics Delivery SLA & Route Optimization", "Logistics",
      "Nguyễn Hải Đăng (K7)", "SQL, Power BI, DAX",
      "Cắt giảm 14% thời gian giao hàng trễ giờ cao điểm cho mạng lưới 120 bưu cục",
      "/assets/figma/f0920e49e6a571ac94250b3258b77d8c976423b6.png", 3, true
    ]);
    sheet.appendRow([
      "proj-retail-sales-funnel", "Retail Sales Funnel & Inventory KPI Report", "E-commerce",
      "Phạm Hồng Nhung (K9)", "Google Sheets, SQL, Data Studio",
      "Phát hiện 22% mặt hàng tồn kho chậm luân chuyển, tiết kiệm chi phí lưu kho",
      "/assets/figma/cf9dcd253d74531ef55b272e2e080b01e9bbd6bb.png", 4, true
    ]);
    sheet.appendRow([
      "proj-banking-credit-risk", "Banking Risk Assessment & Loan Default Analysis", "Finance",
      "Vũ Quang Huy (K8)", "SQL, Python, Power BI",
      "Phân tầng rủi ro tín dụng và giảm thiểu 9% nợ xấu phát sinh cho ngân hàng",
      "/assets/figma/1af45d712faebc37b4905756835680a337298304.png", 5, true
    ]);
    sheet.appendRow([
      "proj-marketing-attribution", "Marketing Campaign ROI & Multi-touch Attribution", "E-commerce",
      "Hoàng Mai Linh (K6)", "SQL, Power BI, Google Analytics 4",
      "Tái phân bổ ngân sách quảng cáo giúp tăng ROAS thêm 26% trên toàn kênh",
      "/assets/figma/c0aae3c5c5404ee626ce858087d79649de2e3dc1.png", 6, true
    ]);
    sheet.appendRow([
      "proj-executive-overview", "Executive Business Overview & C-Level Cockpit", "Finance",
      "Đặng Tuấn Kiệt (K8)", "Power BI, DAX, SQL",
      "Báo cáo quản trị tổng quan tích hợp Real-time phục vụ trực tiếp cho Ban Giám Đốc",
      "/assets/figma/b1c9fe6fd2d3dafb5b4b32d30320f68d7cde1f5c.png", 7, true
    ]);
    sheet.appendRow([
      "proj-powerbi-operational", "Power BI End-to-End Operational Performance Report", "Logistics",
      "Ngô Thu Trang (K9)", "Power BI, SQL, Data Modeling",
      "Tự động hóa 100% quy trình tổng hợp số liệu tuần, tiết kiệm 12 giờ làm việc thủ công",
      "/assets/figma/c4ad4d89a999588201cc5ccd2a39ca7dd43febe3.png", 8, true
    ]);
    sheet.appendRow([
      "proj-supply-chain-tracker", "Supply Chain Real-Time Health & Fulfillment Tracker", "Logistics",
      "Bùi Quốc Bảo (K7)", "SQL, Data Studio, Google Sheet API",
      "Giám sát tiến độ hoàn tất đơn hàng đạt 98.6% tỷ lệ giao đúng hẹn cam kết",
      "/assets/figma/05ab7dcc030820120da8f65c6b464967f554e0d8.png", 9, true
    ]);
  }
}

/**
 * TAB 5: mentor_profiles (Hồ sơ giảng viên)
 */
function setupMentorProfilesTab(ss) {
  var headers = [
    "id", "name", "title", "bio", "companies_worked",
    "avatar_url", "linkedin_url", "is_active"
  ];
  var sheet = getOrCreateSheetWithHeader(ss, "mentor_profiles", headers, "#1F242F");

  var booleanRule = SpreadsheetApp.newDataValidation().requireValueInList(["TRUE", "FALSE"], true).build();
  sheet.getRange("H2:H100").setDataValidation(booleanRule);

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "mentor-ly-hua", "Hứa Thảo Ly", "Lead Mentor & Founder DataWithLy",
      "Hơn 7 năm kinh nghiệm thực chiến trong ngành Dữ liệu tại các tập đoàn công nghệ và tài chính hàng đầu Việt Nam. Từng trực tiếp xây dựng hạ tầng báo cáo phục vụ hàng triệu người dùng.",
      "MoMo, Tiki, ACB Bank",
      "/uploads/mentors/ly-hua.jpg", "https://linkedin.com/in/lyhuadata", true
    ]);
  }
}

/**
 * TAB 6: testimonials (Đánh giá học viên)
 */
function setupTestimonialsTab(ss) {
  var headers = [
    "id", "student_name", "role", "company", "avatar_url",
    "course_id", "rating", "review_text", "is_featured", "is_active"
  ];
  var sheet = getOrCreateSheetWithHeader(ss, "testimonials", headers, "#1F242F");

  var ratingRule = SpreadsheetApp.newDataValidation().requireValueInList(["5", "4", "3", "2", "1"], true).build();
  sheet.getRange("G2:G100").setDataValidation(ratingRule);

  var booleanRule = SpreadsheetApp.newDataValidation().requireValueInList(["TRUE", "FALSE"], true).build();
  sheet.getRange("I2:J100").setDataValidation(booleanRule);

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "testi-01", "Nguyễn Văn Huy", "Khóa SQL for Data Analytics", "MoMo",
      "/assets/figma/e40866062bc7c3587c903859bd52be66623217cc.png", "sql-for-data-analytics", "5",
      "Khóa học rất thực chiến. Trước đây mình tự học SQL trên mạng bị rời rạc, sau khóa của cô Ly mình đã tự tin viết subquery, window functions và tối ưu truy vấn cho công ty.",
      true, true
    ]);
    sheet.appendRow([
      "testi-02", "Trần Minh Anh", "Khóa Data Analytical Thinking", "Tiki",
      "/assets/figma/2fc0a1c70056162f5d32de1029e4b71d620e97c4.png", "data-analytical-thinking", "5",
      "Tư duy phân tích số liệu của chị Ly thực sự mở mang góc nhìn của mình. Mình học được cách đặt câu hỏi 'Tại sao số này giảm?' và biến số liệu thô thành đề xuất tăng doanh thu.",
      true, true
    ]);
    sheet.appendRow([
      "testi-03", "Lê Hoàng Phúc", "Combo End-to-End Analytics", "Shopee Express",
      "/assets/figma/2a57d0c1a2a65bb9e121f9545459faf7c1b50587.png", "end-to-end-analytics", "5",
      "Học trọn gói cả SQL và Dashboard là quyết định đúng đắn nhất của mình. Sau khi hoàn thành final project, mình đã đậu vị trí Junior Data Analyst tại Shopee.",
      true, true
    ]);
    sheet.appendRow([
      "testi-04", "Phạm Hải Đăng", "Khóa SQL for Data Analytics", "Techcombank",
      "/assets/figma/b2b53a3cd8b4e6f2cfcc039b89d51637f8421060.png", "sql-for-data-analytics", "5",
      "Cách truyền đạt của Mentor rất dễ hiểu, không hàn lâm. Bài tập bám sát case study thực tế từ sàn thương mại điện tử và ngân hàng.",
      true, true
    ]);
    sheet.appendRow([
      "testi-05", "Đặng Thuỳ Dương", "Khóa Data Analytical Thinking", "FPT Software",
      "/assets/figma/1af45d712faebc37b4905756835680a337298304.png", "data-analytical-thinking", "5",
      "Mentor cực kỳ tận tâm, sửa bài 1:1 chi tiết từng dòng metric. Nhờ đó mình sửa được tư duy làm dashboard chỉ để cho đẹp sang dashboard giải quyết bài toán kinh doanh.",
      true, true
    ]);
    sheet.appendRow([
      "testi-06", "Vũ Bảo Nam", "Combo End-to-End Analytics", "MB Bank",
      "/assets/figma/f0920e49e6a571ac94250b3258b77d8c976423b6.png", "end-to-end-analytics", "5",
      "Kiến thức nối tiếp rất mượt mà. Đội ngũ trợ giảng hỗ trợ support thắc mắc nhanh chóng cả ngày lẫn đêm. Rất recommend mọi người tham gia!",
      true, true
    ]);
  }
}

/**
 * TAB 7: faqs (Câu hỏi thường gặp)
 */
function setupFaqsTab(ss) {
  var headers = [
    "id", "category", "question", "answer", "is_active", "sort_order"
  ];
  var sheet = getOrCreateSheetWithHeader(ss, "faqs", headers, "#1F242F");

  var categoryRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["CHUNG", "LỊCH HỌC", "HỌC PHÍ", "ĐẦU RA"], true)
    .build();
  sheet.getRange("B2:B100").setDataValidation(categoryRule);

  var booleanRule = SpreadsheetApp.newDataValidation().requireValueInList(["TRUE", "FALSE"], true).build();
  sheet.getRange("E2:E100").setDataValidation(booleanRule);

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "faq-1", "CHUNG", "Người trái ngành, chưa từng học IT có theo học được không?",
      "Hoàn toàn được! Lộ trình của DataWithLy được thiết kế đi từ con số 0, bắt đầu từ tư duy dữ liệu thực tế và các công cụ dễ tiếp cận trước khi đi vào chuyên sâu.",
      true, 1
    ]);
    sheet.appendRow([
      "faq-2", "LỊCH HỌC", "Nếu bận đột xuất có được xem lại bài giảng không?",
      "Tất cả các buổi học Online qua Google Meet đều được ghi hình lại (Record) với độ phân giải cao và tải lên hệ thống học tập kèm tài liệu để bạn có thể xem lại bất kỳ lúc nào.",
      true, 2
    ]);
  }
}

/**
 * Alias tương thích ngược cho setupFIBTab
 */
function setupFIBTab(ss) {
  return setupFaqsTab(ss);
}

/**
 * TAB 8: trust_metrics (Chỉ số uy tín)
 */
function setupTrustMetricsTab(ss) {
  var headers = [
    "metric_key", "number_display", "label", "icon_name", "is_active", "sort_order"
  ];
  var sheet = getOrCreateSheetWithHeader(ss, "trust_metrics", headers, "#1F242F");

  var booleanRule = SpreadsheetApp.newDataValidation().requireValueInList(["TRUE", "FALSE"], true).build();
  sheet.getRange("E2:E100").setDataValidation(booleanRule);

  if (sheet.getLastRow() === 1) {
    sheet.appendRow(["students_count", "500+", "Học viên tốt nghiệp thành công", "Users", true, 1]);
    sheet.appendRow(["employment_rate", "95%", "Học viên có việc làm sau 3 tháng", "Briefcase", true, 2]);
    sheet.appendRow(["satisfaction_score", "4.9/5", "Điểm đánh giá chất lượng trung bình", "Star", true, 3]);
    sheet.appendRow(["mentoring_hours", "2,000+", "Giờ hỗ trợ 1-1 giải đáp thắc mắc", "Clock", true, 4]);
  }
}

/**
 * TAB 9: settings (Cấu hình chung hệ thống)
 */
function setupSettingsTab(ss) {
  var headers = ["key", "value", "description"];
  var sheet = getOrCreateSheetWithHeader(ss, "settings", headers, "#1F242F");

  if (sheet.getLastRow() === 1) {
    sheet.appendRow(["hotline", "(+84) 934 938 431", "Số điện thoại hotline tư vấn tuyển sinh"]);
    sheet.appendRow(["zalo_url", "https://zalo.me/0934938431", "Đường dẫn chat Zalo tư vấn nhanh"]);
    sheet.appendRow(["contact_email", "vietds@gmail.com", "Email nhận thư liên hệ"]);
    sheet.appendRow(["announcement_bar", "Level Up Week: Learn More, Save 75%! - 4 days only! Get 70+ online SQL courses and save up to $450", "Thông báo trên thanh header"]);
    sheet.appendRow(["web_deploy_url", "https://ed-tech-mu-umber.vercel.app", "URL Website Production chính thức trên Vercel"]);
    sheet.appendRow(["active_revalidation_env", "PROD", "Môi trường đồng bộ kích hoạt (PROD hoặc LOCAL)"]);
  }
}

/**
 * TAB 10: blog_posts (Bài viết kiến thức)
 */
function setupBlogPostsTab(ss) {
  var headers = [
    "id", "title", "slug", "category",
    "excerpt", "author_name", "published_at", "is_active"
  ];
  var sheet = getOrCreateSheetWithHeader(ss, "blog_posts", headers, "#1F242F");

  var booleanRule = SpreadsheetApp.newDataValidation().requireValueInList(["TRUE", "FALSE"], true).build();
  sheet.getRange("H2:H100").setDataValidation(booleanRule);

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "blog-sql-meo-can-biet",
      "Các mẹo SQL cần biết trong doanh nghiệp",
      "cac-meo-sql-can-biet", "SQL",
      "Khám phá các mẹo, thủ thuật và câu lệnh SQL hữu ích giúp viết truy vấn ngắn gọn, tối ưu và hiệu quả hơn.",
      "Hứa Thảo Ly", "2026-03-01", true
    ]);
    sheet.appendRow([
      "blog-dashboard-5-giay",
      "Cách thiết kế Dashboard trực quan chỉ trong 5 giây",
      "thiet-ke-dashboard-truc-quan", "Dashboard",
      "Những nguyên lý thị giác quan trọng giúp báo cáo của bạn vừa chuẩn logic kinh doanh vừa đẹp mắt, thuyết phục ban lãnh đạo.",
      "Hứa Thảo Ly", "2026-03-05", true
    ]);
    sheet.appendRow([
      "blog-chuyen-nganh-data-0",
      "Lộ trình chuyển ngành Data Analytics từ con số 0",
      "lo-trinh-chuyen-nganh-data-analyst", "Career",
      "Kinh nghiệm thực chiến từ việc học công cụ, làm portfolio dự án đến cách trả lời câu hỏi phỏng vấn hóc búa.",
      "Hứa Thảo Ly", "2026-03-10", true
    ]);
  }
}

/**
 * TAB LEADS CRM (Chuẩn Figma Node 12-3320): Quản lý khách hàng tiềm năng & Tuyển sinh
 * Thiết kế cho SPREADSHEET 2 (Private Leads & CRM) độc lập để bảo mật tuyệt đối PII.
 * Cột 'coaching_course' có Dropdown Selection chọn Khóa coaching bạn quan tâm.
 */
function setupLeadsDatabaseSpreadsheet(ss, sheetTitle) {
  var targetSs = ss || SpreadsheetApp.getActiveSpreadsheet();
  var name = sheetTitle || "leads";
  var headers = [
    "submission_id", "timestamp", "name", "phone", "email",
    "coaching_course", "target_or_goal", "attendance_commitment",
    "status", "notes", "assigned_to", "source", "updated_at"
  ];
  var sheet = getOrCreateSheetWithHeader(targetSs, name, headers, "#7F1D1D");

  // Dropdown Selection 1: Khóa coaching bạn quan tâm (Figma 12-3320)
  var courseRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(COACHING_COURSES_LIST, true)
    .build();
  sheet.getRange("F2:F500").setDataValidation(courseRule);

  // Dropdown Selection 2: Bạn nhớ xuất hiện đúng giờ hẹn nhé (Figma 12-3320)
  var attendanceRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(ATTENDANCE_COMMITMENTS_LIST, true)
    .build();
  sheet.getRange("H2:H500").setDataValidation(attendanceRule);

  // Dropdown Selection 3: Trạng thái Lead CRM
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(LEAD_STATUSES_LIST, true)
    .build();
  sheet.getRange("I2:I500").setDataValidation(statusRule);

  // Định dạng Plain Text cho cột Số điện thoại để không mất số 0
  sheet.getRange("D2:D500").setNumberFormat("@");

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "sub_sample_figma_001",
      new Date().toISOString(),
      "Nguyễn Hoàng Nam",
      "'0912345678",
      "nam.hoang@gmail.com",
      "SQL for Data Analytics",
      "Chuyển ngành sang Data Analyst trong 3 tháng tới",
      "Tôi chắc chắn",
      "NEW",
      "Học viên mong muốn học ca tối thứ 3 - thứ 5",
      "Mentor Hứa Thảo Ly",
      "homepage_consultation_form",
      new Date().toISOString()
    ]);
  }
  return sheet;
}

/**
 * TAB 11: leads (private) (Bảo mật PII - Tương thích ngược)
 */
function setupLeadsPrivateTab(ss) {
  return setupLeadsDatabaseSpreadsheet(ss, "leads (private)");
}

/**
 * Alias cho Tab 11 leads
 */
function setupLeadsTab(ss) {
  return setupLeadsDatabaseSpreadsheet(ss, "leads");
}

/**
 * TAB 12: promotions (Chương trình Khuyến mãi & Flash Sale)
 */
function setupPromotionsTab(ss) {
  var headers = [
    "id", "code", "title", "discount_type", "discount_value",
    "start_date", "end_date", "applicable_courses", "badge", "is_active", "sort_order"
  ];
  var sheet = getOrCreateSheetWithHeader(ss, "promotions", headers, "#8B1D2C");

  var typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["PERCENT", "FIXED_VND"], true)
    .build();
  sheet.getRange("D2:D100").setDataValidation(typeRule);

  var booleanRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["TRUE", "FALSE"], true)
    .build();
  sheet.getRange("J2:J100").setDataValidation(booleanRule);

  // Định dạng số cho cột discount_value
  sheet.getRange("E2:E100").setNumberFormat("#,##0");

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "promo-earlybird-2026",
      "EARLYBIRD15",
      "Ưu Đãi Đăng Ký Sớm Khóa Mới",
      "PERCENT",
      15,
      "2026-03-01",
      "2026-03-31 23:59:59",
      "ALL",
      "Giảm 15%",
      true,
      1
    ]);
    sheet.appendRow([
      "promo-combovip",
      "COMBOPRO",
      "Voucher Combo Chuyên Gia",
      "FIXED_VND",
      500000,
      "2026-03-01",
      "2026-06-30 23:59:59",
      "sql-for-data-analytics,business-intelligence-powerbi",
      "Giảm 500K",
      true,
      2
    ]);
  }
}

/**
 * NẠP LẠI TOÀN BỘ DỮ LIỆU CHUẨN FIGMA (FORCE RESEED)
 * Xóa trắng các dòng dữ liệu mẫu cũ và ghi đè lại 100% dữ liệu chuẩn Figma sắc nét.
 */
function forceReseedFigmaData() {
  var ui = SpreadsheetApp.getUi();
  var confirm = ui.alert(
    "🌱 Xác Nhận Nạp Lại Dữ Liệu Chuẩn Figma 100%",
    "Thao tác này sẽ xóa các dòng dữ liệu cũ trong 10 Tab (Courses, Curriculum, Packages, Student Projects, Mentors, Testimonials, FAQs, Settings, Blogs, Promotions) và nạp lại toàn bộ dữ liệu mẫu chuẩn Figma (Ảnh bìa 4K, 9 Dự án, 6 Đánh giá học viên).\n\nTab 'leads (private)' sẽ được BẢO TỒN NGUYÊN VẸN 100% không bị xóa.\n\nBạn có muốn tiếp tục không?",
    ui.ButtonSet.YES_NO
  );

  if (confirm !== ui.Button.YES) return;

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var cmsTabs = [
    "courses", "curriculum", "packages_pricing", "student_projects",
    "mentor_profiles", "testimonials", "faqs", "blog_posts", "promotions"
  ];

  for (var i = 0; i < cmsTabs.length; i++) {
    var s = ss.getSheetByName(cmsTabs[i]);
    if (s && s.getLastRow() > 1) {
      s.getRange(2, 1, s.getLastRow() - 1, s.getLastColumn()).clearContent();
    }
  }

  // Gọi lại các hàm setup để nạp dữ liệu chuẩn
  setupCoursesTab(ss);
  setupCurriculumTab(ss);
  setupPackagesPricingTab(ss);
  setupStudentProjectsTab(ss);
  setupMentorProfilesTab(ss);
  setupTestimonialsTab(ss);
  setupFaqsTab(ss);
  setupBlogPostsTab(ss);
  setupPromotionsTab(ss);

  ui.alert(
    "🎉 Nạp Dữ Liệu Thành Công!",
    "Đã cập nhật lại toàn bộ dữ liệu chuẩn Figma 100% vào các Tab Google Sheets.\nBây giờ bạn có thể bấm [⚡ Đồng Bộ Lên Website Ngay Lập Tức] để xuất bản nội dung mới lên Web!",
    ui.ButtonSet.OK
  );
}



