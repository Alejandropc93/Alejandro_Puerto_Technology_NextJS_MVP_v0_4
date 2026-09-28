import type { Metadata } from "next";
import Link from "next/link";
import { resources } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Recursos e Insights | Alejandro Puerto Technology",
  description:
    "Guías prácticas sobre gestión de proyectos, delivery, emprendimiento tecnológico y comunicación ejecutiva, conectadas con herramientas APT.",
};

export default function ResourcesPage() {
  return (
    <div className="page resourcesPage">
      <section className="resourcesHero">
        <div className="container resourcesHeroGrid">
          <div>
            <p className="eyebrow eyebrowLight">APT INSIGHTS</p>
            <h1>Ideas prácticas para<br /><span>gestionar mejor.</span></h1>
            <p className="resourcesHeroLead">
              Contenido directo sobre decisiones que aparecen en proyectos reales: control, fechas,
              alcance, reporting y ejecución. Sin teoría por la teoría.
            </p>
          </div>
          <div className="resourcesHeroPanel">
            <span>RECURSOS APT</span>
            <strong>Aprender · Aplicar · Decidir</strong>
            <p>Cada guía conecta con una herramienta o una forma concreta de llevar la idea a la práctica.</p>
            <Link className="button buttonPrimary" href="/tools">Explorar APT Lab <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="resourcesTopics">
        <div className="container resourcesTopicsGrid">
          <span>Project Management</span>
          <span>Delivery</span>
          <span>Emprendimiento</span>
          <span>Comunicación ejecutiva</span>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="resourcesSectionHead">
            <div>
              <p className="eyebrow">GUÍAS PRÁCTICAS</p>
              <h2>Empieza por el problema que tienes hoy</h2>
            </div>
            <p>Artículos pensados para ayudarte a tomar una decisión mejor y pasar después a una herramienta o acción concreta.</p>
          </div>

          <div className="resourcesGrid">
            {resources.map((resource, index) => (
              <article className="resourceCard" key={resource.slug}>
                <div className="resourceCardTop">
                  <span className="resourceIndex">0{index + 1}</span>
                  <span className="resourceCategory">{resource.category}</span>
                </div>
                <h2>{resource.title}</h2>
                <p>{resource.excerpt}</p>
                <div className="resourceMeta"><span>{resource.readTime} de lectura</span><span>Guía APT</span></div>
                <Link href={`/recursos/${resource.slug}`}>Leer guía <span>→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="resourcesToolsBand">
        <div className="container resourcesToolsBandInner">
          <div>
            <p className="eyebrow eyebrowLight">DE LA LECTURA A LA ACCIÓN</p>
            <h2>No te quedes solo con la idea.</h2>
            <p>APT Lab convierte estos conceptos en diagnósticos, escenarios, briefs y estados ejecutivos que puedes utilizar directamente.</p>
          </div>
          <Link className="button buttonLight" href="/tools">Abrir APT Lab <span>→</span></Link>
        </div>
      </section>
    </div>
  );
}
