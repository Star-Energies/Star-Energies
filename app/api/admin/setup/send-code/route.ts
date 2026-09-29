import { NextResponse } from "next/server";

import { requestAdministratorOnboardingCode } from "@/lib/admin-setup";

export const runtime = "nodejs";

function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(0, 100) || "unknown";
}

export async function POST(request: Request) {
  const result = await requestAdministratorOnboardingCode(getClientIp(request));
  if (!result.ok) return NextResponse.json({ message: result.message }, { status: result.status });

  return NextResponse.json({ ok: true }, { status: 201 });
}
