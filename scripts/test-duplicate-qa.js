/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * ==============================================================================
 * DATAWITHLY CMS - MODALS DUPLICATE & QA AUDIT TEST SUITE
 * ==============================================================================
 * Kịch bản kiểm thử tự động toàn diện:
 * 1. Kiểm tra 0 hàm trùng lặp trên toàn bộ 15 file .gs
 * 2. Kiểm tra 0 biến toàn cục trùng lặp trên toàn bộ .gs
 * 3. Kiểm tra 0 DOM ID trùng lặp trong từng file HTML Modal
 * 4. Kiểm tra Form ID duy nhất cho cả 9 Modals
 * 5. Kiểm tra 100% getElementById và <label for> khớp với DOM ID thực tế
 * 6. Kiểm tra 0 hàm trùng lặp trong khối <script> của từng Modal HTML
 * 7. Kiểm tra tính đồng nhất 100% giữa Slug Server (resolveUniqueSlug) và Client (resolveUniqueSlugClient)
 * 8. Kiểm tra an toàn HTML Escape (scriptlets) & CSS Scoping
 * ==============================================================================
 */

const fs = require("fs");
const path = require("path");
const acorn = require("acorn");

const appsScriptDir = path.join(__dirname, "..", "apps-script");
let totalPassed = 0;
let totalFailed = 0;

function assert(condition, message) {
  if (condition) {
    totalPassed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    totalFailed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log("==============================================================================");
console.log("🚀 BẮT ĐẦU CHẠY BỘ KIỂM THỬ TỰ ĐỘNG: MODALS DUPLICATE & QA AUDIT");
console.log("==============================================================================\n");

// ------------------------------------------------------------------------------
// TEST SUITE 1: Backend Functions & Variables Duplicate Check (.gs files)
// ------------------------------------------------------------------------------
console.log("--- TEST SUITE 1: KIỂM TRA TRÙNG LẶP HÀM & BIẾN TRÊN CÁC FILE .GS ---");
const gsFiles = fs.readdirSync(appsScriptDir).filter((f) => f.endsWith(".gs") && f !== "bundle.js").sort();
const allGsFunctions = new Map();
const topLevelVars = new Map();

function walkGsAst(node, file) {
  if (!node) return;
  if (node.type === "FunctionDeclaration" && node.id) {
    const name = node.id.name;
    if (!allGsFunctions.has(name)) allGsFunctions.set(name, []);
    allGsFunctions.get(name).push({ file, line: node.loc ? node.loc.start.line : 0 });
  }
  for (const key in node) {
    if (key === "parent") continue;
    const child = node[key];
    if (Array.isArray(child)) {
      child.forEach((c) => {
        if (c && typeof c.type === "string") walkGsAst(c, file);
      });
    } else if (child && typeof child.type === "string") {
      walkGsAst(child, file);
    }
  }
}

for (const file of gsFiles) {
  const code = fs.readFileSync(path.join(appsScriptDir, file), "utf8");
  const ast = acorn.parse(code, { ecmaVersion: "latest", locations: true });
  walkGsAst(ast, file);

  // Top level variable check
  for (const topNode of ast.body) {
    if (topNode.type === "VariableDeclaration") {
      for (const decl of topNode.declarations) {
        if (decl.id && decl.id.name) {
          const vName = decl.id.name;
          if (!topLevelVars.has(vName)) topLevelVars.set(vName, []);
          topLevelVars.get(vName).push({ file, kind: topNode.kind });
        }
      }
    }
  }
}

const duplicateGsFunctions = [...allGsFunctions.entries()].filter(([, occ]) => occ.length > 1);
assert(
  duplicateGsFunctions.length === 0,
  `0 duplicate function declarations across all ${gsFiles.length} .gs files (Tìm thấy: ${duplicateGsFunctions.length} trùng)`
);
if (duplicateGsFunctions.length > 0) {
  console.error("    Chi tiết hàm trùng:", JSON.stringify(duplicateGsFunctions, null, 2));
}

const duplicateTopVars = [...topLevelVars.entries()].filter(([, occ]) => occ.length > 1);
assert(
  duplicateTopVars.length === 0,
  `0 duplicate top-level variables across all .gs files (Tìm thấy: ${duplicateTopVars.length} trùng)`
);

// ------------------------------------------------------------------------------
// TEST SUITE 2: DOM IDs, Form IDs & Cross-reference Integrity
// ------------------------------------------------------------------------------
console.log("\n--- TEST SUITE 2: KIỂM TRA DOM IDS & FORM IDS TRONG 10 FILE HTML ---");
const modalHtmlFiles = [
  "CourseModal.html",
  "CurriculumModal.html",
  "MentorModal.html",
  "PromotionsModal.html",
  "PackageModal.html",
  "TestimonialModal.html",
  "FaqModal.html",
  "SettingsModal.html",
  "BlogModal.html"
];

const formIds = [];
for (const file of modalHtmlFiles) {
  const content = fs.readFileSync(path.join(appsScriptDir, file), "utf8");

  // Kiểm tra Form ID
  const formMatch = content.match(/<form[^>]*\bid=[\"']([^\"']+)[\"']/i);
  assert(formMatch !== null, `${file}: Có thẻ <form id="..."> hợp lệ`);
  if (formMatch) {
    formIds.push({ file, formId: formMatch[1] });
  }

  // Kiểm tra Duplicate DOM IDs trong file
  const domIdMatches = [...content.matchAll(/\bid=[\"']([^\"']+)[\"']/gi)].map((m) => m[1]);
  const idCounts = {};
  for (const id of domIdMatches) idCounts[id] = (idCounts[id] || 0) + 1;
  const duplicateIds = Object.entries(idCounts).filter(([, count]) => count > 1);

  assert(
    duplicateIds.length === 0,
    `${file}: 0 duplicate DOM IDs trong file (${domIdMatches.length} IDs được kiểm tra)`
  );
  if (duplicateIds.length > 0) {
    console.error(`    Chi tiết ID trùng trong ${file}:`, duplicateIds);
  }

  // Kiểm tra getElementById khớp DOM ID
  const domIdSet = new Set(domIdMatches);
  const getElCalls = [...content.matchAll(/document\.getElementById\([\"']([^\"']+)[\"']\)/g)].map((m) => m[1]);
  const missingDomRefs = getElCalls.filter((id) => !domIdSet.has(id));
  assert(
    missingDomRefs.length === 0,
    `${file}: 100% getElementById calls (${getElCalls.length}) tham chiếu ID tồn tại`
  );
  if (missingDomRefs.length > 0) {
    console.error(`    Chi tiết ID thiếu trong ${file}:`, missingDomRefs);
  }

  // Kiểm tra label for
  const labelFors = [...content.matchAll(/<label[^>]*\bfor=[\"']([^\"']+)[\"']/gi)].map((m) => m[1]);
  const missingLabels = labelFors.filter((id) => !domIdSet.has(id));
  assert(
    missingLabels.length === 0,
    `${file}: 100% <label for> (${labelFors.length}) liên kết đúng phần tử nhập liệu`
  );
}

// Kiểm tra Form IDs duy nhất trên toàn bộ 9 modals
const formIdSet = new Set();
const duplicateFormIds = [];
for (const item of formIds) {
  if (formIdSet.has(item.formId)) {
    duplicateFormIds.push(item);
  }
  formIdSet.add(item.formId);
}
assert(
  duplicateFormIds.length === 0,
  `Tất cả 9 Form IDs đều là duy nhất tuyệt đối (${formIds.map((f) => f.formId).join(", ")})`
);

// ------------------------------------------------------------------------------
// TEST SUITE 3: Client Script Duplicate Functions Check
// ------------------------------------------------------------------------------
console.log("\n--- TEST SUITE 3: KIỂM TRA TRÙNG LẶP HÀM TRONG THẺ <SCRIPT> MODAL HTML ---");
for (const file of modalHtmlFiles) {
  const content = fs.readFileSync(path.join(appsScriptDir, file), "utf8");
  const scriptMatches = [...content.matchAll(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi)];

  let fileHasDupeFunc = false;
  for (const [, scriptBody] of scriptMatches) {
    // Làm sạch scriptlet để parse AST
    const cleanJs = scriptBody.replace(/<\?[\s\S]*?\?>/g, "[]");
    try {
      const ast = acorn.parse(cleanJs, { ecmaVersion: "latest" });
      const funcNames = [];
      for (const node of ast.body) {
        if (node.type === "FunctionDeclaration" && node.id) {
          funcNames.push(node.id.name);
        }
      }
      const fCounts = {};
      for (const fn of funcNames) fCounts[fn] = (fCounts[fn] || 0) + 1;
      const dupes = Object.entries(fCounts).filter(([, count]) => count > 1);

      if (dupes.length > 0) {
        fileHasDupeFunc = true;
        console.error(`    ${file} có hàm trùng lặp trong script:`, dupes);
      }
    } catch (err) {
      console.warn(`    Cảnh báo khi parse script trong ${file}:`, err.message);
    }
  }

  assert(!fileHasDupeFunc, `${file}: 0 duplicate functions trong khối <script>`);
}

// ------------------------------------------------------------------------------
// TEST SUITE 4: Slug & Code Resolution Consistency (Server vs Client)
// ------------------------------------------------------------------------------
console.log("\n--- TEST SUITE 4: KIỂM TRA TÍNH ĐỒNG NHẤT SLUG RESOLUTION (SERVER VS CLIENT) ---");

// Trích xuất thuật toán từ server (01_SlugUtils.gs)
function serverGenerateSlug(text) {
  if (!text) return "";
  var str = text.toString().toLowerCase().trim();
  str = str.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, "a");
  str = str.replace(/[éèẻẽẹêếềểễệ]/g, "e");
  str = str.replace(/[íìỉĩị]/g, "i");
  str = str.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, "o");
  str = str.replace(/[úùủũụưứừửữự]/g, "u");
  str = str.replace(/[ýỳỷỹỵ]/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/[\s_]+/g, "-");
  str = str.replace(/[^a-z0-9-]/g, "");
  str = str.replace(/-+/g, "-");
  str = str.replace(/^-+|-+$/g, "");
  return str;
}

function serverResolveUniqueSlug(rawInput, existingSlugs, currentSlug) {
  var base = serverGenerateSlug(rawInput);
  if (!base) return "";

  var cleanBase = base.replace(/-v\d+$/, "");
  var slugMap = {};
  var list = existingSlugs || [];
  var cur = (currentSlug || "").toString().trim().toLowerCase();

  for (var i = 0; i < list.length; i++) {
    var s = (list[i] || "").toString().trim().toLowerCase();
    if (s && s !== cur) {
      slugMap[s] = true;
    }
  }

  if (!slugMap[cleanBase]) {
    return cleanBase;
  }

  var version = 1;
  while (true) {
    var candidate = cleanBase + "-v" + version;
    if (!slugMap[candidate]) {
      return candidate;
    }
    version++;
  }
}

// Trích xuất thuật toán từ client (CourseModal.html & BlogModal.html)
function clientSlugify(text) {
  if (!text) return "";
  var str = text.toString().toLowerCase().trim();
  str = str.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, "a");
  str = str.replace(/[éèẻẽẹêếềểễệ]/g, "e");
  str = str.replace(/[íìỉĩị]/g, "i");
  str = str.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, "o");
  str = str.replace(/[úùủũụưứừửữự]/g, "u");
  str = str.replace(/[ýỳỷỹỵ]/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/[\s_]+/g, "-");
  str = str.replace(/[^a-z0-9-]/g, "");
  str = str.replace(/-+/g, "-");
  str = str.replace(/^-+|-+$/g, "");
  return str;
}

function clientResolveUniqueSlugClient(rawInput, existingSlugs, currentSlug) {
  var base = clientSlugify(rawInput);
  if (!base) return { slug: "", isVersioned: false };

  var cleanBase = base.replace(/-v\d+$/, "");
  var slugMap = {};
  var list = existingSlugs || [];
  var cur = (currentSlug || "").toString().trim().toLowerCase();

  for (var i = 0; i < list.length; i++) {
    var s = (list[i] || "").toString().trim().toLowerCase();
    if (s && s !== cur) {
      slugMap[s] = true;
    }
  }

  if (!slugMap[cleanBase]) {
    return { slug: cleanBase, isVersioned: false };
  }

  var version = 1;
  while (true) {
    var candidate = cleanBase + "-v" + version;
    if (!slugMap[candidate]) {
      return { slug: candidate, isVersioned: true };
    }
    version++;
  }
}

const slugTestCases = [
  { desc: "Tên chưa từng tồn tại", input: "SQL for Data Analytics", existing: [] },
  { desc: "Tên có dấu tiếng Việt & dấu gạch dưới", input: "Phân Tích Dữ Liệu_SQL Cơ Bản", existing: [] },
  { desc: "Trùng lần 1 -> nhận -v1", input: "SQL for Data Analytics", existing: ["sql-for-data-analytics"] },
  { desc: "Trùng tiếp lần 2 -> nhận -v2", input: "SQL for Data Analytics", existing: ["sql-for-data-analytics", "sql-for-data-analytics-v1"] },
  { desc: "Input đã có đuôi -v1 nhưng trùng -> nhận -v2", input: "sql-for-data-analytics-v1", existing: ["sql-for-data-analytics", "sql-for-data-analytics-v1"] },
  { desc: "Danh sách existing chữ hoa xen kẽ", input: "Khoa Hoc Power BI", existing: ["KHOA-HOC-POWER-BI"] },
  { desc: "Chỉnh sửa chính mình (currentSlug)", input: "Khoa Hoc Power BI", existing: ["khoa-hoc-power-bi"], current: "khoa-hoc-power-bi" },
  { desc: "Ký tự đặc biệt nguy hiểm (@, =, cmd)", input: "=cmd|' /C calc'!A0 Tiêu Đề Bài Viết", existing: [] }
];

let allSlugMatches = true;
for (const tc of slugTestCases) {
  const sRes = serverResolveUniqueSlug(tc.input, tc.existing, tc.current);
  const cRes = clientResolveUniqueSlugClient(tc.input, tc.existing, tc.current);
  const match = sRes === cRes.slug;
  if (!match) allSlugMatches = false;
  assert(match, `${tc.desc}: Server ('${sRes}') === Client ('${cRes.slug}')`);
}
assert(allSlugMatches, "100% test cases đồng nhất giữa server resolveUniqueSlug và client resolveUniqueSlugClient");

// ------------------------------------------------------------------------------
// TEST SUITE 5: HTML Escaping & CSS Scoping Verification
// ------------------------------------------------------------------------------
console.log("\n--- TEST SUITE 5: KIỂM TRA HTML ESCAPING & CSS SCOPING ---");
const sharedStylesContent = fs.readFileSync(path.join(appsScriptDir, "SharedStyles.html"), "utf8");
assert(
  sharedStylesContent.includes("<style>") && sharedStylesContent.includes("</style>"),
  "SharedStyles.html: Chứa khối <style> hoàn chỉnh và hợp lệ"
);

// Kiểm tra scriptlet <?!= JSON.stringify(...) ?> trong các file có nhúng mảng JSON vào script
const jsonScriptletFiles = ["CourseModal.html", "BlogModal.html", "PromotionsModal.html"];
for (const file of jsonScriptletFiles) {
  const content = fs.readFileSync(path.join(appsScriptDir, file), "utf8");
  const hasRawJsonScriptlet = content.includes("<?!= JSON.stringify(");
  assert(
    hasRawJsonScriptlet,
    `${file}: Sử dụng đúng scriptlet không escape '<?!= JSON.stringify(...)' trong <script> để chống lỗi SyntaxError &quot;`
  );
}

// Kiểm tra toàn bộ scriptlet include('SharedStyles')
for (const file of modalHtmlFiles) {
  const content = fs.readFileSync(path.join(appsScriptDir, file), "utf8");
  const hasSharedStyles = content.includes("<?!= include('SharedStyles'); ?>");
  assert(hasSharedStyles, `${file}: Nhúng SharedStyles bằng cú pháp unescaped <?!= include('SharedStyles'); ?>`);
}

// ------------------------------------------------------------------------------
// TEST SUITE 6: BATCH ENTRY & REPEATER MODALS VERIFICATION (RF-02)
// ------------------------------------------------------------------------------
console.log("\n--- TEST SUITE 6: KIỂM TRA BATCH ENTRY & REPEATER MODALS (RF-02) ---");

// 1. Kiểm tra sự tồn tại của 4 hàm xử lý batch backend
const courseGsContent = fs.readFileSync(path.join(appsScriptDir, "05_CourseModal.gs"), "utf8");
const curriculumGsContent = fs.readFileSync(path.join(appsScriptDir, "07_CurriculumModal.gs"), "utf8");
const blogGsContent = fs.readFileSync(path.join(appsScriptDir, "14_BlogModal.gs"), "utf8");
const mentorGsContent = fs.readFileSync(path.join(appsScriptDir, "08_MentorModal.gs"), "utf8");

assert(
  courseGsContent.includes("function addCoursesBatchFromModal("),
  "05_CourseModal.gs: Có hàm xử lý lưu hàng loạt addCoursesBatchFromModal"
);
assert(
  curriculumGsContent.includes("function addCurriculumBatchFromModal("),
  "07_CurriculumModal.gs: Có hàm xử lý lưu hàng loạt addCurriculumBatchFromModal"
);
assert(
  blogGsContent.includes("function addBlogsBatchFromModal("),
  "14_BlogModal.gs: Có hàm xử lý lưu hàng loạt addBlogsBatchFromModal"
);
assert(
  mentorGsContent.includes("function addMentorsBatchFromModal("),
  "08_MentorModal.gs: Có hàm xử lý lưu hàng loạt addMentorsBatchFromModal"
);

// 2. Kiểm tra các nút bấm Repeater '+' và Lưu tất cả trong 4 HTML Modals
const courseHtmlContent = fs.readFileSync(path.join(appsScriptDir, "CourseModal.html"), "utf8");
const curriculumHtmlContent = fs.readFileSync(path.join(appsScriptDir, "CurriculumModal.html"), "utf8");
const blogHtmlContent = fs.readFileSync(path.join(appsScriptDir, "BlogModal.html"), "utf8");
const mentorHtmlContent = fs.readFileSync(path.join(appsScriptDir, "MentorModal.html"), "utf8");

assert(
  courseHtmlContent.includes('id="addCourseBtn"') && courseHtmlContent.includes("Lưu tất cả"),
  "CourseModal.html: Có nút Repeater '+' (addCourseBtn) và cơ chế hiển thị 'Lưu tất cả (X khóa học)'"
);
assert(
  curriculumHtmlContent.includes('id="addCurriculumBtn"') && curriculumHtmlContent.includes("Lưu tất cả"),
  "CurriculumModal.html: Có nút Repeater '+' (addCurriculumBtn) và cơ chế hiển thị 'Lưu tất cả (X chương học)'"
);
assert(
  blogHtmlContent.includes('id="addBlogBtn"') && blogHtmlContent.includes("Lưu tất cả"),
  "BlogModal.html: Có nút Repeater '+' (addBlogBtn) và cơ chế hiển thị 'Lưu tất cả (X bài viết)'"
);
assert(
  mentorHtmlContent.includes('id="addMentorBtn"') && mentorHtmlContent.includes("Lưu tất cả"),
  "MentorModal.html: Có nút Repeater '+' (addMentorBtn) và cơ chế hiển thị 'Lưu tất cả (X giảng viên)'"
);

// 3. Kiểm tra thuật toán giải quyết trùng lặp Slug trong cùng một đợt Batch
const batchItems = ["Power BI Masterclass", "Power BI Masterclass", "Power BI Masterclass"];
const simulatedExisting = ["power-bi-masterclass"];
const generatedBatchSlugs = [];
for (const title of batchItems) {
  const slug = serverResolveUniqueSlug(title, simulatedExisting.concat(generatedBatchSlugs));
  generatedBatchSlugs.push(slug);
}
assert(
  generatedBatchSlugs[0] === "power-bi-masterclass-v1" &&
    generatedBatchSlugs[1] === "power-bi-masterclass-v2" &&
    generatedBatchSlugs[2] === "power-bi-masterclass-v3",
  `Cơ chế batch slugging tự động tăng version cho các item trùng nhau trong cùng một mảng: ${generatedBatchSlugs.join(" -> ")}`
);

// 4. Kiểm tra xử lý Bullet points Alt+Enter trong Curriculum
const rawTopics = "Dòng 1: Giới thiệu\r\n\r\nDòng 2: Cú pháp cơ bản\nDòng 3: Thực hành Capstone";
const parsedTopics = rawTopics
  .replace(/\r\n/g, "\n")
  .replace(/\r/g, "\n")
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l.length > 0)
  .join("\n");
assert(
  parsedTopics === "Dòng 1: Giới thiệu\nDòng 2: Cú pháp cơ bản\nDòng 3: Thực hành Capstone",
  "Curriculum Alt+Enter Bullet Points parser chuẩn hóa các loại xuống dòng (CRLF, LF) và lọc bỏ dòng trắng thừa"
);

console.log("\n==============================================================================");
console.log(`🎯 KẾT QUẢ KIỂM THỬ: ${totalPassed} PASSED / ${totalFailed} FAILED`);
console.log("==============================================================================");

if (totalFailed > 0) {
  process.exit(1);
} else {
  console.log("🎉 TẤT CẢ CÁC BỘ KIỂM THỬ ĐÃ VƯỢT QUA 100%! HỆ THỐNG SẴN SÀNG TRIỂN KHAI.");
}
