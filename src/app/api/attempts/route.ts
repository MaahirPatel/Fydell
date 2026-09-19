import { NextResponse } from "next/server";
import { createInvite, listAttempts } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const attempts = await listAttempts();
  return NextResponse.json({ attempts });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    label?: string;
  };
  const attempt = await createInvite({
    email: body.email,
    label: body.label,
  });
  return NextResponse.json({ attempt }, { status: 201 });
}
