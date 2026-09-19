import Link from "next/link";
import { notFound } from "next/navigation";
import { OutcomeControl } from "@/components/outcome-control";
import {
  evidenceFor,
  getCandidate,
  interviewsFor,
  role,
  timelineCandidate1,
} from "@/lib/demo-data";

export function generateStaticParams() {
  return role.candidates
    .filter((candidate) => candidate.recommendation)
    .map((candidate) => ({ candidateId: candidate.id }));
}

export default async function CandidateBrief({
  params,
}: {
  params: Promise<{ candidateId: string }>;
}) {
  const { candidateId } = await params;
  const candidate = getCandidate(candidateId);
  if (!candidate?.recommendation) notFound();

  const evidence = evidenceFor(candidate);
  const interviews = interviewsFor(candidate);
  const isStrong = candidate.recommendation === "Strong interview";
  const isReject = candidate.recommendation === "Do not advance";

  return (
    <main className="page page-narrow">
      <div className="breadcrumbs">
        <Link href="/platform">Overview</Link> /{" "}
        <Link href="/platform/roles/solutions-engineer">{role.title}</Link> /{" "}
        {candidate.label}
      </div>

      <div className="notice demo-banner" role="status">
        <b>Demo data.</b> Anonymized evidence report for the Acme rollout
        simulation.
      </div>

      <section className="brief-head">
        <div>
          <span className="eyebrow">Candidate decision brief</span>
          <h1>{candidate.label}</h1>
          <p>
            {role.title} · Completed {candidate.completedAt?.toLowerCase()} ·{" "}
            {candidate.duration}
          </p>
        </div>
        <div className="recommendation-box">
          <small>Recommendation</small>
          <strong
            className={
              isReject ? "rec-reject" : isStrong ? undefined : "rec-hold"
            }
          >
            {candidate.recommendation}
          </strong>
          <span className="confidence">
            Evidence confidence · {candidate.confidence}
          </span>
        </div>
      </section>

      <nav className="tabs" aria-label="Candidate report">
        <a href="#brief" className="active">
          Decision brief
        </a>
        <a href="#evidence">Evidence</a>
        {isStrong ? <a href="#timeline">Timeline</a> : null}
        {interviews.length > 0 ? <a href="#interview">Interview</a> : null}
        {isStrong ? (
          <Link href="/receipt/candidate-1">Work receipt</Link>
        ) : null}
      </nav>

      <div className="brief-grid" id="brief">
        <div>
          <section className="summary-panel">
            <span className="eyebrow">60-second summary</span>
            <p>{candidate.summary}</p>
          </section>
          <section className="signal-list">
            <div className="panel-head">
              <h2>Top signals</h2>
              <span className="muted">Evidence-backed</span>
            </div>
            {evidence.map((item, index) => (
              <article className="signal-row" key={item.id}>
                <span className="signal-index">0{index + 1}</span>
                <div>
                  <h3>
                    {item.dimension}
                    <span>{item.level}</span>
                  </h3>
                  <p>{item.claim}</p>
                </div>
                <a className="evidence-link" href={`#${item.id}`}>
                  View evidence ↓
                </a>
              </article>
            ))}
          </section>
        </div>
        <aside className="side-stack">
          {candidate.concern ? (
            <section className="panel">
              <div className="panel-head">
                <h2>{isReject ? "Primary gap" : "Unresolved"}</h2>
                <span className="status amber">Probe</span>
              </div>
              <div className="side-panel-body">
                <p>
                  <b>{candidate.concern}</b>
                </p>
                <p>
                  Carry this into the interview or use it to decline with a
                  clear evidence trail.
                </p>
              </div>
            </section>
          ) : null}
          <section className="panel">
            <div className="panel-head">
              <h2>Completion</h2>
            </div>
            <div className="side-panel-body">
              <p>
                <b>{candidate.duration} on the Acme simulation</b>
              </p>
              <p>
                Stages covered discovery, requirements, recommendation, and
                customer handoff. Constraint event delivered mid-session.
              </p>
            </div>
          </section>
          <section className="panel">
            <div className="panel-head">
              <h2>Record outcome</h2>
            </div>
            <div className="side-panel-body">
              <p>Close the learning loop after your team makes a decision.</p>
              <OutcomeControl />
            </div>
          </section>
        </aside>
      </div>

      {interviews.length > 0 ? (
        <section className="panel" style={{ marginTop: 18 }} id="interview">
          <div className="panel-head">
            <h2>Interview follow-ups</h2>
            <span className="muted">From this candidate’s work</span>
          </div>
          <div className="question-list">
            {interviews.map((item, index) => (
              <div className="question" key={item.question}>
                <p>
                  <b>0{index + 1} —</b> “{item.question}”
                </p>
                <small>
                  {item.reason}{" "}
                  <a className="evidence-link" href={`#${item.evidenceId}`}>
                    View source evidence
                  </a>
                </small>
                <small style={{ marginTop: 6 }}>
                  Strong answer: {item.strongAnswer}
                </small>
                <small style={{ marginTop: 4 }}>
                  Still unresolved: {item.unresolved}
                </small>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section id="evidence" style={{ scrollMarginTop: 80, marginTop: 32 }}>
        <div className="page-head" style={{ marginBottom: 16 }}>
          <div>
            <span className="eyebrow">Evidence detail</span>
            <h1 style={{ fontSize: 22, marginTop: 8 }}>Claims you can audit</h1>
            <p>
              Claim → original work → interpretation. Uncertainty stays visible.
            </p>
          </div>
        </div>
        {evidence.map((item) => (
          <article className="evidence-card" id={item.id} key={item.id}>
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

      {isStrong ? (
        <section
          className="panel"
          id="timeline"
          style={{ scrollMarginTop: 80, marginTop: 32 }}
        >
          <div className="panel-head">
            <h2>Work timeline</h2>
            <span className="muted">Auditable session events</span>
          </div>
          <div className="timeline">
            {timelineCandidate1.map(([time, title, detail]) => (
              <div className="timeline-row" key={time}>
                <time>{time}</time>
                <span className="timeline-dot" />
                <div>
                  <b>{title}</b>
                  <p>{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="panel" style={{ marginTop: 18 }}>
        <div className="panel-head">
          <h2>Start a pilot with your own candidates</h2>
        </div>
        <div className="side-panel-body" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <p style={{ margin: 0, flex: 1 }}>
            Same evidence shape. Your role. Contact{" "}
            <a className="evidence-link" href="mailto:pilots@fydell.com">
              pilots@fydell.com
            </a>
            .
          </p>
          <Link href="/pilot" className="button">
            View pilot offer
          </Link>
          <Link
            href="/platform/roles/solutions-engineer#comparison"
            className="button secondary"
          >
            Back to comparison
          </Link>
        </div>
      </section>
    </main>
  );
}
