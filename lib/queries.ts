import { and, eq, gte, lte, ne, or, isNull } from "drizzle-orm";
import { db } from "@/db";
import { boards, bookings, blockedDates } from "@/db/schema";

export async function getActiveBoards() {
  return db
    .select()
    .from(boards)
    .where(eq(boards.active, true))
    .orderBy(boards.sortOrder);
}

export async function getBoardById(id: number) {
  const rows = await db.select().from(boards).where(eq(boards.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Returns blocked + booked dates for a board within [from, to].
 * Dates are ISO YYYY-MM-DD strings.
 */
export async function getUnavailableDates(
  boardId: number,
  fromISO: string,
  toISO: string,
): Promise<string[]> {
  const [blocks, books] = await Promise.all([
    db
      .select()
      .from(blockedDates)
      .where(
        and(
          or(eq(blockedDates.boardId, boardId), isNull(blockedDates.boardId)),
          gte(blockedDates.date, fromISO),
          lte(blockedDates.date, toISO),
        ),
      ),
    db
      .select({
        startDate: bookings.startDate,
        endDate: bookings.endDate,
      })
      .from(bookings)
      .where(
        and(
          eq(bookings.boardId, boardId),
          ne(bookings.status, "cancelled"),
          lte(bookings.startDate, toISO),
          gte(bookings.endDate, fromISO),
        ),
      ),
  ]);

  const set = new Set<string>();
  for (const b of blocks) set.add(b.date);
  for (const b of books) {
    for (const d of datesBetween(b.startDate, b.endDate)) set.add(d);
  }
  return [...set].sort();
}

/**
 * Determines whether the requested range overlaps anything that would
 * block this board. Respects `unitsAvailable` for boards that represent
 * a fleet rather than a single unit.
 */
export async function isRangeAvailable(
  boardId: number,
  startISO: string,
  endISO: string,
): Promise<boolean> {
  const board = await getBoardById(boardId);
  if (!board || !board.active) return false;

  const blocks = await db
    .select()
    .from(blockedDates)
    .where(
      and(
        or(eq(blockedDates.boardId, boardId), isNull(blockedDates.boardId)),
        gte(blockedDates.date, startISO),
        lte(blockedDates.date, endISO),
      ),
    );
  if (blocks.length > 0) return false;

  const overlapping = await db
    .select({
      startDate: bookings.startDate,
      endDate: bookings.endDate,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.boardId, boardId),
        ne(bookings.status, "cancelled"),
        lte(bookings.startDate, endISO),
        gte(bookings.endDate, startISO),
      ),
    );

  if (board.unitsAvailable <= 1) return overlapping.length === 0;

  // Fleet model: count max concurrent overlaps on any single day.
  const peak = peakOverlap(overlapping, startISO, endISO);
  return peak < board.unitsAvailable;
}

function peakOverlap(
  rows: { startDate: string; endDate: string }[],
  fromISO: string,
  toISO: string,
): number {
  let peak = 0;
  for (const day of datesBetween(fromISO, toISO)) {
    let n = 0;
    for (const r of rows) {
      if (r.startDate <= day && r.endDate >= day) n++;
    }
    if (n > peak) peak = n;
  }
  return peak;
}

function datesBetween(startISO: string, endISO: string): string[] {
  const out: string[] = [];
  const start = new Date(startISO + "T00:00:00Z");
  const end = new Date(endISO + "T00:00:00Z");
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}
