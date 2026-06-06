import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const expected = process.env.ADMIN_TOKEN;
  const jar = await cookies();
  if (!expected || jar.get("admin_token")?.value !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(subscribers)
    .where(
      and(
        eq(subscribers.marketingConsent, true),
        isNull(subscribers.unsubscribedAt),
      ),
    )
    .orderBy(desc(subscribers.createdAt));

  // Standard CSV with quoted email field — every newsletter platform
  // accepts this shape. UTF-8 BOM so Excel doesn't mangle accents.
  const header = "email,locale,consented_at,consent_source\n";
  const body = rows
    .map((r) =>
      [
        `"${r.email.replace(/"/g, '""')}"`,
        r.locale ?? "",
        r.consentedAt ? r.consentedAt.toISOString() : "",
        r.consentSource ?? "",
      ].join(","),
    )
    .join("\n");
  const csv = "﻿" + header + body + "\n";

  const today = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${today}.csv"`,
    },
  });
}
