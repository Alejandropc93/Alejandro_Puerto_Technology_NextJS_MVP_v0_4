"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getLeadAttribution } from "@/lib/client-tracking";

type FormState = "idle" | "sending" | "success" | "error";

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "contact", ...getLeadAttribution("contact-form") }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "No se pudo enviar la solicitud.");

      setState("success");
      form.reset();
      if (payload.persisted) {
        router.push("/gracias?source=contact");
        return;
      }
      setMessage("Solicitud validada correctamente. La persistencia se activará al conectar Supabase.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Ha ocurrido un error.");
    }
  }

  return (
    <form className={compact ? "leadForm compactForm" : "leadForm"} onSubmit={submit}>
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
      <label>¿En qué puedo ayudarte?
        <textarea name="message" required minLength={10} placeholder="Cuéntame brevemente tu situación, objetivo o proyecto." />
      </label>
      <label className="websiteTrap" aria-hidden="true">Web<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="consentRow">
        <input name="consent" type="checkbox" value="yes" required />
        <span>Acepto que mis datos se utilicen para responder a esta solicitud.</span>
      </label>
      <button className="button buttonPrimary" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Enviando..." : "Enviar solicitud"} <span>→</span>
      </button>
      {message ? <p className={`formMessage ${state}`}>{message}</p> : null}
    </form>
  );
}
