import Link from "next/link";

export default function CreateRolePage() {
  return (
    <main className="page page-narrow">
      <div className="page-head">
        <div>
          <div className="breadcrumbs">
            <Link href="/platform">Overview</Link> / New role
          </div>
          <h1>Create a role</h1>
          <p>
            This demo ships one calibrated Solutions Engineer simulation. For
            your own role and candidates, start a founder-led pilot.
          </p>
        </div>
      </div>

      <div className="notice demo-banner" role="status">
        <b>Demo data.</b> Role creation for custom jobs is part of the pilot—not
        a dead form in this build.
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>What you can do now</h2>
        </div>
        <div className="side-panel-body" style={{ display: "grid", gap: 14 }}>
          <p>
            Open the seeded <b>Solutions Engineer</b> role, review Candidate 1–3
            briefs, and compare recommendations.
          </p>
          <div className="hero-actions">
            <Link href="/platform/roles/solutions-engineer" className="button">
              Open Solutions Engineer demo
            </Link>
            <Link href="/pilot" className="button secondary">
              Start a pilot with your candidates
            </Link>
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Email{" "}
            <a className="evidence-link" href="mailto:pilots@fydell.com">
              pilots@fydell.com
            </a>{" "}
            or{" "}
            <a className="evidence-link" href="mailto:maahir@fydell.com">
              maahir@fydell.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
