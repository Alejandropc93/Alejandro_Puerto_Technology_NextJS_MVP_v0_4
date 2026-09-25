import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { LeadStatusSelect } from "@/components/LeadStatusSelect";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Leads", robots: { index: false, follow: false } };

type Lead = {
  id: string; created_at: string; name: string; email: string; profile: string; company: string | null;
  source: string; status: string; lead_score: number | null; lead_priority: string | null;
  health_score: number | null; health_band: string | null; utm_campaign: string | null; message: string;
};

export default async function LeadsPage() {
  const store = await cookies();
  if (!verifyAdminSession(store.get(ADMIN_COOKIE)?.value)) redirect("/admin");

  const supabase = getSupabaseAdmin();
  if (!supabase) return <section className="adminShell"><div className="adminPanel"><h1>Supabase no configurado</h1></div></section>;

  const [{ data: leadsData }, { data: eventsData }] = await Promise.all([
    supabase.from("leads").select("id,created_at,name,email,profile,company,source,status,lead_score,lead_priority,health_score,health_band,utm_campaign,message").order("created_at", { ascending: false }).limit(200),
    supabase.from("analytics_events").select("event_name,session_id,created_at").gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()).limit(10000),
  ]);

  const leads = (leadsData || []) as Lead[];
  const events = eventsData || [];
  const sessions = new Set(events.filter((e) => e.event_name === "page_view").map((e) => e.session_id).filter(Boolean));
  const leadEvents = events.filter((e) => e.event_name === "lead_submitted").length;
  const conversion = sessions.size ? ((leadEvents / sessions.size) * 100).toFixed(1) : "0.0";
  const high = leads.filter((lead) => lead.lead_priority === "high").length;
  const newLeads = leads.filter((lead) => lead.status === "new").length;

  return (
    <section className="adminShell adminLeadsShell">
      <div className="adminPanel">
        <div className="adminTop">
          <div><p className="eyebrow">PANEL COMERCIAL</p><h1>Leads y conversión</h1><p>Visión operativa de captación, prioridad y seguimiento.</p></div>
          <form action="/api/admin/logout" method="post"><button className="button buttonLight">Cerrar sesión</button></form>
        </div>

        <div className="adminMetrics">
          <div><span>Leads</span><strong>{leads.length}</strong><small>últimos 200</small></div>
          <div><span>Nuevos</span><strong>{newLeads}</strong><small>pendientes de contacto</small></div>
          <div><span>Alta prioridad</span><strong>{high}</strong><small>score ≥ 70</small></div>
          <div><span>Conversión 30d</span><strong>{conversion}%</strong><small>lead / sesión</small></div>
        </div>

        <div className="adminTableWrap">
          <table className="adminTable">
            <thead><tr><th>Fecha</th><th>Lead</th><th>Origen</th><th>Score</th><th>Health</th><th>Estado</th></tr></thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{new Date(lead.created_at).toLocaleDateString("es-ES")}</td>
                  <td><strong>{lead.name}</strong><span>{lead.email}</span><span>{lead.company || lead.profile}</span></td>
                  <td><strong>{lead.source}</strong><span>{lead.utm_campaign || "-"}</span></td>
                  <td><span className={`priorityPill ${lead.lead_priority || "low"}`}>{lead.lead_score ?? "-"} · {lead.lead_priority || "low"}</span></td>
                  <td>{lead.health_score !== null ? <><strong>{lead.health_score}/100</strong><span>{lead.health_band}</span></> : <span>-</span>}</td>
                  <td><LeadStatusSelect id={lead.id} initialStatus={lead.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
