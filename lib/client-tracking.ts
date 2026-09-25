function getSessionId() {
  if (typeof window === "undefined") return "";
  const key = "apt_session_id";
  let value = sessionStorage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    sessionStorage.setItem(key, value);
  }
  return value;
}

function getAttribution() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);

  const current = {
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmContent: params.get("utm_content") || "",
    utmTerm: params.get("utm_term") || "",
  };

  const key = "apt_attribution";
  const stored = sessionStorage.getItem(key);
  const hasCurrent = Boolean(current.utmSource || current.utmMedium || current.utmCampaign || current.utmContent || current.utmTerm);
  if (hasCurrent) {
    sessionStorage.setItem(key, JSON.stringify(current));
    return current;
  }

  if (stored) {
    try { return JSON.parse(stored) as typeof current; } catch { /* noop */ }
  }
  return current;
}

export function getLeadAttribution(cta: string) {
  if (typeof window === "undefined") return { cta };
  const attribution = getAttribution();
  return {
    cta,
    landingPage: `${window.location.pathname}${window.location.search}`.slice(0, 1000),
    referrer: document.referrer.slice(0, 1000),
    ...attribution,
  };
}

export function trackEvent(eventName: string, metadata: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const attribution = getAttribution();
  const payload = {
    eventName,
    sessionId: getSessionId(),
    path: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer,
    ...attribution,
    metadata,
  };

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined);
}
