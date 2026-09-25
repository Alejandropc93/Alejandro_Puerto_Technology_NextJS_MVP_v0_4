export type LeadPriority = "low" | "medium" | "high";

type ScoreInput = {
  profile: string;
  company?: string | null;
  message: string;
  source: string;
  healthScore?: number | null;
  utmCampaign?: string | null;
};

export function scoreLead(input: ScoreInput) {
  let score = 15;

  if (input.profile === "empresa") score += 20;
  else if (input.profile === "emprendedor") score += 14;
  else score += 8;

  if (input.company) score += 10;
  if (input.message.trim().length >= 80) score += 10;
  if (input.source === "project-health-check") score += 20;
  else if (input.source === "delivery-planner") score += 18;
  else if (input.source === "contact") score += 10;

  if (typeof input.healthScore === "number") {
    if (input.healthScore < 60) score += 10;
    else score += 5;
  }

  if (input.utmCampaign) score += 5;

  const normalized = Math.min(100, Math.max(0, score));
  const priority: LeadPriority = normalized >= 70 ? "high" : normalized >= 45 ? "medium" : "low";

  return { score: normalized, priority };
}
