import type { Metadata } from "next";
import { DeliveryPlanner } from "@/components/DeliveryPlanner";

export const metadata: Metadata = {
  title: "Delivery Planner",
  description: "Calcula capacidad, FTE, vacaciones, bloqueos y fecha objetivo para obtener escenarios de planificación de proyectos tecnológicos.",
};

export default function DeliveryPlannerPage() {
  return <main className="healthPage"><div className="container"><DeliveryPlanner /></div></main>;
}
