export type CandidateStatus = "invited" | "opened" | "in_progress" | "ready";
export type SignalLevel = "Exceptional" | "Strong" | "Moderate" | "Limited";

export interface Evidence {
  id: string;
  dimension: string;
  level: SignalLevel;
  claim: string;
  excerpt: string;
  interpretation: string;
  confidence: "High" | "Medium";
  source: string;
  timestamp: string;
}

export interface Candidate {
  id: string;
  name: string;
  initials: string;
  status: CandidateStatus;
  recommendation?: "Advance" | "Hold" | "Do not advance";
  confidence?: "High" | "Medium";
  score?: number;
  completedAt?: string;
  standout?: string;
}

export interface Role {
  id: string;
  title: string;
  team: string;
  location: string;
  status: "Active" | "Draft" | "Closed";
  candidates: Candidate[];
  dimensions: string[];
}

export const role: Role = {
  id: "backend-engineer",
  title: "Backend Software Engineer",
  team: "Infrastructure · Senior",
  location: "New York / Remote",
  status: "Active",
  dimensions: [
    "Systems reasoning",
    "Debugging",
    "API design",
    "Data modeling",
    "Communication",
  ],
  candidates: [
    {
      id: "maya-chen",
      name: "Maya Chen",
      initials: "MC",
      status: "ready",
      recommendation: "Advance",
      confidence: "High",
      score: 87,
      completedAt: "Today, 9:42 AM",
      standout: "Exceptional debugging",
    },
    {
      id: "jon-bell",
      name: "Jon Bell",
      initials: "JB",
      status: "ready",
      recommendation: "Hold",
      confidence: "Medium",
      score: 71,
      completedAt: "Yesterday, 4:18 PM",
      standout: "Strong API design",
    },
    {
      id: "priya-shah",
      name: "Priya Shah",
      initials: "PS",
      status: "in_progress",
    },
    {
      id: "theo-martin",
      name: "Theo Martin",
      initials: "TM",
      status: "opened",
    },
  ],
};

export const evidence: Evidence[] = [
  {
    id: "debugging",
    dimension: "Debugging",
    level: "Exceptional",
    claim:
      "Isolated the retry amplification failure before changing application code.",
    excerpt:
      "The database latency is stable at 18–22ms. The jump begins after the queue consumer retries timed-out requests without an idempotency key, so each timeout produces duplicate writes and more queue pressure.",
    interpretation:
      "Maya distinguished a plausible symptom from the root cause, used the provided traces to falsify the database hypothesis, and identified the feedback loop.",
    confidence: "High",
    source: "Incident diagnosis · Task 2",
    timestamp: "31:08",
  },
  {
    id: "systems",
    dimension: "Systems reasoning",
    level: "Strong",
    claim:
      "Designed recovery around failure boundaries, not the happy path.",
    excerpt:
      "I would make the request id the idempotency key, persist processing state before acknowledgement, and move exhausted jobs to a dead-letter queue with an operator-visible reason.",
    interpretation:
      "The proposal accounts for retries, partial failure, and operability. The answer does not fully address ordering across regions.",
    confidence: "High",
    source: "Recovery plan · Task 3",
    timestamp: "43:26",
  },
  {
    id: "api",
    dimension: "API design",
    level: "Strong",
    claim:
      "Rejected a superficially simple synchronous endpoint because it hid failure behavior.",
    excerpt:
      "A 200 response would imply the export exists when only the request is accepted. Return 202 with an operation resource, then expose terminal success and failure states.",
    interpretation:
      "Maya used protocol semantics to give clients an honest contract and made asynchronous state inspectable.",
    confidence: "High",
    source: "Architecture memo · Task 4",
    timestamp: "56:11",
  },
  {
    id: "communication",
    dimension: "Communication",
    level: "Moderate",
    claim:
      "Reasoning was accurate, but the executive summary buried the decision.",
    excerpt:
      "There are several contributing factors worth considering before selecting an approach. Based on the traces, I would first stabilize the queue consumer.",
    interpretation:
      "The recommendation is defensible, but a senior stakeholder would benefit from the decision in the first sentence and less setup.",
    confidence: "Medium",
    source: "Executive update · Task 5",
    timestamp: "67:04",
  },
];

export const interviewQuestions = [
  {
    question:
      "You used the request id as an idempotency key. What changes if one request can intentionally create multiple exports?",
    reason: "Tests whether the proposed identity boundary was deliberate.",
    evidenceId: "systems",
  },
  {
    question:
      "Your diagnosis deprioritized the database after reviewing latency. Which database signal would make you reopen that hypothesis?",
    reason: "Tests falsification discipline rather than memorized diagnosis.",
    evidenceId: "debugging",
  },
  {
    question:
      "How would you preserve ordering if consumers were active in two regions during a failover?",
    reason: "Probes the one material gap in the recovery design.",
    evidenceId: "systems",
  },
];

export const timeline = [
  ["09:00", "Simulation started", "Candidate reviewed the brief and tool policy."],
  ["09:07", "Evidence opened", "API traces and queue metrics viewed side by side."],
  ["09:31", "Hypothesis revised", "Database bottleneck rejected after latency comparison."],
  ["09:43", "Recovery plan saved", "Idempotency and dead-letter handling added."],
  ["10:07", "Work submitted", "All required tasks complete; one optional extension skipped."],
] as const;

export const statusLabel: Record<CandidateStatus, string> = {
  invited: "Invited",
  opened: "Opened",
  in_progress: "In progress",
  ready: "Ready for review",
};
