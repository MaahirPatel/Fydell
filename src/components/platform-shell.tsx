"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/brand";

const nav = [
  ["Overview", "/platform"],
  ["Solutions Engineer", "/platform/roles/solutions-engineer"],
  ["Shortlist", "/platform/roles/solutions-engineer#candidates"],
] as const;

function isActive(pathname: string, href: string) {
  const path = href.split("#")[0];
  if (path === "/platform") return pathname === "/platform";
  return pathname.startsWith(path);
}

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
          {nav.map(([label, href]) => (
            <Link
              href={href}
              key={label}
              className={isActive(pathname, href) ? "active" : ""}
            >
              <span className="nav-icon" aria-hidden="true">
                {label === "Overview" ? "⌂" : label.startsWith("Solutions") ? "▣" : "◉"}
              </span>
              {label}
            </Link>
          ))}
          <p>Next step</p>
          <Link href="/pilot" className={pathname === "/pilot" ? "active" : ""}>
            <span className="nav-icon" aria-hidden="true">
              →
            </span>
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
            <span className="demo-label">
              Demo data · Interactive product demo
            </span>
          </div>
          <div className="top-actions">
            <Link href="/c/demo-c4" className="text-link">
              Candidate link
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
        <nav className="mobile-app-nav" aria-label="Demo navigation">
          <Link
            href="/platform"
            className={pathname === "/platform" ? "active" : ""}
          >
            Overview
          </Link>
          <Link
            href="/platform/roles/solutions-engineer"
            className={
              pathname.startsWith("/platform/roles/solutions-engineer")
                ? "active"
                : ""
            }
          >
            Role
          </Link>
          <Link href="/c/demo-c4">Candidate</Link>
          <Link href="/pilot">Pilot</Link>
        </nav>
      </div>
    </div>
  );
}
