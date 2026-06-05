import { LOCATION, SITE } from "@/lib/content";
import type { Board } from "@/db/schema";

export function JsonLd({ boards }: { boards: Board[] }) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://efoil.surf-store.com";

  // Sports location with our packages as Offer entries.
  const location = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "@id": `${siteUrl}#location`,
    name: `${SITE.operator} — E-Foil`,
    url: siteUrl,
    email: SITE.contactEmail,
    telephone: SITE.phoneRaw,
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

  // The legal operating entity — helps Google Knowledge Panel + AI engines
  // ground the business identity.
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}#org`,
    name: SITE.company.name,
    legalName: SITE.company.name,
    url: siteUrl,
    logo: `${siteUrl}/logo-surfstore.png`,
    email: SITE.contactEmail,
    telephone: SITE.phoneRaw,
    vatID: SITE.company.vatId,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.company.address,
      postalCode: "2000",
      addressLocality: "Maribor",
      addressCountry: "SI",
    },
    sameAs: [SITE.mainSite, SITE.social.instagram],
  };

  // Site-wide WebSite schema with a sitelinks SearchAction (used by Google
  // for in-result search boxes; harmless if unused).
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    url: siteUrl,
    name: "Surf-Store — E-Foil",
    publisher: { "@id": `${siteUrl}#org` },
    inLanguage: ["sl-SI", "en-GB"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(location) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
