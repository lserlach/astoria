"use client";

import Link from "next/link";

import { CtaBanner } from "@/components/cta-banner/cta-banner";
import { Container } from "@/components/container/container";
import { DestinationDirectionCard } from "@/components/destination-direction-card/destination-direction-card";
import { ResponsiveMainNav } from "@/components/responsive-main-nav/responsive-main-nav";
import { SiteFooter } from "@/components/site-footer/site-footer";
import { SiteHeader } from "@/components/site-header/site-header";

import styles from "./page.module.css";

const ITEMS = [
  {
    slug: "turkey",
    name: "Турция",
    description: "Популярное направление с пляжами и историей",
    priceAmount: "35 000",
    imageSrc: "/directions/turkey.jpg",
  },
  {
    slug: "egypt",
    name: "Египет",
    description: "Круглогодичный отдых на Красном море",
    priceAmount: "30 000",
    imageSrc: "/directions/egypt.jpg",
  },
  {
    slug: "uae",
    name: "ОАЭ",
    description: "Роскошный отдых и современные города",
    priceAmount: "80 000",
    imageSrc: "/directions/uae.jpg",
  },
  {
    slug: "thailand",
    name: "Таиланд",
    description: "Экзотика и тропические пляжи",
    priceAmount: "90 000",
    imageSrc: "/directions/thailand.jpg",
  },
  {
    slug: "maldives",
    name: "Мальдивы",
    description: "Райские острова для романтики",
    priceAmount: "200 000",
    imageSrc: "/directions/maldives.jpg",
  },
] as const;

function searchHref(name: string) {
  return `/search?to=${encodeURIComponent(name)}`;
}

export function DirectionsPageView() {
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
          <span className={`${styles.crumb} ${styles.crumbCurrent}`.trim()}>
            Направления и страны
          </span>
        </nav>

        <header className={styles.intro}>
          <h1 className={styles.heading}>Направления</h1>
          <p className={styles.subtitle}>
            Забронируйте тур за 3 месяца и получите скидку до 30%
          </p>
        </header>

        <div className={styles.grid}>
          {ITEMS.map((item) => (
            <DestinationDirectionCard
              key={item.name}
              name={item.name}
              description={item.description}
              priceAmount={item.priceAmount}
              imageSrc={item.imageSrc}
              countryHref={`/directions/${item.slug}`}
              searchHref={searchHref(item.name)}
              fullWidth={item.name === "Мальдивы"}
            />
          ))}
        </div>
      </Container>

      <div className={styles.leadSection}>
        <CtaBanner />
      </div>

      <div className={styles.footerWrap}>
        <SiteFooter />
      </div>
    </div>
  );
}
