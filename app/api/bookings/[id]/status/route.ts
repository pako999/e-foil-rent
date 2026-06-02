import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { statusUpdate } from "@/lib/validations";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthed(req: Request, cookieToken: string | undefined) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const header = req.headers.get("x-admin-token");
  return header === expected || cookieToken === expected;
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
  return NextResponse.json({ ok: true, booking: updated[0] });
}
