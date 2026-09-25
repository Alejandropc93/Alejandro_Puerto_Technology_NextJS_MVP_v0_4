import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contacto" };

export default function ContactPage() {
  return <div className="page"><section className="pageHero contactHero"><div className="container contactLayout"><div><p className="eyebrow">CONTACTO</p><h1>Hablemos de tu proyecto.</h1><p>Cuéntame el contexto, dónde está el bloqueo o qué quieres conseguir. La primera conversación debe servir para entender si puedo aportar valor y cuál sería el siguiente paso.</p><div className="contactPoints"><span>01 · Empresas y proyectos IT</span><span>02 · Emprendedores tecnológicos</span><span>03 · Mentoring y formación</span></div></div><div className="formShell"><ContactForm /></div></div></section></div>;
}
