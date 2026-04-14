import type { ReactNode } from "react";

import { Container } from "@/components/container/container";

import styles from "./section-row.module.css";

interface SectionRowProps {
  id?: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /**
   * Narrow viewports: title → grid → action (full-width row).
   * Wide: same row as default — title left, action right, grid below.
   */
  stackActionUnderNarrow?: boolean;
}

export function SectionRow({
  id,
  title,
  action,
  children,
  className,
  stackActionUnderNarrow = false,
}: SectionRowProps) {
  if (stackActionUnderNarrow) {
    return (
      <section
        id={id}
        className={`${styles.section} ${className ?? ""}`.trim()}
      >
        <Container>
          <div className={styles.stack}>
            <h2 className={`${styles.title} ${styles.stackTitleCell}`}>
              {title}
            </h2>
            <div className={styles.stackGrid}>
              <div className={styles.grid}>{children}</div>
            </div>
            {action ? (
              <div className={styles.stackAction}>{action}</div>
            ) : null}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id={id} className={`${styles.section} ${className ?? ""}`.trim()}>
      <Container>
        <div className={styles.head}>
          <h2 className={styles.title}>{title}</h2>
          {action ? <div className={styles.action}>{action}</div> : null}
        </div>
        <div className={styles.grid}>{children}</div>
      </Container>
    </section>
  );
}
