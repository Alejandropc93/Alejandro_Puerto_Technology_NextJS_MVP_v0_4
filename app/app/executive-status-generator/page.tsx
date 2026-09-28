import type { Metadata } from "next";
import { ExecutiveStatusGenerator } from "@/components/ExecutiveStatusGenerator";

export const metadata: Metadata = {
  title: "Executive Status Generator",
  description: "Genera un estado ejecutivo de proyecto claro y accionable a partir de hitos, riesgos, bloqueos, decisiones y próximos pasos.",
};

export default function ExecutiveStatusGeneratorPage() {
  return <main className="healthPage"><div className="container"><ExecutiveStatusGenerator /></div></main>;
}
