import { Resend } from "resend";
import type { Board, Booking } from "@/db/schema";
import { formatPrice } from "./pricing";
import { SITE } from "./content";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? "bookings@surf-store.com";
const adminEmail = process.env.ENQUIRY_TO_EMAIL ?? SITE.contactEmail;

const resend = apiKey ? new Resend(apiKey) : null;

type SendArgs = {
  booking: Booking;
  board: Board;
  locale: "sl" | "en";
};

export async function sendBookingEmails({ booking, board, locale }: SendArgs) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY missing — skipping send");
    return;
  }

  const customer = renderCustomer({ booking, board, locale });
  const admin = renderAdmin({ booking, board });

  await Promise.allSettled([
    resend.emails.send({
      from: fromEmail,
      to: booking.email,
      subject: customer.subject,
      html: customer.html,
    }),
    resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: admin.subject,
      html: admin.html,
      replyTo: booking.email,
    }),
  ]);
}

function renderCustomer({ booking, board, locale }: SendArgs) {
  const total = formatPrice(booking.total, locale === "sl" ? "sl-SI" : "en-IE");
  if (locale === "sl") {
    return {
      subject: `Rezervacija prejeta — ${board.name}`,
      html: shell(`
        <h2>Hvala za rezervacijo!</h2>
        <p>Prejeli smo tvojo rezervacijo. Potrdimo jo v 24 urah.</p>
        ${summaryTable(booking, board, "sl")}
        <p style="margin-top:24px">Skupaj: <strong>${total}</strong></p>
        <p style="color:#555;font-size:13px">${SITE.contactEmail} · ${SITE.mainSite}</p>
      `),
    };
  }
  return {
    subject: `Booking received — ${board.name}`,
    html: shell(`
      <h2>Thanks for your booking!</h2>
      <p>We've received your request and will confirm within 24 hours.</p>
      ${summaryTable(booking, board, "en")}
      <p style="margin-top:24px">Total: <strong>${total}</strong></p>
      <p style="color:#555;font-size:13px">${SITE.contactEmail} · ${SITE.mainSite}</p>
    `),
  };
}

function renderAdmin({ booking, board }: Omit<SendArgs, "locale">) {
  const total = formatPrice(booking.total, "sl-SI");
  return {
    subject: `[E-Foil] New booking — ${board.name} (${booking.startDate} → ${booking.endDate})`,
    html: shell(`
      <h2>New booking</h2>
      <p><strong>${booking.customerName}</strong> · ${booking.email} · ${booking.phone}</p>
      ${summaryTable(booking, board, "en")}
      <p>Total: <strong>${total}</strong></p>
      ${booking.notes ? `<p><strong>Notes:</strong> ${escapeHtml(booking.notes)}</p>` : ""}
    `),
  };
}

function summaryTable(booking: Booking, board: Board, locale: "sl" | "en") {
  const t =
    locale === "sl"
      ? {
          board: "Deska",
          dates: "Datumi",
          days: "Dni",
          type: "Tip",
          level: "Raven",
        }
      : {
          board: "Board",
          dates: "Dates",
          days: "Days",
          type: "Type",
          level: "Level",
        };
  return `
    <table style="border-collapse:collapse;margin-top:12px">
      <tr><td style="padding:4px 12px;color:#555">${t.board}</td><td style="padding:4px 12px"><strong>${escapeHtml(board.name)}</strong></td></tr>
      <tr><td style="padding:4px 12px;color:#555">${t.dates}</td><td style="padding:4px 12px">${booking.startDate} → ${booking.endDate}</td></tr>
      <tr><td style="padding:4px 12px;color:#555">${t.days}</td><td style="padding:4px 12px">${booking.days}</td></tr>
      <tr><td style="padding:4px 12px;color:#555">${t.type}</td><td style="padding:4px 12px">${booking.bookingType}</td></tr>
      <tr><td style="padding:4px 12px;color:#555">${t.level}</td><td style="padding:4px 12px">${booking.experienceLevel}</td></tr>
    </table>
  `;
}

function shell(inner: string) {
  return `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#0a0e1a;max-width:560px;margin:0 auto;padding:24px">${inner}</body></html>`;
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
