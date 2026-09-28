import Link from "next/link";
import { Logo } from "./Logo";
import { PrivacySettingsButton } from "./PrivacySettingsButton";

const tools = [
  ["Project Health Check", "/project-health-check"],
  ["Delivery Planner", "/delivery-planner"],
  ["MVP Planner", "/mvp-planner"],
  ["Executive Status", "/executive-status-generator"],
] as const;

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footerGrid footerGridExpanded">
        <div className="footerBrand">
          <Logo />
          <p className="footerCopy">Tecnología con claridad, confianza y ejecución.</p>
          <p className="footerDirect">Consultoría, delivery, mentoring y herramientas prácticas con trato directo.</p>
        </div>
        <div>
          <strong>Servicios</strong>
          <Link href="/servicios">Consultoría & Delivery</Link>
          <Link href="/emprendedores">Para emprendedores</Link>
          <Link href="/formacion">Formación & Mentoring</Link>
          <Link href="/sobre-mi">Sobre mí</Link>
          <Link href="/recursos">Recursos & Insights</Link>
        </div>
        <div>
          <strong>APT Lab</strong>
          {tools.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </div>
        <div>
          <strong>Información</strong>
          <Link href="/contacto">Contacto</Link>
          <Link href="/aviso-legal">Aviso legal</Link>
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/cookies">Cookies</Link>
          <PrivacySettingsButton />
        </div>
      </div>
      <div className="container footerBottom">
        <span>© 2026 Alejandro Puerto Technology</span>
        <span>De la idea a la ejecución.</span>
      </div>
    </footer>
  );
}
