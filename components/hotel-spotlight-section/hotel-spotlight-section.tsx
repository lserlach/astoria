"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Container } from "@/components/container/container";
import carouselNav from "@/components/section-carousel-nav/section-carousel-nav.module.css";
import {
  scrollInfiniteHorizontal,
  trackMaxScroll,
} from "@/lib/infinite-horizontal-carousel-scroll";

import styles from "./hotel-spotlight-section.module.css";

interface HotelSpotlightSectionProps {
  id?: string;
  title: string;
  children: ReactNode;
}

export function HotelSpotlightSection({
  id,
  title,
  children,
}: HotelSpotlightSectionProps) {
  const headingId = useId();
  const trackId = useId();
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
  }, [children, updateScrollState]);

  const scrollByDir = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const slide = el.firstElementChild as HTMLElement | null;
    const gapStr = getComputedStyle(el).gap || "24px";
    const gap = parseFloat(gapStr.split(" ")[0] ?? "24") || 24;
    const step = slide ? slide.offsetWidth + gap : 320;
    scrollInfiniteHorizontal(el, dir, step);
  };

  const slides = Children.toArray(children).map((child, index) => {
    if (!isValidElement(child)) return null;
    return (
      <div key={child.key ?? `slide-${index}`} className={styles.slide}>
        {child}
      </div>
    );
  });

  return (
    <section
      id={id}
      className={styles.section}
      aria-labelledby={headingId}
    >
      <Container>
        <div className={styles.block}>
          <div className={styles.head}>
            <h2 id={headingId} className={styles.title}>
              {title}
            </h2>
            <div className={styles.nav}>
              <button
                type="button"
                className={carouselNav.btn}
                aria-label="Предыдущие отели"
                aria-controls={trackId}
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
                aria-label="Следующие отели"
                aria-controls={trackId}
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

          <div
            id={trackId}
            ref={trackRef}
            className={styles.track}
            tabIndex={0}
            role="region"
            aria-label="Карусель отелей"
          >
            {slides}
          </div>
        </div>
      </Container>
    </section>
  );
}
