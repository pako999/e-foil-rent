export const dynamic = "force-dynamic";

import { setRequestLocale } from "next-intl/server";
import { getActiveBoards } from "@/lib/queries";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FeatureBadges } from "./components/FeatureBadges";
import { LocationBlock } from "./components/LocationBlock";
import { BoardsRow } from "./components/BoardsRow";
import { HowItWorks } from "./components/HowItWorks";
import { BookingSection } from "./components/BookingForm";
import { Footer } from "./components/Footer";
import { JsonLd } from "./components/JsonLd";
import type { Locale } from "@/i18n/request";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const boards = await getActiveBoards();

  return (
    <>
      <JsonLd boards={boards} />
      <Header locale={locale as Locale} />
      <main>
        <Hero />
        <FeatureBadges />
        <BoardsRow boards={boards} locale={locale as Locale} />
        <HowItWorks />
        <LocationBlock />
        <BookingSection boards={boards} locale={locale as Locale} />
      </main>
      <Footer locale={locale as Locale} />
    </>
  );
}
