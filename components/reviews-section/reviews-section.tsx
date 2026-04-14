"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Container } from "@/components/container/container";
import { ReviewCard } from "@/components/review-card/review-card";

import type { ReviewItem } from "@/lib/api/types";
import carouselNav from "@/components/section-carousel-nav/section-carousel-nav.module.css";
import {
  scrollInfiniteHorizontal,
  trackMaxScroll,
} from "@/lib/infinite-horizontal-carousel-scroll";

import styles from "./reviews-section.module.css";

interface ReviewsSectionProps {
  id?: string;
  items: ReviewItem[];
}

export function ReviewsSection({ id, items }: ReviewsSectionProps) {
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
    const slide = el.querySelector<HTMLElement>(`.${styles.slide}`);
    const gapStr = getComputedStyle(el).gap || "24px";
    const gap = parseFloat(gapStr.split(" ")[0] ?? "24") || 24;
    const step = slide ? slide.offsetWidth + gap : 320;
    scrollInfiniteHorizontal(el, dir, step);
  };

  if (items.length === 0) return null;

  return (
    <section id={id} className={styles.section} aria-labelledby="reviews-heading">
      <Container>
        <div className={styles.head}>
          <h2 id="reviews-heading" className={styles.title}>
            Отзывы наших клиентов
          </h2>
          <div className={styles.nav}>
            <button
              type="button"
              className={carouselNav.btn}
              aria-label="Предыдущие отзывы"
              disabled={!canScroll}
              onClick={() => scrollByDir(-1)}
            >
              <CaretLeft
                className={carouselNav.chevron}
                size={22}
                weight="regular"
                aria-hidden
              />
            </button>
            <button
              type="button"
              className={carouselNav.btn}
              aria-label="Следующие отзывы"
              disabled={!canScroll}
              onClick={() => scrollByDir(1)}
            >
              <CaretRight
                className={carouselNav.chevron}
                size={22}
                weight="regular"
                aria-hidden
              />
            </button>
          </div>
        </div>
        <div ref={trackRef} className={styles.track}>
          {items.map((item) => (
            <div key={item.id} className={styles.slide}>
              <ReviewCard item={item} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
