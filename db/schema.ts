import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  date,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";

export const bookingStatus = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const experienceLevel = pgEnum("experience_level", [
  "beginner",
  "experienced",
]);

export const bookingType = pgEnum("booking_type", [
  "rental",
  "lesson",
  "rental_lesson",
]);

export const boards = pgTable("boards", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  // Stored as integer cents (EUR).
  dailyPrice: integer("daily_price").notNull(),
  weeklyPrice: integer("weekly_price").notNull(),
  unitsAvailable: integer("units_available").notNull().default(1),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    boardId: integer("board_id")
      .notNull()
      .references(() => boards.id, { onDelete: "restrict" }),
    customerName: text("customer_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    days: integer("days").notNull(),
    experienceLevel: experienceLevel("experience_level").notNull(),
    bookingType: bookingType("booking_type").notNull(),
    subtotal: integer("subtotal").notNull(),
    discount: integer("discount").notNull(),
    total: integer("total").notNull(),
    status: bookingStatus("status").notNull().default("pending"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    boardDateIdx: index("bookings_board_date_idx").on(
      t.boardId,
      t.startDate,
      t.endDate,
    ),
    statusIdx: index("bookings_status_idx").on(t.status),
  }),
);

export const blockedDates = pgTable(
  "blocked_dates",
  {
    id: serial("id").primaryKey(),
    // Null = block applies to all boards.
    boardId: integer("board_id").references(() => boards.id, {
      onDelete: "cascade",
    }),
    date: date("date").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    boardDateIdx: index("blocked_board_date_idx").on(t.boardId, t.date),
  }),
);

export type Board = typeof boards.$inferSelect;
export type NewBoard = typeof boards.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type BlockedDate = typeof blockedDates.$inferSelect;
