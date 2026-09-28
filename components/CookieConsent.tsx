"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPrivacyChoice, setPrivacyChoice } from "@/lib/privacy";

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(getPrivacyChoice() === null);
    const reopen = () => setOpen(true);
    window.addEventListener("apt-open-privacy", reopen);
    return () => window.removeEventListener("apt-open-privacy", reopen);
  }, []);

  if (!open) return null;

  function choose(choice: "accepted" | "rejected") {
    setPrivacyChoice(choice);
    setOpen(false);
  }

  return (
    <div className="privacyBanner" role="dialog" aria-modal="true" aria-label="Preferencias de privacidad">
      <div className="privacyBannerInner">
        <div>
          <strong>Privacidad y medición</strong>
          <p>
            Usamos almacenamiento técnico para recordar tus preferencias. Con tu permiso, medimos el uso de la web mediante analítica propia y Google Analytics 4 para mejorar contenidos, herramientas y conversiones.
          </p>
          <Link href="/cookies">Ver política de cookies y tecnologías equivalentes</Link>
        </div>
        <div className="privacyActions">
          <button type="button" className="button buttonLight privacyChoiceButton" onClick={() => choose("rejected")}>Rechazar analítica</button>
          <button type="button" className="button buttonLight privacyChoiceButton" onClick={() => choose("accepted")}>Aceptar analítica</button>
        </div>
      </div>
    </div>
  );
}
