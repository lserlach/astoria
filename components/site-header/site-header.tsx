import type { ReactNode } from "react";
import { EnvelopeSimple, Phone, User } from "@phosphor-icons/react";

import styles from "./site-header.module.css";

interface SiteHeaderProps {
  paddedTop?: boolean;
  /** Light text for dark hero backgrounds */
  onDark?: boolean;
  /** Center column (e.g. main nav) — same row as logo and actions */
  center?: ReactNode;
  /** Extra class for the center wrapper (e.g. overlap offset from hero) */
  centerClassName?: string;
}

export function SiteHeader({
  paddedTop = true,
  onDark,
  center,
  centerClassName,
}: SiteHeaderProps) {
  const headerClass = [
    styles.header,
    paddedTop ? styles.paddedTop : "",
    center ? styles.headerWithCenter : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass}>
      <span className={`${styles.logo} ${onDark ? styles.logoOnDark : ""}`.trim()}>
        Астория
      </span>
      {center ? (
        <div
          className={[styles.headerCenter, centerClassName ?? ""].filter(Boolean).join(" ")}
        >
          {center}
        </div>
      ) : null}
      <div className={styles.actions} role="navigation" aria-label="Контакты">
        <a href="tel:+78000000000" className={styles.iconBtn} aria-label="Телефон">
          <Phone className={styles.iconSvg} size={18} weight="fill" aria-hidden />
        </a>
        <a
          href="mailto:info@tours.ru"
          className={styles.iconBtn}
          aria-label="Email"
        >
          <EnvelopeSimple className={styles.iconSvg} size={18} weight="fill" aria-hidden />
        </a>
        <button type="button" className={styles.iconBtn} aria-label="Профиль">
          <User className={styles.iconSvg} size={18} weight="fill" aria-hidden />
        </button>
      </div>
    </header>
  );
}
