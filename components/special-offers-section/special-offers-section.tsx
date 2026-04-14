"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { Container } from "@/components/container/container";
import { SpecialOfferCard } from "@/components/special-offer-card/special-offer-card";

import type { SpecialOfferItem } from "@/lib/api/types";
import carouselNav from "@/components/section-carousel-nav/section-carousel-nav.module.css";
import {
  scrollInfiniteHorizontal,
  trackMaxScroll,
} from "@/lib/infinite-horizontal-carousel-scroll";

import styles from "./special-offers-section.module.css";

interface SpecialOffersSectionProps {
  id?: string;
  /** Section heading (default: «Спецпредложения»). */
  title?: string;
  /** Link target for each offer card. */
  cardHref?: string;
  /** Desktop carousel: 3 or 4 cards visible (default 3). */
  columns?: 3 | 4;
  items: SpecialOfferItem[];
}

export function SpecialOffersSection({
  id,
  title = "Спецпредложения",
  cardHref = "/search",
  columns = 3,
  items,
}: SpecialOffersSectionProps) {
  const headingId = useId();
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

  const trackClass =
    columns === 4
      ? `${styles.track} ${styles.trackFour}`.trim()
      : styles.track;

  return (
    <section
      id={id}
      className={styles.section}
      aria-labelledby={headingId}
    >
      <Container>
        <div className={styles.head}>
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
          <div className={styles.nav}>
            <button
              type="button"
              className={carouselNav.btn}
              aria-label="Предыдущие спецпредложения"
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
              aria-label="Следующие спецпредложения"
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
        <div ref={trackRef} className={trackClass}>
          {items.map((item) => (
            <div key={item.id} className={styles.slide}>
              <SpecialOfferCard item={item} href={cardHref} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
