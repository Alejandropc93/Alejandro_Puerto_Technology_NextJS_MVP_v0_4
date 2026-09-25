import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Para emprendedores" };

export default function EntrepreneursPage() {
  return <div className="page"><section className="pageHero startupHero"><div className="container"><p className="eyebrow eyebrowLight">PARA EMPRENDEDORES</p><h1>Convierte una idea tecnológica en un proyecto que puedas ejecutar.</h1><p>No necesitas empezar sabiendo de arquitectura, proveedores o delivery. Necesitas tomar buenas decisiones en el orden correcto.</p><Link className="button buttonPrimary" href="/contacto">Cuéntame tu idea →</Link></div></section><section className="section"><div className="container"><div className="journey">{[["01","Idea","Problema, usuario y objetivo."],["02","Producto","Qué debe resolver y para quién."],["03","MVP","Qué entra ahora y qué se deja fuera."],["04","Tecnología","Opciones, restricciones y proveedores."],["05","Roadmap","Coste, fases, recursos y riesgos."],["06","Delivery","Seguimiento hasta el lanzamiento."]].map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section><section className="inlineCta"><div className="container"><p className="eyebrow">STARTUP ADVISORY</p><h2>Una idea gana valor cuando puede explicarse, estimarse y ejecutarse.</h2><Link className="button buttonDark" href="/contacto">Trabajemos tu proyecto →</Link></div></section></div>;
}
