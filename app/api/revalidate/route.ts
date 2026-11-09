import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { ContentFetcher } from "@/lib/cms/content-fetcher";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const tag = searchParams.get("tag");
    const path = searchParams.get("path");

    const expectedSecret = process.env.REVALIDATION_SECRET || "datawithly_secure_reval_token_2026";

    // 1. Authenticate secret token
    if (!secret || secret !== expectedSecret) {
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
      revalidatePath("/");
      revalidatePath("/", "layout");
      revalidateTag("cms", "max");
      ContentFetcher.invalidateCache();
    }

    return NextResponse.json({
      revalidated: true,
      tag: tag || null,
      path: path || null,
      now: Date.now(),
      message: "Làm mới bộ nhớ đệm (On-Demand ISR Revalidation) thành công.",
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

