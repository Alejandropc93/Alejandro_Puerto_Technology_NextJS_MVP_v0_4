import type { Metadata } from "next";
import Link from "next/link";
import { LeadMagnetForm } from "@/components/LeadMagnetForm";

export const metadata: Metadata = {
  title: "Project Kickoff Checklist | Alejandro Puerto Technology",
  description: "Checklist práctica para arrancar proyectos tecnológicos con alcance, responsables, capacidad, riesgos, decisiones y criterios de éxito claros.",
  alternates: { canonical: "/recursos/project-kickoff-checklist" },
};

const groups = [
  ["Objetivo y alcance", "Resultado esperado, alcance inicial, fuera de alcance y criterio de éxito."],
  ["Equipo y gobernanza", "Sponsor, responsable, roles, proveedores, cadencia y modelo de decisión."],
  ["Planning y capacidad", "Hitos, esfuerzo, FTE, vacaciones, dependencias y fecha objetivo."],
  ["Riesgos y calidad", "Riesgos iniciales, pruebas, aceptación, despliegue y plan de contingencia."],
];

export default function ProjectKickoffChecklistPage() {
  return (
    <main className="leadMagnetPage">
      <section className="leadMagnetHero">
        <div className="container leadMagnetHeroGrid">
          <div>
            <Link className="resourceBack" href="/recursos">← Recursos</Link>
            <p className="eyebrow eyebrowLight">RECURSO APT · PROJECT KICKOFF</p>
            <h1>Arranca el proyecto con las <span>preguntas correctas.</span></h1>
            <p className="leadMagnetHeroLead">Una checklist práctica para evitar que alcance, roles, capacidad, riesgos y decisiones aparezcan cuando el proyecto ya está en marcha.</p>
            <div className="leadMagnetProof"><span>✓ 40+ comprobaciones</span><span>✓ 10 bloques de control</span><span>✓ Formato imprimible</span></div>
          </div>
          <div className="leadMagnetPreview" aria-label="Vista previa del checklist">
            <div className="leadMagnetPreviewTop"><span>APT</span><small>PROJECT KICKOFF CHECKLIST</small></div>
            <h2>Antes de empezar,<br />confirma lo esencial.</h2>
            <div className="leadMagnetPreviewChecks">{groups.map(([title]) => <div key={title}><i>✓</i><span>{title}</span></div>)}</div>
            <div className="leadMagnetPreviewFooter">ALEJANDRO PUERTO TECHNOLOGY</div>
          </div>
        </div>
      </section>

      <section className="section leadMagnetValueSection">
        <div className="container leadMagnetValueGrid">
          <div>
            <p className="eyebrow">QUÉ TE LLEVAS</p>
            <h2>Un kickoff menos ceremonial y más útil.</h2>
            <p className="leadMagnetValueLead">La checklist está pensada para convertir una reunión de arranque en un mecanismo de control: qué sabemos, qué falta por decidir y qué puede condicionar el delivery.</p>
            <div className="leadMagnetGroupGrid">
              {groups.map(([title, description], index) => (
                <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>
              ))}
            </div>
          </div>
          <LeadMagnetForm />
        </div>
      </section>

      <section className="leadMagnetAfter">
        <div className="container leadMagnetAfterInner">
          <div><p className="eyebrow eyebrowLight">DESPUÉS DEL KICKOFF</p><h2>¿Quieres saber si el proyecto sigue bajo control?</h2><p>Completa el Project Health Check y contrasta alcance, planning, capacidad, riesgos y gobernanza cuando el proyecto ya esté avanzando.</p></div>
          <Link className="button buttonLight" href="/project-health-check">Abrir Health Check <span>→</span></Link>
        </div>
      </section>
    </main>
  );
}
