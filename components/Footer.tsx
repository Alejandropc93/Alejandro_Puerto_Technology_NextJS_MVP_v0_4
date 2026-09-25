import Link from "next/link";
import { Logo } from "./Logo";

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
        </div>
        <div>
          <strong>APT Lab</strong>
          {tools.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </div>
        <div>
          <strong>Empezar</strong>
          <Link href="/tools">Explorar APT Lab</Link>
          <Link href="/contacto">Hablemos de tu proyecto</Link>
        </div>
      </div>
      <div className="container footerBottom">
        <span>© 2026 Alejandro Puerto Technology</span>
        <span>De la idea a la ejecución.</span>
      </div>
    </footer>
  );
}
