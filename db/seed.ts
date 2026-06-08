import { db } from "./index";
import { boards } from "./schema";

const seed = async () => {
  const rows = [
    {
      slug: "duotone-foil-cruise-set-al",
      name: "Duotone Foil Cruise Set AL — Midwish 5'8",
      description:
        "Naša rental konfiguracija. Aluminijasta Cruise mast (80 cm), Duotone Midwish 5'8 deska. Robustna, zanesljiva in primerna za začetnike.",
      imageUrl: "/foilboard-duotone.webp",
      halfHourPrice: 7000, // €70
      dailyPrice: 19900, // €199
      weeklyPrice: 90000, // €900 (matches the week1 fixed package)
      unitsAvailable: 1,
      sortOrder: 1,
    },
  ];

  for (const row of rows) {
    await db
      .insert(boards)
      .values(row)
      .onConflictDoUpdate({
        target: boards.slug,
        set: {
          name: row.name,
          description: row.description,
          imageUrl: row.imageUrl,
          halfHourPrice: row.halfHourPrice,
          dailyPrice: row.dailyPrice,
          weeklyPrice: row.weeklyPrice,
          unitsAvailable: row.unitsAvailable,
          sortOrder: row.sortOrder,
          active: true,
        },
      });
  }

  console.log(`Seeded ${rows.length} boards.`);
};

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
