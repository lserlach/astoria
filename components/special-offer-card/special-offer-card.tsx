"use client";

import { ArrowRight, MapPin } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

import type { SpecialOfferItem } from "@/lib/api/types";

import styles from "./special-offer-card.module.css";

interface SpecialOfferCardProps {
  item: SpecialOfferItem;
  href?: string;
}

export function SpecialOfferCard({ item, href = "/search" }: SpecialOfferCardProps) {
  const scope = item.scopeLabel ?? "Все направления";
  const cta = item.ctaLabel ?? "подробнее";

  return (
    <article className={styles.root}>
      <Link href={href} className={styles.card}>
        <div className={styles.lead}>
          <div className={styles.copy}>
            <div className={styles.titleRow}>
              <h3 className={styles.title}>{item.title}</h3>
              {item.discountLabel ? (
                <span className={styles.badge}>{item.discountLabel}</span>
              ) : null}
            </div>
            <p className={styles.description}>{item.description}</p>
          </div>
          <div className={styles.scope}>
            <MapPin
              className={styles.scopeIcon}
              size={24}
              weight="regular"
              aria-hidden
            />
            <span className={styles.scopeText}>{scope}</span>
          </div>
        </div>

        <span className={styles.cta}>
          {cta}
          <ArrowRight
            className={styles.ctaIcon}
            size={24}
            weight="thin"
            aria-hidden
          />
        </span>

        <div className={styles.imageWrap}>
          <Image
            src={item.imageUrl}
            alt=""
            fill
            className={styles.image}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Link>
    </article>
  );
}
