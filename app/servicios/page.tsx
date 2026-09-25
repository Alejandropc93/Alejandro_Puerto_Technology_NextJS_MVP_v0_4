import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Servicios" };

const items = [
  ["Project & Delivery Management", "Acompañamiento integral o parcial para definir, planificar, coordinar y controlar proyectos tecnológicos."],
  ["Project Health Check", "Diagnóstico estructurado de alcance, planificación, capacidad, riesgos, gobernanza, calidad y delivery."],
  ["Project Recovery", "Plan de estabilización y recuperación para proyectos con retrasos, bloqueos, sobrecostes o falta de visibilidad."],
  ["Technology Startup Advisory", "Apoyo para convertir una idea tecnológica en MVP, roadmap, estimación y un modelo de ejecución controlable."],
  ["Mentoring", "Sesiones 1:1 para responsables, profesionales y emprendedores que necesitan una segunda visión experimentada."],
  ["Formación", "Programas prácticos sobre gestión, delivery, planificación, proveedores, liderazgo e IA aplicada al Project Management."],
];

export default function ServicesPage() {
  return <div className="page"><section className="pageHero"><div className="container"><p className="eyebrow">SERVICIOS</p><h1>Apoyo para que la tecnología avance con control.</h1><p>Desde una revisión puntual hasta acompañamiento de delivery. El servicio se adapta al momento real de tu proyecto.</p></div></section><section className="section"><div className="container serviceDetailGrid">{items.map(([title,text],i)=><article className="detailCard" key={title}><span>0{i+1}</span><h2>{title}</h2><p>{text}</p></article>)}</div></section><section className="inlineCta"><div className="container"><h2>¿No tienes claro qué tipo de apoyo necesitas?</h2><p>Podemos empezar por una conversación breve o por un Project Health Check.</p><div className="buttonRow"><Link className="button buttonPrimary" href="/contacto">Cuéntame tu situación →</Link><Link className="button buttonDark" href="/project-health-check">Hacer Health Check</Link></div></div></section></div>;
}
