/* eslint-disable @typescript-eslint/no-require-imports */
const ts = require("typescript");
const fs = require("fs");

const fileContent = fs.readFileSync("lib/security/rate-limiter.ts", "utf8");
const transpiled = ts.transpileModule(fileContent, {
  compilerOptions: { module: ts.ModuleKind.CommonJS }
}).outputText;

const moduleExports = {};
const moduleFunc = new Function("exports", transpiled);
moduleFunc(moduleExports);

const InMemoryRateLimiter = moduleExports.InMemoryRateLimiter;

console.log("🧪 Bắt đầu kiểm thử InMemoryRateLimiter (Quy tắc BR-09)...");
const testIp = "192.168.1.99";

const r1 = InMemoryRateLimiter.check(testIp, 3, 60000);
console.log(`Req 1 -> Allowed: ${r1.allowed}, Remaining: ${r1.remaining}`);
if (!r1.allowed || r1.remaining !== 2) throw new Error("Req 1 failed");

const r2 = InMemoryRateLimiter.check(testIp, 3, 60000);
console.log(`Req 2 -> Allowed: ${r2.allowed}, Remaining: ${r2.remaining}`);
if (!r2.allowed || r2.remaining !== 1) throw new Error("Req 2 failed");

const r3 = InMemoryRateLimiter.check(testIp, 3, 60000);
console.log(`Req 3 -> Allowed: ${r3.allowed}, Remaining: ${r3.remaining}`);
if (!r3.allowed || r3.remaining !== 0) throw new Error("Req 3 failed");

const r4 = InMemoryRateLimiter.check(testIp, 3, 60000);
console.log(`Req 4 -> Allowed: ${r4.allowed}, Remaining: ${r4.remaining}, ResetMs: ${r4.resetMs}`);
if (r4.allowed) throw new Error("Req 4 should have been blocked!");

const rOther = InMemoryRateLimiter.check("10.0.0.1", 3, 60000);
console.log(`Other IP -> Allowed: ${rOther.allowed}, Remaining: ${rOther.remaining}`);
if (!rOther.allowed) throw new Error("Different IP should be independent!");

console.log("🎉 TẤT CẢ KIỂM THỬ BR-09 RATE LIMITER ĐÃ PASS 100%!");
