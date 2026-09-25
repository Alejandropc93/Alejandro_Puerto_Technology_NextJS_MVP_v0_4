import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Project & Delivery Management, Project Health Check, recuperación de proyectos, advisory para emprendedores, mentoring y formación.",
};

const items = [
  ["01", "Project & Delivery Management", "Cuando necesitas estructura y seguimiento", "Acompañamiento integral o parcial para definir, planificar, coordinar y controlar proyectos tecnológicos."],
  ["02", "Project Health Check", "Cuando necesitas saber dónde estás", "Diagnóstico estructurado de alcance, planificación, capacidad, riesgos, gobernanza, calidad y delivery."],
  ["03", "Project Recovery", "Cuando el proyecto necesita recuperar control", "Plan de estabilización y recuperación para iniciativas con retrasos, bloqueos, sobrecostes o falta de visibilidad."],
  ["04", "Technology Startup Advisory", "Cuando una idea necesita convertirse en proyecto", "Apoyo para definir MVP, roadmap, estimación, tecnología, proveedores y un modelo de ejecución controlable."],
  ["05", "Mentoring", "Cuando necesitas una segunda visión", "Sesiones 1:1 para responsables, profesionales y emprendedores que quieren desbloquear decisiones concretas."],
  ["06", "Formación", "Cuando quieres elevar la capacidad del equipo", "Programas prácticos sobre gestión, delivery, planificación, proveedores, liderazgo e IA aplicada."],
];

export default function ServicesPage() {
  return (
    <div className="page">
      <section className="pageHero pageHeroPremium">
        <div className="container pageHeroSplit">
          <div>
            <p className="eyebrow">SERVICIOS</p>
            <h1>Apoyo para que la tecnología avance con control.</h1>
          </div>
          <div className="pageHeroAside">
            <p>Desde una revisión puntual hasta acompañamiento de delivery. El punto de partida es entender qué necesita realmente el proyecto, no encajarlo en un servicio prefabricado.</p>
            <Link className="button buttonPrimary" href="/contacto">Cuéntame tu situación <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container serviceDetailGrid serviceDetailPremium">
          {items.map(([num,title,when,text]) => (
            <article className="detailCard" key={title}>
              <span>{num}</span>
              <small>{when}</small>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="decisionBand">
        <div className="container decisionBandGrid">
          <div><p className="eyebrow">EMPIEZA POR AQUÍ</p><h2>¿No tienes claro qué apoyo necesitas?</h2><p>Una conversación breve sirve para ordenar el contexto. Si prefieres empezar con datos, utiliza el Project Health Check.</p></div>
          <div className="buttonRow"><Link className="button buttonPrimary" href="/contacto">Hablar con Alejandro →</Link><Link className="button buttonOutline" href="/project-health-check">Hacer Health Check</Link></div>
        </div>
      </section>
    </div>
  );
}
