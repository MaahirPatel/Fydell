import Link from "next/link";
import { Brand } from "@/components/brand";

export default function NotFound() {
  return (
    <main className="candidate-shell">
      <header className="candidate-top">
        <Brand />
        <span>Page not found</span>
      </header>
      <div className="candidate-content" style={{ maxWidth: 560 }}>
        <span className="eyebrow">404</span>
        <h1 style={{ fontSize: 34, letterSpacing: "-0.04em" }}>
          That link is missing or expired.
        </h1>
        <p className="lead">
          If you were following a candidate invite, ask the employer to create a
          new private link from the Solutions Engineer role page.
        </p>
        <div className="hero-actions">
          <Link href="/platform" className="button">
            Open employer demo
          </Link>
          <Link href="/" className="button secondary">
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
