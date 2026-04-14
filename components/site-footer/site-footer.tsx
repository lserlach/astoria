"use client";

import Link from "next/link";

import { HOT_TOURS_SEARCH_HREF } from "@/components/main-nav/main-nav";

import styles from "./site-footer.module.css";

const PALM_LAYERS = [
  "/footer-palm/layer-0.svg",
  "/footer-palm/layer-1.svg",
  "/footer-palm/layer-2.svg",
  "/footer-palm/layer-3.svg",
  "/footer-palm/layer-4.svg",
  "/footer-palm/layer-5.svg",
  "/footer-palm/layer-6.svg",
] as const;

const DESTINATIONS = [
  "Турция",
  "Греция",
  "Мальдивы",
  "Египет",
  "ОАЭ",
  "Таиланд",
  "Испания",
  "Италия",
  "Кипр",
] as const;

export function SiteFooter() {
  return (
    <footer className={styles.wrap}>
      <div className={styles.footerInner}>
        <div className={styles.shell}>
          <div className={styles.palm} aria-hidden>
            {PALM_LAYERS.map((src) => (
              <div key={src} className={styles.palmLayer}>
                <img src={src} alt="" />
              </div>
            ))}
          </div>

          <div className={styles.grid}>
            <div className={styles.colLeft}>
              <nav className={styles.block} aria-labelledby="footer-directions">
                <h2 id="footer-directions" className={styles.heading}>
                  Направления
                </h2>
                <ul className={styles.list}>
                  {DESTINATIONS.map((name) => (
                    <li key={name}>
                      <Link
                        href={`/search?to=${encodeURIComponent(name)}`}
                        className={styles.link}
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav className={styles.block} aria-labelledby="footer-tourists">
                <h2 id="footer-tourists" className={styles.heading}>
                  Туристам
                </h2>
                <ul className={styles.list}>
                  <li>
                    <Link href="/search" className={styles.link}>
                      Бронирование
                    </Link>
                  </li>
                  <li>
                    <Link href={HOT_TOURS_SEARCH_HREF} className={styles.link}>
                      Горящие туры
                    </Link>
                  </li>
                  <li>
                    <Link href="/#special" className={styles.link}>
                      Спецпредложения
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className={styles.colRight}>
              <nav className={styles.blockEnd} aria-labelledby="footer-about">
                <h2 id="footer-about" className={styles.heading}>
                  О компании
                </h2>
                <ul className={styles.list}>
                  <li>
                    <Link href="/#about" className={styles.link}>
                      О нас
                    </Link>
                  </li>
                  <li>
                    <Link href="/#advantages" className={styles.link}>
                      Преимущества
                    </Link>
                  </li>
                  <li>
                    <Link href="/#reviews" className={styles.link}>
                      Отзывы
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className={styles.blockEnd} aria-labelledby="footer-contacts">
                <h2 id="footer-contacts" className={styles.heading}>
                  Контакты
                </h2>
                <ul className={styles.list}>
                  <li>
                    <a href="tel:+78000000000" className={styles.link}>
                      8 - 800 - 000 - 00 - 00
                    </a>
                  </li>
                  <li>
                    <a href="mailto:info@tours.ru" className={styles.link}>
                      info@tours.ru
                    </a>
                  </li>
                  <li>
                    <span className={styles.staticLine}>
                      г. Москва, ул. Примерная, д. 1
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
