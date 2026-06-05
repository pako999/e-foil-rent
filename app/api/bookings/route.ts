import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { bookingInput } from "@/lib/validations";
import { getBoardById, isRangeAvailable } from "@/lib/queries";
import { inclusiveDays, quote, packageById } from "@/lib/pricing";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";
import { sendBookingEmails } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = ipFromRequest(req);
  const limit = rateLimit(`booking:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetMs / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = bookingInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Honeypot: bots fill `website`. Accept silently to avoid telling them why.
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true, id: 0 });
  }

  const board = await getBoardById(data.boardId);
  if (!board || !board.active) {
    return NextResponse.json({ error: "board_unavailable" }, { status: 400 });
  }

  const available = await isRangeAvailable(
    data.boardId,
    data.startDate,
    data.endDate,
  );
  if (!available) {
    return NextResponse.json({ error: "dates_unavailable" }, { status: 409 });
  }

  const days = inclusiveDays(data.startDate, data.endDate);
  if (days < 1) {
    return NextResponse.json({ error: "invalid_range" }, { status: 400 });
  }

  // Server-authoritative price calc — never trust the client total.
  // Fixed-price packages (weekend, 2-week promo) override the day ladder
  // ONLY when the booked range actually matches the package's day count.
  const pkg = data.packageId ? packageById(data.packageId) : undefined;
  const baseQuote = quote({
    days,
    dailyPrice: board.dailyPrice,
    weeklyPrice: board.weeklyPrice,
  });
  const useFixed =
    pkg?.fixedTotal !== undefined && pkg.days === days;
  const q = useFixed
    ? {
        ...baseQuote,
        subtotal: pkg!.fixedTotal!,
        discount: 0,
        total: pkg!.fixedTotal!,
        discountPct: 0,
      }
    : baseQuote;

  const inserted = await db
    .insert(bookings)
    .values({
      boardId: board.id,
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      startDate: data.startDate,
      endDate: data.endDate,
      days,
      experienceLevel: data.experienceLevel,
      bookingType: data.bookingType,
      subtotal: q.subtotal,
      discount: q.discount,
      total: q.total,
      status: "pending",
      notes: data.notes ?? null,
    })
    .returning();

  const booking = inserted[0]!;

  const locale = pickLocale(req);
  // Await — on Vercel serverless `void`/fire-and-forget tasks can get
  // killed before they finish, especially on cold starts. ~500 ms delay
  // for the customer is fine; reliable email is the priority.
  try {
    await sendBookingEmails({ booking, board, locale });
  } catch (err) {
    console.error("[email] send failed", err);
  }

  return NextResponse.json({
    ok: true,
    id: booking.id,
    quote: q,
  });
}

function pickLocale(req: Request): "sl" | "en" {
  const ref = req.headers.get("referer") ?? "";
  if (ref.includes("/en")) return "en";
  return "sl";
}
