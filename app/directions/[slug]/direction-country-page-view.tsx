"use client";

import Image from "next/image";
import Link from "next/link";

import { AboutSection } from "@/components/about-section/about-section";
import { Container } from "@/components/container/container";
import { CtaBanner } from "@/components/cta-banner/cta-banner";
import { DirectionCountryDetails } from "@/components/direction-country-details/direction-country-details";
import { HotelSpotlightSection } from "@/components/hotel-spotlight-section/hotel-spotlight-section";
import { PromoCard } from "@/components/promo-card/promo-card";
import { ResponsiveMainNav } from "@/components/responsive-main-nav/responsive-main-nav";
import { SeoSection } from "@/components/seo-section/seo-section";
import { SiteFooter } from "@/components/site-footer/site-footer";
import { SiteHeader } from "@/components/site-header/site-header";
import { SpecialOffersSection } from "@/components/special-offers-section/special-offers-section";
import { TextLinkButton } from "@/components/text-link-button/text-link-button";
import type { DirectionCountryPageData } from "@/lib/api-mock/get-direction-country";

import styles from "./direction-country-page.module.css";

function searchHrefForCountry(name: string) {
  return `/search?to=${encodeURIComponent(name)}`;
}

interface DirectionCountryPageViewProps {
  data: DirectionCountryPageData;
}

export function DirectionCountryPageView({ data }: DirectionCountryPageViewProps) {
  const searchAll = searchHrefForCountry(data.name);

  return (
    <div className={styles.page}>
      <Container>
        <div className={styles.top}>
          <SiteHeader paddedTop center={<ResponsiveMainNav />} />
        </div>

        <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
          <Link href="/" className={styles.crumb}>
            Главная
          </Link>
          <span className={styles.sep} aria-hidden>
            →
          </span>
          <Link href="/directions" className={styles.crumb}>
            Направления и страны
          </Link>
          <span className={styles.sep} aria-hidden>
            →
          </span>
          <span className={`${styles.crumb} ${styles.crumbCurrent}`.trim()}>
            {data.name}
          </span>
        </nav>

        <div className={styles.hero}>
          <Image
            src={data.heroImage}
            alt=""
            fill
            className={styles.heroImage}
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
          />
          <div className={styles.heroShade} aria-hidden />
          <div className={styles.heroInner}>
            <h1 className={styles.heroHeading}>{data.name}</h1>
            <p className={styles.heroSubtitle}>{data.intro}</p>
          </div>
        </div>
      </Container>

      <div className={styles.sections}>
        <div className={styles.hotelBundle}>
          <HotelSpotlightSection
            id="direction-hotels"
            title={data.hotelSectionTitle}
          >
            {data.hotels.map((item) => (
              <PromoCard key={item.id} item={item} href={searchAll} />
            ))}
          </HotelSpotlightSection>
          <Container>
            <div className={styles.showAllWrap}>
              <TextLinkButton href={searchAll} narrowFullWidth>
                смотреть все
              </TextLinkButton>
            </div>
          </Container>
        </div>

        <SpecialOffersSection
          id="direction-collections"
          title={data.collectionsTitle}
          items={data.collections}
          cardHref={searchAll}
          columns={4}
        />

        <AboutSection id="about" />

        <DirectionCountryDetails data={data} />

        <SeoSection
          id="seo"
          title={data.seoTitle}
          body={data.seoBody}
          imageSrc={data.seoImageSrc}
        />

        <CtaBanner />
      </div>

      <div className={styles.footerWrap}>
        <SiteFooter />
      </div>
    </div>
  );
}
