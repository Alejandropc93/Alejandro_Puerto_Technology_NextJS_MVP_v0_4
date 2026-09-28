import Link from "next/link";

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Alejandro Puerto Technology - Inicio">
      <span className="logoMark">AP</span>
      <span className="logoText">
        <strong>Alejandro Puerto</strong>
        <small>Technology</small>
      </span>
    </Link>
  );
}
