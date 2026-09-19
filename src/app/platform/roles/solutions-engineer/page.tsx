import Link from "next/link";
import { comparisonRows, role, statusLabel } from "@/lib/demo-data";

export default function RolePage() {
  const reviewed = role.candidates.filter((c) => c.recommendation);

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <div className="breadcrumbs">
            <Link href="/platform">Overview</Link> / Roles
          </div>
          <h1>{role.title}</h1>
          <p>
            {role.company} · {role.team} · {role.location}
          </p>
        </div>
        <div className="head-actions">
          <Link href="/candidate/solutions-engineer" className="button secondary">
            Preview candidate view
          </Link>
          <Link href="/pilot" className="button">
            Start a pilot
          </Link>
        </div>
      </div>

      <div className="notice demo-banner" role="status">
        <b>Demo data.</b> Four anonymized candidates on the Acme 1,200-seat
        rollout simulation.
      </div>

      <section className="role-summary">
        <p>
          <small>Status</small>
          <b>
            <span className="status">Active</span>
          </b>
        </p>
        <p>
          <small>Evaluation</small>
          <b>{role.simulation}</b>
        </p>
        <p>
          <small>Expected time</small>
          <b>{role.expectedTime}</b>
        </p>
        <div className="dimensions">
          {role.dimensions.map((dimension) => (
            <span className="chip" key={dimension.name}>
              {dimension.name} · {dimension.weight}
            </span>
          ))}
        </div>
      </section>

      <section id="candidates">
        <div className="panel-head panel">
          <div>
            <h2>Candidate pipeline</h2>
          </div>
          <span className="muted">
            {role.candidates.length} candidates · {reviewed.length} briefs ready
          </span>
        </div>
        <table className="candidate-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Status</th>
              <th>Recommendation</th>
              <th>Confidence</th>
              <th>Top signal</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {role.candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>
                  <div className="candidate-name">
                    <span className="avatar">{candidate.initials}</span>
                    <span>
                      <b>{candidate.label}</b>
                      <small>
                        {candidate.completedAt ?? "Invitation active"}
                      </small>
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    className={`status ${
                      candidate.status === "ready"
                        ? ""
                        : candidate.status === "in_progress"
                          ? "amber"
                          : "neutral"
                    }`}
                  >
                    {statusLabel[candidate.status]}
                  </span>
                </td>
                <td
                  className={
                    candidate.recommendation === "Strong interview"
                      ? "recommendation"
                      : candidate.recommendation === "Do not advance"
                        ? "recommendation-reject"
                        : "muted"
                  }
                >
                  {candidate.recommendation ?? "—"}
                </td>
                <td>{candidate.confidence ?? "—"}</td>
                <td>{candidate.standout ?? "Awaiting work"}</td>
                <td>
                  {candidate.recommendation ? (
                    <Link
                      href={`/platform/roles/solutions-engineer/candidates/${candidate.id}`}
                      className="evidence-link"
                    >
                      Review →
                    </Link>
                  ) : (
                    <span className="muted">In progress</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel" style={{ marginTop: 18 }} id="comparison">
        <div className="panel-head">
          <h2>Comparison · reviewed candidates</h2>
          <span className="muted">Demo data</span>
        </div>
        <div className="comparison-wrap">
          <table className="candidate-table comparison-table">
            <thead>
              <tr>
                <th>Dimension</th>
                <th>Candidate 1 · Strong</th>
                <th>Candidate 2 · Borderline</th>
                <th>Candidate 3 · Reject</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.dimension}>
                  <td>
                    <b>{row.dimension}</b>
                  </td>
                  <td>{row.c1}</td>
                  <td>{row.c2}</td>
                  <td>{row.c3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid-main" style={{ marginTop: 18 }}>
        <section className="panel">
          <div className="panel-head">
            <h2>Evaluation plan</h2>
          </div>
          <div className="action-list">
            {role.dimensions.map((dimension, index) => (
              <div className="action-item" key={dimension.name}>
                <span className="action-icon">0{index + 1}</span>
                <div>
                  <b>
                    {dimension.name} · {dimension.weight}
                  </b>
                  <small>{dimension.focus}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
        <aside className="panel">
          <div className="panel-head">
            <h2>Start a pilot</h2>
          </div>
          <div className="side-panel-body">
            <p>
              <b>Ready to use your own candidates?</b>
            </p>
            <p>
              Same Solutions Engineer simulation shape. Real invitations and
              briefs. Contact{" "}
              <a className="evidence-link" href="mailto:pilots@fydell.com">
                pilots@fydell.com
              </a>
              .
            </p>
            <Link href="/pilot" className="button small" style={{ marginTop: 12 }}>
              View pilot offer →
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
