import type { Metadata } from "next";
import Link from "next/link";
import { legal, hasCompleteLegalIdentity } from "@/lib/legal";

export const metadata: Metadata = { title: "Aviso legal", robots: { index: false, follow: true } };

export default function LegalNoticePage() {
  const ready = hasCompleteLegalIdentity();
  return (
    <section className="legalPage section">
      <div className="container legalContainer">
        <p className="eyebrow">INFORMACIÓN LEGAL</p>
        <h1>Aviso legal</h1>
        {!ready ? <div className="legalWarning"><strong>Pendiente antes del lanzamiento.</strong><p>Completa en Vercel las variables legales indicadas en el checklist de lanzamiento.</p></div> : null}
        <h2>1. Titular del sitio</h2>
        <p><strong>Nombre / titular:</strong> {legal.owner}</p>
        <p><strong>Nombre comercial:</strong> {legal.businessName}</p>
        <p><strong>NIF:</strong> {legal.nif}</p>
        <p><strong>Domicilio:</strong> {legal.address}</p>
        <p><strong>Correo electrónico:</strong> {legal.email}</p>
        <h2>2. Objeto</h2>
        <p>Este sitio presenta servicios profesionales relacionados con consultoría tecnológica, delivery, mentoring, formación y herramientas de apoyo a la gestión de proyectos y productos digitales.</p>
        <h2>3. Condiciones de uso</h2>
        <p>El acceso y uso de la web implica actuar de forma lícita y responsable. Los contenidos tienen finalidad informativa y no sustituyen un análisis profesional específico para cada proyecto, organización o situación.</p>
        <h2>4. Propiedad intelectual</h2>
        <p>Salvo indicación en contrario, los contenidos, textos, herramientas, diseños y recursos propios de Alejandro Puerto Technology están protegidos por la normativa aplicable. No se autoriza su explotación comercial, reproducción sistemática o redistribución sin permiso previo.</p>
        <h2>5. Enlaces y terceros</h2>
        <p>La web puede incluir enlaces a servicios de terceros. Alejandro Puerto Technology no controla sus contenidos, disponibilidad ni políticas externas.</p>
        <h2>6. Responsabilidad</h2>
        <p>Se procura mantener la información actualizada y el servicio disponible, pero no se garantiza la ausencia total de errores, interrupciones o incidencias técnicas. Las herramientas de APT Lab ofrecen estimaciones y marcos de apoyo a la decisión, no garantías de resultado.</p>
        <h2>7. Privacidad</h2>
        <p>El tratamiento de datos personales se describe en la <Link href="/privacidad">Política de privacidad</Link> y el uso de cookies o tecnologías equivalentes en la <Link href="/cookies">Política de cookies</Link>.</p>
      </div>
    </section>
  );
}
