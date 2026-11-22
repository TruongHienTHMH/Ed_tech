import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "../.env.local");
const envVars = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, "");
      envVars[key] = val;
    }
  });
}

async function main() {
  console.log("=== KIỂM THỬ LEADS GOOGLE APPS SCRIPT ===");
  const leadsUrl = envVars.GOOGLE_APPS_SCRIPT_LEADS_URL;
  const leadsSecret = envVars.GOOGLE_APPS_SCRIPT_LEADS_SECRET;

  console.log("URL:", leadsUrl);
  console.log("Secret:", leadsSecret);

  console.log("\n1. Gửi GET ping...");
  try {
    const pingRes = await fetch(`${leadsUrl}?action=ping`, { redirect: "follow" });
    const pingText = await pingRes.text();
    console.log("Ping Status:", pingRes.status);
    console.log("Ping Body:", pingText);
  } catch (e) {
    console.error("Ping error:", e.message);
  }

  console.log("\n2. Gửi POST submit_lead...");
  try {
    const payload = {
      action: "submit_lead",
      secret: leadsSecret,
      submission_id: `test_${Date.now()}`,
      client_submitted_at: new Date().toISOString(),
      name: "Nguyễn Văn Test",
      phone: "0912345678",
      email: "test@example.com",
      course_id: "sql-for-data-analytics",
      course_name: "SQL for Data Analytics",
      coaching_course: "SQL for Data Analytics",
      preferred_date: "Thứ 2",
      preferred_time_slot: "10h - 10h30",
      attendance_commitment: "Tôi chắc chắn",
      target_or_goal: "Test ghi data",
      message: "Lead test kiểm tra lỗi 502",
      status: "NEW",
    };

    const postRes = await fetch(leadsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    console.log("POST Status:", postRes.status);
    const postText = await postRes.text();
    console.log("POST Body (first 1000 chars):", postText.substring(0, 1000));
  } catch (e) {
    console.error("POST error:", e.message);
  }
}

main();
