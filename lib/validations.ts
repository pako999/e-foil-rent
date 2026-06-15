import { z } from "zod";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date (expected YYYY-MM-DD)");

export const bookingInput = z
  .object({
    boardId: z.coerce.number().int().positive(),
    packageId: z
      .enum(["30min", "day1", "weekend", "week1", "week2"])
      .nullable()
      .optional(),
    customerName: z.string().trim().min(2).max(120),
    email: z.string().trim().toLowerCase().email().max(200),
    phone: z.string().trim().min(5).max(40),
    startDate: isoDate,
    endDate: isoDate,
    experienceLevel: z.enum(["beginner", "experienced"]),
    bookingType: z.enum(["rental", "lesson", "rental_lesson"]),
    notes: z.string().trim().max(2000).optional().nullable(),
    // Optional discount code (e.g. exit-intent 10 % code).
    discountCode: z
      .string()
      .trim()
      .toUpperCase()
      .max(40)
      .optional()
      .nullable(),
    // Honeypot — bots fill this; real users never see it.
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .refine((v) => v.startDate <= v.endDate, {
    path: ["endDate"],
    message: "endDate must be on or after startDate",
  });

export type BookingInput = z.infer<typeof bookingInput>;

export const availabilityQuery = z.object({
  boardId: z.coerce.number().int().positive(),
  from: isoDate,
  to: isoDate,
});

export const statusUpdate = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]),
});
