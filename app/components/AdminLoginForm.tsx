"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: form.get("password") }),
    });

    if (!response.ok) {
      setSending(false);
      setError("Contraseña incorrecta o panel no configurado.");
      return;
    }

    router.push("/admin/leads");
    router.refresh();
  }

  return (
    <form className="adminLoginForm" onSubmit={submit}>
      <label>Contraseña<input name="password" type="password" required autoComplete="current-password" /></label>
      <button className="button buttonPrimary" disabled={sending}>{sending ? "Entrando..." : "Acceder"}</button>
      {error ? <p className="formMessage error">{error}</p> : null}
    </form>
  );
}
