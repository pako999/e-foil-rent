import { db } from "./index";
import { boards } from "./schema";

const seed = async () => {
  const rows = [
    {
      slug: "duotone-downwinder-sls",
      name: "Duotone Downwinder SLS",
      description:
        "Vsestranska e-foil deska — stabilna za začetnike, dovolj okretna za izkušene riderje.",
      imageUrl: "/board-1.jpg",
      halfHourPrice: 5000, // €50
      dailyPrice: 12000, // €120
      weeklyPrice: 70000, // €700
      unitsAvailable: 1,
      sortOrder: 1,
    },
    {
      slug: "duotone-pace-sls",
      name: "Duotone Pace SLS",
      description:
        "Hitra, agilna in odzivna — za jezerske turne in zaviti carving freestyle.",
      imageUrl: "/board-2.jpg",
      halfHourPrice: 5500, // €55
      dailyPrice: 13000, // €130
      weeklyPrice: 75000, // €750
      unitsAvailable: 1,
      sortOrder: 2,
    },
    {
      slug: "duotone-fly-sls",
      name: "Duotone Fly SLS",
      description:
        "Lahka in elegantna — najboljša izbira za daljše drsanje in vse-dnevni užitek.",
      imageUrl: "/board-3.jpg",
      halfHourPrice: 6000, // €60
      dailyPrice: 14000, // €140
      weeklyPrice: 80000, // €800
      unitsAvailable: 1,
      sortOrder: 3,
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
