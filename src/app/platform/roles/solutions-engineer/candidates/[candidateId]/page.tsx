import { notFound } from "next/navigation";
import { EvidenceReport } from "@/components/evidence-report";
import { getAttempt } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function CandidateBrief({
  params,
}: {
  params: Promise<{ candidateId: string }>;
}) {
  const { candidateId } = await params;
  const attempt = await getAttempt(candidateId);
  if (!attempt) notFound();
  if (
    !attempt.report &&
    attempt.status !== "submitted" &&
    attempt.status !== "in_review" &&
    attempt.status !== "report_ready" &&
    attempt.status !== "decision_recorded"
  ) {
    notFound();
  }
  return <EvidenceReport attempt={attempt} />;
}
