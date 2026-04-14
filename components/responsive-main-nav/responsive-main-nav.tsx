"use client";

import { List, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useId, useState } from "react";

import { MainNav } from "@/components/main-nav/main-nav";

import styles from "./responsive-main-nav.module.css";

interface ResponsiveMainNavProps {
  /** Burger button matches hero (light control on dark header strip) */
  burgerOnDark?: boolean;
}

export function ResponsiveMainNav({ burgerOnDark }: ResponsiveMainNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.desktop}>
        <MainNav />
      </div>
      <button
        type="button"
        className={`${styles.burger} ${burgerOnDark ? styles.burgerOnDark : ""}`.trim()}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <X size={24} weight="bold" aria-hidden />
        ) : (
          <List size={24} weight="bold" aria-hidden />
        )}
      </button>
      {open ? (
        <>
          <div
            className={styles.scrim}
            aria-hidden
            onClick={close}
          />
          <aside
            id={panelId}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Навигация по сайту"
          >
            <div className={styles.panelHead}>
              <p className={styles.panelTitle}>Меню</p>
              <button
                type="button"
                className={styles.closeBtn}
                aria-label="Закрыть меню"
                onClick={close}
              >
                <X size={22} weight="bold" aria-hidden />
              </button>
            </div>
            <MainNav variant="drawer" onNavigate={close} />
          </aside>
        </>
      ) : null}
    </div>
  );
}
