import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Sobre mí" };

export default function AboutPage() {
  return (
    <div className="page">
      <section className="pageHero darkPageHero aboutPersonalHero">
        <div className="container aboutHeroGrid">
          <div>
            <p className="eyebrow eyebrowLight">SOBRE MÍ</p>
            <h1>Gestión tecnológica con foco en las personas y en la ejecución.</h1>
            <p>Mi trabajo está en el punto donde se cruzan negocio, tecnología, equipos, proveedores y fechas. Ahí es donde un proyecto necesita claridad, criterio y capacidad de coordinación.</p>
            <div className="aboutHeroTags"><span>Project Management</span><span>Delivery</span><span>Technology</span><span>Mentoring</span></div>
          </div>
          <div className="aboutPortraitEditorial">
            <Image src="/alejandro-puerto.jpg" alt="Alejandro Puerto" fill priority sizes="(max-width: 980px) 80vw, 36vw" className="aboutPortraitImage" />
            <div className="aboutPortraitLabel"><strong>Alejandro Puerto</strong><span>Technology & Delivery Consultant</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container proseGrid">
          <div>
            <p className="eyebrow">MI FORMA DE TRABAJAR</p>
            <h2>Menos ruido. Más claridad sobre lo que toca hacer.</h2>
            <p>Un buen plan no es el que parece perfecto en una presentación. Es el que permite saber qué hay que hacer, quién debe hacerlo, qué puede bloquearlo y qué decisión toca tomar cuando la realidad cambia.</p>
            <p>Por eso Alejandro Puerto Technology combina análisis, planificación, delivery, comunicación y seguimiento con una relación directa. El objetivo es que el cliente entienda siempre dónde está su proyecto y qué necesita para avanzar.</p>
          </div>
          <div className="principles"><article><strong>Claridad</strong><span>Convertir complejidad en decisiones.</span></article><article><strong>Confianza</strong><span>Comunicar situación y riesgos sin ruido.</span></article><article><strong>Ejecución</strong><span>Llevar los planes a acciones y entregables.</span></article><article><strong>Mejora</strong><span>Aprender del proyecto para trabajar mejor.</span></article></div>
        </div>
      </section>

      <section className="section personalValueSection">
        <div className="container personalValueGrid">
          <div><p className="eyebrow">POR QUÉ APT</p><h2>Una relación profesional directa</h2></div>
          <div className="personalValueCards">
            <article><strong>01</strong><h3>Hablas conmigo</h3><p>La persona que entiende el proyecto es la misma que te acompaña en las decisiones.</p></article>
            <article><strong>02</strong><h3>Visión transversal</h3><p>Gestión, tecnología, equipos y proveedores se analizan como un único sistema.</p></article>
            <article><strong>03</strong><h3>Trabajo práctico</h3><p>Planes, herramientas y recomendaciones pensadas para poder ejecutarse.</p></article>
          </div>
        </div>
      </section>

      <section className="inlineCta"><div className="container"><h2>Si tienes un proyecto que necesita estructura, podemos hablar.</h2><p>Una primera conversación sirve para entender la situación y comprobar si puedo ayudarte de forma útil.</p><Link className="button buttonPrimary" href="/contacto">Hablar con Alejandro →</Link></div></section>
    </div>
  );
}
