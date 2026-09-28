"use client";

import { useEffect } from "react";
import { getPrivacyChoice } from "@/lib/privacy";
import { disableGoogleAnalytics, enableGoogleAnalytics } from "@/lib/google-analytics";

export function GoogleAnalytics() {
  useEffect(() => {
    const applyChoice = (choice = getPrivacyChoice()) => {
      if (choice === "accepted") enableGoogleAnalytics();
      else disableGoogleAnalytics();
    };

    applyChoice();
    const onPrivacyUpdated = (event: Event) => {
      applyChoice((event as CustomEvent<"accepted" | "rejected">).detail);
    };
    window.addEventListener("apt-privacy-updated", onPrivacyUpdated);
    return () => window.removeEventListener("apt-privacy-updated", onPrivacyUpdated);
  }, []);

  return null;
}
