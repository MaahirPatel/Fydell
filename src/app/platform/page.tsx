import Link from "next/link";
import { role, statusLabel } from "@/lib/demo-data";

export default function EmployerHome() {
  const ready = role.candidates.filter((c) => c.status === "ready");
  const inProgress = role.candidates.filter((c) => c.status === "in_progress");

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>Solutions Engineer shortlist</h1>
          <p>
            {ready.length} briefs ready · {inProgress.length} in progress · Demo
            data
          </p>
        </div>
        <div className="head-actions">
          <Link href="/pilot" className="button secondary">
            Start a pilot
          </Link>
          <Link href="/platform/roles/solutions-engineer" className="button">
            Open role
          </Link>
        </div>
      </div>

      <div className="notice demo-banner" role="status">
        <b>Demo data.</b> These are anonymized sample candidates for the Acme
        rollout simulation—not live production analysis. Every control on this
        path works.
      </div>

      <section className="metric-row" aria-label="Workspace overview">
        {[
          ["Active role", "1", role.title],
          ["Candidates", String(role.candidates.length), "Anonymized demo set"],
          ["Ready for review", String(ready.length), "Strong · Borderline · Reject"],
          ["In progress", String(inProgress.length), "Candidate 4"],
        ].map(([label, value, detail]) => (
          <div className="metric" key={label}>
            <small>{label}</small>
            <b>{value}</b>
            <span>{detail}</span>
          </div>
        ))}
      </section>

      <div className="grid-main">
        <div>
          <section className="panel">
            <div className="panel-head">
              <h2>Needs your attention</h2>
              <span className="status">{ready.length} ready</span>
            </div>
            <div className="action-list">
              {ready.map((candidate) => (
                <div className="action-item" key={candidate.id}>
                  <span className="action-icon">{candidate.initials}</span>
                  <div>
                    <b>Review {candidate.label}</b>
                    <small>
                      {role.title} · {candidate.recommendation}
                    </small>
                  </div>
                  <Link
                    href={`/platform/roles/solutions-engineer/candidates/${candidate.id}`}
                    className="button small"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h2>Active role</h2>
              <Link href="/platform/roles/solutions-engineer">Open pipeline</Link>
            </div>
            <Link className="role-row" href="/platform/roles/solutions-engineer">
              <div className="role-name">
                <span className="role-glyph">SE</span>
                <span>
                  <b>{role.title}</b>
                  <small>
                    {role.company} · {role.simulation}
                  </small>
                </span>
              </div>
              <div className="role-cell">
                <b>{role.candidates.length}</b>
                <small>Candidates</small>
              </div>
              <div className="role-cell">
                <b>{ready.length}</b>
                <small>Briefs ready</small>
              </div>
              <div className="role-cell">
                <b>{inProgress.length}</b>
                <small>In progress</small>
              </div>
              <span>→</span>
            </Link>
          </section>
        </div>

        <aside>
          <section className="panel">
            <div className="panel-head">
              <h2>Pipeline status</h2>
            </div>
            <div className="activity-list">
              {role.candidates.map((candidate) => (
                <div className="activity-row" key={candidate.id}>
                  <i />
                  <span>
                    {candidate.label} · {statusLabel[candidate.status]}
                  </span>
                  <time>{candidate.completedAt ?? "Active"}</time>
                </div>
              ))}
            </div>
          </section>
          <section className="panel">
            <div className="panel-head">
              <h2>Start a pilot</h2>
            </div>
            <div className="side-panel-body">
              <p>
                <b>Use this demo, then run it with your candidates.</b>
              </p>
              <p>
                Founder-led. Email{" "}
                <a className="evidence-link" href="mailto:pilots@fydell.com">
                  pilots@fydell.com
                </a>
                .
              </p>
              <Link href="/pilot" className="button small" style={{ marginTop: 12 }}>
                View pilot offer →
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
