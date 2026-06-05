import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const jar = await cookies();
  jar.delete("admin_token");
  return NextResponse.redirect(new URL("/admin", url.origin), { status: 303 });
}
