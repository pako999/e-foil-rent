/**
 * Minimal client for the e-racuni.com SaaS invoicing API. Used to create
 * a proforma invoice (predračun) when an admin confirms a booking.
 *
 * Auth + endpoint conventions:
 *   - Set ERACUNI_API_KEY (issued in e-racuni → Nastavitve → API)
 *   - Set ERACUNI_API_URL (defaults to the public REST endpoint)
 *   - Set ERACUNI_VAT_RATE_ID if your e-racuni account uses a custom 22 %
 *     rate identifier. Most accounts use "STANDARD".
 *
 * If credentials are missing this returns `null` and the booking
 * confirmation email still goes out, just without a PDF attachment.
 */

import type { Board, Booking } from "@/db/schema";
import { vatBreakdown } from "./pricing";

const API_URL =
  process.env.ERACUNI_API_URL ?? "https://www.e-racuni.com/eRacuniWS/rest/v1";
const API_KEY = process.env.ERACUNI_API_KEY;
const COMPANY_ID = process.env.ERACUNI_COMPANY_ID;
const VAT_RATE_ID = process.env.ERACUNI_VAT_RATE_ID ?? "STANDARD";

export type ProformaResult = {
  documentId: string;
  documentNumber: string;
  pdf?: Buffer;
};

export async function createProforma({
  booking,
  board,
}: {
  booking: Booking;
  board: Board;
}): Promise<ProformaResult | null> {
  if (!API_KEY || !COMPANY_ID) {
    console.warn(
      "[eracuni] ERACUNI_API_KEY or ERACUNI_COMPANY_ID missing — skipping proforma",
    );
    return null;
  }

  const v = vatBreakdown(booking.total);
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7); // 7-day payment window

  const payload = {
    customer: {
      name: booking.customerName,
      email: booking.email,
      phone: booking.phone,
    },
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: dueDate.toISOString().slice(0, 10),
    currency: "EUR",
    reference: `BOOKING-${booking.id}`,
    items: [
      {
        description: `${board.name} — ${booking.bookingType.replaceAll("_", " + ")} (${booking.days} dni: ${booking.startDate} → ${booking.endDate})`,
        quantity: 1,
        unitPriceNet: (v.net / 100).toFixed(2),
        vatRateId: VAT_RATE_ID,
        vatAmount: (v.vat / 100).toFixed(2),
        totalNet: (v.net / 100).toFixed(2),
        totalGross: (v.gross / 100).toFixed(2),
      },
    ],
    totals: {
      net: (v.net / 100).toFixed(2),
      vat: (v.vat / 100).toFixed(2),
      gross: (v.gross / 100).toFixed(2),
    },
  };

  try {
    const res = await fetch(`${API_URL}/companies/${COMPANY_ID}/proformas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("[eracuni] create proforma failed", res.status, await res.text());
      return null;
    }
    const data = (await res.json()) as {
      id: string;
      documentNumber: string;
      pdfUrl?: string;
    };

    let pdf: Buffer | undefined;
    if (data.pdfUrl) {
      const pdfRes = await fetch(data.pdfUrl, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });
      if (pdfRes.ok) {
        pdf = Buffer.from(await pdfRes.arrayBuffer());
      }
    }

    return {
      documentId: data.id,
      documentNumber: data.documentNumber,
      pdf,
    };
  } catch (err) {
    console.error("[eracuni] request failed", err);
    return null;
  }
}
