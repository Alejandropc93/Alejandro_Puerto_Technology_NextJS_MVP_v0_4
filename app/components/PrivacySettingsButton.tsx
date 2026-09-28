"use client";

import { openPrivacyPreferences } from "@/lib/privacy";

export function PrivacySettingsButton() {
  return <button className="footerPrivacyButton" type="button" onClick={openPrivacyPreferences}>Configurar privacidad</button>;
}
