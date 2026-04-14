"use client";

import {
  AirplaneTilt,
  Building,
  CalendarBlank,
  CaretCircleLeft,
  CaretCircleRight,
  Dresser,
  Flame,
  ForkKnife,
  MapPin,
  Moon,
  Plus,
  Star,
  Users,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import type { Tour } from "@/lib/api/types";

import { buildTourOfferVariants } from "./tour-offer-variants";
import styles from "./tour-result-card.module.css";

interface TourResultCardProps {
  tour: Tour;
  layout?: "list" | "grid";
}

const variantIconProps = {
  size: 24,
  weight: "regular" as const,
  className: styles.variantIcon,
  "aria-hidden": true as const,
};

const accentIconClass = styles.accentIcon;

const NAV_ICON_SIZE = 32;

export function TourResultCard({
  tour,
  layout = "list",
}: TourResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const mediaRef = useRef<HTMLDivElement>(null);
  const variants = useMemo(() => buildTourOfferVariants(tour), [tour]);
  const detailsId = useId();

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
            {tour.isHot ? (
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
                  className={styles.ratingBadge}
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
                    size={24}
                    weight="fill"
                    className={styles.starIcon}
                  />
                ))}
              </div>
            </div>
            <div className={styles.meta}>
              <div className={styles.metaRow}>
                <MapPin
                  className={accentIconClass}
                  size={24}
                  weight="regular"
                  aria-hidden
                />
                <span>{tour.locationLabel}</span>
              </div>
              <div className={styles.metaRow}>
                <CalendarBlank
                  className={accentIconClass}
                  size={24}
                  weight="regular"
                  aria-hidden
                />
                <span>{tour.dateLabel}</span>
              </div>
              <div className={styles.metaRow}>
                <ForkKnife
                  className={accentIconClass}
                  size={24}
                  weight="regular"
                  aria-hidden
                />
                <span>{tour.mealType}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.side}>
          <div className={styles.sideMeta}>
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
              <Building
                className={accentIconClass}
                size={24}
                weight="regular"
                aria-hidden
              />
              <span>{tour.roomType}</span>
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
            <p className={styles.price}>
              от {tour.priceFrom.toLocaleString("ru-RU")} ₽
            </p>
            <button
              type="button"
              className={styles.more}
              aria-expanded={expanded}
              aria-controls={detailsId}
              onClick={() => setExpanded((v) => !v)}
            >
              подробнее
              <Plus
                className={`${styles.plusIcon} ${expanded ? styles.plusIconOpen : ""}`.trim()}
                size={24}
                weight="regular"
                aria-hidden
              />
            </button>
          </div>
        </div>
      </article>

      {expanded ? (
        <div
          id={detailsId}
          className={styles.variants}
          role="region"
          aria-label="Варианты размещения и даты"
        >
          {variants.map((v) => (
            <div key={v.id} className={styles.variantRow}>
              <div className={styles.variantField}>
                <div className={styles.variantLabelRow}>
                  <CalendarBlank {...variantIconProps} />
                  <span className={styles.variantLabel}>Дата поездки</span>
                </div>
                <p className={styles.variantValue}>{v.dateRangeLabel}</p>
              </div>
              <div className={styles.variantField}>
                <div className={styles.variantLabelRow}>
                  <Dresser {...variantIconProps} />
                  <span className={styles.variantLabel}>Номер</span>
                </div>
                <p className={styles.variantValue}>{v.roomLabel}</p>
              </div>
              <div className={styles.variantField}>
                <div className={styles.variantLabelRow}>
                  <Moon {...variantIconProps} />
                  <span className={styles.variantLabel}>Ночей</span>
                </div>
                <p className={styles.variantValue}>{v.nightsLabel}</p>
              </div>
              <div className={styles.variantField}>
                <div className={styles.variantLabelRow}>
                  <ForkKnife {...variantIconProps} />
                  <span className={styles.variantLabel}>Питание</span>
                </div>
                <p className={styles.variantValue}>{v.mealLabel}</p>
              </div>
              <div className={styles.variantActions}>
                <p className={styles.variantPrice}>
                  {v.priceRub.toLocaleString("ru-RU")} ₽
                </p>
                <button type="button" className={styles.variantCta}>
                  Выбрать
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
