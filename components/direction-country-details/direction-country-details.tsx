"use client";

import { MapPin, MapTrifold } from "@phosphor-icons/react";
import Link from "next/link";

import { Container } from "@/components/container/container";
import type { DirectionCountryPageData } from "@/lib/api-mock/get-direction-country";

import styles from "./direction-country-details.module.css";

interface DirectionCountryDetailsProps {
  data: DirectionCountryPageData;
}

function resortSearchHref(countryName: string, resort: string) {
  return `/search?to=${encodeURIComponent(`${countryName}, ${resort}`)}`;
}

export function DirectionCountryDetails({ data }: DirectionCountryDetailsProps) {
  const {
    generalInfoTitle,
    generalInfo,
    resortsSectionTitle,
    resortsSectionSubtitle,
    resortTags,
    monthlyPricesTitle,
    monthlyPrices,
    pricePanelPrimaryCta,
    pricePanelSecondaryCta,
    name,
  } = data;

  return (
    <section
      className={styles.section}
      aria-label="Общая информация о направлении и минимальные цены по месяцам"
    >
      <Container>
        <div className={styles.grid}>
          <div className={styles.column}>
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>{generalInfoTitle}</h2>
              <div className={styles.infoRows}>
                {generalInfo.map((row) => (
                  <div key={row.label} className={styles.infoRow}>
                    <p className={styles.infoLabel}>{row.label}</p>
                    <p className={styles.infoValue}>{row.value}</p>
                  </div>
                ))}
              </div>
              <div className={styles.mapWrap} aria-hidden>
                <MapTrifold
                  className={styles.mapIcon}
                  size={160}
                  weight="regular"
                />
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.resortsHead}>
                <h2 className={styles.resortsTitle}>{resortsSectionTitle}</h2>
                <p className={styles.resortsSubtitle}>
                  {resortsSectionSubtitle}
                </p>
              </div>
              <div className={styles.tagCloud}>
                {resortTags.map((resort) => (
                  <Link
                    key={resort}
                    href={resortSearchHref(name, resort)}
                    className={styles.resortTag}
                  >
                    <MapPin
                      className={styles.resortTagIcon}
                      size={24}
                      weight="regular"
                      aria-hidden
                    />
                    {resort}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.panel}>
              <h2 className={styles.pricesTitle}>{monthlyPricesTitle}</h2>
              <div className={styles.priceList}>
                {monthlyPrices.map((row) => (
                  <div key={row.month} className={styles.priceRow}>
                    <span className={styles.priceMonth}>{row.month}</span>
                    <span className={styles.priceValue}>
                      от {row.priceFrom.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.ctaStack}>
                <Link
                  href={pricePanelPrimaryCta.href}
                  className={styles.ctaPrimary}
                >
                  {pricePanelPrimaryCta.label}
                </Link>
                <Link
                  href={pricePanelSecondaryCta.href}
                  className={styles.ctaSecondary}
                >
                  {pricePanelSecondaryCta.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
