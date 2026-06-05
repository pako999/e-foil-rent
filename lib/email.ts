import { MailerSend, EmailParams, Sender, Recipient, Attachment } from "mailersend";
import type { Board, Booking } from "@/db/schema";
import { formatPrice, vatBreakdown } from "./pricing";
import { SITE } from "./content";

const apiKey = process.env.MAILERSEND_API_TOKEN;
const fromEmail =
  process.env.MAILERSEND_FROM_EMAIL ?? "bookings@efoil.surf-store.com";
const fromName = process.env.MAILERSEND_FROM_NAME ?? "Surf-Store E-Foil";
// Admin notifications always land here unless overridden by env var.
const adminEmail =
  process.env.ENQUIRY_TO_EMAIL ?? "info@surf-store.com";

const ms = apiKey ? new MailerSend({ apiKey }) : null;

type EmailLocale = "sl" | "en" | "de";

type SendArgs = {
  booking: Booking;
  board: Board;
  locale: EmailLocale;
};

function intlFor(locale: EmailLocale): string {
  if (locale === "sl") return "sl-SI";
  if (locale === "de") return "de-DE";
  return "en-IE";
}

async function send(args: {
  to: { email: string; name?: string };
  subject: string;
  html: string;
  replyTo?: { email: string; name?: string };
  attachments?: Array<{ filename: string; content: Buffer; mime?: string }>;
}) {
  if (!ms) return;
  const params = new EmailParams()
    .setFrom(new Sender(fromEmail, fromName))
    .setTo([new Recipient(args.to.email, args.to.name ?? args.to.email)])
    .setSubject(args.subject)
    .setHtml(args.html);
  if (args.replyTo) {
    params.setReplyTo(
      new Sender(args.replyTo.email, args.replyTo.name ?? args.replyTo.email),
    );
  }
  if (args.attachments && args.attachments.length > 0) {
    params.setAttachments(
      args.attachments.map(
        (a) =>
          new Attachment(
            a.content.toString("base64"),
            a.filename,
            "attachment",
          ),
      ),
    );
  }
  await ms.email.send(params);
}

/**
 * Sent automatically when an admin clicks "Confirm" on a booking.
 * Optionally attaches a PDF proforma created via lib/eracuni.
 */
export async function sendApprovalEmail({
  booking,
  board,
  locale,
  proforma,
}: SendArgs & {
  proforma?: { documentNumber: string; pdf?: Buffer };
}) {
  if (!ms) {
    console.warn("[email] MAILERSEND_API_TOKEN missing — skipping approval");
    return;
  }
  const total = formatPrice(booking.total, intlFor(locale));
  const v = vatBreakdown(booking.total);
  const tNet = formatPrice(v.net, "sl-SI");
  const tVat = formatPrice(v.vat, "sl-SI");
  const tGross = formatPrice(v.gross, "sl-SI");
  const docLine = proforma
    ? `<p>V prilogi je predračun <strong>${escapeHtml(proforma.documentNumber)}</strong>. Prosimo, da znesek poravnaš v naslednjih 7 dneh, da ostane termin rezerviran.</p>`
    : `<p>Za poravnavo bomo ločeno poslali predračun.</p>`;
  const docLineEn = proforma
    ? `<p>The attached file is proforma invoice <strong>${escapeHtml(proforma.documentNumber)}</strong>. Please settle it within 7 days to keep the slot reserved.</p>`
    : `<p>We will send the proforma invoice separately.</p>`;
  const docLineDe = proforma
    ? `<p>Im Anhang ist die Rechnung Nr. <strong>${escapeHtml(proforma.documentNumber)}</strong>. Bitte begleiche den Betrag innerhalb von 7 Tagen, damit der Termin reserviert bleibt.</p>`
    : `<p>Die Rechnung senden wir separat zu.</p>`;

  const slHtml = shell(`
        <h2>Rezervacija potrjena ✅</h2>
        <p>Pozdravljen/a ${escapeHtml(booking.customerName)}!</p>
        <p>Vaš termin je <strong>potrjen</strong>. Veselimo se srečanja na vodi.</p>
        ${summaryTable(booking, board, "sl")}
        <p style="margin-top:24px"><strong>Skupaj: ${total}</strong></p>
        <table style="margin-top:8px;border-collapse:collapse;font-size:13px;color:#555">
          <tr><td style="padding:2px 12px">Cena brez DDV</td><td style="padding:2px 12px">${tNet}</td></tr>
          <tr><td style="padding:2px 12px">DDV (22 %)</td><td style="padding:2px 12px">${tVat}</td></tr>
          <tr><td style="padding:2px 12px;border-top:1px solid #ddd">Skupaj z DDV</td><td style="padding:2px 12px;border-top:1px solid #ddd"><strong>${tGross}</strong></td></tr>
        </table>
        ${docLine}
        <p style="color:#555;font-size:13px;margin-top:24px">${SITE.contactEmail} · ${SITE.phone} · ${SITE.mainSite}</p>
      `);
  const enHtml = shell(`
        <h2>Booking confirmed ✅</h2>
        <p>Hi ${escapeHtml(booking.customerName)},</p>
        <p>Your slot is <strong>confirmed</strong>. Looking forward to seeing you on the water.</p>
        ${summaryTable(booking, board, "en")}
        <p style="margin-top:24px"><strong>Total: ${total}</strong></p>
        <table style="margin-top:8px;border-collapse:collapse;font-size:13px;color:#555">
          <tr><td style="padding:2px 12px">Net</td><td style="padding:2px 12px">${tNet}</td></tr>
          <tr><td style="padding:2px 12px">VAT (22 %)</td><td style="padding:2px 12px">${tVat}</td></tr>
          <tr><td style="padding:2px 12px;border-top:1px solid #ddd">Total incl. VAT</td><td style="padding:2px 12px;border-top:1px solid #ddd"><strong>${tGross}</strong></td></tr>
        </table>
        ${docLineEn}
        <p style="color:#555;font-size:13px;margin-top:24px">${SITE.contactEmail} · ${SITE.phone} · ${SITE.mainSite}</p>
      `);
  const deHtml = shell(`
        <h2>Buchung bestätigt ✅</h2>
        <p>Hallo ${escapeHtml(booking.customerName)},</p>
        <p>Dein Termin ist <strong>bestätigt</strong>. Wir freuen uns aufs Wiedersehen am Wasser.</p>
        ${summaryTable(booking, board, "de")}
        <p style="margin-top:24px"><strong>Gesamt: ${total}</strong></p>
        <table style="margin-top:8px;border-collapse:collapse;font-size:13px;color:#555">
          <tr><td style="padding:2px 12px">Netto</td><td style="padding:2px 12px">${tNet}</td></tr>
          <tr><td style="padding:2px 12px">MwSt. (22 %)</td><td style="padding:2px 12px">${tVat}</td></tr>
          <tr><td style="padding:2px 12px;border-top:1px solid #ddd">Gesamt inkl. MwSt.</td><td style="padding:2px 12px;border-top:1px solid #ddd"><strong>${tGross}</strong></td></tr>
        </table>
        ${docLineDe}
        <p style="color:#555;font-size:13px;margin-top:24px">${SITE.contactEmail} · ${SITE.phone} · ${SITE.mainSite}</p>
      `);
  const html = locale === "sl" ? slHtml : locale === "de" ? deHtml : enHtml;

  const attachments = proforma?.pdf
    ? [
        {
          filename: `predracun-${proforma.documentNumber}.pdf`,
          content: proforma.pdf,
          mime: "application/pdf",
        },
      ]
    : undefined;

  await send({
    to: { email: booking.email, name: booking.customerName },
    subject:
      locale === "sl"
        ? `Rezervacija potrjena — ${board.name}`
        : locale === "de"
          ? `Buchung bestätigt — ${board.name}`
          : `Booking confirmed — ${board.name}`,
    html,
    attachments,
  });
}

/**
 * Sent when an admin clicks "Cancel" on a booking.
 */
export async function sendCancellationEmail({
  booking,
  board,
  locale,
}: SendArgs) {
  if (!ms) {
    console.warn("[email] MAILERSEND_API_TOKEN missing — skipping cancel");
    return;
  }
  const slHtml = shell(`
        <h2>Rezervacija odpovedana</h2>
        <p>Pozdravljen/a ${escapeHtml(booking.customerName)},</p>
        <p>Žal smo bili primorani <strong>odpovedati</strong> vaš termin za ${escapeHtml(board.name)}.</p>
        ${summaryTable(booking, board, "sl")}
        <p style="margin-top:24px">Če imaš vprašanja, nam piši — z veseljem najdemo nov termin.</p>
        <p style="color:#555;font-size:13px">${SITE.contactEmail} · ${SITE.phone}</p>
      `);
  const enHtml = shell(`
        <h2>Booking cancelled</h2>
        <p>Hi ${escapeHtml(booking.customerName)},</p>
        <p>We had to <strong>cancel</strong> your booking for ${escapeHtml(board.name)}.</p>
        ${summaryTable(booking, board, "en")}
        <p style="margin-top:24px">If you have questions, write us back — happy to find a new slot.</p>
        <p style="color:#555;font-size:13px">${SITE.contactEmail} · ${SITE.phone}</p>
      `);
  const deHtml = shell(`
        <h2>Buchung storniert</h2>
        <p>Hallo ${escapeHtml(booking.customerName)},</p>
        <p>Wir mussten deine Buchung für ${escapeHtml(board.name)} leider <strong>stornieren</strong>.</p>
        ${summaryTable(booking, board, "de")}
        <p style="margin-top:24px">Bei Fragen schreib uns — wir finden gern einen neuen Termin.</p>
        <p style="color:#555;font-size:13px">${SITE.contactEmail} · ${SITE.phone}</p>
      `);
  const html = locale === "sl" ? slHtml : locale === "de" ? deHtml : enHtml;

  await send({
    to: { email: booking.email, name: booking.customerName },
    subject:
      locale === "sl"
        ? `Rezervacija odpovedana — ${board.name}`
        : locale === "de"
          ? `Buchung storniert — ${board.name}`
          : `Booking cancelled — ${board.name}`,
    html,
  });
}

export async function sendBookingEmails({ booking, board, locale }: SendArgs) {
  if (!ms) {
    console.warn(
      "[email] MAILERSEND_API_TOKEN missing — skipping send",
    );
    return;
  }

  const customer = renderCustomer({ booking, board, locale });
  const admin = renderAdmin({ booking, board });

  await Promise.allSettled([
    send({
      to: { email: booking.email, name: booking.customerName },
      subject: customer.subject,
      html: customer.html,
    }),
    send({
      to: { email: adminEmail, name: "Surf-Store admin" },
      subject: admin.subject,
      html: admin.html,
      replyTo: { email: booking.email, name: booking.customerName },
    }),
  ]);
}

function renderCustomer({ booking, board, locale }: SendArgs) {
  const total = formatPrice(booking.total, intlFor(locale));
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
  if (locale === "de") {
    return {
      subject: `Buchung eingegangen — ${board.name}`,
      html: shell(`
        <h2>Danke für deine Buchung!</h2>
        <p>Wir haben deine Anfrage erhalten und bestätigen sie innerhalb von 24 Stunden.</p>
        ${summaryTable(booking, board, "de")}
        <p style="margin-top:24px">Gesamt: <strong>${total}</strong></p>
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

function summaryTable(booking: Booking, board: Board, locale: EmailLocale) {
  const t =
    locale === "sl"
      ? {
          board: "Deska",
          dates: "Datumi",
          days: "Dni",
          type: "Tip",
          level: "Raven",
        }
      : locale === "de"
        ? {
            board: "Board",
            dates: "Termine",
            days: "Tage",
            type: "Art",
            level: "Level",
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
