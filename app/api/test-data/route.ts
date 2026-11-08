import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "DataWithLy Test Data API",
    timestamp: new Date().toISOString(),
  });
}
