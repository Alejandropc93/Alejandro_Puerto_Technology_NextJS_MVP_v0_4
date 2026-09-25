"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getLeadAttribution, trackEvent } from "@/lib/client-tracking";

type StatusLevel = "green" | "amber" | "red";

type StatusInput = {
  projectName: string;
  reportingPeriod: string;
  status: StatusLevel;
  summary: string;
  completed: string;
  nextMilestones: string;
  risks: string;
  blockers: string;
  decisions: string;
  nextSteps: string;
};

type CaptureState = "idle" | "sending" | "error";

const statusLabel: Record<StatusLevel, string> = {
  green: "En control",
  amber: "Atención",
  red: "Crítico",
};

function cleanLines(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function bullets(value: string, fallback: string) {
  const lines = cleanLines(value);
  if (!lines.length) return `- ${fallback}`;
  return lines.map((line) => `- ${line.replace(/^[-•]\s*/, "")}`).join("\n");
}

export function ExecutiveStatusGenerator() {
  const router = useRouter();
  const started = useRef(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [captureState, setCaptureState] = useState<CaptureState>("idle");
  const [captureMessage, setCaptureMessage] = useState("");
  const [input, setInput] = useState<StatusInput>({
    projectName: "",
    reportingPeriod: "",
    status: "green",
    summary: "",
    completed: "",
    nextMilestones: "",
    risks: "",
    blockers: "",
    decisions: "",
    nextSteps: "",
  });

  const output = useMemo(() => {
    const title = input.projectName.trim() || "Proyecto";
    const period = input.reportingPeriod.trim() ? ` · ${input.reportingPeriod.trim()}` : "";
    const summary = input.summary.trim() || "El proyecto mantiene seguimiento activo y no se han documentado novedades adicionales en este corte.";

    return `${title}${period}\nEstado: ${statusLabel[input.status]}\n\nRESUMEN EJECUTIVO\n${summary}\n\nHITOS COMPLETADOS\n${bullets(input.completed, "Sin hitos completados informados en este periodo.")}\n\nPRÓXIMOS HITOS\n${bullets(input.nextMilestones, "Pendiente de concretar próximos hitos.")}\n\nRIESGOS\n${bullets(input.risks, "Sin riesgos relevantes informados.")}\n\nBLOQUEOS / DEPENDENCIAS\n${bullets(input.blockers, "Sin bloqueos relevantes informados.")}\n\nDECISIONES PENDIENTES\n${bullets(input.decisions, "Sin decisiones pendientes informadas.")}\n\nPRÓXIMOS PASOS\n${bullets(input.nextSteps, "Continuar seguimiento del plan y validar próximos compromisos.")}`;
  }, [input]);

  function update<K extends keyof StatusInput>(key: K, value: StatusInput[K]) {
    if (!started.current) {
      started.current = true;
      trackEvent("executive_status_started");
    }
    setGenerated(false);
    setCopied(false);
    setInput((current) => ({ ...current, [key]: value }));
  }

  function generate(event: FormEvent) {
    event.preventDefault();
    setGenerated(true);
    setCopied(false);
    trackEvent("executive_status_generated", {
      status: input.status,
      hasRisks: cleanLines(input.risks).length > 0,
      hasBlockers: cleanLines(input.blockers).length > 0,
      hasDecisions: cleanLines(input.decisions).length > 0,
    });
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      trackEvent("executive_status_copied", { status: input.status });
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
          source: "executive-status-generator",
          ...getLeadAttribution("executive-status-review"),
          executiveStatus: {
            inputs: input,
            output,
          },
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "No se pudo enviar la solicitud.");
      trackEvent("lead_submitted", { source: "executive-status-generator", status: input.status });
      form.reset();
      router.push("/gracias?source=executive-status-generator");
    } catch (error) {
      setCaptureState("error");
      setCaptureMessage(error instanceof Error ? error.message : "Ha ocurrido un error.");
    }
  }

  return (
    <div className="statusTool">
      <div className="toolIntro">
        <p className="eyebrow">EXECUTIVE STATUS GENERATOR · APT</p>
        <h1>Convierte el estado real del proyecto en un mensaje ejecutivo claro.</h1>
        <p>Introduce los datos esenciales del periodo y genera un resumen estructurado para comité, dirección o correo de seguimiento.</p>
      </div>

      <div className="statusGrid">
        <form className="statusForm" onSubmit={generate}>
          <div className="plannerFormHeader"><div><p className="eyebrow">ENTRADAS</p><h2>Información del corte</h2></div><span className="plannerHint">Formato ejecutivo</span></div>
          <div className="statusFields twoCols">
            <label>Proyecto<input value={input.projectName} onChange={(e)=>update("projectName", e.target.value)} placeholder="Nombre del proyecto" /></label>
            <label>Periodo / fecha<input value={input.reportingPeriod} onChange={(e)=>update("reportingPeriod", e.target.value)} placeholder="Ej. Semana 39 · 25/09/2026" /></label>
          </div>
          <label className="statusField">Estado general
            <select value={input.status} onChange={(e)=>update("status", e.target.value as StatusLevel)}>
              <option value="green">En control</option>
              <option value="amber">Atención</option>
              <option value="red">Crítico</option>
            </select>
          </label>
          <label className="statusField">Resumen ejecutivo<textarea value={input.summary} onChange={(e)=>update("summary", e.target.value)} placeholder="Situación general, evolución y mensaje principal para dirección." /></label>
          <div className="statusFields twoCols">
            <label>Hitos completados<textarea value={input.completed} onChange={(e)=>update("completed", e.target.value)} placeholder="Un hito por línea" /></label>
            <label>Próximos hitos<textarea value={input.nextMilestones} onChange={(e)=>update("nextMilestones", e.target.value)} placeholder="Un hito por línea" /></label>
            <label>Riesgos<textarea value={input.risks} onChange={(e)=>update("risks", e.target.value)} placeholder="Un riesgo por línea" /></label>
            <label>Bloqueos / dependencias<textarea value={input.blockers} onChange={(e)=>update("blockers", e.target.value)} placeholder="Un bloqueo por línea" /></label>
            <label>Decisiones pendientes<textarea value={input.decisions} onChange={(e)=>update("decisions", e.target.value)} placeholder="Una decisión por línea" /></label>
            <label>Próximos pasos<textarea value={input.nextSteps} onChange={(e)=>update("nextSteps", e.target.value)} placeholder="Una acción por línea" /></label>
          </div>
          <button className="button buttonPrimary statusGenerate" type="submit">Generar estado ejecutivo <span>→</span></button>
        </form>

        <aside className="statusPreview">
          <div className="statusPreviewHead"><div><p className="eyebrow eyebrowLight">SALIDA</p><h2>Vista ejecutiva</h2></div><span className={`statusBadge ${input.status}`}>{statusLabel[input.status]}</span></div>
          <pre>{generated ? output : "Completa la información y pulsa “Generar estado ejecutivo”."}</pre>
          <button className="button buttonLight" type="button" disabled={!generated} onClick={copyOutput}>{copied ? "Copiado" : "Copiar al portapapeles"}</button>
        </aside>
      </div>

      {generated ? (
        <section className="statusLeadBox">
          <div><p className="eyebrow">REVISIÓN DEL STATUS</p><h2>¿Quieres contrastar el mensaje antes de enviarlo?</h2><p>Recibiré junto a tu solicitud la información introducida y el status generado para entrar directamente en el contexto.</p></div>
          <form className="leadForm" onSubmit={requestReview}>
            <div className="fieldRow">
              <label>Nombre<input name="name" required minLength={2} placeholder="Tu nombre" /></label>
              <label>Email<input name="email" required type="email" placeholder="tu@email.com" /></label>
            </div>
            <div className="fieldRow">
              <label>Perfil<select name="profile" defaultValue="empresa"><option value="empresa">Empresa</option><option value="emprendedor">Emprendedor</option><option value="profesional">Profesional</option></select></label>
              <label>Empresa / proyecto<input name="company" placeholder="Opcional" /></label>
            </div>
            <label>¿Qué quieres revisar?<textarea name="message" required minLength={10} defaultValue="Quiero revisar y mejorar este estado ejecutivo antes de compartirlo." /></label>
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
