"use client";

import Image from "next/image";

import { Container } from "@/components/container/container";

import styles from "./seo-section.module.css";

const DEFAULT_BG = "/images/seo/seo-block-bg.jpg";

interface SeoSectionProps {
  id?: string;
  title?: string;
  body?: string;
  imageSrc?: string;
}

export function SeoSection({
  id,
  title = "SEO текст",
  body = "Турция — одно из самых популярных туристических направлений, сочетающее богатую историю, прекрасные пляжи и отличный сервис. Идеально подходит для семейного отдыха и молодежных туров.",
  imageSrc = DEFAULT_BG,
}: SeoSectionProps) {
  return (
    <section
      id={id}
      className={styles.section}
      aria-labelledby="seo-block-heading"
    >
      <Container>
        <div className={styles.block}>
          <div className={styles.bg} aria-hidden>
            <Image
              src={imageSrc}
              alt=""
              fill
              className={styles.bgImage}
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority={false}
            />
            <div className={styles.bgOverlay} />
          </div>
          <div className={styles.content}>
            <h2 className={styles.title} id="seo-block-heading">
              {title}
            </h2>
            <p className={styles.text}>{body}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
