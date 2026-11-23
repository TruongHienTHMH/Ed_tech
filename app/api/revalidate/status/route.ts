import { NextResponse } from "next/server";
import { getLastRevalidatedTimestamp } from "@/lib/cms/sync-state";

export const dynamic = "force-dynamic";

export async function GET() {
  const lastRevalidatedAt = getLastRevalidatedTimestamp();

  return NextResponse.json(
    {
      ok: true,
      lastRevalidatedAt,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
