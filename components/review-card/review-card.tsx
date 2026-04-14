"use client";

import { CalendarBlank, MapPin, Star, User } from "@phosphor-icons/react";

import type { ReviewItem } from "@/lib/api/types";

import styles from "./review-card.module.css";

interface ReviewCardProps {
  item: ReviewItem;
}

export function ReviewCard({ item }: ReviewCardProps) {
  const fullStars = Math.min(5, Math.max(0, Math.round(item.rating)));

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.topInner}>
          <div
            className={styles.stars}
            role="img"
            aria-label={`Оценка ${item.rating} из 5`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={i < fullStars ? styles.starOn : styles.starOff}
                size={24}
                weight={i < fullStars ? "fill" : "regular"}
                aria-hidden
              />
            ))}
          </div>
          <p className={styles.text}>{item.text}</p>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.metaRow}>
          <User
            className={styles.metaIcon}
            size={20}
            weight="regular"
            aria-hidden
          />
          <span className={styles.metaText}>{item.author}</span>
        </div>
        <div className={styles.metaRow}>
          <MapPin
            className={styles.metaIcon}
            size={20}
            weight="regular"
            aria-hidden
          />
          <span className={styles.metaText}>{item.locationLabel}</span>
        </div>
        <div className={styles.metaRow}>
          <CalendarBlank
            className={styles.metaIcon}
            size={20}
            weight="regular"
            aria-hidden
          />
          <span className={styles.metaText}>{item.date}</span>
        </div>
      </div>
    </article>
  );
}
