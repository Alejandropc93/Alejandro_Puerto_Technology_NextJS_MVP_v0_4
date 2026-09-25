import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { getSiteUrl } from "@/lib/url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  metadataBase: new URL(baseUrl),
  applicationName: site.name,
  authors: [{ name: "Alejandro Puerto" }],
  creator: "Alejandro Puerto",
  keywords: ["project management", "delivery management", "consultoría tecnológica", "gestión de proyectos IT", "mentoring", "MVP", "emprendedores tecnológicos"],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: site.name,
    title: site.name,
    description: site.description,
    url: baseUrl,
  },
  twitter: {
    card: "summary",
    title: site.name,
    description: site.description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <a className="skipLink" href="#main-content">Saltar al contenido</a>
        <AnalyticsTracker />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
