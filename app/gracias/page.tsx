import Link from "next/link";

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const params = await searchParams;
  const health = params.source === "project-health-check";

  return (
    <main className="simplePage thankYouPage">
      <section className="container narrow thankYouCard">
        <p className="eyebrow">SOLICITUD RECIBIDA</p>
        <h1>{health ? "Gracias. Ya tengo también el contexto de tu diagnóstico." : "Gracias por contactar."}</h1>
        <p>
          {health
            ? "Tu solicitud y el resultado del Project Health Check han quedado asociados para poder revisar el proyecto con contexto desde el primer contacto."
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
