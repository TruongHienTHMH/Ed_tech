import { NextRequest, NextResponse } from "next/server";
import { ContentFetcher } from "@/lib/cms/content-fetcher";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("force_refresh") === "true";

    if (forceRefresh) {
      ContentFetcher.invalidateCache();
    }

    const report = await ContentFetcher.getLiveSyncReport(forceRefresh);

    return NextResponse.json(report, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: unknown) {
    console.error("[Route Error /api/cms/sheets-data]:", (err as Error)?.message);
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "SYNC_ERROR",
          message: (err as Error)?.message || "Lỗi lấy dữ liệu từ Google Sheets.",
        },
      },
      { status: 500 }
    );
  }
}

