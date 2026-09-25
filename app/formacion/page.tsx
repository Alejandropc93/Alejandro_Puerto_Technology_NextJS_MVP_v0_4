import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Formación y mentoring",
  description: "Formación práctica y mentoring en gestión de proyectos tecnológicos, delivery, proveedores, liderazgo, reporting e IA aplicada.",
};

const courses = [
  ["01","Gestión práctica de proyectos tecnológicos","Para profesionales que necesitan una visión end-to-end de la ejecución."],
  ["02","Cómo planificar proyectos IT","Estimación, capacidad, dependencias, fechas y escenarios."],
  ["03","Gestión de proveedores tecnológicos","Seguimiento, compromisos, riesgos, interlocución y control."],
  ["04","Reporting ejecutivo para proyectos","Cómo convertir información operativa en decisiones claras."],
  ["05","Liderazgo para perfiles tecnológicos","Coordinación, comunicación, delegación y gestión del equipo."],
  ["06","IA aplicada al Project Management","Usos prácticos para análisis, documentación, seguimiento y reporting."],
];

export default function TrainingPage() {
  return (
    <div className="page">
      <section className="pageHero pageHeroPremium">
        <div className="container pageHeroSplit">
          <div><p className="eyebrow">FORMACIÓN & MENTORING</p><h1>Aprender gestión con situaciones del mundo real.</h1></div>
          <div className="pageHeroAside"><p>Sesiones diseñadas para aplicar lo aprendido al día siguiente: talleres de equipo, mentoring 1:1 o programas adaptados a una necesidad concreta.</p><Link className="button buttonPrimary" href="/contacto">Diseñar una sesión →</Link></div>
        </div>
      </section>

      <section className="section"><div className="container courseGrid courseGridPremium">{courses.map(([n,course,text])=><article className="courseCard" key={course}><span>PROGRAMA {n}</span><h2>{course}</h2><p>{text}</p><small>Workshop · Mentoring · Programa a medida</small></article>)}</div></section>

      <section className="trainingModes"><div className="container trainingModesGrid"><div><strong>1:1</strong><span>Mentoring sobre una situación real</span></div><div><strong>Equipo</strong><span>Workshop aplicado a un caso común</span></div><div><strong>Programa</strong><span>Varias sesiones con evolución y práctica</span></div></div></section>

      <section className="inlineCta"><div className="container"><h2>¿Tienes una necesidad de formación concreta?</h2><p>Cuéntame el perfil del equipo, el problema que quieres resolver y el resultado que buscas.</p><Link className="button buttonPrimary" href="/contacto">Hablar sobre formación →</Link></div></section>
    </div>
  );
}
