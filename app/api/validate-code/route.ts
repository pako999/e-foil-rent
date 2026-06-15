import { NextResponse } from "next/server";
import { z } from "zod";
import { validateDiscountCode } from "@/lib/discount";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ code: z.string().trim().max(40) });

/**
 * Used by the booking form's "Apply" button to preview a discount before
 * the user submits the whole reservation. Read-only — does not consume
 * the code.
 */
export async function POST(req: Request) {
  const ip = ipFromRequest(req);
  const limit = rateLimit(`code:${ip}`, 20, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_failed" }, { status: 400 });
  }

  const result = await validateDiscountCode(parsed.data.code);
  if (!result.ok) {
    return NextResponse.json({ ok: false, reason: result.reason });
  }
  return NextResponse.json({
    ok: true,
    code: result.code,
    percentOff: result.percentOff,
  });
}
