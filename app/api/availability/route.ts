import { NextResponse } from "next/server";
import { availabilityQuery } from "@/lib/validations";
import { getUnavailableDates } from "@/lib/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = availabilityQuery.safeParse({
    boardId: url.searchParams.get("boardId"),
    from: url.searchParams.get("from"),
    to: url.searchParams.get("to"),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_query", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const dates = await getUnavailableDates(
    parsed.data.boardId,
    parsed.data.from,
    parsed.data.to,
  );
  return NextResponse.json({ unavailable: dates });
}
