import { NextResponse } from "next/server";
import { recordDecision } from "@/lib/store";
import type { HiringDecision } from "@/lib/store/types";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json()) as {
    decision: HiringDecision;
    note?: string;
  };
  if (!body.decision) {
    return NextResponse.json({ error: "decision required" }, { status: 400 });
  }
  const attempt = await recordDecision(id, body.decision, body.note);
  if (!attempt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ attempt });
}
