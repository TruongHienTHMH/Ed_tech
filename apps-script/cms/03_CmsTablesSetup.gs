/**
 * ==============================================================================
 * MODULE 03: KHỞI TẠO 10 TAB CMS CONTENT MASTER (CMS TABLES SETUP)
 * ==============================================================================
 * 1. setupDataWithLyTables(): Tự động tạo 10 Tab chuẩn hóa nội dung Website:
 *    courses, curriculum, packages_pricing, student_projects, mentor_profiles,
 *    testimonials, faqs, trust_metrics, settings, blog_posts.
 * 2. Cấu trúc chuẩn hóa:
 *    - courses: Bổ sung 'course_kind' (Khóa nổi bật, Khóa mới,...), chuyển ngày sang curriculum.
 *    - curriculum: Quản lý 'start_date' và 'end_date' của lộ trình buổi học.
 *    - blog_posts: Bổ sung 'description' (Mô tả ngắn/SEO) và 'content_markdown' (Nội dung chi tiết).
 * ==============================================================================
 */

function setupDataWithLyTables() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();

  var confirm = ui.alert(
    "Khởi Tạo Hệ Thống Bảng DataWithLy CMS Content Master",
    "Hệ thống sẽ tự động tạo đủ 10 Tab chuẩn hóa (Courses, Curriculum, Packages, Student Projects, Mentors, Testimonials, FAQs, Trust Metrics, Settings, Blog Posts) kèm dữ liệu mẫu và Dropdown Validation.\n\nFile này hoàn toàn KHÔNG chứa tab Leads cá nhân để bảo mật PII tuyệt đối.\n\nBạn có muốn tiếp tục không?",
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

    // Xóa Sheet1 mặc định nếu rỗng
    var sheet1 = ss.getSheetByName("Sheet1") || ss.getSheetByName("Trang tính1");
    if (sheet1 && ss.getSheets().length > 1) {
      try { ss.deleteSheet(sheet1); } catch (e) {}
    }

    ui.alert(
      "🎉 Cài Đặt Hoàn Tất 100%!",
      "Đã khởi tạo thành công 10 Tab nội dung CMS Content Master, cài đặt xong Dropdown Validation và nạp dữ liệu mẫu.\n\nBây giờ bạn có thể mở trang Website để kiểm tra đồng bộ ngay!",
      ui.ButtonSet.OK
    );
  } catch (err) {
    ui.alert("❌ Lỗi Khi Cài Đặt", err.toString(), ui.ButtonSet.OK);
  }
}

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
 * TAB 1: courses (Khóa học) - Bổ sung course_kind
 */
function setupCoursesTab(ss) {
  var headers = [
    "id", "title", "slug", "course_kind", "tag", "tagline",
    "tuition_vnd", "original_tuition_vnd", "duration",
    "level", "is_active", "is_featured", "sort_order",
    "description", "cover_image_url"
  ];
  var sheet = getOrCreateSheetWithHeader(ss, "courses", headers, "#8B1D2C");

  var kindRule = SpreadsheetApp.newDataValidation().requireValueInList(COURSE_KINDS_LIST, true).build();
  sheet.getRange("D2:D100").setDataValidation(kindRule);

  var tagRule = SpreadsheetApp.newDataValidation().requireValueInList(["SQL", "Dashboard", "Python", "End-to-End"], true).build();
  sheet.getRange("E2:E100").setDataValidation(tagRule);

  var levelRule = SpreadsheetApp.newDataValidation().requireValueInList(["Beginner", "Intermediate", "Advanced"], true).build();
  sheet.getRange("J2:J100").setDataValidation(levelRule);

  var booleanRule = SpreadsheetApp.newDataValidation().requireValueInList(["TRUE", "FALSE"], true).build();
  sheet.getRange("K2:K100").setDataValidation(booleanRule);
  sheet.getRange("L2:L100").setDataValidation(booleanRule);

  sheet.getRange("G2:H100").setNumberFormat("#,##0 \"đ\"");

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "end-to-end-analytics",
      "End-to-End Analytics with SQL & Dashboard",
      "end-to-end-analytics",
      "Khóa học nổi bật",
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
      "Khóa học nền tảng",
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
      "Khóa học chuyên sâu",
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
 * TAB 2: curriculum (Lộ trình chi tiết từng buổi học & Quản lý thời gian bắt đầu/kết thúc)
 */
function setupCurriculumTab(ss) {
  var headers = [
    "id", "course_id", "course_name", "start_date", "end_date",
    "week", "day", "date", "session_title", "session_desc", "sub_content", "duration", "sort_order"
  ];
  var sheet = getOrCreateSheetWithHeader(ss, "curriculum", headers, "#8B1D2C");

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "cur-sql-01",
      "sql-for-data-analytics",
      "SQL for Data Analytics: Từ Cơ Bản Đến Nâng Cao",
      "2026-03-20",
      "2026-04-30",
      1, 1, "TH10 03",
      "Buổi 1: Làm quen Database & Cú pháp truy vấn cơ bản",
      "Hiểu kiến trúc Relational Database, cài đặt DBeaver, thực hành SELECT, WHERE, ORDER BY, GROUP BY.",
      "Tổng quan về cơ sở dữ liệu quan hệ (RDBMS) trong doanh nghiệp\nCài đặt DBeaver và kết nối hệ quản trị PostgreSQL / MySQL\nCú pháp SELECT, ALIAS, DISTINCT, toán tử lọc WHERE, AND/OR/IN/BETWEEN\nThực hành truy vấn cơ bản trên bộ dữ liệu E-commerce thực tế",
      "3 giờ", 1
    ]);
    sheet.appendRow([
      "cur-sql-02",
      "sql-for-data-analytics",
      "SQL for Data Analytics: Từ Cơ Bản Đến Nâng Cao",
      "2026-03-20",
      "2026-04-30",
      1, 2, "TH10 05",
      "Buổi 2: Các hàm biến đổi dữ liệu (Scalar & Aggregate Functions)",
      "Xử lý chuỗi văn bản, ngày tháng, ép kiểu CAST và tính toán tổng hợp SUM/AVG/COUNT.",
      "Xử lý chuỗi với LIKE, CONCAT, SUBSTRING, TRIM, UPPER/LOWER\nXử lý ngày tháng chuyên sâu: DATE_TRUNC, EXTRACT, INTERVAL\nPhân nhóm và tính toán tổng hợp với GROUP BY và điều kiện lọc HAVING\nBài tập tính doanh thu theo tháng và tần suất mua sắm",
      "3 giờ", 2
    ]);
    sheet.appendRow([
      "cur-sql-03",
      "sql-for-data-analytics",
      "SQL for Data Analytics: Từ Cơ Bản Đến Nâng Cao",
      "2026-03-20",
      "2026-04-30",
      2, 3, "TH10 26",
      "Buổi 3: Kết hợp bảng nâng cao với JOINs (INNER, LEFT, RIGHT, FULL)",
      "Tư duy quan hệ dữ liệu nhiều bảng, liên kết dữ liệu khách hàng, đơn hàng và sản phẩm.",
      "Mô hình Entity-Relationship (ERD) và khóa chính (PK) / khóa ngoại (FK)\nBản chất đại số của INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN\nXử lý bẫy NULL values và phép nhân Cartesian (Cartesian Explosion)\nThực hành trích xuất dữ liệu tổng hợp đa chiều từ 5 bảng liên kết",
      "3 giờ", 3
    ]);
    sheet.appendRow([
      "cur-sql-04",
      "sql-for-data-analytics",
      "SQL for Data Analytics: Từ Cơ Bản Đến Nâng Cao",
      "2026-03-20",
      "2026-04-30",
      2, 4, "TH10 28",
      "Buổi 4: Bài thực hành 1 (Hands-on Lab 1) - Báo cáo Doanh thu & Giỏ hàng",
      "Tự tay viết script phân tích toàn bộ quy trình giỏ hàng, doanh số và tỉ lệ drop-off.",
      "Đọc yêu cầu bài toán kinh doanh từ Stakeholder\nXác định bảng nguồn, viết truy vấn kết nối đơn hàng, coupon, hoàn trả\nTính toán AOV (Average Order Value) và tỉ lệ áp mã giảm giá\nMentor review code trực tiếp và chỉ ra các lỗi logic thường gặp",
      "3 giờ", 4
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
 * TAB 4: student_projects (Dự án Học viên Tiêu biểu)
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
  }
}

/**
 * TAB 5: mentor_profiles (Hồ sơ giảng viên & About Us)
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

function setupFIBTab(ss) {
  return setupFaqsTab(ss);
}

/**
 * TAB 8: trust_metrics (Chỉ số uy tín & Thống kê)
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
 * TAB 10: blog_posts (Bài viết kiến thức & Blog) - Bổ sung description & content_markdown
 */
function setupBlogPostsTab(ss) {
  var headers = [
    "id", "title", "slug", "category",
    "description", "excerpt", "content_markdown", "cover_image_url",
    "author_name", "author_avatar_url", "published_at", "is_active"
  ];
  var sheet = getOrCreateSheetWithHeader(ss, "blog_posts", headers, "#1F242F");

  var booleanRule = SpreadsheetApp.newDataValidation().requireValueInList(["TRUE", "FALSE"], true).build();
  sheet.getRange("L2:L100").setDataValidation(booleanRule);

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "blog-sql-meo-can-biet",
      "Các mẹo SQL cần biết trong doanh nghiệp",
      "cac-meo-sql-can-biet", "SQL",
      "Khám phá các mẹo, thủ thuật và câu lệnh SQL tối ưu giúp tăng tốc độ truy vấn cơ sở dữ liệu lớn.",
      "Khám phá các mẹo, thủ thuật và câu lệnh SQL hữu ích giúp viết truy vấn ngắn gọn, tối ưu và hiệu quả hơn.",
      "## 1. Giới thiệu SQL trong doanh nghiệp\nSQL là kỹ năng nền tảng cho mọi Data Analyst. Việc tối ưu truy vấn giúp tiết kiệm tài nguyên hệ thống đáng kể.\n\n## 2. Các mẹo tối ưu phổ biến\n- Tránh sử dụng `SELECT *` trong môi trường Production.\n- Luôn tạo Index trên các cột thường xuyên lọc trong `WHERE` và `JOIN`.\n- Tận dụng `Common Table Expressions (CTE)` thay cho Subquery phức tạp.",
      "/assets/figma/c4ad4d89a999588201cc5ccd2a39ca7dd43febe3.png",
      "Hứa Thảo Ly", "/uploads/mentors/ly-hua.jpg", "2026-03-01", true
    ]);
    sheet.appendRow([
      "blog-dashboard-5-giay",
      "Cách thiết kế Dashboard trực quan chỉ trong 5 giây",
      "thiet-ke-dashboard-truc-quan", "Dashboard",
      "Nguyên lý thị giác và thiết kế Dashboard báo cáo C-Level chuẩn logic kinh doanh.",
      "Những nguyên lý thị giác quan trọng giúp báo cáo của bạn vừa chuẩn logic kinh doanh vừa đẹp mắt, thuyết phục ban lãnh đạo.",
      "## Nguyên tắc 5 giây trong thiết kế Dashboard\nMột Dashboard tốt phải trả lời được câu hỏi kinh doanh cốt lõi trong vòng 5 giây đầu tiên khi người xem nhìn vào.\n\n### 3 Yếu tố cốt lõi:\n1. Phân tầng thị giác rõ ràng.\n2. Lựa chọn đúng biểu đồ phù hợp loại dữ liệu.\n3. Nhấn mạnh chỉ số quan trọng (North Star Metric).",
      "/assets/figma/05ab7dcc030820120da8f65c6b464967f554e0d8.png",
      "Hứa Thảo Ly", "/uploads/mentors/ly-hua.jpg", "2026-03-05", true
    ]);
  }
}

/**
 * TAB 11: promotions (Chương trình Khuyến mãi & Flash Sale)
 */
function setupPromotionsTab(ss) {
  var headers = [
    "id", "code", "title", "discount_type", "discount_value",
    "start_date", "end_date", "applicable_courses", "badge", "is_active", "sort_order"
  ];
  var sheet = getOrCreateSheetWithHeader(ss, "promotions", headers, "#8B1D2C");

  var typeRule = SpreadsheetApp.newDataValidation().requireValueInList(["PERCENT", "FIXED_VND"], true).build();
  sheet.getRange("D2:D100").setDataValidation(typeRule);

  var booleanRule = SpreadsheetApp.newDataValidation().requireValueInList(["TRUE", "FALSE"], true).build();
  sheet.getRange("J2:J100").setDataValidation(booleanRule);

  sheet.getRange("E2:E100").setNumberFormat("#,##0");

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "promo-earlybird-2026", "EARLYBIRD15", "Ưu Đãi Đăng Ký Sớm Khóa Mới",
      "PERCENT", 15, "2026-03-01", "2026-03-31 23:59:59",
      "ALL", "Giảm 15%", true, 1
    ]);
  }
}

/**
 * NẠP LẠI DỮ LIỆU MẪU CHUẨN FIGMA (FORCE RESEED)
 */
function forceReseedFigmaData() {
  var ui = SpreadsheetApp.getUi();
  var confirm = ui.alert(
    "🌱 Xác Nhận Nạp Lại Dữ Liệu Chuẩn Figma 100%",
    "Thao tác này sẽ làm mới toàn bộ 11 Tab nội dung CMS Content Master về trạng thái mẫu chuẩn Figma.\n\nBạn có muốn tiếp tục không?",
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
    "Đã cập nhật lại toàn bộ dữ liệu chuẩn Figma vào các Tab CMS Content.\nBây giờ bạn có thể bấm [⚡ Đồng Bộ Lên Website Ngay Lập Tức] để cập nhật Website!",
    ui.ButtonSet.OK
  );
}
