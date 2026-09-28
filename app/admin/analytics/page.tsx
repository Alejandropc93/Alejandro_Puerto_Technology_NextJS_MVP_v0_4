import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Analítica", robots: { index: false, follow: false } };

type AnalyticsEvent = {
  created_at: string;
  event_name: string;
  session_id: string | null;
  path: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

type Lead = {
  created_at: string;
  source: string;
  status: string;
  utm_source: string | null;
  utm_campaign: string | null;
};

function percentage(value: number, total: number) {
  return total ? `${((value / total) * 100).toFixed(1)}%` : "0.0%";
}

function labelForSource(event: AnalyticsEvent) {
  if (event.utm_source) return event.utm_source.toLowerCase();
  const ref = event.referrer || "";
  if (ref.includes("linkedin")) return "linkedin";
  if (ref.includes("instagram")) return "instagram";
  if (ref.includes("google")) return "google";
  if (ref) return "referencia";
  return "directo";
}

function eventLabel(name: string) {
  const labels: Record<string, string> = {
    health_check_started: "Project Health Check",
    delivery_planner_started: "Delivery Planner",
    mvp_planner_started: "MVP Planner",
    executive_status_started: "Executive Status Generator",
    lead_magnet_started: "Project Kickoff Checklist",
  };
  return labels[name] || name;
}

export default async function AnalyticsPage() {
  const store = await cookies();
  if (!verifyAdminSession(store.get(ADMIN_COOKIE)?.value)) redirect("/admin");

  const supabase = getSupabaseAdmin();
  if (!supabase) return <section className="adminShell"><div className="adminPanel"><h1>Supabase no configurado</h1></div></section>;

  const from = new Date(Date.now() - 30 * 86400000).toISOString();
  const [{ data: eventData }, { data: leadData }] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("created_at,event_name,session_id,path,referrer,utm_source,utm_medium,utm_campaign")
      .gte("created_at", from)
      .order("created_at", { ascending: false })
      .limit(20000),
    supabase
      .from("leads")
      .select("created_at,source,status,utm_source,utm_campaign")
      .gte("created_at", from)
      .order("created_at", { ascending: false })
      .limit(5000),
  ]);

  const events = (eventData || []) as AnalyticsEvent[];
  const leads = (leadData || []) as Lead[];
  const pageViews = events.filter((e) => e.event_name === "page_view");
  const sessions = new Set(pageViews.map((e) => e.session_id).filter(Boolean));
  const conversion = percentage(leads.length, sessions.size);

  const sourceCounts = new Map<string, number>();
  for (const event of pageViews) {
    const source = labelForSource(event);
    sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1);
  }
  const topSources = [...sourceCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  const pageCounts = new Map<string, number>();
  for (const event of pageViews) {
    const path = (event.path || "/").split("?")[0];
    pageCounts.set(path, (pageCounts.get(path) || 0) + 1);
  }
  const topPages = [...pageCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  const toolStarts = events.filter((e) => e.event_name.endsWith("_started") && e.event_name !== "form_started");
  const toolCounts = new Map<string, number>();
  for (const event of toolStarts) toolCounts.set(event.event_name, (toolCounts.get(event.event_name) || 0) + 1);
  const topTools = [...toolCounts.entries()].sort((a, b) => b[1] - a[1]);

  const leadSourceCounts = new Map<string, number>();
  for (const lead of leads) leadSourceCounts.set(lead.source || "website", (leadSourceCounts.get(lead.source || "website") || 0) + 1);
  const topLeadSources = [...leadSourceCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  const daily = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (13 - i));
    const key = d.toISOString().slice(0, 10);
    const views = pageViews.filter((e) => e.created_at.slice(0, 10) === key).length;
    const dayLeads = leads.filter((e) => e.created_at.slice(0, 10) === key).length;
    return { key, label: d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" }), views, leads: dayLeads };
  });
  const maxDaily = Math.max(1, ...daily.map((d) => d.views));

  return (
    <section className="adminShell adminLeadsShell">
      <div className="adminPanel">
        <div className="adminTop">
          <div>
            <p className="eyebrow">APT ANALYTICS</p>
            <h1>Interacción y conversión</h1>
            <p>Actividad propia registrada con consentimiento durante los últimos 30 días.</p>
          </div>
          <div className="adminNav">
            <Link className="button buttonLight" href="/admin/leads">Leads</Link>
            <Link className="button buttonLight" href="/admin/launch">Launch</Link>
          </div>
        </div>

        <div className="adminMetrics analyticsMetrics">
          <div><span>Sesiones</span><strong>{sessions.size}</strong><small>sesiones con page view</small></div>
          <div><span>Páginas vistas</span><strong>{pageViews.length}</strong><small>últimos 30 días</small></div>
          <div><span>Leads</span><strong>{leads.length}</strong><small>captación total 30d</small></div>
          <div><span>Conversión</span><strong>{conversion}</strong><small>lead / sesión</small></div>
        </div>

        <div className="analyticsGrid">
          <article className="analyticsCard analyticsWide">
            <div className="analyticsCardHead"><div><span>EVOLUCIÓN</span><h2>Actividad de los últimos 14 días</h2></div><small>Page views / leads</small></div>
            <div className="analyticsBars" aria-label="Actividad diaria">
              {daily.map((day) => (
                <div className="analyticsBarItem" key={day.key} title={`${day.label}: ${day.views} vistas, ${day.leads} leads`}>
                  <div className="analyticsBarTrack"><span style={{ height: `${Math.max(3, (day.views / maxDaily) * 100)}%` }} /></div>
                  <strong>{day.views}</strong><small>{day.label}</small>{day.leads ? <em>{day.leads} lead{day.leads === 1 ? "" : "s"}</em> : null}
                </div>
              ))}
            </div>
          </article>

          <article className="analyticsCard">
            <div className="analyticsCardHead"><div><span>ADQUISICIÓN</span><h2>Origen de visitas</h2></div></div>
            <div className="analyticsRanking">
              {topSources.length ? topSources.map(([name, value]) => <div key={name}><span>{name}</span><strong>{value}</strong><small>{percentage(value, pageViews.length)}</small></div>) : <p>Aún no hay datos de visitas con consentimiento.</p>}
            </div>
          </article>

          <article className="analyticsCard">
            <div className="analyticsCardHead"><div><span>CONTENIDO</span><h2>Páginas más vistas</h2></div></div>
            <div className="analyticsRanking">
              {topPages.length ? topPages.map(([name, value]) => <div key={name}><span>{name}</span><strong>{value}</strong><small>{percentage(value, pageViews.length)}</small></div>) : <p>Aún no hay páginas vistas registradas.</p>}
            </div>
          </article>

          <article className="analyticsCard">
            <div className="analyticsCardHead"><div><span>APT LAB</span><h2>Herramientas iniciadas</h2></div></div>
            <div className="analyticsRanking">
              {topTools.length ? topTools.map(([name, value]) => <div key={name}><span>{eventLabel(name)}</span><strong>{value}</strong><small>inicios</small></div>) : <p>Aún no hay uso de herramientas registrado.</p>}
            </div>
          </article>

          <article className="analyticsCard">
            <div className="analyticsCardHead"><div><span>CONVERSIÓN</span><h2>Origen de leads</h2></div></div>
            <div className="analyticsRanking">
              {topLeadSources.length ? topLeadSources.map(([name, value]) => <div key={name}><span>{name}</span><strong>{value}</strong><small>{percentage(value, leads.length)}</small></div>) : <p>Aún no hay leads en el periodo.</p>}
            </div>
          </article>
        </div>

        <div className="analyticsNote">
          <strong>Dos capas de medición.</strong>
          <p>Este panel utiliza tu analítica propia de Supabase y solo refleja personas que han aceptado analítica. Google Analytics 4 se activa con el mismo consentimiento y aporta métricas adicionales de adquisición, usuarios, dispositivos y comportamiento en su propio panel.</p>
        </div>
      </div>
    </section>
  );
}
