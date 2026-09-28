import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de cookies", robots: { index: false, follow: true } };

export default function CookiesPage() {
  return (
    <section className="legalPage section">
      <div className="container legalContainer">
        <p className="eyebrow">PRIVACIDAD</p>
        <h1>Política de cookies y tecnologías equivalentes</h1>
        <p>Esta web utiliza almacenamiento local y de sesión del navegador. No activamos la medición propia de audiencia hasta que la persona usuaria la acepta.</p>
        <h2>1. Almacenamiento técnico</h2>
        <p><strong>apt_privacy_choice</strong> se guarda en almacenamiento local para recordar si has aceptado o rechazado la analítica. Su finalidad es estrictamente técnica: evitar pedir la misma elección en cada navegación.</p>
        <h2>2. Analítica opcional</h2>
        <p>Si aceptas la analítica, se utilizan identificadores de sesión y atribución de campaña en almacenamiento de sesión para medir visitas, uso de herramientas y conversiones de forma propia. Los elementos actuales son <strong>apt_session_id</strong> y <strong>apt_attribution</strong>, que desaparecen al finalizar la sesión del navegador.</p>
        <h2>3. Finalidad</h2>
        <p>La medición se utiliza para entender qué contenidos y herramientas resultan útiles, detectar recorridos que generan solicitudes y mejorar la experiencia. No se utiliza para publicidad comportamental.</p>
        <h2>4. Cómo cambiar tu elección</h2>
        <p>Puedes reabrir el panel de privacidad en cualquier momento desde el enlace “Configurar privacidad” del pie de página. Rechazar la analítica no impide utilizar los servicios principales de la web.</p>
        <h2>5. Terceros</h2>
        <p>La medición funcional descrita en esta política se implementa mediante la propia aplicación y su base de datos. Si en el futuro se incorporan herramientas de terceros que requieran consentimiento, esta política y el panel de preferencias deberán actualizarse antes de activarlas.</p>
      </div>
    </section>
  );
}
