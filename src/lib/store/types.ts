export type AttemptStatus =
  | "invited"
  | "opened"
  | "in_progress"
  | "submitted"
  | "in_review"
  | "report_ready"
  | "decision_recorded";

export type Recommendation =
  | "Strong interview"
  | "Borderline"
  | "Do not advance";

export type HiringDecision =
  | "Advance to interview"
  | "Hold"
  | "Do not advance";

export type StageId =
  | "discovery"
  | "requirements"
  | "recommendation"
  | "handoff";

export interface AttemptEvent {
  id: string;
  at: string;
  type: string;
  detail: string;
  source?: string;
}

export interface WorkspaceState {
  stage: StageId;
  plan: string;
  notes: string;
  versions: { at: string; body: string }[];
  constraintSeen: boolean;
  defense: string[];
  updatedAt: string;
}

export interface EvidenceItem {
  id: string;
  dimension: string;
  level: string;
  claim: string;
  excerpt: string;
  interpretation: string;
  confidence: "High" | "Medium" | "Low";
  source: string;
  timestamp: string;
  counter?: string;
  changedAfterInfo?: string;
}

export interface InterviewQuestion {
  question: string;
  reason: string;
  evidenceId: string;
  strongAnswer: string;
  unresolved: string;
}

export interface ReportDraft {
  summary: string;
  recommendation: Recommendation;
  confidence: "High" | "Medium" | "Low";
  standout: string;
  concern: string;
  worthInterviewing: string;
  supportingEvidence: string;
  changedAfterInfo: string;
  uncertainty: string;
  wouldChangeMind: string;
  evidence: EvidenceItem[];
  interviewQuestions: InterviewQuestion[];
  timeline: { time: string; title: string; detail: string }[];
  generatedFrom: "seed" | "attempt_events";
  updatedAt: string;
}

export interface ReviewerState {
  summary: string;
  recommendation: Recommendation;
  confidence: "High" | "Medium" | "Low";
  concern: string;
  worthInterviewing: string;
  supportingEvidence: string;
  changedAfterInfo: string;
  uncertainty: string;
  wouldChangeMind: string;
  notes: string;
  approved: boolean;
  approvedAt?: string;
  approvedBy?: string;
}

export interface Attempt {
  id: string;
  token: string;
  label: string;
  initials: string;
  email?: string;
  seeded: boolean;
  status: AttemptStatus;
  createdAt: string;
  openedAt?: string;
  startedAt?: string;
  submittedAt?: string;
  workspace?: WorkspaceState;
  events: AttemptEvent[];
  report?: ReportDraft;
  review?: ReviewerState;
  decision?: HiringDecision;
  decisionAt?: string;
  decisionNote?: string;
}

export interface StoreData {
  version: 1;
  roleId: "solutions-engineer";
  attempts: Attempt[];
  updatedAt: string;
}

export const statusLabel: Record<AttemptStatus, string> = {
  invited: "Invited",
  opened: "Opened",
  in_progress: "In progress",
  submitted: "Submitted",
  in_review: "In review",
  report_ready: "Brief ready",
  decision_recorded: "Decision recorded",
};
