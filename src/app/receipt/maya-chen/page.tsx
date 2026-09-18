import Link from "next/link";
import { Brand } from "@/components/brand";
import { PrintButton } from "@/components/print-button";

export default function WorkReceipt() {
  return (
    <main className="receipt-page">
      <div className="receipt-toolbar">
        <Link href="/platform/roles/backend-engineer/candidates/maya-chen" className="text-link">← Back to candidate brief</Link>
        <PrintButton />
      </div>
      <article className="receipt">
        <header className="receipt-head">
          <div><Brand inverse /><p>Verified proof of work</p></div>
          <span className="verified">● Verified · FYD-9Q2-7M4</span>
        </header>
        <div className="receipt-body">
          <span className="eyebrow">Work receipt · September 18, 2026</span>
          <h1>Maya Chen</h1>
          <p className="receipt-role">Backend Software Engineer · Production API incident</p>
          <p className="receipt-statement">
            Maya completed a 67-minute work simulation and demonstrated the
            ability to diagnose an asynchronous service failure, design a
            resilient recovery path, and communicate a technical recommendation.
          </p>
          <div className="receipt-skills">
            <div className="receipt-skill"><b>Debugging</b><span>Exceptional evidence</span></div>
            <div className="receipt-skill"><b>Systems reasoning</b><span>Strong evidence</span></div>
            <div className="receipt-skill"><b>API design</b><span>Strong evidence</span></div>
          </div>
          <div className="receipt-foot">
            <span>Issued by Fydell for Northstar Technologies</span>
            <span>Employer-confidential source materials are excluded</span>
          </div>
        </div>
      </article>
    </main>
  );
}
