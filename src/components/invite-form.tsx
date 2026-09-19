"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Attempt } from "@/lib/store/types";

export function InviteForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<Attempt | null>(null);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, label }),
    });
    setBusy(false);
    if (!response.ok) {
      setError("Could not create invite.");
      return;
    }
    const data = (await response.json()) as { attempt: Attempt };
    setCreated(data.attempt);
    setEmail("");
    setLabel("");
    router.refresh();
  }

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Invite a candidate</h2>
        <span className="muted">Creates a durable record</span>
      </div>
      <form className="side-panel-body invite-form" onSubmit={onSubmit}>
        <p className="muted" style={{ marginTop: 0 }}>
          Creates a private candidate link for the Solutions Engineer Acme
          simulation. No email is sent automatically — copy the link.
        </p>
        <label>
          Candidate label
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Invite 1"
          />
        </label>
        <label>
          Email (optional note)
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="candidate@company.com"
          />
        </label>
        <button className="button" type="submit" disabled={busy}>
          {busy ? "Creating…" : "Create invite + private link"}
        </button>
        {error ? <p className="status amber">{error}</p> : null}
        {created ? (
          <div className="invite-result">
            <p>
              <b>{created.label}</b> invited · status {created.status}
            </p>
            <code className="invite-link">
              {origin}/c/{created.token}
            </code>
            <div className="hero-actions">
              <a className="button small" href={`/c/${created.token}`}>
                Open candidate link
              </a>
              <button
                className="button secondary small"
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `${origin}/c/${created.token}`,
                  );
                }}
              >
                Copy link
              </button>
            </div>
          </div>
        ) : null}
      </form>
    </section>
  );
}
