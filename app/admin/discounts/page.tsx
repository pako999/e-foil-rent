import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { discountCodes } from "@/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function authorize() {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const jar = await cookies();
  return jar.get("admin_token")?.value === expected;
}

export default async function DiscountsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; err?: string }>;
}) {
  const sp = await searchParams;
  if (!(await authorize())) redirect("/admin");

  const rows = await db
    .select()
    .from(discountCodes)
    .orderBy(desc(discountCodes.createdAt));

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
            marginBottom: 24,
          }}
        >
          <h1 style={{ fontSize: 28, margin: 0 }}>
            Discount codes ({rows.length})
          </h1>
          <a
            href="/admin"
            style={{ fontSize: 13, color: "#555" }}
          >
            ← Back to bookings
          </a>
        </div>

        <section
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            padding: 20,
            marginBottom: 24,
            maxWidth: 720,
          }}
        >
          <h2 style={{ fontSize: 16, marginTop: 0 }}>Create a new code</h2>
          {sp.created && (
            <p style={{ color: "#15803d", fontWeight: 600 }}>
              ✓ Created code <code>{sp.created}</code>
            </p>
          )}
          {sp.err && (
            <p style={{ color: "#b91c1c", fontWeight: 600 }}>
              ✗ {sp.err}
            </p>
          )}
          <form
            method="POST"
            action="/admin/discounts/create"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
              gap: 12,
              alignItems: "end",
            }}
          >
            <div>
              <label
                htmlFor="code"
                style={{ display: "block", fontSize: 12, marginBottom: 4 }}
              >
                Code (optional)
              </label>
              <input
                id="code"
                name="code"
                placeholder="auto if blank"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: 8,
                  border: "1px solid #aaa",
                  fontFamily: "ui-monospace,monospace",
                }}
              />
            </div>
            <div>
              <label
                htmlFor="percent"
                style={{ display: "block", fontSize: 12, marginBottom: 4 }}
              >
                Percent off
              </label>
              <input
                id="percent"
                name="percent"
                type="number"
                min={1}
                max={100}
                defaultValue={10}
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: 8,
                  border: "1px solid #aaa",
                }}
              />
            </div>
            <div>
              <label
                htmlFor="maxUses"
                style={{ display: "block", fontSize: 12, marginBottom: 4 }}
              >
                Max uses
              </label>
              <input
                id="maxUses"
                name="maxUses"
                type="number"
                min={1}
                defaultValue={1}
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: 8,
                  border: "1px solid #aaa",
                }}
              />
            </div>
            <div>
              <label
                htmlFor="expiresIn"
                style={{ display: "block", fontSize: 12, marginBottom: 4 }}
              >
                Expires in (days)
              </label>
              <input
                id="expiresIn"
                name="expiresIn"
                type="number"
                min={1}
                placeholder="never"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: 8,
                  border: "1px solid #aaa",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "10px 16px",
                background: "#FFD600",
                border: "1px solid #1a1a1a",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Create
            </button>
          </form>
        </section>

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
              <th style={th}>Code</th>
              <th style={th}>%</th>
              <th style={th}>Source</th>
              <th style={th}>Email</th>
              <th style={th}>Uses</th>
              <th style={th}>Expires</th>
              <th style={th}>Active</th>
              <th style={th}>Created</th>
              <th style={th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ ...td, fontFamily: "ui-monospace,monospace" }}>
                  <strong>{r.code}</strong>
                </td>
                <td style={td}>{r.percentOff}</td>
                <td style={td}>{r.source}</td>
                <td style={td}>{r.email ?? "—"}</td>
                <td style={td}>
                  {r.usedCount} / {r.maxUses}
                </td>
                <td style={td}>
                  {r.expiresAt
                    ? new Date(r.expiresAt).toLocaleDateString("sl-SI")
                    : "never"}
                </td>
                <td style={td}>{r.active ? "✓" : "✗"}</td>
                <td style={td}>
                  {new Date(r.createdAt).toLocaleDateString("sl-SI")}
                </td>
                <td style={td}>
                  <form
                    method="POST"
                    action="/admin/discounts/toggle"
                    style={{ margin: 0 }}
                  >
                    <input type="hidden" name="code" value={r.code} />
                    <button
                      type="submit"
                      style={{
                        padding: "4px 10px",
                        background: r.active ? "#ef4444" : "#22c55e",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      {r.active ? "Disable" : "Enable"}
                    </button>
                  </form>
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
