import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { discountCodes } from "@/db/schema";

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
  const code = (form.get("code") as string | null)?.trim().toUpperCase();
  if (!code) {
    return NextResponse.redirect(new URL("/admin/discounts", req.url), {
      status: 303,
    });
  }
  await db
    .update(discountCodes)
    .set({ active: sql`NOT ${discountCodes.active}` })
    .where(eq(discountCodes.code, code));
  return NextResponse.redirect(new URL("/admin/discounts", req.url), {
    status: 303,
  });
}
