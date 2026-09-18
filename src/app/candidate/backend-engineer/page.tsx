import Link from "next/link";
import { Brand } from "@/components/brand";

export default function CandidateWelcome() {
  return (
    <main className="candidate-shell">
      <header className="candidate-top">
        <Brand />
        <span>Private invitation · Northstar Technologies</span>
      </header>
      <div className="candidate-content">
        <section className="candidate-intro">
          <div>
            <span className="eyebrow">Backend Software Engineer</span>
            <h1>Show how you approach the work.</h1>
            <p className="lead">
              You&apos;ll investigate a production API incident, explain your
              diagnosis, and propose a recovery plan. This is a realistic work
              sample—not a trivia test. We care about how you reason, not whether
              you find a single hidden answer.
            </p>
            <p className="candidate-note">
              Your work is reviewed by Northstar&apos;s hiring team and used only
              for this hiring process. You will receive a verified work receipt
              after completion.
            </p>
          </div>
          <aside className="session-card">
            <small>Your evaluation</small>
            <b>Production API incident</b>
            <div className="session-facts">
              <div><span>Expected time</span><b>60–75 min</b></div>
              <div><span>Required tasks</span><b>5</b></div>
              <div><span>Autosave</span><b>On</b></div>
              <div><span>Due</span><b>Sep 22, 6 PM</b></div>
            </div>
            <Link className="button" href="/candidate/backend-engineer/workspace">Enter workspace →</Link>
          </aside>
        </section>
        <section className="policy-grid" aria-label="Evaluation policy">
          {[
            ["⌁", "Resources", "Documentation, search, and your usual reference materials are allowed."],
            ["✦", "AI tools", "AI assistance is allowed, but you must verify outputs and explain what you keep or change."],
            ["◉", "Activity recorded", "Fydell records task changes, opened artifacts, saved work, and submission events—not your camera or screen."],
          ].map(([icon, title, text]) => (
            <article className="policy" key={title}>
              <span className="policy-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>
        <p className="candidate-note">
          Need an accommodation or have a question? Contact the hiring team before
          starting. Entering the workspace does not start a hidden timer; timing
          begins only when you open the first task.
        </p>
      </div>
    </main>
  );
}
