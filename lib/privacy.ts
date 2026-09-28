export type PrivacyChoice = "accepted" | "rejected" | null;

const STORAGE_KEY = "apt_privacy_choice";

export function getPrivacyChoice(): PrivacyChoice {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function setPrivacyChoice(choice: Exclude<PrivacyChoice, null>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, choice);
  window.dispatchEvent(new CustomEvent("apt-privacy-updated", { detail: choice }));
}

export function hasAnalyticsConsent() {
  return getPrivacyChoice() === "accepted";
}

export function openPrivacyPreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("apt-open-privacy"));
}
