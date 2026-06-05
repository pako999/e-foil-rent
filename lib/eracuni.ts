/**
 * e-racuni.com proforma client.
 *
 * Auth: e-racuni's web-services API uses HTTP Basic over the tenant URL
 *       plus an X-API-Token header issued in Nastavitve → API. Both are
 *       set via env vars below — never hard-coded.
 *
 * Required env vars:
 *   ERACUNI_API_BASE      = https://e-racuni.com/si12   (tenant slug)
 *   ERACUNI_API_USER      = the API user you created in e-racuni
 *   ERACUNI_API_PASSWORD  = that user's API password
 *   ERACUNI_API_TOKEN     = the Web-Services token issued for that user
 *
 * Without any of these the client is a no-op and the confirmation email
 * still goes out — just without an attached PDF.
 *
 * Docs: https://e-racuni.com/si12/developer
 *
 * NOTE: The exact REST endpoint / payload field names below are
 * conservative defaults. After the first test, check Vercel runtime
 * logs — if e-racuni returns 4xx the response body will tell us the
 * exact path/field correction.
 */

import type { Board, Booking } from "@/db/schema";
import { vatBreakdown } from "./pricing";

const API_BASE = process.env.ERACUNI_API_BASE; // e.g. https://e-racuni.com/si12
const API_USER = process.env.ERACUNI_API_USER;
const API_PASSWORD = process.env.ERACUNI_API_PASSWORD;
const API_TOKEN = process.env.ERACUNI_API_TOKEN;
const VAT_RATE_ID = process.env.ERACUNI_VAT_RATE_ID ?? "STANDARD";

export type ProformaResult = {
  documentId: string;
  documentNumber: string;
  pdf?: Buffer;
};

function configured(): boolean {
  return !!(API_BASE && API_USER && API_PASSWORD && API_TOKEN);
}

function authHeaders(): HeadersInit {
  const basic = Buffer.from(`${API_USER}:${API_PASSWORD}`).toString("base64");
  return {
    Accept: "application/json",
    Authorization: `Basic ${basic}`,
    "X-API-Token": API_TOKEN ?? "",
  };
}

export async function createProforma({
  booking,
  board,
}: {
  booking: Booking;
  board: Board;
}): Promise<ProformaResult | null> {
  if (!configured()) {
    console.warn(
      "[eracuni] missing one of ERACUNI_API_BASE / USER / PASSWORD / TOKEN — skipping",
    );
    return null;
  }

  const v = vatBreakdown(booking.total);
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

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
    const res = await fetch(`${API_BASE}/api/v1/proformas`, {
      method: "POST",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(
        "[eracuni] create proforma failed",
        res.status,
        await res.text(),
      );
      return null;
    }
    const data = (await res.json()) as {
      id: string;
      documentNumber: string;
      pdfUrl?: string;
    };

    let pdf: Buffer | undefined;
    if (data.pdfUrl) {
      const pdfRes = await fetch(data.pdfUrl, { headers: authHeaders() });
      if (pdfRes.ok) {
        pdf = Buffer.from(await pdfRes.arrayBuffer());
      } else {
        console.error("[eracuni] pdf fetch failed", pdfRes.status);
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
