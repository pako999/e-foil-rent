import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { issueExitIntentCode } from "@/lib/discount";
import { sendDiscountCodeEmail } from "@/lib/email";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email().max(200),
  locale: z.enum(["sl", "en", "de"]).optional(),
  // Explicit GDPR opt-in for marketing emails. The transactional
  // discount code goes out regardless (it's what they asked for), but
  // we only add them to the marketing list when this is true.
  marketingConsent: z.boolean().optional(),
  // Honeypot — bots fill this, humans never see it.
  website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const ip = ipFromRequest(req);
  // Stricter than booking: 3 attempts / 10 min so a bot can't farm codes.
  const limit = rateLimit(`subscribe:${ip}`, 3, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(limit.resetMs / 1000)) },
      },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Silent honeypot acceptance — don't tell bots they were detected.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase();
  const marketingConsent = parsed.data.marketingConsent === true;
  const now = new Date();

  // Upsert the subscriber row. We never silently flip an existing opt-in
  // back to opt-out: if the user previously consented, that consent
  // stands until they unsubscribe (handled in /api/unsubscribe). Same
  // story in reverse — a later opt-in upgrades the row.
  try {
    await db
      .insert(subscribers)
      .values({
        email: normalizedEmail,
        marketingConsent,
        consentSource: "exit_intent",
        consentedAt: marketingConsent ? now : null,
        locale: parsed.data.locale ?? null,
      })
      .onConflictDoUpdate({
        target: subscribers.email,
        set: {
          marketingConsent: sql`${subscribers.marketingConsent} OR ${marketingConsent}`,
          consentedAt: marketingConsent
            ? sql`COALESCE(${subscribers.consentedAt}, ${now})`
            : subscribers.consentedAt,
          consentSource: sql`COALESCE(${subscribers.consentSource}, 'exit_intent')`,
          locale: sql`COALESCE(${subscribers.locale}, ${parsed.data.locale ?? null})`,
          // If they're resubscribing, clear the unsubscribe stamp.
          unsubscribedAt: marketingConsent ? null : subscribers.unsubscribedAt,
        },
      });
  } catch (err) {
    console.error("[subscribe] subscriber upsert failed", err);
  }

  const issued = await issueExitIntentCode(parsed.data.email);
  try {
    await sendDiscountCodeEmail({
      email: parsed.data.email,
      code: issued.code,
      percentOff: issued.percentOff,
      expiresAt: issued.expiresAt,
      locale: parsed.data.locale ?? "sl",
    });
  } catch (err) {
    console.error("[subscribe] email send failed", err);
    return NextResponse.json(
      { error: "email_failed", detail: (err as Error)?.message ?? String(err) },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
