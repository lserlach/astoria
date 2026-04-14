"use client";

import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./text-link-button.module.css";

interface TextLinkButtonProps {
  href: string;
  children: ReactNode;
  /** Below 1024px: full-width chip-style control (desktop stays inline link). */
  narrowFullWidth?: boolean;
}

export function TextLinkButton({
  href,
  children,
  narrowFullWidth = false,
}: TextLinkButtonProps) {
  return (
    <Link
      href={href}
      className={`${styles.btn} ${narrowFullWidth ? styles.btnNarrowFull : ""}`.trim()}
    >
      <span className={styles.label}>{children}</span>
      <ArrowRight className={styles.icon} size={24} weight="light" aria-hidden />
    </Link>
  );
}
