import Link from "next/link";
import { OutcomeControl } from "@/components/outcome-control";
import { evidence, interviewQuestions, timeline } from "@/lib/demo-data";

export default function CandidateBrief() {
  return (
    <main className="page page-narrow">
      <div className="breadcrumbs">
        <Link href="/platform">Overview</Link> / <Link href="/platform/roles/backend-engineer">Backend Software Engineer</Link> / Maya Chen
      </div>
      <section className="brief-head">
        <div>
          <span className="eyebrow">Candidate decision brief</span>
          <h1>Maya Chen</h1>
          <p>Backend Software Engineer · Completed today at 10:07 AM · 67 minutes</p>
        </div>
        <div className="recommendation-box">
          <small>Recommendation</small>
          <strong>Advance to interview</strong>
          <span className="confidence">Evidence confidence · High</span>
        </div>
      </section>

      <nav className="tabs" aria-label="Candidate report">
        <a href="#brief" className="active">Decision brief</a>
        <a href="#evidence">Evidence</a>
        <a href="#timeline">Timeline</a>
        <Link href="/receipt/maya-chen">Work receipt</Link>
      </nav>

      <div className="brief-grid" id="brief">
        <div>
          <section className="summary-panel">
            <span className="eyebrow">60-second summary</span>
            <p>
              Maya demonstrated strong production debugging and backend reasoning,
              especially when she rejected an initially plausible database
              hypothesis and found retry amplification in the queue consumer. Her
              recovery design was practical and failure-aware. Communication was
              accurate but occasionally indirect; test executive-level concision
              in the interview.
            </p>
          </section>
          <section className="signal-list">
            <div className="panel-head"><h2>Top signals</h2><span className="muted">Evidence-backed</span></div>
            {evidence.slice(0, 3).map((item, index) => (
              <article className="signal-row" key={item.id}>
                <span className="signal-index">0{index + 1}</span>
                <div>
                  <h3>{item.dimension}<span>{item.level}</span></h3>
                  <p>{item.claim}</p>
                </div>
                <a className="evidence-link" href={`#${item.id}`}>View evidence ↓</a>
              </article>
            ))}
          </section>
        </div>
        <aside className="side-stack">
          <section className="panel">
            <div className="panel-head"><h2>Concern</h2><span className="status amber">Probe</span></div>
            <div className="side-panel-body">
              <p><b>Executive communication</b></p>
              <p>The final update reached the right decision but used 116 words before stating the recommended action.</p>
              <a className="evidence-link" href="#communication">Inspect evidence ↓</a>
            </div>
          </section>
          <section className="panel">
            <div className="panel-head"><h2>Completion</h2></div>
            <div className="side-panel-body">
              <p><b>5 of 5 required tasks</b></p>
              <p>One optional multi-region extension was not attempted. This affects confidence in that area, not the core recommendation.</p>
            </div>
          </section>
          <section className="panel">
            <div className="panel-head"><h2>Record outcome</h2></div>
            <div className="side-panel-body">
              <p>Close the learning loop after your team makes a decision.</p>
              <OutcomeControl />
            </div>
          </section>
        </aside>
      </div>

      <section className="panel" style={{ marginTop: 18 }}>
        <div className="panel-head"><h2>Interview follow-ups</h2><span className="muted">Generated from Maya&apos;s work</span></div>
        <div className="question-list">
          {interviewQuestions.map((item, index) => (
            <div className="question" key={item.question}>
              <p><b>0{index + 1} —</b> “{item.question}”</p>
              <small>{item.reason} <a className="evidence-link" href={`#${item.evidenceId}`}>View source evidence</a></small>
            </div>
          ))}
        </div>
      </section>

      <section id="evidence" style={{ scrollMarginTop: 80, marginTop: 32 }}>
        <div className="page-head" style={{ marginBottom: 16 }}>
          <div><span className="eyebrow">Evidence detail</span><h1 style={{ fontSize: 22, marginTop: 8 }}>Claims you can audit</h1><p>Claim → original work → interpretation. Uncertainty stays visible.</p></div>
        </div>
        {evidence.map(item => (
          <article className="evidence-card" id={item.id} key={item.id}>
            <div className="evidence-top">
              <div><h3>{item.dimension} · {item.level}</h3><p>{item.claim}</p></div>
              <span className={item.confidence === "High" ? "status" : "status amber"}>{item.confidence} confidence</span>
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
            <div className="evidence-meta"><span>{item.source}</span><span>Captured at {item.timestamp}</span></div>
          </article>
        ))}
      </section>

      <section className="panel" id="timeline" style={{ scrollMarginTop: 80, marginTop: 32 }}>
        <div className="panel-head"><h2>Work timeline</h2><span className="muted">Auditable session events</span></div>
        <div className="timeline">
          {timeline.map(([time, title, detail]) => (
            <div className="timeline-row" key={time}>
              <time>{time}</time><span className="timeline-dot" /><div><b>{title}</b><p>{detail}</p></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
