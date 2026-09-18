import Link from "next/link";

const dimensions = [
  ["Systems reasoning", "Diagnoses behavior across service boundaries"],
  ["Debugging", "Forms and falsifies hypotheses using evidence"],
  ["API design", "Creates clear contracts for success and failure"],
  ["Data modeling", "Models state, identity, and constraints explicitly"],
  ["Communication", "Explains decisions clearly to a busy stakeholder"],
] as const;

export default function CreateRolePage() {
  return (
    <main className="page page-narrow">
      <div className="page-head">
        <div>
          <div className="breadcrumbs"><Link href="/platform">Overview</Link> / New role</div>
          <h1>Create a role</h1>
          <p>Define the job, then confirm exactly what Fydell will evaluate.</p>
        </div>
      </div>
      <form className="form-shell" action="/platform/roles/backend-engineer">
        <section className="form-section">
          <div><h2>Role details</h2><p>Only the information needed to build a job-relevant evaluation.</p></div>
          <div className="field-grid">
            <div className="field full"><label htmlFor="title">Role title</label><input id="title" name="title" defaultValue="Backend Software Engineer" required /></div>
            <div className="field"><label htmlFor="team">Team</label><input id="team" name="team" defaultValue="Infrastructure" required /></div>
            <div className="field"><label htmlFor="seniority">Seniority</label><select id="seniority" name="seniority" defaultValue="senior"><option value="mid">Mid-level</option><option value="senior">Senior</option><option value="staff">Staff / Principal</option></select></div>
            <div className="field full"><label htmlFor="description">What will this person be responsible for?</label><textarea id="description" name="description" defaultValue="Design and operate reliable APIs and asynchronous services. Diagnose production incidents, improve system resilience, and communicate technical tradeoffs clearly." required /></div>
          </div>
        </section>
        <section className="form-section">
          <div><h2>Evaluation plan</h2><p>These observable dimensions become the rubric. Review them before inviting anyone.</p></div>
          <div className="dimension-list">
            {dimensions.map(([dimension, description], index) => (
              <div className="dimension-item" key={dimension}>
                <span>↕</span><span><b>{dimension}</b><small>{description}</small></span><span>{20 - index * 2}%</span>
              </div>
            ))}
          </div>
        </section>
        <div className="form-actions">
          <Link href="/platform" className="button secondary">Cancel</Link>
          <button className="button" type="submit">Create role and review simulation</button>
        </div>
      </form>
    </main>
  );
}
