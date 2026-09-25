import type { Metadata } from "next";
import { MvpPlanner } from "@/components/MvpPlanner";

export const metadata: Metadata = {
  title: "MVP Planner",
  description: "Convierte una idea tecnológica en un MVP priorizado, con alcance, hipótesis, riesgos y roadmap inicial.",
};

export default function MvpPlannerPage() {
  return <main className="healthPage"><div className="container"><MvpPlanner /></div></main>;
}
