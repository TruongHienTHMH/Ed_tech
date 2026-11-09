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
    "description", "cover_image_url"
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
      "/assets/figma/c4ad4d89a999588201cc5ccd2a39ca7dd43febe3.png"
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
      "/assets/figma/05ab7dcc030820120da8f65c6b464967f554e0d8.png"
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
      "/assets/figma/b1c9fe6fd2d3dafb5b4b32d30320f68d7cde1f5c.png"
    ]);
  }
}

/**
 * TAB 2: curriculum (Đề cương chi tiết theo Khóa học)
 */
function setupCurriculumTab(ss) {
  var headers = [
    "id", "course_id", "course_name", "module_number", "module_title",
    "duration", "lessons_count", "topics_bullets", "sort_order"
  ];
  var sheet = getOrCreateSheetWithHeader(ss, "curriculum", headers, "#8B1D2C");

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "sql-for-data-analytics-mod-1",
      "sql-for-data-analytics",
      "SQL for Data Analytics: Từ Cơ Bản Đến Nâng Cao",
      1,
      "Chương 1: Nền tảng Cơ sở Dữ liệu & Cú pháp SELECT",
      "2 tuần",
      6,
      "Tổng quan về RDBMS, Table, Schema, Primary Key & Foreign Key\nSELECT, WHERE, DISTINCT, ORDER BY, LIMIT\nCác toán tử logic AND, OR, NOT, IN, BETWEEN, LIKE\nBài tập thực hành: Truy vấn bảng đơn hàng E-commerce",
      1
    ]);
    sheet.appendRow([
      "sql-for-data-analytics-mod-2",
      "sql-for-data-analytics",
      "SQL for Data Analytics: Từ Cơ Bản Đến Nâng Cao",
      2,
      "Chương 2: Aggregate Functions & Nhóm Dữ Liệu",
      "2 tuần",
      6,
      "Hàm tính toán COUNT, SUM, AVG, MIN, MAX\nGROUP BY và điều kiện lọc HAVING\nXử lý giá trị NULL (COALESCE, IFNULL)\nBài tập: Tính doanh thu theo từng tháng và danh mục sản phẩm",
      2
    ]);
    sheet.appendRow([
      "sql-for-data-analytics-mod-3",
      "sql-for-data-analytics",
      "SQL for Data Analytics: Từ Cơ Bản Đến Nâng Cao",
      3,
      "Chương 3: Ghép Bảng (JOINs) & Subqueries",
      "2 tuần",
      6,
      "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN\nSelf JOIN và xử lý phân cấp nhân viên/quản lý\nSubqueries trong WHERE, FROM và SELECT\nBài tập: Kết hợp 5 bảng đối soát tài chính ngân hàng",
      3
    ]);
    sheet.appendRow([
      "sql-for-data-analytics-mod-4",
      "sql-for-data-analytics",
      "SQL for Data Analytics: Từ Cơ Bản Đến Nâng Cao",
      4,
      "Chương 4: Phân Tích Chuyên Sâu với Window Functions & CTE",
      "2 tuần",
      6,
      "Common Table Expressions (WITH clause) giúp code sạch và dễ đọc\nROW_NUMBER, RANK, DENSE_RANK\nLEAD, LAG để so sánh kỳ này với kỳ trước (MoM, YoY growth)\nRunning Total & Moving Average\nCapstone Project: Báo cáo retention rate và churn analysis",
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
    sheet.appendRow(["revalidation_prod_url", "https://datawithly.edu.vn/api/revalidate?secret=datawithly_secure_reval_token_2026", "URL Webhook Production làm mới bộ nhớ cache Website"]);
    sheet.appendRow(["revalidation_local_url", "http://localhost:3000/api/revalidate?secret=datawithly_secure_reval_token_2026", "URL Webhook Local / Dev Tunnel làm mới bộ nhớ cache"]);
    sheet.appendRow(["active_revalidation_env", "PROD", "Môi trường đồng bộ kích hoạt (PROD hoặc LOCAL)"]);
    sheet.appendRow(["revalidation_url", "https://datawithly.edu.vn/api/revalidate?secret=datawithly_secure_reval_token_2026", "URL Webhook làm mới bộ nhớ cache của Website (dự phòng)"]);
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
 * TAB 11: leads (private) (Danh sách Lead học viên bảo mật PII)
 */
function setupLeadsPrivateTab(ss) {
  var headers = [
    "submission_id", "timestamp", "name (private)", "phone (private)", "email (private)",
    "course_id", "course_name", "message (private)", "status"
  ];
  var sheet = getOrCreateSheetWithHeader(ss, "leads (private)", headers, "#7F1D1D");

  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["NEW", "CONTACTING", "CONSULTED", "ENROLLED", "DROPPED", "SPAM"], true)
    .build();
  sheet.getRange("I2:I500").setDataValidation(statusRule);

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "sub_sample_001", new Date().toISOString(), "Nguyễn Hoàng Nam (Mẫu)", "'0912345678", "nam.hoang@gmail.com",
      "sql-for-data-analytics", "SQL for Data Analytics", "Muốn tư vấn lịch học buổi tối T3-T5", "NEW"
    ]);
  }
}

/**
 * Alias cho Tab 11 leads
 */
function setupLeadsTab(ss) {
  return setupLeadsPrivateTab(ss);
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



