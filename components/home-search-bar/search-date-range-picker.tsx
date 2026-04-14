"use client";

import {
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
} from "@phosphor-icons/react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  addDays,
  addMonths,
  compareDay,
  isDayInOpenRange,
  isPastDay,
  isSameDay,
  mockTourPriceRub,
  startOfMonth,
} from "@/lib/date-range-utils";

import styles from "./search-date-range-picker.module.css";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function buildMonthCells(year: number, month: number): Array<{
  date: Date;
  inMonth: boolean;
}> {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ date: Date; inMonth: boolean }> = [];
  const prevLast = new Date(year, month, 0).getDate();
  for (let i = 0; i < lead; i++) {
    const d = prevLast - lead + i + 1;
    cells.push({ date: new Date(year, month - 1, d), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  const tail = (7 - (cells.length % 7)) % 7;
  for (let i = 1; i <= tail; i++) {
    cells.push({ date: new Date(year, month + 1, i), inMonth: false });
  }
  return cells;
}

function monthTitle(d: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric",
  }).format(d);
}

function medianPrice(values: number[]): number {
  if (values.length === 0) return 0;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

type PriceTier = "low" | "mid" | "high";

function priceTier(price: number, monthPrices: number[]): PriceTier {
  if (monthPrices.length < 2) return "mid";
  const minV = Math.min(...monthPrices);
  const maxV = Math.max(...monthPrices);
  if (minV === maxV) return "mid";
  const med = medianPrice(monthPrices);
  if (price < med) return "low";
  if (price > med) return "high";
  return "mid";
}

interface MonthGridProps {
  monthAnchor: Date;
  pendingStart: Date | null;
  pendingEnd: Date | null;
  onDayClick: (day: Date) => void;
}

function MonthGrid({
  monthAnchor,
  pendingStart,
  pendingEnd,
  onDayClick,
}: MonthGridProps) {
  const y = monthAnchor.getFullYear();
  const m = monthAnchor.getMonth();
  const cells = buildMonthCells(y, m);

  const monthFuturePrices = useMemo(() => {
    const built = buildMonthCells(y, m);
    return built
      .filter(({ inMonth, date }) => inMonth && !isPastDay(date))
      .map(({ date }) => mockTourPriceRub(date));
  }, [y, m]);

  const cellState = (day: Date): "start" | "end" | "between" | "none" => {
    if (!pendingStart) return "none";
    if (!pendingEnd) {
      return isSameDay(day, pendingStart) ? "start" : "none";
    }
    if (isSameDay(day, pendingStart)) return "start";
    if (isSameDay(day, pendingEnd)) return "end";
    if (isDayInOpenRange(day, pendingStart, pendingEnd)) return "between";
    return "none";
  };

  return (
    <div className={styles.monthBlock}>
      <div className={styles.weekdays}>
        {WEEKDAYS.map((w) => (
          <div key={w} className={styles.weekday}>
            {w}
          </div>
        ))}
      </div>
      <div className={styles.grid}>
        {cells.map(({ date: day, inMonth }) => {
          const past = isPastDay(day);
          const st = cellState(day);
          const price = past ? null : mockTourPriceRub(day);
          const tier =
            price != null && inMonth
              ? priceTier(price, monthFuturePrices)
              : "mid";
          const priceHint =
            tier === "low"
              ? `от ${price!.toLocaleString("ru-RU")} ₽ — ниже медианы месяца`
              : tier === "high"
                ? `от ${price!.toLocaleString("ru-RU")} ₽ — выше медианы месяца`
                : `от ${price?.toLocaleString("ru-RU")} ₽`;
          const cls = [
            styles.dayBtn,
            !inMonth ? styles.dayBtnMuted : "",
            st === "start" || st === "end" ? styles.dayEndpoint : "",
            st === "between" ? styles.dayInRange : "",
          ]
            .filter(Boolean)
            .join(" ");

          const priceText =
            price != null && price >= 1000
              ? `${Math.round(price / 1000)}k`
              : price != null
                ? price.toLocaleString("ru-RU")
                : "";

          const priceRowClass = [
            styles.dayPriceRow,
            tier === "low" ? styles.dayPriceRowLow : "",
            tier === "high" ? styles.dayPriceRowHigh : "",
            tier === "mid" && price != null ? styles.dayPriceRowMid : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={`${day.getTime()}-${y}-${m}-${inMonth}`}
              type="button"
              className={cls}
              disabled={past}
              onClick={() => onDayClick(day)}
            >
              <span className={styles.dayNum}>{day.getDate()}</span>
              {price != null ? (
                <span className={priceRowClass} title={priceHint}>
                  {tier === "low" ? (
                    <CaretDown
                      className={styles.dayArrow}
                      size={10}
                      weight="bold"
                      aria-hidden
                    />
                  ) : null}
                  <span className={styles.dayPriceText}>{priceText}</span>
                  {tier === "high" ? (
                    <CaretUp
                      className={styles.dayArrow}
                      size={10}
                      weight="bold"
                      aria-hidden
                    />
                  ) : null}
                </span>
              ) : (
                <span className={styles.dayPriceRow} aria-hidden>
                  <span className={styles.dayPriceTextMuted}>—</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface SearchDateRangePickerProps {
  wrapperClassName: string;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  onRangeChange: (start: Date, end: Date) => void;
  dateLabel: string;
  /** When true, dateLabel is shown with placeholder (muted) styling. */
  dateUnset?: boolean;
  /** White-on-accent trigger (search page primary row). */
  inverse?: boolean;
  labelIconProps: {
    className?: string;
    size: number;
    weight: "regular";
    "aria-hidden": true;
  };
}

export function SearchDateRangePicker({
  wrapperClassName,
  rangeStart,
  rangeEnd,
  onRangeChange,
  dateLabel,
  dateUnset = false,
  inverse = false,
  labelIconProps,
}: SearchDateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(rangeStart ?? new Date()),
  );
  const [pendingStart, setPendingStart] = useState<Date | null>(rangeStart);
  const [pendingEnd, setPendingEnd] = useState<Date | null>(rangeEnd);
  const [awaitingEnd, setAwaitingEnd] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    setPendingStart(rangeStart);
    setPendingEnd(rangeEnd);
    setAwaitingEnd(false);
    setViewMonth(startOfMonth(rangeStart ?? new Date()));
  }, [open, rangeStart, rangeEnd]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      close();
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const handleDayClick = (day: Date) => {
    if (isPastDay(day)) return;
    if (!awaitingEnd) {
      setPendingStart(day);
      setPendingEnd(null);
      setAwaitingEnd(true);
      return;
    }
    let s = pendingStart!;
    let e = day;
    if (compareDay(e, s) < 0) {
      const t = s;
      s = e;
      e = t;
    }
    if (isSameDay(s, e)) {
      e = addDays(s, 1);
    }
    onRangeChange(s, e);
    setOpen(false);
    setAwaitingEnd(false);
  };

  const m1 = viewMonth;
  const m2 = addMonths(viewMonth, 1);

  return (
    <div
      ref={rootRef}
      className={`${wrapperClassName} ${styles.pickerRoot} ${inverse ? styles.pickerInverse : ""}`.trim()}
    >
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={popoverId}
        aria-label={`Период поездки: ${dateLabel}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.labelRow}>
          <CalendarBlank {...labelIconProps} />
          <span className={styles.label}>Даты</span>
        </span>
        <span className={styles.valueRow}>
          <span
            className={`${styles.dateValue} ${dateUnset ? styles.dateValuePlaceholder : ""}`.trim()}
          >
            {dateLabel}
          </span>
          <CaretDown
            className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`.trim()}
            size={24}
            weight="regular"
            aria-hidden
          />
        </span>
      </button>
      {open ? (
        <div
          id={popoverId}
          className={styles.popover}
          role="dialog"
          aria-label="Выбор периода поездки"
        >
          <div className={styles.popoverHeader}>
            <button
              type="button"
              className={styles.navBtn}
              aria-label="Предыдущие месяцы"
              onClick={() => setViewMonth((v) => addMonths(v, -1))}
            >
              <CaretLeft size={20} weight="regular" aria-hidden />
            </button>
            <div className={styles.navMonth}>
              <span className={styles.monthLabel}>{monthTitle(m1)}</span>
              <span className={styles.monthLabel}>{monthTitle(m2)}</span>
            </div>
            <button
              type="button"
              className={styles.navBtn}
              aria-label="Следующие месяцы"
              onClick={() => setViewMonth((v) => addMonths(v, 1))}
            >
              <CaretRight size={20} weight="regular" aria-hidden />
            </button>
          </div>
          <div className={styles.months}>
            <MonthGrid
              monthAnchor={m1}
              pendingStart={pendingStart}
              pendingEnd={pendingEnd}
              onDayClick={handleDayClick}
            />
            <MonthGrid
              monthAnchor={m2}
              pendingStart={pendingStart}
              pendingEnd={pendingEnd}
              onDayClick={handleDayClick}
            />
          </div>
          <p className={styles.hint}>
            Сначала выберите начало периода, затем конец — ориентир, когда
            планируете вылет. Цифра под днём — ориентир цены (демо). Точное
            количество ночей задаётся отдельно в строке поиска.
          </p>
        </div>
      ) : null}
    </div>
  );
}
