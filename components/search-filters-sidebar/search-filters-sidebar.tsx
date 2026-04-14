"use client";

import { AirplaneTilt, ArrowRight, CaretDown, Star } from "@phosphor-icons/react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import choiceStyles from "@/components/custom-choice/custom-choice.module.css";
import { useSearchStore } from "@/stores/search-store";

import styles from "./search-filters-sidebar.module.css";

const RESORTS_TR = [
  "Анталия",
  "Алания",
  "Бодрум",
  "Кемер",
  "Фетхие",
  "Мармарис",
  "Кушадасы",
];

const MEAL_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "Любое", label: "Любое" },
  { value: "BB", label: "BB - Только завтрак" },
  { value: "HB", label: "HB - Завтрак, ужин" },
  { value: "FB", label: "FB - Полный пансион" },
  { value: "AI", label: "AI - Всё включено" },
  { value: "UAI", label: "UAI - Ультра всё включено" },
  { value: "RO", label: "RO - Без питания" },
];

const RATING_ROWS: Array<{
  value: number | null;
  pillClass?: string;
  pillText?: string;
}> = [
  { value: null },
  { value: 4.5, pillClass: styles.ratingPill45, pillText: "4,5" },
  { value: 4, pillClass: styles.ratingPill4, pillText: "4" },
  { value: 3.5, pillClass: styles.ratingPill35, pillText: "3,5" },
  { value: 3, pillClass: styles.ratingPill3, pillText: "3" },
];

function formatThousandsInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function parseThousands(s: string): number | null {
  const digits = s.replace(/\s/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className={styles.section}>
      <button
        type="button"
        className={styles.sectionHead}
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className={styles.sectionTitle}>{title}</span>
        <CaretDown
          className={`${styles.sectionChevron} ${open ? styles.sectionChevronOpen : ""}`.trim()}
          size={20}
          weight="regular"
          aria-hidden
        />
      </button>
      {open ? <div className={styles.sectionBody}>{children}</div> : null}
    </div>
  );
}

export function SearchFiltersSidebar() {
  const filters = useSearchStore((s) => s.filters);
  const patch = useSearchStore((s) => s.patchFilters);
  const toggleResort = useSearchStore((s) => s.toggleResort);
  const runSearch = useSearchStore((s) => s.runSearch);
  const resetFilters = useSearchStore((s) => s.resetFilters);

  const [moreOpen, setMoreOpen] = useState(false);
  const [secHotel, setSecHotel] = useState(true);
  const [secMeal, setSecMeal] = useState(true);
  const [secRating, setSecRating] = useState(true);
  const [secResort, setSecResort] = useState(true);
  const [secRoom, setSecRoom] = useState(true);
  const [secBeach, setSecBeach] = useState(true);
  const [secPrice, setSecPrice] = useState(true);

  const [priceMinInput, setPriceMinInput] = useState("");
  const [priceMaxInput, setPriceMaxInput] = useState("");

  useEffect(() => {
    setPriceMinInput(
      filters.priceMin != null ? formatThousandsInput(String(filters.priceMin)) : "",
    );
    setPriceMaxInput(
      filters.priceMax != null ? formatThousandsInput(String(filters.priceMax)) : "",
    );
  }, [filters.priceMin, filters.priceMax]);

  const handleApply = async () => {
    const min = parseThousands(priceMinInput);
    const max = parseThousands(priceMaxInput);
    patch({
      priceMin: min,
      priceMax: max,
    });
    await runSearch();
  };

  const handleReset = async () => {
    resetFilters();
    setPriceMinInput("");
    setPriceMaxInput("");
    await runSearch();
  };

  const starRow = useCallback(
    (count: 3 | 4 | 5, flag: "stars3" | "stars4" | "stars5") => (
      <label
        key={flag}
        className={`${styles.optionRow} ${choiceStyles.choice}`.trim()}
      >
        <input
          type="checkbox"
          className={choiceStyles.input}
          checked={filters[flag]}
          onChange={(e) => patch({ [flag]: e.target.checked })}
        />
        <span className={choiceStyles.checkVisual} aria-hidden />
        <span className={styles.starStrip}>
          {Array.from({ length: count }, (_, i) => (
            <Star
              key={i}
              className={styles.starIcon}
              size={20}
              weight="fill"
              aria-hidden
            />
          ))}
        </span>
      </label>
    ),
    [filters, patch],
  );

  return (
    <aside className={styles.aside}>
      <h2 className={styles.title}>Фильтры</h2>

      <div className={styles.sections}>
        <FilterSection
          title="Отель"
          open={secHotel}
          onToggle={() => setSecHotel((v) => !v)}
        >
          {starRow(3, "stars3")}
          {starRow(4, "stars4")}
          {starRow(5, "stars5")}
          <label
            className={`${styles.optionRow} ${choiceStyles.choice}`.trim()}
          >
            <input
              type="checkbox"
              className={choiceStyles.input}
              checked={filters.firstLineHotel}
              onChange={(e) => patch({ firstLineHotel: e.target.checked })}
            />
            <span className={choiceStyles.checkVisual} aria-hidden />
            <span className={styles.optionLabel}>Первая линия</span>
          </label>
        </FilterSection>

        <FilterSection
          title="Питание"
          open={secMeal}
          onToggle={() => setSecMeal((v) => !v)}
        >
          {MEAL_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`${styles.optionRow} ${choiceStyles.choice}`.trim()}
            >
              <input
                type="radio"
                className={choiceStyles.input}
                name="meal-filter-sidebar"
                checked={filters.mealType === opt.value}
                onChange={() => patch({ mealType: opt.value })}
              />
              <span className={choiceStyles.radioVisual} aria-hidden />
              <span className={styles.optionLabel}>{opt.label}</span>
            </label>
          ))}
        </FilterSection>

        <FilterSection
          title="Рейтинг"
          open={secRating}
          onToggle={() => setSecRating((v) => !v)}
        >
          {RATING_ROWS.map((row) => (
            <label
              key={String(row.value)}
              className={`${styles.optionRow} ${choiceStyles.choice}`.trim()}
            >
              <input
                type="radio"
                className={choiceStyles.input}
                name="rating-filter-sidebar"
                checked={
                  row.value === null
                    ? filters.ratingMin === null
                    : filters.ratingMin === row.value
                }
                onChange={() => patch({ ratingMin: row.value })}
              />
              <span className={choiceStyles.radioVisual} aria-hidden />
              {row.pillClass && row.pillText ? (
                <>
                  <span className={row.pillClass}>{row.pillText}</span>
                  <span className={styles.ratingSuffix}>и более</span>
                </>
              ) : (
                <span className={styles.optionLabel}>Любой</span>
              )}
            </label>
          ))}
        </FilterSection>
      </div>

      <button
        type="button"
        className={styles.moreFilters}
        onClick={() => setMoreOpen((o) => !o)}
        aria-expanded={moreOpen}
      >
        <span>все фильтры</span>
        <ArrowRight
          className={`${styles.moreCaret} ${moreOpen ? styles.moreCaretOpen : ""}`.trim()}
          size={20}
          weight="regular"
          aria-hidden
        />
      </button>

      {moreOpen ? (
        <div className={styles.sections}>
          <FilterSection
            title="Курорт"
            open={secResort}
            onToggle={() => setSecResort((v) => !v)}
          >
            {RESORTS_TR.map((r) => (
              <label
                key={r}
                className={`${styles.optionRow} ${choiceStyles.choice}`.trim()}
              >
                <input
                  type="checkbox"
                  className={choiceStyles.input}
                  checked={filters.resorts.includes(r)}
                  onChange={() => toggleResort(r)}
                />
                <span className={choiceStyles.checkVisual} aria-hidden />
                <span className={styles.optionLabel}>{r}</span>
              </label>
            ))}
          </FilterSection>

          <FilterSection
            title="В номере"
            open={secRoom}
            onToggle={() => setSecRoom((v) => !v)}
          >
            <label
              className={`${styles.optionRow} ${choiceStyles.choice}`.trim()}
            >
              <input
                type="checkbox"
                className={choiceStyles.input}
                checked={filters.roomAirCon}
                onChange={(e) => patch({ roomAirCon: e.target.checked })}
              />
              <span className={choiceStyles.checkVisual} aria-hidden />
              <span className={styles.optionLabel}>Кондиционер</span>
            </label>
            <label
              className={`${styles.optionRow} ${choiceStyles.choice}`.trim()}
            >
              <input
                type="checkbox"
                className={choiceStyles.input}
                checked={filters.roomKitchen}
                onChange={(e) => patch({ roomKitchen: e.target.checked })}
              />
              <span className={choiceStyles.checkVisual} aria-hidden />
              <span className={styles.optionLabel}>Кухня</span>
            </label>
            <label
              className={`${styles.optionRow} ${choiceStyles.choice}`.trim()}
            >
              <input
                type="checkbox"
                className={choiceStyles.input}
                checked={filters.roomBalcony}
                onChange={(e) => patch({ roomBalcony: e.target.checked })}
              />
              <span className={choiceStyles.checkVisual} aria-hidden />
              <span className={styles.optionLabel}>Балкон</span>
            </label>
            <label
              className={`${styles.optionRow} ${choiceStyles.choice}`.trim()}
            >
              <input
                type="checkbox"
                className={choiceStyles.input}
                checked={filters.roomWifi}
                onChange={(e) => patch({ roomWifi: e.target.checked })}
              />
              <span className={choiceStyles.checkVisual} aria-hidden />
              <span className={styles.optionLabel}>Wi-Fi в номере</span>
            </label>
          </FilterSection>

          <FilterSection
            title="Пляж и расположение"
            open={secBeach}
            onToggle={() => setSecBeach((v) => !v)}
          >
            <label
              className={`${styles.optionRow} ${choiceStyles.choice}`.trim()}
            >
              <input
                type="checkbox"
                className={choiceStyles.input}
                checked={filters.firstLineHotel}
                onChange={(e) => patch({ firstLineHotel: e.target.checked })}
              />
              <span className={choiceStyles.checkVisual} aria-hidden />
              <span className={styles.optionLabel}>Первая линия</span>
            </label>
            <label
              className={`${styles.optionRow} ${choiceStyles.choice}`.trim()}
            >
              <input
                type="checkbox"
                className={choiceStyles.input}
                checked={filters.beachPrivate}
                onChange={(e) => patch({ beachPrivate: e.target.checked })}
              />
              <span className={choiceStyles.checkVisual} aria-hidden />
              <span className={styles.optionLabel}>Свой пляж</span>
            </label>
            <label
              className={`${styles.optionRow} ${choiceStyles.choice}`.trim()}
            >
              <input
                type="checkbox"
                className={choiceStyles.input}
                checked={filters.beachSand}
                onChange={(e) => patch({ beachSand: e.target.checked })}
              />
              <span className={choiceStyles.checkVisual} aria-hidden />
              <span className={styles.optionLabel}>Песчаный пляж</span>
            </label>
            <label
              className={`${styles.optionRow} ${choiceStyles.choice}`.trim()}
            >
              <input
                type="checkbox"
                className={choiceStyles.input}
                checked={filters.beachPebble}
                onChange={(e) => patch({ beachPebble: e.target.checked })}
              />
              <span className={choiceStyles.checkVisual} aria-hidden />
              <span className={styles.optionLabel}>Галечный пляж</span>
            </label>
          </FilterSection>

          <FilterSection
            title="Цена"
            open={secPrice}
            onToggle={() => setSecPrice((v) => !v)}
          >
            <div className={styles.priceFields}>
              <div className={styles.priceField}>
                <span className={styles.priceLabel} id="price-min-lbl">
                  От, ₽
                </span>
                <input
                  id="price-min-inp"
                  className={styles.priceInput}
                  inputMode="numeric"
                  placeholder="10 000 ₽"
                  aria-labelledby="price-min-lbl"
                  value={priceMinInput}
                  onChange={(e) =>
                    setPriceMinInput(formatThousandsInput(e.target.value))
                  }
                />
              </div>
              <div className={styles.priceField}>
                <span className={styles.priceLabel} id="price-max-lbl">
                  До, ₽
                </span>
                <input
                  id="price-max-inp"
                  className={styles.priceInput}
                  inputMode="numeric"
                  placeholder="100 000 ₽"
                  aria-labelledby="price-max-lbl"
                  value={priceMaxInput}
                  onChange={(e) =>
                    setPriceMaxInput(formatThousandsInput(e.target.value))
                  }
                />
              </div>
            </div>
          </FilterSection>
        </div>
      ) : null}

      <div className={styles.extras}>
        <label
          className={`${styles.extraRow} ${choiceStyles.choice}`.trim()}
        >
          <input
            type="checkbox"
            className={choiceStyles.input}
            checked={filters.charterOnly}
            onChange={(e) => patch({ charterOnly: e.target.checked })}
          />
          <span className={choiceStyles.checkVisual} aria-hidden />
          <AirplaneTilt
            className={styles.planeIcon}
            size={20}
            weight="regular"
            aria-hidden
          />
          <span>Только чартерные рейсы</span>
        </label>
        <label
          className={`${styles.extraRow} ${choiceStyles.choice}`.trim()}
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

      <div className={styles.actions}>
        <button type="button" className={styles.apply} onClick={handleApply}>
          Применить фильтры
        </button>
        <button type="button" className={styles.reset} onClick={handleReset}>
          Сбросить фильтры
        </button>
      </div>
    </aside>
  );
}
