import Link from "next/link";
import { Brand } from "@/components/brand";
import { pilotContact } from "@/lib/demo-data";

export default function PilotPage() {
  return (
    <main className="landing">
      <header className="site-header">
        <Brand />
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/platform">Live demo</Link>
        </nav>
        <div className="site-actions">
          <Link href="/platform" className="button small">
            Explore live demo
          </Link>
        </div>
      </header>

      <section className="page page-narrow pilot-page">
        <span className="eyebrow">Founder-led pilot</span>
        <h1>Run a pilot with your own candidates</h1>
        <p className="lead">
          One Solutions Engineer role. Your candidates. A shortlist with
          evidence, uncertainty, and interview questions—delivered so a hiring
          manager can decide without narration.
        </p>

        <div className="pilot-grid">
          <section className="panel">
            <div className="panel-head">
              <h2>Scope</h2>
            </div>
            <div className="side-panel-body pilot-body">
              <ul>
                <li>One open Solutions Engineer role calibrated with your team</li>
                <li>Up to 8 candidate invitations on the Acme-style work simulation</li>
                <li>Evidence briefs, comparison, and interview questions for reviewers</li>
                <li>Manual review supported; no fake automation claims</li>
              </ul>
            </div>
          </section>
          <section className="panel">
            <div className="panel-head">
              <h2>Price & turnaround</h2>
            </div>
            <div className="side-panel-body pilot-body">
              <p>
                <b>$2,500</b> for the pilot engagement, or a scoped Partner
                arrangement if you already run recurring hiring loops.
              </p>
              <p>
                Typical turnaround: role calibration within a few business days;
                candidate briefs as work completes.
              </p>
              <p className="muted">
                Exact timing depends on how quickly your candidates start. We do
                not promise instant AI scoring theater.
              </p>
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
              <a className="evidence-link" href={`mailto:${pilotContact.email}`}>
                {pilotContact.email}
              </a>{" "}
              or reach Maahir directly at{" "}
              <a className="evidence-link" href={`mailto:${pilotContact.founder}`}>
                {pilotContact.founder}
              </a>
              .
            </p>
            <p>
              Include your company, the Solutions Engineer role context, and
              roughly how many candidates you want to put through the simulation.
            </p>
            <div className="hero-actions" style={{ marginTop: 18 }}>
              <a className="button" href={`mailto:${pilotContact.email}?subject=Fydell%20pilot%20—%20Solutions%20Engineer`}>
                Email pilots@fydell.com
              </a>
              <Link href="/platform" className="button secondary">
                Explore the seeded demo first
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
