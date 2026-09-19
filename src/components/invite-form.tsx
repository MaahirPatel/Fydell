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
  const [copied, setCopied] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setCopied(false);
    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, label }),
      });
      if (!response.ok) {
        setError("Could not create invite. Try again.");
        return;
      }
      const data = (await response.json()) as { attempt: Attempt };
      setCreated(data.attempt);
      setEmail("");
      setLabel("");
      router.refresh();
    } catch {
      setError("Network error creating invite. Check your connection and retry.");
    } finally {
      setBusy(false);
    }
  }

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  async function copyLink() {
    if (!created) return;
    const value = `${origin}/c/${created.token}`;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setError("Clipboard blocked — select the link and copy manually.");
    }
  }

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
            disabled={busy}
          />
        </label>
        <label>
          Email (optional note)
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="candidate@company.com"
            disabled={busy}
          />
        </label>
        <button className="button" type="submit" disabled={busy}>
          {busy ? "Creating…" : "Create invite + private link"}
        </button>
        {error ? (
          <p className="status amber" role="alert">
            {error}
          </p>
        ) : null}
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
                onClick={copyLink}
              >
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </div>
        ) : null}
      </form>
    </section>
  );
}
