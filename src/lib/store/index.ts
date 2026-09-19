import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { buildSeedStore } from "@/lib/store/seed";
import {
  buildEvent,
  defaultWorkspace,
  generateReportFromAttempt,
} from "@/lib/store/report-from-attempt";
import type {
  Attempt,
  HiringDecision,
  ReviewerState,
  StoreData,
  WorkspaceState,
} from "@/lib/store/types";

function dataDir() {
  if (process.env.FYDELL_DATA_DIR) return process.env.FYDELL_DATA_DIR;
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "fydell-data");
  }
  return path.join(process.cwd(), ".data");
}

function storePath() {
  return path.join(dataDir(), "attempts.json");
}

let writeChain: Promise<unknown> = Promise.resolve();

async function ensureDir() {
  await fs.mkdir(dataDir(), { recursive: true });
}

async function readStore(): Promise<StoreData> {
  await ensureDir();
  try {
    const raw = await fs.readFile(storePath(), "utf8");
    const parsed = JSON.parse(raw) as StoreData;
    if (!parsed?.attempts?.length) return buildSeedStore();
    return parsed;
  } catch {
    const seed = buildSeedStore();
    await writeStore(seed);
    return seed;
  }
}

async function writeStore(data: StoreData) {
  await ensureDir();
  const next = { ...data, updatedAt: new Date().toISOString() };
  const tmp = `${storePath()}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
  await fs.rename(tmp, storePath());
  return next;
}

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function newToken() {
  return randomBytes(12).toString("hex");
}

function nextLiveLabel(attempts: Attempt[]) {
  const liveCount = attempts.filter((a) => !a.seeded).length + 1;
  return `Invite ${liveCount}`;
}

export async function listAttempts() {
  const store = await readStore();
  return store.attempts;
}

export async function getAttempt(id: string) {
  const store = await readStore();
  return store.attempts.find((attempt) => attempt.id === id) ?? null;
}

export async function getAttemptByToken(token: string) {
  const store = await readStore();
  return store.attempts.find((attempt) => attempt.token === token) ?? null;
}

export async function createInvite(input: {
  email?: string;
  label?: string;
}) {
  return withLock(async () => {
    const store = await readStore();
    const id = `invite-${Date.now().toString(36)}`;
    const label = input.label?.trim() || nextLiveLabel(store.attempts);
    const initials = label
      .split(/\s+/)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "IN";
    const attempt: Attempt = {
      id,
      token: newToken(),
      label,
      initials,
      email: input.email?.trim() || undefined,
      seeded: false,
      status: "invited",
      createdAt: new Date().toISOString(),
      events: [
        buildEvent(
          "invited",
          `Invitation created${input.email ? ` for ${input.email}` : ""}.`,
        ),
      ],
      workspace: defaultWorkspace(),
    };
    store.attempts = [attempt, ...store.attempts];
    await writeStore(store);
    return attempt;
  });
}

export async function markOpened(token: string) {
  return withLock(async () => {
    const store = await readStore();
    const attempt = store.attempts.find((row) => row.token === token);
    if (!attempt) return null;
    if (attempt.status === "invited") {
      attempt.status = "opened";
      attempt.openedAt = new Date().toISOString();
      attempt.events.push(buildEvent("opened", "Candidate opened the private link."));
    }
    await writeStore(store);
    return attempt;
  });
}

export async function saveWorkspace(
  token: string,
  workspace: WorkspaceState,
  event?: { type: string; detail: string },
) {
  return withLock(async () => {
    const store = await readStore();
    const attempt = store.attempts.find((row) => row.token === token);
    if (!attempt) return null;
    if (
      attempt.status === "invited" ||
      attempt.status === "opened" ||
      attempt.status === "in_progress"
    ) {
      if (!attempt.startedAt) attempt.startedAt = new Date().toISOString();
      attempt.status = "in_progress";
    }
    attempt.workspace = { ...workspace, updatedAt: new Date().toISOString() };
    if (event) {
      attempt.events.push(buildEvent(event.type, event.detail));
    }
    await writeStore(store);
    return attempt;
  });
}

export async function submitAttempt(token: string) {
  return withLock(async () => {
    const store = await readStore();
    const attempt = store.attempts.find((row) => row.token === token);
    if (!attempt) return null;
    if (!attempt.workspace) attempt.workspace = defaultWorkspace();
    attempt.events.push(buildEvent("submitted", "Candidate submitted the simulation."));
    attempt.submittedAt = new Date().toISOString();
    attempt.status = "submitted";
    const report = generateReportFromAttempt(attempt);
    attempt.report = report;
    attempt.review = {
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
      approved: false,
    };
    attempt.status = "in_review";
    await writeStore(store);
    return attempt;
  });
}

export async function saveReview(id: string, review: ReviewerState) {
  return withLock(async () => {
    const store = await readStore();
    const attempt = store.attempts.find((row) => row.id === id);
    if (!attempt?.report) return null;
    attempt.review = {
      ...review,
      approvedAt: review.approved
        ? review.approvedAt ?? new Date().toISOString()
        : undefined,
      approvedBy: review.approved ? review.approvedBy ?? "K. Patel" : undefined,
    };
    if (attempt.report) {
      attempt.report = {
        ...attempt.report,
        summary: review.summary,
        recommendation: review.recommendation,
        confidence: review.confidence,
        concern: review.concern,
        worthInterviewing: review.worthInterviewing,
        supportingEvidence: review.supportingEvidence,
        changedAfterInfo: review.changedAfterInfo,
        uncertainty: review.uncertainty,
        wouldChangeMind: review.wouldChangeMind,
        updatedAt: new Date().toISOString(),
      };
    }
    attempt.status = review.approved ? "report_ready" : "in_review";
    attempt.events.push(
      buildEvent(
        review.approved ? "review_approved" : "review_saved",
        review.approved
          ? "Reviewer approved conclusions for the final brief."
          : "Reviewer saved edited conclusions.",
      ),
    );
    await writeStore(store);
    return attempt;
  });
}

export async function recordDecision(
  id: string,
  decision: HiringDecision,
  note?: string,
) {
  return withLock(async () => {
    const store = await readStore();
    const attempt = store.attempts.find((row) => row.id === id);
    if (!attempt) return null;
    attempt.decision = decision;
    attempt.decisionAt = new Date().toISOString();
    attempt.decisionNote = note?.trim() || undefined;
    attempt.status = "decision_recorded";
    attempt.events.push(
      buildEvent("decision_recorded", `Hiring decision recorded: ${decision}.`),
    );
    await writeStore(store);
    return attempt;
  });
}

export async function resetStore() {
  return withLock(async () => {
    const seed = buildSeedStore();
    await writeStore(seed);
    return seed;
  });
}
