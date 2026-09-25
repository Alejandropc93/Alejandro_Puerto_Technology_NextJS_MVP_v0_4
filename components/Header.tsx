"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { site } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="siteHeader">
      <div className="container headerInner">
        <Logo />
        <nav className="desktopNav" aria-label="Navegación principal">
          {site.nav.map(([label, href]) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return <Link className={active ? "navActive" : ""} key={href} href={href}>{label}</Link>;
          })}
        </nav>
        <Link className="button buttonDark headerCta" href="/contacto">Hablemos <span>→</span></Link>
        <button
          type="button"
          className="mobileMenuButton"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div id="mobile-navigation" className={`mobileMenu ${open ? "open" : ""}`}>
        <nav className="container mobileNav" aria-label="Navegación móvil">
          {site.nav.map(([label, href]) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return <Link className={active ? "navActive" : ""} key={href} href={href}>{label}<span>→</span></Link>;
          })}
          <Link className="button buttonPrimary mobileContact" href="/contacto">Cuéntame tu proyecto <span>→</span></Link>
        </nav>
      </div>
    </header>
  );
}
