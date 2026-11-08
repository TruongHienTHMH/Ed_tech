/**
 * MODULE 14: HỘP THOẠI BÀI VIẾT BLOG (BLOG POST MODAL DIALOG)
 */
function showBlogModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("blog_posts") || (setupBlogPostsTab(ss), ss.getSheetByName("blog_posts"));

  var existingSlugs = [];
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var vals = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i][0]) existingSlugs.push(vals[i][0].toString().trim().toLowerCase());
    }
  }

  var template = createModalTemplate("BlogModal");
  template.existingSlugs = existingSlugs;
  var html = template.evaluate().setWidth(600).setHeight(660).setTitle("✍️ Thêm Bài Viết Blog - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "✍️ Thêm Bài Viết Blog");
}

function saveBlogFromModal(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("blog_posts") || (setupBlogPostsTab(ss), ss.getSheetByName("blog_posts"));

  var title = (data.title || "").toString().trim();
  if (!title) throw new Error("Tiêu đề bài viết không được để trống.");

  var existingSlugs = [];
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var vals = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i][0]) existingSlugs.push(vals[i][0].toString());
    }
  }

  var uniqueSlug = resolveUniqueSlug(data.slug || title, existingSlugs);
  var uniqueId = data.id ? resolveUniqueSlug(data.id, existingSlugs) : ("blg-" + uniqueSlug);
  var publishedAt = data.published_at || new Date().toISOString().split("T")[0];

  sheet.appendRow([
    sanitizeFormula(uniqueId),
    sanitizeFormula(title),
    sanitizeFormula(uniqueSlug),
    sanitizeFormula(data.category || "Sự nghiệp"),
    sanitizeFormula(data.excerpt),
    sanitizeFormula(data.author_name || "Hứa Thảo Ly"),
    sanitizeFormula(publishedAt),
    data.is_active === true
  ]);

  var msg = uniqueSlug.match(/-v\d+$/)
    ? "⚡ Đã xuất bản bài viết với slug: " + uniqueSlug + " (tự động gắn version)"
    : "🎉 Đã xuất bản bài viết blog: " + title;
  ss.toast(msg, "DataWithLy CMS", 5);

  return { success: true, id: uniqueId, slug: uniqueSlug, title: title };
}

