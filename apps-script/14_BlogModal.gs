/**
 * MODULE 14: HỘP THOẠI BÀI VIẾT BLOG (BLOG POST MODAL DIALOG)
 */
function showBlogModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("blog_posts") || ss.getSheetByName("blogs") || (setupBlogPostsTab(ss), ss.getSheetByName("blog_posts"));

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
  var html = template.evaluate().setWidth(660).setHeight(720).setTitle("✍️ Thêm Bài Viết Blog Hàng Loạt - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "✍️ Thêm Bài Viết Blog Hàng Loạt");
}

function addBlogsBatchFromModal(blogList) {
  if (!blogList || !blogList.length) {
    throw new Error("Danh sách bài viết không được để trống.");
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("blog_posts") || ss.getSheetByName("blogs") || (setupBlogPostsTab(ss), ss.getSheetByName("blog_posts"));

  var lastRow = sheet.getLastRow();
  var existingSlugs = [];
  if (lastRow > 1) {
    var vals = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i][0]) existingSlugs.push(vals[i][0].toString().trim().toLowerCase());
    }
  }

  var rowsToAdd = [];
  var addedBlogs = [];

  for (var k = 0; k < blogList.length; k++) {
    var item = blogList[k];
    var title = (item.title || "").toString().trim();
    if (!title) {
      throw new Error("Bài viết #" + (k + 1) + ": Tiêu đề bài viết không được để trống.");
    }

    var excerpt = (item.excerpt || "").toString().trim();
    if (!excerpt) {
      throw new Error("Bài viết #" + (k + 1) + ": Đoạn tóm tắt không được để trống.");
    }

    // Tự động sinh Slug SEO và check trùng lặp slug
    var uniqueSlug = resolveUniqueSlug(item.slug || title, existingSlugs);
    existingSlugs.push(uniqueSlug.toLowerCase());

    // Sinh UUID v4 (RFC 4122) với prefix blg-
    var uniqueId = item.id && isValidUUID(item.id, "blg-")
      ? item.id.toString().trim()
      : generateUUID("blg-");

    var publishedAt = item.published_at || new Date().toISOString().split("T")[0];

    rowsToAdd.push([
      sanitizeFormula(uniqueId),
      sanitizeFormula(title),
      sanitizeFormula(uniqueSlug),
      sanitizeFormula(item.category || "Sự nghiệp"),
      sanitizeFormula(excerpt),
      sanitizeFormula(item.author_name || "Hứa Thảo Ly"),
      sanitizeFormula(publishedAt),
      item.is_active === true || item.is_active === "true"
    ]);

    addedBlogs.push({ id: uniqueId, title: title, slug: uniqueSlug });
  }

  var startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rowsToAdd.length, 8).setValues(rowsToAdd);

  var msg = "🎉 Đã xuất bản thành công " + rowsToAdd.length + " bài viết blog!";
  ss.toast(msg, "DataWithLy CMS", 5);

  return { success: true, count: rowsToAdd.length, blogs: addedBlogs };
}

function saveBlogFromModal(data) {
  var res = addBlogsBatchFromModal([data]);
  return {
    success: true,
    id: res.blogs[0].id,
    slug: res.blogs[0].slug,
    title: res.blogs[0].title
  };
}
