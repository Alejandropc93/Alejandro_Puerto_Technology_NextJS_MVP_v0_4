import { hasAnalyticsConsent } from "@/lib/privacy";
import { trackGoogleAnalyticsEvent } from "@/lib/google-analytics";

function getSessionId() {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return "";
  const key = "apt_session_id";
  let value = sessionStorage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    sessionStorage.setItem(key, value);
  }
  return value;
}

type Attribution = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
};

const EMPTY_ATTRIBUTION: Attribution = {
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  utmTerm: "",
};

function getAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY_ATTRIBUTION;
  const params = new URLSearchParams(window.location.search);

  const current: Attribution = {
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
    try { return JSON.parse(stored) as Attribution; } catch { /* noop */ }
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
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;
  const attribution = getAttribution();
  const path = `${window.location.pathname}${window.location.search}`;

  trackGoogleAnalyticsEvent(eventName, {
    path,
    utm_source: attribution.utmSource,
    utm_medium: attribution.utmMedium,
    utm_campaign: attribution.utmCampaign,
    ...metadata,
  });

  const payload = {
    eventName,
    sessionId: getSessionId(),
    path,
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
