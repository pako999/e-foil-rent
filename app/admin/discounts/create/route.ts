import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { discountCodes } from "@/db/schema";
import { generateCode } from "@/lib/discount";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorized() {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const jar = await cookies();
  return jar.get("admin_token")?.value === expected;
}

export async function POST(req: Request) {
  if (!(await authorized())) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  const form = await req.formData();
  const codeRaw = (form.get("code") as string | null)?.trim().toUpperCase();
  const percent = Number(form.get("percent"));
  const maxUses = Number(form.get("maxUses"));
  const expiresInDays = form.get("expiresIn")
    ? Number(form.get("expiresIn"))
    : null;

  const code = codeRaw && codeRaw.length > 0 ? codeRaw : generateCode();

  if (!Number.isFinite(percent) || percent < 1 || percent > 100) {
    return NextResponse.redirect(
      new URL("/admin/discounts?err=bad+percent", req.url),
      { status: 303 },
    );
  }
  if (!Number.isFinite(maxUses) || maxUses < 1) {
    return NextResponse.redirect(
      new URL("/admin/discounts?err=bad+max+uses", req.url),
      { status: 303 },
    );
  }
  const expiresAt =
    expiresInDays && Number.isFinite(expiresInDays) && expiresInDays > 0
      ? new Date(Date.now() + expiresInDays * 86_400_000)
      : null;

  try {
    await db.insert(discountCodes).values({
      code,
      percentOff: percent,
      source: "admin",
      maxUses,
      expiresAt,
    });
  } catch (err) {
    return NextResponse.redirect(
      new URL(
        `/admin/discounts?err=${encodeURIComponent((err as Error).message)}`,
        req.url,
      ),
      { status: 303 },
    );
  }

  return NextResponse.redirect(
    new URL(`/admin/discounts?created=${encodeURIComponent(code)}`, req.url),
    { status: 303 },
  );
}
