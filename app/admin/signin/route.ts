import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sign-in entry. Two modes:
 *   GET  /admin/signin?token=…    — legacy bookmarkable link
 *   POST /admin/signin            — form submit from the login page
 *
 * Both validate the supplied token against `ADMIN_TOKEN` and, on match,
 * set the `admin_token` cookie (30 days) before redirecting back to
 * /admin. Mismatches redirect to /admin?err=1 so the page can highlight
 * the error.
 */

async function authenticate(token: string | null, origin: string) {
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
    return NextResponse.redirect(new URL("/admin", origin));
  }
  return NextResponse.redirect(new URL("/admin?err=1", origin));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  return authenticate(url.searchParams.get("token"), url.origin);
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const form = await req.formData();
  const token = form.get("token");
  return authenticate(typeof token === "string" ? token : null, url.origin);
}
