"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import styles from "./main-nav.module.css";

/** Search with «Только горящие» pre-enabled (toolbar + API filter). */
export const HOT_TOURS_SEARCH_HREF = "/search?hotOnly=1" as const;

export const MAIN_NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/search", label: "Поиск туров" },
  { href: "/directions", label: "Направления и страны" },
  { href: HOT_TOURS_SEARCH_HREF, label: "Горящие туры" },
  { href: "/#about", label: "О компании" },
] as const;

function linkActive(
  pathname: string,
  href: string,
  searchParams: URLSearchParams,
): boolean {
  if (href === "/") return pathname === "/";

  const [pathOnly, queryString] = href.split("?");
  if (!pathOnly.startsWith("/")) return false;

  if (queryString) {
    if (pathname !== pathOnly) return false;
    const required = new URLSearchParams(queryString);
    for (const key of required.keys()) {
      if (required.get(key) !== searchParams.get(key)) return false;
    }
    return true;
  }

  if (!(pathname === pathOnly || pathname.startsWith(`${pathOnly}/`))) {
    return false;
  }
  if (pathOnly === "/search" && searchParams.get("hotOnly") === "1") {
    return false;
  }
  return true;
}

interface MainNavProps {
  /** Stacked links for mobile drawer */
  variant?: "bar" | "drawer";
  onNavigate?: () => void;
}

function MainNavLabels({
  variant = "bar",
  onNavigate,
  pathname,
  searchParams,
}: MainNavProps & {
  pathname: string;
  searchParams: URLSearchParams;
}) {
  const isDrawer = variant === "drawer";

  return (
    <nav
      className={isDrawer ? styles.navDrawer : styles.nav}
      aria-label="Основное меню"
    >
      {MAIN_NAV_LINKS.map(({ href, label }) => {
        const active = linkActive(pathname, href, searchParams);
        return (
          <Link
            key={href + label}
            href={href}
            className={`${isDrawer ? styles.linkDrawer : styles.link} ${active ? (isDrawer ? styles.activeDrawer : styles.active) : ""}`.trim()}
            onClick={onNavigate}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function MainNavWithSearchParams(props: MainNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <MainNavLabels
      {...props}
      pathname={pathname}
      searchParams={searchParams}
    />
  );
}

function MainNavSearchParamsFallback(props: MainNavProps) {
  const pathname = usePathname();
  return (
    <MainNavLabels
      {...props}
      pathname={pathname}
      searchParams={new URLSearchParams()}
    />
  );
}

export function MainNav(props: MainNavProps) {
  return (
    <Suspense fallback={<MainNavSearchParamsFallback {...props} />}>
      <MainNavWithSearchParams {...props} />
    </Suspense>
  );
}
