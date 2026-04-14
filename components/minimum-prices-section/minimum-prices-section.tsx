"use client";

import { AirplaneTilt, CaretLeft, CaretRight } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Container } from "@/components/container/container";
import type { DirectionPriceItem } from "@/lib/api";
import carouselNav from "@/components/section-carousel-nav/section-carousel-nav.module.css";
import {
  scrollInfiniteHorizontal,
  trackMaxScroll,
} from "@/lib/infinite-horizontal-carousel-scroll";

import styles from "./minimum-prices-section.module.css";

function IconPlaneTilt() {
  return (
    <AirplaneTilt
      className={styles.planeIcon}
      size={22}
      weight="regular"
      aria-hidden
    />
  );
}

interface MinimumPricesSectionProps {
  items: DirectionPriceItem[];
}

export function MinimumPricesSection({ items }: MinimumPricesSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScroll(trackMaxScroll(el) > 2);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [items, updateScrollState]);

  const scrollByDir = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(`a.${styles.card}`);
    const gapStr = getComputedStyle(el).gap || "24px";
    const gap = parseFloat(gapStr.split(" ")[0] ?? "24") || 24;
    const step = card ? card.offsetWidth + gap : 320;
    scrollInfiniteHorizontal(el, dir, step);
  };

  if (items.length === 0) return null;

  return (
    <section
      className={styles.section}
      aria-labelledby="minimum-prices-heading"
    >
      <Container>
        <div className={styles.block}>
          <div className={styles.head}>
            <h2 id="minimum-prices-heading" className={styles.title}>
              Минимальные цены по направлениям
            </h2>
            <div className={styles.nav}>
              <button
                type="button"
                className={`${carouselNav.btn} ${carouselNav.btnOnLight}`}
                aria-label="Предыдущие направления"
                disabled={!canScroll}
                onClick={() => scrollByDir(-1)}
              >
                <CaretLeft className={carouselNav.chevron} size={22} weight="bold" aria-hidden />
              </button>
              <button
                type="button"
                className={`${carouselNav.btn} ${carouselNav.btnOnLight}`}
                aria-label="Следующие направления"
                disabled={!canScroll}
                onClick={() => scrollByDir(1)}
              >
                <CaretRight className={carouselNav.chevron} size={22} weight="bold" aria-hidden />
              </button>
            </div>
          </div>

          <div ref={trackRef} className={styles.track}>
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/search?to=${encodeURIComponent(item.name)}`}
                className={styles.card}
              >
                <div className={styles.imageWrap}>
                  <Image
                    src={item.imageUrl}
                    alt=""
                    fill
                    className={styles.image}
                    sizes="(max-width: 640px) 78vw, (max-width: 960px) 40vw, 33vw"
                  />
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.country}>{item.name}</p>
                  <div className={styles.priceRow}>
                    <IconPlaneTilt />
                    <span>
                      от {item.priceFrom.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
