type LeadForNotification = {
  id?: string;
  name: string;
  email: string;
  profile: string;
  company?: string | null;
  message: string;
  source: string;
  health_score?: number | null;
  health_band?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  landing_page?: string | null;
  lead_score?: number | null;
  lead_priority?: string | null;
};

function esc(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function notifyNewLead(lead: LeadForNotification) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_TO;
  const from = process.env.LEAD_NOTIFICATION_FROM;

  if (!apiKey || !to || !from) {
    return { sent: false, reason: "notification_not_configured" } as const;
  }

  const health = lead.health_score != null
    ? `<tr><td><strong>Health Check</strong></td><td>${esc(lead.health_score)}/100 · ${esc(lead.health_band)}</td></tr>`
    : "";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Nuevo lead APT · ${lead.name} · ${lead.source}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#0b1f33;max-width:680px;margin:auto">
          <h2>Nuevo lead en Alejandro Puerto Technology</h2>
          <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">
            <tr><td><strong>Nombre</strong></td><td>${esc(lead.name)}</td></tr>
            <tr><td><strong>Email</strong></td><td>${esc(lead.email)}</td></tr>
            <tr><td><strong>Perfil</strong></td><td>${esc(lead.profile)}</td></tr>
            <tr><td><strong>Empresa / proyecto</strong></td><td>${esc(lead.company || "-")}</td></tr>
            <tr><td><strong>Origen</strong></td><td>${esc(lead.source)}</td></tr>
            <tr><td><strong>Prioridad comercial</strong></td><td>${esc(lead.lead_score ?? "-")}/100 · ${esc(lead.lead_priority || "-")}</td></tr>
            ${health}
            <tr><td><strong>UTM source</strong></td><td>${esc(lead.utm_source || "-")}</td></tr>
            <tr><td><strong>UTM medium</strong></td><td>${esc(lead.utm_medium || "-")}</td></tr>
            <tr><td><strong>UTM campaign</strong></td><td>${esc(lead.utm_campaign || "-")}</td></tr>
            <tr><td><strong>Página de entrada</strong></td><td>${esc(lead.landing_page || "-")}</td></tr>
          </table>
          <h3>Mensaje</h3>
          <p style="white-space:pre-wrap">${esc(lead.message)}</p>
          <p style="font-size:12px;color:#607080">Lead ID: ${esc(lead.id || "-")}</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Lead notification failed", response.status, detail.slice(0, 500));
    return { sent: false, reason: "provider_error" } as const;
  }

  return { sent: true } as const;
}
