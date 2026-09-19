import { notFound } from "next/navigation";
import { SimulationWorkspace } from "@/components/simulation-workspace";
import { getAttemptByToken, markOpened } from "@/lib/store";
import { defaultWorkspace } from "@/lib/store/report-from-attempt";

export const dynamic = "force-dynamic";

export default async function CandidateWorkspacePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const existing = await getAttemptByToken(token);
  if (!existing) notFound();
  const attempt = (await markOpened(token)) ?? existing;
  if (!attempt.workspace) {
    attempt.workspace = defaultWorkspace();
  }
  return <SimulationWorkspace token={token} initialAttempt={attempt} />;
}
