import type { Metadata } from "next";
import Link from "next/link";
import { legal, hasCompleteLegalIdentity } from "@/lib/legal";

export const metadata: Metadata = { title: "Política de privacidad", robots: { index: false, follow: true } };

export default function PrivacyPage() {
  const ready = hasCompleteLegalIdentity();
  return (
    <section className="legalPage section">
      <div className="container legalContainer">
        <p className="eyebrow">PRIVACIDAD</p>
        <h1>Política de privacidad</h1>
        {!ready ? <div className="legalWarning"><strong>Pendiente antes del lanzamiento.</strong><p>Completa la identidad legal y el correo de contacto en Vercel.</p></div> : null}
        <h2>1. Responsable del tratamiento</h2>
        <p><strong>Responsable:</strong> {legal.owner}</p>
        <p><strong>Nombre comercial:</strong> {legal.businessName}</p>
        <p><strong>NIF:</strong> {legal.nif}</p>
        <p><strong>Dirección:</strong> {legal.address}</p>
        <p><strong>Contacto:</strong> {legal.email}</p>
        <h2>2. Datos tratados y finalidades</h2>
        <p>Cuando utilizas formularios de contacto, APT Lab o recursos descargables podemos tratar los datos que facilitas: nombre, email, empresa o proyecto, perfil, mensaje y el contexto que decidas compartir. También pueden asociarse datos de procedencia de campaña y resultados generados por las herramientas cuando solicitas una revisión.</p>
        <p>Las finalidades son responder a solicitudes, prestar los recursos solicitados, realizar seguimiento comercial solicitado por la persona usuaria y mejorar el funcionamiento de la web y sus herramientas cuando exista consentimiento para analítica.</p>
        <h2>3. Base jurídica</h2>
        <p>La base jurídica dependerá del tratamiento: consentimiento para solicitudes voluntarias y analítica opcional; aplicación de medidas precontractuales cuando una persona solicita información o una propuesta; y cumplimiento de obligaciones legales cuando resulte aplicable.</p>
        <h2>4. Conservación</h2>
        <p>Los datos se conservarán durante el tiempo necesario para atender la solicitud y gestionar la relación potencial o efectiva, y posteriormente durante los plazos exigibles para atender responsabilidades legales. Los datos de analítica se limitarán a lo necesario para medición y mejora del servicio.</p>
        <h2>5. Proveedores tecnológicos</h2>
        <p>Para operar la web se utilizan proveedores de infraestructura, base de datos y correo transaccional, actualmente Vercel, Supabase y Resend. Deben mantenerse configurados bajo condiciones contractuales y garantías adecuadas al tratamiento realizado.</p>
        <h2>6. Derechos</h2>
        <p>Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad cuando corresponda, y retirar un consentimiento previamente otorgado escribiendo a {legal.email}. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos.</p>
        <h2>7. Formularios y decisiones automatizadas</h2>
        <p>El lead scoring interno sirve únicamente para priorizar seguimiento comercial y no produce decisiones con efectos jurídicos ni equivalentes sobre las personas. Las herramientas de APT Lab generan orientaciones y estimaciones que deben interpretarse con criterio profesional.</p>
        <h2>8. Cookies y tecnologías equivalentes</h2>
        <p>Consulta la <Link href="/cookies">Política de cookies</Link> para conocer el almacenamiento técnico y la analítica opcional.</p>
      </div>
    </section>
  );
}
