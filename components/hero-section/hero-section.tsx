"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

import { Container } from "@/components/container/container";
import { ResponsiveMainNav } from "@/components/responsive-main-nav/responsive-main-nav";
import { SiteHeader } from "@/components/site-header/site-header";

import styles from "./hero-section.module.css";

gsap.registerPlugin(useGSAP);

export function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(`.${styles.heroTitle}`, {
        y: 28,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
      });
      gsap.from(`.${styles.heroSub}`, {
        y: 20,
        opacity: 0,
        duration: 0.75,
        delay: 0.12,
        ease: "power2.out",
      });
      gsap.from(`.${styles.navSlot}`, {
        y: 12,
        opacity: 0,
        duration: 0.55,
        delay: 0.08,
        ease: "power2.out",
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.hero}>
      <Container className={styles.shell}>
        <div className={styles.overlap}>
          <SiteHeader
            center={<ResponsiveMainNav burgerOnDark />}
            centerClassName={styles.navSlot}
          />
          <div className={styles.frame}>
            <Image
              src="/hero-beach.png"
              alt=""
              fill
              priority
              className={styles.frameImage}
              sizes="(max-width: 1328px) 100vw, 1200px"
            />
            <div className={styles.frameOverlay} />
            <div className={styles.frameContent}>
              <div className={styles.heroText}>
                <h1 className={styles.heroTitle}>Поиск и бронирование туров</h1>
                <p className={styles.heroSub}>
                  <span className={styles.heroSubLine}>
                    Более 10000 туров по всему миру.
                  </span>
                  <span className={styles.heroSubLine}>
                    Лучшие цены и сервис.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
