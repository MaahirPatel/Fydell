import Link from "next/link";
import { Brand } from "@/components/brand";
import { role } from "@/lib/demo-data";

export default function CandidateWelcome() {
  return (
    <main className="candidate-shell">
      <header className="candidate-top">
        <Brand />
        <span>Private invitation · {role.company} · Demo data</span>
      </header>
      <div className="candidate-content">
        <div className="notice demo-banner" role="status">
          <b>Demo data.</b> This is the candidate side of the seeded Solutions
          Engineer simulation.
        </div>
        <section className="candidate-intro">
          <div>
            <span className="eyebrow">{role.title}</span>
            <h1>Recommend an implementation path for Acme.</h1>
            <p className="lead">
              Acme wants 1,200 seats live in six weeks, with SAML SSO on day one
              and a small platform team. You will discover requirements, revise
              when constraints change, and defend your recommendation—this is
              realistic customer work, not a trivia test.
            </p>
            <p className="candidate-note">
              Your work is reviewed by {role.company}&apos;s hiring team for this
              hiring process. A verified work receipt is available after
              completion in the employer demo.
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
                <b>On</b>
              </div>
              <div>
                <span>Demo label</span>
                <b>Visible</b>
              </div>
            </div>
            <Link
              className="button"
              href="/candidate/solutions-engineer/workspace"
            >
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
              "Fydell records stage changes, file edits, messages, and submission—not your camera.",
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
          Need an accommodation? Contact{" "}
          <a className="evidence-link" href="mailto:pilots@fydell.com">
            pilots@fydell.com
          </a>{" "}
          before starting. Entering the workspace does not start a hidden timer.
        </p>
      </div>
    </main>
  );
}
