import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const expected = process.env.ADMIN_TOKEN;
  const jar = await cookies();
  if (!expected || jar.get("admin_token")?.value !== expected) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  const form = await req.formData();
  const email = (form.get("email") as string | null)?.trim().toLowerCase();
  if (!email) {
    return NextResponse.redirect(new URL("/admin/subscribers", req.url), {
      status: 303,
    });
  }
  await db
    .update(subscribers)
    .set({
      marketingConsent: false,
      unsubscribedAt: new Date(),
    })
    .where(eq(subscribers.email, email));
  return NextResponse.redirect(new URL("/admin/subscribers", req.url), {
    status: 303,
  });
}
