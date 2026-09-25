import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Tools / Lab" };

const roadmap = [
  ["Project Health Check", "Disponible", "/project-health-check", "Evalúa diez dimensiones del proyecto y obtiene una lectura inicial con prioridades."],
  ["Delivery Planner", "Disponible", "/delivery-planner", "Capacidad, FTE, vacaciones, dependencias y fecha objetivo en escenarios comparables."],
  ["MVP Planner", "Disponible", "/mvp-planner", "Estructura problema, usuario, funcionalidades, prioridades y alcance mínimo viable."],
  ["Executive Status Generator", "Disponible", "/executive-status-generator", "Transforma datos de proyecto en un estado ejecutivo breve, claro y accionable."],
];

export default function ToolsPage() {
  return <div className="page"><section className="pageHero"><div className="container"><p className="eyebrow">TOOLS / LAB</p><h1>Conocimiento convertido en herramientas.</h1><p>El objetivo del Lab es crear utilidades que permitan tomar mejores decisiones de proyecto sin depender de documentos interminables.</p></div></section><section className="section"><div className="container labGrid">{roadmap.map(([title,status,href,text])=><article className="labCard" key={title}><span className={`statusPill ${status === "Disponible" ? "live" : ""}`}>{status}</span><h2>{title}</h2><p>{text}</p>{href !== "#" ? <Link className="button buttonDark" href={href}>Abrir herramienta →</Link> : <span className="mutedAction">En diseño</span>}</article>)}</div></section></div>;
}
