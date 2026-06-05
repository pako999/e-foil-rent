import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /admin/signin?token=… — Route Handler that validates the token
 * and (if it matches ADMIN_TOKEN) sets the `admin_token` cookie before
 * redirecting back to /admin. This is the one place Next.js 15 allows
 * mutating cookies; the /admin page itself can only read them.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const expected = process.env.ADMIN_TOKEN;

  if (token && expected && token === expected) {
    const jar = await cookies();
    jar.set("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
  }

  return NextResponse.redirect(new URL("/admin", url.origin));
}
