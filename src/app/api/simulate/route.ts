import { NextRequest, NextResponse } from "next/server";
import { simulate, type Duration, type PropertyType, type Situation } from "@/lib/calc";

const ALLOWED_DURATIONS: Duration[] = [10, 15, 20, 25];

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const netMonthly = Number(body.netMonthly);
  const duration = Number(body.duration);

  if (!Number.isFinite(netMonthly) || netMonthly <= 0) {
    return NextResponse.json(
      { error: "`netMonthly` must be a positive number" },
      { status: 400 }
    );
  }
  if (!ALLOWED_DURATIONS.includes(duration as Duration)) {
    return NextResponse.json(
      { error: `\`duration\` must be one of ${ALLOWED_DURATIONS.join(", ")}` },
      { status: 400 }
    );
  }

  const result = simulate({
    netMonthly,
    duration: duration as Duration,
    charges: body.charges == null ? 0 : Number(body.charges),
    apport: body.apport == null ? 0 : Number(body.apport),
    propertyType: body.propertyType === "a" ? "a" : "p",
    kids: body.kids == null ? 0 : Number(body.kids),
    situation: body.situation === "p" ? ("p" as Situation) : ("l" as Situation),
  });

  return NextResponse.json(result);
}
