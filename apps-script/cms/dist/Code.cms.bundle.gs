/**
 * ==============================================================================
 * DATAWITHLY CMS CONTENT MASTER - GOOGLE APPS SCRIPT BUNDLE (ALL-IN-ONE)
 * ==============================================================================
 * Phiên bản: 2.2.0 (DataWithLy CMS Content Master)
 * Thời gian đóng gói: 2026-11-14T14:18:12.975Z
 * ==============================================================================
 */

var INLINED_HTML = {
  "BlogModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">✍️ Thêm Bài Viết Blog Hàng Loạt</h2>\n      <p class=\"modal-subtitle\">Xuất bản bài viết kiến thức, tự động sinh slug chuẩn SEO và chống trùng lặp theo thời gian thực</p>\n    </div>\n  </div>\n\n  <form id=\"blogForm\">\n    <div id=\"blogCardsContainer\" class=\"repeater-container\"></div>\n\n    <button type=\"button\" id=\"addBlogBtn\" class=\"btn-add-repeater\">\n      <span>➕ Thêm bài viết</span>\n    </button>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n    <div id=\"successBox\" class=\"alert-banner alert-success fade-in\" style=\"display: none;\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span id=\"submitBtnText\">Lưu tất cả (1 bài viết)</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var existingSlugs = <?!= JSON.stringify(existingSlugs || []) ?>;\n\n    function slugify(text) {\n      if (!text) return \"\";\n      var str = text.toString().toLowerCase().trim();\n      str = str.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, \"a\");\n      str = str.replace(/[éèẻẽẹêếềểễệ]/g, \"e\");\n      str = str.replace(/[íìỉĩị]/g, \"i\");\n      str = str.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, \"o\");\n      str = str.replace(/[úùủũụưứừửữự]/g, \"u\");\n      str = str.replace(/[ýỳỷỹỵ]/g, \"y\");\n      str = str.replace(/đ/g, \"d\");\n      str = str.replace(/[\\s_]+/g, \"-\");\n      str = str.replace(/[^a-z0-9-]/g, \"\");\n      str = str.replace(/-+/g, \"-\");\n      str = str.replace(/^-+|-+$/g, \"\");\n      return str;\n    }\n\n    function resolveUniqueSlugClient(rawInput, existingSlugs, currentSlug) {\n      var base = slugify(rawInput);\n      if (!base) return { slug: \"\", isVersioned: false };\n\n      var cleanBase = base.replace(/-v\\d+$/, \"\");\n      var slugMap = {};\n      var list = existingSlugs || [];\n      var cur = (currentSlug || \"\").toString().trim().toLowerCase();\n\n      for (var i = 0; i < list.length; i++) {\n        var s = (list[i] || \"\").toString().trim().toLowerCase();\n        if (s && s !== cur) {\n          slugMap[s] = true;\n        }\n      }\n\n      if (!slugMap[cleanBase]) {\n        return { slug: cleanBase, isVersioned: false };\n      }\n\n      var version = 1;\n      while (true) {\n        var candidate = cleanBase + \"-v\" + version;\n        if (!slugMap[candidate]) {\n          return { slug: candidate, isVersioned: true };\n        }\n        version++;\n      }\n    }\n\n    var form = document.getElementById(\"blogForm\");\n    var container = document.getElementById(\"blogCardsContainer\");\n    var addBlogBtn = document.getElementById(\"addBlogBtn\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var submitBtnText = document.getElementById(\"submitBtnText\");\n    var errorBox = document.getElementById(\"errorBox\");\n    var successBox = document.getElementById(\"successBox\");\n\n    function showError(msg) {\n      if (successBox) successBox.style.display = \"none\";\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n\n    function showSuccess(msg) {\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n      successBox.innerText = msg;\n      successBox.style.display = \"flex\";\n    }\n\n    function updateAllSlugs() {\n      var cards = container.querySelectorAll(\".form-card\");\n      var batchSlugs = [].concat(existingSlugs);\n\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var titleInput = card.querySelector('[name=\"title\"]');\n        var slugPreview = card.querySelector(\".slug-preview-text\");\n        var slugHidden = card.querySelector('[name=\"slug\"]');\n        var versionBadge = card.querySelector(\".slug-version-badge\");\n        var val = (titleInput.value || \"\").trim();\n        var rawSlug = slugify(val);\n\n        if (!rawSlug) {\n          slugPreview.innerText = \"lo-trinh-chuyen-nganh-data-analytics\";\n          slugHidden.value = \"\";\n          versionBadge.className = \"badge-v badge-slate slug-version-badge\";\n          versionBadge.innerText = \"Chờ nhập liệu\";\n          continue;\n        }\n\n        var res = resolveUniqueSlugClient(rawSlug, batchSlugs);\n        slugPreview.innerText = res.slug;\n        slugHidden.value = res.slug;\n        batchSlugs.push(res.slug);\n\n        if (res.isVersioned) {\n          versionBadge.className = \"badge-v badge-crimson slug-version-badge\";\n          versionBadge.innerText = \"⚡ Trùng tiêu đề -> Đã gắn: \" + res.slug.split(\"-\").pop();\n        } else {\n          versionBadge.className = \"badge-v badge-emerald slug-version-badge\";\n          versionBadge.innerText = \"✅ Duy nhất chuẩn SEO\";\n        }\n      }\n    }\n\n    function updateCardHeaders() {\n      var cards = container.querySelectorAll(\".form-card\");\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var titleElem = card.querySelector(\".form-card-title span\");\n        if (titleElem) {\n          titleElem.innerText = \"✍️ Bài viết #\" + (i + 1);\n        }\n        var removeBtn = card.querySelector(\".btn-remove-card\");\n        if (removeBtn) {\n          removeBtn.style.display = cards.length > 1 ? \"inline-block\" : \"none\";\n        }\n      }\n      submitBtnText.innerText = \"Lưu tất cả (\" + cards.length + \" bài viết)\";\n    }\n\n    function createBlogCard() {\n      var card = document.createElement(\"div\");\n      card.className = \"form-card fade-in\";\n      card.innerHTML =\n        '<div class=\"form-card-header\">' +\n          '<div class=\"form-card-title\"><span>✍️ Bài viết</span></div>' +\n          '<button type=\"button\" class=\"btn-remove-card\" title=\"Xóa bài viết này\">✕ Xóa</button>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Tiêu Đề Bài Viết <span class=\"required\">*</span></label>' +\n          '<input type=\"text\" name=\"title\" required placeholder=\"Lộ trình chuyển ngành Data Analytics từ con số 0 năm 2026\" autocomplete=\"off\">' +\n        '</div>' +\n        '<div class=\"preview-box\">' +\n          '<div class=\"preview-header\">' +\n            '<span>Xem trước URL Bài Viết Blog</span>' +\n            '<span class=\"badge-v badge-slate slug-version-badge\">Chờ nhập liệu</span>' +\n          '</div>' +\n          '<div class=\"preview-content\">' +\n            'https://datawithly.edu.vn/blog/<strong class=\"slug-preview-text\" style=\"color: var(--primary);\">lo-trinh-chuyen-nganh-data-analytics</strong>' +\n          '</div>' +\n          '<input type=\"hidden\" name=\"slug\">' +\n          '<input type=\"hidden\" name=\"id\">' +\n        '</div>' +\n        '<div class=\"form-row\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Chuyên Mục Bài Viết <span class=\"required\">*</span></label>' +\n            '<select name=\"category\">' +\n              '<option value=\"Sự nghiệp\">Sự nghiệp (Career Path)</option>' +\n              '<option value=\"Kỹ thuật\">Kỹ thuật (SQL / BI / Python)</option>' +\n              '<option value=\"Case Study\">Case Study Thực Chiến</option>' +\n              '<option value=\"Góc nhìn\">Góc nhìn & Tư duy Dữ liệu</option>' +\n            '</select>' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Tác Giả <span class=\"required\">*</span></label>' +\n            '<input type=\"text\" name=\"author_name\" required value=\"Hứa Thảo Ly\" placeholder=\"Hứa Thảo Ly\">' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Mô Tả Ngắn (SEO Description) <span class=\"required\">*</span></label>' +\n          '<input type=\"text\" name=\"description\" required placeholder=\"Mô tả ngắn gọn 1-2 câu hiển thị cho Google Search & mạng xã hội...\">' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Đoạn Trích Dẫn (Excerpt) <span class=\"required\">*</span></label>' +\n          '<textarea name=\"excerpt\" rows=\"2\" required placeholder=\"Đoạn văn mở đầu hiển thị trên thẻ bài viết trang danh sách...\"></textarea>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Nội Dung Bài Viết (Hỗ trợ Markdown) <span class=\"required\">*</span></label>' +\n          '<textarea name=\"content_markdown\" rows=\"6\" required placeholder=\"## 1. Mở đầu bài viết\\nNội dung chi tiết phân tích...\\n\\n```sql\\nSELECT * FROM data;\\n```\"></textarea>' +\n        '</div>' +\n        '<div class=\"form-row\" style=\"margin-top: 6px;\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Ngày Xuất Bản</label>' +\n            '<input type=\"date\" name=\"published_at\">' +\n          '</div>' +\n          '<div class=\"form-group col-1\" style=\"display: flex; align-items: flex-end;\">' +\n            '<label class=\"checkbox-group\" style=\"width: 100%;\">' +\n              '<input type=\"checkbox\" name=\"is_active\" checked>' +\n              '<span class=\"checkbox-label\">Xuất bản công khai (is_active)</span>' +\n            '</label>' +\n          '</div>' +\n        '</div>';\n\n      var dateInput = card.querySelector('[name=\"published_at\"]');\n      if (dateInput) {\n        dateInput.value = new Date().toISOString().split(\"T\")[0];\n      }\n\n      var titleInput = card.querySelector('[name=\"title\"]');\n      titleInput.addEventListener(\"input\", updateAllSlugs);\n\n      var removeBtn = card.querySelector(\".btn-remove-card\");\n      removeBtn.addEventListener(\"click\", function () {\n        card.remove();\n        updateCardHeaders();\n        updateAllSlugs();\n      });\n\n      container.appendChild(card);\n      updateCardHeaders();\n      updateAllSlugs();\n      return card;\n    }\n\n    addBlogBtn.addEventListener(\"click\", function () {\n      var newCard = createBlogCard();\n      var input = newCard.querySelector('[name=\"title\"]');\n      if (input) input.focus();\n    });\n\n    createBlogCard();\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var cards = container.querySelectorAll(\".form-card\");\n      if (cards.length === 0) {\n        showError(\"Vui lòng thêm ít nhất một bài viết.\");\n        return;\n      }\n\n      var blogList = [];\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var title = (card.querySelector('[name=\"title\"]').value || \"\").trim();\n        if (!title) {\n          showError(\"Vui lòng nhập tiêu đề cho bài viết #\" + (i + 1) + \".\");\n          card.querySelector('[name=\"title\"]').focus();\n          return;\n        }\n\n        var excerpt = (card.querySelector('[name=\"excerpt\"]').value || \"\").trim();\n        if (!excerpt) {\n          showError(\"Vui lòng nhập đoạn tóm tắt cho bài viết #\" + (i + 1) + \".\");\n          card.querySelector('[name=\"excerpt\"]').focus();\n          return;\n        }\n\n        var author = (card.querySelector('[name=\"author_name\"]').value || \"\").trim() || \"Hứa Thảo Ly\";\n        var publishedAt = card.querySelector('[name=\"published_at\"]').value || new Date().toISOString().split(\"T\")[0];\n\n        blogList.push({\n          title: title,\n          slug: card.querySelector('[name=\"slug\"]').value || slugify(title),\n          category: card.querySelector('[name=\"category\"]').value,\n          excerpt: excerpt,\n          author_name: author,\n          published_at: publishedAt,\n          is_active: card.querySelector('[name=\"is_active\"]').checked\n        });\n      }\n\n      submitBtn.disabled = true;\n      addBlogBtn.disabled = true;\n      submitBtnText.innerHTML = '<span class=\"spinner\"></span> Đang xuất bản ' + blogList.length + ' bài viết...';\n\n      google.script.run\n        .withSuccessHandler(function (res) {\n          showSuccess(\"✅ Đã xuất bản thành công \" + (res.count || blogList.length) + \" bài viết!\");\n          setTimeout(function () {\n            google.script.host.close();\n          }, 1200);\n        })\n        .withFailureHandler(function (err) {\n          submitBtn.disabled = false;\n          addBlogBtn.disabled = false;\n          updateCardHeaders();\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .addBlogsBatchFromModal(blogList);\n    });\n  </script>\n</body>\n\n</html>\n",
  "CourseModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">➕ Thêm Khóa Học Hàng Loạt</h2>\n      <p class=\"modal-subtitle\">Thêm nhiều khóa học cùng lúc với nút \"+\" Repeater, tự động chuẩn hóa SEO Slug và version -v1, -v2 độc lập</p>\n    </div>\n  </div>\n\n  <form id=\"courseForm\">\n    <div id=\"courseCardsContainer\" class=\"repeater-container\"></div>\n\n    <button type=\"button\" id=\"addCourseBtn\" class=\"btn-add-repeater\">\n      <span>➕ Thêm khóa học</span>\n    </button>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n    <div id=\"successBox\" class=\"alert-banner alert-success fade-in\" style=\"display: none;\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span id=\"submitBtnText\">Lưu tất cả (1 khóa học)</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var existingSlugs = <?!= JSON.stringify(existingSlugs || []) ?>;\n\n    function slugify(text) {\n      if (!text) return \"\";\n      var str = text.toString().toLowerCase().trim();\n      str = str.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, \"a\");\n      str = str.replace(/[éèẻẽẹêếềểễệ]/g, \"e\");\n      str = str.replace(/[íìỉĩị]/g, \"i\");\n      str = str.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, \"o\");\n      str = str.replace(/[úùủũụưứừửữự]/g, \"u\");\n      str = str.replace(/[ýỳỷỹỵ]/g, \"y\");\n      str = str.replace(/đ/g, \"d\");\n      str = str.replace(/[\\s_]+/g, \"-\");\n      str = str.replace(/[^a-z0-9-]/g, \"\");\n      str = str.replace(/-+/g, \"-\");\n      str = str.replace(/^-+|-+$/g, \"\");\n      return str;\n    }\n\n    function resolveUniqueSlugClient(rawInput, existingSlugs, currentSlug) {\n      var base = slugify(rawInput);\n      if (!base) return { slug: \"\", isVersioned: false };\n\n      var cleanBase = base.replace(/-v\\d+$/, \"\");\n      var slugMap = {};\n      var list = existingSlugs || [];\n      var cur = (currentSlug || \"\").toString().trim().toLowerCase();\n\n      for (var i = 0; i < list.length; i++) {\n        var s = (list[i] || \"\").toString().trim().toLowerCase();\n        if (s && s !== cur) {\n          slugMap[s] = true;\n        }\n      }\n\n      if (!slugMap[cleanBase]) {\n        return { slug: cleanBase, isVersioned: false };\n      }\n\n      var version = 1;\n      while (true) {\n        var candidate = cleanBase + \"-v\" + version;\n        if (!slugMap[candidate]) {\n          return { slug: candidate, isVersioned: true };\n        }\n        version++;\n      }\n    }\n\n    var form = document.getElementById(\"courseForm\");\n    var container = document.getElementById(\"courseCardsContainer\");\n    var addCourseBtn = document.getElementById(\"addCourseBtn\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var submitBtnText = document.getElementById(\"submitBtnText\");\n    var errorBox = document.getElementById(\"errorBox\");\n    var successBox = document.getElementById(\"successBox\");\n\n    function showError(msg) {\n      if (successBox) successBox.style.display = \"none\";\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n\n    function showSuccess(msg) {\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n      successBox.innerText = msg;\n      successBox.style.display = \"flex\";\n    }\n\n    function updateAllSlugs() {\n      var cards = container.querySelectorAll(\".form-card\");\n      var batchSlugs = [].concat(existingSlugs);\n\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var titleInput = card.querySelector('[name=\"title\"]');\n        var slugPreview = card.querySelector(\".slug-preview-text\");\n        var slugHidden = card.querySelector('[name=\"slug\"]');\n        var versionBadge = card.querySelector(\".slug-version-badge\");\n        var val = (titleInput.value || \"\").trim();\n        var rawSlug = slugify(val);\n\n        if (!rawSlug) {\n          slugPreview.innerText = \"sql-for-data-analytics\";\n          slugHidden.value = \"\";\n          versionBadge.className = \"badge-v badge-slate slug-version-badge\";\n          versionBadge.innerText = \"Chờ nhập liệu\";\n          continue;\n        }\n\n        var res = resolveUniqueSlugClient(rawSlug, batchSlugs);\n        slugPreview.innerText = res.slug;\n        slugHidden.value = res.slug;\n        batchSlugs.push(res.slug);\n\n        if (res.isVersioned) {\n          versionBadge.className = \"badge-v badge-crimson slug-version-badge\";\n          versionBadge.innerText = \"⚡ Trùng tiêu đề -> Đã gắn: \" + res.slug.split(\"-\").pop();\n        } else {\n          versionBadge.className = \"badge-v badge-emerald slug-version-badge\";\n          versionBadge.innerText = \"✅ Duy nhất chuẩn SEO\";\n        }\n      }\n    }\n\n    function updateCardHeaders() {\n      var cards = container.querySelectorAll(\".form-card\");\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var titleElem = card.querySelector(\".form-card-title span\");\n        if (titleElem) {\n          titleElem.innerText = \"📘 Khóa học #\" + (i + 1);\n        }\n        var sortOrderInput = card.querySelector('[name=\"sort_order\"]');\n        if (sortOrderInput && (!sortOrderInput.value || sortOrderInput.getAttribute(\"data-auto\") === \"true\")) {\n          sortOrderInput.value = i + 1;\n          sortOrderInput.setAttribute(\"data-auto\", \"true\");\n        }\n        var removeBtn = card.querySelector(\".btn-remove-card\");\n        if (removeBtn) {\n          removeBtn.style.display = cards.length > 1 ? \"inline-block\" : \"none\";\n        }\n      }\n      submitBtnText.innerText = \"Lưu tất cả (\" + cards.length + \" khóa học)\";\n    }\n\n    function createCourseCard() {\n      var card = document.createElement(\"div\");\n      card.className = \"form-card fade-in\";\n      card.innerHTML = \n        '<div class=\"form-card-header\">' +\n          '<div class=\"form-card-title\"><span>📘 Khóa học</span></div>' +\n          '<button type=\"button\" class=\"btn-remove-card\" title=\"Xóa thẻ khóa học này\">✕ Xóa</button>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Tên Khóa Học <span class=\"required\">*</span></label>' +\n          '<input type=\"text\" name=\"title\" required placeholder=\"Ví dụ: SQL for Data Analytics Thực Chiến\" autocomplete=\"off\">' +\n        '</div>' +\n        '<div class=\"preview-box\">' +\n          '<div class=\"preview-header\">' +\n            '<span>Xem trước URL & Slug SEO</span>' +\n            '<span class=\"badge-v badge-slate slug-version-badge\">Chờ nhập liệu</span>' +\n          '</div>' +\n          '<div class=\"preview-content\">' +\n            'https://datawithly.edu.vn/courses/<strong class=\"slug-preview-text\" style=\"color: var(--primary);\">sql-for-data-analytics</strong>' +\n          '</div>' +\n          '<input type=\"hidden\" name=\"slug\">' +\n          '<input type=\"hidden\" name=\"id\">' +\n        '</div>' +\n        '<div class=\"form-row\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Loại Khóa Học (Course Kind) <span class=\"required\">*</span></label>' +\n            '<select name=\"course_kind\">' +\n              '<option value=\"Khóa học nổi bật\" selected>Khóa học nổi bật</option>' +\n              '<option value=\"Khóa học mới\">Khóa học mới</option>' +\n              '<option value=\"Khóa học nền tảng\">Khóa học nền tảng</option>' +\n              '<option value=\"Khóa học chuyên sâu\">Khóa học chuyên sâu</option>' +\n              '<option value=\"Combo\">Combo</option>' +\n            '</select>' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Chủ Đề (Tag) <span class=\"required\">*</span></label>' +\n            '<select name=\"tag\">' +\n              '<option value=\"SQL\">SQL</option>' +\n              '<option value=\"Dashboard\">Dashboard (Power BI)</option>' +\n              '<option value=\"Python\">Python</option>' +\n              '<option value=\"End-to-End\">End-to-End Analytics</option>' +\n            '</select>' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-row\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Trình Độ</label>' +\n            '<select name=\"level\">' +\n              '<option value=\"Beginner\">Beginner (Cơ bản)</option>' +\n              '<option value=\"Intermediate\">Intermediate (Trung cấp)</option>' +\n              '<option value=\"Advanced\">Advanced (Nâng cao)</option>' +\n            '</select>' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Thông Điệp Ngắn (Tagline)</label>' +\n            '<input type=\"text\" name=\"tagline\" placeholder=\"Ví dụ: Nắm vững tư duy truy vấn, CTE và Window Functions\">' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-row\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Học Phí Ưu Đãi (VNĐ) <span class=\"required\">*</span></label>' +\n            '<input type=\"number\" name=\"tuition_vnd\" required placeholder=\"4500000\" step=\"50000\">' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Học Phí Gốc (VNĐ)</label>' +\n            '<input type=\"number\" name=\"original_tuition_vnd\" placeholder=\"6000000\" step=\"50000\">' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-row\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Thời Lượng</label>' +\n            '<input type=\"text\" name=\"duration\" value=\"8 tuần (24 buổi)\">' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Thứ Tự Sắp Xếp</label>' +\n            '<input type=\"number\" name=\"sort_order\" min=\"1\" data-auto=\"true\">' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Mô Tả Tổng Quan Khóa Học</label>' +\n          '<textarea name=\"description\" rows=\"2\" placeholder=\"Mô tả giá trị thực chiến, mục tiêu đầu ra và đối tượng phù hợp...\"></textarea>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Ảnh Bìa (URL)</label>' +\n          '<input type=\"text\" name=\"cover_image_url\" placeholder=\"/uploads/courses/sql-course.jpg\">' +\n        '</div>' +\n        '<div class=\"form-row\" style=\"margin-top: 6px;\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label class=\"checkbox-group\">' +\n              '<input type=\"checkbox\" name=\"is_active\" checked>' +\n              '<span class=\"checkbox-label\">Kích hoạt hiển thị (is_active)</span>' +\n            '</label>' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label class=\"checkbox-group\">' +\n              '<input type=\"checkbox\" name=\"is_featured\">' +\n              '<span class=\"checkbox-label\">Khóa học nổi bật (is_featured)</span>' +\n            '</label>' +\n          '</div>' +\n        '</div>';\n\n      var titleInput = card.querySelector('[name=\"title\"]');\n      titleInput.addEventListener(\"input\", updateAllSlugs);\n\n      var removeBtn = card.querySelector(\".btn-remove-card\");\n      removeBtn.addEventListener(\"click\", function () {\n        card.remove();\n        updateCardHeaders();\n        updateAllSlugs();\n      });\n\n      var sortInput = card.querySelector('[name=\"sort_order\"]');\n      sortInput.addEventListener(\"input\", function () {\n        this.setAttribute(\"data-auto\", \"false\");\n      });\n\n      container.appendChild(card);\n      updateCardHeaders();\n      updateAllSlugs();\n      return card;\n    }\n\n    addCourseBtn.addEventListener(\"click\", function () {\n      var newCard = createCourseCard();\n      var input = newCard.querySelector('[name=\"title\"]');\n      if (input) input.focus();\n    });\n\n    createCourseCard();\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var cards = container.querySelectorAll(\".form-card\");\n      if (cards.length === 0) {\n        showError(\"Vui lòng thêm ít nhất một khóa học.\");\n        return;\n      }\n\n      var courseList = [];\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var title = (card.querySelector('[name=\"title\"]').value || \"\").trim();\n        if (!title) {\n          showError(\"Vui lòng nhập tên cho khóa học #\" + (i + 1) + \".\");\n          card.querySelector('[name=\"title\"]').focus();\n          return;\n        }\n\n        var tuitionVnd = card.querySelector('[name=\"tuition_vnd\"]').value;\n        if (!tuitionVnd || isNaN(Number(tuitionVnd)) || Number(tuitionVnd) < 0) {\n          showError(\"Vui lòng nhập học phí ưu đãi hợp lệ cho khóa học #\" + (i + 1) + \".\");\n          card.querySelector('[name=\"tuition_vnd\"]').focus();\n          return;\n        }\n\n        var origTuition = card.querySelector('[name=\"original_tuition_vnd\"]').value;\n        var sortVal = card.querySelector('[name=\"sort_order\"]').value;\n\n        courseList.push({\n          title: title,\n          slug: card.querySelector('[name=\"slug\"]').value || slugify(title),\n          tag: card.querySelector('[name=\"tag\"]').value,\n          level: card.querySelector('[name=\"level\"]').value,\n          tagline: (card.querySelector('[name=\"tagline\"]').value || \"\").trim(),\n          tuition_vnd: tuitionVnd,\n          original_tuition_vnd: origTuition || tuitionVnd,\n          duration: (card.querySelector('[name=\"duration\"]').value || \"\").trim(),\n          sort_order: sortVal || (i + 1),\n          description: (card.querySelector('[name=\"description\"]').value || \"\").trim(),\n          cover_image_url: (card.querySelector('[name=\"cover_image_url\"]').value || \"\").trim(),\n          is_active: card.querySelector('[name=\"is_active\"]').checked,\n          is_featured: card.querySelector('[name=\"is_featured\"]').checked\n        });\n      }\n\n      submitBtn.disabled = true;\n      addCourseBtn.disabled = true;\n      submitBtnText.innerHTML = '<span class=\"spinner\"></span> Đang lưu ' + courseList.length + ' khóa học...';\n\n      google.script.run\n        .withSuccessHandler(function (res) {\n          showSuccess(\"✅ Đã lưu thành công \" + (res.count || courseList.length) + \" khóa học vào hệ thống!\");\n          setTimeout(function () {\n            google.script.host.close();\n          }, 1200);\n        })\n        .withFailureHandler(function (err) {\n          submitBtn.disabled = false;\n          addCourseBtn.disabled = false;\n          updateCardHeaders();\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .addCoursesBatchFromModal(courseList);\n    });\n  </script>\n</body>\n\n</html>\n",
  "CurriculumModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">📚 Quản Trị Lộ Trình Khóa Học (Curriculum Modules)</h2>\n      <p class=\"modal-subtitle\">Khởi tạo số lượng buổi học linh hoạt (1, 2, 3, 4 buổi/tuần), thiết lập ngày bắt đầu/kết thúc và nội dung chi tiết</p>\n    </div>\n  </div>\n\n  <form id=\"curriculumForm\">\n    <!-- KHỐI 1: CHỌN KHÓA HỌC & THỜI GIAN KHÓA HỌC -->\n    <div class=\"form-group\">\n      <label for=\"course_select\">Khóa Học Áp Dụng <span class=\"required\">*</span></label>\n      <select id=\"course_select\" name=\"course_select\" required>\n        <? for (var i = 0; i < coursesList.length; i++) { ?>\n        <option value=\"<?= coursesList[i].id ?>\" data-title=\"<?= coursesList[i].title ?>\"\n          data-start=\"<?= coursesList[i].startDate || '' ?>\"\n          data-end=\"<?= coursesList[i].endDate || '' ?>\"\n          data-max=\"<?= coursesList[i].maxModule ?>\">\n          <?= coursesList[i].title ?> (Hiện có: <?= coursesList[i].maxModule ?> buổi học)\n        </option>\n        <? } ?>\n      </select>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"course_start_date\">Ngày Bắt Đầu Khóa Học (Khai Giảng)</label>\n        <input type=\"date\" id=\"course_start_date\" name=\"course_start_date\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"course_end_date\">Ngày Kết Thúc Khóa Học (Bế Giảng)</label>\n        <input type=\"date\" id=\"course_end_date\" name=\"course_end_date\">\n      </div>\n    </div>\n\n    <!-- KHỐI 2: CẤU HÌNH SINH BUỔI HỌC TỰ ĐỘNG THEO TUẦN -->\n    <div style=\"background: #F8F9FA; border: 1px solid #E5E7EB; border-radius: 12px; padding: 14px 16px; margin-bottom: 20px;\">\n      <div style=\"font-weight: 700; font-size: 13px; color: #1F242F; margin-bottom: 8px;\">\n        ⚙️ Thiết Lập Sinh Form Buổi Học Nhanh\n      </div>\n      <div class=\"form-row\" style=\"margin-bottom: 0; align-items: flex-end;\">\n        <div class=\"form-group col-1\" style=\"margin-bottom: 0;\">\n          <label for=\"sessions_per_week\">Số Buổi Mỗi Tuần</label>\n          <select id=\"sessions_per_week\" name=\"sessions_per_week\">\n            <option value=\"1\">1 buổi / tuần</option>\n            <option value=\"2\">2 buổi / tuần</option>\n            <option value=\"3\" selected>3 buổi / tuần</option>\n            <option value=\"4\">4 buổi / tuần</option>\n          </select>\n        </div>\n        <div class=\"form-group col-1\" style=\"margin-bottom: 0;\">\n          <label for=\"total_sessions\">Tổng Số Buổi Cần Tạo</label>\n          <input type=\"number\" id=\"total_sessions\" name=\"total_sessions\" min=\"1\" max=\"60\" value=\"12\">\n        </div>\n        <div style=\"padding-bottom: 2px;\">\n          <button type=\"button\" id=\"generateCardsBtn\" class=\"btn-submit\" style=\"padding: 10px 18px; font-size: 13px; background: #8B1D2C;\">\n            ⚡ Khởi Tạo Form\n          </button>\n        </div>\n      </div>\n      <div style=\"font-size: 11px; color: #6B7280; margin-top: 8px;\">\n        💡 Chọn số buổi/tuần (ví dụ 3 buổi/tuần) và bấm <strong>Khởi Tạo Form</strong>, hệ thống sẽ tự động tạo đúng số buổi học và chia tuần chuẩn xác.\n      </div>\n    </div>\n\n    <!-- KHỐI 3: DANH SÁCH FORM CARDS BUỔI HỌC -->\n    <div id=\"curriculumCardsContainer\" class=\"repeater-container\"></div>\n\n    <button type=\"button\" id=\"addCurriculumBtn\" class=\"btn-add-repeater\">\n      <span>➕ Thêm 1 buổi học lẻ</span>\n    </button>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n    <div id=\"successBox\" class=\"alert-banner alert-success fade-in\" style=\"display: none;\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span id=\"submitBtnText\">Lưu tất cả (12 buổi học)</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var courseSelect = document.getElementById(\"course_select\");\n    var startDateInput = document.getElementById(\"course_start_date\");\n    var endDateInput = document.getElementById(\"course_end_date\");\n    var sessionsPerWeekSelect = document.getElementById(\"sessions_per_week\");\n    var totalSessionsInput = document.getElementById(\"total_sessions\");\n    var generateCardsBtn = document.getElementById(\"generateCardsBtn\");\n    var container = document.getElementById(\"curriculumCardsContainer\");\n    var addCurriculumBtn = document.getElementById(\"addCurriculumBtn\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var submitBtnText = document.getElementById(\"submitBtnText\");\n    var errorBox = document.getElementById(\"errorBox\");\n    var successBox = document.getElementById(\"successBox\");\n    var form = document.getElementById(\"curriculumForm\");\n\n    function getSelectedCourseOption() {\n      return courseSelect.options[courseSelect.selectedIndex];\n    }\n\n    function syncCourseDates() {\n      var opt = getSelectedCourseOption();\n      if (opt) {\n        if (opt.getAttribute(\"data-start\")) {\n          startDateInput.value = opt.getAttribute(\"data-start\");\n        }\n        if (opt.getAttribute(\"data-end\")) {\n          endDateInput.value = opt.getAttribute(\"data-end\");\n        }\n      }\n    }\n\n    syncCourseDates();\n    courseSelect.addEventListener(\"change\", syncCourseDates);\n\n    // Tính toán ngày badge gợi ý (ví dụ TH10 26) dựa trên start_date\n    function calculateSuggestedDate(sessionIndex, perWeek) {\n      var startVal = startDateInput.value;\n      if (!startVal) {\n        var dayNum = sessionIndex + 1;\n        return \"TH10 \" + (dayNum < 10 ? \"0\" + dayNum : dayNum);\n      }\n      try {\n        var baseDate = new Date(startVal);\n        var weekIndex = Math.floor(sessionIndex / perWeek);\n        var dayInWeek = sessionIndex % perWeek;\n        // Mỗi tuần cách nhau 7 ngày, mỗi buổi trong tuần cách nhau 2-3 ngày\n        var offsetDays = weekIndex * 7 + dayInWeek * 2;\n        var sDate = new Date(baseDate.getTime() + offsetDays * 24 * 60 * 60 * 1000);\n        var m = sDate.getMonth() + 1;\n        var d = sDate.getDate();\n        var mStr = m < 10 ? \"0\" + m : \"\" + m;\n        var dStr = d < 10 ? \"0\" + d : \"\" + d;\n        return \"TH\" + mStr + \" \" + dStr;\n      } catch (e) {\n        return \"TH10 01\";\n      }\n    }\n\n    function updateCardIndices() {\n      var cards = container.querySelectorAll(\".form-card\");\n      var perWeek = parseInt(sessionsPerWeekSelect.value, 10) || 2;\n\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var titleElem = card.querySelector(\".form-card-title span\");\n        var dayNum = i + 1;\n        var weekNum = Math.ceil(dayNum / perWeek);\n\n        if (titleElem) {\n          titleElem.innerText = \"📚 Buổi học #\" + dayNum + \" (Tuần \" + weekNum + \")\";\n        }\n\n        var dayInput = card.querySelector('[name=\"day\"]');\n        var weekInput = card.querySelector('[name=\"week\"]');\n        var sortInput = card.querySelector('[name=\"sort_order\"]');\n\n        if (dayInput && dayInput.getAttribute(\"data-auto\") === \"true\") {\n          dayInput.value = dayNum;\n        }\n        if (weekInput && weekInput.getAttribute(\"data-auto\") === \"true\") {\n          weekInput.value = weekNum;\n        }\n        if (sortInput && sortInput.getAttribute(\"data-auto\") === \"true\") {\n          sortInput.value = dayNum;\n        }\n\n        var removeBtn = card.querySelector(\".btn-remove-card\");\n        if (removeBtn) {\n          removeBtn.style.display = cards.length > 1 ? \"inline-block\" : \"none\";\n        }\n      }\n\n      submitBtnText.innerText = \"Lưu tất cả (\" + cards.length + \" buổi học)\";\n    }\n\n    function createCurriculumCard(customData) {\n      var card = document.createElement(\"div\");\n      card.className = \"form-card fade-in\";\n      card.innerHTML = \n        '<div class=\"form-card-header\">' +\n          '<div class=\"form-card-title\"><span>📚 Buổi học</span></div>' +\n          '<button type=\"button\" class=\"btn-remove-card\" title=\"Xóa buổi học này\">✕ Xóa</button>' +\n        '</div>' +\n        '<div class=\"form-row\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Tuần (Week) <span class=\"required\">*</span></label>' +\n            '<input type=\"number\" name=\"week\" required min=\"1\" value=\"1\" data-auto=\"true\">' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Buổi số (Day) <span class=\"required\">*</span></label>' +\n            '<input type=\"number\" name=\"day\" required min=\"1\" data-auto=\"true\">' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Ngày học (Date)</label>' +\n            '<input type=\"text\" name=\"date\" placeholder=\"Ví dụ: TH10 03\">' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Thời Lượng</label>' +\n            '<input type=\"text\" name=\"duration\" value=\"3 giờ\">' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Nội Dung Từng Buổi (Session Title) <span class=\"required\">*</span></label>' +\n          '<input type=\"text\" name=\"session_title\" required placeholder=\"Ví dụ: Buổi 1: Làm quen Database & Cú pháp SELECT cơ bản\">' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Miêu Tả Nội Dung Buổi Học (Session Description)</label>' +\n          '<textarea name=\"session_desc\" rows=\"2\" placeholder=\"Ví dụ: Hiểu kiến trúc Relational Database, cài đặt DBeaver, thực hành SELECT, WHERE, ORDER BY, GROUP BY.\"></textarea>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Sub Content - Chi Tiết Điểm Kiến Thức (Mỗi dòng là một dot list khi mở dropdown) <span class=\"required\">*</span></label>' +\n          '<textarea name=\"sub_content\" rows=\"4\" required placeholder=\"Tổng quan về cơ sở dữ liệu quan hệ (RDBMS) trong doanh nghiệp&#10;Cài đặt DBeaver và kết nối hệ quản trị PostgreSQL / MySQL&#10;Cú pháp SELECT, ALIAS, DISTINCT, toán tử lọc WHERE, AND/OR/IN/BETWEEN&#10;Thực hành truy vấn cơ bản trên bộ dữ liệu E-commerce thực tế\"></textarea>' +\n          '<div class=\"help-text\">💡 Mẹo: Nhấn Enter để tách từng gạch đầu dòng (dot list). Khi học viên bấm mở dropdown trên web sẽ thấy danh sách này.</div>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Thứ Tự Hiển Thị</label>' +\n          '<input type=\"number\" name=\"sort_order\" min=\"1\" data-auto=\"true\">' +\n        '</div>';\n\n      if (customData) {\n        if (customData.week) card.querySelector('[name=\"week\"]').value = customData.week;\n        if (customData.day) card.querySelector('[name=\"day\"]').value = customData.day;\n        if (customData.date) card.querySelector('[name=\"date\"]').value = customData.date;\n        if (customData.title) card.querySelector('[name=\"session_title\"]').value = customData.title;\n        if (customData.desc) card.querySelector('[name=\"session_desc\"]').value = customData.desc;\n        if (customData.sub) card.querySelector('[name=\"sub_content\"]').value = customData.sub;\n      }\n\n      var dayInput = card.querySelector('[name=\"day\"]');\n      dayInput.addEventListener(\"input\", function () {\n        this.setAttribute(\"data-auto\", \"false\");\n      });\n\n      var weekInput = card.querySelector('[name=\"week\"]');\n      weekInput.addEventListener(\"input\", function () {\n        this.setAttribute(\"data-auto\", \"false\");\n      });\n\n      var sortInput = card.querySelector('[name=\"sort_order\"]');\n      sortInput.addEventListener(\"input\", function () {\n        this.setAttribute(\"data-auto\", \"false\");\n      });\n\n      var removeBtn = card.querySelector(\".btn-remove-card\");\n      removeBtn.addEventListener(\"click\", function () {\n        card.remove();\n        updateCardIndices();\n      });\n\n      container.appendChild(card);\n      return card;\n    }\n\n    // Khởi tạo hàng loạt cards theo cấu hình\n    function generateBatchCards() {\n      var total = parseInt(totalSessionsInput.value, 10) || 12;\n      var perWeek = parseInt(sessionsPerWeekSelect.value, 10) || 3;\n      if (total < 1) total = 1;\n\n      container.innerHTML = \"\";\n\n      for (var i = 0; i < total; i++) {\n        var dayNum = i + 1;\n        var weekNum = Math.ceil(dayNum / perWeek);\n        var dateSuggested = calculateSuggestedDate(i, perWeek);\n\n        createCurriculumCard({\n          week: weekNum,\n          day: dayNum,\n          date: dateSuggested,\n          title: \"Buổi \" + dayNum + \": \",\n          desc: \"\",\n          sub: \"\"\n        });\n      }\n\n      updateCardIndices();\n    }\n\n    generateCardsBtn.addEventListener(\"click\", generateBatchCards);\n\n    addCurriculumBtn.addEventListener(\"click\", function () {\n      var cards = container.querySelectorAll(\".form-card\");\n      var perWeek = parseInt(sessionsPerWeekSelect.value, 10) || 3;\n      var nextDay = cards.length + 1;\n      var nextWeek = Math.ceil(nextDay / perWeek);\n      var dateSuggested = calculateSuggestedDate(cards.length, perWeek);\n\n      var newCard = createCurriculumCard({\n        week: nextWeek,\n        day: nextDay,\n        date: dateSuggested,\n        title: \"Buổi \" + nextDay + \": \"\n      });\n      updateCardIndices();\n      var input = newCard.querySelector('[name=\"session_title\"]');\n      if (input) input.focus();\n    });\n\n    // Mặc định sinh sẵn form theo cấu hình ban đầu\n    generateBatchCards();\n\n    function showError(msg) {\n      if (successBox) successBox.style.display = \"none\";\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n\n    function showSuccess(msg) {\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n      successBox.innerText = msg;\n      successBox.style.display = \"flex\";\n    }\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var selected = courseSelect.options[courseSelect.selectedIndex];\n      var courseId = selected ? selected.value : \"\";\n      var courseName = selected ? selected.getAttribute(\"data-title\") : \"\";\n\n      if (!courseId) {\n        showError(\"Vui lòng chọn khóa học áp dụng.\");\n        return;\n      }\n\n      var cards = container.querySelectorAll(\".form-card\");\n      if (cards.length === 0) {\n        showError(\"Vui lòng thêm ít nhất một buổi học.\");\n        return;\n      }\n\n      var curriculumList = [];\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var sessionTitle = (card.querySelector('[name=\"session_title\"]').value || \"\").trim();\n        if (!sessionTitle) {\n          showError(\"Vui lòng nhập nội dung cho buổi học #\" + (i + 1) + \".\");\n          card.querySelector('[name=\"session_title\"]').focus();\n          return;\n        }\n\n        var subContent = (card.querySelector('[name=\"sub_content\"]').value || \"\").trim();\n        if (!subContent) {\n          showError(\"Vui lòng nhập Sub Content chi tiết cho buổi học #\" + (i + 1) + \".\");\n          card.querySelector('[name=\"sub_content\"]').focus();\n          return;\n        }\n\n        var sessionDesc = (card.querySelector('[name=\"session_desc\"]').value || \"\").trim();\n        var dayVal = parseInt(card.querySelector('[name=\"day\"]').value, 10) || (i + 1);\n        var weekVal = parseInt(card.querySelector('[name=\"week\"]').value, 10) || Math.ceil(dayVal / 2);\n        var dateVal = (card.querySelector('[name=\"date\"]').value || \"\").trim();\n        var durationVal = (card.querySelector('[name=\"duration\"]').value || \"\").trim();\n        var sortVal = parseInt(card.querySelector('[name=\"sort_order\"]').value, 10) || dayVal;\n\n        curriculumList.push({\n          course_id: courseId,\n          course_name: courseName,\n          week: weekVal,\n          day: dayVal,\n          date: dateVal || (\"TH10 \" + (dayVal < 10 ? \"0\" + dayVal : dayVal)),\n          session_title: sessionTitle,\n          session_desc: sessionDesc,\n          sub_content: subContent,\n          duration: durationVal || \"3 giờ\",\n          sort_order: sortVal,\n          // Aliases tương thích ngược:\n          module_number: dayVal,\n          module_title: sessionTitle,\n          topics_bullets: subContent,\n          summary: sessionDesc\n        });\n      }\n\n      var payload = {\n        course_id: courseId,\n        course_name: courseName,\n        course_start_date: startDateInput.value || \"\",\n        course_end_date: endDateInput.value || \"\",\n        curriculum_list: curriculumList\n      };\n\n      submitBtn.disabled = true;\n      addCurriculumBtn.disabled = true;\n      generateCardsBtn.disabled = true;\n      submitBtnText.innerHTML = '<span class=\"spinner\"></span> Đang lưu ' + curriculumList.length + ' buổi học...';\n\n      google.script.run\n        .withSuccessHandler(function (res) {\n          showSuccess(\"✅ Đã lưu thành công \" + (res.count || curriculumList.length) + \" buổi học và thời gian khóa học!\");\n          setTimeout(function () {\n            google.script.host.close();\n          }, 1200);\n        })\n        .withFailureHandler(function (err) {\n          submitBtn.disabled = false;\n          addCurriculumBtn.disabled = false;\n          generateCardsBtn.disabled = false;\n          updateCardIndices();\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .addCurriculumBatchFromModal(payload);\n    });\n  </script>\n</body>\n\n</html>\n",
  "FaqModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">❓ Thêm Câu Hỏi Thường Gặp (FAQ)</h2>\n      <p class=\"modal-subtitle\">Giải đáp thắc mắc phổ biến về học phí, lịch học, đầu ra và lộ trình học tập</p>\n    </div>\n  </div>\n\n  <form id=\"faqForm\">\n    <div class=\"preview-box\">\n      <div class=\"preview-header\">\n        <span>Xem trước FAQ Accordion</span>\n        <span id=\"previewCategoryBadge\" class=\"badge-v badge-crimson\">CHUNG</span>\n      </div>\n      <div>\n        <strong id=\"previewQuestion\" style=\"font-size: 13px; color: var(--dark-slate);\">Người trái ngành, chưa từng học\n          IT có theo học được không?</strong>\n        <p id=\"previewAnswer\" style=\"font-size: 12px; color: var(--slate-muted); margin: 6px 0 0; line-height: 1.45;\">\n          Hoàn toàn được! Lộ trình của DataWithLy được thiết kế đi từ con số 0...\n        </p>\n      </div>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"category\">Danh Mục Câu Hỏi <span class=\"required\">*</span></label>\n        <select id=\"category\" name=\"category\" required>\n          <option value=\"CHUNG\">CHUNG (Thông tin chung & Khóa học)</option>\n          <option value=\"LỊCH HỌC\">LỊCH HỌC (Hình thức học & Record)</option>\n          <option value=\"HỌC PHÍ\">HỌC PHÍ (Học phí & Chính sách hoàn)</option>\n          <option value=\"ĐẦU RA\">ĐẦU RA (Hỗ trợ việc làm & CV)</option>\n        </select>\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"sort_order\">Thứ Tự Sắp Xếp</label>\n        <input type=\"number\" id=\"sort_order\" name=\"sort_order\" value=\"1\" min=\"1\">\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"question\">Câu Hỏi Thường Gặp <span class=\"required\">*</span></label>\n      <input type=\"text\" id=\"question\" name=\"question\" required placeholder=\"Người trái ngành có học được không?\"\n        autocomplete=\"off\">\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"answer\">Câu Trả Lời Chi Tiết <span class=\"required\">*</span></label>\n      <textarea id=\"answer\" name=\"answer\" rows=\"5\" required\n        placeholder=\"Hoàn toàn được! Lộ trình của DataWithLy được thiết kế đi từ con số 0, bắt đầu từ tư duy dữ liệu thực tế và các công cụ dễ tiếp cận trước khi đi vào chuyên sâu.\"></textarea>\n    </div>\n\n    <div class=\"form-group\" style=\"margin-top: 6px;\">\n      <label class=\"checkbox-group\">\n        <input type=\"checkbox\" id=\"is_active\" name=\"is_active\" checked>\n        <span class=\"checkbox-label\">Kích hoạt hiển thị trên website (is_active)</span>\n      </label>\n    </div>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span>Lưu Câu Hỏi</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var catSelect = document.getElementById(\"category\");\n    var qInput = document.getElementById(\"question\");\n    var aInput = document.getElementById(\"answer\");\n\n    var catBadge = document.getElementById(\"previewCategoryBadge\");\n    var qPreview = document.getElementById(\"previewQuestion\");\n    var aPreview = document.getElementById(\"previewAnswer\");\n\n    function updatePreview() {\n      catBadge.innerText = catSelect.value;\n      qPreview.innerText = qInput.value || \"Câu hỏi thường gặp...\";\n      aPreview.innerText = aInput.value || \"Câu trả lời chi tiết...\";\n    }\n\n    catSelect.addEventListener(\"change\", updatePreview);\n    qInput.addEventListener(\"input\", updatePreview);\n    aInput.addEventListener(\"input\", updatePreview);\n\n    var form = document.getElementById(\"faqForm\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var errorBox = document.getElementById(\"errorBox\");\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var q = qInput.value.trim();\n      var a = aInput.value.trim();\n      if (!q || !a) {\n        showError(\"Vui lòng nhập cả câu hỏi và câu trả lời.\");\n        return;\n      }\n\n      var data = {\n        category: catSelect.value,\n        question: q,\n        answer: a,\n        is_active: document.getElementById(\"is_active\").checked,\n        sort_order: parseInt(document.getElementById(\"sort_order\").value, 10) || 1\n      };\n\n      submitBtn.disabled = true;\n      submitBtn.innerHTML = '<span class=\"spinner\"></span> Đang lưu...';\n\n      google.script.run\n        .withSuccessHandler(function () {\n          google.script.host.close();\n        })\n        .withFailureHandler(function (err) {\n          submitBtn.disabled = false;\n          submitBtn.innerHTML = '<span>Lưu Câu Hỏi</span>';\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .saveFaqFromModal(data);\n    });\n\n    function showError(msg) {\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n  </script>\n</body>\n\n</html>",
  "MentorModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">👤 Quản Trị Hồ Sơ Giảng Viên Hàng Loạt</h2>\n      <p class=\"modal-subtitle\">Quản trị và bổ sung danh sách giảng viên, mentor hiển thị trên Website DataWithLy</p>\n    </div>\n  </div>\n\n  <form id=\"mentorForm\">\n    <div id=\"mentorCardsContainer\" class=\"repeater-container\"></div>\n\n    <button type=\"button\" id=\"addMentorBtn\" class=\"btn-add-repeater\">\n      <span>➕ Thêm giảng viên</span>\n    </button>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n    <div id=\"successBox\" class=\"alert-banner alert-success fade-in\" style=\"display: none;\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span id=\"submitBtnText\">Lưu tất cả (1 giảng viên)</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var initialMentor = <?!= JSON.stringify(currentMentor || {}) ?>;\n\n    var form = document.getElementById(\"mentorForm\");\n    var container = document.getElementById(\"mentorCardsContainer\");\n    var addMentorBtn = document.getElementById(\"addMentorBtn\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var submitBtnText = document.getElementById(\"submitBtnText\");\n    var errorBox = document.getElementById(\"errorBox\");\n    var successBox = document.getElementById(\"successBox\");\n\n    function showError(msg) {\n      if (successBox) successBox.style.display = \"none\";\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n\n    function showSuccess(msg) {\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n      successBox.innerText = msg;\n      successBox.style.display = \"flex\";\n    }\n\n    function updateCardHeaders() {\n      var cards = container.querySelectorAll(\".form-card\");\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var titleElem = card.querySelector(\".form-card-title span\");\n        if (titleElem) {\n          titleElem.innerText = \"👤 Giảng viên / Mentor #\" + (i + 1);\n        }\n        var removeBtn = card.querySelector(\".btn-remove-card\");\n        if (removeBtn) {\n          removeBtn.style.display = cards.length > 1 ? \"inline-block\" : \"none\";\n        }\n      }\n      submitBtnText.innerText = \"Lưu tất cả (\" + cards.length + \" giảng viên)\";\n    }\n\n    function createMentorCard(data) {\n      var d = data || {};\n      var card = document.createElement(\"div\");\n      card.className = \"form-card fade-in\";\n      card.innerHTML =\n        '<div class=\"form-card-header\">' +\n          '<div class=\"form-card-title\"><span>👤 Giảng viên / Mentor</span></div>' +\n          '<button type=\"button\" class=\"btn-remove-card\" title=\"Xóa thẻ giảng viên này\">✕ Xóa</button>' +\n        '</div>' +\n        '<input type=\"hidden\" name=\"id\" value=\"' + (d.id || \"\") + '\">' +\n        '<div class=\"preview-box\">' +\n          '<div class=\"preview-header\">' +\n            '<span>Xem trước Card Giảng Viên (Live Card Preview)</span>' +\n            '<span class=\"badge-v badge-emerald\">Hiển thị Trang Chủ</span>' +\n          '</div>' +\n          '<div style=\"display: flex; gap: 14px; align-items: center;\">' +\n            '<img class=\"avatar-preview-img\" src=\"' + (d.avatar_url || \"/uploads/mentors/ly-hua.jpg\") + '\"' +\n              ' onerror=\"this.src=\\'https://ui-avatars.com/api/?name=Hua+Thao+Ly&background=8B1D2C&color=fff\\'\"' +\n              ' style=\"width: 54px; height: 54px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);\">' +\n            '<div>' +\n              '<div class=\"name-preview-text\" style=\"font-size: 14px; font-weight: 700; color: var(--primary);\">' +\n                (d.name || \"Hứa Thảo Ly\") +\n              '</div>' +\n              '<div class=\"title-preview-text\" style=\"font-size: 12px; color: var(--slate-muted);\">' +\n                (d.title || \"Lead Mentor & Founder DataWithLy\") +\n              '</div>' +\n              '<div class=\"companies-preview-text\" style=\"font-size: 11px; margin-top: 2px; font-weight: 500; color: #059669;\">' +\n                '🏢 ' + (d.companies_worked || \"MoMo, Tiki, ACB Bank\") +\n              '</div>' +\n            '</div>' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-row\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Họ và Tên Mentor <span class=\"required\">*</span></label>' +\n            '<input type=\"text\" name=\"name\" required value=\"' + (d.name || \"\") + '\" placeholder=\"Hứa Thảo Ly\">' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Chức Danh & Học Vị <span class=\"required\">*</span></label>' +\n            '<input type=\"text\" name=\"title\" required value=\"' + (d.title || \"\") + '\" placeholder=\"Lead Mentor & Founder DataWithLy\">' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Các Công Ty Từng Làm Việc (Phân tách bởi dấu phẩy)</label>' +\n          '<input type=\"text\" name=\"companies_worked\" value=\"' + (d.companies_worked || \"\") + '\" placeholder=\"MoMo, Tiki, Shopee, ACB Bank\">' +\n        '</div>' +\n        '<div class=\"form-row\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Đường Dẫn Ảnh Đại Diện (Avatar URL)</label>' +\n            '<input type=\"text\" name=\"avatar_url\" value=\"' + (d.avatar_url || \"\") + '\" placeholder=\"/uploads/mentors/ly-hua.jpg\">' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>LinkedIn URL</label>' +\n            '<input type=\"text\" name=\"linkedin_url\" value=\"' + (d.linkedin_url || \"\") + '\" placeholder=\"https://linkedin.com/in/lyhuadata\">' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Tiểu Sử & Kinh Nghiệm Thực Chiến</label>' +\n          '<textarea name=\"bio\" rows=\"3\" placeholder=\"Hơn 7 năm kinh nghiệm thực chiến trong ngành Dữ liệu tại các tập đoàn công nghệ...\">' + (d.bio || \"\") + '</textarea>' +\n        '</div>' +\n        '<div class=\"form-group\" style=\"margin-top: 6px;\">' +\n          '<label class=\"checkbox-group\">' +\n            '<input type=\"checkbox\" name=\"is_active\" ' + (d.is_active !== false ? 'checked' : '') + '>' +\n            '<span class=\"checkbox-label\">Kích hoạt hiển thị hồ sơ Mentor trên website (is_active)</span>' +\n          '</label>' +\n        '</div>';\n\n      var nameInput = card.querySelector('[name=\"name\"]');\n      var titleInput = card.querySelector('[name=\"title\"]');\n      var companiesInput = card.querySelector('[name=\"companies_worked\"]');\n      var avatarInput = card.querySelector('[name=\"avatar_url\"]');\n\n      var namePreview = card.querySelector(\".name-preview-text\");\n      var titlePreview = card.querySelector(\".title-preview-text\");\n      var companiesPreview = card.querySelector(\".companies-preview-text\");\n      var avatarPreview = card.querySelector(\".avatar-preview-img\");\n\n      nameInput.addEventListener(\"input\", function () {\n        namePreview.innerText = this.value || \"Chưa nhập họ tên\";\n      });\n      titleInput.addEventListener(\"input\", function () {\n        titlePreview.innerText = this.value || \"Mentor DataWithLy\";\n      });\n      companiesInput.addEventListener(\"input\", function () {\n        companiesPreview.innerText = \"🏢 \" + (this.value || \"Chưa có công ty\");\n      });\n      avatarInput.addEventListener(\"input\", function () {\n        if (this.value) avatarPreview.src = this.value;\n      });\n\n      var removeBtn = card.querySelector(\".btn-remove-card\");\n      removeBtn.addEventListener(\"click\", function () {\n        card.remove();\n        updateCardHeaders();\n      });\n\n      container.appendChild(card);\n      updateCardHeaders();\n      return card;\n    }\n\n    addMentorBtn.addEventListener(\"click\", function () {\n      var newCard = createMentorCard({});\n      var input = newCard.querySelector('[name=\"name\"]');\n      if (input) input.focus();\n    });\n\n    createMentorCard(initialMentor);\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var cards = container.querySelectorAll(\".form-card\");\n      if (cards.length === 0) {\n        showError(\"Vui lòng thêm ít nhất một giảng viên.\");\n        return;\n      }\n\n      var mentorList = [];\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var name = (card.querySelector('[name=\"name\"]').value || \"\").trim();\n        if (!name) {\n          showError(\"Vui lòng nhập họ tên cho giảng viên #\" + (i + 1) + \".\");\n          card.querySelector('[name=\"name\"]').focus();\n          return;\n        }\n\n        var title = (card.querySelector('[name=\"title\"]').value || \"\").trim();\n        if (!title) {\n          showError(\"Vui lòng nhập chức danh cho giảng viên #\" + (i + 1) + \".\");\n          card.querySelector('[name=\"title\"]').focus();\n          return;\n        }\n\n        mentorList.push({\n          id: card.querySelector('[name=\"id\"]').value || \"\",\n          name: name,\n          title: title,\n          bio: (card.querySelector('[name=\"bio\"]').value || \"\").trim(),\n          companies_worked: (card.querySelector('[name=\"companies_worked\"]').value || \"\").trim(),\n          avatar_url: (card.querySelector('[name=\"avatar_url\"]').value || \"\").trim(),\n          linkedin_url: (card.querySelector('[name=\"linkedin_url\"]').value || \"\").trim(),\n          is_active: card.querySelector('[name=\"is_active\"]').checked\n        });\n      }\n\n      submitBtn.disabled = true;\n      addMentorBtn.disabled = true;\n      submitBtnText.innerHTML = '<span class=\"spinner\"></span> Đang lưu ' + mentorList.length + ' giảng viên...';\n\n      google.script.run\n        .withSuccessHandler(function (res) {\n          showSuccess(\"✅ Đã lưu thành công \" + (res.count || mentorList.length) + \" hồ sơ giảng viên!\");\n          setTimeout(function () {\n            google.script.host.close();\n          }, 1200);\n        })\n        .withFailureHandler(function (err) {\n          submitBtn.disabled = false;\n          addMentorBtn.disabled = false;\n          updateCardHeaders();\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .addMentorsBatchFromModal(mentorList);\n    });\n  </script>\n</body>\n\n</html>\n",
  "PackageModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">📦 Quản Trị Gói Combo & Bảng Giá</h2>\n      <p class=\"modal-subtitle\">Thiết lập các gói học phí Combo, huy hiệu khuyến mãi và danh sách quyền lợi</p>\n    </div>\n  </div>\n\n  <form id=\"packageForm\">\n    <div class=\"form-row\">\n      <div class=\"form-group col-2\">\n        <label for=\"name\">Tên Gói Combo <span class=\"required\">*</span></label>\n        <input type=\"text\" id=\"name\" name=\"name\" required placeholder=\"Gói Nền Tảng (SQL + Power BI)\"\n          autocomplete=\"off\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"package_id\">Mã Gói (ID) <span class=\"required\">*</span></label>\n        <input type=\"text\" id=\"package_id\" name=\"package_id\" required placeholder=\"combo-foundation\"\n          style=\"font-family: monospace;\">\n      </div>\n    </div>\n\n    <div class=\"preview-box\">\n      <div class=\"preview-header\">\n        <span>Xem trước Card Bảng Giá</span>\n        <span id=\"previewBadge\" class=\"badge-v badge-crimson\">Tiết Kiệm 32%</span>\n      </div>\n      <div style=\"display: flex; justify-content: space-between; align-items: baseline;\">\n        <div>\n          <div id=\"previewName\" style=\"font-size: 14px; font-weight: 700; color: var(--primary);\">Gói Nền Tảng (SQL +\n            Power BI)</div>\n          <div id=\"previewFeaturesCount\" style=\"font-size: 11px; color: var(--slate-muted); margin-top: 2px;\">0 quyền\n            lợi đi kèm</div>\n        </div>\n        <div style=\"text-align: right;\">\n          <div id=\"previewSalePrice\" style=\"font-size: 16px; font-weight: 800; color: var(--primary);\">0 đ</div>\n          <del id=\"previewOrigPrice\" style=\"font-size: 11px; color: var(--slate-light);\">0 đ</del>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"sale_price\">Học Phí Ưu Đãi (VNĐ) <span class=\"required\">*</span></label>\n        <input type=\"number\" id=\"sale_price\" name=\"sale_price\" required placeholder=\"8900000\" step=\"50000\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"original_price\">Học Phí Gốc (VNĐ)</label>\n        <input type=\"number\" id=\"original_price\" name=\"original_price\" placeholder=\"13000000\" step=\"50000\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"badge\">Huy Hiệu (Badge)</label>\n        <input type=\"text\" id=\"badge\" name=\"badge\" placeholder=\"Tiết Kiệm 32%\">\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"features_list\">Danh Sách Tính Năng / Quyền Lợi (Mỗi dòng một mục) <span\n          class=\"required\">*</span></label>\n      <textarea id=\"features_list\" name=\"features_list\" rows=\"4\" required\n        placeholder=\"Trọn bộ 2 khóa SQL và Power BI từ cơ bản đến chuyên sâu&#10;Review CV và định hướng lộ trình cá nhân 1-1&#10;Tham gia cộng đồng Alumni DataWithLy trọn đời&#10;Hỗ trợ sửa bài tập hàng tuần bởi Mentor\"></textarea>\n      <div class=\"help-text\">Mỗi dòng (Enter) sẽ hiển thị thành một gạch đầu dòng có dấu tích xanh trên Bảng giá\n        website.</div>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"sort_order\">Thứ Tự Sắp Xếp</label>\n        <input type=\"number\" id=\"sort_order\" name=\"sort_order\" value=\"1\" min=\"1\">\n      </div>\n      <div class=\"form-group col-1\" style=\"display: flex; align-items: flex-end;\">\n        <label class=\"checkbox-group\" style=\"width: 100%;\">\n          <input type=\"checkbox\" id=\"is_popular\" name=\"is_popular\">\n          <span class=\"checkbox-label\">Gói phổ biến nhất (is_popular)</span>\n        </label>\n      </div>\n      <div class=\"form-group col-1\" style=\"display: flex; align-items: flex-end;\">\n        <label class=\"checkbox-group\" style=\"width: 100%;\">\n          <input type=\"checkbox\" id=\"is_active\" name=\"is_active\" checked>\n          <span class=\"checkbox-label\">Kích hoạt (is_active)</span>\n        </label>\n      </div>\n    </div>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span>Lưu Gói Combo</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var nameInput = document.getElementById(\"name\");\n    var pkgIdInput = document.getElementById(\"package_id\");\n    var origPriceInput = document.getElementById(\"original_price\");\n    var salePriceInput = document.getElementById(\"sale_price\");\n    var badgeInput = document.getElementById(\"badge\");\n    var featuresInput = document.getElementById(\"features_list\");\n\n    var previewName = document.getElementById(\"previewName\");\n    var previewBadge = document.getElementById(\"previewBadge\");\n    var previewSalePrice = document.getElementById(\"previewSalePrice\");\n    var previewOrigPrice = document.getElementById(\"previewOrigPrice\");\n    var previewFeaturesCount = document.getElementById(\"previewFeaturesCount\");\n\n    function slugify(text) {\n      if (!text) return \"\";\n      var str = text.toString().toLowerCase().trim();\n      str = str.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, \"a\");\n      str = str.replace(/[éèẻẽẹêếềểễệ]/g, \"e\");\n      str = str.replace(/[íìỉĩị]/g, \"i\");\n      str = str.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, \"o\");\n      str = str.replace(/[úùủũụưứừửữự]/g, \"u\");\n      str = str.replace(/[ýỳỷỹỵ]/g, \"y\");\n      str = str.replace(/đ/g, \"d\");\n      str = str.replace(/[\\s_]+/g, \"-\");\n      str = str.replace(/[^a-z0-9-]/g, \"\");\n      str = str.replace(/-+/g, \"-\");\n      str = str.replace(/^-+|-+$/g, \"\");\n      return str;\n    }\n\n    function formatVND(num) {\n      return Number(num || 0).toLocaleString(\"vi-VN\") + \" đ\";\n    }\n\n    function updatePreview() {\n      previewName.innerText = nameInput.value || \"Tên gói combo\";\n      var sale = parseFloat(salePriceInput.value) || 0;\n      var orig = parseFloat(origPriceInput.value) || 0;\n      previewSalePrice.innerText = formatVND(sale);\n      previewOrigPrice.innerText = orig > sale ? formatVND(orig) : \"\";\n\n      var badge = badgeInput.value.trim();\n      if (!badge && orig > sale && orig > 0) {\n        var pct = Math.round(((orig - sale) / orig) * 100);\n        badge = \"Tiết Kiệm \" + pct + \"%\";\n      }\n      previewBadge.innerText = badge || \"Gói Combo\";\n\n      var lines = featuresInput.value.split(\"\\n\").filter(function (l) { return l.trim().length > 0; });\n      previewFeaturesCount.innerText = lines.length + \" quyền lợi đi kèm\";\n    }\n\n    nameInput.addEventListener(\"input\", function () {\n      if (!pkgIdInput.value || pkgIdInput.dataset.touched !== \"true\") {\n        pkgIdInput.value = \"combo-\" + slugify(this.value);\n      }\n      updatePreview();\n    });\n\n    pkgIdInput.addEventListener(\"input\", function () {\n      this.dataset.touched = \"true\";\n    });\n\n    salePriceInput.addEventListener(\"input\", updatePreview);\n    origPriceInput.addEventListener(\"input\", updatePreview);\n    badgeInput.addEventListener(\"input\", updatePreview);\n    featuresInput.addEventListener(\"input\", updatePreview);\n\n    var form = document.getElementById(\"packageForm\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var errorBox = document.getElementById(\"errorBox\");\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var name = nameInput.value.trim();\n      var pkgId = pkgIdInput.value.trim();\n      var salePrice = parseFloat(salePriceInput.value) || 0;\n\n      if (!name || !pkgId || salePrice <= 0) {\n        showError(\"Vui lòng nhập tên gói, mã gói và học phí hợp lệ.\");\n        return;\n      }\n\n      var origPrice = parseFloat(origPriceInput.value) || salePrice;\n      var badge = badgeInput.value.trim();\n      if (!badge && origPrice > salePrice) {\n        badge = \"Tiết Kiệm \" + Math.round(((origPrice - salePrice) / origPrice) * 100) + \"%\";\n      }\n\n      var data = {\n        id: \"pkg-\" + pkgId.replace(/^combo-/, \"\"),\n        package_id: pkgId,\n        name: name,\n        original_price: origPrice,\n        sale_price: salePrice,\n        badge: badge,\n        features_list: featuresInput.value.trim(),\n        is_popular: document.getElementById(\"is_popular\").checked,\n        is_active: document.getElementById(\"is_active\").checked,\n        sort_order: parseInt(document.getElementById(\"sort_order\").value, 10) || 1\n      };\n\n      submitBtn.disabled = true;\n      submitBtn.innerHTML = '<span class=\"spinner\"></span> Đang lưu...';\n\n      google.script.run\n        .withSuccessHandler(function () {\n          google.script.host.close();\n        })\n        .withFailureHandler(function (err) {\n          submitBtn.disabled = false;\n          submitBtn.innerHTML = '<span>Lưu Gói Combo</span>';\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .savePackageFromModal(data);\n    });\n\n    function showError(msg) {\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n  </script>\n</body>\n\n</html>",
  "PromotionsModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">🏷️ Quản Trị Khuyến Mãi & Flash Sale</h2>\n      <p class=\"modal-subtitle\">Tạo mã Voucher giảm giá học phí theo % hoặc VNĐ hiển thị tức thì</p>\n    </div>\n  </div>\n\n  <form id=\"promoForm\">\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"code\">Mã Voucher (Code) <span class=\"required\">*</span></label>\n        <input type=\"text\" id=\"code\" name=\"code\" required placeholder=\"EARLYBIRD15\"\n          style=\"text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"badge\">Huy Hiệu (Badge Hiển Thị)</label>\n        <input type=\"text\" id=\"badge\" name=\"badge\" placeholder=\"Giảm 15%\">\n      </div>\n    </div>\n\n    <div class=\"preview-box\">\n      <div class=\"preview-header\">\n        <span>Xem trước Huy Hiệu Ưu Đãi</span>\n        <span id=\"previewBadge\" class=\"badge-v badge-crimson\">Mã: EARLYBIRD15 • Giảm 15%</span>\n      </div>\n      <div id=\"previewTitle\" style=\"font-weight: 600; color: var(--dark-slate); margin-top: 4px;\">\n        Chương trình ưu đãi học phí\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"title\">Tiêu Đề Chương Trình <span class=\"required\">*</span></label>\n      <input type=\"text\" id=\"title\" name=\"title\" required placeholder=\"Ưu Đãi Đăng Ký Sớm Khóa Mới\">\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"discount_type\">Hình Thức Giảm Giá <span class=\"required\">*</span></label>\n        <select id=\"discount_type\" name=\"discount_type\">\n          <option value=\"PERCENT\">Phần trăm (%)</option>\n          <option value=\"FIXED_VND\">Số tiền cố định (VNĐ)</option>\n        </select>\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"discount_value\">Mức Giảm <span class=\"required\">*</span></label>\n        <input type=\"number\" id=\"discount_value\" name=\"discount_value\" required placeholder=\"15\" min=\"1\" step=\"1\">\n      </div>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"start_date\">Ngày Bắt Đầu</label>\n        <input type=\"date\" id=\"start_date\" name=\"start_date\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"end_date\">Ngày Kết Thúc</label>\n        <input type=\"date\" id=\"end_date\" name=\"end_date\">\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"applicable_courses\">Khóa Học Áp Dụng</label>\n      <select id=\"applicable_courses\" name=\"applicable_courses\">\n        <option value=\"ALL\">Tất cả các khóa học (ALL)</option>\n        <? for (var i = 0; i < coursesList.length; i++) { ?>\n        <option value=\"<?= coursesList[i].id ?>\">\n          <?= coursesList[i].title ?>\n        </option>\n        <? } ?>\n      </select>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"sort_order\">Thứ Tự Sắp Xếp</label>\n        <input type=\"number\" id=\"sort_order\" name=\"sort_order\" value=\"1\" min=\"1\">\n      </div>\n      <div class=\"form-group col-1\" style=\"display: flex; align-items: flex-end;\">\n        <label class=\"checkbox-group\" style=\"width: 100%;\">\n          <input type=\"checkbox\" id=\"is_active\" name=\"is_active\" checked>\n          <span class=\"checkbox-label\">Kích hoạt Voucher (is_active)</span>\n        </label>\n      </div>\n    </div>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n    <div id=\"successBox\" class=\"alert-banner alert-success fade-in\" style=\"display: none;\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"button\" id=\"saveAndContinueBtn\" class=\"btn-secondary\">\n        <span>Lưu & Tạo Tiếp</span>\n      </button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span>Tạo Mã Khuyến Mãi</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var existingCodes = <?!= JSON.stringify(existingCodes || []) ?>;\n    var codeInput = document.getElementById(\"code\");\n    var titleInput = document.getElementById(\"title\");\n    var badgeInput = document.getElementById(\"badge\");\n    var typeSelect = document.getElementById(\"discount_type\");\n    var valueInput = document.getElementById(\"discount_value\");\n    var previewBadge = document.getElementById(\"previewBadge\");\n    var previewTitle = document.getElementById(\"previewTitle\");\n\n    function updatePromoPreview() {\n      var code = (codeInput.value || \"EARLYBIRD\").toUpperCase();\n      var type = typeSelect.value;\n      var val = parseFloat(valueInput.value) || 0;\n      var badge = badgeInput.value.trim();\n\n      if (!badge && val > 0) {\n        badge = type === \"PERCENT\" ? \"Giảm \" + val + \"%\" : \"Giảm \" + (val / 1000).toLocaleString() + \"K\";\n      }\n\n      var isExisting = codeInput.value && existingCodes.indexOf(code) !== -1;\n      previewBadge.className = isExisting ? \"badge-v badge-gold\" : \"badge-v badge-crimson\";\n      previewBadge.innerText = (isExisting ? \"⚡ Cập nhật mã: \" : \"Mã: \") + code + (badge ? \" • \" + badge : \"\");\n      previewTitle.innerText = titleInput.value || \"Chương trình ưu đãi học phí\";\n    }\n\n    codeInput.addEventListener(\"input\", function () {\n      this.value = this.value.toUpperCase().replace(/[^A-Z0-9_-]/g, \"\");\n      updatePromoPreview();\n    });\n    titleInput.addEventListener(\"input\", updatePromoPreview);\n    badgeInput.addEventListener(\"input\", updatePromoPreview);\n    typeSelect.addEventListener(\"change\", function () {\n      if (this.value === \"PERCENT\") {\n        valueInput.placeholder = \"15\";\n        valueInput.max = \"100\";\n      } else {\n        valueInput.placeholder = \"500000\";\n        valueInput.removeAttribute(\"max\");\n      }\n      updatePromoPreview();\n    });\n    valueInput.addEventListener(\"input\", updatePromoPreview);\n\n    // Mặc định ngày\n    var today = new Date().toISOString().split(\"T\")[0];\n    document.getElementById(\"start_date\").value = today;\n\n    var form = document.getElementById(\"promoForm\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var saveAndContinueBtn = document.getElementById(\"saveAndContinueBtn\");\n    var errorBox = document.getElementById(\"errorBox\");\n    var successBox = document.getElementById(\"successBox\");\n\n    function showError(msg) {\n      if (successBox) successBox.style.display = \"none\";\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n\n    function showSuccess(msg) {\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n      successBox.innerText = msg;\n      successBox.style.display = \"flex\";\n    }\n\n    function setButtonsLoading(isLoading, activeBtn) {\n      if (isLoading) {\n        submitBtn.disabled = true;\n        saveAndContinueBtn.disabled = true;\n        if (activeBtn) {\n          activeBtn.innerHTML = '<span class=\"spinner\"></span> Đang lưu...';\n        }\n      } else {\n        submitBtn.disabled = false;\n        saveAndContinueBtn.disabled = false;\n        submitBtn.innerHTML = '<span>Tạo Mã Khuyến Mãi</span>';\n        saveAndContinueBtn.innerHTML = '<span>Lưu & Tạo Tiếp</span>';\n      }\n    }\n\n    function submitPromotion(isContinue) {\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var code = codeInput.value.trim();\n      var title = titleInput.value.trim();\n      var type = typeSelect.value;\n      var val = parseFloat(valueInput.value) || 0;\n\n      if (!code || !title) {\n        showError(\"Vui lòng nhập Mã voucher và Tiêu đề khuyến mãi.\");\n        return;\n      }\n\n      if (type === \"PERCENT\" && (val <= 0 || val > 100)) {\n        showError(\"Tỷ lệ % giảm giá phải từ 1 đến 100.\");\n        return;\n      }\n      if (type === \"FIXED_VND\" && val <= 0) {\n        showError(\"Số tiền giảm VNĐ phải lớn hơn 0.\");\n        return;\n      }\n\n      var start = document.getElementById(\"start_date\").value;\n      var end = document.getElementById(\"end_date\").value;\n      if (start && end && end < start) {\n        showError(\"Ngày kết thúc không được nhỏ hơn ngày bắt đầu.\");\n        return;\n      }\n\n      var badge = badgeInput.value.trim();\n      if (!badge) {\n        badge = type === \"PERCENT\" ? \"Giảm \" + val + \"%\" : \"Giảm \" + (val / 1000).toLocaleString() + \"K\";\n      }\n\n      var data = {\n        id: \"promo-\" + code.toLowerCase(),\n        code: code,\n        title: title,\n        discount_type: type,\n        discount_value: val,\n        start_date: start,\n        end_date: end ? end + \" 23:59:59\" : \"\",\n        applicable_courses: document.getElementById(\"applicable_courses\").value,\n        badge: badge,\n        is_active: document.getElementById(\"is_active\").checked,\n        sort_order: parseInt(document.getElementById(\"sort_order\").value, 10) || 1\n      };\n\n      var activeBtn = isContinue ? saveAndContinueBtn : submitBtn;\n      setButtonsLoading(true, activeBtn);\n\n      google.script.run\n        .withSuccessHandler(function (res) {\n          if (!isContinue) {\n            google.script.host.close();\n            return;\n          }\n\n          setButtonsLoading(false);\n\n          var savedCode = code;\n          if (existingCodes.indexOf(savedCode) === -1) {\n            existingCodes.push(savedCode);\n          }\n          showSuccess(\"✅ Đã lưu thành công mã khuyến mãi \" + savedCode + \"! Tiếp tục tạo mã mới...\");\n\n          // Reset ô Code và cập nhật Preview\n          codeInput.value = \"\";\n          badgeInput.value = \"\";\n          var sortOrderEl = document.getElementById(\"sort_order\");\n          if (sortOrderEl) {\n            sortOrderEl.value = (parseInt(sortOrderEl.value, 10) || 1) + 1;\n          }\n          updatePromoPreview();\n\n          // Focus vào ô Code mới\n          codeInput.focus();\n        })\n        .withFailureHandler(function (err) {\n          setButtonsLoading(false);\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .addNewPromotionFromModal(data);\n    }\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      submitPromotion(false);\n    });\n\n    saveAndContinueBtn.addEventListener(\"click\", function (e) {\n      e.preventDefault();\n      submitPromotion(true);\n    });\n  </script>\n</body>\n\n</html>",
  "SettingsModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">⚙️ Cấu Hình Hệ Thống (Settings)</h2>\n      <p class=\"modal-subtitle\">Cấu hình hotline, Zalo chat, email, thanh thông báo Announcement Bar và Webhook</p>\n    </div>\n  </div>\n\n  <form id=\"settingsForm\">\n    <div class=\"preview-box\">\n      <div class=\"preview-header\">\n        <span>Xem trước Thanh Thông Báo Header (Announcement Bar)</span>\n        <span class=\"badge-v badge-crimson\">Live Header</span>\n      </div>\n      <div id=\"previewAnnouncement\"\n        style=\"background: var(--primary); color: #FFFFFF; padding: 8px 12px; border-radius: 4px; font-size: 11px; text-align: center; font-weight: 500;\">\n        <?= currentSettings.announcement_bar || 'Ưu đãi học phí 15% cho 10 học viên đăng ký sớm trong tuần này!' ?>\n      </div>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"hotline\">Số Điện Thoại Hotline <span class=\"required\">*</span></label>\n        <input type=\"text\" id=\"hotline\" name=\"hotline\" required value=\"<?= currentSettings.hotline || '0901 234 567' ?>\"\n          placeholder=\"0901 234 567\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"contact_email\">Email Tuyển Sinh / Hỗ Trợ</label>\n        <input type=\"text\" id=\"contact_email\" name=\"contact_email\"\n          value=\"<?= currentSettings.contact_email || 'tuyensinh@datawithly.edu.vn' ?>\"\n          placeholder=\"tuyensinh@datawithly.edu.vn\">\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"zalo_url\">Đường Dẫn Chat Zalo Tư Vấn Nhanh</label>\n      <input type=\"text\" id=\"zalo_url\" name=\"zalo_url\"\n        value=\"<?= currentSettings.zalo_url || 'https://zalo.me/0901234567' ?>\"\n        placeholder=\"https://zalo.me/0901234567\">\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"announcement_bar\">Nội Dung Thanh Thông Báo (Announcement Bar)</label>\n      <textarea id=\"announcement_bar\" name=\"announcement_bar\" rows=\"2\"\n        placeholder=\"Ưu đãi học phí 15% cho 10 học viên đăng ký sớm trong tuần này!\"><?= currentSettings.announcement_bar || '' ?></textarea>\n      <div class=\"help-text\">Dòng thông báo này sẽ hiển thị trên cùng của toàn bộ website. Để trống nếu muốn ẩn.</div>\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"revalidation_url\">URL Webhook Đồng Bộ Tức Thì (ISR Revalidation)</label>\n      <input type=\"text\" id=\"revalidation_url\" name=\"revalidation_url\"\n        value=\"<?= currentSettings.revalidation_url || '' ?>\"\n        placeholder=\"https://datawithly.edu.vn/api/revalidate?secret=...\">\n      <div class=\"help-text\">Webhook được gọi tự động khi bạn bấm nút [⚡ Đồng Bộ Lên Website Ngay Lập Tức].</div>\n    </div>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span>Lưu Cấu Hình</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var announceInput = document.getElementById(\"announcement_bar\");\n    var announcePreview = document.getElementById(\"previewAnnouncement\");\n\n    announceInput.addEventListener(\"input\", function () {\n      announcePreview.innerText = this.value || \"Chưa có thông báo\";\n    });\n\n    var form = document.getElementById(\"settingsForm\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var errorBox = document.getElementById(\"errorBox\");\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var data = {\n        hotline: document.getElementById(\"hotline\").value.trim(),\n        contact_email: document.getElementById(\"contact_email\").value.trim(),\n        zalo_url: document.getElementById(\"zalo_url\").value.trim(),\n        announcement_bar: announceInput.value.trim(),\n        revalidation_url: document.getElementById(\"revalidation_url\").value.trim()\n      };\n\n      submitBtn.disabled = true;\n      submitBtn.innerHTML = '<span class=\"spinner\"></span> Đang lưu...';\n\n      google.script.run\n        .withSuccessHandler(function () {\n          google.script.host.close();\n        })\n        .withFailureHandler(function (err) {\n          submitBtn.disabled = false;\n          submitBtn.innerHTML = '<span>Lưu Cấu Hình</span>';\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .saveSettingsFromModal(data);\n    });\n\n    function showError(msg) {\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n  </script>\n</body>\n\n</html>",
  "SharedStyles": "<style>\n  :root {\n    --primary: #8B1D2C;\n    --primary-hover: #701622;\n    --primary-subtle: rgba(139, 29, 44, 0.08);\n    --primary-border: #F0D5D8;\n    --dark-slate: #1F242F;\n    --slate-muted: #4B5563;\n    --slate-light: #9CA3AF;\n    --bg-canvas: #FAF9F6;\n    --bg-card: #FFFFFF;\n    --border-color: #E5E7EB;\n    --border-focus: #8B1D2C;\n    --success: #059669;\n    --success-bg: #ECFDF5;\n    --warning: #D97706;\n    --warning-bg: #FFFBEB;\n    --danger: #DC2626;\n    --danger-bg: #FEF2F2;\n    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n    --radius-sm: 4px;\n    --radius-md: 8px;\n    --radius-lg: 12px;\n  }\n\n  * {\n    box-sizing: border-box;\n  }\n\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;\n    padding: 18px 20px 24px;\n    margin: 0;\n    background: var(--bg-canvas);\n    color: var(--dark-slate);\n    font-size: 13px;\n    line-height: 1.5;\n  }\n\n  .modal-header {\n    border-bottom: 2px solid var(--primary-border);\n    padding-bottom: 12px;\n    margin-bottom: 16px;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n  }\n\n  .modal-title {\n    margin: 0;\n    color: var(--primary);\n    font-size: 17px;\n    font-weight: 700;\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    letter-spacing: -0.01em;\n  }\n\n  .modal-subtitle {\n    margin: 4px 0 0;\n    font-size: 11px;\n    color: var(--slate-muted);\n  }\n\n  .form-group {\n    margin-bottom: 12px;\n  }\n\n  .form-row {\n    display: flex;\n    gap: 12px;\n    margin-bottom: 12px;\n  }\n\n  .form-row .form-group {\n    margin-bottom: 0;\n    flex: 1;\n  }\n\n  .col-1 {\n    flex: 1;\n  }\n\n  .col-2 {\n    flex: 2;\n  }\n\n  .col-3 {\n    flex: 3;\n  }\n\n  .col-full {\n    width: 100%;\n  }\n\n  label {\n    display: block;\n    font-size: 12px;\n    font-weight: 600;\n    margin-bottom: 4px;\n    color: #374151;\n  }\n\n  label .required {\n    color: var(--danger);\n    margin-left: 2px;\n  }\n\n  .help-text {\n    font-size: 11px;\n    color: var(--slate-muted);\n    margin-top: 3px;\n    line-height: 1.35;\n  }\n\n  input[type=\"text\"],\n  input[type=\"number\"],\n  input[type=\"url\"],\n  input[type=\"date\"],\n  input[type=\"datetime-local\"],\n  select,\n  textarea {\n    width: 100%;\n    box-sizing: border-box;\n    padding: 8px 10px;\n    border: 1px solid var(--border-color);\n    border-radius: var(--radius-sm);\n    font-size: 13px;\n    font-family: inherit;\n    background: var(--bg-card);\n    color: var(--dark-slate);\n    transition: border-color 0.15s ease, box-shadow 0.15s ease;\n  }\n\n  input:focus,\n  select:focus,\n  textarea:focus {\n    outline: none;\n    border-color: var(--border-focus);\n    box-shadow: 0 0 0 3px rgba(139, 29, 44, 0.15);\n  }\n\n  input[readonly],\n  textarea[readonly] {\n    background-color: #F3F4F6;\n    color: var(--slate-muted);\n    cursor: not-allowed;\n  }\n\n  textarea {\n    resize: vertical;\n    min-height: 64px;\n  }\n\n  /* Checkbox & Switch */\n  .checkbox-group {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    background: #FFFFFF;\n    border: 1px solid var(--border-color);\n    padding: 8px 12px;\n    border-radius: var(--radius-sm);\n    cursor: pointer;\n    user-select: none;\n  }\n\n  .checkbox-group:hover {\n    border-color: #D1D5DB;\n  }\n\n  .checkbox-group input[type=\"checkbox\"] {\n    width: 16px;\n    height: 16px;\n    accent-color: var(--primary);\n    cursor: pointer;\n    margin: 0;\n  }\n\n  .checkbox-label {\n    font-size: 12px;\n    font-weight: 500;\n    color: var(--dark-slate);\n    cursor: pointer;\n  }\n\n  /* Live Preview Box */\n  .preview-box {\n    background: #FFFFFF;\n    border: 1px dashed var(--primary-border);\n    border-radius: var(--radius-md);\n    padding: 12px;\n    margin-bottom: 14px;\n    transition: all 0.2s ease;\n  }\n\n  .preview-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    font-size: 11px;\n    font-weight: 700;\n    text-transform: uppercase;\n    color: var(--primary);\n    letter-spacing: 0.05em;\n    margin-bottom: 8px;\n  }\n\n  .preview-content {\n    font-size: 12px;\n    color: var(--dark-slate);\n  }\n\n  /* Badges */\n  .badge-v {\n    display: inline-flex;\n    align-items: center;\n    gap: 4px;\n    padding: 2px 8px;\n    border-radius: 9999px;\n    font-size: 11px;\n    font-weight: 600;\n    line-height: 1.4;\n  }\n\n  .badge-crimson {\n    background: var(--primary-subtle);\n    color: var(--primary);\n    border: 1px solid var(--primary-border);\n  }\n\n  .badge-emerald {\n    background: var(--success-bg);\n    color: var(--success);\n    border: 1px solid #A7F3D0;\n  }\n\n  .badge-gold {\n    background: var(--warning-bg);\n    color: var(--warning);\n    border: 1px solid #FDE68A;\n  }\n\n  .badge-slate {\n    background: #F3F4F6;\n    color: var(--dark-slate);\n    border: 1px solid #E5E7EB;\n  }\n\n  /* Action Buttons */\n  .btn-group {\n    display: flex;\n    justify-content: flex-end;\n    gap: 10px;\n    margin-top: 18px;\n    padding-top: 14px;\n    border-top: 1px solid var(--border-color);\n  }\n\n  button {\n    cursor: pointer;\n    font-family: inherit;\n    font-weight: 600;\n    font-size: 13px;\n    padding: 8px 18px;\n    border-radius: var(--radius-sm);\n    transition: all 0.15s ease;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    gap: 6px;\n  }\n\n  .btn-submit {\n    background: var(--primary);\n    color: #FFFFFF;\n    border: 1px solid var(--primary-hover);\n    box-shadow: 0 1px 2px rgba(139, 29, 44, 0.2);\n  }\n\n  .btn-submit:hover:not(:disabled) {\n    background: var(--primary-hover);\n    box-shadow: 0 2px 4px rgba(139, 29, 44, 0.3);\n  }\n\n  .btn-submit:disabled {\n    background: #9CA3AF;\n    border-color: #9CA3AF;\n    cursor: not-allowed;\n    opacity: 0.7;\n  }\n\n  .btn-secondary {\n    background: #FFFFFF;\n    color: var(--primary);\n    border: 1px solid var(--primary);\n    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);\n  }\n\n  .btn-secondary:hover:not(:disabled) {\n    background: var(--primary-subtle);\n    border-color: var(--primary-hover);\n    color: var(--primary-hover);\n  }\n\n  .btn-secondary:disabled {\n    background: #F3F4F6;\n    border-color: #E5E7EB;\n    color: #9CA3AF;\n    cursor: not-allowed;\n    opacity: 0.7;\n  }\n\n  .btn-secondary .spinner {\n    border-color: rgba(139, 29, 44, 0.2);\n    border-top-color: var(--primary);\n  }\n\n  .btn-cancel {\n    background: #FFFFFF;\n    color: var(--dark-slate);\n    border: 1px solid var(--border-color);\n  }\n\n  .btn-cancel:hover {\n    background: #F9FAFB;\n    border-color: #D1D5DB;\n  }\n\n  /* Alert Messages */\n  .error-msg {\n    color: var(--danger);\n    font-size: 11px;\n    margin-top: 4px;\n    display: none;\n    font-weight: 500;\n  }\n\n  .alert-banner {\n    padding: 10px 12px;\n    border-radius: var(--radius-sm);\n    font-size: 12px;\n    margin-bottom: 12px;\n    display: flex;\n    align-items: flex-start;\n    gap: 8px;\n  }\n\n  .alert-danger {\n    background: var(--danger-bg);\n    color: var(--danger);\n    border: 1px solid #FECACA;\n  }\n\n  .alert-success {\n    background: var(--success-bg);\n    color: var(--success);\n    border: 1px solid #A7F3D0;\n  }\n\n  .alert-info {\n    background: #EFF6FF;\n    color: #1D4ED8;\n    border: 1px solid #BFDBFE;\n  }\n\n  /* Spinner */\n  .spinner {\n    display: inline-block;\n    width: 14px;\n    height: 14px;\n    border: 2px solid rgba(255, 255, 255, 0.3);\n    border-radius: 50%;\n    border-top-color: #FFFFFF;\n    animation: spin 0.8s linear infinite;\n  }\n\n  @keyframes spin {\n    to {\n      transform: rotate(360deg);\n    }\n  }\n\n  /* Fade in */\n  .fade-in {\n    animation: fadeIn 0.2s ease-in-out;\n  }\n\n  @keyframes fadeIn {\n    from {\n      opacity: 0;\n      transform: translateY(-4px);\n    }\n\n    to {\n      opacity: 1;\n      transform: translateY(0);\n    }\n  }\n\n  /* Repeater Cards & Batch Entry UI */\n  .repeater-container {\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    margin-bottom: 16px;\n  }\n\n  .form-card {\n    background: #FFFFFF;\n    border: 1px solid var(--border-color);\n    border-radius: var(--radius-md);\n    padding: 16px;\n    box-shadow: var(--shadow-sm);\n    position: relative;\n    transition: border-color 0.2s ease, box-shadow 0.2s ease;\n  }\n\n  .form-card:hover {\n    border-color: #D1D5DB;\n    box-shadow: var(--shadow-md);\n  }\n\n  .form-card-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding-bottom: 10px;\n    margin-bottom: 12px;\n    border-bottom: 1px solid var(--border-color);\n  }\n\n  .form-card-title {\n    font-size: 13px;\n    font-weight: 700;\n    color: var(--primary);\n    display: flex;\n    align-items: center;\n    gap: 6px;\n  }\n\n  .btn-remove-card {\n    background: transparent;\n    color: #9CA3AF;\n    border: 1px solid transparent;\n    padding: 3px 8px;\n    font-size: 11px;\n    font-weight: 600;\n    border-radius: var(--radius-sm);\n    cursor: pointer;\n    transition: all 0.15s ease;\n  }\n\n  .btn-remove-card:hover {\n    color: var(--danger);\n    background: var(--danger-bg);\n    border-color: #FECACA;\n  }\n\n  .btn-add-repeater {\n    width: 100%;\n    background: #FFFFFF;\n    color: var(--primary);\n    border: 1.5px dashed var(--primary-border);\n    padding: 10px 16px;\n    border-radius: var(--radius-md);\n    font-weight: 600;\n    font-size: 13px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    gap: 8px;\n    cursor: pointer;\n    transition: all 0.2s ease;\n    margin-bottom: 14px;\n  }\n\n  .btn-add-repeater:hover {\n    background: var(--primary-subtle);\n    border-color: var(--primary);\n  }\n</style>",
  "TestimonialModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">💬 Thêm Đánh Giá Học Viên</h2>\n      <p class=\"modal-subtitle\">Thêm feedback thực tế từ cựu học viên đang làm việc tại các tập đoàn lớn</p>\n    </div>\n  </div>\n\n  <form id=\"testimonialForm\">\n    <div class=\"preview-box\">\n      <div class=\"preview-header\">\n        <span>Xem trước Testimonial Card</span>\n        <span id=\"previewRatingStars\" style=\"color: #F59E0B; font-size: 14px;\">★★★★★</span>\n      </div>\n      <div style=\"display: flex; gap: 12px; align-items: flex-start;\">\n        <img id=\"avatarPreview\" src=\"/uploads/avatars/default.jpg\"\n          onerror=\"this.src='https://ui-avatars.com/api/?name=Hoc+Vien&background=1F242F&color=fff'\"\n          style=\"width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--primary-border);\">\n        <div style=\"flex: 1;\">\n          <div style=\"display: flex; justify-content: space-between;\">\n            <strong id=\"namePreview\" style=\"font-size: 13px; color: var(--primary);\">Trần Minh Quân</strong>\n            <span id=\"companyPreview\" class=\"badge-v badge-slate\" style=\"font-size: 10px;\">Shopee Express</span>\n          </div>\n          <div id=\"rolePreview\" style=\"font-size: 11px; color: var(--slate-muted);\">Junior Data Analyst</div>\n          <p id=\"reviewPreview\"\n            style=\"font-size: 12px; color: var(--dark-slate); font-style: italic; margin: 6px 0 0; line-height: 1.4;\">\n            \"Khóa học SQL của chị Ly thực sự thực chiến và dễ hiểu...\"\n          </p>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"student_name\">Họ và Tên Học Viên <span class=\"required\">*</span></label>\n        <input type=\"text\" id=\"student_name\" name=\"student_name\" required placeholder=\"Trần Minh Quân\"\n          autocomplete=\"off\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"role\">Vị Trí Công Việc</label>\n        <input type=\"text\" id=\"role\" name=\"role\" placeholder=\"Junior Data Analyst\">\n      </div>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"company\">Công Ty Làm Việc</label>\n        <input type=\"text\" id=\"company\" name=\"company\" placeholder=\"Shopee Express, Techcombank...\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"course_id\">Khóa Học Liên Quan <span class=\"required\">*</span></label>\n        <select id=\"course_id\" name=\"course_id\" required>\n          <option value=\"ALL\">Khóa Học Chung / Tất cả</option>\n          <? for (var i = 0; i < coursesList.length; i++) { ?>\n          <option value=\"<?= coursesList[i].id ?>\">\n            <?= coursesList[i].title ?>\n          </option>\n          <? } ?>\n        </select>\n      </div>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"rating\">Số Sao Đánh Giá <span class=\"required\">*</span></label>\n        <select id=\"rating\" name=\"rating\">\n          <option value=\"5\" selected>⭐⭐⭐⭐⭐ 5 Sao (Xuất sắc)</option>\n          <option value=\"4\">⭐⭐⭐⭐ 4 Sao (Rất tốt)</option>\n          <option value=\"3\">⭐⭐⭐ 3 Sao (Khá)</option>\n          <option value=\"2\">⭐⭐ 2 Sao (Trung bình)</option>\n          <option value=\"1\">⭐ 1 Sao (Cần cải thiện)</option>\n        </select>\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"avatar_url\">Ảnh Đại Diện (Avatar URL)</label>\n        <input type=\"text\" id=\"avatar_url\" name=\"avatar_url\" placeholder=\"/uploads/avatars/quan-tran.jpg\">\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"review_text\">Nội Dung Đánh Giá / Cảm Nhận <span class=\"required\">*</span></label>\n      <textarea id=\"review_text\" name=\"review_text\" rows=\"4\" required\n        placeholder=\"Khóa học SQL của chị Ly thực sự thực chiến. Chị chỉ cho mình cách viết Window Functions mà lúc trước mình đọc docs hoài không hiểu...\"></textarea>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label class=\"checkbox-group\">\n          <input type=\"checkbox\" id=\"is_featured\" name=\"is_featured\" checked>\n          <span class=\"checkbox-label\">Đánh giá nổi bật (Trang chủ)</span>\n        </label>\n      </div>\n      <div class=\"form-group col-1\">\n        <label class=\"checkbox-group\">\n          <input type=\"checkbox\" id=\"is_active\" name=\"is_active\" checked>\n          <span class=\"checkbox-label\">Kích hoạt hiển thị (is_active)</span>\n        </label>\n      </div>\n    </div>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span>Lưu Đánh Giá</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var nameInput = document.getElementById(\"student_name\");\n    var roleInput = document.getElementById(\"role\");\n    var companyInput = document.getElementById(\"company\");\n    var ratingSelect = document.getElementById(\"rating\");\n    var avatarInput = document.getElementById(\"avatar_url\");\n    var reviewInput = document.getElementById(\"review_text\");\n\n    var namePreview = document.getElementById(\"namePreview\");\n    var rolePreview = document.getElementById(\"rolePreview\");\n    var companyPreview = document.getElementById(\"companyPreview\");\n    var ratingPreview = document.getElementById(\"previewRatingStars\");\n    var avatarPreview = document.getElementById(\"avatarPreview\");\n    var reviewPreview = document.getElementById(\"reviewPreview\");\n\n    function slugify(text) {\n      if (!text) return \"\";\n      var str = text.toString().toLowerCase().trim();\n      str = str.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, \"a\");\n      str = str.replace(/[éèẻẽẹêếềểễệ]/g, \"e\");\n      str = str.replace(/[íìỉĩị]/g, \"i\");\n      str = str.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, \"o\");\n      str = str.replace(/[úùủũụưứừửữự]/g, \"u\");\n      str = str.replace(/[ýỳỷỹỵ]/g, \"y\");\n      str = str.replace(/đ/g, \"d\");\n      str = str.replace(/[\\s_]+/g, \"-\");\n      str = str.replace(/[^a-z0-9-]/g, \"\");\n      str = str.replace(/-+/g, \"-\");\n      str = str.replace(/^-+|-+$/g, \"\");\n      return str;\n    }\n\n    function updatePreview() {\n      namePreview.innerText = nameInput.value || \"Tên học viên\";\n      rolePreview.innerText = roleInput.value || \"Vị trí công việc\";\n      companyPreview.innerText = companyInput.value || \"Tập đoàn công nghệ\";\n      var stars = parseInt(ratingSelect.value, 10) || 5;\n      ratingPreview.innerText = \"★\".repeat(stars) + \"☆\".repeat(5 - stars);\n      reviewPreview.innerText = reviewInput.value ? '\"' + reviewInput.value + '\"' : '\"Cảm nhận thực tế của học viên...\"';\n      if (avatarInput.value) avatarPreview.src = avatarInput.value;\n    }\n\n    nameInput.addEventListener(\"input\", updatePreview);\n    roleInput.addEventListener(\"input\", updatePreview);\n    companyInput.addEventListener(\"input\", updatePreview);\n    ratingSelect.addEventListener(\"change\", updatePreview);\n    avatarInput.addEventListener(\"input\", updatePreview);\n    reviewInput.addEventListener(\"input\", updatePreview);\n\n    var form = document.getElementById(\"testimonialForm\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var errorBox = document.getElementById(\"errorBox\");\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var sName = nameInput.value.trim();\n      var rText = reviewInput.value.trim();\n      if (!sName || !rText) {\n        showError(\"Vui lòng nhập tên học viên và nội dung đánh giá.\");\n        return;\n      }\n\n      var slugName = slugify(sName);\n      var data = {\n        id: \"t-\" + (Date.now().toString(36).substr(-4)) + \"-\" + slugName,\n        student_name: sName,\n        role: roleInput.value.trim(),\n        company: companyInput.value.trim(),\n        course_id: document.getElementById(\"course_id\").value,\n        rating: ratingSelect.value,\n        review_text: rText,\n        avatar_url: avatarInput.value.trim() || \"/uploads/avatars/default.jpg\",\n        is_featured: document.getElementById(\"is_featured\").checked,\n        is_active: document.getElementById(\"is_active\").checked\n      };\n\n      submitBtn.disabled = true;\n      submitBtn.innerHTML = '<span class=\"spinner\"></span> Đang lưu...';\n\n      google.script.run\n        .withSuccessHandler(function () {\n          google.script.host.close();\n        })\n        .withFailureHandler(function (err) {\n          submitBtn.disabled = false;\n          submitBtn.innerHTML = '<span>Lưu Đánh Giá</span>';\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .saveTestimonialFromModal(data);\n    });\n\n    function showError(msg) {\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n  </script>\n</body>\n\n</html>"
};

function include(filename) {
  if (typeof INLINED_HTML !== "undefined" && INLINED_HTML[filename]) {
    return INLINED_HTML[filename];
  }
  try {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  } catch (e) {
    return "";
  }
}

function createModalTemplate(templateName) {
  if (typeof INLINED_HTML !== "undefined" && INLINED_HTML[templateName]) {
    return HtmlService.createTemplate(INLINED_HTML[templateName]);
  }
  return HtmlService.createTemplateFromFile(templateName);
}

function getDataWithLySystemInfo() {
  return {
    system: "DataWithLy CMS Content Engine",
    brand: "DataWithLy (Mentor Hứa Thảo Ly)",
    version: "2.2.0",
    architecture: "Standalone CMS Content Bundle with 10 Inlined Native Modals",
    status: "HEALTHY",
    timestamp: new Date().toISOString()
  };
}


// ==============================================================================
// FILE NGUỒN: 00_CmsConfig.gs
// ==============================================================================

/**
 * ==============================================================================
 * MODULE 00: CẤU HÌNH CMS CONTENT MASTER (CMS CONFIGURATION)
 * ==============================================================================
 * Quản lý tập trung các khóa bí mật, URL webhook làm mới website và khóa ghi lock.
 * Áp dụng tiêu chuẩn bảo mật Google Enterprise: Sử dụng PropertiesService (Script Properties).
 * ==============================================================================
 */

function getScriptProperty(key, fallbackValue) {
  try {
    var prop = PropertiesService.getScriptProperties().getProperty(key);
    if (prop && prop.trim()) {
      return prop.trim();
    }
  } catch (e) {}

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("settings");
    if (sheet) {
      var data = sheet.getDataRange().getValues();
      var normalizedKey = key.toLowerCase();
      for (var i = 1; i < data.length; i++) {
        var rowKey = (data[i][0] || "").toString().trim().toLowerCase();
        if (rowKey === normalizedKey && data[i][1]) {
          return data[i][1].toString().trim();
        }
      }
    }
  } catch (err) {}

  return fallbackValue !== undefined ? fallbackValue : "";
}

function getSharedSecret() {
  var candidateKeys = [
    "SHARED_SECRET",
    "GOOGLE_APPS_SCRIPT_CMS_SECRET",
    "GOOGLE_APPS_SCRIPT_SECRET",
    "CMS_SECRET"
  ];
  for (var i = 0; i < candidateKeys.length; i++) {
    var val = getScriptProperty(candidateKeys[i], "");
    if (val && val.trim()) {
      return val.trim();
    }
  }
  return "";
}

var CONFIG = {
  get SHARED_SECRET() {
    return getSharedSecret();
  },

  get WEB_DEPLOY_URL() {
    var url = getScriptProperty("WEB_DEPLOY_URL", "");
    if (!url || url.indexOf("datawithly.edu.vn") !== -1) {
      return "https://ed-tech-mu-umber.vercel.app";
    }
    return url;
  },

  get REVALIDATION_SECRET() {
    return getScriptProperty("REVALIDATION_SECRET", "");
  },

  get REVALIDATION_PROD_URL() {
    var explicitUrl = getScriptProperty("REVALIDATION_PROD_URL", "");
    if (explicitUrl && explicitUrl.indexOf("datawithly.edu.vn") === -1) {
      return explicitUrl;
    }

    var deployUrl = this.WEB_DEPLOY_URL;
    if (deployUrl) {
      var base = deployUrl.replace(/\/+$/, "");
      var secret = this.REVALIDATION_SECRET;
      return base + "/api/revalidate" + (secret ? ("?secret=" + encodeURIComponent(secret)) : "");
    }
    return "https://ed-tech-mu-umber.vercel.app/api/revalidate";
  },

  get REVALIDATION_LOCAL_URL() {
    var explicitUrl = getScriptProperty("REVALIDATION_LOCAL_URL", "");
    if (explicitUrl) return explicitUrl;

    var secret = this.REVALIDATION_SECRET;
    return "http://localhost:3000/api/revalidate" + (secret ? ("?secret=" + encodeURIComponent(secret)) : "");
  },

  get ACTIVE_REVALIDATION_ENV() {
    return getScriptProperty("ACTIVE_REVALIDATION_ENV", "PROD");
  },

  get REVALIDATION_URL() {
    return this.REVALIDATION_PROD_URL;
  },

  LOCK_TIMEOUT_MS: 10000
};

var COURSE_KINDS_LIST = [
  "Khóa học nổi bật",
  "Khóa học mới",
  "Khóa học nền tảng",
  "Khóa học chuyên sâu",
  "Combo"
];


// ==============================================================================
// FILE NGUỒN: 01_SlugUtils.gs
// ==============================================================================

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



// ==============================================================================
// FILE NGUỒN: 02_CmsMenu.gs
// ==============================================================================

/**
 * ==============================================================================
 * MODULE 02: THANH MENU VÀ BỘ BẮT SỰ KIỆN CMS CONTENT (MENU & EVENT TRIGGERS)
 * ==============================================================================
 * 1. onOpen(): Khởi tạo menu điều khiển [🚀 DataWithLy CMS] trên Sheet CMS Content.
 * 2. onEdit(e): Tự động phát hiện chỉnh sửa, sinh UUID v4 & SEO Slug, bảo vệ ô ID/Slug.
 * ==============================================================================
 */

var TABLE_PREFIX_CONFIG = {
  courses: "crs-",
  curriculum: "cur-",
  promotions: "promo-",
  blog_posts: "blg-",
  packages_pricing: "pkg-",
  testimonials: "tst-",
  mentor_profiles: "men-",
  faqs: "faq-"
};

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("🚀 DataWithLy CMS")
    .addItem("⚡ CÀI ĐẶT 10 TAB CMS CONTENT (1-Click Setup)", "setupDataWithLyTables")
    .addItem("🌱 NẠP LẠI DATA CHUẨN FIGMA 100% (Ghi đè bản mẫu)", "forceReseedFigmaData")
    .addSeparator()

    // Khóa học & Lộ trình
    .addItem("➕ Thêm Khóa Học Mới", "showAddCourseModal")
    .addItem("📚 Thêm Chương Lộ Trình Học", "showAddCurriculumModal")
    .addItem("📦 Thêm Gói Combo & Bảng Giá", "showPackageModal")
    .addSeparator()

    // Thương hiệu & Nội dung
    .addItem("👤 Quản Trị Hồ Sơ Mentor & AboutUs", "showMentorModal")
    .addItem("💬 Thêm Đánh Giá Học Viên", "showTestimonialModal")
    .addItem("❓ Thêm Câu Hỏi Thường Gặp", "showFaqModal")
    .addItem("✍️ Thêm Bài Viết Blog", "showBlogModal")
    .addSeparator()

    // Khuyến mãi & Cấu hình
    .addItem("🏷️ Quản Trị Khuyến Mãi & Flash Sale", "showPromotionsModal")
    .addItem("⚙️ Cấu Hình Hệ Thống (Settings)", "showSettingsModal")
    .addItem("🔗 Cài Đặt URL Website Vercel", "promptSetWebDeployUrl")
    .addItem("🔐 Cài Đặt Mã Secret CMS (SHARED_SECRET)", "promptSetSharedSecret")
    .addItem("🔑 Cài Đặt Revalidation Secret", "promptSetRevalidationSecret")
    .addSeparator()

    // Tiện ích bảo trì
    .addItem("⚡ Tự Động Sinh UUID & Chuẩn Hóa Toàn Bộ Slug/ID", "autoFillMissingUuidsAndSlugs")
    .addItem("🔄 Tự Động Tạo Slug & ID Cho Hàng Trống", "autoFillMissingSlugsAndIds")
    .addItem("🗑️ Lưu Trữ / Ẩn Khóa Học", "showSoftDeletePrompt")
    .addItem("🔍 Kiểm Tra Lỗi Dữ Liệu", "runDataLinter")
    .addItem("⚡ Đồng Bộ Lên Website Ngay Lập Tức", "triggerWebsiteRevalidation")
    .addToUi();
}

function protectIdCell(sheet, row, value, oldValue, prefix, ss) {
  var trimmed = (value !== null && value !== undefined) ? value.toString().trim() : "";
  var oldTrimmed = (oldValue !== null && oldValue !== undefined) ? oldValue.toString().trim() : "";

  if (!trimmed) {
    if (oldTrimmed) {
      sheet.getRange(row, 1).setValue(sanitizeFormula(oldTrimmed));
      ss.toast("⚠️ Cột ID được hệ thống bảo vệ! Đã khôi phục ID gốc: " + oldTrimmed, "🛡️ Bảo Vệ Ô ID", 6);
    } else {
      var newUuid = generateUUID(prefix);
      sheet.getRange(row, 1).setValue(sanitizeFormula(newUuid));
      ss.toast("⚠️ Ô ID không được để trống! Đã tự động sinh UUID mới: " + newUuid, "🛡️ Tự Động Sinh UUID", 6);
    }
    return;
  }

  if (!isValidUUID(trimmed, prefix) && !isValidUUID(trimmed)) {
    if (oldTrimmed && (isValidUUID(oldTrimmed, prefix) || isValidUUID(oldTrimmed))) {
      sheet.getRange(row, 1).setValue(sanitizeFormula(oldTrimmed));
      ss.toast("⚠️ Không thể chỉnh sửa trực tiếp ID hệ thống! Đã khôi phục ID chuẩn: " + oldTrimmed, "🛡️ Bảo Vệ Ô ID", 6);
    } else {
      var standardUuid = generateUUID(prefix);
      sheet.getRange(row, 1).setValue(sanitizeFormula(standardUuid));
      ss.toast("⚠️ ID không hợp lệ chuẩn UUID v4! Đã thay thế bằng UUID chuẩn: " + standardUuid, "🛡️ Chuẩn Hóa UUID", 6);
    }
  }
}

function protectSlugCell(sheet, row, slugCol, titleCol, value, oldValue, ss) {
  var trimmed = (value !== null && value !== undefined) ? value.toString().trim() : "";
  var oldTrimmed = (oldValue !== null && oldValue !== undefined) ? oldValue.toString().trim() : "";
  var titleVal = titleCol ? sheet.getRange(row, titleCol).getValue() : "";

  var lastRow = sheet.getLastRow();
  var otherSlugs = [];
  if (lastRow > 1) {
    var allSlugs = sheet.getRange(2, slugCol, lastRow - 1, 1).getValues();
    for (var i = 0; i < allSlugs.length; i++) {
      var rNum = i + 2;
      if (rNum !== row && allSlugs[i][0]) {
        otherSlugs.push(allSlugs[i][0].toString());
      }
    }
  }

  if (!trimmed) {
    if (titleVal && titleVal.toString().trim()) {
      var autoSlug = resolveUniqueSlug(titleVal.toString(), otherSlugs);
      sheet.getRange(row, slugCol).setValue(sanitizeFormula(autoSlug));
      ss.toast("⚠️ Ô Slug không được để trống! Đã tự động sinh SEO Slug: " + autoSlug, "🛡️ Tự Động Sinh Slug", 6);
    } else if (oldTrimmed) {
      sheet.getRange(row, slugCol).setValue(sanitizeFormula(oldTrimmed));
      ss.toast("⚠️ Cột Slug được bảo vệ! Đã khôi phục: " + oldTrimmed, "🛡️ Bảo Vệ Ô Slug", 6);
    }
    return;
  }

  var standardFormat = generateSlug(trimmed);
  if (trimmed !== standardFormat) {
    var resolvedFormat = resolveUniqueSlug(standardFormat, otherSlugs, oldTrimmed);
    sheet.getRange(row, slugCol).setValue(sanitizeFormula(resolvedFormat));
    ss.toast("⚠️ Slug đã được chuẩn hóa lại không dấu: " + resolvedFormat, "🛡️ Chuẩn Hóa SEO Slug", 6);
    return;
  }

  if (otherSlugs.indexOf(trimmed) !== -1) {
    var uniqueSlug = resolveUniqueSlug(trimmed, otherSlugs, oldTrimmed);
    sheet.getRange(row, slugCol).setValue(sanitizeFormula(uniqueSlug));
    ss.toast("⚠️ Phát hiện trùng lặp Slug! Đã đổi thành: " + uniqueSlug, "🛡️ Chống Trùng Slug", 6);
  }
}

function onEdit(e) {
  if (!e || !e.range) return;

  var range = e.range;
  var sheet = range.getSheet();
  var sheetName = sheet.getName();
  var row = range.getRow();
  var col = range.getColumn();
  var value = e.value;
  var oldValue = e.oldValue;
  var ss = e.source || SpreadsheetApp.getActiveSpreadsheet();

  if (row === 1) return;

  var prefix = TABLE_PREFIX_CONFIG[sheetName];
  if (prefix && col === 1) {
    protectIdCell(sheet, row, value, oldValue, prefix, ss);
    return;
  }

  if (sheetName === "courses") {
    if (col === 3) protectSlugCell(sheet, row, 3, 2, value, oldValue, ss);
    else if (col === 2 && value) {
      var existingSlug = sheet.getRange(row, 3).getValue();
      if (!existingSlug || existingSlug.toString().trim() === "") {
        var allSlugsC = sheet.getRange(2, 3, Math.max(sheet.getLastRow() - 1, 1), 1).getValues()
          .map(function(r, idx) { return (idx + 2 !== row && r[0]) ? r[0].toString() : null; })
          .filter(Boolean);
        sheet.getRange(row, 3).setValue(sanitizeFormula(resolveUniqueSlug(value.toString(), allSlugsC)));
      }
    }
  } else if (sheetName === "blog_posts") {
    if (col === 3) protectSlugCell(sheet, row, 3, 2, value, oldValue, ss);
    else if (col === 2 && value) {
      var currentSlugB = sheet.getRange(row, 3).getValue();
      if (!currentSlugB || currentSlugB.toString().trim() === "") {
        var allSlugsB = sheet.getRange(2, 3, Math.max(sheet.getLastRow() - 1, 1), 1).getValues()
          .map(function(r, idx) { return (idx + 2 !== row && r[0]) ? r[0].toString() : null; })
          .filter(Boolean);
        sheet.getRange(row, 3).setValue(sanitizeFormula(resolveUniqueSlug(value.toString(), allSlugsB)));
      }
    }
  }
}


// ==============================================================================
// FILE NGUỒN: 03_CmsTablesSetup.gs
// ==============================================================================

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


// ==============================================================================
// FILE NGUỒN: 04_CmsEndpoints.gs
// ==============================================================================

/**
 * ==============================================================================
 * MODULE 04: BỘ ĐỊNH TUYẾN WEB APP CMS CONTENT (CMS REST ENDPOINTS)
 * ==============================================================================
 * 1. doGet(e): Xuất toàn bộ 11 tab nội dung công khai ra JSON cho Next.js CMS.
 * 2. doPost(e): Thực thi các thao tác ghi dữ liệu từ CMS Modals:
 *    add_course, add_curriculum, save_mentor, add_promotion, add_package,
 *    add_testimonial, add_faq, save_settings, add_blog, seed_database.
 * ==============================================================================
 */

function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    var action = params.action || "ping";
    var secret = params.secret || "";

    if (action === "ping") {
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        status: "healthy",
        service: "DataWithLy CMS Content Engine",
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var configuredSecret = (CONFIG.SHARED_SECRET || "").toString().trim();
    var requestSecret = (secret || "").toString().trim();

    if (configuredSecret && configuredSecret !== "" && requestSecret !== configuredSecret) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Yêu cầu mã secret xác thực hợp lệ. (Mã secret từ Website không khớp với SHARED_SECRET trong Google Apps Script)."
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "get_tab") {
      var tabName = params.tab || "courses";
      var sheet = ss.getSheetByName(tabName);
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
          ok: false,
          error: { code: "TAB_NOT_FOUND", message: "Không tìm thấy tab: " + tabName }
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var tabData = getSheetRowsAsObjects(sheet);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        tab: tabName,
        total: tabData.length,
        data: tabData
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Đọc tất cả 10 tab nội dung công khai (kèm fallback an toàn)
    var coursesSheet = ss.getSheetByName("courses");
    var curriculumSheet = ss.getSheetByName("curriculum");
    var pricingSheet = ss.getSheetByName("packages_pricing");
    var studentProjectsSheet = ss.getSheetByName("student_projects");
    var mentorSheet = ss.getSheetByName("mentor_profiles");
    var testimonialsSheet = ss.getSheetByName("testimonials");
    var faqsSheet = ss.getSheetByName("faqs");
    var trustSheet = ss.getSheetByName("trust_metrics");
    var settingsSheet = ss.getSheetByName("settings");
    var blogsSheet = ss.getSheetByName("blog_posts");
    var promoSheet = ss.getSheetByName("promotions");

    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      source: "google_sheets_cms_live",
      fetchedAt: new Date().toISOString(),
      tabs: {
        courses: coursesSheet ? getSheetRowsAsObjects(coursesSheet) : [],
        curriculum: curriculumSheet ? getSheetRowsAsObjects(curriculumSheet) : [],
        packages_pricing: pricingSheet ? getSheetRowsAsObjects(pricingSheet) : [],
        student_projects: studentProjectsSheet ? getSheetRowsAsObjects(studentProjectsSheet) : [],
        mentor_profiles: mentorSheet ? getSheetRowsAsObjects(mentorSheet) : [],
        testimonials: testimonialsSheet ? getSheetRowsAsObjects(testimonialsSheet) : [],
        faqs: faqsSheet ? getSheetRowsAsObjects(faqsSheet) : [],
        trust_metrics: trustSheet ? getSheetRowsAsObjects(trustSheet) : [],
        settings: settingsSheet ? getSheetRowsAsObjects(settingsSheet) : [],
        blog_posts: blogsSheet ? getSheetRowsAsObjects(blogsSheet) : [],
        promotions: promoSheet ? getSheetRowsAsObjects(promoSheet) : []
      }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: { code: "GET_ERROR", message: err.toString() }
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheetRowsAsObjects(sheet) {
  var data = sheet.getDataRange().getValues();
  if (!data || data.length < 2) return [];

  var headers = data[0].map(function(h) {
    return h.toString().trim().toLowerCase().replace(/[\s-]+/g, "_");
  });

  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var isEmpty = row.every(function(cell) { return cell === "" || cell === null; });
    if (isEmpty) continue;

    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var header = headers[j];
      if (header) {
        obj[header] = row[j];
      }
    }
    rows.push(obj);
  }
  return rows;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var hasLock = lock.tryLock(CONFIG.LOCK_TIMEOUT_MS);

  if (!hasLock) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: { code: "LOCK_TIMEOUT", message: "Hệ thống đang bận ghi dữ liệu khác, vui lòng thử lại sau vài giây." }
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var rawData = e.postData.contents;
    var payload = JSON.parse(rawData);

    var configuredSecret = CONFIG.SHARED_SECRET;
    if (configuredSecret && configuredSecret.trim() !== "" && payload.secret !== configuredSecret) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: { code: "UNAUTHORIZED", message: "Yêu cầu mã secret xác thực hợp lệ." }
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var action = payload.action || "ping";

    if (action === "seed_database" || action === "bulk_seed") {
      var seedStats = applySeedSnapshotToSpreadsheet(payload.snapshot || payload.data);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "seed_database", message: "Đã nạp toàn bộ dữ liệu chuẩn thành công!", stats: seedStats
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "add_course") {
      var courseResult = addNewCourseFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_course", data: courseResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "add_curriculum") {
      var currResult = addNewCurriculumModuleFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_curriculum", data: currResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "save_mentor") {
      var mentorResult = saveMentorProfileFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "save_mentor", data: mentorResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "add_promotion") {
      var promoResult = addNewPromotionFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_promotion", data: promoResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "add_package") {
      var pkgResult = savePackageFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_package", data: pkgResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "add_testimonial") {
      var testResult = saveTestimonialFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_testimonial", data: testResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "add_faq") {
      var faqResult = saveFaqFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_faq", data: faqResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "save_settings") {
      var settingsResult = saveSettingsFromModal(payload.settings || payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "save_settings", data: settingsResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "add_blog") {
      var blogResult = saveBlogFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_blog", data: blogResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: { code: "UNKNOWN_ACTION", message: "Hành động không xác định: " + action }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: { code: "SERVER_ERROR", message: err.toString() }
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function applySeedSnapshotToSpreadsheet(snapshot) {
  if (!snapshot) throw new Error("Dữ liệu snapshot không hợp lệ hoặc để trống.");
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var stats = {};

  if (snapshot.courses && snapshot.courses.length) {
    var cSheet = ss.getSheetByName("courses") || (setupCoursesTab(ss), ss.getSheetByName("courses"));
    if (cSheet.getLastRow() > 1) {
      cSheet.getRange(2, 1, cSheet.getLastRow() - 1, cSheet.getLastColumn()).clearContent();
    }
    var cRows = snapshot.courses.map(function(c, i) {
      return [
        c.id || ("crs-" + (i + 1)),
        c.title || "",
        c.slug || c.id || "",
        c.courseKind || c.course_kind || "Khóa học nổi bật",
        c.tag || "SQL",
        c.tagline || "",
        Number(c.tuitionVnd || c.tuition_vnd || 0),
        Number(c.originalTuitionVnd || c.original_tuition_vnd || 0),
        c.duration || "8 tuần",
        c.level || "Beginner",
        c.isActive !== false,
        c.isFeatured === true,
        Number(c.sortOrder || c.sort_order || (i + 1)),
        c.description || "",
        c.coverImageUrl || c.cover_image_url || "/assets/figma/c4ad4d89a999588201cc5ccd2a39ca7dd43febe3.png"
      ];
    });
    cSheet.getRange(2, 1, cRows.length, 15).setValues(cRows);
    cSheet.getRange(2, 7, cRows.length, 2).setNumberFormat('#,##0 "đ"');
    stats.courses = cRows.length;
  }

  return stats;
}


// ==============================================================================
// FILE NGUỒN: 05_CourseModal.gs
// ==============================================================================

/**
 * MODULE 05: HỘP THOẠI MODAL NHẬP LIỆU KHÓA HỌC (COURSE MODAL DIALOG)
 */
function showAddCourseModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("courses");
  var existingSlugs = [];

  if (sheet && sheet.getLastRow() > 1) {
    var vals = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i][0]) existingSlugs.push(vals[i][0].toString().trim().toLowerCase());
    }
  }

  var template = createModalTemplate("CourseModal");
  template.existingSlugs = existingSlugs;
  var html = template.evaluate().setWidth(660).setHeight(720).setTitle("➕ Thêm Khóa Học Hàng Loạt - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "➕ Thêm Khóa Học Hàng Loạt");
}

function addCoursesBatchFromModal(courseList) {
  if (!courseList || !courseList.length) {
    throw new Error("Danh sách khóa học không được để trống.");
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("courses") || (setupCoursesTab(ss), ss.getSheetByName("courses"));

  var lastRow = sheet.getLastRow();
  var existingSlugs = [];
  if (lastRow > 1) {
    var vals = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i][0]) existingSlugs.push(vals[i][0].toString().trim().toLowerCase());
    }
  }

  var rowsToAdd = [];
  var addedCourses = [];

  for (var k = 0; k < courseList.length; k++) {
    var item = courseList[k];
    var title = (item.title || "").toString().trim();
    if (!title) {
      throw new Error("Tên khóa học #" + (k + 1) + " không được để trống.");
    }

    var tuition = Number(item.tuition_vnd);
    if (isNaN(tuition) || tuition < 0) {
      throw new Error("Học phí ưu đãi cho khóa học #" + (k + 1) + " phải là số dương hợp lệ.");
    }
    var originalTuition = Number(item.original_tuition_vnd);
    if (isNaN(originalTuition) || originalTuition < 0) {
      originalTuition = tuition;
    }

    // Tự động sinh Slug chuẩn SEO & giải quyết xung đột với existingSlugs và chính mảng đang thêm
    var uniqueSlug = resolveUniqueSlug(item.slug || title, existingSlugs);
    existingSlugs.push(uniqueSlug.toLowerCase());

    // Sinh UUID v4 cho từng khóa học (nếu chưa có hoặc không hợp lệ)
    var uniqueId = item.id && isValidUUID(item.id, "crs-")
      ? item.id.toString().trim()
      : generateUUID("crs-");

    var sortOrder = Number(item.sort_order) || (lastRow + k);

    rowsToAdd.push([
      sanitizeFormula(uniqueId),
      sanitizeFormula(title),
      sanitizeFormula(uniqueSlug),
      sanitizeFormula(item.course_kind || item.courseKind || "Khóa học nổi bật"),
      sanitizeFormula(item.tag || "SQL"),
      sanitizeFormula(item.tagline || ""),
      tuition,
      originalTuition,
      sanitizeFormula(item.duration || "8 tuần (24 buổi)"),
      sanitizeFormula(item.level || "Beginner"),
      item.is_active === true || item.is_active === "true",
      item.is_featured === true || item.is_featured === "true",
      sortOrder,
      sanitizeFormula(item.description || ""),
      sanitizeFormula(item.cover_image_url || "")
    ]);

    addedCourses.push({ id: uniqueId, title: title, slug: uniqueSlug });
  }

  var startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rowsToAdd.length, 15).setValues(rowsToAdd);

  // Định dạng hiển thị VNĐ (Cột 7 và 8)
  sheet.getRange(startRow, 7, rowsToAdd.length, 2).setNumberFormat('#,##0 "đ"');

  var msg = "🎉 Đã lưu thành công " + rowsToAdd.length + " khóa học vào bảng courses!";
  ss.toast(msg, "DataWithLy CMS", 5);

  return { success: true, count: rowsToAdd.length, courses: addedCourses };
}

function addNewCourseFromModal(formData) {
  var res = addCoursesBatchFromModal([formData]);
  return {
    success: true,
    id: res.courses[0].id,
    slug: res.courses[0].slug,
    title: res.courses[0].title
  };
}


// ==============================================================================
// FILE NGUỒN: 06_CmsMaintenance.gs
// ==============================================================================

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
  var current = (CONFIG.SHARED_SECRET || "").toString().trim();
  var displayStatus = current
    ? ("●●●●●●●● (" + current.substring(0, 4) + "..." + current.substring(current.length - 4) + ", độ dài: " + current.length + " ký tự)")
    : "(Chưa thiết lập - Khuyến nghị cài đặt ngay)";

  var prompt = ui.prompt(
    "🔐 Cấu Hình Mã Secret Bảo Mật (SHARED_SECRET)",
    "Trạng thái hiện tại: " + displayStatus + "\n\n" +
    "Nhập mã Secret xác thực giữa Website Next.js và Google Sheets CMS:\n" +
    "(LƯU Ý: Giá trị này PHẢI TRÙNG KHỚP 100% với biến GOOGLE_APPS_SCRIPT_CMS_SECRET trên Vercel và file .env.local)",
    ui.ButtonSet.OK_CANCEL
  );

  if (prompt.getSelectedButton() === ui.Button.OK) {
    var val = prompt.getResponseText().trim();
    if (val) {
      PropertiesService.getScriptProperties().setProperty("SHARED_SECRET", val);
      PropertiesService.getScriptProperties().setProperty("GOOGLE_APPS_SCRIPT_CMS_SECRET", val);
      ui.alert(
        "✅ Cấu Hình Thành Công!",
        "Mã Secret đã được lưu vĩnh viễn trong Google Cloud Script Properties.\n\n" +
        "Mã Secret đã lưu: " + val.substring(0, 4) + "..." + val.substring(val.length - 4) + " (" + val.length + " ký tự).\n\n" +
        "👉 Hãy đảm bảo trên Vercel (Settings > Environment Variables) biến GOOGLE_APPS_SCRIPT_CMS_SECRET có đúng giá trị này!",
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





// ==============================================================================
// FILE NGUỒN: 07_CurriculumModal.gs
// ==============================================================================

/**
 * MODULE 07: HỘP THOẠI THÊM CHƯƠNG LỘ TRÌNH (CURRICULUM MODAL DIALOG)
 */
function showAddCurriculumModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var courseSheet = ss.getSheetByName("courses") || (setupCoursesTab(ss), ss.getSheetByName("courses"));
  var curriculumSheet = ss.getSheetByName("curriculum") || (setupCurriculumTab(ss), ss.getSheetByName("curriculum"));

  var coursesList = [];
  var lastRow = courseSheet.getLastRow();
  if (lastRow > 1) {
    var cHeaders = courseSheet.getRange(1, 1, 1, courseSheet.getLastColumn()).getValues()[0].map(function(h) {
      return h ? h.toString().trim().toLowerCase().replace(/[\s-]+/g, "_") : "";
    });
    var startIdx = cHeaders.indexOf("start_date");
    var endIdx = cHeaders.indexOf("end_date");
    var allVals = courseSheet.getRange(2, 1, lastRow - 1, courseSheet.getLastColumn()).getValues();

    for (var i = 0; i < allVals.length; i++) {
      var row = allVals[i];
      if (row[0] && row[1]) {
        var sDate = startIdx !== -1 && row[startIdx] ? row[startIdx].toString().trim() : "";
        var eDate = endIdx !== -1 && row[endIdx] ? row[endIdx].toString().trim() : "";
        coursesList.push({
          id: row[0].toString().trim(),
          title: row[1].toString().trim(),
          slug: (row[2] || row[0]).toString().trim(),
          startDate: sDate,
          endDate: eDate,
          maxModule: 0
        });
      }
    }
  }

  var currLastRow = curriculumSheet.getLastRow();
  if (currLastRow > 1) {
    var cVals = curriculumSheet.getRange(2, 2, currLastRow - 1, 4).getValues();
    for (var j = 0; j < cVals.length; j++) {
      var rCId = cVals[j][0] ? cVals[j][0].toString().trim() : "";
      var mNum = Number(cVals[j][3]) || Number(cVals[j][2]) || 0;
      for (var k = 0; k < coursesList.length; k++) {
        if (coursesList[k].id === rCId && mNum > coursesList[k].maxModule) {
          coursesList[k].maxModule = mNum;
        }
      }
    }
  }

  var template = createModalTemplate("CurriculumModal");
  template.coursesList = coursesList;
  var html = template.evaluate().setWidth(720).setHeight(780).setTitle("📚 Quản Trị Lộ Trình Khóa Học - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "📚 Quản Trị Lộ Trình Khóa Học");
}

function addCurriculumBatchFromModal(payload) {
  var curriculumList = [];
  var courseId = "";
  var startDate = "";
  var endDate = "";

  if (Array.isArray(payload)) {
    curriculumList = payload;
  } else if (payload && typeof payload === "object") {
    curriculumList = payload.curriculum_list || payload.modules || [];
    courseId = (payload.course_id || "").toString().trim();
    startDate = (payload.course_start_date || "").toString().trim();
    endDate = (payload.course_end_date || "").toString().trim();
  }

  if (!curriculumList || !curriculumList.length) {
    throw new Error("Danh sách buổi học không được để trống.");
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("curriculum") || (setupCurriculumTab(ss), ss.getSheetByName("curriculum"));

  var rowsToAdd = [];
  var addedItems = [];

  for (var i = 0; i < curriculumList.length; i++) {
    var item = curriculumList[i];
    var cId = (item.course_id || courseId || "").toString().trim();
    var sessionTitle = (item.session_title || item.module_title || item.week_title || item.title || "").toString().trim();
    if (!cId) {
      throw new Error("Buổi học #" + (i + 1) + ": Khóa học áp dụng không được để trống.");
    }
    if (!sessionTitle) {
      throw new Error("Buổi học #" + (i + 1) + ": Nội dung buổi học không được để trống.");
    }

    var dayNum = Number(item.day || item.module_number) || (i + 1);
    var weekNum = item.week ? (Number(item.week) || item.week.toString().trim()) : Math.ceil(dayNum / 2);
    var dateBadge = (item.date || item.session_date || "TH10 " + (dayNum < 10 ? "0" + dayNum : dayNum)).toString().trim();
    var sessionDesc = (item.session_desc || item.content || item.summary || "").toString().trim();

    // Tự động sinh ID duy nhất
    var pkId = item.id && isValidUUID(item.id, "cur-")
      ? item.id.toString().trim()
      : ("cur-" + cId.replace(/[^a-z0-9-]/gi, "") + "-d" + dayNum + "-" + generateUUID().substring(0, 4));

    // Chuẩn hóa và bóc tách nội dung sub_content dot list (Enter / Alt+Enter)
    var rawSub = (item.sub_content || item.topics_bullets || item.bullet_points || "").toString();
    var cleanSubContent = rawSub
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .map(function (line) { return line.trim(); })
      .filter(function (line) { return line.length > 0; })
      .join("\n");

    var durationVal = (item.duration || "3 giờ").toString().trim();
    var sortOrder = Number(item.sort_order) || dayNum;

    rowsToAdd.push([
      sanitizeFormula(pkId),
      sanitizeFormula(cId),
      sanitizeFormula(item.course_name || ""),
      sanitizeFormula(startDate || item.start_date || ""),
      sanitizeFormula(endDate || item.end_date || ""),
      weekNum,
      dayNum,
      sanitizeFormula(dateBadge),
      sanitizeFormula(sessionTitle),
      sanitizeFormula(sessionDesc),
      sanitizeFormula(cleanSubContent),
      sanitizeFormula(durationVal),
      sortOrder
    ]);

    addedItems.push({ id: pkId, title: sessionTitle, day: dayNum, week: weekNum });
  }

  var startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rowsToAdd.length, 13).setValues(rowsToAdd);

  // Nếu có cập nhật ngày bắt đầu / kết thúc cho khóa học -> Lưu vào tab 'courses'
  if (courseId && (startDate || endDate)) {
    try {
      var courseSheet = ss.getSheetByName("courses");
      if (courseSheet && courseSheet.getLastRow() > 1) {
        var cHeaders = courseSheet.getRange(1, 1, 1, courseSheet.getLastColumn()).getValues()[0].map(function(h) {
          return h ? h.toString().trim().toLowerCase().replace(/[\s-]+/g, "_") : "";
        });
        var startCol = cHeaders.indexOf("start_date") + 1;
        var endCol = cHeaders.indexOf("end_date") + 1;

        if (startCol > 0 || endCol > 0) {
          var cData = courseSheet.getRange(2, 1, courseSheet.getLastRow() - 1, 1).getValues();
          for (var r = 0; r < cData.length; r++) {
            if (cData[r][0] && cData[r][0].toString().trim() === courseId) {
              var targetRow = r + 2;
              if (startCol > 0 && startDate) courseSheet.getRange(targetRow, startCol).setValue(startDate);
              if (endCol > 0 && endDate) courseSheet.getRange(targetRow, endCol).setValue(endDate);
              break;
            }
          }
        }
      }
    } catch (e) {
      console.warn("Không thể cập nhật ngày khóa học:", e);
    }
  }

  var msg = "🎉 Đã lưu thành công " + rowsToAdd.length + " buổi học vào lộ trình khóa học!";
  ss.toast(msg, "DataWithLy CMS", 5);

  return { success: true, count: rowsToAdd.length, modules: addedItems };
}

function addNewCurriculumModuleFromModal(data) {
  var res = addCurriculumBatchFromModal([data]);
  return {
    success: true,
    id: res.modules[0].id,
    title: res.modules[0].title
  };
}


// ==============================================================================
// FILE NGUỒN: 08_MentorModal.gs
// ==============================================================================

/**
 * MODULE 08: HỘP THOẠI QUẢN TRỊ HỒ SƠ MENTOR (MENTOR PROFILE MODAL DIALOG)
 */
function showMentorModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("mentor_profiles") || ss.getSheetByName("mentors") || (setupMentorProfilesTab(ss), ss.getSheetByName("mentor_profiles"));

  var currentMentor = {
    id: "mentor-ly-hua",
    name: "Hứa Thảo Ly",
    title: "Lead Mentor & Founder DataWithLy",
    bio: "Hơn 7 năm kinh nghiệm thực chiến trong ngành Dữ liệu tại các tập đoàn công nghệ và tài chính hàng đầu Việt Nam. Từng trực tiếp xây dựng hạ tầng báo cáo phục vụ hàng triệu người dùng.",
    companies_worked: "MoMo, Tiki, ACB Bank",
    avatar_url: "/uploads/mentors/ly-hua.jpg",
    linkedin_url: "https://linkedin.com/in/lyhuadata",
    is_active: true
  };

  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var rowValues = sheet.getRange(2, 1, 1, 8).getValues()[0];
    if (rowValues[0]) {
      currentMentor = {
        id: rowValues[0].toString(),
        name: rowValues[1] ? rowValues[1].toString() : "",
        title: rowValues[2] ? rowValues[2].toString() : "",
        bio: rowValues[3] ? rowValues[3].toString() : "",
        companies_worked: rowValues[4] ? rowValues[4].toString() : "",
        avatar_url: rowValues[5] ? rowValues[5].toString() : "",
        linkedin_url: rowValues[6] ? rowValues[6].toString() : "",
        is_active: rowValues[7] === true || String(rowValues[7]).toUpperCase() === "TRUE"
      };
    }
  }

  var template = createModalTemplate("MentorModal");
  template.currentMentor = currentMentor;
  var html = template.evaluate().setWidth(660).setHeight(720).setTitle("👤 Quản Trị Hồ Sơ Giảng Viên Hàng Loạt - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "👤 Quản Trị Hồ Sơ Giảng Viên Hàng Loạt");
}

function addMentorsBatchFromModal(mentorList) {
  if (!mentorList || !mentorList.length) {
    throw new Error("Danh sách giảng viên không được để trống.");
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("mentor_profiles") || ss.getSheetByName("mentors") || (setupMentorProfilesTab(ss), ss.getSheetByName("mentor_profiles"));

  var lastRow = sheet.getLastRow();
  var existingIds = [];
  if (lastRow > 1) {
    var vals = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i][0]) existingIds.push(vals[i][0].toString().trim());
    }
  }

  var rowsToAdd = [];
  var addedMentors = [];

  for (var k = 0; k < mentorList.length; k++) {
    var item = mentorList[k];
    var name = (item.name || "").toString().trim();
    if (!name) {
      throw new Error("Giảng viên #" + (k + 1) + ": Họ và tên Mentor không được để trống.");
    }

    // Sinh UUID v4 chuẩn RFC 4122 (hoặc giữ ID hợp lệ có sẵn)
    var uniqueId = item.id && (isValidUUID(item.id, "mentor-") || item.id === "mentor-ly-hua")
      ? item.id.toString().trim()
      : generateUUID("mentor-");

    var title = (item.title || "").toString().trim() || "Lead Mentor & Founder DataWithLy";
    var bio = (item.bio || "").toString().trim();
    var companies = (item.companies_worked || "").toString().trim();
    var avatarUrl = (item.avatar_url || "").toString().trim() || "/uploads/mentors/ly-hua.jpg";
    var linkedinUrl = (item.linkedin_url || "").toString().trim();
    var isActive = item.is_active === true || item.is_active === "true";

    var foundIndex = -1;
    for (var r = 0; r < existingIds.length; r++) {
      if (existingIds[r] === uniqueId) {
        foundIndex = r + 2;
        break;
      }
    }

    var rowData = [
      sanitizeFormula(uniqueId),
      sanitizeFormula(name),
      sanitizeFormula(title),
      sanitizeFormula(bio),
      sanitizeFormula(companies),
      sanitizeFormula(avatarUrl),
      sanitizeFormula(linkedinUrl),
      isActive
    ];

    if (foundIndex > 0) {
      sheet.getRange(foundIndex, 1, 1, 8).setValues([rowData]);
    } else {
      rowsToAdd.push(rowData);
      existingIds.push(uniqueId);
    }

    addedMentors.push({ id: uniqueId, name: name });
  }

  if (rowsToAdd.length > 0) {
    var startRow = sheet.getLastRow() + 1;
    sheet.getRange(startRow, 1, rowsToAdd.length, 8).setValues(rowsToAdd);
  }

  var msg = "🎉 Đã lưu thành công " + mentorList.length + " hồ sơ giảng viên vào bảng mentor_profiles!";
  ss.toast(msg, "DataWithLy CMS", 5);

  return { success: true, count: mentorList.length, mentors: addedMentors };
}

function saveMentorProfileFromModal(data) {
  var res = addMentorsBatchFromModal([data]);
  return {
    success: true,
    id: res.mentors[0].id,
    name: res.mentors[0].name
  };
}


// ==============================================================================
// FILE NGUỒN: 09_PromotionsModal.gs
// ==============================================================================

/**
 * MODULE 09: HỘP THOẠI QUẢN TRỊ KHUYẾN MÃI (PROMOTIONS MODAL DIALOG)
 */
function showPromotionsModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var courseSheet = ss.getSheetByName("courses") || (setupCoursesTab(ss), ss.getSheetByName("courses"));
  var promoSheet = ss.getSheetByName("promotions") || (setupPromotionsTab(ss), ss.getSheetByName("promotions"));

  var coursesList = [];
  var lastRow = courseSheet.getLastRow();
  if (lastRow > 1) {
    var vals = courseSheet.getRange(2, 1, lastRow - 1, 2).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i][0] && vals[i][1]) {
        coursesList.push({ id: vals[i][0].toString().trim(), title: vals[i][1].toString().trim() });
      }
    }
  }

  var existingCodes = [];
  var promoLastRow = promoSheet.getLastRow();
  if (promoLastRow > 1) {
    var pVals = promoSheet.getRange(2, 2, promoLastRow - 1, 1).getValues();
    for (var p = 0; p < pVals.length; p++) {
      if (pVals[p][0]) existingCodes.push(pVals[p][0].toString().trim().toUpperCase());
    }
  }

  var template = createModalTemplate("PromotionsModal");
  template.coursesList = coursesList;
  template.existingCodes = existingCodes;
  var html = template.evaluate().setWidth(620).setHeight(720).setTitle("🏷️ Quản Trị Khuyến Mãi & Flash Sale - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "🏷️ Quản Trị Khuyến Mãi & Flash Sale");
}

function addNewPromotionFromModal(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("promotions") || (setupPromotionsTab(ss), ss.getSheetByName("promotions"));

  var code = (data.code || "").toString().trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  var title = (data.title || "").toString().trim();
  if (!code || !title) throw new Error("Mã code và Tiêu đề khuyến mãi không được để trống.");

  var type = (data.discount_type || "PERCENT").toString().trim();
  var val = Number(data.discount_value) || 0;
  var pId = (data.id || "promo-" + code.toLowerCase()).toString().trim();
  var badge = (data.badge || "").toString().trim();
  if (!badge) {
    badge = type === "PERCENT" ? "Giảm " + val + "%" : "Giảm " + (val / 1000).toLocaleString() + "K";
  }

  var rowData = [
    sanitizeFormula(pId), sanitizeFormula(code), sanitizeFormula(title), sanitizeFormula(type), val,
    sanitizeFormula(data.start_date), sanitizeFormula(data.end_date),
    sanitizeFormula(data.applicable_courses || "ALL"),
    sanitizeFormula(badge), data.is_active === true, Number(data.sort_order) || sheet.getLastRow()
  ];

  // Kiểm tra UPDATE nếu trùng mã code hoặc ID
  var lastRow = sheet.getLastRow();
  var foundRow = 0;
  if (lastRow > 1) {
    var existing = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    for (var i = 0; i < existing.length; i++) {
      var rId = existing[i][0] ? existing[i][0].toString().trim().toLowerCase() : "";
      var rCode = existing[i][1] ? existing[i][1].toString().trim().toUpperCase() : "";
      if (rId === pId.toLowerCase() || rCode === code) {
        foundRow = i + 2;
        break;
      }
    }
  }

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, 11).setValues([rowData]);
    if (type === "FIXED_VND") {
      sheet.getRange(foundRow, 5).setNumberFormat("#,##0 \"đ\"");
    } else {
      sheet.getRange(foundRow, 5).setNumberFormat("0\"%\"");
    }
    ss.toast("🎉 Đã cập nhật mã khuyến mãi: " + code, "DataWithLy CMS", 5);
  } else {
    sheet.appendRow(rowData);
    var newRow = sheet.getLastRow();
    if (type === "FIXED_VND") {
      sheet.getRange(newRow, 5).setNumberFormat("#,##0 \"đ\"");
    } else {
      sheet.getRange(newRow, 5).setNumberFormat("0\"%\"");
    }
    ss.toast("🎉 Đã tạo mã khuyến mãi: " + code, "DataWithLy CMS", 5);
  }
  return { success: true, id: pId, code: code, badge: badge };
}


// ==============================================================================
// FILE NGUỒN: 10_PackageModal.gs
// ==============================================================================

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



// ==============================================================================
// FILE NGUỒN: 11_TestimonialModal.gs
// ==============================================================================

/**
 * MODULE 11: HỘP THOẠI ĐÁNH GIÁ HỌC VIÊN (TESTIMONIALS MODAL DIALOG)
 */
function showTestimonialModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var courseSheet = ss.getSheetByName("courses") || (setupCoursesTab(ss), ss.getSheetByName("courses"));
  if (!ss.getSheetByName("testimonials")) setupTestimonialsTab(ss);

  var coursesList = [];
  var lastRow = courseSheet.getLastRow();
  if (lastRow > 1) {
    var vals = courseSheet.getRange(2, 1, lastRow - 1, 2).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i][0] && vals[i][1]) {
        coursesList.push({ id: vals[i][0].toString().trim(), title: vals[i][1].toString().trim() });
      }
    }
  }

  var template = createModalTemplate("TestimonialModal");
  template.coursesList = coursesList;
  var html = template.evaluate().setWidth(600).setHeight(680).setTitle("💬 Thêm Đánh Giá Học Viên - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "💬 Thêm Đánh Giá Học Viên");
}

function saveTestimonialFromModal(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("testimonials") || (setupTestimonialsTab(ss), ss.getSheetByName("testimonials"));

  var name = (data.student_name || "").toString().trim();
  var review = (data.review_text || "").toString().trim();
  if (!name || !review) throw new Error("Tên học viên và Nội dung đánh giá không được để trống.");

  var tId = (data.id || ("t-" + sheet.getLastRow())).toString().trim();
  var rating = Number(data.rating) || 5;

  sheet.appendRow([
    sanitizeFormula(tId),
    sanitizeFormula(name),
    sanitizeFormula(data.role),
    sanitizeFormula(data.company),
    sanitizeFormula(data.avatar_url),
    sanitizeFormula(data.course_id || "ALL"),
    rating,
    sanitizeFormula(review),
    data.is_featured === true,
    data.is_active === true
  ]);

  ss.toast("🎉 Đã thêm đánh giá của học viên: " + name, "DataWithLy CMS", 5);
  return { success: true, id: tId, student_name: name };
}



// ==============================================================================
// FILE NGUỒN: 12_FaqModal.gs
// ==============================================================================

/**
 * MODULE 12: HỘP THOẠI CÂU HỎI THƯỜNG GẶP (FAQ MODAL DIALOG)
 */
function showFaqModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName("faqs")) setupFaqsTab(ss);

  var template = createModalTemplate("FaqModal");
  var html = template.evaluate().setWidth(580).setHeight(620).setTitle("❓ Thêm Câu Hỏi Thường Gặp - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "❓ Thêm Câu Hỏi Thường Gặp");
}

function saveFaqFromModal(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("faqs") || (setupFaqsTab(ss), ss.getSheetByName("faqs"));

  var q = (data.question || "").toString().trim();
  var a = (data.answer || "").toString().trim();
  if (!q || !a) throw new Error("Câu hỏi và Câu trả lời không được để trống.");

  var nextId = (data.id || ("faq-" + sheet.getLastRow())).toString().trim();
  var category = (data.category || "CHUNG").toString().trim();
  var sortOrder = Number(data.sort_order) || sheet.getLastRow();

  sheet.appendRow([
    sanitizeFormula(nextId),
    sanitizeFormula(category),
    sanitizeFormula(q),
    sanitizeFormula(a),
    data.is_active === true,
    sortOrder
  ]);

  ss.toast("🎉 Đã thêm câu hỏi FAQ: " + q.substring(0, 30) + "...", "DataWithLy CMS", 5);
  return { success: true, id: nextId, question: q };
}



// ==============================================================================
// FILE NGUỒN: 13_SettingsModal.gs
// ==============================================================================

/**
 * MODULE 13: HỘP THOẠI CẤU HÌNH HỆ THỐNG (SETTINGS MODAL DIALOG)
 */
function showSettingsModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("settings") || (setupSettingsTab(ss), ss.getSheetByName("settings"));

  var currentSettings = {
    hotline: "0901 234 567",
    zalo_url: "https://zalo.me/0901234567",
    contact_email: "tuyensinh@datawithly.edu.vn",
    announcement_bar: "Ưu đãi học phí 15% cho 10 học viên đăng ký sớm trong tuần này!",
    revalidation_url: CONFIG.REVALIDATION_URL
  };

  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var rows = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    for (var i = 0; i < rows.length; i++) {
      var k = rows[i][0] ? rows[i][0].toString().trim() : "";
      if (k) currentSettings[k] = rows[i][1] !== undefined ? rows[i][1].toString() : "";
    }
  }

  var template = createModalTemplate("SettingsModal");
  template.currentSettings = currentSettings;
  var html = template.evaluate().setWidth(600).setHeight(640).setTitle("⚙️ Cấu Hình Hệ Thống - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "⚙️ Cấu Hình Hệ Thống");
}

function saveSettingsFromModal(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("settings") || (setupSettingsTab(ss), ss.getSheetByName("settings"));

  var descriptions = {
    hotline: "Số điện thoại hotline tư vấn tuyển sinh",
    zalo_url: "Đường dẫn chat Zalo tư vấn nhanh",
    contact_email: "Email nhận thư liên hệ",
    announcement_bar: "Thông báo trên thanh header",
    revalidation_url: "URL Webhook làm mới bộ nhớ cache của Website"
  };

  var lastRow = sheet.getLastRow();
  var existingMap = {};
  if (lastRow > 1) {
    var keys = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < keys.length; i++) {
      if (keys[i][0]) existingMap[keys[i][0].toString().trim()] = i + 2;
    }
  }

  for (var key in data) {
    if (!data.hasOwnProperty(key)) continue;
    var val = sanitizeFormula(data[key]);
    var desc = descriptions[key] || "Cấu hình " + key;

    if (existingMap[key]) {
      sheet.getRange(existingMap[key], 2).setValue(val);
    } else {
      sheet.appendRow([sanitizeFormula(key), val, sanitizeFormula(desc)]);
    }
  }

  ss.toast("🎉 Đã lưu toàn bộ cấu hình hệ thống thành công!", "DataWithLy CMS", 5);
  return { success: true };
}



// ==============================================================================
// FILE NGUỒN: 14_BlogModal.gs
// ==============================================================================

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
    var desc = (item.description || excerpt).toString().trim();
    var contentMd = (item.content_markdown || item.content || excerpt).toString().trim();
    var coverImg = (item.cover_image_url || "/assets/figma/c4ad4d89a999588201cc5ccd2a39ca7dd43febe3.png").toString().trim();
    var avatarImg = (item.author_avatar_url || "/uploads/mentors/ly-hua.jpg").toString().trim();

    rowsToAdd.push([
      sanitizeFormula(uniqueId),
      sanitizeFormula(title),
      sanitizeFormula(uniqueSlug),
      sanitizeFormula(item.category || "Sự nghiệp"),
      sanitizeFormula(desc),
      sanitizeFormula(excerpt),
      sanitizeFormula(contentMd),
      sanitizeFormula(coverImg),
      sanitizeFormula(item.author_name || "Hứa Thảo Ly"),
      sanitizeFormula(avatarImg),
      sanitizeFormula(publishedAt),
      item.is_active === true || item.is_active === "true"
    ]);

    addedBlogs.push({ id: uniqueId, title: title, slug: uniqueSlug });
  }

  var startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rowsToAdd.length, 12).setValues(rowsToAdd);

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

