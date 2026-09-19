import Link from "next/link";
import { Brand } from "@/components/brand";
import { PrintButton } from "@/components/print-button";

export default function WorkReceipt() {
  return (
    <main className="receipt-page">
      <div className="receipt-toolbar">
        <Link
          href="/platform/roles/solutions-engineer/candidates/candidate-1"
          className="text-link"
        >
          ← Back to candidate brief
        </Link>
        <PrintButton />
      </div>
      <article className="receipt">
        <header className="receipt-head">
          <div>
            <Brand inverse />
            <p>Verified proof of work · Demo data</p>
          </div>
          <span className="verified">● Verified · FYD-SE-C1</span>
        </header>
        <div className="receipt-body">
          <span className="eyebrow">Work receipt · Demo sample</span>
          <h1>Candidate 1</h1>
          <p className="receipt-role">
            Solutions Engineer · Acme 1,200-seat rollout
          </p>
          <p className="receipt-statement">
            Candidate 1 completed an 86-minute Solutions Engineer simulation,
            revised the rollout after a six-week authentication security review
            blocked production access, and defended the sandbox-first sequencing
            while leaving weekly adoption data marked unverified.
          </p>
          <div className="receipt-skills">
            <div className="receipt-skill">
              <b>Adaptation</b>
              <span>Exceptional evidence</span>
            </div>
            <div className="receipt-skill">
              <b>Discovery judgment</b>
              <span>Strong evidence</span>
            </div>
            <div className="receipt-skill">
              <b>Commercial judgment</b>
              <span>Moderate · unverified WAU</span>
            </div>
          </div>
          <div className="receipt-foot">
            <span>Issued by Fydell for Northstar · Demo workspace</span>
            <span>Employer-confidential source materials are excluded</span>
          </div>
        </div>
      </article>
    </main>
  );
}
