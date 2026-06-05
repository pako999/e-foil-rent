import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, boards } from "@/db/schema";
import { statusUpdate } from "@/lib/validations";
import { sendApprovalEmail, sendCancellationEmail } from "@/lib/email";
import { createProforma } from "@/lib/eracuni";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthed(req: Request, cookieToken: string | undefined) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const header = req.headers.get("x-admin-token");
  return header === expected || cookieToken === expected;
}

/**
 * Heuristic: re-derive the locale the customer saw when they booked from
 * the notes prefix the form leaves, or default to Slovenian. Falls back
 * to "sl" when nothing matches.
 */
function pickLocale(notes: string | null): "sl" | "en" {
  if (notes && /\[Package:/.test(notes)) {
    // existing fall-through, no language hint in the prefix
  }
  return "sl";
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieToken = (await cookies()).get("admin_token")?.value;
  if (!isAuthed(req, cookieToken)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = statusUpdate.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_failed" }, { status: 400 });
  }

  const updated = await db
    .update(bookings)
    .set({ status: parsed.data.status })
    .where(eq(bookings.id, numId))
    .returning();

  if (updated.length === 0) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const booking = updated[0]!;

  // Fire customer notification + proforma based on the new status.
  // All fire-and-forget so the admin click responds instantly.
  if (
    parsed.data.status === "confirmed" ||
    parsed.data.status === "cancelled"
  ) {
    const boardRows = await db
      .select()
      .from(boards)
      .where(eq(boards.id, booking.boardId))
      .limit(1);
    const board = boardRows[0];
    if (board) {
      const locale = pickLocale(booking.notes);

      if (parsed.data.status === "confirmed") {
        // Create proforma first (so we can attach the PDF), then email.
        void (async () => {
          try {
            const proforma = await createProforma({ booking, board });
            await sendApprovalEmail({
              booking,
              board,
              locale,
              proforma: proforma ?? undefined,
            });
          } catch (err) {
            console.error("[status] approval flow failed", err);
          }
        })();
      } else {
        void sendCancellationEmail({ booking, board, locale }).catch((err) =>
          console.error("[status] cancellation email failed", err),
        );
      }
    }
  }

  return NextResponse.json({ ok: true, booking });
}
