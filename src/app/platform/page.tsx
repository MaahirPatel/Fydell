import Link from "next/link";
import { role } from "@/lib/demo-data";

export default function EmployerHome() {
  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>Good morning, Alex</h1>
          <p>Two candidates are ready for your review.</p>
        </div>
        <div className="head-actions">
          <Link href="/platform/roles/new" className="button secondary">Create role</Link>
          <Link href="/platform/roles/backend-engineer" className="button">Invite candidate</Link>
        </div>
      </div>
      <div className="notice">
        This is a clearly labeled demo workspace. Its candidate records are realistic sample data, not production analysis.
      </div>
      <section className="metric-row" aria-label="Workspace overview">
        {[
          ["Active roles", "3", "Across 2 teams"],
          ["In evaluation", "9", "4 active today"],
          ["Ready for review", "2", "Action recommended"],
          ["Decisions this week", "6", "4 advanced · 2 held"],
        ].map(([label, value, detail]) => (
          <div className="metric" key={label}>
            <small>{label}</small><b>{value}</b><span>{detail}</span>
          </div>
        ))}
      </section>

      <div className="grid-main">
        <div>
          <section className="panel">
            <div className="panel-head">
              <h2>Needs your attention</h2>
              <span className="status">2 ready</span>
            </div>
            <div className="action-list">
              <div className="action-item">
                <span className="action-icon">MC</span>
                <div>
                  <b>Review Maya Chen&apos;s completed work</b>
                  <small>Backend Software Engineer · Advance recommended</small>
                </div>
                <Link href="/platform/roles/backend-engineer/candidates/maya-chen" className="button small">Review</Link>
              </div>
              <div className="action-item">
                <span className="action-icon">JB</span>
                <div>
                  <b>Review Jon Bell&apos;s completed work</b>
                  <small>Backend Software Engineer · Additional evidence needed</small>
                </div>
                <Link href="/platform/roles/backend-engineer" className="button secondary small">Open role</Link>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h2>Active roles</h2>
              <Link href="/platform/roles/backend-engineer">View all</Link>
            </div>
            <Link className="role-row" href="/platform/roles/backend-engineer">
              <div className="role-name">
                <span className="role-glyph">BE</span>
                <span><b>{role.title}</b><small>{role.team}</small></span>
              </div>
              <div className="role-cell"><b>4</b><small>Candidates</small></div>
              <div className="role-cell"><b>2</b><small>Ready to review</small></div>
              <div className="role-cell"><b>1</b><small>In progress</small></div>
              <span>→</span>
            </Link>
          </section>
        </div>
        <aside>
          <section className="panel">
            <div className="panel-head"><h2>Recent activity</h2></div>
            <div className="activity-list">
              {[
                ["Maya Chen completed her simulation", "18m"],
                ["Priya Shah started the evaluation", "1h"],
                ["Jon Bell’s report is ready", "1d"],
                ["Theo Martin opened the invitation", "1d"],
              ].map(([text, time]) => (
                <div className="activity-row" key={text}><i /><span>{text}</span><time>{time}</time></div>
              ))}
            </div>
          </section>
          <section className="panel">
            <div className="panel-head"><h2>Evaluation standard</h2></div>
            <div className="side-panel-body">
              <p><b>Evidence, then interpretation.</b></p>
              <p>Fydell shows confidence only where candidate work directly supports a claim. Weak evidence stays visibly uncertain.</p>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
