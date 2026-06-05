import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, boards } from "@/db/schema";
import { LOCATION, SITE } from "@/lib/content";
import { formatPrice } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isAdmin() {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const jar = await cookies();
  return jar.get("admin_token")?.value === expected;
}

/** Format a date as YYYYMMDD (ICS DATE value). */
function icsDate(iso: string) {
  return iso.replaceAll("-", "");
}

/** Add `days` to a YYYY-MM-DD string and return YYYYMMDD. */
function icsDateExclusive(iso: string, addDays: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + addDays);
  return d.toISOString().slice(0, 10).replaceAll("-", "");
}

/** ICS values fold long lines and escape \, ;, , and \n */
function icsEscape(s: string) {
  return s
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

/**
 * GET /api/bookings/:id/ics — returns a single-event .ics file for the
 * booking. Only callable by an authenticated admin (admin_token cookie).
 * Apple Calendar / Google Calendar / Outlook all accept this format.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    return new Response("Bad id", { status: 400 });
  }

  const rows = await db
    .select({ booking: bookings, board: boards })
    .from(bookings)
    .leftJoin(boards, eq(bookings.boardId, boards.id))
    .where(eq(bookings.id, numId))
    .limit(1);

  const row = rows[0];
  if (!row) return new Response("Not found", { status: 404 });

  const b = row.booking;
  const board = row.board;
  const total = formatPrice(b.total, "sl-SI");

  const status =
    b.status === "confirmed"
      ? "CONFIRMED"
      : b.status === "cancelled"
        ? "CANCELLED"
        : "TENTATIVE";

  const summary = icsEscape(
    `E-Foil ${b.bookingType.replace("_", " + ")} — ${b.customerName}`,
  );
  const description = icsEscape(
    [
      `${board?.name ?? "Duotone Foil Cruise Set AL"}`,
      `${b.days} dan(i) · ${total}`,
      `Tip: ${b.bookingType.replace("_", " + ")} · Raven: ${b.experienceLevel}`,
      ``,
      `Kontakt:`,
      `${b.customerName}`,
      `${b.email}`,
      `${b.phone}`,
      b.notes ? `\nOpombe: ${b.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const uid = `booking-${b.id}@e-foiling.si`;
  const dtStart = icsDate(b.startDate);
  // DTEND is exclusive in ICS — add 1 day to make a YYYY-MM-DD..YYYY-MM-DD
  // booking display as an all-day range covering both endpoints.
  const dtEnd = icsDateExclusive(b.endDate, 1);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Surf-Store E-Foil//SI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${icsEscape(LOCATION.address)}`,
    `STATUS:${status}`,
    `ORGANIZER;CN=${icsEscape(SITE.operator)}:mailto:${SITE.contactEmail}`,
    `ATTENDEE;CN=${icsEscape(b.customerName)};RSVP=FALSE:mailto:${b.email}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="booking-${b.id}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
