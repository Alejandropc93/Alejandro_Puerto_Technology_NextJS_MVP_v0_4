import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footerGrid">
        <div>
          <Logo />
          <p className="footerCopy">Tecnología con claridad, confianza y ejecución.</p>
        </div>
        <div>
          <strong>Explora</strong>
          <Link href="/servicios">Servicios</Link>
          <Link href="/emprendedores">Emprendedores</Link>
          <Link href="/tools">Tools / Lab</Link>
        </div>
        <div>
          <strong>Conecta</strong>
          <Link href="/formacion">Formación</Link>
          <Link href="/sobre-mi">Sobre mí</Link>
          <Link href="/contacto">Contacto</Link>
        </div>
      </div>
      <div className="container footerBottom">
        <span>© 2026 Alejandro Puerto Technology</span>
        <span>MVP v0.2 · Preparado para Vercel</span>
      </div>
    </footer>
  );
}
