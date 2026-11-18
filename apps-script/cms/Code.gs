/**
 * ==============================================================================
 * DATAWITHLY CMS CONTENT MASTER - CORE ENTRYPOINT (Code.gs)
 * ==============================================================================
 * Cung cấp các hàm nền tảng khởi tạo Template và nhúng giao diện HTML.
 * ==============================================================================
 */

/**
 * Hàm nhúng giao diện HTML (Ví dụ: nhúng SharedStyles.html vào các Modal)
 * @param {string} filename - Tên file HTML cần nhúng (không kèm đuôi .html)
 * @return {string} Nội dung HTML/CSS
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Nạp template HTML cho các cửa sổ Modal Dialog
 * @param {string} templateName - Tên template (ví dụ: 'CourseModal', 'CurriculumModal')
 * @return {HtmlTemplate}
 */
function createModalTemplate(templateName) {
  return HtmlService.createTemplateFromFile(templateName);
}

/**
 * Kiểm tra trạng thái hệ thống DataWithLy CMS Engine
 * @return {Object} Thông tin hệ thống
 */
function getDataWithLySystemInfo() {
  return {
    system: "DataWithLy CMS Content Master",
    brand: "DataWithLy (Mentor Hứa Thảo Ly)",
    version: "2.3.0",
    architecture: "Modular Architecture with Native HTML Modals",
    status: "HEALTHY",
    timestamp: new Date().toISOString()
  };
}
