import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import { hasCompleteLegalIdentity } from "@/lib/legal";
import { getSiteUrl } from "@/lib/url";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Launch readiness", robots: { index: false, follow: false } };

export default async function LaunchReadinessPage() {
  const store = await cookies();
  if (!verifyAdminSession(store.get(ADMIN_COOKIE)?.value)) redirect("/admin");

  const checks = [
    ["Dominio de producción", Boolean(process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")), getSiteUrl()],
    ["Identidad legal pública", hasCompleteLegalIdentity(), "Titular, NIF, domicilio y email"],
    ["Supabase", Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY), "Captación y analítica"],
    ["Notificación de leads", Boolean(process.env.RESEND_API_KEY && process.env.LEAD_NOTIFICATION_TO && process.env.LEAD_NOTIFICATION_FROM), "Resend"],
    ["Panel privado", Boolean(process.env.ADMIN_DASHBOARD_PASSWORD && process.env.ADMIN_DASHBOARD_SECRET), "Acceso /admin"],
    ["Google Analytics 4", Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-RZWFFNLKBG"), process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-RZWFFNLKBG"],
  ] as const;

  const ready = checks.every(([, ok]) => ok);

  return (
    <section className="adminShell adminLeadsShell">
      <div className="adminPanel">
        <div className="adminTop">
          <div><p className="eyebrow">LANZAMIENTO</p><h1>Production readiness</h1><p>Validación rápida de configuración antes de promocionar públicamente la web.</p></div>
          <div className="adminNav"><Link className="button buttonLight" href="/admin/leads">Leads</Link><Link className="button buttonLight" href="/admin/analytics">Analítica</Link></div>
        </div>
        <div className={`launchStatus ${ready ? "ready" : "pending"}`}><strong>{ready ? "Configuración base lista" : "Quedan puntos pendientes"}</strong><span>{ready ? "Haz ahora pruebas end-to-end y revisión legal final." : "Completa los elementos marcados antes del lanzamiento."}</span></div>
        <div className="launchChecks">
          {checks.map(([label, ok, note]) => <div key={label}><span className={ok ? "checkOk" : "checkPending"}>{ok ? "✓" : "!"}</span><div><strong>{label}</strong><small>{note}</small></div></div>)}
        </div>
        <div className="legalWarning"><strong>Revisión humana obligatoria.</strong><p>Las páginas legales incluidas son una base operativa para el lanzamiento. Antes de publicar comercialmente, revisa que reflejen tu situación fiscal/profesional, tus contratos con proveedores y el tratamiento real de datos.</p></div>
      </div>
    </section>
  );
}
