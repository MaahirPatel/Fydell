import Link from "next/link";

export default function CreateRolePage() {
  return (
    <main className="page page-narrow">
      <div className="page-head">
        <div>
          <div className="breadcrumbs">
            <Link href="/platform">Overview</Link> / New role
          </div>
          <h1>Solutions Engineer is the active role</h1>
          <p>
            This build keeps one calibrated role. Invite candidates on that role
            to run the durable invite → report loop.
          </p>
        </div>
      </div>

      <div className="notice demo-banner" role="status">
        <b>No extra roles this week.</b> Use the seeded Solutions Engineer role
        and create invites there.
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>What you can do now</h2>
        </div>
        <div className="side-panel-body" style={{ display: "grid", gap: 14 }}>
          <p>
            Open the Solutions Engineer pipeline, invite a candidate, complete
            the simulation, review the evidence report, and record a decision.
          </p>
          <div className="hero-actions">
            <Link href="/platform/roles/solutions-engineer" className="button">
              Open role + invite
            </Link>
            <Link href="/pilot" className="button secondary">
              Start a pilot with your candidates
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
