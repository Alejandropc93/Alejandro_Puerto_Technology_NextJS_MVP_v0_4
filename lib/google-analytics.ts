import { hasAnalyticsConsent } from "@/lib/privacy";

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-RZWFFNLKBG";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

let configured = false;

function clearGoogleAnalyticsCookies() {
  if (typeof document === "undefined") return;
  const names = document.cookie
    .split(";")
    .map((item) => item.trim().split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));

  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${window.location.hostname}; SameSite=Lax`;
  }
}

export function enableGoogleAnalytics() {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID || !hasAnalyticsConsent()) return;

  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
  window.dataLayer = window.dataLayer || [];
  // Use the canonical gtag queue shape expected by gtag.js. Google's
  // bootstrap pushes the function `arguments` object, not a nested array.
  if (!window.gtag) {
    window.gtag = function gtag(..._args: unknown[]) {
      window.dataLayer?.push(arguments);
    };
  }

  if (!document.getElementById("apt-ga4-script")) {
    const script = document.createElement("script");
    script.id = "apt-ga4-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    document.head.appendChild(script);
  }

  if (!configured) {
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false,
      anonymize_ip: true,
    });
    configured = true;
  }
}

export function disableGoogleAnalytics() {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  clearGoogleAnalyticsCookies();
}

function primitiveParams(metadata: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(metadata)
      .filter(([, value]) => ["string", "number", "boolean"].includes(typeof value))
      .slice(0, 24)
  );
}

export function trackGoogleAnalyticsEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !hasAnalyticsConsent() || !GA_MEASUREMENT_ID) return;
  enableGoogleAnalytics();

  const common = {
    page_path: `${window.location.pathname}${window.location.search}`,
    page_location: window.location.href,
    page_title: document.title,
  };

  window.gtag?.("event", eventName, {
    ...common,
    ...primitiveParams(params),
  });
}
