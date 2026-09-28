import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "APT Lab | Herramientas para gestionar mejor proyectos tecnológicos",
  description:
    "Herramientas prácticas de Alejandro Puerto Technology para diagnosticar proyectos, planificar delivery, definir MVPs y comunicar estado ejecutivo.",
};

const tools = [
  {
    index: "01",
    action: "DIAGNOSTICAR",
    title: "Project Health Check",
    href: "/project-health-check",
    description:
      "Evalúa diez dimensiones críticas del proyecto y obtén una lectura estructurada de su salud, riesgos y prioridades.",
    outcome: "Resultado: diagnóstico 0–100 + prioridades",
    audience: "Project Managers · Team Leads · Responsables IT",
    tone: "blue",
  },
  {
    index: "02",
    action: "PLANIFICAR",
    title: "Delivery Planner",
    href: "/delivery-planner",
    description:
      "Convierte esfuerzo, capacidad, FTE, vacaciones y dependencias en fechas y escenarios comparables de delivery.",
    outcome: "Resultado: fecha estimada + escenarios + FTE objetivo",
    audience: "Delivery Leads · PMs · Equipos tecnológicos",
    tone: "navy",
  },
  {
    index: "03",
    action: "DEFINIR",
    title: "MVP Planner",
    href: "/mvp-planner",
    description:
      "Transforma una idea en un MVP enfocado: problema, usuario, valor, alcance MoSCoW, hipótesis y roadmap inicial.",
    outcome: "Resultado: MVP Brief + madurez + roadmap",
    audience: "Emprendedores · Product Owners · Innovación",
    tone: "sand",
  },
  {
    index: "04",
    action: "COMUNICAR",
    title: "Executive Status Generator",
    href: "/executive-status-generator",
    description:
      "Ordena hitos, riesgos, bloqueos y decisiones para generar un estado ejecutivo breve, claro y accionable.",
    outcome: "Resultado: status ejecutivo listo para compartir",
    audience: "PMs · Team Leads · Dirección de proyecto",
    tone: "slate",
  },
];

const paths = [
  ["Tengo un proyecto en marcha", "Quiero saber dónde están los riesgos y qué priorizar.", "/project-health-check", "Project Health Check"],
  ["Necesito comprometer una fecha", "Quiero contrastar capacidad, esfuerzo y escenarios.", "/delivery-planner", "Delivery Planner"],
  ["Tengo una idea de producto", "Necesito convertirla en un primer alcance ejecutable.", "/mvp-planner", "MVP Planner"],
  ["Tengo que informar a dirección", "Necesito sintetizar el estado sin perder lo importante.", "/executive-status-generator", "Executive Status Generator"],
];

export default function ToolsPage() {
  return (
    <div className="page aptLabPage">
      <section className="aptLabHero">
        <div className="container aptLabHeroGrid">
          <div>
            <p className="eyebrow eyebrowLight">APT LAB · TOOLS FOR DELIVERY</p>
            <h1>Menos intuición.<br /><span>Más claridad para decidir.</span></h1>
            <p className="aptLabLead">
              Herramientas creadas desde problemas reales de gestión: entender el estado de un proyecto,
              comprometer fechas, acotar un MVP o comunicar con claridad.
            </p>
            <div className="buttonRow">
              <a className="button buttonPrimary" href="#herramientas">Explorar herramientas <span>↓</span></a>
              <Link className="button buttonGhost" href="/contacto">Necesito apoyo <span>→</span></Link>
            </div>
          </div>
          <div className="aptLabHeroPanel" aria-label="APT Lab workflow">
            <span className="aptLabPanelLabel">APT LAB</span>
            <div className="aptLabFlow">
              <div><b>01</b><span>Diagnosticar</span></div>
              <div><b>02</b><span>Planificar</span></div>
              <div><b>03</b><span>Definir</span></div>
              <div><b>04</b><span>Comunicar</span></div>
            </div>
            <p>Cuatro decisiones habituales de proyecto convertidas en herramientas simples y accionables.</p>
          </div>
        </div>
      </section>

      <section className="aptLabPrinciples">
        <div className="container aptLabPrinciplesGrid">
          <div><strong>Prácticas</strong><span>Sin metodología vacía</span></div>
          <div><strong>Accionables</strong><span>Siempre terminan en una decisión</span></div>
          <div><strong>Transparentes</strong><span>Hipótesis visibles, no cajas negras</span></div>
          <div><strong>Conectadas</strong><span>Del análisis al acompañamiento</span></div>
        </div>
      </section>

      <section className="section aptLabChooser">
        <div className="container">
          <div className="aptLabSectionHead">
            <div><p className="eyebrow">EMPIEZA POR TU NECESIDAD</p><h2>¿Qué necesitas resolver ahora?</h2></div>
            <p>No necesitas conocer la herramienta. Empieza por la situación en la que estás y te llevo al recurso adecuado.</p>
          </div>
          <div className="aptLabPathGrid">
            {paths.map(([title, text, href, tool], i) => (
              <Link className="aptLabPathCard" href={href} key={title}>
                <span className="aptLabPathNum">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <strong>{tool} <span>→</span></strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section aptLabTools" id="herramientas">
        <div className="container">
          <div className="aptLabSectionHead">
            <div><p className="eyebrow">PRODUCTOS APT</p><h2>Cuatro herramientas. Cuatro decisiones clave.</h2></div>
            <p>Cada herramienta puede utilizarse de forma independiente y está diseñada para producir una salida concreta que puedas usar inmediatamente.</p>
          </div>
          <div className="aptLabProductGrid">
            {tools.map((tool) => (
              <article className={`aptLabProductCard ${tool.tone}`} key={tool.title}>
                <div className="aptLabProductTop">
                  <span className="aptLabProductIndex">{tool.index}</span>
                  <span className="statusPill live">Disponible</span>
                </div>
                <p className="aptLabAction">{tool.action}</p>
                <h2>{tool.title}</h2>
                <p className="aptLabProductDescription">{tool.description}</p>
                <div className="aptLabOutcome">{tool.outcome}</div>
                <small>{tool.audience}</small>
                <Link className="aptLabOpen" href={tool.href}>Abrir herramienta <span>→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section aptLabMethod">
        <div className="container aptLabMethodGrid">
          <div>
            <p className="eyebrow">CÓMO ESTÁN DISEÑADAS</p>
            <h2>Herramientas para pensar mejor, no para sustituir el criterio.</h2>
          </div>
          <div className="aptLabMethodSteps">
            <div><span>01</span><strong>Introduce contexto</strong><p>Datos sencillos, hipótesis y restricciones que ya conoces.</p></div>
            <div><span>02</span><strong>Obtén una lectura</strong><p>La herramienta estructura el problema y muestra escenarios o prioridades.</p></div>
            <div><span>03</span><strong>Toma una decisión</strong><p>Te llevas una salida concreta que puedes contrastar, compartir o ejecutar.</p></div>
          </div>
        </div>
      </section>

      <section className="aptLabCta">
        <div className="container aptLabCtaInner">
          <div>
            <p className="eyebrow eyebrowLight">CUANDO LA HERRAMIENTA NO ES SUFICIENTE</p>
            <h2>El contexto importa. Ahí es donde entro yo.</h2>
            <p>Si necesitas contrastar el resultado, aterrizar decisiones o acompañar la ejecución, podemos revisar el caso juntos.</p>
          </div>
          <Link className="button buttonLight" href="/contacto">Hablar con Alejandro <span>→</span></Link>
        </div>
      </section>
    </div>
  );
}
