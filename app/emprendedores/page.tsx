import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Para emprendedores",
  description: "Acompañamiento para convertir una idea tecnológica en MVP, roadmap y plan de ejecución.",
};

const journey = [
  ["01","Idea","Problema, usuario y objetivo."],
  ["02","Producto","Qué debe resolver y para quién."],
  ["03","MVP","Qué entra ahora y qué se deja fuera."],
  ["04","Tecnología","Opciones, restricciones y proveedores."],
  ["05","Roadmap","Fases, capacidad, riesgos y decisiones."],
  ["06","Delivery","Seguimiento hasta el lanzamiento."],
];

export default function EntrepreneursPage() {
  return (
    <div className="page">
      <section className="pageHero startupHero">
        <div className="container pageHeroSplit">
          <div><p className="eyebrow eyebrowLight">PARA EMPRENDEDORES</p><h1>Convierte una idea tecnológica en un proyecto que puedas ejecutar.</h1></div>
          <div className="pageHeroAside pageHeroAsideDark"><p>No necesitas empezar sabiendo de arquitectura, proveedores o delivery. Necesitas tomar buenas decisiones en el orden correcto.</p><div className="buttonRow"><Link className="button buttonPrimary" href="/mvp-planner">Crear mi MVP Brief →</Link><Link className="button buttonGhost" href="/contacto">Hablar conmigo</Link></div></div>
        </div>
      </section>

      <section className="section">
        <div className="container"><div className="journey journeyPremium">{journey.map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div>
      </section>

      <section className="section entrepreneurToolBand">
        <div className="container entrepreneurToolGrid">
          <div><p className="eyebrow">MVP PLANNER</p><h2>Antes de pedir presupuestos, define qué estás construyendo.</h2><p>El MVP Planner te ayuda a ordenar problema, usuario, propuesta de valor, funcionalidades, prioridades, riesgos y una primera secuencia de trabajo.</p></div>
          <div className="toolPreviewCard"><span>APT LAB · GRATIS</span><strong>Idea → alcance → prioridades → roadmap</strong><p>Obtén un brief que puedas usar para explicar tu producto y mantener el foco en la primera versión.</p><Link className="button buttonDark" href="/mvp-planner">Abrir MVP Planner →</Link></div>
        </div>
      </section>

      <section className="inlineCta"><div className="container"><p className="eyebrow">STARTUP ADVISORY</p><h2>Una idea gana valor cuando puede explicarse, estimarse y ejecutarse.</h2><p>Si después del brief necesitas aterrizar decisiones de producto, tecnología, proveedor o delivery, podemos trabajarlo juntos.</p><Link className="button buttonDark" href="/contacto">Cuéntame tu proyecto →</Link></div></section>
    </div>
  );
}
