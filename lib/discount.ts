import { and, eq, gt, isNull, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { discountCodes, type DiscountCode } from "@/db/schema";

/**
 * Generate a short, readable code. 8 chars from an unambiguous alphabet
 * (no 0/O, no 1/I/L). 32^8 = ~10^12 combinations, comfortably collision-
 * resistant for our volume.
 */
export function generateCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export type CodeValidation =
  | { ok: true; percentOff: number; code: string }
  | { ok: false; reason: "not_found" | "expired" | "exhausted" | "inactive" };

/**
 * Look up a code and report whether it's currently usable. Does NOT
 * increment the use counter — that happens atomically in
 * `consumeDiscountCode` after the booking row is created so a failed
 * insert doesn't burn the code.
 */
export async function validateDiscountCode(
  rawCode: string,
): Promise<CodeValidation> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, reason: "not_found" };
  const row = await db
    .select()
    .from(discountCodes)
    .where(eq(discountCodes.code, code))
    .limit(1);
  const dc = row[0];
  if (!dc) return { ok: false, reason: "not_found" };
  if (!dc.active) return { ok: false, reason: "inactive" };
  if (dc.expiresAt && dc.expiresAt.getTime() < Date.now()) {
    return { ok: false, reason: "expired" };
  }
  if (dc.usedCount >= dc.maxUses) {
    return { ok: false, reason: "exhausted" };
  }
  return { ok: true, percentOff: dc.percentOff, code: dc.code };
}

/**
 * Atomically increment the use counter. Returns true if the increment
 * succeeded, false if the code was concurrently exhausted/expired —
 * letting the caller decide whether to charge the full price or fail.
 */
export async function consumeDiscountCode(code: string): Promise<boolean> {
  const now = new Date();
  const updated = await db
    .update(discountCodes)
    .set({ usedCount: sql`${discountCodes.usedCount} + 1` })
    .where(
      and(
        eq(discountCodes.code, code),
        eq(discountCodes.active, true),
        sql`${discountCodes.usedCount} < ${discountCodes.maxUses}`,
        or(
          isNull(discountCodes.expiresAt),
          gt(discountCodes.expiresAt, now),
        ),
      ),
    )
    .returning({ code: discountCodes.code });
  return updated.length > 0;
}

export type IssuedCode = Pick<
  DiscountCode,
  "code" | "percentOff" | "expiresAt"
>;

/**
 * Issue a single-use exit-intent code (10 % off, valid 30 days). Emails
 * are unique per code so the same visitor can't farm dozens; an existing
 * unused code for that email is returned instead of creating a new row.
 */
export async function issueExitIntentCode(
  email: string,
): Promise<IssuedCode> {
  const normalized = email.trim().toLowerCase();
  // Re-issue any still-valid unused exit-intent code for this email
  // rather than spamming the table with duplicates.
  const existing = await db
    .select()
    .from(discountCodes)
    .where(
      and(
        eq(discountCodes.email, normalized),
        eq(discountCodes.source, "exit_intent"),
        eq(discountCodes.active, true),
        sql`${discountCodes.usedCount} < ${discountCodes.maxUses}`,
      ),
    )
    .limit(1);
  if (existing[0]) {
    return {
      code: existing[0].code,
      percentOff: existing[0].percentOff,
      expiresAt: existing[0].expiresAt,
    };
  }
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 30 * 86_400_000); // +30 days
  const inserted = await db
    .insert(discountCodes)
    .values({
      code,
      percentOff: 10,
      source: "exit_intent",
      email: normalized,
      expiresAt,
      maxUses: 1,
    })
    .returning();
  const row = inserted[0]!;
  return { code: row.code, percentOff: row.percentOff, expiresAt: row.expiresAt };
}
