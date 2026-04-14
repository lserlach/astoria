"use client";

import {
  Airplane,
  ArrowRight,
  Buildings,
  Fire,
  MapPin,
  Star,
  Users,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

import type { PromoCardItem } from "@/lib/api/types";

import styles from "./promo-card.module.css";

const metaIcon = {
  className: styles.metaIcon,
  size: 24,
  weight: "regular" as const,
  "aria-hidden": true as const,
};

interface PromoCardProps {
  item: PromoCardItem;
  href?: string;
}

export function PromoCard({ item, href = "/search" }: PromoCardProps) {
  const hotelName = item.hotelName ?? item.title;
  const rating = item.rating ?? 4.8;
  const stars = item.stars ?? 5;
  const locationLabel = item.locationLabel ?? item.title;
  const charter = item.charter ?? true;
  const roomType = item.roomType ?? "Deluxe";
  const guestsLabel = item.guestsLabel ?? "2 взрослых";

  const ratingText = Number.isInteger(rating)
    ? `${rating}.0`
    : String(rating);

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.link}>
        <div className={styles.imageWrap}>
          <Image
            src={item.imageUrl}
            alt=""
            fill
            className={styles.image}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className={styles.imageShade} aria-hidden />
          {item.badge ? (
            <span className={styles.badge}>
              <Fire className={styles.badgeIcon} size={24} weight="fill" aria-hidden />
              {item.badge}
            </span>
          ) : null}
        </div>

        <div className={styles.body}>
          <div className={styles.titleRow}>
            <h3 className={styles.hotelName}>{hotelName}</h3>
            <span className={styles.ratingBadge} aria-label={`Рейтинг ${rating}`}>
              {ratingText}
            </span>
          </div>
          <div className={styles.stars} aria-hidden>
            {Array.from({ length: stars }).map((_, i) => (
              <Star
                key={i}
                className={styles.starIcon}
                weight="fill"
                aria-hidden
              />
            ))}
          </div>

          <ul className={styles.meta}>
            <li className={styles.metaRow}>
              <MapPin {...metaIcon} />
              <span>{locationLabel}</span>
            </li>
            <li className={styles.metaRow}>
              <Airplane {...metaIcon} />
              <span>{charter ? "Чартер" : "Регулярный рейс"}</span>
            </li>
            <li className={styles.metaRow}>
              <Buildings {...metaIcon} />
              <span>{roomType}</span>
            </li>
            <li className={styles.metaRow}>
              <Users {...metaIcon} />
              <span>{guestsLabel}</span>
            </li>
          </ul>
        </div>

        <div className={styles.footer}>
          <p className={styles.price}>
            от {item.priceFrom.toLocaleString("ru-RU")} ₽
          </p>
          <span className={styles.cta}>
            показать туры
            <ArrowRight
              className={styles.ctaIcon}
              size={24}
              weight="light"
              aria-hidden
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
