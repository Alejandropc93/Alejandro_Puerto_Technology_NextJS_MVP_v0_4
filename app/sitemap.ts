import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const routes = [
    "",
    "/servicios",
    "/emprendedores",
    "/formacion",
    "/tools",
    "/sobre-mi",
    "/contacto",
    "/project-health-check",
    "/delivery-planner",
    "/mvp-planner",
    "/executive-status-generator",
  ];
  return routes.map((route) => ({ url: `${baseUrl}${route}`, changeFrequency: "monthly", priority: route === "" ? 1 : route === "/contacto" ? 0.9 : 0.8 }));
}
