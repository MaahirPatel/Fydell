import Link from "next/link";
import { Brand } from "@/components/brand";

const candidates = [
  ["Maya Chen", "87", "Advance"],
  ["Jon Bell", "71", "Hold"],
  ["Priya Shah", "—", "In progress"],
] as const;

export default function Home() {
  return (
    <main className="landing">
      <header className="site-header">
        <Brand />
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#product">Product</a>
          <a href="#evidence">How it works</a>
          <a href="#trust">Trust</a>
        </nav>
        <div className="site-actions">
          <Link href="/candidate/backend-engineer" className="text-link">Candidate view</Link>
          <Link href="/platform" className="button small">Explore the demo</Link>
        </div>
      </header>

      <section className="hero" id="product">
        <div className="hero-copy">
          <span className="eyebrow">Proof-of-work hiring</span>
          <h1>Evaluate candidates on the <span>work.</span></h1>
          <p>
            Fydell turns realistic work simulations into clear hiring
            recommendations—with every claim connected to evidence you can inspect.
          </p>
          <div className="hero-actions">
            <Link href="/platform" className="button large">Explore the employer demo <span>→</span></Link>
            <Link href="/candidate/backend-engineer" className="button secondary large">View the candidate experience</Link>
          </div>
        </div>

        <div className="hero-proof" aria-label="Fydell role command center preview">
          <div className="product-window">
            <div className="window-bar">
              <span className="traffic"><i /><i /><i /></span>
              <span className="window-title">Northstar · Backend Software Engineer</span>
            </div>
            <div className="window-body">
              <aside className="preview-rail">
                <strong>Northstar</strong>
                <span>Overview</span>
                <span className="active">Roles</span>
                <span>Candidates</span>
                <span>Settings</span>
              </aside>
              <div className="preview-main">
                <div className="preview-heading">
                  <div>
                    <h3>Backend Software Engineer</h3>
                    <p>4 candidates · 2 ready for review</p>
                  </div>
                  <span className="status dark">Active</span>
                </div>
                <div className="preview-grid">
                  <div className="preview-card">
                    <h4>Candidate pipeline</h4>
                    {candidates.map(([name, score, recommendation]) => (
                      <div className="preview-candidate" key={name}>
                        <span className="avatar avatar-small">{name.split(" ").map(part => part[0]).join("")}</span>
                        <b>{name}</b>
                        <span>{score}</span>
                        <em>{recommendation}</em>
                      </div>
                    ))}
                  </div>
                  <div className="preview-card">
                    <h4>Maya&apos;s strongest signals</h4>
                    <div className="signal-bars">
                      {[
                        ["Debugging", "94%"],
                        ["Systems reasoning", "89%"],
                        ["API design", "86%"],
                        ["Communication", "72%"],
                      ].map(([label, width]) => (
                        <div className="signal-bar" key={label}>
                          {label}
                          <div><i style={{ width }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="thesis" id="evidence">
        <div className="thesis-inner">
          <span className="eyebrow">A complete line of sight</span>
          <h2>From an open role to a defensible hiring decision.</h2>
          <div className="flow-line">
            {["Define the role", "Invite a candidate", "Observe the work", "Inspect the evidence", "Make the decision"].map((step, index) => (
              <div className="flow-step" key={step}>
                <small>0{index + 1}</small>
                <b>{step}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section" id="trust">
        <div className="section-head">
          <h2>A decision brief, not another test score.</h2>
          <p>
            A hiring manager should understand what a candidate did, why it
            matters, and what to ask next in about 60 seconds.
          </p>
        </div>
        <div className="evidence-columns">
          {[
            ["01", "Specific claims", "Recommendations describe observable behavior—not generic personality traits."],
            ["02", "Auditable evidence", "Every important claim opens the exact work, event, or decision that supports it."],
            ["03", "Candidate-specific follow-ups", "Interview questions test the assumptions and gaps in this candidate’s own work."],
          ].map(([number, title, body]) => (
            <article className="evidence-feature" key={number}>
              <span className="number">{number}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <h2>See the evidence.<br />Make the call.</h2>
        <Link href="/platform" className="button large">Open the 90-second demo <span>→</span></Link>
      </section>
      <footer className="site-footer">
        <Brand />
        <span>© 2026 Fydell · Proof-of-work hiring</span>
      </footer>
    </main>
  );
}
