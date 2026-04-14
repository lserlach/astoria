"use client";

import {
  AirplaneTilt,
  ArrowLeft,
  Baby,
  Bell,
  Building,
  CaretCircleLeft,
  CaretCircleRight,
  CheckCircle,
  Dresser,
  ForkKnife,
  HandHeart,
  Heart,
  Info,
  MapPin,
  MapTrifold,
  Star,
  Towel,
  Waves,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { CtaBanner } from "@/components/cta-banner/cta-banner";
import { Container } from "@/components/container/container";
import { ResponsiveMainNav } from "@/components/responsive-main-nav/responsive-main-nav";
import { SeoSection } from "@/components/seo-section/seo-section";
import { SiteFooter } from "@/components/site-footer/site-footer";
import { SiteHeader } from "@/components/site-header/site-header";
import type {
  TourDetailPageData,
  TourDetailSection,
  TourDetailSectionIcon,
  TourFlightLegData,
} from "@/lib/api/types";

import styles from "./tour-page.module.css";

const ICON_SIZE = 24;

function SectionGlyph({ icon }: { icon: TourDetailSectionIcon }) {
  const c = styles.sectionIcon;
  switch (icon) {
    case "info":
      return <Info className={c} size={ICON_SIZE} weight="regular" aria-hidden />;
    case "heart":
      return <Heart className={c} size={ICON_SIZE} weight="regular" aria-hidden />;
    case "airplane":
      return (
        <AirplaneTilt className={c} size={ICON_SIZE} weight="regular" aria-hidden />
      );
    case "waves":
      return <Waves className={c} size={ICON_SIZE} weight="regular" aria-hidden />;
    case "building":
      return <Building className={c} size={ICON_SIZE} weight="regular" aria-hidden />;
    case "dresser":
      return <Dresser className={c} size={ICON_SIZE} weight="regular" aria-hidden />;
    case "towel":
      return <Towel className={c} size={ICON_SIZE} weight="regular" aria-hidden />;
    case "bell":
      return <Bell className={c} size={ICON_SIZE} weight="regular" aria-hidden />;
    case "baby":
      return <Baby className={c} size={ICON_SIZE} weight="regular" aria-hidden />;
    case "forkknife":
      return (
        <ForkKnife className={c} size={ICON_SIZE} weight="regular" aria-hidden />
      );
    case "handheart":
      return (
        <HandHeart className={c} size={ICON_SIZE} weight="regular" aria-hidden />
      );
    case "map":
      return (
        <MapTrifold className={c} size={ICON_SIZE} weight="regular" aria-hidden />
      );
    default:
      return <Info className={c} size={ICON_SIZE} aria-hidden />;
  }
}

function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function TourFlightCard({ leg }: { leg: TourFlightLegData }) {
  const outbound = leg.mode === "outbound";
  return (
    <div className={styles.flightCard}>
      <div className={styles.flightCardHead}>
        <AirplaneTilt
          className={`${styles.flightIcon} ${!outbound ? styles.flightIconReturn : ""}`.trim()}
          size={ICON_SIZE}
          weight="regular"
          aria-hidden
        />
        {outbound ? "Перелёт туда" : "Перелёт обратно"}
      </div>
      <div className={styles.flightBody}>
        <div className={styles.flightCol}>
          <p className={styles.airline}>{leg.airlineName}</p>
          <p className={styles.flightNo}>{leg.depFlightNo}</p>
          <p className={styles.airport}>{leg.depAirport}</p>
          <p className={styles.time}>{leg.depTimeLabel}</p>
        </div>
        <div className={styles.flightMid} aria-hidden>
          <div className={styles.flightLine} />
          <AirplaneTilt
            className={`${styles.flightPlane} ${!outbound ? styles.flightPlaneReturn : ""}`.trim()}
            size={22}
            weight="regular"
          />
        </div>
        <div className={`${styles.flightCol} ${styles.flightColEnd}`.trim()}>
          <p className={styles.airline}>{leg.airlineName}</p>
          {leg.arrFlightNo ? (
            <p className={styles.flightNo}>{leg.arrFlightNo}</p>
          ) : null}
          <p className={styles.airport}>{leg.arrAirport}</p>
          <p className={styles.time}>{leg.arrTimeLabel}</p>
        </div>
      </div>
    </div>
  );
}

function renderSection(section: TourDetailSection, key: string) {
  switch (section.type) {
    case "text":
      return (
        <section key={key} className={styles.sectionCard}>
          <div className={styles.sectionHead}>
            <SectionGlyph icon={section.icon} />
            <h2 className={styles.sectionTitle}>{section.title}</h2>
          </div>
          {section.paragraphs.map((p, i) => (
            <p key={i} className={styles.sectionProse}>
              {p}
            </p>
          ))}
        </section>
      );
    case "bullets":
      return (
        <section key={key} className={styles.sectionCard}>
          <div className={styles.sectionHead}>
            <SectionGlyph icon={section.icon} />
            <h2 className={styles.sectionTitle}>{section.title}</h2>
          </div>
          <ul className={styles.bulletList}>
            {section.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      );
    case "flights":
      return (
        <div key={key} className={styles.flightDetailStack}>
          {section.legs.map((leg, i) => (
            <TourFlightCard key={`${key}-${i}`} leg={leg} />
          ))}
        </div>
      );
    case "kv":
      return (
        <section key={key} className={styles.sectionCard}>
          <div className={styles.sectionHead}>
            <SectionGlyph icon={section.icon} />
            <h2 className={styles.sectionTitle}>{section.title}</h2>
          </div>
          {section.rows.map((row, i) => (
            <div key={i} className={styles.kvRow}>
              <p className={styles.kvLabel}>{row.label}</p>
              <p className={styles.kvValue}>{row.value}</p>
            </div>
          ))}
        </section>
      );
    case "meal":
      return (
        <section key={key} className={styles.sectionCard}>
          <div className={styles.sectionHead}>
            <SectionGlyph icon={section.icon} />
            <h2 className={styles.sectionTitle}>{section.title}</h2>
          </div>
          <div className={styles.mealIntro}>
            <p className={styles.mealTypeLabel}>{section.intro.typeLabel}</p>
            <p className={styles.mealName}>{section.intro.name}</p>
            <p className={styles.mealDesc}>{section.intro.description}</p>
          </div>
          {section.groups.map((g, i) => (
            <div key={i} className={styles.mealGroup}>
              <h3 className={styles.mealGroupTitle}>{g.heading}</h3>
              <ul className={styles.bulletList}>
                {g.items.map((line, j) => (
                  <li key={j}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      );
    case "checks":
      return (
        <section key={key} className={styles.sectionCard}>
          <div className={styles.sectionHead}>
            <SectionGlyph icon={section.icon} />
            <h2 className={styles.sectionTitle}>{section.title}</h2>
          </div>
          <ul className={styles.checkList}>
            {section.items.map((item, i) => (
              <li key={i} className={styles.checkItem}>
                <CheckCircle
                  className={styles.checkIcon}
                  size={22}
                  weight="fill"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </section>
      );
    case "map":
      return (
        <section key={key} className={styles.sectionCard}>
          <div className={styles.sectionHead}>
            <SectionGlyph icon="map" />
            <h2 className={styles.sectionTitle}>{section.title}</h2>
          </div>
          <div className={styles.mapWrap}>
            <iframe
              title="Карта отеля"
              className={styles.mapFrame}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(section.query)}&z=12&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className={styles.sectionProse} style={{ marginTop: "var(--space-3)" }}>
            <a href={mapsUrl(section.query)} className={styles.mapLink} target="_blank" rel="noreferrer">
              Открыть в Google Картах
            </a>
          </p>
        </section>
      );
    case "notice":
      return (
        <div key={key} className={styles.noticeCard}>
          <Info className={styles.noticeIcon} size={28} weight="regular" aria-hidden />
          <p className={styles.noticeText}>{section.message}</p>
        </div>
      );
    default:
      return null;
  }
}

interface TourPageViewProps {
  data: TourDetailPageData;
}

export function TourPageView({ data }: TourPageViewProps) {
  const { tour } = data;
  const photos = useMemo(
    () => [tour.imageUrl, ...(tour.galleryImageUrls ?? [])],
    [tour.galleryImageUrls, tour.imageUrl],
  );
  const [mainIdx, setMainIdx] = useState(0);
  const mainSrc = photos[mainIdx] ?? tour.imageUrl;

  const prev = useCallback(() => {
    setMainIdx((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const next = useCallback(() => {
    setMainIdx((i) => (i + 1) % photos.length);
  }, [photos.length]);

  const hotelMapHref = mapsUrl(`${tour.hotelName} ${data.locationLine}`);

  return (
    <div className={styles.page}>
      <Container>
        <div className={styles.topBar}>
          <SiteHeader paddedTop center={<ResponsiveMainNav />} />
        </div>

        <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
          <Link href="/" className={styles.crumb}>
            Главная
          </Link>
          <span className={styles.sep} aria-hidden>
            →
          </span>
          <Link href="/search" className={styles.crumb}>
            Поиск туров
          </Link>
          <span className={styles.sep} aria-hidden>
            →
          </span>
          <span className={`${styles.crumb} ${styles.crumbCurrent}`.trim()}>
            {tour.hotelName}
          </span>
        </nav>

        <div className={styles.backRow}>
          <Link href="/search" className={styles.backLink}>
            <ArrowLeft size={24} weight="regular" aria-hidden />
            Назад к результатам
          </Link>
        </div>

        <div className={styles.pageBlocks}>
          <div className={styles.topGrid}>
            <div className={styles.surfaceCard}>
              <div className={styles.hotelTop}>
                <div className={styles.titleRow}>
                  <h1 className={styles.hotelTitle}>{tour.hotelName}</h1>
                  <span className={styles.rating} aria-label={`Рейтинг ${tour.rating}`}>
                    {tour.rating.toFixed(1)}
                  </span>
                </div>
                <div className={styles.stars} aria-hidden>
                  {Array.from({ length: tour.stars }).map((_, i) => (
                    <Star key={i} className={styles.star} size={24} weight="fill" />
                  ))}
                </div>
              </div>
              <div className={styles.locBlock}>
                <div className={styles.locRow}>
                  <MapPin className={styles.locIcon} size={24} weight="fill" aria-hidden />
                  <span className={styles.locText}>{data.locationLine}</span>
                </div>
                <a
                  href={hotelMapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  Показать отель на карте
                </a>
              </div>
              <div className={styles.flightStack}>
                {data.flightsColumn.map((leg, i) => (
                  <TourFlightCard key={i} leg={leg} />
                ))}
              </div>
            </div>

            <div className={`${styles.surfaceCard} ${styles.bookingCard}`.trim()}>
              {data.guaranteeHotel ? (
                <div className={styles.guarantee}>
                  <CheckCircle size={22} weight="fill" aria-hidden />
                  Гарантия мест в отеле
                </div>
              ) : null}
              <p className={styles.bookingTitle}>Тур в {tour.hotelName}</p>
              <p className={styles.bookingMeta}>
                {tour.nights} ночей · {tour.guestsLabel} · {tour.mealType}
              </p>
              <p className={styles.bookingDate}>{tour.dateLabel}</p>

              <div className={styles.priceRows}>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Стоимость тура:</span>
                  <span className={styles.priceValue}>
                    {data.tourPriceRub.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Топливный сбор</span>
                  <span className={styles.priceValue}>
                    {data.fuelSurchargeRub.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Туристы</span>
                  <span className={styles.priceValue}>{tour.guestsLabel}</span>
                </div>
              </div>

              <div className={styles.includedBox}>
                <p className={styles.includedTitle}>Что включено в тур</p>
                <ul className={styles.includedList}>
                  {data.sidebarIncluded.map((line, i) => (
                    <li key={i} className={styles.includedItem}>
                      <CheckCircle
                        className={styles.includedCheck}
                        size={22}
                        weight="fill"
                        aria-hidden
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.ctaBlock}>
                <p className={styles.orangePrice}>
                  от {data.bookFromRub.toLocaleString("ru-RU")} ₽
                </p>
                <button type="button" className={styles.bookBtn}>
                  Забронировать
                </button>
              </div>
            </div>
          </div>

          <div className={styles.gallery}>
            <div className={styles.galleryMain}>
              <Image
                src={mainSrc}
                alt=""
                fill
                className={styles.galleryMainImg}
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
              {photos.length > 1 ? (
                <div className={styles.galleryNav}>
                  <button
                    type="button"
                    className={styles.galleryNavBtn}
                    aria-label="Предыдущее фото"
                    onClick={prev}
                  >
                    <CaretCircleLeft size={32} weight="regular" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className={styles.galleryNavBtn}
                    aria-label="Следующее фото"
                    onClick={next}
                  >
                    <CaretCircleRight size={32} weight="regular" aria-hidden />
                  </button>
                </div>
              ) : null}
            </div>
            <div className={styles.thumbs}>
              {photos.slice(0, 5).map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  className={`${styles.thumb} ${i === mainIdx ? styles.thumbActive : ""}`.trim()}
                  onClick={() => setMainIdx(i)}
                  aria-label={`Фото ${i + 1}`}
                >
                  <Image src={src} alt="" fill className={styles.thumbImg} sizes="200px" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <div className={styles.leadSection}>
        <CtaBanner />
      </div>

      <Container>
        <div className={styles.pageBlocks}>
          <div className={styles.sectionStack}>
            {data.sections.map((s, i) => renderSection(s, `sec-${i}`))}
          </div>
          <div className={styles.seoWrap}>
            <SeoSection id="tour-seo" />
          </div>
        </div>
      </Container>

      <div className={styles.footerWrap}>
        <SiteFooter />
      </div>
    </div>
  );
}
