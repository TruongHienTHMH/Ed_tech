/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const rootDir = path.resolve(__dirname, "..");

function loadTsModule(relativePath) {
  const fullPath = path.join(rootDir, relativePath);
  const content = fs.readFileSync(fullPath, "utf8");
  const transpiled = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;

  const m = { exports: {} };
  const customRequire = (reqPath) => {
    if (reqPath.startsWith("@/")) {
      let sub = reqPath.replace("@/", "") + ".ts";
      if (!fs.existsSync(path.join(rootDir, sub))) {
        sub = reqPath.replace("@/", "") + "/index.ts";
      }
      return loadTsModule(sub);
    }
    return require(reqPath);
  };

  const fn = new Function("exports", "require", "module", transpiled);
  fn(m.exports, customRequire, m);
  return m.exports;
}

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log(`  ✅ PASS: ${msg}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${msg}`);
  }
}

console.log("==============================================================================");
console.log("🧪 KIỂM THỬ TỰ ĐỘNG: LEAD VALIDATION, RATE LIMIT & HONEYPOT SUITE");
console.log("==============================================================================\n");

// 1. InMemoryRateLimiter Test
console.log("--- TEST 1: RATE LIMITER BR-09 (TỐI ĐA 3 LẦN/PHÚT/IP) ---");
const { InMemoryRateLimiter } = loadTsModule("lib/security/rate-limiter.ts");
const testIp = "192.168.1.100";

const r1 = InMemoryRateLimiter.check(testIp, 3, 60000);
assert(r1.allowed === true && r1.remaining === 2, "Lần gọi 1: được phép, remaining = 2");

const r2 = InMemoryRateLimiter.check(testIp, 3, 60000);
assert(r2.allowed === true && r2.remaining === 1, "Lần gọi 2: được phép, remaining = 1");

const r3 = InMemoryRateLimiter.check(testIp, 3, 60000);
assert(r3.allowed === true && r3.remaining === 0, "Lần gọi 3: được phép, remaining = 0");

const r4 = InMemoryRateLimiter.check(testIp, 3, 60000);
assert(r4.allowed === false && r4.remaining === 0, "Lần gọi 4: BỊ CHẶN (allowed: false)");

// 2. LeadValidator Test
console.log("\n--- TEST 2: LEAD VALIDATOR & HONEYPOT TRAP ---");
const { LeadValidator } = loadTsModule("lib/modules/leads/validator.ts");

// 2.1 Valid Lead
const validLead = {
  submission_id: "test-uuid-001",
  name: "Nguyễn Văn An",
  phone: "0912345678",
  email: "an.nguyen@gmail.com",
  course_id: "sql-for-data-analytics",
  course_name: "SQL for Data Analytics",
  message: "Muốn chuyển ngành sang DA",
  _hp: "",
};
const v1 = LeadValidator.validate(validLead);
assert(v1.isValid === true && v1.isBot === false, "Dữ liệu hợp lệ: isValid = true, isBot = false");
assert(v1.cleanData.phone === "0912345678", "Clean phone chuẩn");

// 2.2 Honeypot Bot Trap
const botLead = {
  ...validLead,
  submission_id: "test-uuid-bot",
  _hp: "I am a spam bot",
};
const v2 = LeadValidator.validate(botLead);
assert(v2.isValid === true && v2.isBot === true, "Honeypot _hp có dữ liệu: phát hiện bot thành công (isBot = true)");

// 2.3 Invalid Phone
const invalidPhoneLead = {
  ...validLead,
  phone: "12345",
};
const v3 = LeadValidator.validate(invalidPhoneLead);
assert(v3.isValid === false && v3.errorCode === "INVALID_PHONE", "Số điện thoại sai định dạng: trả về INVALID_PHONE");

// 2.4 Short Name
const shortNameLead = {
  ...validLead,
  name: "A",
};
const v4 = LeadValidator.validate(shortNameLead);
assert(v4.isValid === false && v4.errorCode === "INVALID_NAME", "Họ tên quá ngắn: trả về INVALID_NAME");

// 2.5 Missing submission_id
const missingSubId = {
  ...validLead,
  submission_id: "",
};
const v5 = LeadValidator.validate(missingSubId);
assert(v5.isValid === false && v5.errorCode === "MISSING_SUBMISSION_ID", "Thiếu submission_id: trả về MISSING_SUBMISSION_ID");

console.log("\n==============================================================================");
console.log(`🎯 KẾT QUẢ KIỂM THỬ: ${passed} PASSED / ${failed} FAILED`);
console.log("==============================================================================");

if (failed > 0) process.exit(1);
