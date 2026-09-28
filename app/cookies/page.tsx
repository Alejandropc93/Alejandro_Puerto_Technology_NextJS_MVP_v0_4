import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de cookies", robots: { index: false, follow: true } };

export default function CookiesPage() {
  return (
    <section className="legalPage section">
      <div className="container legalContainer">
        <p className="eyebrow">PRIVACIDAD</p>
        <h1>Política de cookies y tecnologías equivalentes</h1>
        <p>Esta web utiliza almacenamiento local y de sesión del navegador. La analítica opcional, incluida Google Analytics 4, no se activa hasta que la persona usuaria la acepta.</p>
        <h2>1. Almacenamiento técnico</h2>
        <p><strong>apt_privacy_choice</strong> se guarda en almacenamiento local para recordar si has aceptado o rechazado la analítica. Su finalidad es estrictamente técnica: evitar pedir la misma elección en cada navegación.</p>
        <h2>2. Analítica propia opcional</h2>
        <p>Si aceptas la analítica, se utilizan identificadores de sesión y atribución de campaña en almacenamiento de sesión para medir visitas, uso de herramientas y conversiones de forma propia. Los elementos actuales son <strong>apt_session_id</strong> y <strong>apt_attribution</strong>, que desaparecen al finalizar la sesión del navegador.</p>
        <h2>3. Google Analytics 4</h2>
        <p>Con tu consentimiento también se activa Google Analytics 4, un servicio de medición de Google. Puede utilizar cookies y tecnologías equivalentes para generar estadísticas sobre navegación, páginas consultadas, origen de la visita y eventos de interacción. Esta integración se utiliza para análisis de audiencia y mejora del servicio, no para activar publicidad comportamental desde esta web.</p>
        <h2>4. Finalidad</h2>
        <p>La medición se utiliza para entender qué contenidos y herramientas resultan útiles, detectar recorridos que generan solicitudes y mejorar la experiencia y la conversión de la web.</p>
        <h2>5. Cómo cambiar tu elección</h2>
        <p>Puedes reabrir el panel de privacidad en cualquier momento desde el enlace “Configurar privacidad” del pie de página. Rechazar la analítica no impide utilizar los servicios principales de la web. Si revocas el consentimiento, la aplicación desactiva nuevos envíos de Google Analytics y elimina, cuando es técnicamente posible desde el navegador, las cookies de analítica accesibles por la web.</p>
        <h2>6. Terceros</h2>
        <p>La analítica propia se implementa mediante la aplicación y su base de datos. La analítica externa opcional se presta mediante Google Analytics 4. La configuración y este texto deben mantenerse alineados con el tratamiento real y revisarse si se incorporan nuevos proveedores o finalidades.</p>
      </div>
    </section>
  );
}
