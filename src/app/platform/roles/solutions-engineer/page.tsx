import Link from "next/link";
import { InviteForm } from "@/components/invite-form";
import { comparisonRows, role } from "@/lib/demo-data";
import { listAttempts } from "@/lib/store";
import { statusLabel } from "@/lib/store/types";

export const dynamic = "force-dynamic";

function canReview(status: string) {
  return [
    "submitted",
    "in_review",
    "report_ready",
    "decision_recorded",
  ].includes(status);
}

export default async function RolePage() {
  const attempts = await listAttempts();
  const reviewed = attempts.filter((attempt) => canReview(attempt.status));

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
            Preview seeded candidate view
          </Link>
          <Link href="/pilot" className="button">
            Start a pilot
          </Link>
        </div>
      </div>

      <div className="notice demo-banner" role="status">
        <b>Demo data + live invites.</b> Seeded candidates ship ready. New
        invites write durable JSON records (status, workspace, report, decision).
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

      <div className="grid-main" style={{ marginBottom: 18 }}>
        <InviteForm />
        <aside className="panel">
          <div className="panel-head">
            <h2>Status legend</h2>
          </div>
          <div className="side-panel-body">
            <p>
              invited → opened → in progress → submitted → in review → brief
              ready → decision recorded
            </p>
            <p className="muted" style={{ marginBottom: 0 }}>
              Manual review is required. Nothing auto-advances a hire.
            </p>
          </div>
        </aside>
      </div>

      <section id="candidates">
        <div className="panel-head panel">
          <div>
            <h2>Candidate pipeline</h2>
          </div>
          <span className="muted">
            {attempts.length} records · {reviewed.length} with reports
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
            {attempts.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="side-panel-body">
                    <p>
                      <b>No candidate records yet.</b>
                    </p>
                    <p className="muted">
                      Create an invite above to start the durable loop.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              attempts.map((attempt) => {
              const recommendation =
                attempt.review?.recommendation ??
                attempt.report?.recommendation;
              return (
                <tr key={attempt.id}>
                  <td>
                    <div className="candidate-name">
                      <span className="avatar">{attempt.initials}</span>
                      <span>
                        <b>{attempt.label}</b>
                        <small>
                          {attempt.seeded ? "Seeded" : "Live invite"}
                          {attempt.email ? ` · ${attempt.email}` : ""}
                        </small>
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status ${
                        canReview(attempt.status)
                          ? ""
                          : attempt.status === "in_progress" ||
                              attempt.status === "opened"
                            ? "amber"
                            : "neutral"
                      }`}
                    >
                      {statusLabel[attempt.status]}
                    </span>
                  </td>
                  <td
                    className={
                      recommendation === "Strong interview"
                        ? "recommendation"
                        : recommendation === "Do not advance"
                          ? "recommendation-reject"
                          : "muted"
                    }
                  >
                    {recommendation ?? "—"}
                  </td>
                  <td>
                    {attempt.review?.confidence ??
                      attempt.report?.confidence ??
                      "—"}
                  </td>
                  <td>
                    {attempt.report?.standout ??
                      (attempt.status === "in_progress"
                        ? "In workspace"
                        : "Awaiting work")}
                  </td>
                  <td>
                    {canReview(attempt.status) ? (
                      <Link
                        href={`/platform/roles/solutions-engineer/candidates/${attempt.id}`}
                        className="evidence-link"
                      >
                        Review →
                      </Link>
                    ) : (
                      <Link
                        href={`/c/${attempt.token}`}
                        className="evidence-link"
                      >
                        Candidate link →
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })
            )}
          </tbody>
        </table>
      </section>

      <section className="panel" style={{ marginTop: 18 }} id="comparison">
        <div className="panel-head">
          <h2>Comparison · seeded reviewed candidates</h2>
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
              Same Solutions Engineer simulation. Contact{" "}
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
