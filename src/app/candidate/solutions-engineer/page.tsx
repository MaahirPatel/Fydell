import Link from "next/link";
import { Brand } from "@/components/brand";
import { role } from "@/lib/demo-data";

export default function CandidateWelcome() {
  return (
    <main className="candidate-shell">
      <header className="candidate-top">
        <Brand />
        <span>Preview · {role.company} · Demo data</span>
      </header>
      <div className="candidate-content">
        <div className="notice demo-banner" role="status">
          <b>Preview entry.</b> For a durable invite session, open a private
          link from the employer role page (or continue with Candidate 4’s seeded
          link below).
        </div>
        <section className="candidate-intro">
          <div>
            <span className="eyebrow">{role.title}</span>
            <h1>Recommend an implementation path for Acme.</h1>
            <p className="lead">
              Use a private candidate link so status, workspace saves, and the
              evidence report write to the durable store.
            </p>
          </div>
          <aside className="session-card">
            <small>Durable demo session</small>
            <b>Candidate 4 · seeded in progress</b>
            <div className="session-facts">
              <div>
                <span>Token</span>
                <b>demo-c4</b>
              </div>
              <div>
                <span>Autosave</span>
                <b>Server</b>
              </div>
            </div>
            <Link className="button" href="/c/demo-c4">
              Open Candidate 4 link →
            </Link>
          </aside>
        </section>
        <p className="candidate-note">
          Employers create new invites on{" "}
          <Link className="evidence-link" href="/platform/roles/solutions-engineer">
            the role page
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
