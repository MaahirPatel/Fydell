export type CandidateStatus =
  | "invited"
  | "in_progress"
  | "submitted"
  | "ready";

export type Recommendation = "Strong interview" | "Borderline" | "Do not advance";

export type SignalLevel = "Exceptional" | "Strong" | "Moderate" | "Limited";

export interface Evidence {
  id: string;
  dimension: string;
  level: SignalLevel;
  claim: string;
  excerpt: string;
  interpretation: string;
  confidence: "High" | "Medium" | "Low";
  source: string;
  timestamp: string;
  counter?: string;
}

export interface InterviewQuestion {
  question: string;
  reason: string;
  evidenceId: string;
  strongAnswer: string;
  unresolved: string;
}

export interface Candidate {
  id: string;
  label: string;
  initials: string;
  status: CandidateStatus;
  recommendation?: Recommendation;
  confidence?: "High" | "Medium" | "Low";
  completedAt?: string;
  standout?: string;
  concern?: string;
  summary?: string;
  duration?: string;
  evidenceIds?: string[];
  interviewIds?: number[];
}

export interface Role {
  id: string;
  title: string;
  team: string;
  company: string;
  location: string;
  status: "Active" | "Draft" | "Closed";
  simulation: string;
  expectedTime: string;
  candidates: Candidate[];
  dimensions: { name: string; weight: string; focus: string }[];
}

export const role: Role = {
  id: "solutions-engineer",
  title: "Solutions Engineer",
  team: "Customer Solutions · Mid–Senior",
  company: "Northstar",
  location: "Remote / Hybrid",
  status: "Active",
  simulation: "Acme 1,200-seat rollout",
  expectedTime: "75–90 minutes",
  dimensions: [
    {
      name: "Discovery judgment",
      weight: "30%",
      focus: "Separates stated needs from assumptions and constraints",
    },
    {
      name: "Technical translation",
      weight: "20%",
      focus: "Turns requirements into a feasible implementation path",
    },
    {
      name: "Adaptation",
      weight: "30%",
      focus: "Revises the plan when consequential information arrives",
    },
    {
      name: "Commercial judgment",
      weight: "20%",
      focus: "Balances customer value, effort, and adoption risk",
    },
  ],
  candidates: [
    {
      id: "candidate-1",
      label: "Candidate 1",
      initials: "C1",
      status: "ready",
      recommendation: "Strong interview",
      confidence: "High",
      completedAt: "Today, 11:47 AM",
      duration: "86 minutes",
      standout: "Revised for six-week security review",
      concern: "Adoption sizing still rests on unverified WAU data",
      summary:
        "Candidate 1 separated stated requirements from assumptions, then revised the Acme rollout to a sandbox-first path after a six-week authentication security review blocked production access. Communication stayed executive-ready. Probe how they validate sponsor adoption claims before expanding scope.",
      evidenceIds: ["discovery", "adaptation", "communication", "commercial"],
      interviewIds: [0, 1, 2],
    },
    {
      id: "candidate-2",
      label: "Candidate 2",
      initials: "C2",
      status: "ready",
      recommendation: "Borderline",
      confidence: "Medium",
      completedAt: "Yesterday, 4:02 PM",
      duration: "79 minutes",
      standout: "Clear requirements table",
      concern: "Kept parallel security review after the constraint arrived",
      summary:
        "Candidate 2 organized requirements cleanly and flagged SSO as day-one critical, but treated the six-week security review as something that could run in parallel with production access. The revised plan still launches seats before review sign-off. Interview only if you can pressure-test sequencing judgment live.",
      evidenceIds: ["c2-requirements", "c2-adaptation"],
      interviewIds: [3, 4],
    },
    {
      id: "candidate-3",
      label: "Candidate 3",
      initials: "C3",
      status: "ready",
      recommendation: "Do not advance",
      confidence: "High",
      completedAt: "Two days ago",
      duration: "61 minutes",
      standout: "Fast first draft",
      concern: "Did not revise after the security constraint",
      summary:
        "Candidate 3 produced an early happy-path rollout and did not revise after Acme’s security lead blocked production access for six weeks. Adoption claims were treated as verified. Evidence does not support an interview for this role.",
      evidenceIds: ["c3-adaptation"],
      interviewIds: [],
    },
    {
      id: "candidate-4",
      label: "Candidate 4",
      initials: "C4",
      status: "in_progress",
      completedAt: undefined,
      standout: undefined,
      concern: undefined,
      summary: undefined,
    },
  ],
};

export const evidenceById: Record<string, Evidence> = {
  discovery: {
    id: "discovery",
    dimension: "Discovery judgment",
    level: "Strong",
    claim:
      "Separated stated requirements from assumptions before recommending an architecture.",
    excerpt:
      "SAML SSO is confirmed day-one from security_brief.pdf. Weekly active users (1,200 seats ‘mostly active’) are sponsor-reported and marked unverified in assumptions.md.",
    interpretation:
      "Candidate 1 distinguished a customer statement from a verified technical constraint before sizing the rollout.",
    confidence: "High",
    source: "assumptions.md · 14:22",
    timestamp: "14:22",
  },
  adaptation: {
    id: "adaptation",
    dimension: "Adaptation",
    level: "Exceptional",
    claim:
      "Revised the rollout to sandbox-first after the six-week authentication review blocked production access.",
    excerpt:
      "Weeks 1–6 · sandbox tenant only, while the six-week security review completes. Week 7 · controlled 200-user cohort in production, after review sign-off. Then expand by business unit after the first support review.",
    interpretation:
      "The candidate retained the original commercial goal while sequencing around a hard constraint instead of abandoning the approach or ignoring the block.",
    confidence: "High",
    source: "rollout_plan.md · revision 4 · 16:13",
    timestamp: "16:13",
    counter:
      "Sponsor estimate (sponsor_estimate.xlsx) assumed a shorter timeline with no extended review.",
  },
  communication: {
    id: "communication",
    dimension: "Technical translation",
    level: "Strong",
    claim:
      "Explained tradeoffs in language an executive sponsor could use.",
    excerpt:
      "We keep Acme on a sandbox path for the security window, then open a 200-user production cohort only after sign-off. That protects the board date without granting production access early.",
    interpretation:
      "The defense and written plan both lead with the decision, preserve the constraint, and name the commercial tradeoff.",
    confidence: "High",
    source: "Oral defense · Q1 · 17:01",
    timestamp: "17:01",
  },
  commercial: {
    id: "commercial",
    dimension: "Commercial judgment",
    level: "Moderate",
    claim:
      "Marked weekly active users unverified, yet still used them to size the first cohort.",
    excerpt:
      "Adoption risk should remain low because the sponsor reports strong weekly usage. Cohort size stays provisional until weekly active-user data is verified.",
    interpretation:
      "Uncertainty is visible, but rollout sizing still depends on Acme’s self-reported WAU. Interview should test validation habits.",
    confidence: "Medium",
    source: "rollout_plan.md · line 14–15",
    timestamp: "16:13",
    counter:
      "No usage-by-team check appears in the submitted artifacts.",
  },
  "c2-requirements": {
    id: "c2-requirements",
    dimension: "Discovery judgment",
    level: "Strong",
    claim: "Built a clear requirements table with source and impact.",
    excerpt:
      "SAML SSO — security_brief.pdf — confirmed — high impact. 1,200 seats — discovery_call.md — confirmed — medium impact.",
    interpretation:
      "Requirements hygiene is solid; the gap appears later when constraints conflict with the launch date.",
    confidence: "High",
    source: "requirements.md · 14:40",
    timestamp: "14:40",
  },
  "c2-adaptation": {
    id: "c2-adaptation",
    dimension: "Adaptation",
    level: "Limited",
    claim:
      "Acknowledged the security review but kept production access in parallel.",
    excerpt:
      "Launch a 400-user production cohort in week four while security completes its authentication review in parallel. Expand to remaining seats at week six.",
    interpretation:
      "The plan notes the constraint without changing the sequencing that the constraint blocks. That is the core borderline signal.",
    confidence: "High",
    source: "rollout_plan.md · revision 2 · 15:55",
    timestamp: "15:55",
    counter:
      "Security lead message: production access cannot be granted before the review closes.",
  },
  "c3-adaptation": {
    id: "c3-adaptation",
    dimension: "Adaptation",
    level: "Limited",
    claim: "Did not revise the plan after the sequential security block.",
    excerpt:
      "Cut over all 1,200 seats in production at week six. Authentication review can finish alongside onboarding.",
    interpretation:
      "No revision after the constraint event. Evidence confidence for Adaptation is low; recommendation is do not advance.",
    confidence: "High",
    source: "rollout_plan.md · final · 15:12",
    timestamp: "15:12",
    counter:
      "Incoming constraint at 14:46 required sequencing away from production access.",
  },
};

export const interviewQuestions: InterviewQuestion[] = [
  {
    question:
      "Tell me about a time customer urgency conflicted with a security constraint. What did you preserve, and what moved?",
    reason:
      "The Acme revision is the strongest Adaptation signal. A second example shows whether it repeats outside a prompted moment.",
    evidenceId: "adaptation",
    strongAnswer:
      "Names what was preserved, what moved, and who was told — not just that the plan changed.",
    unresolved:
      "Whether the sequencing instinct holds when the constraint comes from an internal team rather than the customer.",
  },
  {
    question:
      "How do you validate an executive sponsor’s adoption claim before committing an implementation team?",
    reason:
      "Candidate 1 marked weekly active users unverified and still used the number to size the first cohort.",
    evidenceId: "commercial",
    strongAnswer:
      "Describes a concrete check — usage by team against license assignment — and what they would do when it is unavailable.",
    unresolved:
      "Rollout sizing still depends on Acme’s self-reported weekly active-user count.",
  },
  {
    question:
      "Which fact in the Acme brief would most likely change your recommendation again?",
    reason:
      "Tests whether the candidate can rank their own uncertainty instead of defending the plan they already wrote.",
    evidenceId: "discovery",
    strongAnswer:
      "Picks a fact with real decision impact and says how they would detect the change early.",
    unresolved:
      "Whether the six-week review is the only sequencing blocker Acme has not disclosed.",
  },
  {
    question:
      "Production access is blocked until security signs off. Walk me through how you would re-sequence the plan you submitted.",
    reason:
      "Candidate 2’s final plan still launches production seats before review close.",
    evidenceId: "c2-adaptation",
    strongAnswer:
      "Moves production access after sign-off and names what value the customer still gets during the sandbox window.",
    unresolved:
      "Whether the parallel launch was a misunderstanding or a pattern under pressure.",
  },
  {
    question:
      "What would you need to see before treating ‘strong weekly usage’ as a verified adoption signal?",
    reason:
      "Requirements work was strong; commercial validation was thinner.",
    evidenceId: "c2-requirements",
    strongAnswer:
      "Asks for usage by team or product telemetry, not seat assignment alone.",
    unresolved:
      "Whether Candidate 2 can separate sponsor narrative from measurable adoption.",
  },
];

export const timelineCandidate1 = [
  ["14:02", "Discovery opened", "Engagement brief and Acme thread reviewed."],
  ["14:22", "Assumption recorded", "weekly_active_users marked unverified."],
  ["14:46", "Constraint delivered", "Six-week authentication review blocks production access."],
  ["16:13", "Plan revised", "rollout_plan.md → revision 4, sandbox-first sequencing."],
  ["17:01", "Oral defense", "Tradeoffs explained; constraint retained."],
  ["17:32", "Human review", "K. Patel approved with one assumption flagged for interview."],
] as const;

export const comparisonRows = [
  {
    dimension: "Discovery judgment",
    c1: "Strong — marked WAU unverified",
    c2: "Strong — clear requirements table",
    c3: "Moderate — accepted sponsor claims",
  },
  {
    dimension: "Adaptation",
    c1: "Exceptional — sandbox-first revision",
    c2: "Limited — kept parallel production",
    c3: "Limited — no revision after constraint",
  },
  {
    dimension: "Technical translation",
    c1: "Strong — executive-ready tradeoffs",
    c2: "Moderate — solid notes, weaker handoff",
    c3: "Limited — happy-path only",
  },
  {
    dimension: "Commercial judgment",
    c1: "Moderate — provisional cohort, unverified WAU",
    c2: "Moderate — early cohort without validation plan",
    c3: "Limited — treated adoption as proven",
  },
] as const;

export const statusLabel: Record<CandidateStatus, string> = {
  invited: "Invited",
  in_progress: "In progress",
  submitted: "Work submitted",
  ready: "Brief ready",
};

export const sampleOutcome =
  "Candidate 1 revised for a six-week security review, moved Acme to sandbox first, and left weekly adoption data marked unverified — exactly the uncertainty your interview should probe.";

export function getCandidate(id: string): Candidate | undefined {
  return role.candidates.find((candidate) => candidate.id === id);
}

export function evidenceFor(candidate: Candidate): Evidence[] {
  return (candidate.evidenceIds ?? [])
    .map((id) => evidenceById[id])
    .filter(Boolean);
}

export function interviewsFor(candidate: Candidate): InterviewQuestion[] {
  return (candidate.interviewIds ?? []).map((index) => interviewQuestions[index]);
}

export const pilotContact = {
  email: "pilots@fydell.com",
  founder: "maahir@fydell.com",
};
