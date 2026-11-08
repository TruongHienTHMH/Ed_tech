import { NextResponse } from "next/server";
import { HealthService } from "@/lib/services/health.service";

// Ensure this route is always dynamically evaluated
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const healthResult = await HealthService.checkHealth();
    const httpStatus = healthResult.status === "down" ? 503 : 200;

    return NextResponse.json(healthResult, {
      status: httpStatus,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        status: "down",
        timestamp: new Date().toISOString(),
        error: (err as Error)?.message || "Internal health check failure",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}

