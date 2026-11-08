import { NextRequest, NextResponse } from "next/server";
import { LeadService } from "@/lib/modules/leads/lead.service";
import { LeadInputDto } from "@/lib/modules/leads/types";
import { InMemoryRateLimiter } from "@/lib/security/rate-limiter";

export async function POST(request: NextRequest) {
  try {
    // 1. IP Rate Limiting (BR-09: Tối đa 3 lần/phút/IP)
    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "127.0.0.1";
    const rateLimit = InMemoryRateLimiter.check(clientIp, 3, 60000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: `Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ${Math.ceil(rateLimit.resetMs / 1000)} giây.`,
          },
        },
        { status: 429 }
      );
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "INVALID_CONTENT_TYPE",
            message: "Yêu cầu phải có định dạng application/json.",
          },
        },
        { status: 400 }
      );
    }

    const body = (await request.json()) as LeadInputDto;
    const result = await LeadService.processLead(body);

    if (result.ok) {
      return NextResponse.json(result, { status: 200 });
    }

    const statusMap: Record<string, number> = {
      VALIDATION_FAILED: 400,
      MISSING_SUBMISSION_ID: 400,
      INVALID_NAME: 400,
      INVALID_PHONE: 400,
      INVALID_EMAIL: 400,
      MESSAGE_TOO_LONG: 400,
      APPS_SCRIPT_TIMEOUT: 504,
      SHEET_UNAVAILABLE: 502,
    };

    const httpStatus = statusMap[result.error?.code || ""] || 500;
    return NextResponse.json(result, { status: httpStatus });
  } catch (error: unknown) {
    console.error("[Route Error /api/leads]:", (error as Error)?.message);
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "SERVER_ERROR",
          message: "Lỗi xử lý yêu cầu phía máy chủ.",
        },
      },
      { status: 500 }
    );
  }
}
