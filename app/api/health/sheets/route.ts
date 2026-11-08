import { NextResponse } from "next/server";
import { HealthService } from "@/lib/services/health.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const healthResult = await HealthService.checkHealth();
    const sheetsData = healthResult.services.googleSheets;

    return NextResponse.json(
      {
        service: "google_sheets",
        status: sheetsData.status,
        latency_ms: sheetsData.latencyMs,
        message: sheetsData.message,
        timestamp: healthResult.timestamp,
      },
      {
        status: sheetsData.status === "down" ? 503 : 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        service: "google_sheets",
        status: "down",
        error: (err as Error)?.message || "Sheets health check failure",
      },
      { status: 503 }
    );
  }
}

