import { NextResponse } from "next/server";
import { SheetsClient } from "@/lib/cms/sheets-client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const diagnostic = await SheetsClient.diagnoseConnection();

    return NextResponse.json(diagnostic, {
      status: diagnostic.overallHealth === "down" ? 503 : 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        overallHealth: "down",
        error: (err as Error)?.message || "Diagnostic failure",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
