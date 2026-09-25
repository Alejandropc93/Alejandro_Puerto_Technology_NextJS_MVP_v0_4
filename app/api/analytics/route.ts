import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const allowedEvents = new Set(["page_view", "form_started", "lead_submitted", "health_check_started", "health_check_completed"]);

function clean(value: unknown, max = 500) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const eventName = clean(body.eventName, 60);
    if (!allowedEvents.has(eventName)) return NextResponse.json({ ok: false }, { status: 400 });

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ ok: true, persisted: false });

    const event = {
      event_name: eventName,
      session_id: clean(body.sessionId, 80) || null,
      path: clean(body.path, 700) || null,
      referrer: clean(body.referrer, 1000) || null,
      utm_source: clean(body.utmSource, 180) || null,
      utm_medium: clean(body.utmMedium, 180) || null,
      utm_campaign: clean(body.utmCampaign, 220) || null,
      metadata: body.metadata && typeof body.metadata === "object" ? body.metadata : {},
    };

    const { error } = await supabase.from("analytics_events").insert(event);
    if (error) {
      console.error("Analytics insert failed", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true, persisted: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
