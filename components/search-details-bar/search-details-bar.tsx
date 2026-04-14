"use client";

import {
  Building,
  CaretDown,
  FadersHorizontal,
  ForkKnife,
  Globe,
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

  const filters = useSearchStore((s) => s.filters);
  const patch = useSearchStore((s) => s.patchFilters);

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

  const iconPanel = iconPrimary;

  const noopTertiary = useCallback(() => {
    /* Prototype: open filter drawers later */
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.primaryRow}>
        <SearchComboboxCell
          inverse
          icon={<MapPin {...iconPrimary} />}
          labelText="Город вылета"
          value={filters.departureCity}
          onChange={(v) => patch({ departureCity: v })}
          options={CITY_OPTIONS}
          ariaLabel="Город вылета, откуда"
          searchPlaceholder="Откуда"
        />

        <SearchComboboxCell
          inverse
          icon={<Globe {...iconPrimary} />}
          labelText="Страна/Курорт"
          value={filters.countryOrResort}
          onChange={(v) => patch({ countryOrResort: v })}
          options={DESTINATION_OPTIONS}
          ariaLabel="Страна или курорт, куда"
          searchPlaceholder="Куда"
        />

        <SearchDateRangePicker
          inverse
          wrapperClassName={`${barStyles.cell} ${barStyles.cellDates} ${barStyles.cellSelect} ${barStyles.cellInverse}`}
          rangeStart={range.start}
          rangeEnd={range.end}
          onRangeChange={(start, end) => setRange({ start, end })}
          dateLabel={dateLabel}
          dateUnset={!range.start || !range.end}
          labelIconProps={iconPrimary}
        />

        <SearchSelectCell
          inverse
          icon={<Moon {...iconPrimary} />}
          labelText="Кол-во ночей"
          value={filters.nights}
          onChange={(n) => patch({ nights: n })}
          options={NIGHTS.map((n) => ({ value: n, label: String(n) }))}
          ariaLabel="Количество ночей"
        />

        <SearchSelectCell
          inverse
          icon={<User {...iconPrimary} />}
          labelText="Кол-во туристов"
          value={filters.adults}
          onChange={(n) => patch({ adults: n })}
          options={[1, 2, 3, 4].map((n) => ({
            value: n,
            label: `${n} взрослых`,
          }))}
          ariaLabel="Количество взрослых"
        />
      </div>

      <div
        className={`${styles.secondaryRow} ${!filters.advancedBarExpanded ? styles.secondaryRowRoundedBottom : ""}`.trim()}
      >
        <SearchSelectCell<string>
          icon={<Star {...iconPanel} />}
          labelText="Класс отеля"
          value={filters.hotelStars === null ? "" : String(filters.hotelStars)}
          onChange={(v) =>
            patch({ hotelStars: v === "" ? null : Number(v) })
          }
          options={STARS}
          ariaLabel="Класс отеля"
          cellClass={barStyles.cellPanel}
        />

        <SearchSelectCell<string>
          icon={<Building {...iconPanel} />}
          labelText="Тип отеля"
          value={filters.hotelType}
          onChange={(v) => patch({ hotelType: v })}
          options={HOTEL_TYPES.map((t) => ({ value: t, label: t }))}
          ariaLabel="Тип отеля"
          cellClass={barStyles.cellPanel}
        />

        <SearchSelectCell<string>
          icon={<ForkKnife {...iconPanel} />}
          labelText="Питание"
          value={filters.mealType}
          onChange={(v) => patch({ mealType: v })}
          options={MEALS.map((m) => ({ value: m, label: m }))}
          ariaLabel="Тип питания"
          cellClass={barStyles.cellPanel}
        />

        <SearchSelectCell<string>
          icon={<TrendUp {...iconPanel} />}
          labelText="Рейтинг"
          value={filters.ratingMin === null ? "" : String(filters.ratingMin)}
          onChange={(v) =>
            patch({ ratingMin: v === "" ? null : Number(v) })
          }
          options={RATINGS}
          ariaLabel="Минимальный рейтинг"
          cellClass={barStyles.cellPanel}
        />

        <div
          className={`${barStyles.cell} ${barStyles.cellSelect} ${barStyles.cellPanel}`.trim()}
        >
          <div
            className={styles.advancedToggle}
            role="group"
            aria-label="Расширенные параметры поиска"
          >
            <span className={styles.advancedToggleLabel}>
              <FadersHorizontal {...iconPanel} />
              <span className={barStyles.label}>Расширенные</span>
            </span>
            <div className={styles.advancedSeg}>
              <button
                type="button"
                className={`${styles.advancedSegBtn} ${!filters.advancedBarExpanded ? styles.advancedSegBtnActive : ""}`.trim()}
                aria-pressed={!filters.advancedBarExpanded}
                onClick={() => patch({ advancedBarExpanded: false })}
              >
                Нет
              </button>
              <button
                type="button"
                className={`${styles.advancedSegBtn} ${filters.advancedBarExpanded ? styles.advancedSegBtnActive : ""}`.trim()}
                aria-pressed={filters.advancedBarExpanded}
                onClick={() => patch({ advancedBarExpanded: true })}
              >
                Да
              </button>
            </div>
          </div>
        </div>
      </div>

      {filters.advancedBarExpanded ? (
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
              size={24}
              weight="regular"
              aria-hidden
            />
          )}
          Найти туры
        </button>
      </div>
    </div>
  );
}
