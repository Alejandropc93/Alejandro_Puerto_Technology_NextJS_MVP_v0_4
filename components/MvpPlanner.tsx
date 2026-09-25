"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getLeadAttribution, trackEvent } from "@/lib/client-tracking";

type MvpInput = {
  projectName: string;
  idea: string;
  problem: string;
  targetUser: string;
  valueProposition: string;
  successMetric: string;
  targetDate: string;
  constraints: string;
  mustHave: string;
  shouldHave: string;
  couldHave: string;
  outOfScope: string;
  assumptions: string;
  risks: string;
};

type CaptureState = "idle" | "sending" | "error";

function cleanLines(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function bullets(value: string, fallback: string) {
  const lines = cleanLines(value);
  if (!lines.length) return `- ${fallback}`;
  return lines.map((line) => `- ${line.replace(/^[-•]\s*/, "")}`).join("\n");
}

function dateLabel(value: string) {
  if (!value) return "Sin fecha objetivo";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function MvpPlanner() {
  const router = useRouter();
  const started = useRef(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [captureState, setCaptureState] = useState<CaptureState>("idle");
  const [captureMessage, setCaptureMessage] = useState("");
  const [input, setInput] = useState<MvpInput>({
    projectName: "",
    idea: "",
    problem: "",
    targetUser: "",
    valueProposition: "",
    successMetric: "",
    targetDate: "",
    constraints: "",
    mustHave: "",
    shouldHave: "",
    couldHave: "",
    outOfScope: "",
    assumptions: "",
    risks: "",
  });

  const metrics = useMemo(() => {
    const mustCount = cleanLines(input.mustHave).length;
    const shouldCount = cleanLines(input.shouldHave).length;
    const couldCount = cleanLines(input.couldHave).length;
    const definedCore = [input.problem, input.targetUser, input.valueProposition, input.successMetric].filter((value) => value.trim().length >= 10).length;
    const score = Math.min(100, Math.round((definedCore / 4) * 55 + Math.min(mustCount, 5) * 7 + (input.targetDate ? 10 : 0)));
    const scopeSignal = mustCount === 0 ? "Sin alcance" : mustCount <= 5 ? "Foco razonable" : mustCount <= 8 ? "Revisar alcance" : "MVP demasiado amplio";
    const readiness = score >= 80 ? "Listo para contrastar" : score >= 55 ? "Base definida" : "Necesita definición";
    return { mustCount, shouldCount, couldCount, score, scopeSignal, readiness };
  }, [input]);

  const roadmap = useMemo(() => {
    if (!input.targetDate) return null;
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const target = new Date(`${input.targetDate}T12:00:00`);
    const totalDays = Math.ceil((target.getTime() - today.getTime()) / 86400000);
    if (!Number.isFinite(totalDays) || totalDays <= 0) return { totalDays: 0, discovery: 0, build: 0, validation: 0, launch: 0 };
    const discovery = Math.max(3, Math.round(totalDays * 0.15));
    const build = Math.max(5, Math.round(totalDays * 0.55));
    const validation = Math.max(3, Math.round(totalDays * 0.2));
    const launch = Math.max(2, totalDays - discovery - build - validation);
    return { totalDays, discovery, build, validation, launch };
  }, [input.targetDate]);

  const output = useMemo(() => {
    const project = input.projectName.trim() || "MVP tecnológico";
    const idea = input.idea.trim() || "Idea pendiente de concretar.";
    const problem = input.problem.trim() || "Problema pendiente de validar.";
    const user = input.targetUser.trim() || "Usuario objetivo pendiente de definir.";
    const value = input.valueProposition.trim() || "Propuesta de valor pendiente de definir.";
    const metric = input.successMetric.trim() || "Criterio de éxito pendiente de definir.";
    const roadmapText = roadmap && roadmap.totalDays > 0
      ? `- Discovery / definición: ~${roadmap.discovery} días\n- Construcción: ~${roadmap.build} días\n- Validación: ~${roadmap.validation} días\n- Preparación de lanzamiento: ~${roadmap.launch} días\n- Fecha objetivo: ${dateLabel(input.targetDate)}`
      : "- Define una fecha objetivo para obtener una distribución temporal inicial.";

    return `${project}\nMVP BRIEF\n\nIDEA\n${idea}\n\nPROBLEMA A RESOLVER\n${problem}\n\nUSUARIO OBJETIVO\n${user}\n\nPROPUESTA DE VALOR\n${value}\n\nCRITERIO DE ÉXITO\n${metric}\n\nALCANCE MUST HAVE\n${bullets(input.mustHave, "Pendiente de definir funcionalidades imprescindibles.")}\n\nSHOULD HAVE\n${bullets(input.shouldHave, "Sin funcionalidades prioritarias adicionales definidas.")}\n\nCOULD HAVE\n${bullets(input.couldHave, "Sin funcionalidades opcionales definidas.")}\n\nFUERA DE ALCANCE INICIAL\n${bullets(input.outOfScope, "Pendiente de explicitar qué no entra en el MVP.")}\n\nHIPÓTESIS A VALIDAR\n${bullets(input.assumptions, "Pendiente de identificar hipótesis críticas.")}\n\nRIESGOS INICIALES\n${bullets(input.risks, "Sin riesgos iniciales documentados.")}\n\nRESTRICCIONES\n${input.constraints.trim() || "Sin restricciones informadas."}\n\nROADMAP INICIAL\n${roadmapText}\n\nLECTURA APT\nMadurez de definición: ${metrics.readiness} (${metrics.score}/100)\nSeñal de alcance: ${metrics.scopeSignal}`;
  }, [input, metrics, roadmap]);

  function update<K extends keyof MvpInput>(key: K, value: MvpInput[K]) {
    if (!started.current) {
      started.current = true;
      trackEvent("mvp_planner_started");
    }
    setGenerated(false);
    setCopied(false);
    setInput((current) => ({ ...current, [key]: value }));
  }

  function generate(event: FormEvent) {
    event.preventDefault();
    setGenerated(true);
    setCopied(false);
    trackEvent("mvp_planner_generated", {
      readinessScore: metrics.score,
      scopeSignal: metrics.scopeSignal,
      mustHaveCount: metrics.mustCount,
      targetDate: input.targetDate || null,
    });
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      trackEvent("mvp_planner_copied", { readinessScore: metrics.score });
    } catch {
      setCopied(false);
    }
  }

  async function requestReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCaptureState("sending");
    setCaptureMessage("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: "mvp-planner",
          ...getLeadAttribution("mvp-planner-review"),
          mvpPlanner: {
            inputs: input,
            metrics,
            roadmap,
            output,
          },
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "No se pudo enviar la solicitud.");
      trackEvent("lead_submitted", { source: "mvp-planner", readinessScore: metrics.score });
      form.reset();
      router.push("/gracias?source=mvp-planner");
    } catch (error) {
      setCaptureState("error");
      setCaptureMessage(error instanceof Error ? error.message : "Ha ocurrido un error.");
    }
  }

  return (
    <div className="mvpTool">
      <div className="toolIntro">
        <p className="eyebrow">MVP PLANNER · APT</p>
        <h1>Convierte una idea en un MVP concreto, priorizado y explicable.</h1>
        <p>Define el problema, el usuario y el valor; separa lo imprescindible de lo accesorio y obtén un brief inicial para empezar a validar y construir.</p>
      </div>

      <div className="mvpGrid">
        <form className="mvpForm" onSubmit={generate}>
          <div className="plannerFormHeader"><div><p className="eyebrow">DEFINICIÓN</p><h2>Base del producto</h2></div><span className="plannerHint">Lean scope</span></div>
          <div className="mvpFields twoCols">
            <label>Proyecto / producto<input value={input.projectName} onChange={(e)=>update("projectName", e.target.value)} placeholder="Nombre provisional" /></label>
            <label>Fecha objetivo<input type="date" value={input.targetDate} onChange={(e)=>update("targetDate", e.target.value)} /></label>
          </div>
          <label className="mvpField">Idea en una frase<textarea value={input.idea} onChange={(e)=>update("idea", e.target.value)} placeholder="¿Qué quieres crear?" /></label>
          <div className="mvpFields twoCols">
            <label>Problema que resuelve<textarea value={input.problem} onChange={(e)=>update("problem", e.target.value)} placeholder="Qué problema concreto existe hoy" /></label>
            <label>Usuario objetivo<textarea value={input.targetUser} onChange={(e)=>update("targetUser", e.target.value)} placeholder="Para quién es y en qué contexto" /></label>
            <label>Propuesta de valor<textarea value={input.valueProposition} onChange={(e)=>update("valueProposition", e.target.value)} placeholder="Qué mejora o resultado obtiene el usuario" /></label>
            <label>Criterio de éxito<textarea value={input.successMetric} onChange={(e)=>update("successMetric", e.target.value)} placeholder="Qué dato indicará que el MVP funciona" /></label>
          </div>

          <div className="mvpSectionTitle"><p className="eyebrow">PRIORIZACIÓN</p><h2>Qué entra y qué no</h2></div>
          <div className="mvpFields twoCols">
            <label>Must have <span>Imprescindible para validar</span><textarea value={input.mustHave} onChange={(e)=>update("mustHave", e.target.value)} placeholder="Una funcionalidad por línea" /></label>
            <label>Should have <span>Importante, pero no bloquea</span><textarea value={input.shouldHave} onChange={(e)=>update("shouldHave", e.target.value)} placeholder="Una funcionalidad por línea" /></label>
            <label>Could have <span>Opcional si hay capacidad</span><textarea value={input.couldHave} onChange={(e)=>update("couldHave", e.target.value)} placeholder="Una funcionalidad por línea" /></label>
            <label>Fuera de alcance <span>No entra en esta primera versión</span><textarea value={input.outOfScope} onChange={(e)=>update("outOfScope", e.target.value)} placeholder="Un elemento por línea" /></label>
          </div>

          <div className="mvpFields twoCols">
            <label>Hipótesis a validar<textarea value={input.assumptions} onChange={(e)=>update("assumptions", e.target.value)} placeholder="Ej. El usuario aceptará registrarse para guardar su progreso" /></label>
            <label>Riesgos iniciales<textarea value={input.risks} onChange={(e)=>update("risks", e.target.value)} placeholder="Ej. Dependencia de proveedor, datos, integración..." /></label>
          </div>
          <label className="mvpField">Restricciones<textarea value={input.constraints} onChange={(e)=>update("constraints", e.target.value)} placeholder="Presupuesto, tecnología, plazo, regulación, equipo disponible..." /></label>
          <button className="button buttonPrimary mvpGenerate" type="submit">Generar MVP Brief <span>→</span></button>
        </form>

        <aside className="mvpSummary">
          <p className="eyebrow eyebrowLight">LECTURA APT</p>
          <h2>{generated ? metrics.readiness : "Define tu MVP"}</h2>
          <div className="mvpScore"><strong>{generated ? metrics.score : "—"}</strong><span>/100 definición</span></div>
          <div className={`mvpScope ${metrics.mustCount > 5 ? "warning" : "ok"}`}><span>Señal de alcance</span><strong>{generated ? metrics.scopeSignal : "Pendiente"}</strong></div>
          <div className="mvpKpis"><div><span>Must</span><strong>{metrics.mustCount}</strong></div><div><span>Should</span><strong>{metrics.shouldCount}</strong></div><div><span>Could</span><strong>{metrics.couldCount}</strong></div></div>
          <div className="mvpTarget"><span>Objetivo</span><strong>{dateLabel(input.targetDate)}</strong>{roadmap && roadmap.totalDays > 0 ? <small>{roadmap.totalDays} días naturales disponibles</small> : null}</div>
        </aside>
      </div>

      {generated ? (
        <section className="mvpOutput">
          <div className="mvpOutputHead"><div><p className="eyebrow">MVP BRIEF</p><h2>Una primera definición que ya puedes discutir y validar.</h2></div><button className="button buttonDark" type="button" onClick={copyOutput}>{copied ? "Copiado" : "Copiar brief"}</button></div>
          <pre>{output}</pre>
        </section>
      ) : null}

      {generated ? (
        <section className="mvpLeadBox">
          <div><p className="eyebrow">SIGUIENTE PASO</p><h2>¿Quieres convertir este brief en un plan de ejecución?</h2><p>Recibiré el alcance, priorización y roadmap generado para poder revisar contigo si el MVP tiene foco, dependencias o riesgos que conviene resolver antes de desarrollar.</p></div>
          <form className="leadForm" onSubmit={requestReview}>
            <div className="fieldRow">
              <label>Nombre<input name="name" required minLength={2} placeholder="Tu nombre" /></label>
              <label>Email<input name="email" required type="email" placeholder="tu@email.com" /></label>
            </div>
            <div className="fieldRow">
              <label>Perfil<select name="profile" defaultValue="emprendedor"><option value="emprendedor">Emprendedor</option><option value="empresa">Empresa</option><option value="profesional">Profesional</option></select></label>
              <label>Empresa / proyecto<input name="company" placeholder="Opcional" /></label>
            </div>
            <label>¿Qué necesitas conseguir?<textarea name="message" required minLength={10} defaultValue="Quiero revisar este MVP y convertirlo en un plan de ejecución realista." /></label>
            <label className="websiteTrap" aria-hidden="true">Web<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <label className="consentRow"><input name="consent" type="checkbox" value="yes" required /><span>Acepto que mis datos se utilicen para responder a esta solicitud.</span></label>
            <button className="button buttonPrimary" type="submit" disabled={captureState === "sending"}>{captureState === "sending" ? "Enviando..." : "Solicitar revisión"} <span>→</span></button>
            {captureMessage ? <p className="formMessage error">{captureMessage}</p> : null}
          </form>
        </section>
      ) : null}
    </div>
  );
}
