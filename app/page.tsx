import { CtaBanner } from "@/components/cta-banner/cta-banner";
import { SeoSection } from "@/components/seo-section/seo-section";
import { HomeSearchBar } from "@/components/home-search-bar/home-search-bar";
import { MinimumPricesSection } from "@/components/minimum-prices-section/minimum-prices-section";
import { HeroSection } from "@/components/hero-section/hero-section";
import { PromoCard } from "@/components/promo-card/promo-card";
import { HotelSpotlightSection } from "@/components/hotel-spotlight-section/hotel-spotlight-section";
import { SectionRow } from "@/components/section-row/section-row";
import { SpecialOffersSection } from "@/components/special-offers-section/special-offers-section";
import { SiteFooter } from "@/components/site-footer/site-footer";
import { TextLinkButton } from "@/components/text-link-button/text-link-button";
import { AdvantagesSection } from "@/components/advantages-section/advantages-section";
import { AboutSection } from "@/components/about-section/about-section";
import { ReviewsSection } from "@/components/reviews-section/reviews-section";
import { getHomeContent } from "@/lib/api";

import styles from "./page.module.css";

export default async function Home() {
  const content = await getHomeContent();

  return (
    <div className={styles.page}>
      <HeroSection />
      <HomeSearchBar />
      <MinimumPricesSection items={content.directionPrices} />
      <div className={styles.sections}>
        <SectionRow
          id="hot"
          title="Улететь прямо сейчас"
          stackActionUnderNarrow
          action={
            <TextLinkButton href="/search" narrowFullWidth>
              смотреть все
            </TextLinkButton>
          }
        >
          {content.hotTours.map((item) => (
            <PromoCard key={item.id} item={item} href="/search?to=Турция" />
          ))}
        </SectionRow>

        <HotelSpotlightSection
          id="destinations"
          title="Посмотрите туры в эти отели"
        >
          {content.hotelSpotlight.map((item) => (
            <PromoCard key={item.id} item={item} href="/search" />
          ))}
        </HotelSpotlightSection>

        <SpecialOffersSection id="special" items={content.specialOffers} />

        <AdvantagesSection id="advantages" items={content.advantages} />
        <ReviewsSection id="reviews" items={content.reviews} />
        <AboutSection id="about" />
        <CtaBanner />
        <SeoSection id="seo" />
      </div>
      <div className={styles.footerWrap}>
        <SiteFooter />
      </div>
    </div>
  );
}
