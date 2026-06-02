import { LOCATION, SITE } from "@/lib/content";
import type { Board } from "@/db/schema";

export function JsonLd({ boards }: { boards: Board[] }) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://efoil.surf-store.com";

  const data = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: `${SITE.operator} — E-Foil`,
    url: siteUrl,
    email: SITE.contactEmail,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kidričevo",
      addressCountry: "SI",
      streetAddress: LOCATION.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: LOCATION.lat,
      longitude: LOCATION.lng,
    },
    sport: "E-foiling",
    makesOffer: boards.map((b) => ({
      "@type": "Offer",
      name: b.name,
      description: b.description,
      priceCurrency: "EUR",
      price: (b.dailyPrice / 100).toFixed(2),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        unitText: "DAY",
        price: (b.dailyPrice / 100).toFixed(2),
        priceCurrency: "EUR",
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
