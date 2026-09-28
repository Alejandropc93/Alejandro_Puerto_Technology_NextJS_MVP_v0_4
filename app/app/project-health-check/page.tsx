import type { Metadata } from "next";
import { ProjectHealthCheck } from "@/components/ProjectHealthCheck";

export const metadata: Metadata = { title: "Project Health Check", description: "Diagnóstico inicial de salud de proyectos tecnológicos." };

export default function HealthCheckPage() {
  return <section className="healthPage"><div className="container"><ProjectHealthCheck /></div></section>;
}
