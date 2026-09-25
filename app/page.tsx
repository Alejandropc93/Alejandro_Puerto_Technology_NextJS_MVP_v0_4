import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

const services = [
  ["01", "Project & Delivery Management", "Planificación, ejecución y seguimiento de proyectos tecnológicos con visión end-to-end."],
  ["02", "Project Health Check", "Diagnóstico rápido y estructurado para conocer el estado real y las prioridades de actuación."],
  ["03", "Project Recovery", "Recuperación de iniciativas con desviaciones, bloqueos, dependencias o falta de control."],
  ["04", "Technology Startup Advisory", "De la idea al MVP, roadmap, proveedores, estimación y lanzamiento."],
  ["05", "Mentoring", "Sesiones individuales para responsables de proyecto, profesionales y emprendedores."],
  ["06", "Formación", "Cursos y talleres prácticos de gestión, delivery, liderazgo e IA aplicada."],
];

const tools = [
  ["Project Health Check", "Diagnostica el estado de tu proyecto en minutos.", "/project-health-check", "Disponible"],
  ["Delivery Planner", "Planifica capacidad, recursos, vacaciones y fechas objetivo.", "/delivery-planner", "Disponible"],
  ["MVP Planner", "Convierte una idea en un alcance mínimo viable y priorizado.", "/mvp-planner", "Disponible"],
  ["Executive Status Generator", "Estructura información de proyecto para reporting ejecutivo.", "/executive-status-generator", "Disponible"],
];

export default function Home() {
  return (
    <>
      <section className="hero heroPersonal">
        <div className="container heroGrid heroPersonalGrid">
          <div className="heroCopy">
            <p className="eyebrow eyebrowLight">TECHNOLOGY & DELIVERY CONSULTANT</p>
            <h1>De la idea<br />a la <span>ejecución.</span></h1>
            <p className="heroLead">Ayudo a empresas, equipos y emprendedores a convertir ideas y proyectos tecnológicos en planes claros, ejecutables y orientados a resultados.</p>
            <div className="buttonRow">
              <Link className="button buttonPrimary" href="/contacto">Hablemos de tu proyecto <span>→</span></Link>
              <Link className="button buttonGhost" href="/tools">Probar herramientas</Link>
            </div>
            <div className="heroProof">
              <div><strong>Claridad</strong><span>en la estrategia</span></div>
              <div><strong>Control</strong><span>en la ejecución</span></div>
              <div><strong>Trato directo</strong><span>sin intermediarios</span></div>
            </div>
          </div>

          <div className="personalHeroVisual">
            <div className="personalPhotoFrame">
              <Image
                src="/alejandro-puerto.jpg"
                alt="Alejandro Puerto, Technology & Delivery Consultant"
                fill
                priority
                sizes="(max-width: 980px) 80vw, 42vw"
                className="personalHeroPhoto"
              />
              <div className="personalPhotoShade" />
              <div className="personalPhotoCaption">
                <strong>Alejandro Puerto</strong>
                <span>Technology · Delivery · Project Management</span>
              </div>
            </div>
            <div className="heroFloatingCard heroFloatingCardTop">
              <span>01</span>
              <div><strong>Visión técnica + gestión</strong><small>Traducir complejidad en decisiones.</small></div>
            </div>
            <div className="heroFloatingCard heroFloatingCardBottom">
              <span>02</span>
              <div><strong>Acompañamiento real</strong><small>De la definición al delivery.</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="trustBand">
        <div className="container trustBandGrid">
          <span>Un único interlocutor</span>
          <span>Gestión con criterio técnico</span>
          <span>Comunicación ejecutiva clara</span>
          <span>Herramientas propias de apoyo</span>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="SERVICIOS" title="Cómo puedo ayudarte" description="Consultoría, gestión, mentoring y formación para que tus proyectos tecnológicos avancen con estructura, control y resultados." />
          <div className="serviceGrid">{services.map(([num, title, text]) => <article className="serviceCard" key={title}><span className="serviceNum">{num}</span><h3>{title}</h3><p>{text}</p><Link href="/servicios">Saber más <span>→</span></Link></article>)}</div>
        </div>
      </section>

      <section className="section methodSection">
        <div className="container methodGrid">
          <div><p className="eyebrow">MÉTODO APT</p><h2>Un enfoque práctico<br />para resultados reales</h2></div>
          <div className="steps">{[["1","Análisis","Situación y objetivos"],["2","Planificación","Plan, recursos y prioridades"],["3","Ejecución","Coordinación y avance"],["4","Control","Medición y ajuste"],["5","Resultados","Valor y cierre"]].map(([n,t,d])=><div className="step" key={n}><span>{n}</span><strong>{t}</strong><small>{d}</small></div>)}</div>
        </div>
      </section>

      <section className="section">
        <div className="container audienceGrid">
          <article className="audienceCard audienceBusiness"><p className="eyebrow eyebrowLight">EMPRESAS</p><h2>Proyectos tecnológicos bien gestionados</h2><p>Apoyo senior para que las iniciativas avancen con control, foco y visibilidad.</p><Link className="textButton" href="/servicios">Más información →</Link></article>
          <article className="audienceCard audienceStartup"><p className="eyebrow eyebrowLight">EMPRENDEDORES</p><h2>Convierte tu idea en un proyecto real</h2><p>Desde la definición hasta el lanzamiento de tu producto tecnológico.</p><Link className="textButton" href="/emprendedores">Más información →</Link></article>
          <article className="audienceCard audiencePro"><p className="eyebrow eyebrowLight">PROFESIONALES</p><h2>Desarrolla tu carrera y tus habilidades</h2><p>Mentoring y formación para crecer en gestión, delivery y liderazgo.</p><Link className="textButton" href="/formacion">Más información →</Link></article>
        </div>
      </section>

      <section className="section toolsSection">
        <div className="container toolsLayout">
          <div><p className="eyebrow">APT LAB</p><h2>Herramientas para planificar, analizar y decidir</h2><p>Recursos prácticos creados desde la experiencia real de gestión para trabajar proyectos tecnológicos con más claridad y control.</p><Link className="button buttonPrimary" href="/tools">Entrar en APT Lab <span>→</span></Link></div>
          <div className="toolGrid">{tools.map(([title,text,href,status])=><article className="toolCard" key={title}><span className={`statusPill ${status === "Disponible" ? "live" : ""}`}>{status}</span><h3>{title}</h3><p>{text}</p><Link href={href}>{status === "Disponible" ? "Abrir herramienta" : "Ver roadmap"} →</Link></article>)}</div>
        </div>
      </section>

      <section className="section darkSection personalAboutSection">
        <div className="container aboutHome personalAboutHome">
          <div className="aboutPhotoFrame">
            <Image src="/alejandro-puerto.jpg" alt="Alejandro Puerto" fill sizes="(max-width: 980px) 80vw, 30vw" className="aboutPhoto" />
          </div>
          <div><p className="eyebrow eyebrowLight">SOBRE MÍ</p><h2>Experiencia, cercanía y enfoque en la ejecución</h2><p>Trabajo en el punto donde se cruzan tecnología, negocio, personas, proveedores y fechas. Mi forma de aportar valor es convertir esa complejidad en un plan entendible y acompañarlo hasta que las cosas ocurren.</p><p className="aboutSignature">“Que un proyecto avance no depende solo de tener un plan; depende de entender qué decisión toca tomar en cada momento.”</p><Link className="button buttonGhost" href="/sobre-mi">Conoce cómo trabajo <span>→</span></Link></div>
          <div className="aboutBullets"><span>◎ Gestión de proyectos</span><span>⚙ Delivery y ejecución</span><span>◇ Consultoría tecnológica</span><span>○ Mentoring y formación</span></div>
        </div>
      </section>

      <section className="finalCta"><div className="container finalCtaInner"><div><p className="eyebrow eyebrowLight">TU PROYECTO, BIEN ACOMPAÑADO</p><h2>Hablemos de tu próximo proyecto</h2><p>Cuéntame dónde estás, qué quieres conseguir y qué te está frenando.</p></div><Link className="button buttonLight" href="/contacto">Contactar con Alejandro <span>→</span></Link></div></section>
    </>
  );
}
