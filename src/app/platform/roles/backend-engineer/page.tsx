import Link from "next/link";
import { role, statusLabel } from "@/lib/demo-data";

export default function RolePage() {
  return (
    <main className="page">
      <div className="page-head">
        <div>
          <div className="breadcrumbs"><Link href="/platform">Overview</Link> / Roles</div>
          <h1>{role.title}</h1>
          <p>{role.team} · {role.location}</p>
        </div>
        <div className="head-actions">
          <Link href="/candidate/backend-engineer" className="button secondary">Preview candidate view</Link>
        </div>
      </div>

      <section className="role-summary">
        <p><small>Status</small><b><span className="status">Active</span></b></p>
        <p><small>Evaluation</small><b>Production API incident</b></p>
        <p><small>Expected time</small><b>75 minutes</b></p>
        <div className="dimensions">
          {role.dimensions.map(dimension => <span className="chip" key={dimension}>{dimension}</span>)}
        </div>
      </section>

      <section id="candidates">
        <div className="panel-head panel">
          <div>
            <h2>Candidate pipeline</h2>
          </div>
          <span className="muted">4 candidates · 2 ready</span>
        </div>
        <table className="candidate-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Status</th>
              <th>Recommendation</th>
              <th>Evidence confidence</th>
              <th>Top signal</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {role.candidates.map(candidate => {
              return (
                <tr key={candidate.id}>
                  <td>
                    <div className="candidate-name">
                      <span className="avatar">{candidate.initials}</span>
                      <span><b>{candidate.name}</b><small>{candidate.completedAt ?? "Invitation active"}</small></span>
                    </div>
                  </td>
                  <td><span className={`status ${candidate.status === "ready" ? "" : candidate.status === "in_progress" ? "amber" : "neutral"}`}>{statusLabel[candidate.status]}</span></td>
                  <td className={candidate.recommendation === "Advance" ? "recommendation" : "muted"}>{candidate.recommendation ?? "—"}</td>
                  <td>{candidate.confidence ?? "—"}</td>
                  <td>{candidate.standout ?? "Awaiting work"}</td>
                  <td>
                    {candidate.id === "maya-chen"
                      ? <Link href="/platform/roles/backend-engineer/candidates/maya-chen" className="evidence-link">Review →</Link>
                      : <span className="muted">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <div className="grid-main" style={{ marginTop: 18 }}>
        <section className="panel">
          <div className="panel-head"><h2>Evaluation plan</h2><Link href="/platform/roles/new">Edit criteria</Link></div>
          <div className="action-list">
            {role.dimensions.map((dimension, index) => (
              <div className="action-item" key={dimension}>
                <span className="action-icon">0{index + 1}</span>
                <div><b>{dimension}</b><small>{["Diagnose a live failure using traces and system behavior", "Separate symptoms from a root cause", "Define honest contracts and failure states", "Model durable state and idempotency", "Deliver a concise recommendation"][index]}</small></div>
              </div>
            ))}
          </div>
        </section>
        <aside className="panel">
          <div className="panel-head"><h2>Invitation status</h2></div>
          <div className="side-panel-body">
            <p><b>1 opened · 1 in progress</b></p>
            <p>Candidate invitation links expire after seven days. A candidate can have only one active session for this role.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
