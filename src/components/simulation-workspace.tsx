"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Brand } from "@/components/brand";

const storageKey = "fydell-se-workspace-v1";

type StageId = "discovery" | "requirements" | "recommendation" | "handoff";

const stages: { id: StageId; label: string }[] = [
  { id: "discovery", label: "Discovery" },
  { id: "requirements", label: "Requirements" },
  { id: "recommendation", label: "Recommendation" },
  { id: "handoff", label: "Customer handoff" },
];

const initialPlan = `## Rollout

- Launch all 1,200 seats in a single production cutover at week six.
- The authentication security review can run in parallel with production access.
- Phase one can support early users while remaining business units prepare.
- Adoption risk should remain low because the sponsor reports strong weekly usage.
`;

const revisedHint = `## Rollout

- Weeks 1–6 · sandbox tenant only, while the six-week security review completes.
- Week 7 · controlled 200-user cohort in production, after review sign-off.
- Then expand by business unit after the first support review.
- Cohort size stays provisional until weekly active-user data is verified.
`;

type Persisted = {
  stage: StageId;
  plan: string;
  notes: string;
  versions: { at: string; body: string }[];
  constraintSeen: boolean;
  defense: string[];
  submitted: boolean;
};

const defaultState: Persisted = {
  stage: "discovery",
  plan: initialPlan,
  notes: "",
  versions: [{ at: "Start", body: initialPlan }],
  constraintSeen: false,
  defense: ["", "", ""],
  submitted: false,
};

const defenseQuestions = [
  "Your adoption assumption comes from the sponsor. How would you test it before sizing the first production cohort?",
  "Which fact in this brief would most likely change your recommendation again?",
  "What did you preserve after the security constraint, and what moved?",
];

export function SimulationWorkspace() {
  const [state, setState] = useState<Persisted>(defaultState);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"tasks" | "work" | "notes">(
    "work",
  );
  const [activeFile, setActiveFile] = useState<
    "brief" | "thread" | "plan" | "assumptions"
  >("brief");

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) setState({ ...defaultState, ...JSON.parse(raw) });
      } catch {
        /* ignore corrupt demo state */
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const id = window.setTimeout(() => {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
      setSaved(true);
    }, 280);
    return () => window.clearTimeout(id);
  }, [state, hydrated]);

  const stageIndex = stages.findIndex((stage) => stage.id === state.stage);

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

  function update(partial: Partial<Persisted>) {
    setSaved(false);
    setState((prev) => ({ ...prev, ...partial }));
  }

  function savePlanVersion(body: string) {
    const stamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    update({
      plan: body,
      versions: [...state.versions, { at: stamp, body }],
    });
  }

  function deliverConstraint() {
    update({ constraintSeen: true, stage: "recommendation" });
    setActiveFile("thread");
  }

  function applySandboxRevision() {
    savePlanVersion(revisedHint);
    setActiveFile("plan");
  }

  if (state.submitted) {
    return (
      <main className="candidate-shell">
        <header className="candidate-top">
          <Brand />
          <span>Demo data · Simulation submitted</span>
        </header>
        <div className="candidate-content" style={{ maxWidth: 720 }}>
          <span className="eyebrow">Submission received</span>
          <h1 style={{ fontSize: 36, letterSpacing: "-0.04em" }}>
            Your Acme recommendation is in the employer shortlist path.
          </h1>
          <p className="lead">
            In this demo, open the seeded Candidate 1 evidence report to see how
            Fydell turns work like this into a 60-second decision brief.
          </p>
          <div className="hero-actions">
            <Link
              className="button"
              href="/platform/roles/solutions-engineer/candidates/candidate-1"
            >
              Open sample evidence report →
            </Link>
            <button
              className="button secondary"
              type="button"
              onClick={() => update({ submitted: false })}
            >
              Return to workspace
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="workspace-page">
      <header className="workspace-top">
        <Brand inverse />
        <span className="workspace-title">Acme 1,200-seat rollout · Demo data</span>
        <span className="autosave">
          {saved ? "Saved on this device" : "Saving…"}
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
              onClick={() => update({ stage: stage.id })}
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
              onClick={deliverConstraint}
              type="button"
            >
              Deliver security constraint
            </button>
          ) : (
            <p className="constraint-flag">Constraint delivered · 16:08</p>
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
                : "Draft an initial rollout plan. A consequential constraint may arrive—deliver it when you are ready.")}
            {state.stage === "handoff" &&
              "Answer the defense questions from your own plan. Then submit to see the employer evidence path."}
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
                  onClick={applySandboxRevision}
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
                    value={state.defense[index]}
                    onChange={(event) => {
                      const defense = [...state.defense];
                      defense[index] = event.target.value;
                      update({ defense });
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
                  setState((prev) => ({ ...prev, plan: event.target.value }));
                }}
                onBlur={() => savePlanVersion(state.plan)}
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
              onClick={() => update({ submitted: true })}
            >
              Submit → view sample report
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
