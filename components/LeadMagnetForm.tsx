"use client";

import { FormEvent, useState } from "react";
import { getLeadAttribution, trackEvent } from "@/lib/client-tracking";

export function LeadMagnetForm() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const profile = String(data.get("profile") || "profesional");
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      company: String(data.get("company") || ""),
      profile,
      source: "kickoff-checklist",
      message: "Descarga solicitada: Project Kickoff Checklist de Alejandro Puerto Technology.",
      consent: data.get("consent") === "yes" ? "yes" : "no",
      website: String(data.get("website") || ""),
      ...getLeadAttribution("download-project-kickoff-checklist"),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo registrar la descarga.");

      trackEvent("lead_magnet_downloaded", { asset: "project-kickoff-checklist", profile });
      setState("success");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "No se pudo completar la solicitud.");
    }
  }

  return (
    <div className="leadMagnetFormCard" onFocus={() => trackEvent("lead_magnet_started", { asset: "project-kickoff-checklist" })}>
      {state === "success" ? (
        <div className="leadMagnetSuccess">
          <span className="leadMagnetSuccessIcon">✓</span>
          <h3>Tu checklist está preparado.</h3>
          <p>Úsalo antes de arrancar un proyecto, una nueva fase o una iniciativa con varios equipos/proveedores.</p>
          <a
            className="button buttonPrimary"
            href="/resources/project-kickoff-checklist-apt.pdf"
            download
            onClick={() => trackEvent("lead_magnet_file_clicked", { asset: "project-kickoff-checklist" })}
          >
            Descargar PDF <span>→</span>
          </a>
          <a className="leadMagnetSecondaryLink" href="/project-health-check">Después, diagnostica tu proyecto →</a>
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <p className="eyebrow">DESCARGA GRATUITA</p>
          <h3>Recibe el Project Kickoff Checklist</h3>
          <p className="leadMagnetFormIntro">Déjame tus datos y tendrás acceso inmediato al PDF.</p>
          <div className="formGrid leadMagnetFields">
            <label>Nombre<input name="name" required minLength={2} placeholder="Tu nombre" /></label>
            <label>Email<input name="email" type="email" required placeholder="tu@email.com" /></label>
            <label>Empresa / proyecto<input name="company" placeholder="Opcional" /></label>
            <label>Perfil<select name="profile" defaultValue="empresa"><option value="empresa">Empresa</option><option value="emprendedor">Emprendedor</option><option value="profesional">Profesional</option></select></label>
          </div>
          <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label className="consentRow"><input type="checkbox" name="consent" value="yes" required /> <span>Acepto que mis datos se utilicen para gestionar esta descarga y el contacto relacionado.</span></label>
          <button className="button buttonPrimary leadMagnetSubmit" type="submit" disabled={state === "sending"}>
            {state === "sending" ? "Preparando..." : "Quiero el checklist"} <span>→</span>
          </button>
          {state === "error" && <p className="formError">{message}</p>}
          <small className="leadMagnetPrivacy">Sin newsletter automática ni spam. Solo contexto útil relacionado con Alejandro Puerto Technology.</small>
        </form>
      )}
    </div>
  );
}
