import Link from "next/link";
import { Brand } from "@/components/brand";

const nav = [
  ["Overview", "/platform"],
  ["Solutions Engineer", "/platform/roles/solutions-engineer"],
  ["Shortlist", "/platform/roles/solutions-engineer#candidates"],
] as const;

export function PlatformShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand inverse />
        <div className="workspace-switcher" aria-label="Demo workspace">
          <span className="workspace-mark">N</span>
          <span>
            <b>Northstar</b>
            <small>Demo workspace</small>
          </span>
        </div>
        <nav className="side-nav" aria-label="Workspace">
          <p>Workspace</p>
          {nav.map(([label, href], index) => (
            <Link href={href} key={label} className={index === 0 ? "active" : ""}>
              <span className="nav-icon" aria-hidden="true">
                {index === 0 ? "⌂" : index === 1 ? "▣" : "◉"}
              </span>
              {label}
            </Link>
          ))}
          <p>Next step</p>
          <Link href="/pilot">
            <span className="nav-icon" aria-hidden="true">→</span>
            Start a pilot
          </Link>
        </nav>
        <div className="sidebar-foot">
          <span className="avatar avatar-small">KP</span>
          <span>
            <b>K. Patel</b>
            <small>Hiring manager · Demo</small>
          </span>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <div>
            <span className="mobile-brand">
              <Brand />
            </span>
            <span className="demo-label">Demo data · Interactive product demo</span>
          </div>
          <div className="top-actions">
            <Link href="/candidate/solutions-engineer" className="text-link">
              Candidate view
            </Link>
            <Link href="/pilot" className="text-link">
              Start a pilot
            </Link>
            <Link href="/" className="button secondary small">
              Exit demo
            </Link>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
