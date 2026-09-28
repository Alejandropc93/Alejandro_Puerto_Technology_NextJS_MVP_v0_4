"use client";

import { useState } from "react";

const statuses = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;

export function LeadStatusSelect({ id, initialStatus }: { id: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);

  async function update(next: string) {
    setStatus(next);
    setSaving(true);
    const response = await fetch(`/api/admin/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!response.ok) setStatus(initialStatus);
    setSaving(false);
  }

  return (
    <select className="adminStatus" value={status} disabled={saving} onChange={(e) => update(e.target.value)}>
      {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
    </select>
  );
}
