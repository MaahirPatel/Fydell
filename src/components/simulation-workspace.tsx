"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import type { Attempt, StageId, WorkspaceState } from "@/lib/store/types";

const stages: { id: StageId; label: string }[] = [
  { id: "discovery", label: "Discovery" },
  { id: "requirements", label: "Requirements" },
  { id: "recommendation", label: "Recommendation" },
  { id: "handoff", label: "Customer handoff" },
];

const revisedHint = `## Rollout

- Weeks 1–6 · sandbox tenant only, while the six-week security review completes.
- Week 7 · controlled 200-user cohort in production, after review sign-off.
- Then expand by business unit after the first support review.
- Cohort size stays provisional until weekly active-user data is verified.
`;

const defenseQuestions = [
  "Your adoption assumption comes from the sponsor. How would you test it before sizing the first production cohort?",
  "Which fact in this brief would most likely change your recommendation again?",
  "What did you preserve after the security constraint, and what moved?",
];

const emptyWorkspace: WorkspaceState = {
  stage: "discovery",
  plan: `## Rollout

- Launch all 1,200 seats in a single production cutover at week six.
- The authentication security review can run in parallel with production access.
- Phase one can support early users while remaining business units prepare.
- Adoption risk should remain low because the sponsor reports strong weekly usage.
`,
  notes: "",
  versions: [],
  constraintSeen: false,
  defense: ["", "", ""],
  updatedAt: new Date().toISOString(),
};

emptyWorkspace.versions = [{ at: "Start", body: emptyWorkspace.plan }];

export function SimulationWorkspace({
  token,
  initialAttempt,
}: {
  token: string;
  initialAttempt: Attempt;
}) {
  const [attempt, setAttempt] = useState(initialAttempt);
  const [state, setState] = useState<WorkspaceState>(
    initialAttempt.workspace ?? emptyWorkspace,
  );
  const [saved, setSaved] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"tasks" | "work" | "notes">(
    "work",
  );
  const [activeFile, setActiveFile] = useState<
    "brief" | "thread" | "plan" | "assumptions"
  >("brief");
  const pendingEvent = useRef<{ type: string; detail: string } | null>(null);
  const skipNextSave = useRef(true);

  useEffect(() => {
    if (
      attempt.status === "submitted" ||
      attempt.status === "in_review" ||
      attempt.status === "report_ready" ||
      attempt.status === "decision_recorded"
    ) {
      return;
    }
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    const id = window.setTimeout(async () => {
      const event = pendingEvent.current;
      pendingEvent.current = null;
      const response = await fetch(`/api/attempts/by-token/${token}/workspace`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace: state, event }),
      });
      if (response.ok) {
        const data = (await response.json()) as { attempt: Attempt };
        setAttempt(data.attempt);
        setSaved(true);
      }
    }, 400);
    return () => window.clearTimeout(id);
  }, [state, token, attempt.status]);

  const stageIndex = stages.findIndex((stage) => stage.id === state.stage);
  const submitted =
    attempt.status === "submitted" ||
    attempt.status === "in_review" ||
    attempt.status === "report_ready" ||
    attempt.status === "decision_recorded";

  const fileBody = useMemo(() => {
    if (activeFile === "brief") {
      return `Engagement brief — Acme

Recommend an implementation path for Acme, a 1,200-seat customer with a six-week launch target, SSO requirements, and a small platform team.

Confirmed goals
- SAML SSO on day one
- Board expects launch inside six weeks
- Platform team is small; prefer staged enablement

Open questions
- Is “strong weekly usage” verified telemetry or sponsor estimate?
- Can production data be connected before security sign-off?`;
    }
    if (activeFile === "thread") {
      return `Acme thread

14:02 · Platform manager, Acme
SAML SSO has to be there on day one, and the board expects launch inside six weeks.

14:18 · VP Operations, Acme
Usage is strong — most of the 1,200 seats are active weekly.

${
  state.constraintSeen
    ? `16:08 · Security lead, Acme
The authentication security review takes six weeks on its own. Production access cannot be granted before it closes.`
    : `14:40 · Security lead, Acme
Authentication review is on the calendar. Details to follow.`
}`;
    }
    if (activeFile === "assumptions") {
      return `assumptions.md

- weekly_active_users · sponsor estimate · unverified
- cohort_size · 200 · provisional
- identity_mapping · validate in sandbox · confirmed
- security_review_timing · ${
        state.constraintSeen
          ? "six weeks, sequential before production · confirmed"
          : "may overlap launch · unverified"
      }`;
    }
    return state.plan;
  }, [activeFile, state.constraintSeen, state.plan]);

  function update(
    partial: Partial<WorkspaceState>,
    event?: { type: string; detail: string },
  ) {
    setSaved(false);
    if (event) pendingEvent.current = event;
    setState((prev) => ({
      ...prev,
      ...partial,
      updatedAt: new Date().toISOString(),
    }));
  }

  function savePlanVersion(body: string, detail: string) {
    const stamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    update(
      {
        plan: body,
        versions: [...state.versions, { at: stamp, body }],
      },
      { type: "plan_revised", detail },
    );
  }

  async function submit() {
    setSubmitting(true);
    await fetch(`/api/attempts/by-token/${token}/workspace`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspace: state }),
    });
    const response = await fetch(`/api/attempts/by-token/${token}/submit`, {
      method: "POST",
    });
    setSubmitting(false);
    if (response.ok) {
      const data = (await response.json()) as { attempt: Attempt };
      setAttempt(data.attempt);
    }
  }

  if (submitted) {
    return (
      <main className="candidate-shell">
        <header className="candidate-top">
          <Brand />
          <span>Submitted · Durable record updated</span>
        </header>
        <div className="candidate-content" style={{ maxWidth: 720 }}>
          <span className="eyebrow">Submission received</span>
          <h1 style={{ fontSize: 36, letterSpacing: "-0.04em" }}>
            Your work is on the employer shortlist as {attempt.label}.
          </h1>
          <p className="lead">
            Status is now <b>{attempt.status.replace(/_/g, " ")}</b>. A draft
            evidence report was generated from recorded actions for human
            review.
          </p>
          <div className="hero-actions">
            <Link
              className="button"
              href={`/platform/roles/solutions-engineer/candidates/${attempt.id}`}
            >
              Open employer evidence report →
            </Link>
            <Link
              className="button secondary"
              href="/platform/roles/solutions-engineer"
            >
              Back to role pipeline
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="workspace-page">
      <header className="workspace-top">
        <Brand inverse />
        <span className="workspace-title">
          {attempt.label} · Acme rollout · Durable session
        </span>
        <span className="autosave">
          {saved ? "Saved to server" : "Saving…"}
        </span>
        <span className="timer">Demo session</span>
      </header>
      <div className="workspace-body">
        <aside
          className={`work-rail ${mobilePanel === "tasks" ? "mobile-show" : ""}`}
        >
          <h2>Stages</h2>
          {stages.map((stage, index) => (
            <button
              className={`task-item ${state.stage === stage.id ? "active" : ""}`}
              key={stage.id}
              onClick={() =>
                update(
                  { stage: stage.id },
                  {
                    type: "stage_changed",
                    detail: `Moved to ${stage.label}.`,
                  },
                )
              }
              type="button"
            >
              <span className="task-num">{index + 1}</span>
              <span>{stage.label}</span>
            </button>
          ))}
          <div className="artifact-list">
            <h2>Files</h2>
            {(
              [
                ["brief", "engagement_brief.md"],
                ["thread", "acme_thread.md"],
                ["assumptions", "assumptions.md"],
                ["plan", "rollout_plan.md"],
              ] as const
            ).map(([id, name]) => (
              <button
                className={`artifact ${activeFile === id ? "active-file" : ""}`}
                key={id}
                onClick={() => {
                  setActiveFile(id);
                  setMobilePanel("work");
                }}
                type="button"
              >
                <span>◇</span> {name}
              </button>
            ))}
          </div>
          {!state.constraintSeen ? (
            <button
              className="button small"
              style={{ width: "100%", marginTop: 16 }}
              onClick={() => {
                update(
                  { constraintSeen: true, stage: "recommendation" },
                  {
                    type: "constraint_delivered",
                    detail:
                      "Security review blocks production access for six weeks.",
                  },
                );
                setActiveFile("thread");
              }}
              type="button"
            >
              Deliver security constraint
            </button>
          ) : (
            <p className="constraint-flag">Constraint delivered · recorded</p>
          )}
        </aside>

        <section
          className={`work-center ${mobilePanel === "work" ? "mobile-show" : ""}`}
        >
          <span className="eyebrow">
            Stage {stageIndex + 1} of {stages.length} ·{" "}
            {stages[stageIndex]?.label}
          </span>
          <h1>
            {state.stage === "discovery" && "Understand Acme’s ask"}
            {state.stage === "requirements" && "Separate facts from estimates"}
            {state.stage === "recommendation" && "Sequence the rollout"}
            {state.stage === "handoff" && "Defend the recommendation"}
          </h1>
          <p>
            {state.stage === "discovery" &&
              "Read the engagement brief and Acme thread. Note what is confirmed versus sponsor narrative."}
            {state.stage === "requirements" &&
              "Capture requirements with source and confidence. Mark weekly active users unverified if you only have the sponsor claim."}
            {state.stage === "recommendation" &&
              (state.constraintSeen
                ? "Security blocked production access for six weeks. Revise rollout_plan.md so the sequencing respects that constraint."
                : "Draft an initial rollout plan. Deliver the security constraint when ready.")}
            {state.stage === "handoff" &&
              "Answer the defense questions from your own plan, then submit for employer review."}
          </p>

          {state.constraintSeen && state.stage === "recommendation" ? (
            <div className="scenario-callout">
              <b>Incoming constraint · Security lead, Acme:</b> The authentication
              security review takes six weeks on its own. Production access cannot
              be granted before it closes.
              <div style={{ marginTop: 10 }}>
                <button
                  className="button small"
                  type="button"
                  onClick={() =>
                    savePlanVersion(
                      revisedHint,
                      "Applied sandbox-first revision after constraint.",
                    )
                  }
                >
                  Apply sandbox-first revision to plan
                </button>
              </div>
            </div>
          ) : null}

          {state.stage === "handoff" ? (
            <div className="defense-list">
              {defenseQuestions.map((question, index) => (
                <label className="defense-item" key={question}>
                  <span>
                    Q{index + 1}. {question}
                  </span>
                  <textarea
                    value={state.defense[index] ?? ""}
                    onChange={(event) => {
                      const defense = [...state.defense];
                      defense[index] = event.target.value;
                      update({ defense });
                    }}
                    onBlur={() => {
                      if (state.defense[index]?.trim()) {
                        pendingEvent.current = {
                          type: "defense_answered",
                          detail: `Answered defense question ${index + 1}.`,
                        };
                        setState((prev) => ({ ...prev }));
                      }
                    }}
                    placeholder="Answer from your artifacts…"
                  />
                </label>
              ))}
            </div>
          ) : activeFile === "plan" ? (
            <div className="artifact-panel editable-panel">
              <header>
                <b>rollout_plan.md</b>
                <span className="muted">
                  Editable · {state.versions.length} version
                  {state.versions.length === 1 ? "" : "s"}
                </span>
              </header>
              <textarea
                aria-label="Rollout plan"
                className="plan-editor"
                value={state.plan}
                onChange={(event) => {
                  setSaved(false);
                  setState((prev) => ({
                    ...prev,
                    plan: event.target.value,
                    updatedAt: new Date().toISOString(),
                  }));
                }}
                onBlur={() =>
                  savePlanVersion(state.plan, "Saved rollout plan revision.")
                }
              />
            </div>
          ) : (
            <div className="artifact-panel">
              <header>
                <b>
                  {activeFile === "brief"
                    ? "engagement_brief.md"
                    : activeFile === "thread"
                      ? "acme_thread.md"
                      : "assumptions.md"}
                </b>
                <span className="muted">Read-only artifact</span>
              </header>
              <pre>{fileBody}</pre>
            </div>
          )}

          {state.versions.length > 1 ? (
            <div className="version-list">
              <h2>Version history</h2>
              {state.versions
                .slice()
                .reverse()
                .map((version, index) => (
                  <button
                    key={`${version.at}-${index}`}
                    className="version-row"
                    type="button"
                    onClick={() => {
                      update({ plan: version.body });
                      setActiveFile("plan");
                    }}
                  >
                    <b>Revision {state.versions.length - index}</b>
                    <span>{version.at}</span>
                  </button>
                ))}
            </div>
          ) : null}
        </section>

        <aside
          className={`work-notes ${mobilePanel === "notes" ? "mobile-show" : ""}`}
        >
          <header>
            Working notes <span>{saved ? "Saved" : "Saving"}</span>
          </header>
          <textarea
            aria-label="Working notes"
            onChange={(event) => update({ notes: event.target.value })}
            placeholder="Capture hypotheses, open questions, and what you would verify next…"
            value={state.notes}
          />
          <footer>
            <button
              className="button"
              type="button"
              disabled={submitting}
              onClick={submit}
            >
              {submitting ? "Submitting…" : "Submit for employer review →"}
            </button>
          </footer>
        </aside>
      </div>
      <nav className="mobile-work-nav" aria-label="Workspace panels">
        {(
          [
            ["tasks", "Stages"],
            ["work", "Current work"],
            ["notes", "Notes"],
          ] as const
        ).map(([panel, label]) => (
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
