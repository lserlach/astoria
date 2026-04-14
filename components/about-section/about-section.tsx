"use client";

import { ArrowRight, Heart } from "@phosphor-icons/react";
import Link from "next/link";

import { Container } from "@/components/container/container";

import styles from "./about-section.module.css";

interface AboutSectionProps {
  id?: string;
}

const tags = [
  "15 лет успешной работы на рынке",
  "50 000+ довольных клиентов",
  "50+ туристических направлений",
  "Награда «Лучшее турагентство 2023»",
  "Официальная лицензия и страхование",
];

export function AboutSection({ id }: AboutSectionProps) {
  return (
    <section id={id} className={styles.section}>
      <Container>
        <div className={styles.frame}>
          <h2 className={styles.heading}>О компании</h2>
          <div className={styles.layout}>
            <div className={styles.copy}>
              <p className={styles.text}>
                Мы — команда профессионалов с 15-летним опытом работы в сфере
                туризма. Наша компания специализируется на организации
                незабываемых путешествий по всему миру, предлагая широкий выбор
                туров для любого бюджета и предпочтений.
              </p>
              <p className={styles.text}>
                За годы работы мы помогли более 50 000 туристов осуществить их
                мечты о путешествиях. Наши опытные менеджеры всегда готовы
                подобрать оптимальный вариант отдыха, учитывая все ваши
                пожелания и особенности.
              </p>
              <p className={styles.text}>
                Мы работаем напрямую с проверенными туроператорами и отельными
                сетями, что позволяет нам гарантировать качество услуг и
                предлагать конкурентные цены.
              </p>
              <p className={styles.text}>
                Система онлайн-бронирования и оплаты делает процесс покупки тура
                максимально простым и безопасным в любое время.
              </p>
            </div>
            <div className={styles.side}>
              <ul className={styles.tags}>
                {tags.map((t) => (
                  <li key={t} className={styles.tag}>
                    <Heart
                      className={styles.heartIcon}
                      size={24}
                      weight="fill"
                      aria-hidden
                    />
                    <span className={styles.tagLabel}>{t}</span>
                  </li>
                ))}
              </ul>
              <Link href="/search" className={styles.more}>
                подробнее о нас
                <ArrowRight
                  className={styles.moreIcon}
                  size={22}
                  weight="regular"
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
