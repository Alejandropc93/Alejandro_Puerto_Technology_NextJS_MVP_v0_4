"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getLeadAttribution } from "@/lib/client-tracking";

type Question = { id: string; area: string; text: string };
type CaptureState = "idle" | "sending" | "success" | "error";

const questions: Question[] = [
  { id: "scope", area: "Alcance", text: "El alcance del proyecto está definido, entendido y controlado." },
  { id: "plan", area: "Planificación", text: "Existe una planificación realista con hitos, dependencias y responsables." },
  { id: "capacity", area: "Capacidad", text: "La capacidad del equipo es suficiente y está alineada con las fechas objetivo." },
  { id: "risks", area: "Riesgos", text: "Los riesgos se identifican, priorizan y tienen acciones de mitigación." },
  { id: "governance", area: "Gobernanza", text: "Las decisiones, escalados y responsabilidades están claramente definidos." },
  { id: "delivery", area: "Delivery", text: "El avance se mide por entregables y resultados, no solo por horas consumidas." },
  { id: "stakeholders", area: "Stakeholders", text: "Negocio, tecnología y proveedores están alineados con prioridades y expectativas." },
  { id: "quality", area: "Calidad", text: "Las pruebas, criterios de aceptación y estrategia de calidad están planificados." },
  { id: "reporting", area: "Reporting", text: "Existe visibilidad ejecutiva clara sobre estado, bloqueos, riesgos y próximos pasos." },
  { id: "change", area: "Cambio", text: "Los cambios de alcance o prioridades se gestionan de forma controlada." },
];

function band(score: number) {
  if (score >= 80) return { label: "Saludable", text: "La base del proyecto es sólida. El foco debe estar en mantener disciplina de ejecución y anticipar desviaciones." };
  if (score >= 60) return { label: "Atención", text: "El proyecto tiene una base razonable, pero existen áreas que pueden comprometer plazo, alcance o control si no se corrigen." };
  if (score >= 40) return { label: "Riesgo", text: "Hay señales relevantes de desalineación o falta de control. Conviene priorizar un plan de estabilización." };
  return { label: "Crítico", text: "El proyecto presenta varios factores de riesgo simultáneos. Es recomendable una revisión estructurada antes de seguir acumulando desviación." };
}

export function ProjectHealthCheck() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [captureState, setCaptureState] = useState<CaptureState>("idle");
  const [captureMessage, setCaptureMessage] = useState("");

  const completed = Object.keys(answers).length;
  const score = useMemo(() => {
    if (!submitted || completed !== questions.length) return null;
    const total = Object.values(answers).reduce((a, b) => a + b, 0);
    return Math.round((total / (questions.length * 5)) * 100);
  }, [answers, completed, submitted]);

  function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
  }

  const result = score === null ? null : band(score);
  const weakest = score === null
    ? []
    : questions
        .map((q) => ({ ...q, value: answers[q.id] }))
        .sort((a, b) => a.value - b.value)
        .slice(0, 3);

  async function requestReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (score === null || !result) return;

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
          source: "project-health-check",
          ...getLeadAttribution("project-health-check-review"),
          healthCheck: {
            score,
            band: result.label,
            answers,
            weakestAreas: weakest.map((item) => item.area),
          },
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "No se pudo enviar la solicitud.");

      setCaptureState("success");
      form.reset();
      if (payload.persisted) {
        router.push("/gracias?source=project-health-check");
        return;
      }
      setCaptureMessage("Solicitud validada. Cuando conectemos Supabase, el diagnóstico quedará almacenado automáticamente con el lead.");
    } catch (error) {
      setCaptureState("error");
      setCaptureMessage(error instanceof Error ? error.message : "Ha ocurrido un error.");
    }
  }

  return (
    <div className="healthTool">
      <div className="toolIntro">
        <p className="eyebrow">PROJECT HEALTH CHECK · V1</p>
        <h1>¿Qué tan controlado está realmente tu proyecto?</h1>
        <p>Evalúa 10 dimensiones clave en menos de cinco minutos y obtén una lectura inicial del estado de tu proyecto.</p>
        <div className="progress"><span style={{ width: `${(completed / questions.length) * 100}%` }} /></div>
        <small>{completed} de {questions.length} respuestas</small>
      </div>

      <form className="questionnaire" onSubmit={submit}>
        {questions.map((question, index) => (
          <fieldset key={question.id} className="questionCard">
            <legend><span>{String(index + 1).padStart(2, "0")}</span><strong>{question.area}</strong></legend>
            <p>{question.text}</p>
            <div className="scale" role="radiogroup" aria-label={question.text}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className={answers[question.id] === value ? "selected" : ""}>
                  <input
                    required
                    type="radio"
                    name={question.id}
                    value={value}
                    checked={answers[question.id] === value}
                    onChange={() => setAnswers((current) => ({ ...current, [question.id]: value }))}
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>
            <div className="scaleLabels"><span>Muy débil</span><span>Muy sólido</span></div>
          </fieldset>
        ))}
        <button className="button buttonPrimary healthSubmit" type="submit">Obtener diagnóstico <span>→</span></button>
      </form>

      {submitted && completed < questions.length ? (
        <p className="formMessage error">Responde todas las preguntas para generar el diagnóstico.</p>
      ) : null}

      {score !== null && result ? (
        <section className="resultPanel" aria-live="polite">
          <div className="scoreRing"><strong>{score}</strong><span>/100</span></div>
          <div>
            <p className="eyebrow">DIAGNÓSTICO INICIAL</p>
            <h2>{result.label}</h2>
            <p>{result.text}</p>
            <h3>Áreas prioritarias</h3>
            <ul>{weakest.map((item) => <li key={item.id}><strong>{item.area}</strong> · puntuación {item.value}/5</li>)}</ul>

            <div className="healthLeadBox">
              <div>
                <p className="eyebrow">SIGUIENTE PASO</p>
                <h3>¿Quieres que revise este diagnóstico contigo?</h3>
                <p>Déjame tus datos y recibiré tu puntuación y las áreas prioritarias junto a la solicitud.</p>
              </div>
              <form className="leadForm healthLeadForm" onSubmit={requestReview}>
                <div className="fieldRow">
                  <label>Nombre<input name="name" required minLength={2} placeholder="Tu nombre" /></label>
                  <label>Email<input name="email" required type="email" placeholder="tu@email.com" /></label>
                </div>
                <div className="fieldRow">
                  <label>Perfil
                    <select name="profile" defaultValue="empresa">
                      <option value="empresa">Empresa</option>
                      <option value="emprendedor">Emprendedor</option>
                      <option value="profesional">Profesional</option>
                    </select>
                  </label>
                  <label>Empresa / proyecto<input name="company" placeholder="Opcional" /></label>
                </div>
                <label>Contexto adicional
                  <textarea name="message" minLength={10} placeholder="Opcional: cuéntame qué te preocupa o qué objetivo quieres conseguir." />
                </label>
                <label className="websiteTrap" aria-hidden="true">Web<input name="website" tabIndex={-1} autoComplete="off" /></label>
                <label className="consentRow">
                  <input name="consent" type="checkbox" value="yes" required />
                  <span>Acepto que mis datos y este diagnóstico se utilicen para responder a mi solicitud.</span>
                </label>
                <button className="button buttonDark" type="submit" disabled={captureState === "sending"}>
                  {captureState === "sending" ? "Enviando..." : "Solicitar revisión"} <span>→</span>
                </button>
                {captureMessage ? <p className={`formMessage ${captureState}`}>{captureMessage}</p> : null}
              </form>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
