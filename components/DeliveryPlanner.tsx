"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getLeadAttribution, trackEvent } from "@/lib/client-tracking";

type PlannerInput = {
  effortHours: number;
  fte: number;
  hoursPerDay: number;
  utilization: number;
  contingency: number;
  vacationDays: number;
  dependencyDays: number;
  startDate: string;
  targetDate: string;
};

type Estimate = {
  adjustedEffort: number;
  dailyCapacity: number;
  buildDays: number;
  totalWorkdays: number;
  finishDate: Date | null;
};

type CaptureState = "idle" | "sending" | "error";

function parseLocalDate(value: string) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day, 12, 0, 0);
}

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function isWeekday(date: Date) {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

function addBusinessDaysInclusive(start: Date | null, days: number) {
  if (!start || days <= 0) return start;
  const current = new Date(start);
  let counted = 0;
  while (counted < Math.ceil(days)) {
    if (isWeekday(current)) counted += 1;
    if (counted < Math.ceil(days)) current.setDate(current.getDate() + 1);
  }
  return current;
}

function businessDaysInclusive(start: Date | null, end: Date | null) {
  if (!start || !end || end < start) return 0;
  const cursor = new Date(start);
  let count = 0;
  while (cursor <= end) {
    if (isWeekday(cursor)) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

function estimate(input: PlannerInput, fte = input.fte, utilization = input.utilization, contingency = input.contingency): Estimate {
  const adjustedEffort = input.effortHours * (1 + contingency / 100);
  const dailyCapacity = fte * input.hoursPerDay * (utilization / 100);
  const buildDays = dailyCapacity > 0 ? Math.ceil(adjustedEffort / dailyCapacity) : 0;
  const totalWorkdays = buildDays + input.vacationDays + input.dependencyDays;
  const finishDate = addBusinessDaysInclusive(parseLocalDate(input.startDate), totalWorkdays);
  return { adjustedEffort, dailyCapacity, buildDays, totalWorkdays, finishDate };
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

export function DeliveryPlanner() {
  const router = useRouter();
  const started = useRef(false);
  const [captureState, setCaptureState] = useState<CaptureState>("idle");
  const [captureMessage, setCaptureMessage] = useState("");
  const [input, setInput] = useState<PlannerInput>({
    effortHours: 800,
    fte: 1.5,
    hoursPerDay: 7,
    utilization: 80,
    contingency: 10,
    vacationDays: 5,
    dependencyDays: 5,
    startDate: new Date().toISOString().slice(0, 10),
    targetDate: "",
  });
  const [calculated, setCalculated] = useState(false);

  const base = useMemo(() => estimate(input), [input]);
  const conservative = useMemo(
    () => estimate(input, input.fte, Math.max(40, input.utilization - 10), Math.min(50, input.contingency + 5)),
    [input]
  );
  const reinforced = useMemo(() => estimate(input, input.fte * 1.25, input.utilization, input.contingency), [input]);

  const target = parseLocalDate(input.targetDate);
  const start = parseLocalDate(input.startDate);
  const targetBusinessDays = businessDaysInclusive(start, target);
  const productiveTargetDays = Math.max(0, targetBusinessDays - input.vacationDays - input.dependencyDays);
  const requiredFte = productiveTargetDays > 0
    ? base.adjustedEffort / (productiveTargetDays * input.hoursPerDay * (input.utilization / 100))
    : null;
  const targetGap = requiredFte == null ? null : round1(requiredFte - input.fte);
  const targetFeasible = target && base.finishDate ? base.finishDate <= target : null;

  function update<K extends keyof PlannerInput>(key: K, value: PlannerInput[K]) {
    if (!started.current) {
      started.current = true;
      trackEvent("delivery_planner_started");
    }
    setCalculated(false);
    setInput((current) => ({ ...current, [key]: value }));
  }

  function calculate(event: FormEvent) {
    event.preventDefault();
    setCalculated(true);
    trackEvent("delivery_planner_calculated", {
      effortHours: input.effortHours,
      fte: input.fte,
      estimatedWorkdays: base.totalWorkdays,
      targetFeasible,
    });
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
          source: "delivery-planner",
          ...getLeadAttribution("delivery-planner-review"),
          deliveryPlanner: {
            inputs: input,
            result: {
              adjustedEffort: Math.round(base.adjustedEffort),
              dailyCapacity: round1(base.dailyCapacity),
              buildDays: base.buildDays,
              totalWorkdays: base.totalWorkdays,
              finishDate: base.finishDate?.toISOString().slice(0, 10) || null,
              targetFeasible,
              requiredFte: requiredFte == null ? null : round1(requiredFte),
            },
          },
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "No se pudo enviar la solicitud.");
      trackEvent("lead_submitted", { source: "delivery-planner", targetFeasible });
      form.reset();
      router.push("/gracias?source=delivery-planner");
    } catch (error) {
      setCaptureState("error");
      setCaptureMessage(error instanceof Error ? error.message : "Ha ocurrido un error.");
    }
  }

  return (
    <div className="plannerTool">
      <div className="toolIntro">
        <p className="eyebrow">DELIVERY PLANNER · APT</p>
        <h1>Convierte esfuerzo y capacidad en una fecha defendible.</h1>
        <p>Modela esfuerzo, FTE, vacaciones, bloqueos y fecha objetivo. Obtén una estimación base, un escenario conservador y el impacto de reforzar el equipo.</p>
      </div>

      <div className="plannerGrid">
        <form className="plannerForm" onSubmit={calculate}>
          <div className="plannerFormHeader"><div><p className="eyebrow">ENTRADAS</p><h2>Datos de planificación</h2></div><span className="plannerHint">Días laborables · L–V</span></div>
          <div className="plannerFields">
            <label>Esfuerzo total (horas)<input type="number" min="1" step="1" value={input.effortHours} onChange={(e)=>update("effortHours", Number(e.target.value))} /></label>
            <label>Capacidad del equipo (FTE)<input type="number" min="0.1" step="0.1" value={input.fte} onChange={(e)=>update("fte", Number(e.target.value))} /></label>
            <label>Horas / día por FTE<input type="number" min="1" max="12" step="0.5" value={input.hoursPerDay} onChange={(e)=>update("hoursPerDay", Number(e.target.value))} /></label>
            <label>Utilización productiva (%)<input type="number" min="40" max="100" step="5" value={input.utilization} onChange={(e)=>update("utilization", Number(e.target.value))} /></label>
            <label>Contingencia de esfuerzo (%)<input type="number" min="0" max="50" step="5" value={input.contingency} onChange={(e)=>update("contingency", Number(e.target.value))} /></label>
            <label>Vacaciones / no disponibilidad (días)<input type="number" min="0" step="1" value={input.vacationDays} onChange={(e)=>update("vacationDays", Number(e.target.value))} /></label>
            <label>Bloqueos / dependencias (días)<input type="number" min="0" step="1" value={input.dependencyDays} onChange={(e)=>update("dependencyDays", Number(e.target.value))} /></label>
            <label>Fecha de inicio<input type="date" value={input.startDate} onChange={(e)=>update("startDate", e.target.value)} /></label>
            <label>Fecha objetivo <span>(opcional)</span><input type="date" min={input.startDate} value={input.targetDate} onChange={(e)=>update("targetDate", e.target.value)} /></label>
          </div>
          <button className="button buttonPrimary plannerCalculate" type="submit">Calcular planificación <span>→</span></button>
          <p className="plannerFinePrint">Estimación orientativa. No sustituye una planificación detallada por perfiles, tareas y dependencias reales.</p>
        </form>

        <aside className="plannerSummary">
          <p className="eyebrow eyebrowLight">ESCENARIO BASE</p>
          <div className="plannerDate"><span>Fecha estimada</span><strong>{formatDate(base.finishDate)}</strong></div>
          <div className="plannerKpis">
            <div><span>Esfuerzo ajustado</span><strong>{Math.round(base.adjustedEffort)} h</strong></div>
            <div><span>Capacidad efectiva</span><strong>{round1(base.dailyCapacity)} h/día</strong></div>
            <div><span>Desarrollo</span><strong>{base.buildDays} días</strong></div>
            <div><span>Calendario total</span><strong>{base.totalWorkdays} días</strong></div>
          </div>
          {input.targetDate ? (
            <div className={`targetVerdict ${targetFeasible ? "ok" : "risk"}`}>
              <strong>{targetFeasible ? "Fecha objetivo alcanzable" : "La fecha objetivo requiere ajuste"}</strong>
              {requiredFte != null ? <span>FTE estimado para objetivo: {round1(requiredFte)} {targetGap != null && targetGap > 0 ? `(faltan +${targetGap} FTE)` : ""}</span> : <span>No hay días productivos suficientes entre inicio y objetivo.</span>}
            </div>
          ) : <div className="targetVerdict neutral"><strong>Añade una fecha objetivo</strong><span>Calcularemos el FTE necesario para llegar.</span></div>}
        </aside>
      </div>

      {calculated ? (
        <section className="plannerResults" aria-live="polite">
          <div className="plannerResultsHead"><div><p className="eyebrow">ESCENARIOS</p><h2>Compara antes de comprometer una fecha</h2></div><p>Los escenarios muestran cómo cambian las fechas cuando reducimos productividad o reforzamos capacidad.</p></div>
          <div className="scenarioGrid">
            <article className="scenarioCard"><span>Conservador</span><strong>{formatDate(conservative.finishDate)}</strong><p>{conservative.totalWorkdays} días · utilización {Math.max(40, input.utilization - 10)}% · contingencia {Math.min(50, input.contingency + 5)}%</p></article>
            <article className="scenarioCard featured"><span>Base</span><strong>{formatDate(base.finishDate)}</strong><p>{base.totalWorkdays} días · {input.fte} FTE · utilización {input.utilization}%</p></article>
            <article className="scenarioCard"><span>Refuerzo +25%</span><strong>{formatDate(reinforced.finishDate)}</strong><p>{reinforced.totalWorkdays} días · {round1(input.fte * 1.25)} FTE · mismas hipótesis de calidad</p></article>
          </div>

          <div className="plannerInsight">
            <div><p className="eyebrow">LECTURA EJECUTIVA</p><h3>{targetFeasible === false ? "El compromiso actual necesita capacidad, plazo o alcance." : "La planificación tiene una base defendible."}</h3></div>
            <p>{targetFeasible === false && requiredFte != null ? `Con las hipótesis actuales, llegar a ${formatDate(target)} requiere aproximadamente ${round1(requiredFte)} FTE. Puedes actuar sobre capacidad, alcance, bloqueos o fecha objetivo antes de comprometer el plan.` : `El escenario base sitúa la finalización en ${formatDate(base.finishDate)}. Conviene validar después el reparto por perfiles, dependencias críticas y estrategia de pruebas.`}</p>
          </div>

          <div className="plannerLeadBox">
            <div><p className="eyebrow">REVISIÓN DEL PLAN</p><h2>¿Quieres contrastar este escenario conmigo?</h2><p>Recibiré junto a tu solicitud las hipótesis y el resultado del planner para poder entrar directamente en el análisis.</p></div>
            <form className="leadForm" onSubmit={requestReview}>
              <div className="fieldRow">
                <label>Nombre<input name="name" required minLength={2} placeholder="Tu nombre" /></label>
                <label>Email<input name="email" required type="email" placeholder="tu@email.com" /></label>
              </div>
              <div className="fieldRow">
                <label>Perfil<select name="profile" defaultValue="empresa"><option value="empresa">Empresa</option><option value="emprendedor">Emprendedor</option><option value="profesional">Profesional</option></select></label>
                <label>Empresa / proyecto<input name="company" placeholder="Opcional" /></label>
              </div>
              <label>Contexto adicional<textarea name="message" placeholder="Opcional: dependencias, fecha comprometida, equipo o cualquier restricción relevante." /></label>
              <label className="websiteTrap" aria-hidden="true">Web<input name="website" tabIndex={-1} autoComplete="off" /></label>
              <label className="consentRow"><input name="consent" type="checkbox" value="yes" required /><span>Acepto que mis datos y este escenario se utilicen para responder a mi solicitud.</span></label>
              <button className="button buttonDark" type="submit" disabled={captureState === "sending"}>{captureState === "sending" ? "Enviando..." : "Solicitar revisión"} <span>→</span></button>
              {captureMessage ? <p className={`formMessage ${captureState}`}>{captureMessage}</p> : null}
            </form>
          </div>
        </section>
      ) : null}
    </div>
  );
}
