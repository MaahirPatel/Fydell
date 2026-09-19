import { NextResponse } from "next/server";
import { saveWorkspace } from "@/lib/store";
import type { WorkspaceState } from "@/lib/store/types";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const body = (await request.json()) as {
    workspace: WorkspaceState;
    event?: { type: string; detail: string };
  };
  if (!body.workspace) {
    return NextResponse.json({ error: "workspace required" }, { status: 400 });
  }
  const attempt = await saveWorkspace(token, body.workspace, body.event);
  if (!attempt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ attempt });
}
