import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function authorize() {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const jar = await cookies();
  return jar.get("admin_token")?.value === expected;
}

export default async function SubscribersPage() {
  if (!(await authorize())) redirect("/admin");

  const rows = await db
    .select()
    .from(subscribers)
    .orderBy(desc(subscribers.createdAt));

  const consented = rows.filter((r) => r.marketingConsent && !r.unsubscribedAt);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "ui-sans-serif, system-ui",
          padding: 24,
          background: "#fafafa",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 16,
          }}
        >
          <h1 style={{ fontSize: 28, margin: 0 }}>
            Subscribers ({rows.length} total, {consented.length} opted in)
          </h1>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a
              href="/admin/subscribers/export"
              style={{
                fontSize: 13,
                padding: "6px 12px",
                background: "#FFD600",
                border: "1px solid #1a1a1a",
                color: "#1a1a1a",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Export CSV (opt-in only) ↓
            </a>
            <a href="/admin" style={{ fontSize: 13, color: "#555" }}>
              ← Back to bookings
            </a>
          </div>
        </div>

        <p style={{ color: "#555", fontSize: 13, marginBottom: 16 }}>
          The CSV export contains only rows with explicit marketing consent
          that have not been unsubscribed. Safe to import into any newsletter
          tool (Mailchimp, Brevo, MailerSend campaigns, …).
        </p>

        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            background: "#fff",
          }}
        >
          <thead>
            <tr
              style={{ background: "#0a0e1a", color: "#fff", textAlign: "left" }}
            >
              <th style={th}>Email</th>
              <th style={th}>Consent</th>
              <th style={th}>Source</th>
              <th style={th}>Locale</th>
              <th style={th}>Consented at</th>
              <th style={th}>Unsubscribed</th>
              <th style={th}>Created</th>
              <th style={th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ ...td, fontFamily: "ui-monospace,monospace" }}>
                  {r.email}
                </td>
                <td style={td}>
                  {r.marketingConsent && !r.unsubscribedAt ? (
                    <span style={{ color: "#15803d", fontWeight: 700 }}>
                      ✓ opted in
                    </span>
                  ) : r.unsubscribedAt ? (
                    <span style={{ color: "#9ca3af" }}>unsubscribed</span>
                  ) : (
                    <span style={{ color: "#9ca3af" }}>declined</span>
                  )}
                </td>
                <td style={td}>{r.consentSource ?? "—"}</td>
                <td style={td}>{r.locale ?? "—"}</td>
                <td style={td}>
                  {r.consentedAt
                    ? new Date(r.consentedAt).toLocaleDateString("sl-SI")
                    : "—"}
                </td>
                <td style={td}>
                  {r.unsubscribedAt
                    ? new Date(r.unsubscribedAt).toLocaleDateString("sl-SI")
                    : "—"}
                </td>
                <td style={td}>
                  {new Date(r.createdAt).toLocaleDateString("sl-SI")}
                </td>
                <td style={td}>
                  {!r.unsubscribedAt && r.marketingConsent && (
                    <form
                      method="POST"
                      action="/admin/subscribers/unsubscribe"
                      style={{ margin: 0 }}
                    >
                      <input type="hidden" name="email" value={r.email} />
                      <button
                        type="submit"
                        style={{
                          padding: "4px 10px",
                          background: "#ef4444",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      >
                        Unsubscribe
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </body>
    </html>
  );
}

const th: React.CSSProperties = {
  padding: "10px 12px",
  fontWeight: 700,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};
const td: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: 13,
};
