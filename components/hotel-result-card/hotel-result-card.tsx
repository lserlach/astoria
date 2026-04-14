"use client";

import { MapPin, Star } from "@phosphor-icons/react";
import Image from "next/image";

import type { Hotel } from "@/lib/api/types";

import styles from "./hotel-result-card.module.css";

interface HotelResultCardProps {
  hotel: Hotel;
  layout?: "list" | "grid";
}

function mapsSearchUrl(hotel: Hotel) {
  const q = `${hotel.name} ${hotel.locationLabel}`.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function HotelResultCard({
  hotel,
  layout = "list",
}: HotelResultCardProps) {
  const summaryText =
    hotel.description?.trim() ||
    `Питание: ${hotel.mealType}. Уточняйте актуальные условия у менеджера.`;

  return (
    <article
      className={`${styles.card} ${layout === "grid" ? styles.cardGrid : ""}`.trim()}
    >
      <div className={styles.media}>
        <Image
          src={hotel.imageUrl}
          alt=""
          fill
          className={styles.image}
          sizes={
            layout === "grid"
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 768px) 100vw, 280px"
          }
        />
        {hotel.firstLine ? (
          <span className={styles.tag}>первая линия</span>
        ) : null}
      </div>

      <div className={styles.body}>
        <div className={styles.top}>
          <div className={styles.titleBlock}>
            <div className={styles.titleRow}>
              <h3 className={styles.title}>{hotel.name}</h3>
              <span className={styles.rating} aria-label={`Рейтинг ${hotel.rating}`}>
                {hotel.rating.toFixed(1)}
              </span>
            </div>
            <div className={styles.stars} aria-label={`${hotel.stars} звёзд`}>
              {Array.from({ length: hotel.stars }, (_, i) => (
                <Star
                  key={i}
                  className={styles.starIcon}
                  size={24}
                  weight="fill"
                  aria-hidden
                />
              ))}
            </div>
          </div>

          <div className={styles.locBlock}>
            <div className={styles.locRow}>
              <MapPin className={styles.locIcon} size={24} weight="fill" aria-hidden />
              <span className={styles.locText}>{hotel.locationLabel}</span>
            </div>
            <a
              href={mapsSearchUrl(hotel)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapLink}
            >
              Показать отель на карте
            </a>
          </div>
        </div>

        <p className={styles.summary}>{summaryText}</p>

        <button type="button" className={styles.priceBtn}>
          от {hotel.priceFrom.toLocaleString("ru-RU")} руб.
        </button>
      </div>
    </article>
  );
}
