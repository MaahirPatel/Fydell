"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type {
  Attempt,
  HiringDecision,
  Recommendation,
  ReviewerState,
} from "@/lib/store/types";

const recommendations: Recommendation[] = [
  "Strong interview",
  "Borderline",
  "Do not advance",
];

const decisions: HiringDecision[] = [
  "Advance to interview",
  "Hold",
  "Do not advance",
];

function Expandable({
  id,
  title,
  children,
  defaultOpen = false,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="expand-card" id={id} open={defaultOpen}>
      <summary>{title}</summary>
      <div className="expand-body">{children}</div>
    </details>
  );
}

export function EvidenceReport({ attempt }: { attempt: Attempt }) {
  const report = attempt.report;
  const initialReview = useMemo<ReviewerState | null>(() => {
    if (!report) return null;
    return (
      attempt.review ?? {
        summary: report.summary,
        recommendation: report.recommendation,
        confidence: report.confidence,
        concern: report.concern,
        worthInterviewing: report.worthInterviewing,
        supportingEvidence: report.supportingEvidence,
        changedAfterInfo: report.changedAfterInfo,
        uncertainty: report.uncertainty,
        wouldChangeMind: report.wouldChangeMind,
        notes: "",
        approved: false,
      }
    );
  }, [attempt.review, report]);

  const [review, setReview] = useState<ReviewerState | null>(initialReview);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [decision, setDecision] = useState<HiringDecision | null>(
    attempt.decision ?? null,
  );
  const [decisionNote, setDecisionNote] = useState(attempt.decisionNote ?? "");

  if (!report || !review) {
    return (
      <main className="page page-narrow">
        <div className="notice">No report yet for this candidate.</div>
        <Link href="/platform/roles/solutions-engineer" className="button">
          Back to role
        </Link>
      </main>
    );
  }

  const isReject = review.recommendation === "Do not advance";
  const isStrong = review.recommendation === "Strong interview";

  async function saveReview(next: ReviewerState, approve = false) {
    setSaving(true);
    setMessage("");
    const payload = {
      ...next,
      approved: approve ? true : next.approved,
      approvedAt: approve ? new Date().toISOString() : next.approvedAt,
      approvedBy: approve ? "K. Patel" : next.approvedBy,
    };
    const response = await fetch(`/api/attempts/${attempt.id}/review`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!response.ok) {
      setMessage("Could not save review.");
      return;
    }
    const data = (await response.json()) as { attempt: Attempt };
    setReview(data.attempt.review ?? payload);
    setMessage(approve ? "Conclusions approved." : "Review saved.");
  }

  async function saveDecision(value: HiringDecision) {
    setSaving(true);
    setMessage("");
    const response = await fetch(`/api/attempts/${attempt.id}/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision: value, note: decisionNote }),
    });
    setSaving(false);
    if (!response.ok) {
      setMessage("Could not record decision.");
      return;
    }
    setDecision(value);
    setMessage(`Decision recorded: ${value}.`);
  }

  return (
    <main className="page page-narrow">
      <div className="breadcrumbs">
        <Link href="/platform">Overview</Link> /{" "}
        <Link href="/platform/roles/solutions-engineer">Solutions Engineer</Link>{" "}
        / {attempt.label}
      </div>

      <div className="notice demo-banner" role="status">
        <b>{attempt.seeded ? "Demo data." : "Live invite record."}</b>{" "}
        {attempt.seeded
          ? "Seeded evidence report — editable review still persists to the durable store."
          : "Generated from recorded candidate actions. Manual review required before treating as final."}
      </div>

      <section className="brief-head" id="brief">
        <div>
          <span className="eyebrow">60-second decision brief</span>
          <h1>{attempt.label}</h1>
          <p>
            Solutions Engineer · Status {attempt.status.replace(/_/g, " ")}
            {attempt.submittedAt
              ? ` · Submitted ${new Date(attempt.submittedAt).toLocaleString()}`
              : ""}
          </p>
        </div>
        <div className="recommendation-box">
          <small>Recommendation</small>
          <strong
            className={
              isReject ? "rec-reject" : isStrong ? undefined : "rec-hold"
            }
          >
            {review.recommendation}
          </strong>
          <span className="confidence">
            Evidence confidence · {review.confidence}
            {review.approved ? " · Approved" : " · Pending approval"}
          </span>
        </div>
      </section>

      <section className="summary-panel" style={{ marginBottom: 18 }}>
        <span className="eyebrow">What you need in 60 seconds</span>
        <p>{review.summary}</p>
        <p className="brief-concern">
          <b>Unresolved:</b> {review.concern}
        </p>
      </section>

      <div className="expand-stack">
        <Expandable id="q-interview" title="Should we interview?" defaultOpen>
          <p>{review.worthInterviewing}</p>
        </Expandable>
        <Expandable id="q-evidence" title="What supporting evidence exists?">
          <p>{review.supportingEvidence}</p>
          <div className="signal-list" style={{ marginTop: 12, border: 0 }}>
            {report.evidence.map((item) => (
              <article className="signal-row" key={item.id}>
                <span className="signal-index">{item.confidence[0]}</span>
                <div>
                  <h3>
                    {item.dimension}
                    <span>{item.level}</span>
                  </h3>
                  <p>{item.claim}</p>
                  <small className="muted">{item.source}</small>
                </div>
                <a className="evidence-link" href={`#evidence-${item.id}`}>
                  Open ↓
                </a>
              </article>
            ))}
          </div>
        </Expandable>
        <Expandable
          id="q-changed"
          title="What changed after new information?"
        >
          <p>{review.changedAfterInfo}</p>
        </Expandable>
        <Expandable id="q-uncertainty" title="What remains uncertain?">
          <p>{review.uncertainty}</p>
        </Expandable>
        <Expandable id="q-questions" title="What should the interview ask?">
          {report.interviewQuestions.length === 0 ? (
            <p>No interview questions — recommendation is not to advance.</p>
          ) : (
            <div className="question-list" style={{ padding: 0 }}>
              {report.interviewQuestions.map((item, index) => (
                <div className="question" key={item.question}>
                  <p>
                    <b>0{index + 1} —</b> “{item.question}”
                  </p>
                  <small>{item.reason}</small>
                  <small style={{ marginTop: 6 }}>
                    Strong answer: {item.strongAnswer}
                  </small>
                </div>
              ))}
            </div>
          )}
        </Expandable>
        <Expandable
          id="q-change-mind"
          title="What would change the recommendation?"
        >
          <p>{review.wouldChangeMind}</p>
        </Expandable>
      </div>

      <section className="panel" style={{ marginTop: 18 }} id="review">
        <div className="panel-head">
          <h2>Human review</h2>
          <span className="muted">
            {review.approved ? "Approved" : "Edit before final"}
          </span>
        </div>
        <div className="side-panel-body review-form">
          <p className="muted" style={{ marginTop: 0 }}>
            Approve or edit conclusions before the recommendation is treated as
            final. No automatic hiring decision.
          </p>
          <label>
            60-second summary
            <textarea
              value={review.summary}
              onChange={(event) =>
                setReview({ ...review, summary: event.target.value })
              }
            />
          </label>
          <div className="field-grid">
            <label>
              Recommendation
              <select
                value={review.recommendation}
                onChange={(event) =>
                  setReview({
                    ...review,
                    recommendation: event.target.value as Recommendation,
                    approved: false,
                  })
                }
              >
                {recommendations.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Confidence
              <select
                value={review.confidence}
                onChange={(event) =>
                  setReview({
                    ...review,
                    confidence: event.target.value as ReviewerState["confidence"],
                    approved: false,
                  })
                }
              >
                {(["High", "Medium", "Low"] as const).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {(
            [
              ["worthInterviewing", "Should we interview?"],
              ["supportingEvidence", "Supporting evidence"],
              ["changedAfterInfo", "What changed after new information?"],
              ["uncertainty", "Uncertainty"],
              ["wouldChangeMind", "What would change the recommendation?"],
              ["concern", "Unresolved concern"],
              ["notes", "Reviewer notes"],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              {label}
              <textarea
                value={review[key]}
                onChange={(event) =>
                  setReview({
                    ...review,
                    [key]: event.target.value,
                    approved: key === "notes" ? review.approved : false,
                  })
                }
              />
            </label>
          ))}
          <div className="hero-actions">
            <button
              className="button secondary"
              type="button"
              disabled={saving}
              onClick={() => saveReview({ ...review, approved: false })}
            >
              Save edits
            </button>
            <button
              className="button"
              type="button"
              disabled={saving}
              onClick={() => saveReview(review, true)}
            >
              Approve conclusions
            </button>
          </div>
          {message ? <p className="status">{message}</p> : null}
        </div>
      </section>

      <section id="evidence" style={{ marginTop: 32 }}>
        <div className="page-head" style={{ marginBottom: 16 }}>
          <div>
            <span className="eyebrow">Evidence detail</span>
            <h1 style={{ fontSize: 22, marginTop: 8 }}>Claims you can audit</h1>
            <p>
              Generated from{" "}
              {report.generatedFrom === "attempt_events"
                ? "recorded candidate actions"
                : "seeded demo records"}
              . Uncertainty stays visible.
            </p>
          </div>
        </div>
        {report.evidence.map((item) => (
          <article
            className="evidence-card"
            id={`evidence-${item.id}`}
            key={item.id}
          >
            <div className="evidence-top">
              <div>
                <h3>
                  {item.dimension} · {item.level}
                </h3>
                <p>{item.claim}</p>
              </div>
              <span
                className={
                  item.confidence === "High"
                    ? "status"
                    : item.confidence === "Medium"
                      ? "status amber"
                      : "status neutral"
                }
              >
                {item.confidence} confidence
              </span>
            </div>
            <div className="claim-flow">
              <div className="claim-box">
                <small>Candidate&apos;s original work</small>
                <blockquote>“{item.excerpt}”</blockquote>
              </div>
              <div className="flow-arrow">→</div>
              <div className="claim-box">
                <small>Interpretation</small>
                <blockquote>{item.interpretation}</blockquote>
              </div>
            </div>
            {item.changedAfterInfo ? (
              <div className="claim-box" style={{ marginTop: 12 }}>
                <small>After new information</small>
                <blockquote>{item.changedAfterInfo}</blockquote>
              </div>
            ) : null}
            {item.counter ? (
              <div className="claim-box" style={{ marginTop: 12 }}>
                <small>Counterevidence / limit</small>
                <blockquote>{item.counter}</blockquote>
              </div>
            ) : null}
            <div className="evidence-meta">
              <span>{item.source}</span>
              <span>Captured at {item.timestamp}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="panel" id="timeline" style={{ marginTop: 32 }}>
        <div className="panel-head">
          <h2>Work timeline</h2>
          <span className="muted">Recorded events</span>
        </div>
        <div className="timeline">
          {report.timeline.map((row) => (
            <div className="timeline-row" key={`${row.time}-${row.title}`}>
              <time>{row.time}</time>
              <span className="timeline-dot" />
              <div>
                <b>{row.title}</b>
                <p>{row.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel" style={{ marginTop: 18 }} id="decision">
        <div className="panel-head">
          <h2>Record interview decision</h2>
          <span className="muted">
            {decision ? "Recorded" : "After human review"}
          </span>
        </div>
        <div className="side-panel-body">
          <p>
            Close the loop after your team decides. This writes a durable
            status on the attempt record.
          </p>
          <label>
            Decision note
            <textarea
              value={decisionNote}
              onChange={(event) => setDecisionNote(event.target.value)}
              placeholder="What changed your view?"
            />
          </label>
          {decision ? (
            <div>
              <p>
                <span className="status">{decision} recorded</span>
              </p>
              <button
                className="button secondary small"
                type="button"
                onClick={() => setDecision(null)}
              >
                Change decision
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {decisions.map((value, index) => (
                <button
                  className={`button ${index === 0 ? "" : "secondary"} small`}
                  key={value}
                  type="button"
                  disabled={saving}
                  onClick={() => saveDecision(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {attempt.id === "candidate-1" ? (
        <p style={{ marginTop: 18 }}>
          <Link href="/receipt/candidate-1" className="evidence-link">
            Open work receipt →
          </Link>
        </p>
      ) : null}
    </main>
  );
}
