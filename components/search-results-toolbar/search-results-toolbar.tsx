"use client";

import {
  AirplaneTilt,
  CaretDown,
  Columns,
  Flame,
  Rows,
} from "@phosphor-icons/react";

import choiceStyles from "@/components/custom-choice/custom-choice.module.css";
import type { SortOption } from "@/lib/api/types";
import { useSearchStore } from "@/stores/search-store";

import styles from "./search-results-toolbar.module.css";

export type ResultsViewMode = "list" | "grid";

export interface SearchResultsToolbarProps {
  resultsView?: ResultsViewMode;
  onResultsViewChange?: (view: ResultsViewMode) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "price_asc", label: "Сначала дешевле" },
  { value: "price_desc", label: "Сначала дороже" },
  { value: "rating_desc", label: "По рейтингу" },
  { value: "date_asc", label: "По дате вылета" },
];

export function SearchResultsToolbar({
  resultsView = "list",
  onResultsViewChange,
}: SearchResultsToolbarProps) {
  const sort = useSearchStore((s) => s.sort);
  const setSort = useSearchStore((s) => s.setSort);
  const runSearch = useSearchStore((s) => s.runSearch);
  const charterOnly = useSearchStore((s) => s.filters.charterOnly);
  const hotOnly = useSearchStore((s) => s.filters.hotOnly);
  const patchFilters = useSearchStore((s) => s.patchFilters);

  const handleSort = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as SortOption);
    await runSearch();
  };

  const handleCharter = async (e: React.ChangeEvent<HTMLInputElement>) => {
    patchFilters({ charterOnly: e.target.checked });
    await runSearch();
  };

  const handleHot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    patchFilters({ hotOnly: e.target.checked });
    await runSearch();
  };

  return (
    <div className={styles.bar}>
      <div className={styles.filtres}>
        <label className={styles.sortWrap}>
          <span className={styles.sortText}>Сортировать</span>
          <CaretDown
            className={styles.sortChevron}
            size={24}
            weight="regular"
            aria-hidden
          />
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={handleSort}
            aria-label="Сортировать"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label
          className={`${choiceStyles.choice} ${styles.filterRow}`.trim()}
        >
          <input
            type="checkbox"
            className={choiceStyles.input}
            checked={charterOnly}
            onChange={handleCharter}
          />
          <span className={choiceStyles.checkVisual} aria-hidden />
          <AirplaneTilt
            className={styles.filterIconCharter}
            size={24}
            weight="regular"
            aria-hidden
          />
          <span className={styles.filterCaption}>Только чартерные</span>
        </label>

        <label
          className={`${choiceStyles.choice} ${styles.filterRow}`.trim()}
        >
          <input
            type="checkbox"
            className={choiceStyles.input}
            checked={hotOnly}
            onChange={handleHot}
          />
          <span className={choiceStyles.checkVisual} aria-hidden />
          <Flame
            className={styles.filterIconHot}
            size={24}
            weight="regular"
            aria-hidden
          />
          <span className={styles.filterCaption}>Только горящие</span>
        </label>
      </div>

      {onResultsViewChange ? (
        <div className={styles.viewIcons} role="group" aria-label="Вид списка">
          <button
            type="button"
            className={`${styles.viewIconBtn} ${resultsView === "grid" ? styles.viewIconBtnActive : ""}`.trim()}
            aria-pressed={resultsView === "grid"}
            title="Плиткой"
            onClick={() => onResultsViewChange("grid")}
          >
            <Columns size={32} weight="regular" aria-hidden />
          </button>
          <button
            type="button"
            className={`${styles.viewIconBtn} ${resultsView === "list" ? styles.viewIconBtnActive : ""}`.trim()}
            aria-pressed={resultsView === "list"}
            title="Строки"
            onClick={() => onResultsViewChange("list")}
          >
            <Rows size={32} weight="regular" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
