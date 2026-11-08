/**
 * ==============================================================================
 * DATAWITHLY CMS - GOOGLE APPS SCRIPT CORE ENTRYPOINT (Code.gs)
 * ==============================================================================
 * Hệ thống Quản trị Nội dung Giáo dục DataWithLy (Mentor Hứa Thảo Ly).
 * Kiến trúc Modular:
 *   - 00_Config.gs: Cấu hình biến môi trường qua Script Properties (Zero Hardcoded Secret)
 *   - 01_SlugUtils.gs: Thuật toán SEO Slug & Auto-versioning (-v1, -v2...)
 *   - 02_MenuAndTriggers.gs: Thanh Menu điều khiển & Trigger onOpen / onEdit
 *   - 03_TablesSetup.gs: Tự động khởi tạo 11 Tab chuẩn hóa kèm dữ liệu mẫu
 *   - 04_WebAppEndpoints.gs: REST API Webhook (doGet / doPost)
 *   - 05_CourseModal.gs -> 14_BlogModal.gs: Các Modals nghiệp vụ
 *   - *.html: Giao diện HTML Modals bản địa (CourseModal, BlogModal, SharedStyles...)
 *   - 06_Maintenance.gs: Công cụ bảo trì, Linter & Thông báo tức thì
 * ==============================================================================
 */

/**
 * Hàm nhúng giao diện HTML (Ví dụ: nhúng SharedStyles.html vào các Modal)
 * Gọi trực tiếp từ file *.html bản địa trong project Apps Script.
 * @param {string} filename - Tên file HTML cần nhúng (bỏ đuôi .html)
 * @return {string} Nội dung HTML/CSS
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Nạp template HTML cho các cửa sổ Modal Dialog
 * Tự động tìm và biên dịch từ file *.html tương ứng trong thư mục apps-script.
 * @param {string} templateName - Tên template (ví dụ: 'CourseModal', 'BlogModal')
 * @return {HtmlTemplate}
 */
function createModalTemplate(templateName) {
  return HtmlService.createTemplateFromFile(templateName);
}

/**
 * Kiểm tra trạng thái hệ thống DataWithLy CMS Engine
 * @return {Object} Thông tin phiên bản và kiến trúc hệ thống
 */
function getDataWithLySystemInfo() {
  return {
    system: "DataWithLy CMS Engine",
    brand: "DataWithLy (Mentor Hứa Thảo Ly)",
    version: "2.1.0",
    architecture: "Modular Architecture (15 Scripts + 10 Native HTML Modals)",
    status: "HEALTHY",
    timestamp: new Date().toISOString()
  };
}
