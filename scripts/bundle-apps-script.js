/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * DataWithLy Apps Script Multi-Package Bundler
 * Node.js build tool: Đóng gói 2 packages độc lập:
 * 1. apps-script/cms   -> apps-script/cms/dist/Code.cms.bundle.gs & apps-script/dist/Code.bundle.gs
 * 2. apps-script/leads -> apps-script/leads/dist/Code.leads.bundle.gs
 */
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const appsScriptDir = path.join(rootDir, "apps-script");
const cmsDir = path.join(appsScriptDir, "cms");
const leadsDir = path.join(appsScriptDir, "leads");

// 1. ĐÓNG GÓI PACKAGE 1: CMS CONTENT MASTER
function bundleCmsPackage() {
  const targetDir = fs.existsSync(cmsDir) ? cmsDir : appsScriptDir;
  const distDir = path.join(targetDir, "dist");
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  const legacyDistDir = path.join(appsScriptDir, "dist");
  if (!fs.existsSync(legacyDistDir)) fs.mkdirSync(legacyDistDir, { recursive: true });

  const outputFile = path.join(distDir, "Code.cms.bundle.gs");
  const legacyOutputFile = path.join(legacyDistDir, "Code.bundle.gs");

  const htmlFiles = fs.readdirSync(targetDir).filter((f) => f.endsWith(".html")).sort();
  const inlinedHtmlMap = {};
  htmlFiles.forEach((file) => {
    const templateName = path.basename(file, ".html");
    const content = fs.readFileSync(path.join(targetDir, file), "utf8");
    inlinedHtmlMap[templateName] = content;
  });

  const gsFiles = fs.readdirSync(targetDir)
    .filter((f) => f.endsWith(".gs") && !f.endsWith(".bundle.gs"))
    .sort((a, b) => {
      const numA = parseInt(a.split("_")[0], 10);
      const numB = parseInt(b.split("_")[0], 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });

  let bundleContent = `/**
 * ==============================================================================
 * DATAWITHLY CMS CONTENT MASTER - GOOGLE APPS SCRIPT BUNDLE (ALL-IN-ONE)
 * ==============================================================================
 * Phiên bản: 2.2.0 (DataWithLy CMS Content Master)
 * Thời gian đóng gói: ${new Date().toISOString()}
 * ==============================================================================
 */

var INLINED_HTML = ${JSON.stringify(inlinedHtmlMap, null, 2)};

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

`;

  gsFiles.forEach((file) => {
    const filePath = path.join(targetDir, file);
    const code = fs.readFileSync(filePath, "utf8");
    bundleContent += `\n// ==============================================================================\n`;
    bundleContent += `// FILE NGUỒN: ${file}\n`;
    bundleContent += `// ==============================================================================\n\n`;
    bundleContent += code + "\n";
  });

  fs.writeFileSync(outputFile, bundleContent, "utf8");
  fs.writeFileSync(legacyOutputFile, bundleContent, "utf8");

  const totalLines = bundleContent.split("\n").length;
  const sizeKb = (Buffer.byteLength(bundleContent, "utf8") / 1024).toFixed(1);
  console.log(`🎉 [CMS] Đóng gói thành công Code.cms.bundle.gs: ${gsFiles.length} .gs, ${htmlFiles.length} .html, ${sizeKb} KB, ${totalLines} dòng`);
}

// 2. ĐÓNG GÓI PACKAGE 2: LEADS CRM
function bundleLeadsPackage() {
  if (!fs.existsSync(leadsDir)) return;
  const distDir = path.join(leadsDir, "dist");
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  const outputFile = path.join(distDir, "Code.leads.bundle.gs");
  const gsFiles = fs.readdirSync(leadsDir)
    .filter((f) => f.endsWith(".gs") && !f.endsWith(".bundle.gs"))
    .sort((a, b) => {
      const numA = parseInt(a.split("_")[0], 10);
      const numB = parseInt(b.split("_")[0], 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });

  let bundleContent = `/**
 * ==============================================================================
 * DATAWITHLY LEADS CRM - GOOGLE APPS SCRIPT BUNDLE (LIGHTWEIGHT & SECURE)
 * ==============================================================================
 * Phiên bản: 2.2.0 (DataWithLy Leads CRM Engine)
 * Thời gian đóng gói: ${new Date().toISOString()}
 * ==============================================================================
 */

function getLeadsSystemInfo() {
  return {
    system: "DataWithLy Leads CRM Engine",
    brand: "DataWithLy (Mentor Hứa Thảo Ly)",
    version: "2.2.0",
    architecture: "Standalone Leads CRM Bundle (Zero HTML Modals, Pure REST Backend)",
    status: "HEALTHY",
    timestamp: new Date().toISOString()
  };
}

`;

  gsFiles.forEach((file) => {
    const filePath = path.join(leadsDir, file);
    const code = fs.readFileSync(filePath, "utf8");
    bundleContent += `\n// ==============================================================================\n`;
    bundleContent += `// FILE NGUỒN: ${file}\n`;
    bundleContent += `// ==============================================================================\n\n`;
    bundleContent += code + "\n";
  });

  fs.writeFileSync(outputFile, bundleContent, "utf8");
  const totalLines = bundleContent.split("\n").length;
  const sizeKb = (Buffer.byteLength(bundleContent, "utf8") / 1024).toFixed(1);
  console.log(`🎉 [LEADS] Đóng gói thành công Code.leads.bundle.gs: ${gsFiles.length} .gs, 0 .html, ${sizeKb} KB, ${totalLines} dòng`);
}

bundleCmsPackage();
bundleLeadsPackage();
