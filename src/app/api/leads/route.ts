import { NextRequest, NextResponse } from "next/server";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  capacity?: number;
  createdAt: string;
}

const leads: Lead[] = [];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  return NextResponse.json({ count: leads.length });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : undefined;
  const capacity =
    body.capacity == null ? undefined : Number(body.capacity);

  if (!name) {
    return NextResponse.json({ error: "`name` is required" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "`email` is invalid" }, { status: 400 });
  }

  const lead: Lead = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    email,
    phone,
    capacity,
    createdAt: new Date().toISOString(),
  };
  leads.push(lead);

  console.log("[lead] received", { id: lead.id, email: lead.email });

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}
