import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/url";
import { resources } from "@/lib/resources";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const routes = [
    "",
    "/servicios",
    "/emprendedores",
    "/formacion",
    "/tools",
    "/sobre-mi",
    "/recursos",
    "/contacto",
    "/project-health-check",
    "/delivery-planner",
    "/mvp-planner",
    "/executive-status-generator",
    "/aviso-legal",
    "/privacidad",
    "/cookies",
  ];
  const staticRoutes = routes.map((route) => ({ url: `${baseUrl}${route}`, changeFrequency: "monthly" as const, priority: route === "" ? 1 : route === "/contacto" ? 0.9 : 0.8 }));
  const resourceRoutes = resources.map((resource) => ({ url: `${baseUrl}/recursos/${resource.slug}`, changeFrequency: "monthly" as const, priority: 0.75 }));
  return [...staticRoutes, ...resourceRoutes];
}
