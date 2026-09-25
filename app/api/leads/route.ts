import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { notifyNewLead } from "@/lib/lead-notification";

type HealthCheckPayload = {
  score?: number;
  band?: string;
  answers?: Record<string, number>;
  weakestAreas?: string[];
};

const allowedProfiles = new Set(["empresa", "emprendedor", "profesional"]);
const allowedSources = new Set(["website", "contact", "project-health-check"]);

function emailLooksValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanText(value: unknown, max = 1000) {
  return String(value ?? "").trim().slice(0, max);
}

function normaliseHealthCheck(value: unknown): HealthCheckPayload | null {
  if (!value || typeof value !== "object") return null;
  const input = value as HealthCheckPayload;
  const score = Number(input.score);
  const answers = input.answers && typeof input.answers === "object" ? input.answers : undefined;
  const validAnswers = answers
    ? Object.fromEntries(
        Object.entries(answers)
          .filter(([, answer]) => Number.isInteger(answer) && answer >= 1 && answer <= 5)
          .slice(0, 20)
      )
    : undefined;

  if (!Number.isFinite(score) || score < 0 || score > 100) return null;

  return {
    score: Math.round(score),
    band: cleanText(input.band, 40),
    answers: validAnswers,
    weakestAreas: Array.isArray(input.weakestAreas)
      ? input.weakestAreas.map((area) => cleanText(area, 60)).filter(Boolean).slice(0, 5)
      : [],
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (cleanText(body.website, 200)) {
      return NextResponse.json({ ok: true, persisted: false });
    }

    const name = cleanText(body.name, 120);
    const email = cleanText(body.email, 180).toLowerCase();
    const rawProfile = cleanText(body.profile, 40);
    const profile = allowedProfiles.has(rawProfile) ? rawProfile : "profesional";
    const company = cleanText(body.company, 180);
    const sourceInput = cleanText(body.source, 60);
    const source = allowedSources.has(sourceInput) ? sourceInput : "website";
    const healthCheck = normaliseHealthCheck(body.healthCheck);
    const suppliedMessage = cleanText(body.message, 4000);
    const message = suppliedMessage || (healthCheck
      ? `Solicitud de revisión tras Project Health Check (${healthCheck.score}/100 - ${healthCheck.band || "sin clasificación"}).`
      : "");
    const consent = body.consent === "yes" || body.consent === true;

    const attribution = {
      utm_source: cleanText(body.utmSource, 180) || null,
      utm_medium: cleanText(body.utmMedium, 180) || null,
      utm_campaign: cleanText(body.utmCampaign, 220) || null,
      utm_content: cleanText(body.utmContent, 220) || null,
      utm_term: cleanText(body.utmTerm, 220) || null,
      landing_page: cleanText(body.landingPage, 1000) || null,
      referrer: cleanText(body.referrer, 1000) || null,
      cta: cleanText(body.cta, 120) || null,
    };

    if (name.length < 2 || !emailLooksValid(email) || message.length < 10 || !consent) {
      return NextResponse.json(
        { error: "Revisa los campos obligatorios y el consentimiento." },
        { status: 400 }
      );
    }

    const lead = {
      name,
      email,
      profile,
      company: company || null,
      message,
      consent_at: new Date().toISOString(),
      source,
      status: "new",
      health_score: healthCheck?.score ?? null,
      health_band: healthCheck?.band || null,
      metadata: healthCheck ? { project_health_check: healthCheck } : {},
      ...attribution,
    };

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.info("[APT lead - demo mode]", lead);
      return NextResponse.json({ ok: true, persisted: false, notified: false });
    }

    const { data, error } = await supabase
      .from("leads")
      .insert(lead)
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Supabase lead insert failed", error);
      return NextResponse.json({ error: "No se pudo registrar la solicitud." }, { status: 500 });
    }

    let notified = false;
    try {
      const result = await notifyNewLead({ ...lead, id: data.id });
      notified = result.sent;
      if (notified) {
        await supabase.from("leads").update({ notified_at: new Date().toISOString() }).eq("id", data.id);
      }
    } catch (notificationError) {
      console.error("Lead saved but notification failed", notificationError);
    }

    return NextResponse.json({ ok: true, persisted: true, notified, leadId: data.id });
  } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 });
  }
}
