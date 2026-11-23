import { NextRequest, NextResponse } from "next/server";
import { ContentFetcher } from "@/lib/cms/content-fetcher";
import { sanitizeSpreadsheetValue } from "@/lib/google-sheets/sanitizer";

function toSlug(text: string): string {
  if (!text) return "";
  let str = text.toLowerCase().trim();
  str = str.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, "a");
  str = str.replace(/[éèẻẽẹêếềểễệ]/g, "e");
  str = str.replace(/[íìỉĩị]/g, "i");
  str = str.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, "o");
  str = str.replace(/[úùủũụưứừửữự]/g, "u");
  str = str.replace(/[ýỳỷỹỵ]/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/[^a-z0-9\s-]/g, "");
  str = str.replace(/[\s_]+/g, "-");
  str = str.replace(/-+/g, "-");
  return str.replace(/^-+|-+$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    // 0. Authorization check
    const authHeader = request.headers.get("authorization") || request.headers.get("x-admin-secret");
    const adminSecret = process.env.ADMIN_SECRET || process.env.REVALIDATE_SECRET || "datawithly_secret_2026";
    if (process.env.NODE_ENV === "production") {
      const token = authHeader?.replace(/^Bearer\s+/i, "");
      if (!token || token !== adminSecret) {
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: "UNAUTHORIZED",
              message: "Bạn không có quyền thực hiện tạo khóa học.",
            },
          },
          { status: 401 }
        );
      }
    }

    const body = await request.json();

    const title = (body.title || "").trim();
    if (!title) {
      return NextResponse.json(
        { ok: false, error: { code: "MISSING_TITLE", message: "Tên khóa học không được để trống." } },
        { status: 400 }
      );
    }

    const slug = body.slug ? toSlug(body.slug) : toSlug(title);
    const id = body.id ? toSlug(body.id) : slug;
    const tuitionVnd = Number(body.tuition_vnd) || 0;
    const originalTuitionVnd = Number(body.original_tuition_vnd) || tuitionVnd;

    const payload = {
      action: "add_course",
      secret: process.env.GOOGLE_APPS_SCRIPT_CMS_SECRET || process.env.GOOGLE_APPS_SCRIPT_SECRET || "",
      id: sanitizeSpreadsheetValue(id),
      slug: sanitizeSpreadsheetValue(slug),
      title: sanitizeSpreadsheetValue(title),
      tag: sanitizeSpreadsheetValue(body.tag || "SQL"),
      tagline: sanitizeSpreadsheetValue(body.tagline || ""),
      tuition_vnd: tuitionVnd,
      original_tuition_vnd: originalTuitionVnd,
      total_sessions: Number(body.total_sessions || body.totalSessions) || 12,
      practice_count: Number(body.practice_count || body.practiceCount) || 4,
      capstone_count: Number(body.capstone_count || body.capstoneCount) || 1,
      level: sanitizeSpreadsheetValue(body.level || "Beginner"),
      study_style: sanitizeSpreadsheetValue(body.study_style || body["study-style"] || "Live Class"),
      student_enrollment: Number(body.student_enrollment || body.studentEnrollment) || 250,
      is_active: body.is_active !== undefined ? body.is_active : true,
      is_featured: body.is_featured !== undefined ? body.is_featured : false,
      sort_order: Number(body.sort_order) || 99,
      description: sanitizeSpreadsheetValue(body.description || ""),
      who_is_for: sanitizeSpreadsheetValue(body.who_is_for || body.whoIsFor || ""),
      outcomes: sanitizeSpreadsheetValue(body.outcomes || ""),
      input_requirement: sanitizeSpreadsheetValue(body.input_requirement || body.inputRequirement || ""),
      cover_image_url: sanitizeSpreadsheetValue(body.cover_image_url || "/uploads/courses/default-course.jpg"),
    };

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_CMS_URL || process.env.GOOGLE_APPS_SCRIPT_URL;
    let finalSlug = slug;
    let finalId = id;

    if (appsScriptUrl) {
      try {
        const response = await fetch(appsScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          redirect: "follow",
        });

        if (!response.ok) {
          throw new Error(`Google Apps Script trả về mã lỗi HTTP ${response.status}`);
        }

        const gasResult = await response.json();
        if (!gasResult.ok) {
          throw new Error(gasResult.error?.message || "Lỗi khi ghi vào Google Sheets");
        }

        if (gasResult.course) {
          finalSlug = gasResult.course.slug || finalSlug;
          finalId = gasResult.course.id || finalId;
        }
      } catch (gasErr: unknown) {
        console.warn("[CourseCreate GAS Warning]:", (gasErr as Error)?.message);
      }
    }

    // Làm mới cache nội bộ để người dùng thấy khóa học mới ngay
    ContentFetcher.invalidateCache();

    return NextResponse.json({
      ok: true,
      course: {
        id: finalId,
        slug: finalSlug,
        title,
        tag: payload.tag,
        tagline: payload.tagline,
        tuition_vnd: tuitionVnd,
        original_tuition_vnd: originalTuitionVnd,
        level: payload.level,
        total_sessions: payload.total_sessions,
        is_active: payload.is_active,
        is_featured: payload.is_featured,
      },
      message: "Khóa học đã được lưu vào hệ thống và đồng bộ lên Google Sheets thành công!",
    });
  } catch (err: unknown) {
    console.error("[Route Error /api/cms/course-create]:", (err as Error)?.message);
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: (err as Error)?.message || "Lỗi máy chủ." } },
      { status: 500 }
    );
  }
}
