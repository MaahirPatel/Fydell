import Link from "next/link";
import { Brand } from "@/components/brand";

const nav = [
  ["Overview", "/platform"],
  ["Roles", "/platform/roles/backend-engineer"],
  ["Candidates", "/platform/roles/backend-engineer"],
] as const;

export function PlatformShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand inverse />
        <div className="workspace-switcher">
          <span className="workspace-mark">N</span>
          <span>
            <b>Northstar</b>
            <small>Demo workspace</small>
          </span>
          <span className="chevron">⌄</span>
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
          <p>Manage</p>
          <Link href="/platform/roles/new">
            <span className="nav-icon" aria-hidden="true">＋</span>
            Create role
          </Link>
        </nav>
        <div className="sidebar-foot">
          <span className="avatar avatar-small">AK</span>
          <span>
            <b>Alex Kim</b>
            <small>Hiring manager</small>
          </span>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <div>
            <span className="mobile-brand"><Brand /></span>
            <span className="demo-label">Interactive product demo</span>
          </div>
          <div className="top-actions">
            <Link href="/candidate/backend-engineer" className="text-link">
              Candidate view
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
