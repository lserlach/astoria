"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/container/container";
import { HotelResultCard } from "@/components/hotel-result-card/hotel-result-card";
import { SearchDetailsBar } from "@/components/search-details-bar/search-details-bar";
import { SearchLeadPromoCard } from "@/components/search-lead-promo-card/search-lead-promo-card";
import { SearchFiltersSidebar } from "@/components/search-filters-sidebar/search-filters-sidebar";
import { SearchResultsToolbar } from "@/components/search-results-toolbar/search-results-toolbar";
import { SiteFooter } from "@/components/site-footer/site-footer";
import { ResponsiveMainNav } from "@/components/responsive-main-nav/responsive-main-nav";
import { SiteHeader } from "@/components/site-header/site-header";
import { TourResultCard } from "@/components/tour-result-card/tour-result-card";
import type { SearchFilters } from "@/lib/api/types";
import { useSearchStore } from "@/stores/search-store";

import styles from "./search-page.module.css";

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [resultsView, setResultsView] = useState<"list" | "grid">("list");

  const hydrateFromHome = useSearchStore((s) => s.hydrateFromHome);
  const runSearch = useSearchStore((s) => s.runSearch);
  const loading = useSearchStore((s) => s.loading);
  const tab = useSearchStore((s) => s.tab);
  const tours = useSearchStore((s) => s.tours);
  const hotels = useSearchStore((s) => s.hotels);
  const toursTotal = useSearchStore((s) => s.toursTotal);
  const hotelsTotal = useSearchStore((s) => s.hotelsTotal);

  const queryKey = searchParams.toString();

  useEffect(() => {
    const params = new URLSearchParams(queryKey);
    const to = params.get("to");
    const from = params.get("from");
    const nights = params.get("nights");
    const adults = params.get("adults");
    const patch: Partial<SearchFilters> = {};
    if (to) patch.countryOrResort = decodeURIComponent(to);
    if (from) patch.departureCity = decodeURIComponent(from);
    if (nights) {
      const n = Number(nights);
      if (!Number.isNaN(n)) patch.nights = n;
    }
    if (adults) {
      const a = Number(adults);
      if (!Number.isNaN(a)) patch.adults = a;
    }
    const hotRaw = params.get("hotOnly");
    if (hotRaw !== null) {
      const v = hotRaw.toLowerCase();
      if (v === "1" || v === "true" || v === "yes" || v === "") {
        patch.hotOnly = true;
      } else if (v === "0" || v === "false" || v === "no") {
        patch.hotOnly = false;
      }
    }
    if (Object.keys(patch).length > 0) {
      hydrateFromHome(patch);
    }
    void runSearch();
  }, [hydrateFromHome, runSearch, queryKey]);

  const handlePrimarySearch = async () => {
    await runSearch();
  };

  return (
    <div className={styles.page}>
      <Container>
        <div className={styles.top}>
          <SiteHeader paddedTop center={<ResponsiveMainNav />} />
        </div>
        <Link className={styles.back} href="/">
          ← На главную
        </Link>

        <SearchDetailsBar onSearch={handlePrimarySearch} loading={loading} />

        <header className={styles.resultsHead}>
          <h1 className={styles.resultsTitle}>Результаты поиска</h1>
          <p className={styles.resultsCount} aria-live="polite">
            {loading
              ? "Загрузка…"
              : tab === "tours"
                ? `Найдено туров: ${toursTotal}`
                : `Найдено отелей: ${hotelsTotal}`}
          </p>
        </header>

        <button
          type="button"
          className={styles.filtersToggle}
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((v) => !v)}
        >
          {filtersOpen ? "Скрыть фильтры" : "Фильтры"}
        </button>

        <div className={styles.layout}>
          <div
            className={`${styles.sidebarWrap} ${filtersOpen ? styles.sidebarOpen : ""}`.trim()}
          >
            <SearchFiltersSidebar />
          </div>
          <div className={styles.main}>
            {loading ? (
              <div
                className={styles.resultsLoading}
                role="status"
                aria-live="polite"
                aria-busy="true"
              >
                <span className={styles.resultsLoadingSpinner} aria-hidden />
                <span>Загрузка результатов…</span>
              </div>
            ) : null}
            <SearchResultsToolbar
              resultsView={resultsView}
              onResultsViewChange={setResultsView}
            />
            <div
              className={`${styles.list} ${resultsView === "grid" ? styles.listGrid : ""} ${loading ? styles.listDimmed : ""}`.trim()}
            >
              {tab === "tours"
                ? tours.flatMap((t, i) => {
                    const nodes = [
                      <TourResultCard
                        key={t.id}
                        tour={t}
                        layout={resultsView}
                      />,
                    ];
                    const insertLeadPromo =
                      (tours.length >= 3 && i === 2) ||
                      (tours.length > 0 &&
                        tours.length < 3 &&
                        i === tours.length - 1);
                    if (insertLeadPromo) {
                      nodes.push(
                        <SearchLeadPromoCard
                          key="search-lead-promo"
                          layout={resultsView}
                        />,
                      );
                    }
                    return nodes;
                  })
                : hotels.flatMap((h, i) => {
                    const nodes = [
                      <HotelResultCard
                        key={h.id}
                        hotel={h}
                        layout={resultsView}
                      />,
                    ];
                    const insertLeadPromo =
                      (hotels.length >= 3 && i === 2) ||
                      (hotels.length > 0 &&
                        hotels.length < 3 &&
                        i === hotels.length - 1);
                    if (insertLeadPromo) {
                      nodes.push(
                        <SearchLeadPromoCard
                          key="search-lead-promo"
                          layout={resultsView}
                        />,
                      );
                    }
                    return nodes;
                  })}
            </div>
            {!loading && tab === "tours" && tours.length === 0 ? (
              <p className={styles.empty}>По заданным параметрам туры не найдены.</p>
            ) : null}
            {!loading && tab === "hotels" && hotels.length === 0 ? (
              <p className={styles.empty}>По заданным параметрам отели не найдены.</p>
            ) : null}
          </div>
        </div>
      </Container>
      <div className={styles.footerSpacer}>
        <Container>
          <SiteFooter />
        </Container>
      </div>
    </div>
  );
}
