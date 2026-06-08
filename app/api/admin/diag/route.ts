import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  MailerSend,
  EmailParams,
  Sender,
  Recipient,
} from "mailersend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/diag — admin-only diagnostic that reports the current
 * email configuration and (optionally) fires a test email to verify the
 * MailerSend pipeline end-to-end.
 *
 *   /api/admin/diag           — inspect config only (safe, no send)
 *   /api/admin/diag?send=1    — also fires a test email to ENQUIRY_TO_EMAIL
 */
export async function GET(req: Request) {
  const expected = process.env.ADMIN_TOKEN;
  const jar = await cookies();
  const cookieToken = jar.get("admin_token")?.value;
  if (!expected || cookieToken !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const shouldSend = url.searchParams.get("send") === "1";

  const token = process.env.MAILERSEND_API_TOKEN;
  const fromEmail =
    process.env.MAILERSEND_FROM_EMAIL ?? "bookings@e-foiling.si";
  const fromName = process.env.MAILERSEND_FROM_NAME ?? "Surf-Store E-Foil";
  const adminEmail = process.env.ENQUIRY_TO_EMAIL ?? "info@surf-store.com";

  const config = {
    MAILERSEND_API_TOKEN_present: !!token,
    MAILERSEND_API_TOKEN_starts_with: token ? token.slice(0, 6) + "…" : null,
    MAILERSEND_FROM_EMAIL: fromEmail,
    MAILERSEND_FROM_NAME: fromName,
    ENQUIRY_TO_EMAIL: adminEmail,
    NODE_ENV: process.env.NODE_ENV,
  };

  if (!shouldSend) {
    return NextResponse.json({ config, sent: false });
  }

  if (!token) {
    return NextResponse.json(
      { config, sent: false, error: "MAILERSEND_API_TOKEN missing" },
      { status: 500 },
    );
  }

  const ms = new MailerSend({ apiKey: token });
  const params = new EmailParams()
    .setFrom(new Sender(fromEmail, fromName))
    .setTo([new Recipient(adminEmail, "Admin")])
    .setSubject(`[E-Foil diag] Test email at ${new Date().toISOString()}`)
    .setHtml(
      `<p>If you can read this, MailerSend works end-to-end from Vercel.</p>
       <p>Sent at: ${new Date().toISOString()}</p>
       <p>Recipient: ${adminEmail}</p>`,
    );

  try {
    const resp = await ms.email.send(params);
    // The SDK returns a Response-shaped object; surface enough to debug.
    const respShape = {
      statusCode: (resp as { statusCode?: number })?.statusCode,
      body: (resp as { body?: unknown })?.body,
      messageId:
        (resp as { headers?: Record<string, string> })?.headers?.[
          "x-message-id"
        ] ?? null,
    };
    return NextResponse.json({ config, sent: true, mailersend: respShape });
  } catch (err) {
    const e = err as { body?: unknown; statusCode?: number; message?: string };
    return NextResponse.json(
      {
        config,
        sent: false,
        error: e?.message ?? "send failed",
        statusCode: e?.statusCode,
        body: e?.body,
      },
      { status: 502 },
    );
  }
}
