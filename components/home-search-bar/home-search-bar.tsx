"use client";

import { Globe, MagnifyingGlass, MapPin, Moon, User } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Container } from "@/components/container/container";
import { formatIsoDate } from "@/lib/date-range-utils";
import { CITY_OPTIONS, DESTINATION_OPTIONS } from "@/lib/search-location-options";

import styles from "./home-search-bar.module.css";
import { SearchComboboxCell, SearchSelectCell } from "./search-bar-cells";
import { SearchDateRangePicker } from "./search-date-range-picker";

const NIGHTS = [3, 5, 7, 9, 10, 12, 14];

export function HomeSearchBar() {
  const router = useRouter();
  const [departureCity, setDepartureCity] = useState("");
  const [country, setCountry] = useState("");
  const [range, setRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [nights, setNights] = useState<number | null>(null);
  const [adults, setAdults] = useState<number | null>(null);

  const dateLabel = useMemo(() => {
    if (!range.start || !range.end) return "Выберите даты";
    const fmt = new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
    });
    return `${fmt.format(range.start)} — ${fmt.format(range.end)}`;
  }, [range.start, range.end]);

  const goSearch = () => {
    const q = new URLSearchParams();
    if (departureCity.trim()) q.set("from", departureCity.trim());
    if (country.trim()) q.set("to", country.trim());
    if (nights != null) q.set("nights", String(nights));
    if (adults != null) q.set("adults", String(adults));
    if (range.start && range.end) {
      q.set("dateFrom", formatIsoDate(range.start));
      q.set("dateTo", formatIsoDate(range.end));
    }
    const qs = q.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  };

  const labelIconProps = {
    className: styles.icon,
    size: 18,
    weight: "regular" as const,
    "aria-hidden": true as const,
  };

  return (
    <div className={styles.wrap}>
      <Container>
        <div className={styles.bar} role="search" aria-label="Поиск туров">
          <SearchComboboxCell
            icon={<MapPin {...labelIconProps} />}
            labelText="Город вылета"
            value={departureCity}
            onChange={setDepartureCity}
            options={CITY_OPTIONS}
            ariaLabel="Город вылета, откуда"
            searchPlaceholder="Откуда"
          />

          <SearchComboboxCell
            icon={<Globe {...labelIconProps} />}
            labelText="Страна/Курорт"
            value={country}
            onChange={setCountry}
            options={DESTINATION_OPTIONS}
            ariaLabel="Страна или курорт, куда"
            searchPlaceholder="Куда"
          />

          <SearchDateRangePicker
            wrapperClassName={`${styles.cell} ${styles.cellDates} ${styles.cellSelect}`}
            rangeStart={range.start}
            rangeEnd={range.end}
            onRangeChange={(start, end) => setRange({ start, end })}
            dateLabel={dateLabel}
            dateUnset={!range.start || !range.end}
            labelIconProps={labelIconProps}
          />

          <SearchSelectCell
            icon={<Moon {...labelIconProps} />}
            labelText="Кол-во ночей"
            value={nights}
            onChange={setNights}
            options={NIGHTS.map((n) => ({ value: n, label: String(n) }))}
            ariaLabel="Количество ночей"
          />

          <SearchSelectCell
            icon={<User {...labelIconProps} />}
            labelText="Кол-во туристов"
            value={adults}
            onChange={setAdults}
            options={[1, 2, 3, 4].map((n) => ({
              value: n,
              label: `${n} взрослых`,
            }))}
            ariaLabel="Количество взрослых"
            cellClass={styles.cellLast}
          />

          <button
            type="button"
            className={styles.searchBtn}
            onClick={goSearch}
          >
            <MagnifyingGlass
              className={styles.iconBtn}
              size={20}
              weight="regular"
              aria-hidden
            />
            <span>Найти туры</span>
          </button>
        </div>
      </Container>
    </div>
  );
}
