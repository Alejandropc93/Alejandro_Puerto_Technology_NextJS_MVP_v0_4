import Link from "next/link";
import { Logo } from "./Logo";
import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="siteHeader">
      <div className="container headerInner">
        <Logo />
        <nav className="desktopNav" aria-label="Navegación principal">
          {site.nav.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <Link className="button buttonDark headerCta" href="/contacto">Contacto <span>→</span></Link>
      </div>
    </header>
  );
}
