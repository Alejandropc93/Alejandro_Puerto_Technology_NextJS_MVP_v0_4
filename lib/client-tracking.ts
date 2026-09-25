export function getLeadAttribution(cta: string) {
  if (typeof window === "undefined") return { cta };

  const params = new URLSearchParams(window.location.search);
  return {
    cta,
    landingPage: `${window.location.pathname}${window.location.search}`.slice(0, 1000),
    referrer: document.referrer.slice(0, 1000),
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmContent: params.get("utm_content") || "",
    utmTerm: params.get("utm_term") || "",
  };
}
