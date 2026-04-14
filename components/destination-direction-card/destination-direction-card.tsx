"use client";

import { MapPin } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

import { TextLinkButton } from "@/components/text-link-button/text-link-button";

import styles from "./destination-direction-card.module.css";

interface DestinationDirectionCardProps {
  name: string;
  description: string;
  /** e.g. "35 000" (spaces as thousands separators) */
  priceAmount: string;
  imageSrc: string;
  searchHref: string;
  /** Country detail page; title links here when set */
  countryHref?: string;
  /** Spans full grid width (e.g. Maldives row in Figma) */
  fullWidth?: boolean;
}

export function DestinationDirectionCard({
  name,
  description,
  priceAmount,
  imageSrc,
  searchHref,
  countryHref,
  fullWidth = false,
}: DestinationDirectionCardProps) {
  const directionHref = countryHref ?? searchHref;

  return (
    <article
      className={`${styles.card} ${fullWidth ? styles.cardFull : ""}`.trim()}
    >
      <Link
        href={directionHref}
        className={styles.cardHit}
        aria-label={`${name} — страница направления`}
      />
      <div className={styles.cardInner}>
        <div className={styles.imageWrap}>
          <Image
            src={imageSrc}
            alt=""
            fill
            className={styles.image}
            sizes={
              fullWidth
                ? "(max-width: 640px) 100vw, 1200px"
                : "(max-width: 640px) 100vw, 50vw"
            }
          />
          <div className={styles.imageShade} aria-hidden />
        </div>

        <div className={styles.body}>
          <div className={styles.titleRow}>
            <MapPin className={styles.pin} size={24} weight="fill" aria-hidden />
            <h2 className={styles.title}>{name}</h2>
          </div>
          <p className={styles.desc}>{description}</p>
        </div>

        <div className={styles.footer}>
          <p className={styles.price}>
            от {priceAmount}
            <span className={styles.currency}> ₽</span>
          </p>
          <div className={styles.ctaWrap}>
            <TextLinkButton href={searchHref}>смотреть туры</TextLinkButton>
          </div>
        </div>
      </div>
    </article>
  );
}
