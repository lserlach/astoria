"use client";

import {
  AirplaneTilt,
  Building,
  CalendarBlank,
  CaretCircleLeft,
  CaretCircleRight,
  CaretDown,
  CookingPot,
  Flame,
  ForkKnife,
  House,
  Snowflake,
  Star,
  Users,
  WifiHigh,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import type {
  Tour,
  TourCardAmenityId,
  TourFeatureTagTone,
} from "@/lib/api/types";
import { ratingToBadgeTierKey } from "@/lib/rating-badge-tier";

import { buildTourRoomSections } from "./tour-offer-variants";
import styles from "./tour-result-card.module.css";

interface TourResultCardProps {
  tour: Tour;
  layout?: "list" | "grid";
}

const accentIconClass = styles.accentIcon;

const offerIconCalendar = {
  size: 20,
  weight: "regular" as const,
  className: styles.offerGlyph,
  "aria-hidden": true as const,
};

const offerIconRow = {
  size: 24,
  weight: "regular" as const,
  className: styles.offerGlyph,
  "aria-hidden": true as const,
};

const NAV_ICON_SIZE = 48;

const RATING_TIER_CLASS = {
  "45": styles.ratingTier45,
  "4": styles.ratingTier4,
  "35": styles.ratingTier35,
  "3": styles.ratingTier3,
} as const;

function AmenityIcon({ id }: { id: TourCardAmenityId }) {
  const c = styles.amenityGlyph;
  const s = 25;
  switch (id) {
    case "balcony":
      return <House className={c} size={s} weight="regular" aria-hidden />;
    case "wifi":
      return <WifiHigh className={c} size={s} weight="regular" aria-hidden />;
    case "airCon":
      return <Snowflake className={c} size={s} weight="regular" aria-hidden />;
    case "kitchen":
      return <CookingPot className={c} size={s} weight="regular" aria-hidden />;
    default:
      return null;
  }
}

function featureTagClass(tone: TourFeatureTagTone) {
  switch (tone) {
    case "green":
      return styles.tagGreen;
    case "teal":
      return styles.tagTeal;
    case "blue":
      return styles.tagBlue;
    case "gold":
      return styles.tagGold;
    default:
      return styles.tagGreen;
  }
}

export function TourResultCard({
  tour,
  layout = "list",
}: TourResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [openRoomId, setOpenRoomId] = useState("");
  const mediaRef = useRef<HTMLDivElement>(null);
  const roomSections = useMemo(() => buildTourRoomSections(tour), [tour]);
  const fallbackRoomId = useMemo(
    () =>
      roomSections.find((r) => r.offers.length > 0)?.id ??
      roomSections[0]?.id ??
      "",
    [roomSections],
  );
  const detailsId = useId();

  useEffect(() => {
    if (!expanded) {
      setOpenRoomId("");
      return;
    }
    setOpenRoomId(fallbackRoomId);
  }, [expanded, tour.id, fallbackRoomId]);

  const galleryImages = useMemo(() => {
    const extra = tour.galleryImageUrls;
    if (extra && extra.length > 0) return extra;
    return [tour.imageUrl];
  }, [tour.galleryImageUrls, tour.imageUrl]);

  useEffect(() => {
    setGalleryIndex(0);
  }, [tour.id]);

  const galleryCount = galleryImages.length;
  const activeSrc = galleryImages[galleryIndex] ?? tour.imageUrl;

  const updateIndexFromPointer = useCallback(
    (clientX: number) => {
      if (galleryCount <= 1) return;
      const el = mediaRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      const clamped = Math.min(1, Math.max(0, ratio));
      const idx = Math.min(
        galleryCount - 1,
        Math.floor(clamped * galleryCount),
      );
      setGalleryIndex(idx);
    },
    [galleryCount],
  );

  const handleMediaPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      updateIndexFromPointer(e.clientX);
    },
    [updateIndexFromPointer],
  );

  const handleMediaPointerLeave = useCallback(() => {
    setGalleryIndex(0);
  }, []);

  const showPrevPhoto = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (galleryCount <= 1) return;
      setGalleryIndex((i) => (i - 1 + galleryCount) % galleryCount);
    },
    [galleryCount],
  );

  const showNextPhoto = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (galleryCount <= 1) return;
      setGalleryIndex((i) => (i + 1) % galleryCount);
    },
    [galleryCount],
  );

  return (
    <div
      className={`${styles.wrap} ${layout === "grid" ? styles.wrapGrid : ""}`.trim()}
    >
      <article className={styles.card}>
        <div className={styles.leftCluster}>
          <div
            ref={mediaRef}
            className={styles.media}
            onPointerMove={
              galleryCount > 1 ? handleMediaPointerMove : undefined
            }
            onPointerLeave={
              galleryCount > 1 ? handleMediaPointerLeave : undefined
            }
          >
            <Image
              src={activeSrc}
              alt=""
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 440px"
            />
            <div className={styles.mediaOverlay} />
            {tour.imageBadgeLabel ? (
              <span className={styles.badgeHit}>{tour.imageBadgeLabel}</span>
            ) : tour.isHot ? (
              <span className={styles.hot}>
                <Flame size={24} weight="regular" aria-hidden />
                горящий
              </span>
            ) : null}
            {galleryCount > 1 ? (
              <div className={styles.mediaNav}>
                <button
                  type="button"
                  className={styles.mediaNavBtn}
                  aria-label="Предыдущее фото"
                  onClick={showPrevPhoto}
                >
                  <CaretCircleLeft
                    className={styles.mediaNavIcon}
                    size={NAV_ICON_SIZE}
                    weight="regular"
                    aria-hidden
                  />
                </button>
                <button
                  type="button"
                  className={styles.mediaNavBtn}
                  aria-label="Следующее фото"
                  onClick={showNextPhoto}
                >
                  <CaretCircleRight
                    className={styles.mediaNavIcon}
                    size={NAV_ICON_SIZE}
                    weight="regular"
                    aria-hidden
                  />
                </button>
              </div>
            ) : null}
          </div>
          <div className={styles.main}>
            <div className={styles.titleBlock}>
              <div className={styles.titleRow}>
                <span
                  className={`${styles.ratingBadge} ${RATING_TIER_CLASS[ratingToBadgeTierKey(tour.rating)]}`.trim()}
                  aria-label={`Рейтинг ${tour.rating}`}
                >
                  {tour.rating.toFixed(1)}
                </span>
                <h3 className={styles.title}>
                  <Link href={`/tour/${tour.id}`} className={styles.titleLink}>
                    {tour.hotelName}
                  </Link>
                </h3>
              </div>
              <div className={styles.starsRow} aria-hidden>
                {Array.from({ length: tour.stars }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    weight="fill"
                    className={styles.starIcon}
                  />
                ))}
              </div>
            </div>
            <p className={styles.locationLine}>{tour.locationLabel}</p>
            {tour.distanceLabel ? (
              <div className={styles.distanceRow}>
                <Image
                  src="/images/tour/distance-sea-waves.png"
                  alt=""
                  width={25}
                  height={25}
                  className={styles.distanceIcon}
                  aria-hidden
                />
                <span>{tour.distanceLabel}</span>
              </div>
            ) : null}
            {tour.featureTags && tour.featureTags.length > 0 ? (
              <ul className={styles.tagRow}>
                {tour.featureTags.map((tag) => (
                  <li
                    key={tag.label}
                    className={`${styles.featureTag} ${featureTagClass(tag.tone)}`.trim()}
                  >
                    {tag.label}
                  </li>
                ))}
              </ul>
            ) : null}
            {tour.amenities && tour.amenities.length > 0 ? (
              <ul className={styles.amenityRow}>
                {tour.amenities.map((id) => (
                  <li key={id} className={styles.amenityChip}>
                    <AmenityIcon id={id} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        <div className={styles.side}>
          <div className={styles.sideMeta}>
            <div className={styles.sideRow}>
              <Building
                className={accentIconClass}
                size={24}
                weight="regular"
                aria-hidden
              />
              <span>{tour.roomType}</span>
            </div>
            <div className={styles.sideRow}>
              <ForkKnife
                className={accentIconClass}
                size={24}
                weight="regular"
                aria-hidden
              />
              <span>{tour.mealType}</span>
            </div>
            <div className={styles.sideRow}>
              <AirplaneTilt
                className={accentIconClass}
                size={24}
                weight="regular"
                aria-hidden
              />
              <span>
                {tour.charter ? "Чартер" : "Регулярный рейс"}
              </span>
            </div>
            <div className={styles.sideRow}>
              <Users
                className={accentIconClass}
                size={24}
                weight="regular"
                aria-hidden
              />
              <span>{tour.guestsLabel}</span>
            </div>
          </div>
          <div className={styles.priceBlock}>
            <button
              type="button"
              className={styles.pricePill}
              aria-expanded={expanded}
              aria-controls={detailsId}
              aria-label={
                expanded
                  ? "Скрыть варианты размещения и даты"
                  : `Показать варианты размещения и даты, от ${tour.priceFrom.toLocaleString("ru-RU")} ₽`
              }
              onClick={() => setExpanded((v) => !v)}
            >
              от {tour.priceFrom.toLocaleString("ru-RU")} ₽
            </button>
          </div>
        </div>
      </article>

      {expanded ? (
        <div
          id={detailsId}
          className={styles.details}
          role="region"
          aria-label="Варианты размещения и даты"
        >
          <div className={styles.roomAccordion}>
            {roomSections.map((room) => {
              const isOpen =
                (openRoomId || fallbackRoomId) === room.id;
              return (
                <div key={room.id} className={styles.roomSection}>
                  <button
                    type="button"
                    className={styles.roomBar}
                    aria-expanded={isOpen}
                    onClick={() => setOpenRoomId(room.id)}
                  >
                    <span className={styles.roomBarMain}>
                      <span className={styles.roomThumb}>
                        <Image
                          src={room.imageUrl}
                          alt=""
                          fill
                          className={styles.roomThumbImg}
                          sizes="64px"
                        />
                      </span>
                      <span className={styles.roomTitle}>{room.title}</span>
                    </span>
                    <span className={styles.roomBarMeta}>
                      <span className={styles.roomBarPrice}>
                        {room.headerPriceRub.toLocaleString("ru-RU")} ₽
                      </span>
                      <CaretDown
                        className={`${styles.roomCaret} ${isOpen ? styles.roomCaretOpen : ""}`.trim()}
                        size={24}
                        weight="regular"
                        aria-hidden
                      />
                    </span>
                  </button>
                  {isOpen && room.offers.length > 0 ? (
                    <div className={styles.offerList}>
                      {room.offers.map((row) => (
                        <div key={row.id} className={styles.offerRow}>
                          <div className={styles.offerCol}>
                            <div className={styles.offerLine}>
                              <CalendarBlank {...offerIconCalendar} />
                              <span className={styles.offerDate}>
                                {row.dateLine}
                              </span>
                            </div>
                            <div className={styles.offerLine}>
                              <AirplaneTilt {...offerIconRow} />
                              <span className={styles.offerMuted}>
                                {row.flightLabel}
                              </span>
                            </div>
                          </div>
                          <div className={styles.offerCol}>
                            <div className={styles.offerLine}>
                              <Users {...offerIconRow} />
                              <span className={styles.offerMuted}>
                                {row.guestsLine}
                              </span>
                            </div>
                            <div className={styles.offerLine}>
                              <ForkKnife {...offerIconRow} />
                              <span className={styles.offerMeal}>
                                {row.mealLine}
                              </span>
                            </div>
                          </div>
                          <div className={styles.offerColActions}>
                            <p className={styles.offerRoomSpec}>
                              {row.roomSpecLine}
                            </p>
                            <button
                              type="button"
                              className={styles.offerPriceBtn}
                            >
                              {row.priceRub.toLocaleString("ru-RU")} ₽
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
