import { NextResponse } from "next/server";
import { saveReview } from "@/lib/store";
import type { ReviewerState } from "@/lib/store/types";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const review = (await request.json()) as ReviewerState;
  const attempt = await saveReview(id, review);
  if (!attempt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ attempt });
}
