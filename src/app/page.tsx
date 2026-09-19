import Link from "next/link";
import { Brand } from "@/components/brand";
import { role, sampleOutcome } from "@/lib/demo-data";

const sequence = [
  "Brief",
  "Constraint changes",
  "Revise",
  "Employer evidence brief",
] as const;

export default function Home() {
  return (
    <main className="landing">
      <header className="site-header">
        <Brand />
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#how">How it works</a>
          <a href="#outcome">Sample outcome</a>
          <Link href="/pilot">Pilot</Link>
        </nav>
        <div className="site-actions">
          <Link href="/pilot" className="text-link">
            Run a pilot
          </Link>
          <Link href="/platform" className="button small">
            Explore live demo
          </Link>
        </div>
      </header>

      <section className="hero hero-compact" id="product">
        <div className="hero-copy">
          <p className="brand-hero">fydell</p>
          <h1>Know who is worth interviewing before the interview.</h1>
          <p>
            Fydell puts Solutions Engineer candidates through realistic customer
            work and returns a shortlist with evidence, uncertainty, and the
            questions your interview should investigate.
          </p>
          <div className="hero-actions">
            <Link href="/platform" className="button large">
              Explore live demo <span>→</span>
            </Link>
            <Link href="/pilot" className="button secondary large">
              Run a pilot
            </Link>
          </div>
          <ol className="hero-sequence" aria-label="Demo sequence">
            {sequence.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="hero-proof" aria-label="Solutions Engineer shortlist preview">
          <div className="product-window">
            <div className="window-bar">
              <span className="traffic">
                <i />
                <i />
                <i />
              </span>
              <span className="window-title">
                Northstar · Solutions Engineer · Demo data
              </span>
            </div>
            <div className="window-body window-body-compact">
              <aside className="preview-rail">
                <strong>Northstar</strong>
                <span>Overview</span>
                <span className="active">Roles</span>
                <span>Shortlist</span>
              </aside>
              <div className="preview-main">
                <div className="preview-heading">
                  <div>
                    <h3>{role.title}</h3>
                    <p>4 candidates · 3 briefs ready · Demo data</p>
                  </div>
                  <span className="status dark">Active</span>
                </div>
                <div className="preview-grid preview-grid-single">
                  <div className="preview-card">
                    <h4>Shortlist</h4>
                    {role.candidates.map((candidate) => (
                      <div className="preview-candidate" key={candidate.id}>
                        <span className="avatar avatar-small">
                          {candidate.initials}
                        </span>
                        <b>{candidate.label}</b>
                        <em>
                          {candidate.recommendation ??
                            (candidate.status === "in_progress"
                              ? "In progress"
                              : "—")}
                        </em>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section compact-section" id="how">
        <div className="section-head">
          <h2>How it works</h2>
          <p>
            Define the role. Candidates complete a work simulation. You receive
            an evidence-backed shortlist.
          </p>
        </div>
        <div className="evidence-columns how-columns">
          {[
            ["01", "Define role", "Calibrate the situation and the signals your team will judge."],
            ["02", "Candidates complete work", "Realistic customer pressure, constraints, and revisions—not trivia."],
            ["03", "Evidence-backed shortlist", "Who to interview, what remains uncertain, and what to ask next."],
          ].map(([number, title, body]) => (
            <article className="evidence-feature" key={number}>
              <span className="number">{number}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section compact-section" id="outcome">
        <div className="sample-outcome">
          <span className="eyebrow">Sample outcome · Demo data</span>
          <h2>{sampleOutcome}</h2>
          <Link href="/platform/roles/solutions-engineer/candidates/candidate-1" className="button">
            Open Candidate 1 brief →
          </Link>
        </div>
      </section>

      <section className="landing-cta">
        <div>
          <h2>See the shortlist. Run a pilot with your own candidates.</h2>
          <p className="landing-cta-note">
            Founder-led pilots. Contact{" "}
            <a href="mailto:pilots@fydell.com">pilots@fydell.com</a>.
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/platform" className="button large">
            Explore live demo <span>→</span>
          </Link>
          <Link href="/pilot" className="button secondary large">
            Run a pilot
          </Link>
        </div>
      </section>

      <footer className="site-footer">
        <Brand />
        <span>© 2026 Fydell · Proof-of-work hiring</span>
      </footer>
    </main>
  );
}
