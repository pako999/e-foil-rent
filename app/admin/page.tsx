import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { bookings, boards } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { formatPrice } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function authorize() {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const jar = await cookies();
  const tokenCookie = jar.get("admin_token")?.value;
  return tokenCookie === expected;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  // Backwards-compat: old bookmarks of `/admin?token=…` are forwarded to
  // the Route Handler that actually mutates the cookie. Next 15 forbids
  // cookie writes from Server Components, so we can't do it here.
  if (token) {
    redirect(`/admin/signin?token=${encodeURIComponent(token)}`);
  }

  if (!(await authorize())) {
    return (
      <html lang="en">
        <body style={{ fontFamily: "sans-serif", padding: 48 }}>
          <h1>Admin — locked</h1>
          <p>
            Append <code>/signin?token=YOUR_ADMIN_TOKEN</code> to this URL
            (i.e. <code>/admin/signin?token=…</code>) to sign in. The token
            is set via <code>ADMIN_TOKEN</code> in environment.
          </p>
        </body>
      </html>
    );
  }

  const rows = await db
    .select({
      booking: bookings,
      board: boards,
    })
    .from(bookings)
    .leftJoin(boards, eq(bookings.boardId, boards.id))
    .orderBy(desc(bookings.createdAt))
    .limit(200);

  return (
    <html lang="en">
      <body style={{ fontFamily: "ui-sans-serif, system-ui", padding: 24, background: "#fafafa" }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Bookings ({rows.length})</h1>
        <p style={{ color: "#555", fontSize: 13, marginBottom: 24 }}>
          Stopgap admin — replace with Clerk + a proper UI before going public.
        </p>
        <table style={{ borderCollapse: "collapse", width: "100%", background: "#fff" }}>
          <thead>
            <tr style={{ background: "#0a0e1a", color: "#fff", textAlign: "left" }}>
              <th style={th}>ID</th>
              <th style={th}>Customer</th>
              <th style={th}>Board</th>
              <th style={th}>Dates</th>
              <th style={th}>Type</th>
              <th style={th}>Total</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ booking, board }) => (
              <tr key={booking.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={td}>#{booking.id}</td>
                <td style={td}>
                  <strong>{booking.customerName}</strong>
                  <br />
                  <span style={{ fontSize: 12, color: "#555" }}>
                    {booking.email} · {booking.phone}
                  </span>
                </td>
                <td style={td}>{board?.name ?? "—"}</td>
                <td style={td}>
                  {booking.startDate} → {booking.endDate}
                  <br />
                  <span style={{ fontSize: 12, color: "#555" }}>{booking.days}d</span>
                </td>
                <td style={td}>
                  {booking.bookingType} · {booking.experienceLevel}
                </td>
                <td style={td}>{formatPrice(booking.total, "sl-SI")}</td>
                <td style={td}>
                  <StatusPill status={booking.status} />
                </td>
                <td style={td}>
                  <ActionForm id={booking.id} current={booking.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </body>
    </html>
  );
}

const th: React.CSSProperties = { padding: "10px 12px", fontSize: 12, fontWeight: 600 };
const td: React.CSSProperties = { padding: "10px 12px", fontSize: 13, verticalAlign: "top" };

function StatusPill({ status }: { status: "pending" | "confirmed" | "cancelled" }) {
  const colors: Record<string, string> = {
    pending: "#a16207",
    confirmed: "#15803d",
    cancelled: "#b91c1c",
  };
  return (
    <span
      style={{
        background: colors[status],
        color: "#fff",
        padding: "2px 8px",
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: 1,
      }}
    >
      {status}
    </span>
  );
}

function ActionForm({
  id,
  current,
}: {
  id: number;
  current: "pending" | "confirmed" | "cancelled";
}) {
  // Tiny inline form using fetch via a server component requires JS — to keep
  // the admin server-only, we render two plain <a> links that POST through a
  // small client script registered globally below.
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {current !== "confirmed" && (
        <button
          formAction={`#`}
          data-booking-id={id}
          data-action="confirmed"
          style={{ ...btnStyle, background: "#15803d", color: "#fff" }}
        >
          Confirm
        </button>
      )}
      {current !== "cancelled" && (
        <button
          data-booking-id={id}
          data-action="cancelled"
          style={{ ...btnStyle, background: "#b91c1c", color: "#fff" }}
        >
          Cancel
        </button>
      )}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        // Client-side handler. Tiny, no framework.
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              if (window.__adminWired) return;
              window.__adminWired = true;
              document.addEventListener('click', function(e){
                var t = e.target;
                if (!(t instanceof HTMLElement)) return;
                var id = t.getAttribute('data-booking-id');
                var act = t.getAttribute('data-action');
                if (!id || !act) return;
                e.preventDefault();
                fetch('/api/bookings/' + id + '/status', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: act })
                }).then(function(r){
                  if (r.ok) location.reload();
                  else alert('Update failed (' + r.status + ')');
                });
              });
            })();
          `,
        }}
      />
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "4px 10px",
  fontSize: 12,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};
