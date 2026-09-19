import Link from "next/link";
import { Brand } from "@/components/brand";
import { pilotOffer } from "@/lib/pilot-offer";

export default function PilotPage() {
  return (
    <main className="landing">
      <header className="site-header">
        <Brand />
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/platform">Live demo</Link>
          <a href="#offer">Offer</a>
        </nav>
        <div className="site-actions">
          <Link href="/platform" className="button small">
            Explore live demo
          </Link>
        </div>
      </header>

      <section className="page page-narrow pilot-page" id="offer">
        <span className="eyebrow">Founder-led pilot</span>
        <h1>Run a pilot with your own candidates</h1>
        <p className="lead">
          One Solutions Engineer role. Your candidates. A shortlist with
          evidence, uncertainty, and interview questions—so a hiring manager can
          decide without narration.
        </p>

        <div className="pilot-hero-facts" aria-label="Pilot snapshot">
          <div>
            <small>Price</small>
            <b>{pilotOffer.price}</b>
          </div>
          <div>
            <small>Candidates</small>
            <b>{pilotOffer.candidates}</b>
          </div>
          <div>
            <small>Turnaround</small>
            <b>5–7 business days</b>
          </div>
          <div>
            <small>Review</small>
            <b>Founder-led</b>
          </div>
        </div>

        <div className="pilot-grid">
          <section className="panel">
            <div className="panel-head">
              <h2>Scope</h2>
            </div>
            <div className="side-panel-body pilot-body">
              <ul>
                {pilotOffer.scope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
          <section className="panel">
            <div className="panel-head">
              <h2>What you receive</h2>
            </div>
            <div className="side-panel-body pilot-body">
              <ul>
                {pilotOffer.receives.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className="pilot-grid" style={{ marginTop: 18 }}>
          <section className="panel">
            <div className="panel-head">
              <h2>Price & turnaround</h2>
            </div>
            <div className="side-panel-body pilot-body">
              <p>
                <b>{pilotOffer.price}</b> flat for the pilot engagement.
              </p>
              <p>{pilotOffer.priceNote}</p>
              <p>
                <b>Calibration:</b> {pilotOffer.calibration}.
              </p>
              <p>
                <b>Briefs:</b> {pilotOffer.turnaround}. Timing depends on when
                your candidates start—not on fake instant scoring.
              </p>
            </div>
          </section>
          <section className="panel">
            <div className="panel-head">
              <h2>Honest limits</h2>
            </div>
            <div className="side-panel-body pilot-body">
              <ul>
                {pilotOffer.notIncluded.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <section className="panel" style={{ marginTop: 18 }}>
          <div className="panel-head">
            <h2>Contact</h2>
          </div>
          <div className="side-panel-body pilot-body">
            <p>
              Email{" "}
              <a
                className="evidence-link"
                href={`mailto:${pilotOffer.contactEmail}`}
              >
                {pilotOffer.contactEmail}
              </a>{" "}
              or Maahir at{" "}
              <a
                className="evidence-link"
                href={`mailto:${pilotOffer.founderEmail}`}
              >
                {pilotOffer.founderEmail}
              </a>
              .
            </p>
            <p>
              Include your company, Solutions Engineer role context, and how many
              candidates (aim for {pilotOffer.candidates}).
            </p>
            <div className="hero-actions" style={{ marginTop: 18 }}>
              <a
                className="button"
                href={`mailto:${pilotOffer.contactEmail}?subject=Fydell%20pilot%20—%20Solutions%20Engineer`}
              >
                Email {pilotOffer.contactEmail}
              </a>
              <Link href="/platform" className="button secondary">
                Explore the live demo first
              </Link>
            </div>
          </div>
        </section>
      </section>

      <footer className="site-footer">
        <Brand />
        <span>© 2026 Fydell · Proof-of-work hiring</span>
      </footer>
    </main>
  );
}
