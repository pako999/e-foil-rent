export const dynamic = "force-dynamic";

import { setRequestLocale } from "next-intl/server";
import { getActiveBoards } from "@/lib/queries";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { PickupBanner } from "./components/PickupBanner";
import { FeatureBadges } from "./components/FeatureBadges";
import { Packages } from "./components/Packages";
import { LocationBlock } from "./components/LocationBlock";
import { BoardsRow } from "./components/BoardsRow";
import { HowItWorks } from "./components/HowItWorks";
import { Video } from "./components/Video";
import { FoilShowcase } from "./components/FoilShowcase";
import { Tech } from "./components/Tech";
import { TechSpecs } from "./components/TechSpecs";
import { Gallery } from "./components/Gallery";
import { Reviews } from "./components/Reviews";
import { ShopCta } from "./components/ShopCta";
import { GiftVoucher } from "./components/GiftVoucher";
import { Faq } from "./components/Faq";
import { BookingSection } from "./components/BookingForm";
import { ExploreHubs } from "./components/ExploreHubs";
import { StoreBanner } from "./components/StoreBanner";
import { StickyBookBar } from "./components/StickyBookBar";
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
        <PickupBanner />
        <FeatureBadges />
        <Video />
        <FoilShowcase />
        <Packages boards={boards} locale={locale as Locale} />
        <Tech />
        <TechSpecs />
        <HowItWorks />
        <BoardsRow boards={boards} locale={locale as Locale} />
        <Gallery />
        <Reviews />
        <LocationBlock />
        <ShopCta />
        <GiftVoucher />
        <Faq />
        <BookingSection boards={boards} locale={locale as Locale} />
        <ExploreHubs locale={locale as Locale} />
        <StoreBanner />
      </main>
      <Footer locale={locale as Locale} />
      <StickyBookBar />
    </>
  );
}
