import Link from "next/link";
import { notFound } from "next/navigation";
import { Brand } from "@/components/brand";
import { getAttemptByToken, markOpened } from "@/lib/store";
import { role } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export default async function CandidateInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const existing = await getAttemptByToken(token);
  if (!existing) notFound();
  const attempt = (await markOpened(token)) ?? existing;

  return (
    <main className="candidate-shell">
      <header className="candidate-top">
        <Brand />
        <span>
          Private invitation · {role.company} · {attempt.label}
        </span>
      </header>
      <div className="candidate-content">
        <div className="notice demo-banner" role="status">
          <b>Private candidate link.</b> Opening this page updates the durable
          invite status for the employer.
        </div>
        <section className="candidate-intro">
          <div>
            <span className="eyebrow">{role.title}</span>
            <h1>Recommend an implementation path for Acme.</h1>
            <p className="lead">
              Acme wants 1,200 seats live in six weeks, with SAML SSO on day one
              and a small platform team. You will discover requirements, revise
              when constraints change, and defend your recommendation.
            </p>
            <p className="candidate-note">
              Current status: <b>{attempt.status.replace(/_/g, " ")}</b>
              {attempt.email ? ` · Invited as ${attempt.email}` : ""}.
            </p>
          </div>
          <aside className="session-card">
            <small>Your evaluation</small>
            <b>{role.simulation}</b>
            <div className="session-facts">
              <div>
                <span>Expected time</span>
                <b>{role.expectedTime}</b>
              </div>
              <div>
                <span>Stages</span>
                <b>4</b>
              </div>
              <div>
                <span>Autosave</span>
                <b>Server</b>
              </div>
              <div>
                <span>Record</span>
                <b>{attempt.seeded ? "Seeded" : "Live"}</b>
              </div>
            </div>
            <Link className="button" href={`/c/${token}/workspace`}>
              Enter workspace →
            </Link>
          </aside>
        </section>
        <section className="policy-grid" aria-label="Evaluation policy">
          {[
            [
              "⌁",
              "Resources",
              "Brief, thread, and files in the workspace are your source of truth.",
            ],
            [
              "✦",
              "Constraint event",
              "New information may arrive mid-session. How you revise is part of the signal.",
            ],
            [
              "◉",
              "Activity recorded",
              "Stage changes, plan revisions, defense answers, and submit are stored for review.",
            ],
          ].map(([icon, title, text]) => (
            <article className="policy" key={title}>
              <span className="policy-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>
        <p className="candidate-note">
          Questions? Contact{" "}
          <a className="evidence-link" href="mailto:pilots@fydell.com">
            pilots@fydell.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
