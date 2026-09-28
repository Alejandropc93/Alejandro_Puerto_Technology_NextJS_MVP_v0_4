import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminCookieOptions, createAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const configured = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!configured || !process.env.ADMIN_DASHBOARD_SECRET) {
    return NextResponse.json({ error: "Panel no configurado" }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  if (String(body.password || "") !== configured) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, createAdminSession(), adminCookieOptions);
  return NextResponse.json({ ok: true });
}
