import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { ContentFetcher } from "@/lib/cms/content-fetcher";
import { recordRevalidation } from "@/lib/cms/sync-state";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const tag = searchParams.get("tag");
    const path = searchParams.get("path");

    const expectedSecret = process.env.REVALIDATION_SECRET;

    if (!expectedSecret) {
      console.error("[Revalidate API] Lỗi cấu hình: Biến môi trường REVALIDATION_SECRET chưa được thiết lập trên server.");
      return NextResponse.json(
        {
          revalidated: false,
          error: {
            code: "SERVER_MISCONFIGURED",
            message: "Máy chủ chưa được cấu hình biến môi trường.",
          },
        },
        { status: 500 }
      );
    }

    // 1. Authenticate secret token
    if (!secret || secret.trim() !== expectedSecret.trim()) {
      return NextResponse.json(
        {
          revalidated: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Mã bí mật xác thực revalidation không hợp lệ.",
          },
        },
        { status: 401 }
      );
    }

    // 2. Perform Tag-based revalidation if tag is specified
    if (tag) {
      revalidateTag(tag, "max");
      ContentFetcher.invalidateCache(tag);
    }

    // 3. Perform Path-based revalidation if path is specified
    if (path) {
      revalidatePath(path);
      ContentFetcher.invalidateCache(path);
    }

    // If neither tag nor path is specified, invalidate all content cache
    if (!tag && !path) {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/blog");
      revalidateTag("cms", "max");
      revalidateTag("sheets", "max");
      ContentFetcher.invalidateCache();
    }

    // Ghi nhận mốc thời gian revalidation để SyncNotifier client nhận biết tức thì
    recordRevalidation();
    let freshData = null;
    try {
      const report = await ContentFetcher.getLiveSyncReport(true);
      freshData = report.rawTabs || {
        courses: report.courses,
        packages: report.packages,
        projects: report.studentProjects,
        testimonials: report.testimonials,
        blogs: report.blogPosts,
      };

      console.log("Script update new:", {
        source: "webhook_revalidate",
        timestamp: new Date().toISOString(),
        summary: {
          totalCourses: report.totalCourses,
          totalPackages: report.totalPackages,
          totalProjects: report.totalStudentProjects,
        },
        data: freshData,
      });
    } catch {
      // Bỏ qua lỗi kéo nền nếu có, không chặn response revalidate
    }

    return NextResponse.json({
      revalidated: true,
      tag: tag || null,
      path: path || null,
      now: Date.now(),
      message: "Làm mới bộ nhớ đệm (On-Demand ISR Revalidation) thành công.",
      data: freshData,
    });
  } catch (err: unknown) {
    console.error("[Route Error /api/revalidate]:", (err as Error)?.message);
    return NextResponse.json(
      {
        revalidated: false,
        error: {
          code: "INTERNAL_ERROR",
          message: (err as Error)?.message || "Lỗi xử lý revalidation.",
        },
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}

