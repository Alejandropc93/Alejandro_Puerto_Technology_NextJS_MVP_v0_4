import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Formación" };

const courses = ["Gestión práctica de proyectos tecnológicos","Cómo planificar proyectos IT","Gestión de proveedores tecnológicos","Reporting ejecutivo para proyectos","Liderazgo para perfiles tecnológicos","IA aplicada al Project Management"];

export default function TrainingPage() {
  return <div className="page"><section className="pageHero"><div className="container"><p className="eyebrow">FORMACIÓN</p><h1>Aprender gestión con situaciones del mundo real.</h1><p>Contenido práctico para profesionales, equipos y emprendedores que necesitan aplicar lo aprendido al día siguiente, no solo conocer teoría.</p></div></section><section className="section"><div className="container courseGrid">{courses.map((course,i)=><article className="courseCard" key={course}><span>Programa {String(i+1).padStart(2,"0")}</span><h2>{course}</h2><p>Formato adaptable a workshop, sesión ejecutiva, mentoring o programa de varias sesiones.</p><small>En preparación</small></article>)}</div></section><section className="inlineCta"><div className="container"><h2>¿Buscas formación para un equipo o una necesidad concreta?</h2><Link className="button buttonPrimary" href="/contacto">Diseñar una formación →</Link></div></section></div>;
}
