import type {
  Attempt,
  AttemptEvent,
  ReportDraft,
  WorkspaceState,
} from "@/lib/store/types";

function stamp() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildEvent(
  type: string,
  detail: string,
  source?: string,
): AttemptEvent {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: stamp(),
    type,
    detail,
    source,
  };
}

export function generateReportFromAttempt(attempt: Attempt): ReportDraft {
  const workspace = attempt.workspace;
  const constraintSeen = Boolean(workspace?.constraintSeen);
  const plan = workspace?.plan ?? "";
  const revised =
    constraintSeen &&
    (/sandbox/i.test(plan) || /sign-off|sign off/i.test(plan)) &&
    !/parallel with production/i.test(plan);
  const keptParallel =
    constraintSeen && /parallel/i.test(plan) && !/sandbox tenant only/i.test(plan);
  const defenseFilled = (workspace?.defense ?? []).filter((d) => d.trim()).length;
  const versionCount = workspace?.versions?.length ?? 1;

  let recommendation: ReportDraft["recommendation"] = "Borderline";
  let confidence: ReportDraft["confidence"] = "Medium";

  if (!constraintSeen) {
    recommendation = "Borderline";
    confidence = "Low";
  } else if (revised && defenseFilled >= 1) {
    recommendation = "Strong interview";
    confidence = "High";
  } else if (keptParallel || (!revised && constraintSeen)) {
    recommendation =
      versionCount <= 1 && defenseFilled === 0
        ? "Do not advance"
        : "Borderline";
    confidence = "High";
  }

  const planExcerpt = plan
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4)
    .join(" ");

  const evidence: ReportDraft["evidence"] = [
    {
      id: "recorded-discovery",
      dimension: "Discovery judgment",
      level: workspace?.notes?.toLowerCase().includes("unverified")
        ? "Strong"
        : "Moderate",
      claim: workspace?.notes?.trim()
        ? "Working notes captured discovery hypotheses during the session."
        : "Opened the engagement brief and Acme thread.",
      excerpt: (workspace?.notes || "No working notes saved.").slice(0, 280),
      interpretation:
        "Notes and stage progress are recorded from the candidate session.",
      confidence: workspace?.notes?.trim() ? "Medium" : "Low",
      source: "Working notes",
      timestamp: workspace?.updatedAt?.slice(11, 16) ?? stamp(),
    },
    {
      id: "recorded-adaptation",
      dimension: "Adaptation",
      level: revised ? "Exceptional" : constraintSeen ? "Limited" : "Moderate",
      claim: constraintSeen
        ? revised
          ? "Revised the rollout after the security constraint blocked production access."
          : "Received the security constraint without a clear sandbox-first revision."
        : "No constraint event was delivered before submit.",
      excerpt: planExcerpt || "No plan text recorded.",
      interpretation: revised
        ? "Plan language moved toward sandbox sequencing and post-sign-off production."
        : "Adaptation signal depends on whether the plan changed after the constraint.",
      confidence: constraintSeen ? "High" : "Low",
      source: `rollout_plan.md · ${versionCount} version(s)`,
      timestamp: stamp(),
      counter: constraintSeen
        ? "Security lead: production access cannot be granted before the review closes."
        : undefined,
      changedAfterInfo: constraintSeen
        ? revised
          ? "After the constraint, the candidate revised toward sandbox-first sequencing."
          : "After the constraint, the plan did not clearly sequence behind security sign-off."
        : "Constraint was not delivered in this session.",
    },
  ];

  if (defenseFilled > 0) {
    evidence.push({
      id: "recorded-defense",
      dimension: "Technical translation",
      level: defenseFilled >= 2 ? "Strong" : "Moderate",
      claim: "Answered defense questions from the submitted plan.",
      excerpt: (workspace?.defense ?? []).filter(Boolean).join(" · ").slice(0, 280),
      interpretation:
        "Defense answers are recorded verbatim from the candidate handoff stage.",
      confidence: "Medium",
      source: "Defense responses",
      timestamp: stamp(),
    });
  }

  const timeline = attempt.events.slice(-8).map((event) => ({
    time: event.at,
    title: event.type.replace(/_/g, " "),
    detail: event.detail,
  }));

  const interviewQuestions =
    recommendation === "Do not advance"
      ? []
      : [
          {
            question:
              "Production access is blocked until security signs off. Walk me through how you would re-sequence the plan you submitted.",
            reason: "Tests whether the recorded plan change (or lack of one) repeats under live pressure.",
            evidenceId: "recorded-adaptation",
            strongAnswer:
              "Moves production after sign-off and names sandbox value during the wait.",
            unresolved:
              "Whether sequencing judgment holds without a prompted constraint button.",
          },
          {
            question:
              "How do you validate an executive sponsor’s adoption claim before sizing the first cohort?",
            reason: "Commercial uncertainty usually remains after a single simulation.",
            evidenceId: "recorded-discovery",
            strongAnswer:
              "Names a concrete usage check and a fallback when data is unavailable.",
            unresolved: "Adoption claims may still be sponsor narrative.",
          },
        ];

  return {
    summary: [
      `${attempt.label} submitted the Acme Solutions Engineer simulation.`,
      constraintSeen
        ? revised
          ? "After the six-week security constraint, the rollout plan moved toward sandbox-first sequencing."
          : "A security constraint was delivered; the recorded plan did not clearly sequence production behind sign-off."
        : "The session was submitted without delivering the security constraint event.",
      defenseFilled
        ? `${defenseFilled} defense answer(s) were recorded.`
        : "No defense answers were recorded.",
      `Draft recommendation: ${recommendation}.`,
    ].join(" "),
    recommendation,
    confidence,
    standout: revised
      ? "Sandbox-first revision after constraint"
      : constraintSeen
        ? "Constraint acknowledged"
        : "Session completed",
    concern: revised
      ? "Adoption assumptions may still be unverified"
      : constraintSeen
        ? "Sequencing after the security block is unclear"
        : "Constraint adaptation was not observed",
    worthInterviewing:
      recommendation === "Strong interview"
        ? "Yes — recorded actions show adaptation after a consequential constraint. Interview to pressure-test remaining uncertainty."
        : recommendation === "Borderline"
          ? "Maybe — only if you can live-probe the weak adaptation or missing constraint response."
          : "No — recorded actions do not show the adaptation this role requires.",
    supportingEvidence: evidence
      .map((item) => `${item.dimension}: ${item.claim}`)
      .join(" "),
    changedAfterInfo:
      evidence.find((item) => item.id === "recorded-adaptation")
        ?.changedAfterInfo ?? "No constraint change observed.",
    uncertainty: revised
      ? "Weekly adoption and cohort sizing may still rest on unverified sponsor claims."
      : "Primary uncertainty is whether the candidate revises when reality blocks the original plan.",
    wouldChangeMind:
      recommendation === "Do not advance"
        ? "A clear post-constraint revision that sequences production behind security sign-off."
        : "Verified adoption telemetry that breaks the cohort thesis, or another hard blocker disclosed late.",
    evidence,
    interviewQuestions,
    timeline:
      timeline.length > 0
        ? timeline
        : [
            {
              time: stamp(),
              title: "submitted",
              detail: "Candidate submitted the simulation.",
            },
          ],
    generatedFrom: "attempt_events",
    updatedAt: new Date().toISOString(),
  };
}

export function defaultWorkspace(): WorkspaceState {
  return {
    stage: "discovery",
    plan: `## Rollout

- Launch all 1,200 seats in a single production cutover at week six.
- The authentication security review can run in parallel with production access.
- Phase one can support early users while remaining business units prepare.
- Adoption risk should remain low because the sponsor reports strong weekly usage.
`,
    notes: "",
    versions: [
      {
        at: "Start",
        body: `## Rollout

- Launch all 1,200 seats in a single production cutover at week six.
- The authentication security review can run in parallel with production access.
- Phase one can support early users while remaining business units prepare.
- Adoption risk should remain low because the sponsor reports strong weekly usage.
`,
      },
    ],
    constraintSeen: false,
    defense: ["", "", ""],
    updatedAt: new Date().toISOString(),
  };
}
