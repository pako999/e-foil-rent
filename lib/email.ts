import { MailerSend, EmailParams, Sender, Recipient, Attachment } from "mailersend";
import type { Board, Booking } from "@/db/schema";
import { formatPrice, vatBreakdown } from "./pricing";
import { SITE } from "./content";

const apiKey = process.env.MAILERSEND_API_TOKEN;
const fromEmail =
  process.env.MAILERSEND_FROM_EMAIL ?? "bookings@e-foiling.si";
const fromName = process.env.MAILERSEND_FROM_NAME ?? "Surf-Store E-Foil";
// Admin notifications always land here unless overridden by env var.
const adminEmail =
  process.env.ENQUIRY_TO_EMAIL ?? "info@e-foiling.si";

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
  text?: string;
  replyTo?: { email: string; name?: string };
  attachments?: Array<{ filename: string; content: Buffer; mime?: string }>;
}) {
  if (!ms) {
    console.warn("[email] MAILERSEND_API_TOKEN missing — skipping send");
    return;
  }
  // Build the minimum-viable payload first; every extra setter is a
  // potential 422 (Reply-To off-domain, tag not whitelisted, …) so we add
  // them defensively and let the core message go out even if an
  // enhancement is rejected.
  const params = new EmailParams()
    .setFrom(new Sender(fromEmail, fromName))
    .setTo([new Recipient(args.to.email, args.to.name ?? args.to.email)])
    .setSubject(args.subject)
    .setHtml(args.html)
    .setText(args.text ?? htmlToText(args.html));
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
  try {
    await ms.email.send(params);
  } catch (err) {
    // Re-throw with a useful message — the MailerSend SDK throws an
    // object literal whose `.message` is undefined, which surfaces as
    // the literal string "undefined" in our admin alerts.
    const e = err as {
      message?: string;
      statusCode?: number;
      body?: unknown;
    };
    const detail =
      e?.message ??
      `HTTP ${e?.statusCode ?? "?"} ${
        e?.body ? JSON.stringify(e.body).slice(0, 300) : ""
      }`;
    throw new Error(`MailerSend: ${detail}`);
  }
}

function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>|<\/h\d>|<\/li>|<\/tr>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
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

/**
 * Sent from the exit-intent popup: gives the visitor a one-time discount
 * code (10 % by default) they can paste into the booking form.
 */
export async function sendDiscountCodeEmail({
  email,
  code,
  percentOff,
  expiresAt,
  locale,
}: {
  email: string;
  code: string;
  percentOff: number;
  expiresAt: Date | null;
  locale: EmailLocale;
}) {
  if (!ms) {
    console.warn("[email] MAILERSEND_API_TOKEN missing — skipping discount");
    return;
  }
  const expiry = expiresAt
    ? new Intl.DateTimeFormat(intlFor(locale), { dateStyle: "long" }).format(
        expiresAt,
      )
    : null;

  const body = (() => {
    if (locale === "sl") {
      return {
        subject: `Tvoja ${percentOff} % koda za popust pri Surf-Store E-Foil`,
        html: shell(`
          <h2>Tvoja ${percentOff} % koda za popust</h2>
          <p>Hvala, ker si se prijavil/a na naše obvestilo. Tu je tvoja
          osebna koda za rezervacijo pri Surf-Store E-Foil:</p>
          <p style="font-size:28px;font-family:ui-monospace,monospace;background:#FFD600;border:2px solid #1a1a1a;padding:18px 24px;display:inline-block;font-weight:800;letter-spacing:2px">${escapeHtml(code)}</p>
          <p style="margin-top:24px">Vneseš jo pri rezervaciji v polje
          <strong>«Koda za popust»</strong>, znesek se samodejno zniža za
          ${percentOff} %.</p>
          ${expiry ? `<p>Koda velja do <strong>${expiry}</strong> in se lahko uporabi enkrat.</p>` : ""}
          <p style="margin-top:24px"><a href="https://e-foiling.si/sl#book" style="display:inline-block;background:#FFD600;border:2px solid #1a1a1a;padding:12px 18px;color:#1a1a1a;text-decoration:none;font-weight:800;text-transform:uppercase">Rezerviraj termin →</a></p>
        `),
      };
    }
    if (locale === "de") {
      return {
        subject: `Dein ${percentOff} % Rabattcode für Surf-Store E-Foil`,
        html: shell(`
          <h2>Dein ${percentOff} % Rabattcode</h2>
          <p>Danke für die Anmeldung. Hier ist dein persönlicher Code für
          eine Buchung bei Surf-Store E-Foil:</p>
          <p style="font-size:28px;font-family:ui-monospace,monospace;background:#FFD600;border:2px solid #1a1a1a;padding:18px 24px;display:inline-block;font-weight:800;letter-spacing:2px">${escapeHtml(code)}</p>
          <p style="margin-top:24px">Gib ihn beim Buchen ins Feld
          <strong>„Rabattcode"</strong> ein und der Betrag wird automatisch
          um ${percentOff} % reduziert.</p>
          ${expiry ? `<p>Der Code ist gültig bis <strong>${expiry}</strong> und kann einmal eingelöst werden.</p>` : ""}
          <p style="margin-top:24px"><a href="https://e-foiling.si/de#book" style="display:inline-block;background:#FFD600;border:2px solid #1a1a1a;padding:12px 18px;color:#1a1a1a;text-decoration:none;font-weight:800;text-transform:uppercase">Termin reservieren →</a></p>
        `),
      };
    }
    return {
      subject: `Your ${percentOff}% discount code for Surf-Store E-Foil`,
      html: shell(`
        <h2>Your ${percentOff}% discount code</h2>
        <p>Thanks for signing up. Here is your personal code for a booking
        with Surf-Store E-Foil:</p>
        <p style="font-size:28px;font-family:ui-monospace,monospace;background:#FFD600;border:2px solid #1a1a1a;padding:18px 24px;display:inline-block;font-weight:800;letter-spacing:2px">${escapeHtml(code)}</p>
        <p style="margin-top:24px">Paste it into the
        <strong>"Discount code"</strong> field on the booking form and the
        total will drop by ${percentOff}% automatically.</p>
        ${expiry ? `<p>Valid until <strong>${expiry}</strong>, single use.</p>` : ""}
        <p style="margin-top:24px"><a href="https://e-foiling.si/en#book" style="display:inline-block;background:#FFD600;border:2px solid #1a1a1a;padding:12px 18px;color:#1a1a1a;text-decoration:none;font-weight:800;text-transform:uppercase">Book a session →</a></p>
      `),
    };
  })();

  await send({
    to: { email },
    subject: body.subject,
    html: body.html,
  });
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

// Postal footer with a real address, contact, and a why-you-got-this line
// is required for legitimate transactional email (CAN-SPAM, ZEPT-1) and
// also a strong positive signal for Gmail/Outlook spam filters.
function shell(inner: string) {
  const footer = `
    <hr style="margin:32px 0 16px;border:none;border-top:1px solid #e5e7eb" />
    <p style="font-size:12px;color:#6b7280;line-height:1.5;margin:0 0 8px">
      Surf-Store.com — E-Foil school &amp; rental<br />
      Sport Group d.o.o., Osojnikova ulica 4, 2000 Maribor, Slovenija · VAT SI72133449<br />
      <a href="mailto:info@e-foiling.si" style="color:#6b7280">info@e-foiling.si</a>
      · <a href="https://e-foiling.si" style="color:#6b7280">e-foiling.si</a>
    </p>
    <p style="font-size:11px;color:#9ca3af;margin:0">
      This is a transactional message related to your booking with Surf-Store E-Foil.
      You're receiving it because you submitted a reservation on e-foiling.si.
    </p>
  `;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Surf-Store E-Foil</title>
</head>
<body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#0a0e1a;max-width:560px;margin:0 auto;padding:24px;background:#ffffff">
${inner}
${footer}
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
