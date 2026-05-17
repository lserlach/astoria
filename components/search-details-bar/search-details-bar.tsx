"use client";

import {
  Building,
  CaretDown,
  FadersHorizontal,
  ForkKnife,
  GlobeHemisphereWest,
  MagnifyingGlass,
  MapPin,
  Moon,
  SlidersHorizontal,
  Star,
  TrendUp,
  User,
} from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import barStyles from "@/components/home-search-bar/home-search-bar.module.css";
import {
  SearchComboboxCell,
  SearchSelectCell,
} from "@/components/home-search-bar/search-bar-cells";
import { SearchDateRangePicker } from "@/components/home-search-bar/search-date-range-picker";
import { parseIsoDate } from "@/lib/date-range-utils";
import choiceStyles from "@/components/custom-choice/custom-choice.module.css";
import {
  CITY_OPTIONS,
  DESTINATION_OPTIONS,
} from "@/lib/search-location-options";
import { useSearchStore } from "@/stores/search-store";

import styles from "./search-details-bar.module.css";

const NIGHTS = [3, 5, 7, 9, 10, 12, 14];

const STARS: Array<{ value: string; label: string }> = [
  { value: "", label: "Любой" },
  { value: "3", label: "3★" },
  { value: "4", label: "4★" },
  { value: "5", label: "5★" },
];

const MEALS = ["Любое", "AI", "UAI", "BB", "HB", "FB"];

const RATINGS: Array<{ value: string; label: string }> = [
  { value: "", label: "Любой" },
  { value: "4.5", label: "4.5+" },
  { value: "4", label: "4+" },
  { value: "3.5", label: "3.5+" },
];

const HOTEL_TYPES = ["Любой", "Семейный", "Премиум", "Бутик"];

export interface SearchDetailsBarProps {
  onSearch: () => void | Promise<void>;
  loading?: boolean;
}

export function SearchDetailsBar({
  onSearch,
  loading = false,
}: SearchDetailsBarProps) {
  const searchParams = useSearchParams();
  const queryKey = searchParams.toString();

  const tab = useSearchStore((s) => s.tab);
  const filters = useSearchStore((s) => s.filters);
  const patch = useSearchStore((s) => s.patchFilters);

  const isTourSearch = tab === "tours";

  const [range, setRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  useEffect(() => {
    const sp = new URLSearchParams(queryKey);
    const df = sp.get("dateFrom");
    const dt = sp.get("dateTo");
    if (df && dt) {
      const start = parseIsoDate(df);
      const end = parseIsoDate(dt);
      if (start && end) {
        setRange({ start, end });
      }
    }
  }, [queryKey]);

  const dateLabel = useMemo(() => {
    if (!range.start || !range.end) return "Выберите даты";
    const fmt = new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
    });
    return `${fmt.format(range.start)} - ${fmt.format(range.end)} (${filters.nights} ночей)`;
  }, [range.start, range.end, filters.nights]);

  const iconPrimary = useMemo(
    () => ({
      className: barStyles.icon,
      size: 20,
      weight: "regular" as const,
      "aria-hidden": true as const,
    }),
    [],
  );

  const iconStrip = useMemo(
    () => ({
      className: barStyles.icon,
      size: 24,
      weight: "regular" as const,
      "aria-hidden": true as const,
    }),
    [],
  );

  const primaryCell = barStyles.cellSearchDetails;

  const noopTertiary = useCallback(() => {
    /* Prototype: open filter drawers later */
  }, []);

  const searchCtaLabel = isTourSearch ? "Найти туры" : "Найти отели";

  return (
    <div className={styles.card}>
      <div
        className={`${styles.topCluster} ${isTourSearch ? styles.topClusterWithStrip : styles.topClusterBaseOnly}`.trim()}
      >
        <div
          className={`${styles.primaryRow} ${isTourSearch ? "" : styles.primaryRowRoundedBottom}`.trim()}
        >
          <SearchComboboxCell
            icon={<MapPin {...iconPrimary} />}
            labelText="Город вылета"
            value={filters.departureCity}
            onChange={(v) => patch({ departureCity: v })}
            options={CITY_OPTIONS}
            ariaLabel="Город вылета, откуда"
            searchPlaceholder="Откуда"
            cellClass={primaryCell}
          />

          <SearchComboboxCell
            icon={<GlobeHemisphereWest {...iconPrimary} />}
            labelText="Страна/Курорт"
            value={filters.countryOrResort}
            onChange={(v) => patch({ countryOrResort: v })}
            options={DESTINATION_OPTIONS}
            ariaLabel="Страна или курорт, куда"
            searchPlaceholder="Куда"
            cellClass={primaryCell}
          />

          <SearchDateRangePicker
            wrapperClassName={`${barStyles.cell} ${barStyles.cellDates} ${barStyles.cellSelect} ${primaryCell}`.trim()}
            rangeStart={range.start}
            rangeEnd={range.end}
            onRangeChange={(start, end) => setRange({ start, end })}
            dateLabel={dateLabel}
            dateUnset={!range.start || !range.end}
            searchDetailsStyle
            labelIconProps={iconPrimary}
          />

          <SearchSelectCell
            icon={<Moon {...iconPrimary} />}
            labelText="Кол-во ночей"
            value={filters.nights}
            onChange={(n) => patch({ nights: n })}
            options={NIGHTS.map((n) => ({ value: n, label: String(n) }))}
            ariaLabel="Количество ночей"
            cellClass={primaryCell}
          />

          <SearchSelectCell
            icon={<User {...iconPrimary} />}
            labelText="Кол-во туристов"
            value={filters.adults}
            onChange={(n) => patch({ adults: n })}
            options={[1, 2, 3, 4].map((n) => ({
              value: n,
              label: `${n} взрослых`,
            }))}
            ariaLabel="Количество взрослых"
            cellClass={primaryCell}
          />

          <div className={styles.searchBtnSlot}>
            <button
              type="button"
              className={styles.findBtn}
              disabled={loading}
              aria-busy={loading}
              onClick={() => void onSearch()}
            >
              {loading ? (
                <span className={styles.spinner} aria-hidden />
              ) : (
                <MagnifyingGlass
                  className={styles.findBtnIcon}
                  size={16}
                  weight="regular"
                  aria-hidden
                />
              )}
              {searchCtaLabel}
            </button>
          </div>
        </div>

        {isTourSearch ? (
          <div
            className={`${styles.filterStrip} ${!filters.advancedBarExpanded ? styles.filterStripRoundedBottom : ""}`.trim()}
          >
            <SearchSelectCell<string>
              strip
              icon={<Star {...iconStrip} />}
              labelText="Класс отеля"
              value={filters.hotelStars === null ? "" : String(filters.hotelStars)}
              onChange={(v) =>
                patch({ hotelStars: v === "" ? null : Number(v) })
              }
              options={STARS}
              ariaLabel="Класс отеля"
            />

            <SearchSelectCell<string>
              strip
              icon={<ForkKnife {...iconStrip} />}
              labelText="Питание"
              value={filters.mealType}
              onChange={(v) => patch({ mealType: v })}
              options={MEALS.map((m) => ({ value: m, label: m }))}
              ariaLabel="Тип питания"
            />

            <SearchSelectCell<string>
              strip
              icon={<TrendUp {...iconStrip} />}
              labelText="Рейтинг"
              value={filters.ratingMin === null ? "" : String(filters.ratingMin)}
              onChange={(v) =>
                patch({ ratingMin: v === "" ? null : Number(v) })
              }
              options={RATINGS}
              ariaLabel="Минимальный рейтинг"
            />

            <SearchSelectCell<string>
              strip
              icon={<Building {...iconStrip} />}
              labelText="Тип отеля"
              value={filters.hotelType}
              onChange={(v) => patch({ hotelType: v })}
              options={HOTEL_TYPES.map((t) => ({ value: t, label: t }))}
              ariaLabel="Тип отеля"
            />

            <button
              type="button"
              className={styles.stripAdvanced}
              aria-pressed={filters.advancedBarExpanded}
              aria-label="Расширенные параметры поиска"
              onClick={() =>
                patch({ advancedBarExpanded: !filters.advancedBarExpanded })
              }
            >
              <FadersHorizontal {...iconStrip} />
              <span className={styles.stripAdvancedLabel}>Расширенные</span>
            </button>
          </div>
        ) : null}

        {isTourSearch && filters.advancedBarExpanded ? (
          <div className={styles.tertiaryRow}>
            <button
              type="button"
              className={styles.tertiaryCell}
              onClick={noopTertiary}
            >
              В номере
              <CaretDown className={styles.tertiaryChevron} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.tertiaryCell}
              onClick={noopTertiary}
            >
              Пляж и расположение
              <CaretDown className={styles.tertiaryChevron} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.tertiaryCell}
              onClick={noopTertiary}
            >
              Туроператоры
              <CaretDown className={styles.tertiaryChevron} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.tertiaryCell}
              onClick={noopTertiary}
            >
              Бюджет
              <SlidersHorizontal className={styles.budgetIcon} aria-hidden />
            </button>
          </div>
        ) : null}
      </div>

      <div className={styles.footer}>
        <label
          className={`${styles.charterLabel} ${choiceStyles.choice}`.trim()}
        >
          <input
            type="checkbox"
            className={choiceStyles.input}
            checked={filters.hotelGuarantee}
            onChange={(e) => patch({ hotelGuarantee: e.target.checked })}
          />
          <span className={choiceStyles.checkVisual} aria-hidden />
          <span>Гарантия мест в отеле</span>
        </label>
      </div>
    </div>
  );
}
