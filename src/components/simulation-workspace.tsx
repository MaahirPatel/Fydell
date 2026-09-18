"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brand } from "@/components/brand";

const storageKey = "fydell-demo-candidate-notes";

export function SimulationWorkspace() {
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"tasks" | "work" | "notes">("work");

  useEffect(() => {
    const id = window.setTimeout(() => {
      setNotes(window.localStorage.getItem(storageKey) ?? "");
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      window.localStorage.setItem(storageKey, notes);
      setSaved(true);
    }, 250);
    return () => window.clearTimeout(id);
  }, [notes]);

  return (
    <main className="workspace-page">
      <header className="workspace-top">
        <Brand inverse />
        <span className="workspace-title">Production API incident</span>
        <span className="autosave">{saved ? "Saved on this device" : "Saving…"}</span>
        <span className="timer">Demo session</span>
      </header>
      <div className="workspace-body">
        <aside className={`work-rail ${mobilePanel === "tasks" ? "mobile-show" : ""}`}>
          <h2>Tasks</h2>
          {["Understand the incident", "Diagnose the failure", "Plan recovery", "Design prevention", "Executive update"].map((task, index) => (
            <div className={`task-item ${index === 1 ? "active" : ""}`} key={task}>
              <span className="task-num">{index + 1}</span><span>{task}</span>
            </div>
          ))}
          <div className="artifact-list">
            <h2>Artifacts</h2>
            <div className="artifact"><span>◇</span> incident-brief.md</div>
            <div className="artifact"><span>◇</span> api-traces.log</div>
            <div className="artifact"><span>◇</span> queue-metrics.csv</div>
            <div className="artifact"><span>◇</span> architecture.png</div>
          </div>
        </aside>
        <section className={`work-center ${mobilePanel === "work" ? "mobile-show" : ""}`}>
          <span className="eyebrow">Task 2 of 5 · Diagnose</span>
          <h1>Identify the failure mechanism</h1>
          <p>
            Review the API traces and queue metrics. State your leading
            hypothesis, the evidence that supports it, and one plausible
            alternative you ruled out.
          </p>
          <div className="scenario-callout">
            <b>New context from the incident lead:</b> Database latency remained
            below 22ms throughout the incident, but queue depth tripled after the
            first timeout alert.
          </div>
          <div className="artifact-panel">
            <header><b>api-traces.log</b><span className="muted">Read-only artifact</span></header>
            <pre>{`10:41:08  POST /exports   504  request=req_81a  duration=30.0s
10:41:09  queue.retry     job=exp_442    attempt=2
10:41:12  db.insert       export=exp_442 rows=1 latency=19ms
10:41:38  POST /exports   504  request=req_81a  duration=30.0s
10:41:39  queue.retry     job=exp_442    attempt=3
10:41:42  db.insert       export=exp_442 rows=1 latency=21ms`}</pre>
          </div>
        </section>
        <aside className={`work-notes ${mobilePanel === "notes" ? "mobile-show" : ""}`}>
          <header>Working notes <span>{saved ? "Saved" : "Saving"}</span></header>
          <textarea
            aria-label="Working notes"
            onChange={(event) => {
              setSaved(false);
              setNotes(event.target.value);
            }}
            placeholder="Capture your hypothesis, evidence, and open questions…"
            value={notes}
          />
          <footer>
            <Link className="button" href="/receipt/maya-chen">Finish demo · view sample receipt →</Link>
          </footer>
        </aside>
      </div>
      <nav className="mobile-work-nav" aria-label="Workspace panels">
        {([
          ["tasks", "Tasks"],
          ["work", "Current task"],
          ["notes", "Notes"],
        ] as const).map(([panel, label]) => (
          <button
            className={mobilePanel === panel ? "active" : ""}
            key={panel}
            onClick={() => setMobilePanel(panel)}
            type="button"
          >
            {label}
          </button>
        ))}
      </nav>
    </main>
  );
}
