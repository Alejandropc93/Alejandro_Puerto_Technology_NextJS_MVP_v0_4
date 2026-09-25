import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Cuéntame tu proyecto, idea o necesidad de gestión y revisamos cuál puede ser el siguiente paso.",
};

export default function ContactPage() {
  return (
    <div className="page">
      <section className="pageHero contactHero contactHeroPremium">
        <div className="container contactLayout">
          <div className="contactIntro">
            <p className="eyebrow">CONTACTO</p>
            <h1>Hablemos de tu proyecto.</h1>
            <p>Cuéntame el contexto, dónde está el bloqueo o qué quieres conseguir. La primera conversación sirve para entender la situación y comprobar si puedo ayudarte de forma útil.</p>
            <div className="contactPromise">
              <article><strong>01</strong><span>Contacto directo conmigo</span></article>
              <article><strong>02</strong><span>Contexto antes que una propuesta genérica</span></article>
              <article><strong>03</strong><span>Siguiente paso claro si tiene sentido avanzar</span></article>
            </div>
          </div>
          <div className="formShell formShellPremium">
            <div className="formShellHead"><span>CUÉNTAME TU SITUACIÓN</span><strong>Empecemos por lo esencial.</strong></div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
