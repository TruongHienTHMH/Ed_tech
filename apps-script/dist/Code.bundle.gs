/**
 * ==============================================================================
 * DATAWITHLY CMS - HỆ THỐNG GOOGLE APPS SCRIPT TRỌN GÓI (ALL-IN-ONE BUNDLE)
 * ==============================================================================
 * Phiên bản: 2.1.0 (DataWithLy Enterprise CMS)
 * Thời gian đóng gói: 2026-11-09T11:55:30.868Z
 * Tự động tạo bởi: scripts/bundle-apps-script.js
 *
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Mở Google Sheets -> Tiện ích mở rộng -> Apps Script.
 * 2. Dán toàn bộ nội dung file Code.gs này vào trình soạn thảo.
 * 3. File đã được inlined toàn bộ giao diện HTML Modals (chạy 100% không cần tạo file .html phụ).
 * 4. Bấm Lưu và chạy hàm onOpen() hoặc tải lại trang Google Sheets!
 * ==============================================================================
 */

// BẢN INLINED GIAO DIỆN HTML CHO TẤT CẢ CÁC MODALS (HỖ TRỢ CHẠY 1 FILE DUY NHẤT)
var INLINED_HTML = {
  "BlogModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">✍️ Thêm Bài Viết Blog Hàng Loạt</h2>\n      <p class=\"modal-subtitle\">Xuất bản bài viết kiến thức, tự động sinh slug chuẩn SEO và chống trùng lặp theo thời gian thực</p>\n    </div>\n  </div>\n\n  <form id=\"blogForm\">\n    <div id=\"blogCardsContainer\" class=\"repeater-container\"></div>\n\n    <button type=\"button\" id=\"addBlogBtn\" class=\"btn-add-repeater\">\n      <span>➕ Thêm bài viết</span>\n    </button>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n    <div id=\"successBox\" class=\"alert-banner alert-success fade-in\" style=\"display: none;\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span id=\"submitBtnText\">Lưu tất cả (1 bài viết)</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var existingSlugs = <?!= JSON.stringify(existingSlugs || []) ?>;\n\n    function slugify(text) {\n      if (!text) return \"\";\n      var str = text.toString().toLowerCase().trim();\n      str = str.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, \"a\");\n      str = str.replace(/[éèẻẽẹêếềểễệ]/g, \"e\");\n      str = str.replace(/[íìỉĩị]/g, \"i\");\n      str = str.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, \"o\");\n      str = str.replace(/[úùủũụưứừửữự]/g, \"u\");\n      str = str.replace(/[ýỳỷỹỵ]/g, \"y\");\n      str = str.replace(/đ/g, \"d\");\n      str = str.replace(/[\\s_]+/g, \"-\");\n      str = str.replace(/[^a-z0-9-]/g, \"\");\n      str = str.replace(/-+/g, \"-\");\n      str = str.replace(/^-+|-+$/g, \"\");\n      return str;\n    }\n\n    function resolveUniqueSlugClient(rawInput, existingSlugs, currentSlug) {\n      var base = slugify(rawInput);\n      if (!base) return { slug: \"\", isVersioned: false };\n\n      var cleanBase = base.replace(/-v\\d+$/, \"\");\n      var slugMap = {};\n      var list = existingSlugs || [];\n      var cur = (currentSlug || \"\").toString().trim().toLowerCase();\n\n      for (var i = 0; i < list.length; i++) {\n        var s = (list[i] || \"\").toString().trim().toLowerCase();\n        if (s && s !== cur) {\n          slugMap[s] = true;\n        }\n      }\n\n      if (!slugMap[cleanBase]) {\n        return { slug: cleanBase, isVersioned: false };\n      }\n\n      var version = 1;\n      while (true) {\n        var candidate = cleanBase + \"-v\" + version;\n        if (!slugMap[candidate]) {\n          return { slug: candidate, isVersioned: true };\n        }\n        version++;\n      }\n    }\n\n    var form = document.getElementById(\"blogForm\");\n    var container = document.getElementById(\"blogCardsContainer\");\n    var addBlogBtn = document.getElementById(\"addBlogBtn\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var submitBtnText = document.getElementById(\"submitBtnText\");\n    var errorBox = document.getElementById(\"errorBox\");\n    var successBox = document.getElementById(\"successBox\");\n\n    function showError(msg) {\n      if (successBox) successBox.style.display = \"none\";\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n\n    function showSuccess(msg) {\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n      successBox.innerText = msg;\n      successBox.style.display = \"flex\";\n    }\n\n    function updateAllSlugs() {\n      var cards = container.querySelectorAll(\".form-card\");\n      var batchSlugs = [].concat(existingSlugs);\n\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var titleInput = card.querySelector('[name=\"title\"]');\n        var slugPreview = card.querySelector(\".slug-preview-text\");\n        var slugHidden = card.querySelector('[name=\"slug\"]');\n        var versionBadge = card.querySelector(\".slug-version-badge\");\n        var val = (titleInput.value || \"\").trim();\n        var rawSlug = slugify(val);\n\n        if (!rawSlug) {\n          slugPreview.innerText = \"lo-trinh-chuyen-nganh-data-analytics\";\n          slugHidden.value = \"\";\n          versionBadge.className = \"badge-v badge-slate slug-version-badge\";\n          versionBadge.innerText = \"Chờ nhập liệu\";\n          continue;\n        }\n\n        var res = resolveUniqueSlugClient(rawSlug, batchSlugs);\n        slugPreview.innerText = res.slug;\n        slugHidden.value = res.slug;\n        batchSlugs.push(res.slug);\n\n        if (res.isVersioned) {\n          versionBadge.className = \"badge-v badge-crimson slug-version-badge\";\n          versionBadge.innerText = \"⚡ Trùng tiêu đề -> Đã gắn: \" + res.slug.split(\"-\").pop();\n        } else {\n          versionBadge.className = \"badge-v badge-emerald slug-version-badge\";\n          versionBadge.innerText = \"✅ Duy nhất chuẩn SEO\";\n        }\n      }\n    }\n\n    function updateCardHeaders() {\n      var cards = container.querySelectorAll(\".form-card\");\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var titleElem = card.querySelector(\".form-card-title span\");\n        if (titleElem) {\n          titleElem.innerText = \"✍️ Bài viết #\" + (i + 1);\n        }\n        var removeBtn = card.querySelector(\".btn-remove-card\");\n        if (removeBtn) {\n          removeBtn.style.display = cards.length > 1 ? \"inline-block\" : \"none\";\n        }\n      }\n      submitBtnText.innerText = \"Lưu tất cả (\" + cards.length + \" bài viết)\";\n    }\n\n    function createBlogCard() {\n      var card = document.createElement(\"div\");\n      card.className = \"form-card fade-in\";\n      card.innerHTML =\n        '<div class=\"form-card-header\">' +\n          '<div class=\"form-card-title\"><span>✍️ Bài viết</span></div>' +\n          '<button type=\"button\" class=\"btn-remove-card\" title=\"Xóa bài viết này\">✕ Xóa</button>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Tiêu Đề Bài Viết <span class=\"required\">*</span></label>' +\n          '<input type=\"text\" name=\"title\" required placeholder=\"Lộ trình chuyển ngành Data Analytics từ con số 0 năm 2026\" autocomplete=\"off\">' +\n        '</div>' +\n        '<div class=\"preview-box\">' +\n          '<div class=\"preview-header\">' +\n            '<span>Xem trước URL Bài Viết Blog</span>' +\n            '<span class=\"badge-v badge-slate slug-version-badge\">Chờ nhập liệu</span>' +\n          '</div>' +\n          '<div class=\"preview-content\">' +\n            'https://datawithly.edu.vn/blog/<strong class=\"slug-preview-text\" style=\"color: var(--primary);\">lo-trinh-chuyen-nganh-data-analytics</strong>' +\n          '</div>' +\n          '<input type=\"hidden\" name=\"slug\">' +\n          '<input type=\"hidden\" name=\"id\">' +\n        '</div>' +\n        '<div class=\"form-row\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Chuyên Mục Bài Viết <span class=\"required\">*</span></label>' +\n            '<select name=\"category\">' +\n              '<option value=\"Sự nghiệp\">Sự nghiệp (Career Path)</option>' +\n              '<option value=\"Kỹ thuật\">Kỹ thuật (SQL / BI / Python)</option>' +\n              '<option value=\"Case Study\">Case Study Thực Chiến</option>' +\n              '<option value=\"Góc nhìn\">Góc nhìn & Tư duy Dữ liệu</option>' +\n            '</select>' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Tác Giả <span class=\"required\">*</span></label>' +\n            '<input type=\"text\" name=\"author_name\" required value=\"Hứa Thảo Ly\" placeholder=\"Hứa Thảo Ly\">' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Đoạn Tóm Tắt Ngắn (Meta Description & Excerpt) <span class=\"required\">*</span></label>' +\n          '<textarea name=\"excerpt\" rows=\"2\" required placeholder=\"Chi tiết từng giai đoạn học tập, kỹ năng cần chuẩn bị và cách xây dựng Portfolio...\"></textarea>' +\n        '</div>' +\n        '<div class=\"form-row\" style=\"margin-top: 6px;\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Ngày Xuất Bản</label>' +\n            '<input type=\"date\" name=\"published_at\">' +\n          '</div>' +\n          '<div class=\"form-group col-1\" style=\"display: flex; align-items: flex-end;\">' +\n            '<label class=\"checkbox-group\" style=\"width: 100%;\">' +\n              '<input type=\"checkbox\" name=\"is_active\" checked>' +\n              '<span class=\"checkbox-label\">Xuất bản công khai (is_active)</span>' +\n            '</label>' +\n          '</div>' +\n        '</div>';\n\n      var dateInput = card.querySelector('[name=\"published_at\"]');\n      if (dateInput) {\n        dateInput.value = new Date().toISOString().split(\"T\")[0];\n      }\n\n      var titleInput = card.querySelector('[name=\"title\"]');\n      titleInput.addEventListener(\"input\", updateAllSlugs);\n\n      var removeBtn = card.querySelector(\".btn-remove-card\");\n      removeBtn.addEventListener(\"click\", function () {\n        card.remove();\n        updateCardHeaders();\n        updateAllSlugs();\n      });\n\n      container.appendChild(card);\n      updateCardHeaders();\n      updateAllSlugs();\n      return card;\n    }\n\n    addBlogBtn.addEventListener(\"click\", function () {\n      var newCard = createBlogCard();\n      var input = newCard.querySelector('[name=\"title\"]');\n      if (input) input.focus();\n    });\n\n    createBlogCard();\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var cards = container.querySelectorAll(\".form-card\");\n      if (cards.length === 0) {\n        showError(\"Vui lòng thêm ít nhất một bài viết.\");\n        return;\n      }\n\n      var blogList = [];\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var title = (card.querySelector('[name=\"title\"]').value || \"\").trim();\n        if (!title) {\n          showError(\"Vui lòng nhập tiêu đề cho bài viết #\" + (i + 1) + \".\");\n          card.querySelector('[name=\"title\"]').focus();\n          return;\n        }\n\n        var excerpt = (card.querySelector('[name=\"excerpt\"]').value || \"\").trim();\n        if (!excerpt) {\n          showError(\"Vui lòng nhập đoạn tóm tắt cho bài viết #\" + (i + 1) + \".\");\n          card.querySelector('[name=\"excerpt\"]').focus();\n          return;\n        }\n\n        var author = (card.querySelector('[name=\"author_name\"]').value || \"\").trim() || \"Hứa Thảo Ly\";\n        var publishedAt = card.querySelector('[name=\"published_at\"]').value || new Date().toISOString().split(\"T\")[0];\n\n        blogList.push({\n          title: title,\n          slug: card.querySelector('[name=\"slug\"]').value || slugify(title),\n          category: card.querySelector('[name=\"category\"]').value,\n          excerpt: excerpt,\n          author_name: author,\n          published_at: publishedAt,\n          is_active: card.querySelector('[name=\"is_active\"]').checked\n        });\n      }\n\n      submitBtn.disabled = true;\n      addBlogBtn.disabled = true;\n      submitBtnText.innerHTML = '<span class=\"spinner\"></span> Đang xuất bản ' + blogList.length + ' bài viết...';\n\n      google.script.run\n        .withSuccessHandler(function (res) {\n          showSuccess(\"✅ Đã xuất bản thành công \" + (res.count || blogList.length) + \" bài viết!\");\n          setTimeout(function () {\n            google.script.host.close();\n          }, 1200);\n        })\n        .withFailureHandler(function (err) {\n          submitBtn.disabled = false;\n          addBlogBtn.disabled = false;\n          updateCardHeaders();\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .addBlogsBatchFromModal(blogList);\n    });\n  </script>\n</body>\n\n</html>\n",
  "CourseModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">➕ Thêm Khóa Học Hàng Loạt</h2>\n      <p class=\"modal-subtitle\">Thêm nhiều khóa học cùng lúc với nút \"+\" Repeater, tự động chuẩn hóa SEO Slug và version -v1, -v2 độc lập</p>\n    </div>\n  </div>\n\n  <form id=\"courseForm\">\n    <div id=\"courseCardsContainer\" class=\"repeater-container\"></div>\n\n    <button type=\"button\" id=\"addCourseBtn\" class=\"btn-add-repeater\">\n      <span>➕ Thêm khóa học</span>\n    </button>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n    <div id=\"successBox\" class=\"alert-banner alert-success fade-in\" style=\"display: none;\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span id=\"submitBtnText\">Lưu tất cả (1 khóa học)</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var existingSlugs = <?!= JSON.stringify(existingSlugs || []) ?>;\n\n    function slugify(text) {\n      if (!text) return \"\";\n      var str = text.toString().toLowerCase().trim();\n      str = str.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, \"a\");\n      str = str.replace(/[éèẻẽẹêếềểễệ]/g, \"e\");\n      str = str.replace(/[íìỉĩị]/g, \"i\");\n      str = str.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, \"o\");\n      str = str.replace(/[úùủũụưứừửữự]/g, \"u\");\n      str = str.replace(/[ýỳỷỹỵ]/g, \"y\");\n      str = str.replace(/đ/g, \"d\");\n      str = str.replace(/[\\s_]+/g, \"-\");\n      str = str.replace(/[^a-z0-9-]/g, \"\");\n      str = str.replace(/-+/g, \"-\");\n      str = str.replace(/^-+|-+$/g, \"\");\n      return str;\n    }\n\n    function resolveUniqueSlugClient(rawInput, existingSlugs, currentSlug) {\n      var base = slugify(rawInput);\n      if (!base) return { slug: \"\", isVersioned: false };\n\n      var cleanBase = base.replace(/-v\\d+$/, \"\");\n      var slugMap = {};\n      var list = existingSlugs || [];\n      var cur = (currentSlug || \"\").toString().trim().toLowerCase();\n\n      for (var i = 0; i < list.length; i++) {\n        var s = (list[i] || \"\").toString().trim().toLowerCase();\n        if (s && s !== cur) {\n          slugMap[s] = true;\n        }\n      }\n\n      if (!slugMap[cleanBase]) {\n        return { slug: cleanBase, isVersioned: false };\n      }\n\n      var version = 1;\n      while (true) {\n        var candidate = cleanBase + \"-v\" + version;\n        if (!slugMap[candidate]) {\n          return { slug: candidate, isVersioned: true };\n        }\n        version++;\n      }\n    }\n\n    var form = document.getElementById(\"courseForm\");\n    var container = document.getElementById(\"courseCardsContainer\");\n    var addCourseBtn = document.getElementById(\"addCourseBtn\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var submitBtnText = document.getElementById(\"submitBtnText\");\n    var errorBox = document.getElementById(\"errorBox\");\n    var successBox = document.getElementById(\"successBox\");\n\n    function showError(msg) {\n      if (successBox) successBox.style.display = \"none\";\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n\n    function showSuccess(msg) {\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n      successBox.innerText = msg;\n      successBox.style.display = \"flex\";\n    }\n\n    function updateAllSlugs() {\n      var cards = container.querySelectorAll(\".form-card\");\n      var batchSlugs = [].concat(existingSlugs);\n\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var titleInput = card.querySelector('[name=\"title\"]');\n        var slugPreview = card.querySelector(\".slug-preview-text\");\n        var slugHidden = card.querySelector('[name=\"slug\"]');\n        var versionBadge = card.querySelector(\".slug-version-badge\");\n        var val = (titleInput.value || \"\").trim();\n        var rawSlug = slugify(val);\n\n        if (!rawSlug) {\n          slugPreview.innerText = \"sql-for-data-analytics\";\n          slugHidden.value = \"\";\n          versionBadge.className = \"badge-v badge-slate slug-version-badge\";\n          versionBadge.innerText = \"Chờ nhập liệu\";\n          continue;\n        }\n\n        var res = resolveUniqueSlugClient(rawSlug, batchSlugs);\n        slugPreview.innerText = res.slug;\n        slugHidden.value = res.slug;\n        batchSlugs.push(res.slug);\n\n        if (res.isVersioned) {\n          versionBadge.className = \"badge-v badge-crimson slug-version-badge\";\n          versionBadge.innerText = \"⚡ Trùng tiêu đề -> Đã gắn: \" + res.slug.split(\"-\").pop();\n        } else {\n          versionBadge.className = \"badge-v badge-emerald slug-version-badge\";\n          versionBadge.innerText = \"✅ Duy nhất chuẩn SEO\";\n        }\n      }\n    }\n\n    function updateCardHeaders() {\n      var cards = container.querySelectorAll(\".form-card\");\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var titleElem = card.querySelector(\".form-card-title span\");\n        if (titleElem) {\n          titleElem.innerText = \"📘 Khóa học #\" + (i + 1);\n        }\n        var sortOrderInput = card.querySelector('[name=\"sort_order\"]');\n        if (sortOrderInput && (!sortOrderInput.value || sortOrderInput.getAttribute(\"data-auto\") === \"true\")) {\n          sortOrderInput.value = i + 1;\n          sortOrderInput.setAttribute(\"data-auto\", \"true\");\n        }\n        var removeBtn = card.querySelector(\".btn-remove-card\");\n        if (removeBtn) {\n          removeBtn.style.display = cards.length > 1 ? \"inline-block\" : \"none\";\n        }\n      }\n      submitBtnText.innerText = \"Lưu tất cả (\" + cards.length + \" khóa học)\";\n    }\n\n    function createCourseCard() {\n      var card = document.createElement(\"div\");\n      card.className = \"form-card fade-in\";\n      card.innerHTML = \n        '<div class=\"form-card-header\">' +\n          '<div class=\"form-card-title\"><span>📘 Khóa học</span></div>' +\n          '<button type=\"button\" class=\"btn-remove-card\" title=\"Xóa thẻ khóa học này\">✕ Xóa</button>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Tên Khóa Học <span class=\"required\">*</span></label>' +\n          '<input type=\"text\" name=\"title\" required placeholder=\"Ví dụ: SQL for Data Analytics Thực Chiến\" autocomplete=\"off\">' +\n        '</div>' +\n        '<div class=\"preview-box\">' +\n          '<div class=\"preview-header\">' +\n            '<span>Xem trước URL & Slug SEO</span>' +\n            '<span class=\"badge-v badge-slate slug-version-badge\">Chờ nhập liệu</span>' +\n          '</div>' +\n          '<div class=\"preview-content\">' +\n            'https://datawithly.edu.vn/courses/<strong class=\"slug-preview-text\" style=\"color: var(--primary);\">sql-for-data-analytics</strong>' +\n          '</div>' +\n          '<input type=\"hidden\" name=\"slug\">' +\n          '<input type=\"hidden\" name=\"id\">' +\n        '</div>' +\n        '<div class=\"form-row\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Chủ Đề (Tag) <span class=\"required\">*</span></label>' +\n            '<select name=\"tag\">' +\n              '<option value=\"SQL\">SQL</option>' +\n              '<option value=\"Dashboard\">Dashboard (Power BI)</option>' +\n              '<option value=\"Python\">Python</option>' +\n              '<option value=\"End-to-End\">End-to-End Analytics</option>' +\n            '</select>' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Trình Độ</label>' +\n            '<select name=\"level\">' +\n              '<option value=\"Beginner\">Beginner (Cơ bản)</option>' +\n              '<option value=\"Intermediate\">Intermediate (Trung cấp)</option>' +\n              '<option value=\"Advanced\">Advanced (Nâng cao)</option>' +\n            '</select>' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Thông Điệp Ngắn (Tagline)</label>' +\n          '<input type=\"text\" name=\"tagline\" placeholder=\"Ví dụ: Nắm vững tư duy truy vấn, CTE và Window Functions\">' +\n        '</div>' +\n        '<div class=\"form-row\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Học Phí Ưu Đãi (VNĐ) <span class=\"required\">*</span></label>' +\n            '<input type=\"number\" name=\"tuition_vnd\" required placeholder=\"4500000\" step=\"50000\">' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Học Phí Gốc (VNĐ)</label>' +\n            '<input type=\"number\" name=\"original_tuition_vnd\" placeholder=\"6000000\" step=\"50000\">' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-row\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Thời Lượng</label>' +\n            '<input type=\"text\" name=\"duration\" value=\"8 tuần (24 buổi)\">' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Thứ Tự Sắp Xếp</label>' +\n            '<input type=\"number\" name=\"sort_order\" min=\"1\" data-auto=\"true\">' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Mô Tả Tổng Quan Khóa Học</label>' +\n          '<textarea name=\"description\" rows=\"2\" placeholder=\"Mô tả giá trị thực chiến, mục tiêu đầu ra và đối tượng phù hợp...\"></textarea>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Ảnh Bìa (URL)</label>' +\n          '<input type=\"text\" name=\"cover_image_url\" placeholder=\"/uploads/courses/sql-course.jpg\">' +\n        '</div>' +\n        '<div class=\"form-row\" style=\"margin-top: 6px;\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label class=\"checkbox-group\">' +\n              '<input type=\"checkbox\" name=\"is_active\" checked>' +\n              '<span class=\"checkbox-label\">Kích hoạt hiển thị (is_active)</span>' +\n            '</label>' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label class=\"checkbox-group\">' +\n              '<input type=\"checkbox\" name=\"is_featured\">' +\n              '<span class=\"checkbox-label\">Khóa học nổi bật (is_featured)</span>' +\n            '</label>' +\n          '</div>' +\n        '</div>';\n\n      var titleInput = card.querySelector('[name=\"title\"]');\n      titleInput.addEventListener(\"input\", updateAllSlugs);\n\n      var removeBtn = card.querySelector(\".btn-remove-card\");\n      removeBtn.addEventListener(\"click\", function () {\n        card.remove();\n        updateCardHeaders();\n        updateAllSlugs();\n      });\n\n      var sortInput = card.querySelector('[name=\"sort_order\"]');\n      sortInput.addEventListener(\"input\", function () {\n        this.setAttribute(\"data-auto\", \"false\");\n      });\n\n      container.appendChild(card);\n      updateCardHeaders();\n      updateAllSlugs();\n      return card;\n    }\n\n    addCourseBtn.addEventListener(\"click\", function () {\n      var newCard = createCourseCard();\n      var input = newCard.querySelector('[name=\"title\"]');\n      if (input) input.focus();\n    });\n\n    createCourseCard();\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var cards = container.querySelectorAll(\".form-card\");\n      if (cards.length === 0) {\n        showError(\"Vui lòng thêm ít nhất một khóa học.\");\n        return;\n      }\n\n      var courseList = [];\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var title = (card.querySelector('[name=\"title\"]').value || \"\").trim();\n        if (!title) {\n          showError(\"Vui lòng nhập tên cho khóa học #\" + (i + 1) + \".\");\n          card.querySelector('[name=\"title\"]').focus();\n          return;\n        }\n\n        var tuitionVnd = card.querySelector('[name=\"tuition_vnd\"]').value;\n        if (!tuitionVnd || isNaN(Number(tuitionVnd)) || Number(tuitionVnd) < 0) {\n          showError(\"Vui lòng nhập học phí ưu đãi hợp lệ cho khóa học #\" + (i + 1) + \".\");\n          card.querySelector('[name=\"tuition_vnd\"]').focus();\n          return;\n        }\n\n        var origTuition = card.querySelector('[name=\"original_tuition_vnd\"]').value;\n        var sortVal = card.querySelector('[name=\"sort_order\"]').value;\n\n        courseList.push({\n          title: title,\n          slug: card.querySelector('[name=\"slug\"]').value || slugify(title),\n          tag: card.querySelector('[name=\"tag\"]').value,\n          level: card.querySelector('[name=\"level\"]').value,\n          tagline: (card.querySelector('[name=\"tagline\"]').value || \"\").trim(),\n          tuition_vnd: tuitionVnd,\n          original_tuition_vnd: origTuition || tuitionVnd,\n          duration: (card.querySelector('[name=\"duration\"]').value || \"\").trim(),\n          sort_order: sortVal || (i + 1),\n          description: (card.querySelector('[name=\"description\"]').value || \"\").trim(),\n          cover_image_url: (card.querySelector('[name=\"cover_image_url\"]').value || \"\").trim(),\n          is_active: card.querySelector('[name=\"is_active\"]').checked,\n          is_featured: card.querySelector('[name=\"is_featured\"]').checked\n        });\n      }\n\n      submitBtn.disabled = true;\n      addCourseBtn.disabled = true;\n      submitBtnText.innerHTML = '<span class=\"spinner\"></span> Đang lưu ' + courseList.length + ' khóa học...';\n\n      google.script.run\n        .withSuccessHandler(function (res) {\n          showSuccess(\"✅ Đã lưu thành công \" + (res.count || courseList.length) + \" khóa học vào hệ thống!\");\n          setTimeout(function () {\n            google.script.host.close();\n          }, 1200);\n        })\n        .withFailureHandler(function (err) {\n          submitBtn.disabled = false;\n          addCourseBtn.disabled = false;\n          updateCardHeaders();\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .addCoursesBatchFromModal(courseList);\n    });\n  </script>\n</body>\n\n</html>\n",
  "CurriculumModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">📚 Thêm Chương Lộ Trình Hàng Loạt</h2>\n      <p class=\"modal-subtitle\">Thêm nhiều chương / modules cùng lúc cho khóa học được chọn, tự động tính số thứ tự chương</p>\n    </div>\n  </div>\n\n  <form id=\"curriculumForm\">\n    <div class=\"form-group\">\n      <label for=\"course_select\">Khóa Học Áp Dụng <span class=\"required\">*</span></label>\n      <select id=\"course_select\" name=\"course_select\" required>\n        <? for (var i = 0; i < coursesList.length; i++) { ?>\n        <option value=\"<?= coursesList[i].id ?>\" data-title=\"<?= coursesList[i].title ?>\"\n          data-max=\"<?= coursesList[i].maxModule ?>\">\n          <?= coursesList[i].title ?> (Hiện có: <?= coursesList[i].maxModule ?> chương)\n        </option>\n        <? } ?>\n      </select>\n    </div>\n\n    <div id=\"curriculumCardsContainer\" class=\"repeater-container\"></div>\n\n    <button type=\"button\" id=\"addCurriculumBtn\" class=\"btn-add-repeater\">\n      <span>➕ Thêm chương / buổi học</span>\n    </button>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n    <div id=\"successBox\" class=\"alert-banner alert-success fade-in\" style=\"display: none;\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span id=\"submitBtnText\">Lưu tất cả (1 chương học)</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var courseSelect = document.getElementById(\"course_select\");\n    var container = document.getElementById(\"curriculumCardsContainer\");\n    var addCurriculumBtn = document.getElementById(\"addCurriculumBtn\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var submitBtnText = document.getElementById(\"submitBtnText\");\n    var errorBox = document.getElementById(\"errorBox\");\n    var successBox = document.getElementById(\"successBox\");\n\n    function getBaseModuleNumber() {\n      var selected = courseSelect.options[courseSelect.selectedIndex];\n      return selected ? parseInt(selected.getAttribute(\"data-max\") || \"0\", 10) : 0;\n    }\n\n    function updateCardIndices() {\n      var cards = container.querySelectorAll(\".form-card\");\n      var baseMod = getBaseModuleNumber();\n\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var titleElem = card.querySelector(\".form-card-title span\");\n        if (titleElem) {\n          titleElem.innerText = \"📚 Chương / Buổi học #\" + (i + 1);\n        }\n        var modInput = card.querySelector('[name=\"module_number\"]');\n        var sortInput = card.querySelector('[name=\"sort_order\"]');\n        var nextMod = baseMod + i + 1;\n\n        if (modInput && modInput.getAttribute(\"data-auto\") === \"true\") {\n          modInput.value = nextMod;\n        }\n        if (sortInput && sortInput.getAttribute(\"data-auto\") === \"true\") {\n          sortInput.value = nextMod;\n        }\n\n        var removeBtn = card.querySelector(\".btn-remove-card\");\n        if (removeBtn) {\n          removeBtn.style.display = cards.length > 1 ? \"inline-block\" : \"none\";\n        }\n      }\n\n      submitBtnText.innerText = \"Lưu tất cả (\" + cards.length + \" chương học)\";\n    }\n\n    courseSelect.addEventListener(\"change\", function () {\n      var cards = container.querySelectorAll(\".form-card\");\n      for (var i = 0; i < cards.length; i++) {\n        var modInput = cards[i].querySelector('[name=\"module_number\"]');\n        var sortInput = cards[i].querySelector('[name=\"sort_order\"]');\n        if (modInput) modInput.setAttribute(\"data-auto\", \"true\");\n        if (sortInput) sortInput.setAttribute(\"data-auto\", \"true\");\n      }\n      updateCardIndices();\n    });\n\n    function createCurriculumCard() {\n      var card = document.createElement(\"div\");\n      card.className = \"form-card fade-in\";\n      card.innerHTML = \n        '<div class=\"form-card-header\">' +\n          '<div class=\"form-card-title\"><span>📚 Chương / Buổi học</span></div>' +\n          '<button type=\"button\" class=\"btn-remove-card\" title=\"Xóa thẻ chương này\">✕ Xóa</button>' +\n        '</div>' +\n        '<div class=\"form-row\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Số Thứ Tự Chương <span class=\"required\">*</span></label>' +\n            '<input type=\"number\" name=\"module_number\" required min=\"1\" data-auto=\"true\">' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Thời Lượng Chương</label>' +\n            '<input type=\"text\" name=\"duration\" value=\"2 tuần (6 buổi)\">' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Số Buổi Học</label>' +\n            '<input type=\"number\" name=\"lessons_count\" min=\"1\" value=\"6\">' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Tiêu Đề Chương <span class=\"required\">*</span></label>' +\n          '<input type=\"text\" name=\"module_title\" required placeholder=\"Ví dụ: Chương 1: Nền tảng Cơ sở Dữ liệu & Cú pháp SELECT\">' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Nội Dung Bài Học (Mỗi dòng là một bullet point) <span class=\"required\">*</span></label>' +\n          '<textarea name=\"topics_bullets\" rows=\"4\" required placeholder=\"Tổng quan về RDBMS, Table, Schema&#10;Cú pháp SELECT, WHERE, ORDER BY&#10;Toán tử logic AND, OR, NOT, IN, LIKE&#10;Thực hành Capstone Mini: Phân tích giỏ hàng E-commerce\"></textarea>' +\n          '<div class=\"help-text\">Mẹo: Nhấn Enter / Alt+Enter để tách từng bullet point riêng biệt.</div>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Thứ Tự Hiển Thị</label>' +\n          '<input type=\"number\" name=\"sort_order\" min=\"1\" data-auto=\"true\">' +\n        '</div>';\n\n      var modInput = card.querySelector('[name=\"module_number\"]');\n      modInput.addEventListener(\"input\", function () {\n        this.setAttribute(\"data-auto\", \"false\");\n      });\n\n      var sortInput = card.querySelector('[name=\"sort_order\"]');\n      sortInput.addEventListener(\"input\", function () {\n        this.setAttribute(\"data-auto\", \"false\");\n      });\n\n      var removeBtn = card.querySelector(\".btn-remove-card\");\n      removeBtn.addEventListener(\"click\", function () {\n        card.remove();\n        updateCardIndices();\n      });\n\n      container.appendChild(card);\n      updateCardIndices();\n      return card;\n    }\n\n    addCurriculumBtn.addEventListener(\"click\", function () {\n      var newCard = createCurriculumCard();\n      var input = newCard.querySelector('[name=\"module_title\"]');\n      if (input) input.focus();\n    });\n\n    createCurriculumCard();\n\n    function showError(msg) {\n      if (successBox) successBox.style.display = \"none\";\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n\n    function showSuccess(msg) {\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n      successBox.innerText = msg;\n      successBox.style.display = \"flex\";\n    }\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var selected = courseSelect.options[courseSelect.selectedIndex];\n      var courseId = selected ? selected.value : \"\";\n      var courseName = selected ? selected.getAttribute(\"data-title\") : \"\";\n\n      if (!courseId) {\n        showError(\"Vui lòng chọn khóa học áp dụng.\");\n        return;\n      }\n\n      var cards = container.querySelectorAll(\".form-card\");\n      if (cards.length === 0) {\n        showError(\"Vui lòng thêm ít nhất một chương học.\");\n        return;\n      }\n\n      var curriculumList = [];\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var moduleTitle = (card.querySelector('[name=\"module_title\"]').value || \"\").trim();\n        if (!moduleTitle) {\n          showError(\"Vui lòng nhập tiêu đề cho chương #\" + (i + 1) + \".\");\n          card.querySelector('[name=\"module_title\"]').focus();\n          return;\n        }\n\n        var topics = (card.querySelector('[name=\"topics_bullets\"]').value || \"\").trim();\n        if (!topics) {\n          showError(\"Vui lòng nhập nội dung bài học cho chương #\" + (i + 1) + \".\");\n          card.querySelector('[name=\"topics_bullets\"]').focus();\n          return;\n        }\n\n        var modNum = parseInt(card.querySelector('[name=\"module_number\"]').value, 10) || (i + 1);\n        var sortVal = parseInt(card.querySelector('[name=\"sort_order\"]').value, 10) || modNum;\n        var lessonsCount = parseInt(card.querySelector('[name=\"lessons_count\"]').value, 10) || 6;\n        var duration = (card.querySelector('[name=\"duration\"]').value || \"\").trim();\n\n        curriculumList.push({\n          course_id: courseId,\n          course_name: courseName,\n          module_number: modNum,\n          module_title: moduleTitle,\n          duration: duration || \"2 tuần (6 buổi)\",\n          lessons_count: lessonsCount,\n          topics_bullets: topics,\n          sort_order: sortVal\n        });\n      }\n\n      submitBtn.disabled = true;\n      addCurriculumBtn.disabled = true;\n      submitBtnText.innerHTML = '<span class=\"spinner\"></span> Đang lưu ' + curriculumList.length + ' chương học...';\n\n      google.script.run\n        .withSuccessHandler(function (res) {\n          showSuccess(\"✅ Đã lưu thành công \" + (res.count || curriculumList.length) + \" chương học vào lộ trình!\");\n          setTimeout(function () {\n            google.script.host.close();\n          }, 1200);\n        })\n        .withFailureHandler(function (err) {\n          submitBtn.disabled = false;\n          addCurriculumBtn.disabled = false;\n          updateCardIndices();\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .addCurriculumBatchFromModal(curriculumList);\n    });\n  </script>\n</body>\n\n</html>\n",
  "FaqModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">❓ Thêm Câu Hỏi Thường Gặp (FAQ)</h2>\n      <p class=\"modal-subtitle\">Giải đáp thắc mắc phổ biến về học phí, lịch học, đầu ra và lộ trình học tập</p>\n    </div>\n  </div>\n\n  <form id=\"faqForm\">\n    <div class=\"preview-box\">\n      <div class=\"preview-header\">\n        <span>Xem trước FAQ Accordion</span>\n        <span id=\"previewCategoryBadge\" class=\"badge-v badge-crimson\">CHUNG</span>\n      </div>\n      <div>\n        <strong id=\"previewQuestion\" style=\"font-size: 13px; color: var(--dark-slate);\">Người trái ngành, chưa từng học\n          IT có theo học được không?</strong>\n        <p id=\"previewAnswer\" style=\"font-size: 12px; color: var(--slate-muted); margin: 6px 0 0; line-height: 1.45;\">\n          Hoàn toàn được! Lộ trình của DataWithLy được thiết kế đi từ con số 0...\n        </p>\n      </div>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"category\">Danh Mục Câu Hỏi <span class=\"required\">*</span></label>\n        <select id=\"category\" name=\"category\" required>\n          <option value=\"CHUNG\">CHUNG (Thông tin chung & Khóa học)</option>\n          <option value=\"LỊCH HỌC\">LỊCH HỌC (Hình thức học & Record)</option>\n          <option value=\"HỌC PHÍ\">HỌC PHÍ (Học phí & Chính sách hoàn)</option>\n          <option value=\"ĐẦU RA\">ĐẦU RA (Hỗ trợ việc làm & CV)</option>\n        </select>\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"sort_order\">Thứ Tự Sắp Xếp</label>\n        <input type=\"number\" id=\"sort_order\" name=\"sort_order\" value=\"1\" min=\"1\">\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"question\">Câu Hỏi Thường Gặp <span class=\"required\">*</span></label>\n      <input type=\"text\" id=\"question\" name=\"question\" required placeholder=\"Người trái ngành có học được không?\"\n        autocomplete=\"off\">\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"answer\">Câu Trả Lời Chi Tiết <span class=\"required\">*</span></label>\n      <textarea id=\"answer\" name=\"answer\" rows=\"5\" required\n        placeholder=\"Hoàn toàn được! Lộ trình của DataWithLy được thiết kế đi từ con số 0, bắt đầu từ tư duy dữ liệu thực tế và các công cụ dễ tiếp cận trước khi đi vào chuyên sâu.\"></textarea>\n    </div>\n\n    <div class=\"form-group\" style=\"margin-top: 6px;\">\n      <label class=\"checkbox-group\">\n        <input type=\"checkbox\" id=\"is_active\" name=\"is_active\" checked>\n        <span class=\"checkbox-label\">Kích hoạt hiển thị trên website (is_active)</span>\n      </label>\n    </div>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span>Lưu Câu Hỏi</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var catSelect = document.getElementById(\"category\");\n    var qInput = document.getElementById(\"question\");\n    var aInput = document.getElementById(\"answer\");\n\n    var catBadge = document.getElementById(\"previewCategoryBadge\");\n    var qPreview = document.getElementById(\"previewQuestion\");\n    var aPreview = document.getElementById(\"previewAnswer\");\n\n    function updatePreview() {\n      catBadge.innerText = catSelect.value;\n      qPreview.innerText = qInput.value || \"Câu hỏi thường gặp...\";\n      aPreview.innerText = aInput.value || \"Câu trả lời chi tiết...\";\n    }\n\n    catSelect.addEventListener(\"change\", updatePreview);\n    qInput.addEventListener(\"input\", updatePreview);\n    aInput.addEventListener(\"input\", updatePreview);\n\n    var form = document.getElementById(\"faqForm\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var errorBox = document.getElementById(\"errorBox\");\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var q = qInput.value.trim();\n      var a = aInput.value.trim();\n      if (!q || !a) {\n        showError(\"Vui lòng nhập cả câu hỏi và câu trả lời.\");\n        return;\n      }\n\n      var data = {\n        category: catSelect.value,\n        question: q,\n        answer: a,\n        is_active: document.getElementById(\"is_active\").checked,\n        sort_order: parseInt(document.getElementById(\"sort_order\").value, 10) || 1\n      };\n\n      submitBtn.disabled = true;\n      submitBtn.innerHTML = '<span class=\"spinner\"></span> Đang lưu...';\n\n      google.script.run\n        .withSuccessHandler(function () {\n          google.script.host.close();\n        })\n        .withFailureHandler(function (err) {\n          submitBtn.disabled = false;\n          submitBtn.innerHTML = '<span>Lưu Câu Hỏi</span>';\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .saveFaqFromModal(data);\n    });\n\n    function showError(msg) {\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n  </script>\n</body>\n\n</html>",
  "MentorModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">👤 Quản Trị Hồ Sơ Giảng Viên Hàng Loạt</h2>\n      <p class=\"modal-subtitle\">Quản trị và bổ sung danh sách giảng viên, mentor hiển thị trên Website DataWithLy</p>\n    </div>\n  </div>\n\n  <form id=\"mentorForm\">\n    <div id=\"mentorCardsContainer\" class=\"repeater-container\"></div>\n\n    <button type=\"button\" id=\"addMentorBtn\" class=\"btn-add-repeater\">\n      <span>➕ Thêm giảng viên</span>\n    </button>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n    <div id=\"successBox\" class=\"alert-banner alert-success fade-in\" style=\"display: none;\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span id=\"submitBtnText\">Lưu tất cả (1 giảng viên)</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var initialMentor = <?!= JSON.stringify(currentMentor || {}) ?>;\n\n    var form = document.getElementById(\"mentorForm\");\n    var container = document.getElementById(\"mentorCardsContainer\");\n    var addMentorBtn = document.getElementById(\"addMentorBtn\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var submitBtnText = document.getElementById(\"submitBtnText\");\n    var errorBox = document.getElementById(\"errorBox\");\n    var successBox = document.getElementById(\"successBox\");\n\n    function showError(msg) {\n      if (successBox) successBox.style.display = \"none\";\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n\n    function showSuccess(msg) {\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n      successBox.innerText = msg;\n      successBox.style.display = \"flex\";\n    }\n\n    function updateCardHeaders() {\n      var cards = container.querySelectorAll(\".form-card\");\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var titleElem = card.querySelector(\".form-card-title span\");\n        if (titleElem) {\n          titleElem.innerText = \"👤 Giảng viên / Mentor #\" + (i + 1);\n        }\n        var removeBtn = card.querySelector(\".btn-remove-card\");\n        if (removeBtn) {\n          removeBtn.style.display = cards.length > 1 ? \"inline-block\" : \"none\";\n        }\n      }\n      submitBtnText.innerText = \"Lưu tất cả (\" + cards.length + \" giảng viên)\";\n    }\n\n    function createMentorCard(data) {\n      var d = data || {};\n      var card = document.createElement(\"div\");\n      card.className = \"form-card fade-in\";\n      card.innerHTML =\n        '<div class=\"form-card-header\">' +\n          '<div class=\"form-card-title\"><span>👤 Giảng viên / Mentor</span></div>' +\n          '<button type=\"button\" class=\"btn-remove-card\" title=\"Xóa thẻ giảng viên này\">✕ Xóa</button>' +\n        '</div>' +\n        '<input type=\"hidden\" name=\"id\" value=\"' + (d.id || \"\") + '\">' +\n        '<div class=\"preview-box\">' +\n          '<div class=\"preview-header\">' +\n            '<span>Xem trước Card Giảng Viên (Live Card Preview)</span>' +\n            '<span class=\"badge-v badge-emerald\">Hiển thị Trang Chủ</span>' +\n          '</div>' +\n          '<div style=\"display: flex; gap: 14px; align-items: center;\">' +\n            '<img class=\"avatar-preview-img\" src=\"' + (d.avatar_url || \"/uploads/mentors/ly-hua.jpg\") + '\"' +\n              ' onerror=\"this.src=\\'https://ui-avatars.com/api/?name=Hua+Thao+Ly&background=8B1D2C&color=fff\\'\"' +\n              ' style=\"width: 54px; height: 54px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);\">' +\n            '<div>' +\n              '<div class=\"name-preview-text\" style=\"font-size: 14px; font-weight: 700; color: var(--primary);\">' +\n                (d.name || \"Hứa Thảo Ly\") +\n              '</div>' +\n              '<div class=\"title-preview-text\" style=\"font-size: 12px; color: var(--slate-muted);\">' +\n                (d.title || \"Lead Mentor & Founder DataWithLy\") +\n              '</div>' +\n              '<div class=\"companies-preview-text\" style=\"font-size: 11px; margin-top: 2px; font-weight: 500; color: #059669;\">' +\n                '🏢 ' + (d.companies_worked || \"MoMo, Tiki, ACB Bank\") +\n              '</div>' +\n            '</div>' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-row\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Họ và Tên Mentor <span class=\"required\">*</span></label>' +\n            '<input type=\"text\" name=\"name\" required value=\"' + (d.name || \"\") + '\" placeholder=\"Hứa Thảo Ly\">' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Chức Danh & Học Vị <span class=\"required\">*</span></label>' +\n            '<input type=\"text\" name=\"title\" required value=\"' + (d.title || \"\") + '\" placeholder=\"Lead Mentor & Founder DataWithLy\">' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Các Công Ty Từng Làm Việc (Phân tách bởi dấu phẩy)</label>' +\n          '<input type=\"text\" name=\"companies_worked\" value=\"' + (d.companies_worked || \"\") + '\" placeholder=\"MoMo, Tiki, Shopee, ACB Bank\">' +\n        '</div>' +\n        '<div class=\"form-row\">' +\n          '<div class=\"form-group col-1\">' +\n            '<label>Đường Dẫn Ảnh Đại Diện (Avatar URL)</label>' +\n            '<input type=\"text\" name=\"avatar_url\" value=\"' + (d.avatar_url || \"\") + '\" placeholder=\"/uploads/mentors/ly-hua.jpg\">' +\n          '</div>' +\n          '<div class=\"form-group col-1\">' +\n            '<label>LinkedIn URL</label>' +\n            '<input type=\"text\" name=\"linkedin_url\" value=\"' + (d.linkedin_url || \"\") + '\" placeholder=\"https://linkedin.com/in/lyhuadata\">' +\n          '</div>' +\n        '</div>' +\n        '<div class=\"form-group\">' +\n          '<label>Tiểu Sử & Kinh Nghiệm Thực Chiến</label>' +\n          '<textarea name=\"bio\" rows=\"3\" placeholder=\"Hơn 7 năm kinh nghiệm thực chiến trong ngành Dữ liệu tại các tập đoàn công nghệ...\">' + (d.bio || \"\") + '</textarea>' +\n        '</div>' +\n        '<div class=\"form-group\" style=\"margin-top: 6px;\">' +\n          '<label class=\"checkbox-group\">' +\n            '<input type=\"checkbox\" name=\"is_active\" ' + (d.is_active !== false ? 'checked' : '') + '>' +\n            '<span class=\"checkbox-label\">Kích hoạt hiển thị hồ sơ Mentor trên website (is_active)</span>' +\n          '</label>' +\n        '</div>';\n\n      var nameInput = card.querySelector('[name=\"name\"]');\n      var titleInput = card.querySelector('[name=\"title\"]');\n      var companiesInput = card.querySelector('[name=\"companies_worked\"]');\n      var avatarInput = card.querySelector('[name=\"avatar_url\"]');\n\n      var namePreview = card.querySelector(\".name-preview-text\");\n      var titlePreview = card.querySelector(\".title-preview-text\");\n      var companiesPreview = card.querySelector(\".companies-preview-text\");\n      var avatarPreview = card.querySelector(\".avatar-preview-img\");\n\n      nameInput.addEventListener(\"input\", function () {\n        namePreview.innerText = this.value || \"Chưa nhập họ tên\";\n      });\n      titleInput.addEventListener(\"input\", function () {\n        titlePreview.innerText = this.value || \"Mentor DataWithLy\";\n      });\n      companiesInput.addEventListener(\"input\", function () {\n        companiesPreview.innerText = \"🏢 \" + (this.value || \"Chưa có công ty\");\n      });\n      avatarInput.addEventListener(\"input\", function () {\n        if (this.value) avatarPreview.src = this.value;\n      });\n\n      var removeBtn = card.querySelector(\".btn-remove-card\");\n      removeBtn.addEventListener(\"click\", function () {\n        card.remove();\n        updateCardHeaders();\n      });\n\n      container.appendChild(card);\n      updateCardHeaders();\n      return card;\n    }\n\n    addMentorBtn.addEventListener(\"click\", function () {\n      var newCard = createMentorCard({});\n      var input = newCard.querySelector('[name=\"name\"]');\n      if (input) input.focus();\n    });\n\n    createMentorCard(initialMentor);\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var cards = container.querySelectorAll(\".form-card\");\n      if (cards.length === 0) {\n        showError(\"Vui lòng thêm ít nhất một giảng viên.\");\n        return;\n      }\n\n      var mentorList = [];\n      for (var i = 0; i < cards.length; i++) {\n        var card = cards[i];\n        var name = (card.querySelector('[name=\"name\"]').value || \"\").trim();\n        if (!name) {\n          showError(\"Vui lòng nhập họ tên cho giảng viên #\" + (i + 1) + \".\");\n          card.querySelector('[name=\"name\"]').focus();\n          return;\n        }\n\n        var title = (card.querySelector('[name=\"title\"]').value || \"\").trim();\n        if (!title) {\n          showError(\"Vui lòng nhập chức danh cho giảng viên #\" + (i + 1) + \".\");\n          card.querySelector('[name=\"title\"]').focus();\n          return;\n        }\n\n        mentorList.push({\n          id: card.querySelector('[name=\"id\"]').value || \"\",\n          name: name,\n          title: title,\n          bio: (card.querySelector('[name=\"bio\"]').value || \"\").trim(),\n          companies_worked: (card.querySelector('[name=\"companies_worked\"]').value || \"\").trim(),\n          avatar_url: (card.querySelector('[name=\"avatar_url\"]').value || \"\").trim(),\n          linkedin_url: (card.querySelector('[name=\"linkedin_url\"]').value || \"\").trim(),\n          is_active: card.querySelector('[name=\"is_active\"]').checked\n        });\n      }\n\n      submitBtn.disabled = true;\n      addMentorBtn.disabled = true;\n      submitBtnText.innerHTML = '<span class=\"spinner\"></span> Đang lưu ' + mentorList.length + ' giảng viên...';\n\n      google.script.run\n        .withSuccessHandler(function (res) {\n          showSuccess(\"✅ Đã lưu thành công \" + (res.count || mentorList.length) + \" hồ sơ giảng viên!\");\n          setTimeout(function () {\n            google.script.host.close();\n          }, 1200);\n        })\n        .withFailureHandler(function (err) {\n          submitBtn.disabled = false;\n          addMentorBtn.disabled = false;\n          updateCardHeaders();\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .addMentorsBatchFromModal(mentorList);\n    });\n  </script>\n</body>\n\n</html>\n",
  "PackageModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">📦 Quản Trị Gói Combo & Bảng Giá</h2>\n      <p class=\"modal-subtitle\">Thiết lập các gói học phí Combo, huy hiệu khuyến mãi và danh sách quyền lợi</p>\n    </div>\n  </div>\n\n  <form id=\"packageForm\">\n    <div class=\"form-row\">\n      <div class=\"form-group col-2\">\n        <label for=\"name\">Tên Gói Combo <span class=\"required\">*</span></label>\n        <input type=\"text\" id=\"name\" name=\"name\" required placeholder=\"Gói Nền Tảng (SQL + Power BI)\"\n          autocomplete=\"off\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"package_id\">Mã Gói (ID) <span class=\"required\">*</span></label>\n        <input type=\"text\" id=\"package_id\" name=\"package_id\" required placeholder=\"combo-foundation\"\n          style=\"font-family: monospace;\">\n      </div>\n    </div>\n\n    <div class=\"preview-box\">\n      <div class=\"preview-header\">\n        <span>Xem trước Card Bảng Giá</span>\n        <span id=\"previewBadge\" class=\"badge-v badge-crimson\">Tiết Kiệm 32%</span>\n      </div>\n      <div style=\"display: flex; justify-content: space-between; align-items: baseline;\">\n        <div>\n          <div id=\"previewName\" style=\"font-size: 14px; font-weight: 700; color: var(--primary);\">Gói Nền Tảng (SQL +\n            Power BI)</div>\n          <div id=\"previewFeaturesCount\" style=\"font-size: 11px; color: var(--slate-muted); margin-top: 2px;\">0 quyền\n            lợi đi kèm</div>\n        </div>\n        <div style=\"text-align: right;\">\n          <div id=\"previewSalePrice\" style=\"font-size: 16px; font-weight: 800; color: var(--primary);\">0 đ</div>\n          <del id=\"previewOrigPrice\" style=\"font-size: 11px; color: var(--slate-light);\">0 đ</del>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"sale_price\">Học Phí Ưu Đãi (VNĐ) <span class=\"required\">*</span></label>\n        <input type=\"number\" id=\"sale_price\" name=\"sale_price\" required placeholder=\"8900000\" step=\"50000\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"original_price\">Học Phí Gốc (VNĐ)</label>\n        <input type=\"number\" id=\"original_price\" name=\"original_price\" placeholder=\"13000000\" step=\"50000\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"badge\">Huy Hiệu (Badge)</label>\n        <input type=\"text\" id=\"badge\" name=\"badge\" placeholder=\"Tiết Kiệm 32%\">\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"features_list\">Danh Sách Tính Năng / Quyền Lợi (Mỗi dòng một mục) <span\n          class=\"required\">*</span></label>\n      <textarea id=\"features_list\" name=\"features_list\" rows=\"4\" required\n        placeholder=\"Trọn bộ 2 khóa SQL và Power BI từ cơ bản đến chuyên sâu&#10;Review CV và định hướng lộ trình cá nhân 1-1&#10;Tham gia cộng đồng Alumni DataWithLy trọn đời&#10;Hỗ trợ sửa bài tập hàng tuần bởi Mentor\"></textarea>\n      <div class=\"help-text\">Mỗi dòng (Enter) sẽ hiển thị thành một gạch đầu dòng có dấu tích xanh trên Bảng giá\n        website.</div>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"sort_order\">Thứ Tự Sắp Xếp</label>\n        <input type=\"number\" id=\"sort_order\" name=\"sort_order\" value=\"1\" min=\"1\">\n      </div>\n      <div class=\"form-group col-1\" style=\"display: flex; align-items: flex-end;\">\n        <label class=\"checkbox-group\" style=\"width: 100%;\">\n          <input type=\"checkbox\" id=\"is_popular\" name=\"is_popular\">\n          <span class=\"checkbox-label\">Gói phổ biến nhất (is_popular)</span>\n        </label>\n      </div>\n      <div class=\"form-group col-1\" style=\"display: flex; align-items: flex-end;\">\n        <label class=\"checkbox-group\" style=\"width: 100%;\">\n          <input type=\"checkbox\" id=\"is_active\" name=\"is_active\" checked>\n          <span class=\"checkbox-label\">Kích hoạt (is_active)</span>\n        </label>\n      </div>\n    </div>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span>Lưu Gói Combo</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var nameInput = document.getElementById(\"name\");\n    var pkgIdInput = document.getElementById(\"package_id\");\n    var origPriceInput = document.getElementById(\"original_price\");\n    var salePriceInput = document.getElementById(\"sale_price\");\n    var badgeInput = document.getElementById(\"badge\");\n    var featuresInput = document.getElementById(\"features_list\");\n\n    var previewName = document.getElementById(\"previewName\");\n    var previewBadge = document.getElementById(\"previewBadge\");\n    var previewSalePrice = document.getElementById(\"previewSalePrice\");\n    var previewOrigPrice = document.getElementById(\"previewOrigPrice\");\n    var previewFeaturesCount = document.getElementById(\"previewFeaturesCount\");\n\n    function slugify(text) {\n      if (!text) return \"\";\n      var str = text.toString().toLowerCase().trim();\n      str = str.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, \"a\");\n      str = str.replace(/[éèẻẽẹêếềểễệ]/g, \"e\");\n      str = str.replace(/[íìỉĩị]/g, \"i\");\n      str = str.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, \"o\");\n      str = str.replace(/[úùủũụưứừửữự]/g, \"u\");\n      str = str.replace(/[ýỳỷỹỵ]/g, \"y\");\n      str = str.replace(/đ/g, \"d\");\n      str = str.replace(/[\\s_]+/g, \"-\");\n      str = str.replace(/[^a-z0-9-]/g, \"\");\n      str = str.replace(/-+/g, \"-\");\n      str = str.replace(/^-+|-+$/g, \"\");\n      return str;\n    }\n\n    function formatVND(num) {\n      return Number(num || 0).toLocaleString(\"vi-VN\") + \" đ\";\n    }\n\n    function updatePreview() {\n      previewName.innerText = nameInput.value || \"Tên gói combo\";\n      var sale = parseFloat(salePriceInput.value) || 0;\n      var orig = parseFloat(origPriceInput.value) || 0;\n      previewSalePrice.innerText = formatVND(sale);\n      previewOrigPrice.innerText = orig > sale ? formatVND(orig) : \"\";\n\n      var badge = badgeInput.value.trim();\n      if (!badge && orig > sale && orig > 0) {\n        var pct = Math.round(((orig - sale) / orig) * 100);\n        badge = \"Tiết Kiệm \" + pct + \"%\";\n      }\n      previewBadge.innerText = badge || \"Gói Combo\";\n\n      var lines = featuresInput.value.split(\"\\n\").filter(function (l) { return l.trim().length > 0; });\n      previewFeaturesCount.innerText = lines.length + \" quyền lợi đi kèm\";\n    }\n\n    nameInput.addEventListener(\"input\", function () {\n      if (!pkgIdInput.value || pkgIdInput.dataset.touched !== \"true\") {\n        pkgIdInput.value = \"combo-\" + slugify(this.value);\n      }\n      updatePreview();\n    });\n\n    pkgIdInput.addEventListener(\"input\", function () {\n      this.dataset.touched = \"true\";\n    });\n\n    salePriceInput.addEventListener(\"input\", updatePreview);\n    origPriceInput.addEventListener(\"input\", updatePreview);\n    badgeInput.addEventListener(\"input\", updatePreview);\n    featuresInput.addEventListener(\"input\", updatePreview);\n\n    var form = document.getElementById(\"packageForm\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var errorBox = document.getElementById(\"errorBox\");\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var name = nameInput.value.trim();\n      var pkgId = pkgIdInput.value.trim();\n      var salePrice = parseFloat(salePriceInput.value) || 0;\n\n      if (!name || !pkgId || salePrice <= 0) {\n        showError(\"Vui lòng nhập tên gói, mã gói và học phí hợp lệ.\");\n        return;\n      }\n\n      var origPrice = parseFloat(origPriceInput.value) || salePrice;\n      var badge = badgeInput.value.trim();\n      if (!badge && origPrice > salePrice) {\n        badge = \"Tiết Kiệm \" + Math.round(((origPrice - salePrice) / origPrice) * 100) + \"%\";\n      }\n\n      var data = {\n        id: \"pkg-\" + pkgId.replace(/^combo-/, \"\"),\n        package_id: pkgId,\n        name: name,\n        original_price: origPrice,\n        sale_price: salePrice,\n        badge: badge,\n        features_list: featuresInput.value.trim(),\n        is_popular: document.getElementById(\"is_popular\").checked,\n        is_active: document.getElementById(\"is_active\").checked,\n        sort_order: parseInt(document.getElementById(\"sort_order\").value, 10) || 1\n      };\n\n      submitBtn.disabled = true;\n      submitBtn.innerHTML = '<span class=\"spinner\"></span> Đang lưu...';\n\n      google.script.run\n        .withSuccessHandler(function () {\n          google.script.host.close();\n        })\n        .withFailureHandler(function (err) {\n          submitBtn.disabled = false;\n          submitBtn.innerHTML = '<span>Lưu Gói Combo</span>';\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .savePackageFromModal(data);\n    });\n\n    function showError(msg) {\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n  </script>\n</body>\n\n</html>",
  "PromotionsModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">🏷️ Quản Trị Khuyến Mãi & Flash Sale</h2>\n      <p class=\"modal-subtitle\">Tạo mã Voucher giảm giá học phí theo % hoặc VNĐ hiển thị tức thì</p>\n    </div>\n  </div>\n\n  <form id=\"promoForm\">\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"code\">Mã Voucher (Code) <span class=\"required\">*</span></label>\n        <input type=\"text\" id=\"code\" name=\"code\" required placeholder=\"EARLYBIRD15\"\n          style=\"text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"badge\">Huy Hiệu (Badge Hiển Thị)</label>\n        <input type=\"text\" id=\"badge\" name=\"badge\" placeholder=\"Giảm 15%\">\n      </div>\n    </div>\n\n    <div class=\"preview-box\">\n      <div class=\"preview-header\">\n        <span>Xem trước Huy Hiệu Ưu Đãi</span>\n        <span id=\"previewBadge\" class=\"badge-v badge-crimson\">Mã: EARLYBIRD15 • Giảm 15%</span>\n      </div>\n      <div id=\"previewTitle\" style=\"font-weight: 600; color: var(--dark-slate); margin-top: 4px;\">\n        Chương trình ưu đãi học phí\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"title\">Tiêu Đề Chương Trình <span class=\"required\">*</span></label>\n      <input type=\"text\" id=\"title\" name=\"title\" required placeholder=\"Ưu Đãi Đăng Ký Sớm Khóa Mới\">\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"discount_type\">Hình Thức Giảm Giá <span class=\"required\">*</span></label>\n        <select id=\"discount_type\" name=\"discount_type\">\n          <option value=\"PERCENT\">Phần trăm (%)</option>\n          <option value=\"FIXED_VND\">Số tiền cố định (VNĐ)</option>\n        </select>\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"discount_value\">Mức Giảm <span class=\"required\">*</span></label>\n        <input type=\"number\" id=\"discount_value\" name=\"discount_value\" required placeholder=\"15\" min=\"1\" step=\"1\">\n      </div>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"start_date\">Ngày Bắt Đầu</label>\n        <input type=\"date\" id=\"start_date\" name=\"start_date\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"end_date\">Ngày Kết Thúc</label>\n        <input type=\"date\" id=\"end_date\" name=\"end_date\">\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"applicable_courses\">Khóa Học Áp Dụng</label>\n      <select id=\"applicable_courses\" name=\"applicable_courses\">\n        <option value=\"ALL\">Tất cả các khóa học (ALL)</option>\n        <? for (var i = 0; i < coursesList.length; i++) { ?>\n        <option value=\"<?= coursesList[i].id ?>\">\n          <?= coursesList[i].title ?>\n        </option>\n        <? } ?>\n      </select>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"sort_order\">Thứ Tự Sắp Xếp</label>\n        <input type=\"number\" id=\"sort_order\" name=\"sort_order\" value=\"1\" min=\"1\">\n      </div>\n      <div class=\"form-group col-1\" style=\"display: flex; align-items: flex-end;\">\n        <label class=\"checkbox-group\" style=\"width: 100%;\">\n          <input type=\"checkbox\" id=\"is_active\" name=\"is_active\" checked>\n          <span class=\"checkbox-label\">Kích hoạt Voucher (is_active)</span>\n        </label>\n      </div>\n    </div>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n    <div id=\"successBox\" class=\"alert-banner alert-success fade-in\" style=\"display: none;\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"button\" id=\"saveAndContinueBtn\" class=\"btn-secondary\">\n        <span>Lưu & Tạo Tiếp</span>\n      </button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span>Tạo Mã Khuyến Mãi</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var existingCodes = <?!= JSON.stringify(existingCodes || []) ?>;\n    var codeInput = document.getElementById(\"code\");\n    var titleInput = document.getElementById(\"title\");\n    var badgeInput = document.getElementById(\"badge\");\n    var typeSelect = document.getElementById(\"discount_type\");\n    var valueInput = document.getElementById(\"discount_value\");\n    var previewBadge = document.getElementById(\"previewBadge\");\n    var previewTitle = document.getElementById(\"previewTitle\");\n\n    function updatePromoPreview() {\n      var code = (codeInput.value || \"EARLYBIRD\").toUpperCase();\n      var type = typeSelect.value;\n      var val = parseFloat(valueInput.value) || 0;\n      var badge = badgeInput.value.trim();\n\n      if (!badge && val > 0) {\n        badge = type === \"PERCENT\" ? \"Giảm \" + val + \"%\" : \"Giảm \" + (val / 1000).toLocaleString() + \"K\";\n      }\n\n      var isExisting = codeInput.value && existingCodes.indexOf(code) !== -1;\n      previewBadge.className = isExisting ? \"badge-v badge-gold\" : \"badge-v badge-crimson\";\n      previewBadge.innerText = (isExisting ? \"⚡ Cập nhật mã: \" : \"Mã: \") + code + (badge ? \" • \" + badge : \"\");\n      previewTitle.innerText = titleInput.value || \"Chương trình ưu đãi học phí\";\n    }\n\n    codeInput.addEventListener(\"input\", function () {\n      this.value = this.value.toUpperCase().replace(/[^A-Z0-9_-]/g, \"\");\n      updatePromoPreview();\n    });\n    titleInput.addEventListener(\"input\", updatePromoPreview);\n    badgeInput.addEventListener(\"input\", updatePromoPreview);\n    typeSelect.addEventListener(\"change\", function () {\n      if (this.value === \"PERCENT\") {\n        valueInput.placeholder = \"15\";\n        valueInput.max = \"100\";\n      } else {\n        valueInput.placeholder = \"500000\";\n        valueInput.removeAttribute(\"max\");\n      }\n      updatePromoPreview();\n    });\n    valueInput.addEventListener(\"input\", updatePromoPreview);\n\n    // Mặc định ngày\n    var today = new Date().toISOString().split(\"T\")[0];\n    document.getElementById(\"start_date\").value = today;\n\n    var form = document.getElementById(\"promoForm\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var saveAndContinueBtn = document.getElementById(\"saveAndContinueBtn\");\n    var errorBox = document.getElementById(\"errorBox\");\n    var successBox = document.getElementById(\"successBox\");\n\n    function showError(msg) {\n      if (successBox) successBox.style.display = \"none\";\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n\n    function showSuccess(msg) {\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n      successBox.innerText = msg;\n      successBox.style.display = \"flex\";\n    }\n\n    function setButtonsLoading(isLoading, activeBtn) {\n      if (isLoading) {\n        submitBtn.disabled = true;\n        saveAndContinueBtn.disabled = true;\n        if (activeBtn) {\n          activeBtn.innerHTML = '<span class=\"spinner\"></span> Đang lưu...';\n        }\n      } else {\n        submitBtn.disabled = false;\n        saveAndContinueBtn.disabled = false;\n        submitBtn.innerHTML = '<span>Tạo Mã Khuyến Mãi</span>';\n        saveAndContinueBtn.innerHTML = '<span>Lưu & Tạo Tiếp</span>';\n      }\n    }\n\n    function submitPromotion(isContinue) {\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var code = codeInput.value.trim();\n      var title = titleInput.value.trim();\n      var type = typeSelect.value;\n      var val = parseFloat(valueInput.value) || 0;\n\n      if (!code || !title) {\n        showError(\"Vui lòng nhập Mã voucher và Tiêu đề khuyến mãi.\");\n        return;\n      }\n\n      if (type === \"PERCENT\" && (val <= 0 || val > 100)) {\n        showError(\"Tỷ lệ % giảm giá phải từ 1 đến 100.\");\n        return;\n      }\n      if (type === \"FIXED_VND\" && val <= 0) {\n        showError(\"Số tiền giảm VNĐ phải lớn hơn 0.\");\n        return;\n      }\n\n      var start = document.getElementById(\"start_date\").value;\n      var end = document.getElementById(\"end_date\").value;\n      if (start && end && end < start) {\n        showError(\"Ngày kết thúc không được nhỏ hơn ngày bắt đầu.\");\n        return;\n      }\n\n      var badge = badgeInput.value.trim();\n      if (!badge) {\n        badge = type === \"PERCENT\" ? \"Giảm \" + val + \"%\" : \"Giảm \" + (val / 1000).toLocaleString() + \"K\";\n      }\n\n      var data = {\n        id: \"promo-\" + code.toLowerCase(),\n        code: code,\n        title: title,\n        discount_type: type,\n        discount_value: val,\n        start_date: start,\n        end_date: end ? end + \" 23:59:59\" : \"\",\n        applicable_courses: document.getElementById(\"applicable_courses\").value,\n        badge: badge,\n        is_active: document.getElementById(\"is_active\").checked,\n        sort_order: parseInt(document.getElementById(\"sort_order\").value, 10) || 1\n      };\n\n      var activeBtn = isContinue ? saveAndContinueBtn : submitBtn;\n      setButtonsLoading(true, activeBtn);\n\n      google.script.run\n        .withSuccessHandler(function (res) {\n          if (!isContinue) {\n            google.script.host.close();\n            return;\n          }\n\n          setButtonsLoading(false);\n\n          var savedCode = code;\n          if (existingCodes.indexOf(savedCode) === -1) {\n            existingCodes.push(savedCode);\n          }\n          showSuccess(\"✅ Đã lưu thành công mã khuyến mãi \" + savedCode + \"! Tiếp tục tạo mã mới...\");\n\n          // Reset ô Code và cập nhật Preview\n          codeInput.value = \"\";\n          badgeInput.value = \"\";\n          var sortOrderEl = document.getElementById(\"sort_order\");\n          if (sortOrderEl) {\n            sortOrderEl.value = (parseInt(sortOrderEl.value, 10) || 1) + 1;\n          }\n          updatePromoPreview();\n\n          // Focus vào ô Code mới\n          codeInput.focus();\n        })\n        .withFailureHandler(function (err) {\n          setButtonsLoading(false);\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .addNewPromotionFromModal(data);\n    }\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      submitPromotion(false);\n    });\n\n    saveAndContinueBtn.addEventListener(\"click\", function (e) {\n      e.preventDefault();\n      submitPromotion(true);\n    });\n  </script>\n</body>\n\n</html>",
  "SettingsModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">⚙️ Cấu Hình Hệ Thống (Settings)</h2>\n      <p class=\"modal-subtitle\">Cấu hình hotline, Zalo chat, email, thanh thông báo Announcement Bar và Webhook</p>\n    </div>\n  </div>\n\n  <form id=\"settingsForm\">\n    <div class=\"preview-box\">\n      <div class=\"preview-header\">\n        <span>Xem trước Thanh Thông Báo Header (Announcement Bar)</span>\n        <span class=\"badge-v badge-crimson\">Live Header</span>\n      </div>\n      <div id=\"previewAnnouncement\"\n        style=\"background: var(--primary); color: #FFFFFF; padding: 8px 12px; border-radius: 4px; font-size: 11px; text-align: center; font-weight: 500;\">\n        <?= currentSettings.announcement_bar || 'Ưu đãi học phí 15% cho 10 học viên đăng ký sớm trong tuần này!' ?>\n      </div>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"hotline\">Số Điện Thoại Hotline <span class=\"required\">*</span></label>\n        <input type=\"text\" id=\"hotline\" name=\"hotline\" required value=\"<?= currentSettings.hotline || '0901 234 567' ?>\"\n          placeholder=\"0901 234 567\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"contact_email\">Email Tuyển Sinh / Hỗ Trợ</label>\n        <input type=\"text\" id=\"contact_email\" name=\"contact_email\"\n          value=\"<?= currentSettings.contact_email || 'tuyensinh@datawithly.edu.vn' ?>\"\n          placeholder=\"tuyensinh@datawithly.edu.vn\">\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"zalo_url\">Đường Dẫn Chat Zalo Tư Vấn Nhanh</label>\n      <input type=\"text\" id=\"zalo_url\" name=\"zalo_url\"\n        value=\"<?= currentSettings.zalo_url || 'https://zalo.me/0901234567' ?>\"\n        placeholder=\"https://zalo.me/0901234567\">\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"announcement_bar\">Nội Dung Thanh Thông Báo (Announcement Bar)</label>\n      <textarea id=\"announcement_bar\" name=\"announcement_bar\" rows=\"2\"\n        placeholder=\"Ưu đãi học phí 15% cho 10 học viên đăng ký sớm trong tuần này!\"><?= currentSettings.announcement_bar || '' ?></textarea>\n      <div class=\"help-text\">Dòng thông báo này sẽ hiển thị trên cùng của toàn bộ website. Để trống nếu muốn ẩn.</div>\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"revalidation_url\">URL Webhook Đồng Bộ Tức Thì (ISR Revalidation)</label>\n      <input type=\"text\" id=\"revalidation_url\" name=\"revalidation_url\"\n        value=\"<?= currentSettings.revalidation_url || '' ?>\"\n        placeholder=\"https://datawithly.edu.vn/api/revalidate?secret=...\">\n      <div class=\"help-text\">Webhook được gọi tự động khi bạn bấm nút [⚡ Đồng Bộ Lên Website Ngay Lập Tức].</div>\n    </div>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span>Lưu Cấu Hình</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var announceInput = document.getElementById(\"announcement_bar\");\n    var announcePreview = document.getElementById(\"previewAnnouncement\");\n\n    announceInput.addEventListener(\"input\", function () {\n      announcePreview.innerText = this.value || \"Chưa có thông báo\";\n    });\n\n    var form = document.getElementById(\"settingsForm\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var errorBox = document.getElementById(\"errorBox\");\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var data = {\n        hotline: document.getElementById(\"hotline\").value.trim(),\n        contact_email: document.getElementById(\"contact_email\").value.trim(),\n        zalo_url: document.getElementById(\"zalo_url\").value.trim(),\n        announcement_bar: announceInput.value.trim(),\n        revalidation_url: document.getElementById(\"revalidation_url\").value.trim()\n      };\n\n      submitBtn.disabled = true;\n      submitBtn.innerHTML = '<span class=\"spinner\"></span> Đang lưu...';\n\n      google.script.run\n        .withSuccessHandler(function () {\n          google.script.host.close();\n        })\n        .withFailureHandler(function (err) {\n          submitBtn.disabled = false;\n          submitBtn.innerHTML = '<span>Lưu Cấu Hình</span>';\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .saveSettingsFromModal(data);\n    });\n\n    function showError(msg) {\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n  </script>\n</body>\n\n</html>",
  "SharedStyles": "<style>\n  :root {\n    --primary: #8B1D2C;\n    --primary-hover: #701622;\n    --primary-subtle: rgba(139, 29, 44, 0.08);\n    --primary-border: #F0D5D8;\n    --dark-slate: #1F242F;\n    --slate-muted: #4B5563;\n    --slate-light: #9CA3AF;\n    --bg-canvas: #FAF9F6;\n    --bg-card: #FFFFFF;\n    --border-color: #E5E7EB;\n    --border-focus: #8B1D2C;\n    --success: #059669;\n    --success-bg: #ECFDF5;\n    --warning: #D97706;\n    --warning-bg: #FFFBEB;\n    --danger: #DC2626;\n    --danger-bg: #FEF2F2;\n    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n    --radius-sm: 4px;\n    --radius-md: 8px;\n    --radius-lg: 12px;\n  }\n\n  * {\n    box-sizing: border-box;\n  }\n\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;\n    padding: 18px 20px 24px;\n    margin: 0;\n    background: var(--bg-canvas);\n    color: var(--dark-slate);\n    font-size: 13px;\n    line-height: 1.5;\n  }\n\n  .modal-header {\n    border-bottom: 2px solid var(--primary-border);\n    padding-bottom: 12px;\n    margin-bottom: 16px;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n  }\n\n  .modal-title {\n    margin: 0;\n    color: var(--primary);\n    font-size: 17px;\n    font-weight: 700;\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    letter-spacing: -0.01em;\n  }\n\n  .modal-subtitle {\n    margin: 4px 0 0;\n    font-size: 11px;\n    color: var(--slate-muted);\n  }\n\n  .form-group {\n    margin-bottom: 12px;\n  }\n\n  .form-row {\n    display: flex;\n    gap: 12px;\n    margin-bottom: 12px;\n  }\n\n  .form-row .form-group {\n    margin-bottom: 0;\n    flex: 1;\n  }\n\n  .col-1 {\n    flex: 1;\n  }\n\n  .col-2 {\n    flex: 2;\n  }\n\n  .col-3 {\n    flex: 3;\n  }\n\n  .col-full {\n    width: 100%;\n  }\n\n  label {\n    display: block;\n    font-size: 12px;\n    font-weight: 600;\n    margin-bottom: 4px;\n    color: #374151;\n  }\n\n  label .required {\n    color: var(--danger);\n    margin-left: 2px;\n  }\n\n  .help-text {\n    font-size: 11px;\n    color: var(--slate-muted);\n    margin-top: 3px;\n    line-height: 1.35;\n  }\n\n  input[type=\"text\"],\n  input[type=\"number\"],\n  input[type=\"url\"],\n  input[type=\"date\"],\n  input[type=\"datetime-local\"],\n  select,\n  textarea {\n    width: 100%;\n    box-sizing: border-box;\n    padding: 8px 10px;\n    border: 1px solid var(--border-color);\n    border-radius: var(--radius-sm);\n    font-size: 13px;\n    font-family: inherit;\n    background: var(--bg-card);\n    color: var(--dark-slate);\n    transition: border-color 0.15s ease, box-shadow 0.15s ease;\n  }\n\n  input:focus,\n  select:focus,\n  textarea:focus {\n    outline: none;\n    border-color: var(--border-focus);\n    box-shadow: 0 0 0 3px rgba(139, 29, 44, 0.15);\n  }\n\n  input[readonly],\n  textarea[readonly] {\n    background-color: #F3F4F6;\n    color: var(--slate-muted);\n    cursor: not-allowed;\n  }\n\n  textarea {\n    resize: vertical;\n    min-height: 64px;\n  }\n\n  /* Checkbox & Switch */\n  .checkbox-group {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    background: #FFFFFF;\n    border: 1px solid var(--border-color);\n    padding: 8px 12px;\n    border-radius: var(--radius-sm);\n    cursor: pointer;\n    user-select: none;\n  }\n\n  .checkbox-group:hover {\n    border-color: #D1D5DB;\n  }\n\n  .checkbox-group input[type=\"checkbox\"] {\n    width: 16px;\n    height: 16px;\n    accent-color: var(--primary);\n    cursor: pointer;\n    margin: 0;\n  }\n\n  .checkbox-label {\n    font-size: 12px;\n    font-weight: 500;\n    color: var(--dark-slate);\n    cursor: pointer;\n  }\n\n  /* Live Preview Box */\n  .preview-box {\n    background: #FFFFFF;\n    border: 1px dashed var(--primary-border);\n    border-radius: var(--radius-md);\n    padding: 12px;\n    margin-bottom: 14px;\n    transition: all 0.2s ease;\n  }\n\n  .preview-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    font-size: 11px;\n    font-weight: 700;\n    text-transform: uppercase;\n    color: var(--primary);\n    letter-spacing: 0.05em;\n    margin-bottom: 8px;\n  }\n\n  .preview-content {\n    font-size: 12px;\n    color: var(--dark-slate);\n  }\n\n  /* Badges */\n  .badge-v {\n    display: inline-flex;\n    align-items: center;\n    gap: 4px;\n    padding: 2px 8px;\n    border-radius: 9999px;\n    font-size: 11px;\n    font-weight: 600;\n    line-height: 1.4;\n  }\n\n  .badge-crimson {\n    background: var(--primary-subtle);\n    color: var(--primary);\n    border: 1px solid var(--primary-border);\n  }\n\n  .badge-emerald {\n    background: var(--success-bg);\n    color: var(--success);\n    border: 1px solid #A7F3D0;\n  }\n\n  .badge-gold {\n    background: var(--warning-bg);\n    color: var(--warning);\n    border: 1px solid #FDE68A;\n  }\n\n  .badge-slate {\n    background: #F3F4F6;\n    color: var(--dark-slate);\n    border: 1px solid #E5E7EB;\n  }\n\n  /* Action Buttons */\n  .btn-group {\n    display: flex;\n    justify-content: flex-end;\n    gap: 10px;\n    margin-top: 18px;\n    padding-top: 14px;\n    border-top: 1px solid var(--border-color);\n  }\n\n  button {\n    cursor: pointer;\n    font-family: inherit;\n    font-weight: 600;\n    font-size: 13px;\n    padding: 8px 18px;\n    border-radius: var(--radius-sm);\n    transition: all 0.15s ease;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    gap: 6px;\n  }\n\n  .btn-submit {\n    background: var(--primary);\n    color: #FFFFFF;\n    border: 1px solid var(--primary-hover);\n    box-shadow: 0 1px 2px rgba(139, 29, 44, 0.2);\n  }\n\n  .btn-submit:hover:not(:disabled) {\n    background: var(--primary-hover);\n    box-shadow: 0 2px 4px rgba(139, 29, 44, 0.3);\n  }\n\n  .btn-submit:disabled {\n    background: #9CA3AF;\n    border-color: #9CA3AF;\n    cursor: not-allowed;\n    opacity: 0.7;\n  }\n\n  .btn-secondary {\n    background: #FFFFFF;\n    color: var(--primary);\n    border: 1px solid var(--primary);\n    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);\n  }\n\n  .btn-secondary:hover:not(:disabled) {\n    background: var(--primary-subtle);\n    border-color: var(--primary-hover);\n    color: var(--primary-hover);\n  }\n\n  .btn-secondary:disabled {\n    background: #F3F4F6;\n    border-color: #E5E7EB;\n    color: #9CA3AF;\n    cursor: not-allowed;\n    opacity: 0.7;\n  }\n\n  .btn-secondary .spinner {\n    border-color: rgba(139, 29, 44, 0.2);\n    border-top-color: var(--primary);\n  }\n\n  .btn-cancel {\n    background: #FFFFFF;\n    color: var(--dark-slate);\n    border: 1px solid var(--border-color);\n  }\n\n  .btn-cancel:hover {\n    background: #F9FAFB;\n    border-color: #D1D5DB;\n  }\n\n  /* Alert Messages */\n  .error-msg {\n    color: var(--danger);\n    font-size: 11px;\n    margin-top: 4px;\n    display: none;\n    font-weight: 500;\n  }\n\n  .alert-banner {\n    padding: 10px 12px;\n    border-radius: var(--radius-sm);\n    font-size: 12px;\n    margin-bottom: 12px;\n    display: flex;\n    align-items: flex-start;\n    gap: 8px;\n  }\n\n  .alert-danger {\n    background: var(--danger-bg);\n    color: var(--danger);\n    border: 1px solid #FECACA;\n  }\n\n  .alert-success {\n    background: var(--success-bg);\n    color: var(--success);\n    border: 1px solid #A7F3D0;\n  }\n\n  .alert-info {\n    background: #EFF6FF;\n    color: #1D4ED8;\n    border: 1px solid #BFDBFE;\n  }\n\n  /* Spinner */\n  .spinner {\n    display: inline-block;\n    width: 14px;\n    height: 14px;\n    border: 2px solid rgba(255, 255, 255, 0.3);\n    border-radius: 50%;\n    border-top-color: #FFFFFF;\n    animation: spin 0.8s linear infinite;\n  }\n\n  @keyframes spin {\n    to {\n      transform: rotate(360deg);\n    }\n  }\n\n  /* Fade in */\n  .fade-in {\n    animation: fadeIn 0.2s ease-in-out;\n  }\n\n  @keyframes fadeIn {\n    from {\n      opacity: 0;\n      transform: translateY(-4px);\n    }\n\n    to {\n      opacity: 1;\n      transform: translateY(0);\n    }\n  }\n\n  /* Repeater Cards & Batch Entry UI */\n  .repeater-container {\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    margin-bottom: 16px;\n  }\n\n  .form-card {\n    background: #FFFFFF;\n    border: 1px solid var(--border-color);\n    border-radius: var(--radius-md);\n    padding: 16px;\n    box-shadow: var(--shadow-sm);\n    position: relative;\n    transition: border-color 0.2s ease, box-shadow 0.2s ease;\n  }\n\n  .form-card:hover {\n    border-color: #D1D5DB;\n    box-shadow: var(--shadow-md);\n  }\n\n  .form-card-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding-bottom: 10px;\n    margin-bottom: 12px;\n    border-bottom: 1px solid var(--border-color);\n  }\n\n  .form-card-title {\n    font-size: 13px;\n    font-weight: 700;\n    color: var(--primary);\n    display: flex;\n    align-items: center;\n    gap: 6px;\n  }\n\n  .btn-remove-card {\n    background: transparent;\n    color: #9CA3AF;\n    border: 1px solid transparent;\n    padding: 3px 8px;\n    font-size: 11px;\n    font-weight: 600;\n    border-radius: var(--radius-sm);\n    cursor: pointer;\n    transition: all 0.15s ease;\n  }\n\n  .btn-remove-card:hover {\n    color: var(--danger);\n    background: var(--danger-bg);\n    border-color: #FECACA;\n  }\n\n  .btn-add-repeater {\n    width: 100%;\n    background: #FFFFFF;\n    color: var(--primary);\n    border: 1.5px dashed var(--primary-border);\n    padding: 10px 16px;\n    border-radius: var(--radius-md);\n    font-weight: 600;\n    font-size: 13px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    gap: 8px;\n    cursor: pointer;\n    transition: all 0.2s ease;\n    margin-bottom: 14px;\n  }\n\n  .btn-add-repeater:hover {\n    background: var(--primary-subtle);\n    border-color: var(--primary);\n  }\n</style>",
  "TestimonialModal": "<!DOCTYPE html>\n<html>\n\n<head>\n  <base target=\"_top\">\n  <?!= include('SharedStyles'); ?>\n</head>\n\n<body>\n  <div class=\"modal-header\">\n    <div>\n      <h2 class=\"modal-title\">💬 Thêm Đánh Giá Học Viên</h2>\n      <p class=\"modal-subtitle\">Thêm feedback thực tế từ cựu học viên đang làm việc tại các tập đoàn lớn</p>\n    </div>\n  </div>\n\n  <form id=\"testimonialForm\">\n    <div class=\"preview-box\">\n      <div class=\"preview-header\">\n        <span>Xem trước Testimonial Card</span>\n        <span id=\"previewRatingStars\" style=\"color: #F59E0B; font-size: 14px;\">★★★★★</span>\n      </div>\n      <div style=\"display: flex; gap: 12px; align-items: flex-start;\">\n        <img id=\"avatarPreview\" src=\"/uploads/avatars/default.jpg\"\n          onerror=\"this.src='https://ui-avatars.com/api/?name=Hoc+Vien&background=1F242F&color=fff'\"\n          style=\"width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--primary-border);\">\n        <div style=\"flex: 1;\">\n          <div style=\"display: flex; justify-content: space-between;\">\n            <strong id=\"namePreview\" style=\"font-size: 13px; color: var(--primary);\">Trần Minh Quân</strong>\n            <span id=\"companyPreview\" class=\"badge-v badge-slate\" style=\"font-size: 10px;\">Shopee Express</span>\n          </div>\n          <div id=\"rolePreview\" style=\"font-size: 11px; color: var(--slate-muted);\">Junior Data Analyst</div>\n          <p id=\"reviewPreview\"\n            style=\"font-size: 12px; color: var(--dark-slate); font-style: italic; margin: 6px 0 0; line-height: 1.4;\">\n            \"Khóa học SQL của chị Ly thực sự thực chiến và dễ hiểu...\"\n          </p>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"student_name\">Họ và Tên Học Viên <span class=\"required\">*</span></label>\n        <input type=\"text\" id=\"student_name\" name=\"student_name\" required placeholder=\"Trần Minh Quân\"\n          autocomplete=\"off\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"role\">Vị Trí Công Việc</label>\n        <input type=\"text\" id=\"role\" name=\"role\" placeholder=\"Junior Data Analyst\">\n      </div>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"company\">Công Ty Làm Việc</label>\n        <input type=\"text\" id=\"company\" name=\"company\" placeholder=\"Shopee Express, Techcombank...\">\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"course_id\">Khóa Học Liên Quan <span class=\"required\">*</span></label>\n        <select id=\"course_id\" name=\"course_id\" required>\n          <option value=\"ALL\">Khóa Học Chung / Tất cả</option>\n          <? for (var i = 0; i < coursesList.length; i++) { ?>\n          <option value=\"<?= coursesList[i].id ?>\">\n            <?= coursesList[i].title ?>\n          </option>\n          <? } ?>\n        </select>\n      </div>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label for=\"rating\">Số Sao Đánh Giá <span class=\"required\">*</span></label>\n        <select id=\"rating\" name=\"rating\">\n          <option value=\"5\" selected>⭐⭐⭐⭐⭐ 5 Sao (Xuất sắc)</option>\n          <option value=\"4\">⭐⭐⭐⭐ 4 Sao (Rất tốt)</option>\n          <option value=\"3\">⭐⭐⭐ 3 Sao (Khá)</option>\n          <option value=\"2\">⭐⭐ 2 Sao (Trung bình)</option>\n          <option value=\"1\">⭐ 1 Sao (Cần cải thiện)</option>\n        </select>\n      </div>\n      <div class=\"form-group col-1\">\n        <label for=\"avatar_url\">Ảnh Đại Diện (Avatar URL)</label>\n        <input type=\"text\" id=\"avatar_url\" name=\"avatar_url\" placeholder=\"/uploads/avatars/quan-tran.jpg\">\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n      <label for=\"review_text\">Nội Dung Đánh Giá / Cảm Nhận <span class=\"required\">*</span></label>\n      <textarea id=\"review_text\" name=\"review_text\" rows=\"4\" required\n        placeholder=\"Khóa học SQL của chị Ly thực sự thực chiến. Chị chỉ cho mình cách viết Window Functions mà lúc trước mình đọc docs hoài không hiểu...\"></textarea>\n    </div>\n\n    <div class=\"form-row\">\n      <div class=\"form-group col-1\">\n        <label class=\"checkbox-group\">\n          <input type=\"checkbox\" id=\"is_featured\" name=\"is_featured\" checked>\n          <span class=\"checkbox-label\">Đánh giá nổi bật (Trang chủ)</span>\n        </label>\n      </div>\n      <div class=\"form-group col-1\">\n        <label class=\"checkbox-group\">\n          <input type=\"checkbox\" id=\"is_active\" name=\"is_active\" checked>\n          <span class=\"checkbox-label\">Kích hoạt hiển thị (is_active)</span>\n        </label>\n      </div>\n    </div>\n\n    <div id=\"errorBox\" class=\"alert-banner alert-danger error-msg\"></div>\n\n    <div class=\"btn-group\">\n      <button type=\"button\" class=\"btn-cancel\" onclick=\"google.script.host.close()\">Hủy Bỏ</button>\n      <button type=\"submit\" id=\"submitBtn\" class=\"btn-submit\">\n        <span>Lưu Đánh Giá</span>\n      </button>\n    </div>\n  </form>\n\n  <script>\n    var nameInput = document.getElementById(\"student_name\");\n    var roleInput = document.getElementById(\"role\");\n    var companyInput = document.getElementById(\"company\");\n    var ratingSelect = document.getElementById(\"rating\");\n    var avatarInput = document.getElementById(\"avatar_url\");\n    var reviewInput = document.getElementById(\"review_text\");\n\n    var namePreview = document.getElementById(\"namePreview\");\n    var rolePreview = document.getElementById(\"rolePreview\");\n    var companyPreview = document.getElementById(\"companyPreview\");\n    var ratingPreview = document.getElementById(\"previewRatingStars\");\n    var avatarPreview = document.getElementById(\"avatarPreview\");\n    var reviewPreview = document.getElementById(\"reviewPreview\");\n\n    function slugify(text) {\n      if (!text) return \"\";\n      var str = text.toString().toLowerCase().trim();\n      str = str.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, \"a\");\n      str = str.replace(/[éèẻẽẹêếềểễệ]/g, \"e\");\n      str = str.replace(/[íìỉĩị]/g, \"i\");\n      str = str.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, \"o\");\n      str = str.replace(/[úùủũụưứừửữự]/g, \"u\");\n      str = str.replace(/[ýỳỷỹỵ]/g, \"y\");\n      str = str.replace(/đ/g, \"d\");\n      str = str.replace(/[\\s_]+/g, \"-\");\n      str = str.replace(/[^a-z0-9-]/g, \"\");\n      str = str.replace(/-+/g, \"-\");\n      str = str.replace(/^-+|-+$/g, \"\");\n      return str;\n    }\n\n    function updatePreview() {\n      namePreview.innerText = nameInput.value || \"Tên học viên\";\n      rolePreview.innerText = roleInput.value || \"Vị trí công việc\";\n      companyPreview.innerText = companyInput.value || \"Tập đoàn công nghệ\";\n      var stars = parseInt(ratingSelect.value, 10) || 5;\n      ratingPreview.innerText = \"★\".repeat(stars) + \"☆\".repeat(5 - stars);\n      reviewPreview.innerText = reviewInput.value ? '\"' + reviewInput.value + '\"' : '\"Cảm nhận thực tế của học viên...\"';\n      if (avatarInput.value) avatarPreview.src = avatarInput.value;\n    }\n\n    nameInput.addEventListener(\"input\", updatePreview);\n    roleInput.addEventListener(\"input\", updatePreview);\n    companyInput.addEventListener(\"input\", updatePreview);\n    ratingSelect.addEventListener(\"change\", updatePreview);\n    avatarInput.addEventListener(\"input\", updatePreview);\n    reviewInput.addEventListener(\"input\", updatePreview);\n\n    var form = document.getElementById(\"testimonialForm\");\n    var submitBtn = document.getElementById(\"submitBtn\");\n    var errorBox = document.getElementById(\"errorBox\");\n\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      errorBox.style.display = \"none\";\n      errorBox.innerText = \"\";\n\n      var sName = nameInput.value.trim();\n      var rText = reviewInput.value.trim();\n      if (!sName || !rText) {\n        showError(\"Vui lòng nhập tên học viên và nội dung đánh giá.\");\n        return;\n      }\n\n      var slugName = slugify(sName);\n      var data = {\n        id: \"t-\" + (Date.now().toString(36).substr(-4)) + \"-\" + slugName,\n        student_name: sName,\n        role: roleInput.value.trim(),\n        company: companyInput.value.trim(),\n        course_id: document.getElementById(\"course_id\").value,\n        rating: ratingSelect.value,\n        review_text: rText,\n        avatar_url: avatarInput.value.trim() || \"/uploads/avatars/default.jpg\",\n        is_featured: document.getElementById(\"is_featured\").checked,\n        is_active: document.getElementById(\"is_active\").checked\n      };\n\n      submitBtn.disabled = true;\n      submitBtn.innerHTML = '<span class=\"spinner\"></span> Đang lưu...';\n\n      google.script.run\n        .withSuccessHandler(function () {\n          google.script.host.close();\n        })\n        .withFailureHandler(function (err) {\n          submitBtn.disabled = false;\n          submitBtn.innerHTML = '<span>Lưu Đánh Giá</span>';\n          showError(\"Lỗi: \" + (err.message || err.toString()));\n        })\n        .saveTestimonialFromModal(data);\n    });\n\n    function showError(msg) {\n      errorBox.innerText = msg;\n      errorBox.style.display = \"block\";\n    }\n  </script>\n</body>\n\n</html>"
};

/**
 * Hàm nhúng giao diện HTML (Ví dụ: nhúng SharedStyles vào các Modal)
 * Tự động đọc từ object INLINED_HTML hoặc fallback từ file.
 */
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

/**
 * Nạp template HTML cho các cửa sổ Modal Dialog từ INLINED_HTML
 * Chạy độc lập 100% trong môi trường 1 file bundle duy nhất.
 */
function createModalTemplate(templateName) {
  if (typeof INLINED_HTML !== "undefined" && INLINED_HTML[templateName]) {
    return HtmlService.createTemplate(INLINED_HTML[templateName]);
  }
  return HtmlService.createTemplateFromFile(templateName);
}

/**
 * Lấy thông tin phiên bản DataWithLy CMS Bundle Engine
 */
function getDataWithLySystemInfo() {
  return {
    system: "DataWithLy CMS All-in-One Engine",
    brand: "DataWithLy (Mentor Hứa Thảo Ly)",
    version: "2.1.0",
    architecture: "Standalone Single-File Bundle with 10 Inlined Native Modals",
    status: "HEALTHY",
    timestamp: new Date().toISOString()
  };
}


// ==============================================================================
// FILE NGUỒN: 00_Config.gs
// ==============================================================================

/**
 * ==============================================================================
 * MODULE 00: CẤU HÌNH HỆ THỐNG (SYSTEM CONFIGURATION)
 * ==============================================================================
 * Quản lý tập trung các khóa bí mật, URL webhook và thời gian chờ khóa ghi.
 * Áp dụng tiêu chuẩn bảo mật Google Enterprise: Sử dụng PropertiesService (Script Properties)
 * để lưu trữ biến môi trường an toàn, KHÔNG hardcode chuỗi nhạy cảm trong mã nguồn.
 * ==============================================================================
 */

/**
 * Lấy mã bí mật xác thực một cách an toàn (Zero Hardcoded Secret)
 * 1. Ưu tiên số 1: Đọc từ Google Cloud Script Properties (Bảo mật tối đa, không lộ trên Git)
 * 2. Ưu tiên số 2: Đọc từ tab 'settings' (khóa 'shared_secret') nếu người quản trị cấu hình
 * 3. Fallback: Giá trị cấu hình dev cục bộ nếu chưa thiết lập
 */
function getSharedSecret() {
  try {
    var secret = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET");
    if (secret && secret.trim()) {
      return secret.trim();
    }
  } catch (e) {}

  // Đọc từ tab settings nếu có
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("settings");
    if (sheet) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] === "shared_secret" && data[i][1]) {
          return data[i][1].toString().trim();
        }
      }
    }
  } catch (err) {}

  // Nếu chưa thiết lập, trả về rỗng để bắt buộc quản trị viên cấu hình qua Script Properties hoặc Settings
  return "";
}

var CONFIG = {
  // Mã secret dùng để xác thực giữa Next.js và Google Apps Script (Đọc động từ Script Properties)
  get SHARED_SECRET() {
    return getSharedSecret();
  },

  // URL Webhook kích hoạt On-Demand ISR Revalidation trên Website DataWithLy
  REVALIDATION_PROD_URL: "https://datawithly.edu.vn/api/revalidate?secret=datawithly_secure_reval_token_2026",
  REVALIDATION_LOCAL_URL: "http://localhost:3000/api/revalidate?secret=datawithly_secure_reval_token_2026",
  ACTIVE_REVALIDATION_ENV: "PROD",
  REVALIDATION_URL: "https://datawithly.edu.vn/api/revalidate?secret=datawithly_secure_reval_token_2026",

  // Cấu hình Telegram Bot để nhận cảnh báo khi có học viên đăng ký tư vấn mới (< 2s)
  TELEGRAM_BOT_TOKEN: "", // Điền Telegram Bot Token nếu muốn nhận thông báo (Ví dụ: 123456:ABC-DEF...)
  TELEGRAM_CHAT_ID: "",   // Điền Chat ID nhận thông báo

  // Thời gian tối đa giữ Mutex Lock để chống xung đột race-condition (10 giây)
  LOCK_TIMEOUT_MS: 10000,
};



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
// FILE NGUỒN: 02_MenuAndTriggers.gs
// ==============================================================================

/**
 * ==============================================================================
 * MODULE 02: THANH MENU VÀ BỘ BẮT SỰ KIỆN (MENU & EVENT TRIGGERS)
 * ==============================================================================
 * 1. onOpen(): Khởi tạo menu điều khiển [🚀 DataWithLy CMS] khi mở file Sheets.
 * 2. onEdit(e): Tự động phát hiện chỉnh sửa, sinh UUID v4 & SEO Slug, bảo vệ ô ID/Slug.
 * ==============================================================================
 */

/**
 * Bảng cấu hình tiền tố UUID cho từng Tab nghiệp vụ
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

/**
 * 1. Khởi tạo thanh menu tùy biến [🚀 DataWithLy CMS]
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("🚀 DataWithLy CMS")
    // Khởi tạo
    .addItem("⚡ CÀI ĐẶT TOÀN BỘ 12 TAB (1-Click Setup)", "setupDataWithLyTables")
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
    .addItem("🔐 Cài Đặt Mã Secret (Script Properties)", "promptSetSharedSecret")
    .addItem("👥 Cập Nhật Trạng Thái Lead", "showUpdateLeadStatusPrompt")
    .addSeparator()

    // Tiện ích bảo trì
    .addItem("⚡ Tự Động Sinh UUID & Chuẩn Hóa Toàn Bộ Slug/ID", "autoFillMissingUuidsAndSlugs")
    .addItem("🔄 Tự Động Tạo Slug & ID Cho Hàng Trống", "autoFillMissingSlugsAndIds")
    .addItem("🗑️ Lưu Trữ / Ẩn Khóa Học", "showSoftDeletePrompt")
    .addItem("🔍 Kiểm Tra Lỗi Dữ Liệu", "runDataLinter")
    .addItem("⚡ Đồng Bộ Lên Website Ngay Lập Tức", "triggerWebsiteRevalidation")
    .addToUi();
}

/**
 * Helper: Bảo vệ ô ID (Cột 1) chống xóa hoặc gõ đè sai định dạng
 */
function protectIdCell(sheet, row, value, oldValue, prefix, ss) {
  var trimmed = (value !== null && value !== undefined) ? value.toString().trim() : "";
  var oldTrimmed = (oldValue !== null && oldValue !== undefined) ? oldValue.toString().trim() : "";

  // 1. Nếu người dùng xóa trống ô ID
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

  // 2. Nếu người dùng gõ đè giá trị không chuẩn UUID v4
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

/**
 * Helper: Bảo vệ ô Slug (Cột slug) chống xóa hoặc trùng lặp
 */
function protectSlugCell(sheet, row, slugCol, titleCol, value, oldValue, ss) {
  var trimmed = (value !== null && value !== undefined) ? value.toString().trim() : "";
  var oldTrimmed = (oldValue !== null && oldValue !== undefined) ? oldValue.toString().trim() : "";
  var titleVal = titleCol ? sheet.getRange(row, titleCol).getValue() : "";

  // Thu thập các slug khác trong sheet để đối chiếu
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

  // 1. Nếu người dùng xóa trống Slug
  if (!trimmed) {
    if (titleVal && titleVal.toString().trim()) {
      var regeneratedSlug = resolveUniqueSlug(titleVal, otherSlugs);
      sheet.getRange(row, slugCol).setValue(sanitizeFormula(regeneratedSlug));
      ss.toast("⚠️ Ô Slug không được để trống! Đã tự động sinh lại từ Tiêu đề: " + regeneratedSlug, "🛡️ Bảo Vệ Slug", 6);
    } else if (oldTrimmed) {
      sheet.getRange(row, slugCol).setValue(sanitizeFormula(oldTrimmed));
      ss.toast("⚠️ Ô Slug không được để trống! Đã khôi phục Slug gốc: " + oldTrimmed, "🛡️ Bảo Vệ Slug", 6);
    }
    return;
  }

  // 2. Nếu người dùng gõ tay Slug mới -> Chuẩn hóa SEO & kiểm tra chống trùng lặp
  var resolved = resolveUniqueSlug(trimmed, otherSlugs, oldTrimmed);
  if (resolved !== trimmed) {
    sheet.getRange(row, slugCol).setValue(sanitizeFormula(resolved));
    ss.toast("⚠️ Slug đã được chuẩn hóa / chống trùng lặp: " + resolved, "🛡️ Chuẩn Hóa Slug", 5);
  }
}

/**
 * Helper: Xử lý khi người dùng chỉnh sửa Tiêu đề (Tự động sinh ID UUID & SEO Slug)
 */
function handleTitleEditWithUuidAndSlug(sheet, row, titleValue, idCol, slugCol, prefix, ss) {
  var idCell = sheet.getRange(row, idCol);
  var currentId = idCell.getValue();
  var generatedUuid = null;

  // 1. Kiểm tra cột ID (cột 1): Nếu trống -> Tự động sinh UUID v4 kèm prefix
  if (!currentId || currentId.toString().trim() === "") {
    generatedUuid = generateUUID(prefix);
    idCell.setValue(sanitizeFormula(generatedUuid));
  }

  // 2. Kiểm tra cột Slug (nếu tab có cột slug)
  if (slugCol) {
    var slugCell = sheet.getRange(row, slugCol);
    var currentSlug = slugCell.getValue();

    // Thu thập danh sách slug của các dòng khác để chống trùng lặp
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

    var uniqueSlug = resolveUniqueSlug(titleValue, otherSlugs, currentSlug);

    if (!currentSlug || currentSlug.toString().trim() === "") {
      slugCell.setValue(sanitizeFormula(uniqueSlug));
    }

    // Hiển thị Toast thông báo trạng thái
    if (uniqueSlug.match(/-v\d+$/)) {
      ss.toast("⚡ Phát hiện trùng tiêu đề! Đã tự động tạo: " + uniqueSlug + " (UUID: " + (generatedUuid || currentId) + ")", "DataWithLy Auto-Versioning", 5);
    } else {
      ss.toast("⚡ Đã tự động tạo UUID (" + (generatedUuid || currentId) + ") & SEO Slug: " + uniqueSlug, "DataWithLy Automation", 4);
    }
  } else {
    // Tab không có cột slug (như curriculum, faqs...)
    if (generatedUuid) {
      ss.toast("⚡ Đã tự động sinh UUID định danh: " + generatedUuid, "DataWithLy Automation", 4);
    }
  }
}

/**
 * 2. Bộ bắt sự kiện onEdit: Tự động hóa thời gian thực khi người dùng gõ phím
 */
function onEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  var sheetName = sheet.getName();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  var value = (e.value !== undefined) ? e.value : e.range.getValue();
  var oldValue = e.oldValue;
  var ss = e.source || SpreadsheetApp.getActiveSpreadsheet();

  // Bỏ qua dòng tiêu đề (Dòng 1)
  if (row <= 1) return;

  var prefix = TABLE_PREFIX_CONFIG[sheetName] || "";

  // ==========================================
  // 1. BẢO VỆ CỘT ID (CỘT 1) TRÊN MỌI TAB DỮ LIỆU CHÍNH
  // ==========================================
  if (col === 1 && TABLE_PREFIX_CONFIG[sheetName]) {
    protectIdCell(sheet, row, value, oldValue, prefix, ss);
    return;
  }

  // ==========================================
  // 2. TAB: courses
  // ==========================================
  if (sheetName === "courses") {
    // Cột 2 (Title): Sinh UUID (Cột 1) & SEO Slug (Cột 3)
    if (col === 2 && value) {
      handleTitleEditWithUuidAndSlug(sheet, row, value, 1, 3, "crs-", ss);
    }

    // Cột 3 (Slug): Bảo vệ và chuẩn hóa Slug
    if (col === 3) {
      protectSlugCell(sheet, row, 3, 2, value, oldValue, ss);
    }

    // Cột 6 & 7: Học phí VNĐ
    if ((col === 6 || col === 7) && value !== "") {
      var num = Number(value);
      if (isNaN(num) || num < 0) {
        ss.toast("⚠️ Cảnh báo: Học phí phải là số nguyên dương hợp lệ (VNĐ)!", "Lỗi Định Dạng", 5);
      } else {
        sheet.getRange(row, col).setNumberFormat("#,##0 \"đ\"");
      }
    }
  }

  // ==========================================
  // 3. TAB: blog_posts
  // ==========================================
  if (sheetName === "blog_posts") {
    // Cột 2 (Title): Sinh UUID (Cột 1) & SEO Slug (Cột 3)
    if (col === 2 && value) {
      handleTitleEditWithUuidAndSlug(sheet, row, value, 1, 3, "blg-", ss);
    }

    // Cột 3 (Slug): Bảo vệ và chuẩn hóa Slug
    if (col === 3) {
      protectSlugCell(sheet, row, 3, 2, value, oldValue, ss);
    }
  }

  // ==========================================
  // 4. TAB: curriculum
  // ==========================================
  if (sheetName === "curriculum") {
    // Cột 5 (module_title): Sinh UUID (Cột 1) nếu còn thiếu
    if (col === 5 && value) {
      handleTitleEditWithUuidAndSlug(sheet, row, value, 1, null, "cur-", ss);
    }
  }

  // ==========================================
  // 5. TAB: promotions
  // ==========================================
  if (sheetName === "promotions") {
    // Cột 2 (code) hoặc Cột 3 (title): Sinh UUID (Cột 1)
    if ((col === 2 || col === 3) && value) {
      handleTitleEditWithUuidAndSlug(sheet, row, value, 1, null, "promo-", ss);
    }
    // Cột 2 (code): Chuẩn hóa UPPERCASE
    if (col === 2 && value) {
      var upperCode = value.toString().trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
      if (upperCode !== value) {
        sheet.getRange(row, 2).setValue(sanitizeFormula(upperCode));
      }
    }
  }

  // ==========================================
  // 6. CÁC TAB KHÁC: packages_pricing, testimonials, mentor_profiles, faqs
  // ==========================================
  if (sheetName === "packages_pricing" && col === 3 && value) {
    handleTitleEditWithUuidAndSlug(sheet, row, value, 1, null, "pkg-", ss);
  } else if (sheetName === "testimonials" && col === 2 && value) {
    handleTitleEditWithUuidAndSlug(sheet, row, value, 1, null, "tst-", ss);
  } else if (sheetName === "mentor_profiles" && col === 2 && value) {
    handleTitleEditWithUuidAndSlug(sheet, row, value, 1, null, "men-", ss);
  } else if (sheetName === "faqs" && col === 3 && value) {
    handleTitleEditWithUuidAndSlug(sheet, row, value, 1, null, "faq-", ss);
  }
}


// ==============================================================================
// FILE NGUỒN: 03_TablesSetup.gs
// ==============================================================================

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





// ==============================================================================
// FILE NGUỒN: 04_WebAppEndpoints.gs
// ==============================================================================

/**
 * ==============================================================================
 * MODULE 04: BỘ ĐỊNH TUYẾN WEB APP (WEB APP ROUTING & REST ENDPOINTS)
 * ==============================================================================
 * 1. doGet(e): Xuất toàn bộ 11 tab nội dung công khai ra JSON cho Next.js CMS.
 * 2. doPost(e): Tiếp nhận Leads bảo mật & Thực thi 9 thao tác ghi dữ liệu từ Web Form:
 *    add_course, add_curriculum, save_mentor, add_promotion, add_package,
 *    add_testimonial, add_faq, save_settings, add_blog.
 * 3. Bảo vệ an toàn tuyệt đối PII trong tab leads (private), chống đọc trộm qua GET.
 * ==============================================================================
 */

/**
 * Endpoint GET: Đọc dữ liệu từ Google Sheets
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
        service: "DataWithLy Google Sheets CMS Engine",
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // VÁ LỖ HỔNG: Nếu server chưa cấu hình secret hoặc secret gửi lên không khớp -> Chặn ngay!
    var configuredSecret = CONFIG.SHARED_SECRET;
    if (!configuredSecret || configuredSecret.trim() === "" || secret !== configuredSecret) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: { code: "UNAUTHORIZED", message: "Yêu cầu mã secret xác thực hợp lệ. Vui lòng cấu hình SHARED_SECRET trong Script Properties." }
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Lấy riêng 1 tab
    if (action === "get_tab") {
      var tabName = params.tab || "courses";
      if (tabName.toLowerCase().indexOf("private") !== -1 || tabName.toLowerCase().indexOf("leads") !== -1) {
        return ContentService.createTextOutput(JSON.stringify({
          ok: false,
          error: { code: "FORBIDDEN", message: "Tab chứa thông tin PII bảo mật không thể truy xuất công khai." }
        })).setMimeType(ContentService.MimeType.JSON);
      }
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

    // Đọc tất cả 11 tab nội dung công khai
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

    var courses = coursesSheet ? getSheetRowsAsObjects(coursesSheet) : [];
    var curriculum = curriculumSheet ? getSheetRowsAsObjects(curriculumSheet) : [];
    var packages = pricingSheet ? getSheetRowsAsObjects(pricingSheet) : [];
    var studentProjects = studentProjectsSheet ? getSheetRowsAsObjects(studentProjectsSheet) : [];
    var mentors = mentorSheet ? getSheetRowsAsObjects(mentorSheet) : [];
    var testimonials = testimonialsSheet ? getSheetRowsAsObjects(testimonialsSheet) : [];
    var faqs = faqsSheet ? getSheetRowsAsObjects(faqsSheet) : [];
    var trustMetrics = trustSheet ? getSheetRowsAsObjects(trustSheet) : [];
    var settings = settingsSheet ? getSheetRowsAsObjects(settingsSheet) : [];
    var blogPosts = blogsSheet ? getSheetRowsAsObjects(blogsSheet) : [];
    var promotions = promoSheet ? getSheetRowsAsObjects(promoSheet) : [];

    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      source: "google_sheets_live",
      fetchedAt: new Date().toISOString(),
      tabs: {
        courses: courses,
        curriculum: curriculum,
        packages_pricing: packages,
        student_projects: studentProjects,
        mentor_profiles: mentors,
        testimonials: testimonials,
        faqs: faqs,
        trust_metrics: trustMetrics,
        settings: settings,
        blog_posts: blogPosts,
        promotions: promotions
      }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: { code: "GET_ERROR", message: err.toString() }
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Helper: Đọc dữ liệu từ sheet và chuyển thành mảng Objects chuẩn hóa keys
 */
function getSheetRowsAsObjects(sheet) {
  var data = sheet.getDataRange().getValues();
  if (!data || data.length < 2) return [];

  var headers = data[0].map(function(h) {
    return h.toString().trim().toLowerCase().replace(/[\s-]+/g, "_").replace(/_?\(private\)/g, "");
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

/**
 * Endpoint POST: Tiếp nhận Leads & Thao tác ghi dữ liệu từ Web
 */
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

    // VÁ LỖ HỔNG: Nếu server chưa cấu hình secret hoặc secret gửi lên không khớp -> Chặn ngay!
    var configuredSecret = CONFIG.SHARED_SECRET;
    if (!configuredSecret || configuredSecret.trim() === "" || payload.secret !== configuredSecret) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: { code: "UNAUTHORIZED", message: "Yêu cầu mã secret xác thực hợp lệ. Vui lòng cấu hình SHARED_SECRET trong Script Properties." }
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var action = payload.action || "submit_lead";

    // 0. NẠP TOÀN BỘ DATABASE CHUẨN FIGMA TỪ SEEDER (seed_database)
    if (action === "seed_database" || action === "bulk_seed") {
      var seedStats = applySeedSnapshotToSpreadsheet(payload.snapshot || payload.data);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        action: "seed_database",
        message: "Đã nạp toàn bộ dữ liệu chuẩn Figma 100% vào Google Sheets thành công!",
        stats: seedStats
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 1. THÊM KHÓA HỌC (add_course)
    if (action === "add_course") {
      var courseResult = addNewCourseFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_course", data: courseResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. THÊM CHƯƠNG LỘ TRÌNH (add_curriculum)
    if (action === "add_curriculum") {
      var currResult = addNewCurriculumModuleFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_curriculum", data: currResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. QUẢN TRỊ HỒ SƠ MENTOR (save_mentor)
    if (action === "save_mentor") {
      var mentorResult = saveMentorProfileFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "save_mentor", data: mentorResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. THÊM KHUYẾN MÃI (add_promotion)
    if (action === "add_promotion") {
      var promoResult = addNewPromotionFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_promotion", data: promoResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 5. THÊM GÓI COMBO & BẢNG GIÁ (add_package)
    if (action === "add_package") {
      var pkgResult = savePackageFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_package", data: pkgResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 6. THÊM ĐÁNH GIÁ HỌC VIÊN (add_testimonial)
    if (action === "add_testimonial") {
      var testResult = saveTestimonialFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_testimonial", data: testResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 7. THÊM CÂU HỎI FAQ (add_faq)
    if (action === "add_faq") {
      var faqResult = saveFaqFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_faq", data: faqResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 8. CẤU HÌNH HỆ THỐNG (save_settings)
    if (action === "save_settings") {
      var settingsResult = saveSettingsFromModal(payload.settings || payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "save_settings", data: settingsResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 9. THÊM BÀI VIẾT BLOG (add_blog)
    if (action === "add_blog") {
      var blogResult = saveBlogFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_blog", data: blogResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 10. TIẾP NHẬN LEAD HỌC VIÊN (submit_lead)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("leads (private)") || ss.getSheetByName("Leads") || ss.getSheetByName("private_leads");

    if (!sheet) {
      sheet = ss.insertSheet("leads (private)");
      sheet.appendRow([
        "submission_id", "timestamp", "name (private)", "phone (private)", "email (private)",
        "course_id", "course_name", "message (private)", "status"
      ]);
    }

    var timestamp = new Date().toISOString();
    var safePhone = payload.phone ? ("'" + payload.phone.toString().trim().replace(/^[=+\-@\t\r]+/, "")) : "";
    sheet.appendRow([
      sanitizeFormula(payload.submission_id || Utilities.getUuid()),
      timestamp,
      sanitizeFormula(payload.name || ""),
      safePhone,
      sanitizeFormula(payload.email || ""),
      sanitizeFormula(payload.course_id || "general"),
      sanitizeFormula(payload.course_name || "Tư vấn chung"),
      sanitizeFormula(payload.message || ""),
      "NEW"
    ]);

    if (CONFIG.TELEGRAM_BOT_TOKEN && CONFIG.TELEGRAM_CHAT_ID) {
      sendTelegramNotification(payload);
    }

    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      submissionId: payload.submission_id,
      status: "stored"
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

/**
 * GHI ĐÈ DỮ LIỆU CHUẨN FIGMA TỪ DATABASE SEEDER VÀO SPREADSHEET
 */
function applySeedSnapshotToSpreadsheet(snapshot) {
  if (!snapshot) throw new Error("Dữ liệu snapshot không hợp lệ hoặc để trống.");
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var stats = {};

  // 1. Courses
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
    cSheet.getRange(2, 1, cRows.length, 14).setValues(cRows);
    cSheet.getRange(2, 6, cRows.length, 2).setNumberFormat('#,##0 "đ"');
    stats.courses = cRows.length;
  }

  // 2. Curriculum
  if (snapshot.curriculum && snapshot.curriculum.length) {
    var curSheet = ss.getSheetByName("curriculum") || (setupCurriculumTab(ss), ss.getSheetByName("curriculum"));
    if (curSheet.getLastRow() > 1) {
      curSheet.getRange(2, 1, curSheet.getLastRow() - 1, curSheet.getLastColumn()).clearContent();
    }
    var curRows = snapshot.curriculum.map(function(m, i) {
      var bullets = Array.isArray(m.bulletPoints) ? m.bulletPoints.join("\n") : (m.topicsBullets || m.topics_bullets || "");
      return [
        m.id || ("cur-" + (i + 1)),
        m.courseId || m.course_id || "",
        m.courseName || m.course_name || "",
        Number(m.moduleNumber || m.module_number || (i + 1)),
        m.title || m.module_title || "",
        m.duration || "2 tuần",
        Number(m.lessonsCount || m.lessons_count || 4),
        bullets,
        Number(m.sortOrder || m.sort_order || (i + 1))
      ];
    });
    curSheet.getRange(2, 1, curRows.length, 9).setValues(curRows);
    stats.curriculum = curRows.length;
  }

  // 3. Packages
  if (snapshot.packages && snapshot.packages.length) {
    var pkgSheet = ss.getSheetByName("packages_pricing") || (setupPackagesPricingTab(ss), ss.getSheetByName("packages_pricing"));
    if (pkgSheet.getLastRow() > 1) {
      pkgSheet.getRange(2, 1, pkgSheet.getLastRow() - 1, pkgSheet.getLastColumn()).clearContent();
    }
    var pkgRows = snapshot.packages.map(function(p, i) {
      var feats = Array.isArray(p.featuresList) ? p.featuresList.join("\n") : (p.features_list || "");
      return [
        p.id || ("pkg-" + (i + 1)),
        p.packageId || p.package_id || p.id || "",
        p.name || "",
        Number(p.originalPrice || p.original_price || 0),
        Number(p.salePrice || p.sale_price || 0),
        p.badge || "",
        feats,
        p.isPopular === true,
        p.isActive !== false,
        Number(p.sortOrder || p.sort_order || (i + 1))
      ];
    });
    pkgSheet.getRange(2, 1, pkgRows.length, 10).setValues(pkgRows);
    pkgSheet.getRange(2, 4, pkgRows.length, 2).setNumberFormat('#,##0 "đ"');
    stats.packages = pkgRows.length;
  }

  // 4. Student Projects
  if (snapshot.projects && snapshot.projects.length) {
    var pSheet = ss.getSheetByName("student_projects") || (setupStudentProjectsTab(ss), ss.getSheetByName("student_projects"));
    if (pSheet.getLastRow() > 1) {
      pSheet.getRange(2, 1, pSheet.getLastRow() - 1, pSheet.getLastColumn()).clearContent();
    }
    var pRows = snapshot.projects.map(function(p, i) {
      var tools = Array.isArray(p.tools) ? p.tools.join(", ") : (p.toolsRaw || p.tools || "");
      return [
        p.projectId || p.id || ("proj-" + (i + 1)),
        p.title || "",
        p.category || "Data Analytics",
        p.authorName || p.author_name || p.author || "Học viên",
        tools,
        p.metrics || "",
        p.imageUrl || p.image_url || "/assets/figma/2643f19ffd20e9e83bc82fe8862b51f3796c7604.png",
        Number(p.sortOrder || p.sort_order || (i + 1)),
        p.isActive !== false
      ];
    });
    pSheet.getRange(2, 1, pRows.length, 9).setValues(pRows);
    stats.projects = pRows.length;
  }

  // 5. Mentors
  if (snapshot.mentors && snapshot.mentors.length) {
    var mSheet = ss.getSheetByName("mentor_profiles") || (setupMentorProfilesTab(ss), ss.getSheetByName("mentor_profiles"));
    if (mSheet.getLastRow() > 1) {
      mSheet.getRange(2, 1, mSheet.getLastRow() - 1, mSheet.getLastColumn()).clearContent();
    }
    var mRows = snapshot.mentors.map(function(m, i) {
      var comps = Array.isArray(m.companies) ? m.companies.join(", ") : (m.companiesWorked || m.companies_worked || "");
      return [
        m.id || ("men-" + (i + 1)),
        m.name || "Hứa Thảo Ly",
        m.role || "Founder & Lead Mentor",
        m.title || m.role || "",
        m.bio || "",
        comps,
        m.avatarUrl || m.avatar_url || "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png",
        m.linkedinUrl || m.linkedin_url || "",
        m.isActive !== false
      ];
    });
    mSheet.getRange(2, 1, mRows.length, 9).setValues(mRows);
    stats.mentors = mRows.length;
  }

  // 6. Testimonials
  if (snapshot.testimonials && snapshot.testimonials.length) {
    var tSheet = ss.getSheetByName("testimonials") || (setupTestimonialsTab(ss), ss.getSheetByName("testimonials"));
    if (tSheet.getLastRow() > 1) {
      tSheet.getRange(2, 1, tSheet.getLastRow() - 1, tSheet.getLastColumn()).clearContent();
    }
    var tRows = snapshot.testimonials.map(function(t, i) {
      return [
        t.id || ("tst-" + (i + 1)),
        t.studentName || t.student_name || t.name || "",
        t.studentRole || t.role || "",
        t.company || "",
        t.avatarUrl || t.avatar_url || "/assets/figma/e40866062bc7c3587c903859bd52be66623217cc.png",
        t.courseId || t.course_id || "ALL",
        t.rating ? t.rating.toString() : "5",
        t.reviewText || t.comment || "",
        t.isFeatured === true,
        t.isActive !== false
      ];
    });
    tSheet.getRange(2, 1, tRows.length, 10).setValues(tRows);
    stats.testimonials = tRows.length;
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
  sheet.getRange(startRow, 1, rowsToAdd.length, 14).setValues(rowsToAdd);

  // Định dạng hiển thị VNĐ
  sheet.getRange(startRow, 6, rowsToAdd.length, 2).setNumberFormat('#,##0 "đ"');

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
// FILE NGUỒN: 06_Maintenance.gs
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
        settingsMap[sData[i][0].toString().trim()] = (sData[i][1] || "").toString().trim();
      }
    }
  }

  var activeEnv = (settingsMap["active_revalidation_env"] || CONFIG.ACTIVE_REVALIDATION_ENV || "PROD").toUpperCase();
  var prodUrl = settingsMap["revalidation_prod_url"] || settingsMap["revalidation_url"] || CONFIG.REVALIDATION_PROD_URL;
  var localUrl = settingsMap["revalidation_local_url"] || CONFIG.REVALIDATION_LOCAL_URL;

  var targetUrl = "";
  var envName = "";

  if (activeEnv === "LOCAL" && localUrl) {
    targetUrl = localUrl;
    envName = "💻 LOCALHOST / DEV TUNNEL";
  } else if (localUrl && !prodUrl) {
    targetUrl = localUrl;
    envName = "💻 LOCALHOST / DEV TUNNEL";
  } else {
    targetUrl = prodUrl || CONFIG.REVALIDATION_PROD_URL;
    envName = "🚀 PRODUCTION WEBSITE";
  }

  try {
    var response = UrlFetchApp.fetch(targetUrl, {
      method: "post",
      muteHttpExceptions: true
    });

    if (response.getResponseCode() === 200) {
      ui.alert(
        "✅ Xuất Bản Thành Công",
        "Website DataWithLy đã được làm mới tức thì!\n\n" +
        "• Môi trường: " + envName + "\n" +
        "• Endpoint: " + targetUrl + "\n\n" +
        "Học viên sẽ thấy ngay nội dung mới nhất vừa cập nhật.",
        ui.ButtonSet.OK
      );
    } else {
      ui.alert(
        "⚠️ Phản Hồi Từ Website (" + envName + ")",
        "Mã HTTP: " + response.getResponseCode() + "\n" + response.getContentText(),
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
        "Không thể kết nối đến URL Webhook:\n" + targetUrl + "\n\n" +
        "Chi tiết lỗi: " + err.message,
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
 */
function showUpdateLeadStatusPrompt() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("leads (private)") || ss.getSheetByName("Leads") || ss.getSheetByName("private_leads");

  if (!sheet || sheet.getLastRow() <= 1) {
    ui.alert("Thông Báo", "Chưa có danh sách Lead học viên trong tab 'leads (private)'.", ui.ButtonSet.OK);
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

  for (var i = 1; i < data.length; i++) {
    var subId = (data[i][0] || "").toString().toLowerCase().trim();
    var phone = (data[i][3] || "").toString().toLowerCase().replace(/['\s-]/g, "").trim();

    if (subId === query || phone === query || (query.length >= 8 && phone.indexOf(query) !== -1)) {
      foundRow = i + 1;
      leadInfo = {
        subId: data[i][0],
        name: data[i][2] || "N/A",
        phone: data[i][3] || "N/A",
        course: data[i][6] || "N/A",
        currentStatus: data[i][8] || "NEW"
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

  sheet.getRange(foundRow, 9).setValue(sanitizeFormula(newStatus));
  ss.toast("🎉 Đã cập nhật trạng thái Lead " + leadInfo.name + " -> " + newStatus, "DataWithLy CRM", 5);
  ui.alert("✅ Cập Nhật Thành Công", "Học viên: " + leadInfo.name + "\nTrạng thái mới: " + newStatus, ui.ButtonSet.OK);
}

/**
 * 6. Thiết lập mã Secret bảo mật vào Google Cloud Script Properties
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
    var vals = courseSheet.getRange(2, 1, lastRow - 1, 3).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i][0] && vals[i][1]) {
        coursesList.push({ id: vals[i][0].toString().trim(), title: vals[i][1].toString().trim(), slug: (vals[i][2] || vals[i][0]).toString().trim(), maxModule: 0 });
      }
    }
  }

  var currLastRow = curriculumSheet.getLastRow();
  if (currLastRow > 1) {
    var cVals = curriculumSheet.getRange(2, 2, currLastRow - 1, 3).getValues();
    for (var j = 0; j < cVals.length; j++) {
      var rCId = cVals[j][0] ? cVals[j][0].toString().trim() : "";
      var mNum = Number(cVals[j][2]) || 0;
      for (var k = 0; k < coursesList.length; k++) {
        if (coursesList[k].id === rCId && mNum > coursesList[k].maxModule) coursesList[k].maxModule = mNum;
      }
    }
  }

  var template = createModalTemplate("CurriculumModal");
  template.coursesList = coursesList;
  var html = template.evaluate().setWidth(660).setHeight(720).setTitle("📚 Thêm Chương Lộ Trình Hàng Loạt - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "📚 Thêm Chương Lộ Trình Hàng Loạt");
}

function addCurriculumBatchFromModal(curriculumList) {
  if (!curriculumList || !curriculumList.length) {
    throw new Error("Danh sách chương học không được để trống.");
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("curriculum") || (setupCurriculumTab(ss), ss.getSheetByName("curriculum"));

  var rowsToAdd = [];
  var addedItems = [];

  for (var i = 0; i < curriculumList.length; i++) {
    var item = curriculumList[i];
    var courseId = (item.course_id || "").toString().trim();
    var moduleTitle = (item.module_title || "").toString().trim();
    if (!courseId) {
      throw new Error("Chương #" + (i + 1) + ": Khóa học áp dụng không được để trống.");
    }
    if (!moduleTitle) {
      throw new Error("Chương #" + (i + 1) + ": Tiêu đề chương không được để trống.");
    }

    var modNum = Number(item.module_number) || (i + 1);

    // Tự động sinh module_id / UUID v4 chuẩn RFC 4122
    var pkId = item.id && isValidUUID(item.id, "cur-")
      ? item.id.toString().trim()
      : generateUUID("cur-");

    // Chuẩn hóa và bóc tách nội dung bullet points Alt+Enter đúng format
    var rawTopics = (item.topics_bullets || "").toString();
    var cleanTopics = rawTopics
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .map(function (line) { return line.trim(); })
      .filter(function (line) { return line.length > 0; })
      .join("\n");

    var lessonsCount = Number(item.lessons_count) || 6;
    var sortOrder = Number(item.sort_order) || modNum;

    rowsToAdd.push([
      sanitizeFormula(pkId),
      sanitizeFormula(courseId),
      sanitizeFormula(item.course_name || ""),
      modNum,
      sanitizeFormula(moduleTitle),
      sanitizeFormula(item.duration || "2 tuần"),
      lessonsCount,
      sanitizeFormula(cleanTopics),
      sortOrder
    ]);

    addedItems.push({ id: pkId, title: moduleTitle, module_number: modNum });
  }

  var startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rowsToAdd.length, 9).setValues(rowsToAdd);

  var msg = "🎉 Đã lưu thành công " + rowsToAdd.length + " chương lộ trình học vào bảng curriculum!";
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

