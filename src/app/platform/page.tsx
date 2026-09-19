import Link from "next/link";
import { role } from "@/lib/demo-data";
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

export default async function EmployerHome() {
  const attempts = await listAttempts();
  const ready = attempts.filter((attempt) => canReview(attempt.status));
  const inProgress = attempts.filter(
    (attempt) =>
      attempt.status === "in_progress" ||
      attempt.status === "opened" ||
      attempt.status === "invited",
  );

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>Solutions Engineer shortlist</h1>
          <p>
            {ready.length} briefs · {inProgress.length} open invites/sessions ·
            Durable store
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
        <b>Demo data + live invites.</b> Seeded briefs are ready. Create an
        invite on the role page to run the full invite → workspace → report →
        decision loop with durable records.
      </div>

      <section className="metric-row" aria-label="Workspace overview">
        {[
          ["Active role", "1", role.title],
          ["Records", String(attempts.length), "Seeded + live"],
          ["Ready for review", String(ready.length), "Reports available"],
          ["Open pipeline", String(inProgress.length), "Invited / in progress"],
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
              {ready.slice(0, 5).map((attempt) => (
                <div className="action-item" key={attempt.id}>
                  <span className="action-icon">{attempt.initials}</span>
                  <div>
                    <b>Review {attempt.label}</b>
                    <small>
                      {role.title} ·{" "}
                      {attempt.review?.recommendation ??
                        attempt.report?.recommendation ??
                        statusLabel[attempt.status]}
                    </small>
                  </div>
                  <Link
                    href={`/platform/roles/solutions-engineer/candidates/${attempt.id}`}
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
                <b>{attempts.length}</b>
                <small>Records</small>
              </div>
              <div className="role-cell">
                <b>{ready.length}</b>
                <small>Briefs</small>
              </div>
              <div className="role-cell">
                <b>{inProgress.length}</b>
                <small>Open</small>
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
              {attempts.slice(0, 8).map((attempt) => (
                <div className="activity-row" key={attempt.id}>
                  <i />
                  <span>
                    {attempt.label} · {statusLabel[attempt.status]}
                  </span>
                  <time>{attempt.seeded ? "Seed" : "Live"}</time>
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
