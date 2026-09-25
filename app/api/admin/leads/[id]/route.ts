import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const allowedStatuses = new Set(["new", "contacted", "qualified", "proposal", "won", "lost"]);

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const store = await cookies();
  if (!verifyAdminSession(store.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const status = String(body.status || "");
  if (!allowedStatuses.has(status)) return NextResponse.json({ error: "Estado no válido" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 503 });

  const { error } = await supabase.from("leads").update({ status, status_updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
