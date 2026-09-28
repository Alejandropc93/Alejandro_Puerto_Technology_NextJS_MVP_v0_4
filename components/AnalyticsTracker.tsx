"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/client-tracking";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("page_view", { path: pathname });
    const onPrivacyUpdated = (event: Event) => {
      const choice = (event as CustomEvent<string>).detail;
      if (choice === "accepted") trackEvent("page_view", { path: pathname, consentGranted: true });
    };
    window.addEventListener("apt-privacy-updated", onPrivacyUpdated);
    return () => window.removeEventListener("apt-privacy-updated", onPrivacyUpdated);
  }, [pathname]);

  return null;
}
