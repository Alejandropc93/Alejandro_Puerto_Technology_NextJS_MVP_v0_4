import Link from "next/link";

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const params = await searchParams;
  const health = params.source === "project-health-check";
  const planner = params.source === "delivery-planner";
  const executive = params.source === "executive-status-generator";
  const mvp = params.source === "mvp-planner";

  return (
    <main className="simplePage thankYouPage">
      <section className="container narrow thankYouCard">
        <p className="eyebrow">SOLICITUD RECIBIDA</p>
        <h1>{health ? "Gracias. Ya tengo también el contexto de tu diagnóstico." : mvp ? "Gracias. Ya tengo el contexto de tu MVP." : planner ? "Gracias. Ya tengo tu escenario de planificación." : executive ? "Gracias. Ya tengo tu status ejecutivo." : "Gracias por contactar."}</h1>
        <p>
          {health
            ? "Tu solicitud y el resultado del Project Health Check han quedado asociados para poder revisar el proyecto con contexto desde el primer contacto."
            : mvp
              ? "Tu solicitud y el brief generado en MVP Planner han quedado asociados para poder revisar alcance, prioridades, hipótesis y roadmap desde el primer contacto."
              : planner
                ? "Tu solicitud y el escenario generado en Delivery Planner han quedado asociados para poder revisar capacidad, fechas y supuestos con contexto."
                : executive
                  ? "Tu solicitud y el estado ejecutivo generado han quedado asociados para poder revisar el mensaje y su contexto antes de compartirlo."
                  : "Tu solicitud ha quedado registrada. Revisaré el contexto que me has enviado para poder responderte de forma útil y concreta."}
        </p>
        <div className="buttonRow">
          <Link className="button buttonPrimary" href="/">Volver al inicio <span>→</span></Link>
          <Link className="button buttonGhost" href="/tools">Ver herramientas</Link>
        </div>
      </section>
    </main>
  );
}
