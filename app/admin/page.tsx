import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Acceso privado", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const store = await cookies();
  if (verifyAdminSession(store.get(ADMIN_COOKIE)?.value)) redirect("/admin/leads");
  return (
    <section className="adminShell">
      <div className="adminLoginCard">
        <p className="eyebrow">ALEJANDRO PUERTO TECHNOLOGY</p>
        <h1>Panel comercial</h1>
        <p>Acceso privado para seguimiento de leads y conversión.</p>
        <AdminLoginForm />
      </div>
    </section>
  );
}
