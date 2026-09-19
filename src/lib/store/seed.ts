import {
  evidenceById,
  interviewQuestions,
  timelineCandidate1,
} from "@/lib/demo-data";
import { defaultWorkspace } from "@/lib/store/report-from-attempt";
import type {
  Attempt,
  ReportDraft,
  ReviewerState,
  StoreData,
} from "@/lib/store/types";

function reviewFromReport(report: ReportDraft, approved = false): ReviewerState {
  return {
    summary: report.summary,
    recommendation: report.recommendation,
    confidence: report.confidence,
    concern: report.concern,
    worthInterviewing: report.worthInterviewing,
    supportingEvidence: report.supportingEvidence,
    changedAfterInfo: report.changedAfterInfo,
    uncertainty: report.uncertainty,
    wouldChangeMind: report.wouldChangeMind,
    notes: "",
    approved,
    approvedAt: approved ? "2026-09-18T17:32:00.000Z" : undefined,
    approvedBy: approved ? "K. Patel" : undefined,
  };
}

function evidenceList(ids: string[]) {
  return ids.map((id) => {
    const item = evidenceById[id];
    return {
      ...item,
      changedAfterInfo:
        id === "adaptation"
          ? "After the security lead blocked production access, the plan moved to sandbox-first sequencing."
          : id === "c2-adaptation"
            ? "Constraint was acknowledged; production sequencing did not fully change."
            : id === "c3-adaptation"
              ? "Constraint arrived; final plan still assumed parallel production access."
              : undefined,
    };
  });
}

const c1Report: ReportDraft = {
  summary:
    "Candidate 1 separated stated requirements from assumptions, then revised the Acme rollout to a sandbox-first path after a six-week authentication security review blocked production access. Communication stayed executive-ready. Probe how they validate sponsor adoption claims before expanding scope.",
  recommendation: "Strong interview",
  confidence: "High",
  standout: "Revised for six-week security review",
  concern: "Adoption sizing still rests on unverified WAU data",
  worthInterviewing:
    "Yes — structured discovery, clear adaptation after a hard constraint, and executive-ready tradeoffs. Interview to validate commercial judgment habits.",
  supportingEvidence:
    "assumptions.md marks WAU unverified; rollout_plan.md revision 4 sequences sandbox before production; defense retains the security constraint.",
  changedAfterInfo:
    "When Acme security blocked production access for six weeks, Candidate 1 revised from a week-six cutover to sandbox (weeks 1–6) then a 200-user cohort after sign-off.",
  uncertainty:
    "Weekly active-user adoption remains sponsor-reported. Cohort size is provisional until verified telemetry exists.",
  wouldChangeMind:
    "Verified usage-by-team data that collapses the 200-user cohort thesis, or a second undisclosed blocker that makes even sandbox enablement infeasible in six weeks.",
  evidence: evidenceList([
    "discovery",
    "adaptation",
    "communication",
    "commercial",
  ]),
  interviewQuestions: interviewQuestions.slice(0, 3),
  timeline: timelineCandidate1.map(([time, title, detail]) => ({
    time,
    title,
    detail,
  })),
  generatedFrom: "seed",
  updatedAt: "2026-09-18T17:32:00.000Z",
};

const c2Report: ReportDraft = {
  summary:
    "Candidate 2 organized requirements cleanly and flagged SSO as day-one critical, but treated the six-week security review as something that could run in parallel with production access. The revised plan still launches seats before review sign-off. Interview only if you can pressure-test sequencing judgment live.",
  recommendation: "Borderline",
  confidence: "Medium",
  standout: "Clear requirements table",
  concern: "Kept parallel security review after the constraint arrived",
  worthInterviewing:
    "Only if you can live-probe sequencing under constraint. Requirements work is strong; adaptation evidence is weak.",
  supportingEvidence:
    "requirements.md is clear on SSO and seat count; rollout_plan.md revision 2 still launches a production cohort in week four.",
  changedAfterInfo:
    "After the constraint, Candidate 2 noted the review but kept production access in parallel rather than sequencing behind sign-off.",
  uncertainty:
    "Whether the parallel launch was a misunderstanding of the block or a pattern under customer pressure.",
  wouldChangeMind:
    "A clear re-sequencing that moves production after sign-off and names sandbox value during the wait.",
  evidence: evidenceList(["c2-requirements", "c2-adaptation"]),
  interviewQuestions: interviewQuestions.slice(3, 5),
  timeline: [
    {
      time: "14:10",
      title: "Requirements drafted",
      detail: "SSO and seat count captured with sources.",
    },
    {
      time: "14:46",
      title: "Constraint delivered",
      detail: "Six-week authentication review blocks production access.",
    },
    {
      time: "15:55",
      title: "Plan revised",
      detail: "Parallel production cohort retained.",
    },
  ],
  generatedFrom: "seed",
  updatedAt: "2026-09-17T16:02:00.000Z",
};

const c3Report: ReportDraft = {
  summary:
    "Candidate 3 produced an early happy-path rollout and did not revise after Acme’s security lead blocked production access for six weeks. Adoption claims were treated as verified. Evidence does not support an interview for this role.",
  recommendation: "Do not advance",
  confidence: "High",
  standout: "Fast first draft",
  concern: "Did not revise after the security constraint",
  worthInterviewing:
    "No — the consequential constraint did not change the recommendation. Adaptation evidence is insufficient for this role.",
  supportingEvidence:
    "Final rollout_plan.md still assumes week-six production cutover with review finishing alongside onboarding.",
  changedAfterInfo:
    "Constraint was delivered; no meaningful revision followed.",
  uncertainty:
    "Little residual uncertainty to carry — the gap is absence of adaptation, not ambiguous evidence.",
  wouldChangeMind:
    "A documented revision that sequences away from blocked production access and re-checks adoption claims.",
  evidence: evidenceList(["c3-adaptation"]),
  interviewQuestions: [],
  timeline: [
    {
      time: "14:05",
      title: "Initial plan",
      detail: "Happy-path week-six cutover drafted.",
    },
    {
      time: "14:46",
      title: "Constraint delivered",
      detail: "Production access blocked for six weeks.",
    },
    {
      time: "15:12",
      title: "Submitted",
      detail: "Plan unchanged on sequencing.",
    },
  ],
  generatedFrom: "seed",
  updatedAt: "2026-09-16T15:12:00.000Z",
};

export function buildSeedStore(): StoreData {
  const now = new Date().toISOString();
  const attempts: Attempt[] = [
    {
      id: "candidate-1",
      token: "demo-c1",
      label: "Candidate 1",
      initials: "C1",
      seeded: true,
      status: "report_ready",
      createdAt: "2026-09-18T09:00:00.000Z",
      openedAt: "2026-09-18T14:02:00.000Z",
      startedAt: "2026-09-18T14:02:00.000Z",
      submittedAt: "2026-09-18T17:01:00.000Z",
      events: c1Report.timeline.map((row, index) => ({
        id: `c1-e${index}`,
        at: row.time,
        type: row.title.toLowerCase().replace(/\s+/g, "_"),
        detail: row.detail,
      })),
      report: c1Report,
      review: reviewFromReport(c1Report, true),
    },
    {
      id: "candidate-2",
      token: "demo-c2",
      label: "Candidate 2",
      initials: "C2",
      seeded: true,
      status: "report_ready",
      createdAt: "2026-09-17T10:00:00.000Z",
      openedAt: "2026-09-17T13:00:00.000Z",
      startedAt: "2026-09-17T13:00:00.000Z",
      submittedAt: "2026-09-17T16:02:00.000Z",
      events: c2Report.timeline.map((row, index) => ({
        id: `c2-e${index}`,
        at: row.time,
        type: row.title.toLowerCase().replace(/\s+/g, "_"),
        detail: row.detail,
      })),
      report: c2Report,
      review: reviewFromReport(c2Report, false),
    },
    {
      id: "candidate-3",
      token: "demo-c3",
      label: "Candidate 3",
      initials: "C3",
      seeded: true,
      status: "report_ready",
      createdAt: "2026-09-16T09:30:00.000Z",
      openedAt: "2026-09-16T13:40:00.000Z",
      startedAt: "2026-09-16T13:40:00.000Z",
      submittedAt: "2026-09-16T15:12:00.000Z",
      events: c3Report.timeline.map((row, index) => ({
        id: `c3-e${index}`,
        at: row.time,
        type: row.title.toLowerCase().replace(/\s+/g, "_"),
        detail: row.detail,
      })),
      report: c3Report,
      review: reviewFromReport(c3Report, true),
    },
    {
      id: "candidate-4",
      token: "demo-c4",
      label: "Candidate 4",
      initials: "C4",
      seeded: true,
      status: "in_progress",
      createdAt: "2026-09-19T08:00:00.000Z",
      openedAt: "2026-09-19T09:15:00.000Z",
      startedAt: "2026-09-19T09:20:00.000Z",
      workspace: defaultWorkspace(),
      events: [
        {
          id: "c4-e0",
          at: "09:20",
          type: "workspace_opened",
          detail: "Opened Acme engagement brief.",
        },
      ],
    },
  ];

  return {
    version: 1,
    roleId: "solutions-engineer",
    attempts,
    updatedAt: now,
  };
}
