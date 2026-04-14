"use client";

import { CaretDown, Check } from "@phosphor-icons/react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { SearchLocationOption } from "@/lib/search-location-options";

import styles from "./home-search-bar.module.css";

export type SelectValue = string | number;

export interface SearchComboboxCellProps {
  icon: ReactNode;
  labelText: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchLocationOption[];
  ariaLabel: string;
  cellClass?: string;
  searchPlaceholder?: string;
  /** White-on-accent styling (search page primary row). */
  inverse?: boolean;
}

export function SearchComboboxCell({
  icon,
  labelText,
  value,
  onChange,
  options,
  ariaLabel,
  cellClass,
  searchPlaceholder = "Поиск…",
  inverse = false,
}: SearchComboboxCellProps) {
  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? value,
    [options, value],
  );
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(selectedLabel);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputValueRef = useRef(inputValue);
  inputValueRef.current = inputValue;
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listId = useId();

  const selectedOpt = useMemo(
    () => (value ? options.find((o) => o.value === value) : undefined),
    [options, value],
  );

  const filteredRest = useMemo(() => {
    const pool = selectedOpt
      ? options.filter((o) => o.value !== selectedOpt.value)
      : options;
    if (selectedOpt) return pool;
    const q = inputValue.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, inputValue, selectedOpt]);

  useEffect(() => {
    if (!open) {
      setInputValue(selectedLabel);
    }
  }, [value, selectedLabel, open]);

  useEffect(() => {
    return () => {
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    };
  }, []);

  const clearBlurTimer = useCallback(() => {
    if (blurTimerRef.current) {
      clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
  }, []);

  const finalizeInput = useCallback(() => {
    const trimmed = inputValueRef.current.trim();
    const exact = options.find(
      (o) => o.label.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exact) {
      onChange(exact.value);
      setInputValue(exact.label);
    } else {
      setInputValue(selectedLabel);
    }
    setOpen(false);
  }, [options, onChange, selectedLabel]);

  const scheduleFinalize = useCallback(() => {
    clearBlurTimer();
    blurTimerRef.current = setTimeout(() => {
      blurTimerRef.current = null;
      finalizeInput();
    }, 160);
  }, [clearBlurTimer, finalizeInput]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      clearBlurTimer();
      finalizeInput();
    };
    document.addEventListener("pointerdown", onDoc, true);
    return () => document.removeEventListener("pointerdown", onDoc, true);
  }, [open, clearBlurTimer, finalizeInput]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearBlurTimer();
        setInputValue(selectedLabel);
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, selectedLabel, clearBlurTimer]);

  const pick = (opt: SearchLocationOption) => {
    clearBlurTimer();
    onChange(opt.value);
    setInputValue(opt.label);
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div
      ref={rootRef}
      className={`${styles.cell} ${styles.cellSelect} ${inverse ? styles.cellInverse : ""} ${cellClass ?? ""}`.trim()}
    >
      <div className={styles.comboboxTrigger}>
        <span className={styles.labelRow}>
          {icon}
          <span className={styles.label}>{labelText}</span>
        </span>
        <div className={styles.comboboxRow}>
          {!open && selectedOpt?.flag ? (
            <span className={styles.optionFlagInline} aria-hidden>
              {selectedOpt.flag}
            </span>
          ) : null}
          <input
            ref={inputRef}
            type="text"
            className={styles.comboboxInput}
            value={inputValue}
            placeholder={searchPlaceholder}
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-label={ariaLabel}
            role="combobox"
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => {
              setInputValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={scheduleFinalize}
          />
          <button
            type="button"
            className={styles.chevronBtn}
            tabIndex={-1}
            aria-label={open ? "Закрыть список" : "Открыть список"}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (open) {
                clearBlurTimer();
                setOpen(false);
                setInputValue(selectedLabel);
              } else {
                setOpen(true);
                requestAnimationFrame(() => {
                  inputRef.current?.focus();
                  inputRef.current?.select();
                });
              }
            }}
          >
            <CaretDown
              className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`.trim()}
              size={24}
              weight="regular"
              aria-hidden
            />
          </button>
        </div>
      </div>
      {open ? (
        <ul
          id={listId}
          className={styles.selectList}
          role="listbox"
          aria-label={`${ariaLabel}: варианты`}
        >
          {selectedOpt ? (
            <>
              <li
                role="option"
                aria-selected={true}
                className={`${styles.selectOption} ${styles.selectOptionCurrent}`.trim()}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => pick(selectedOpt)}
              >
                <span className={styles.selectOptionCurrentRow}>
                  <Check
                    className={styles.selectOptionCheck}
                    size={18}
                    weight="bold"
                    aria-hidden
                  />
                  <span className={styles.selectOptionLabelRow}>
                    {selectedOpt.flag ? (
                      <span className={styles.optionFlag} aria-hidden>
                        {selectedOpt.flag}
                      </span>
                    ) : null}
                    <span className={styles.selectOptionCurrentLabel}>
                      {selectedOpt.label}
                    </span>
                  </span>
                </span>
              </li>
              {filteredRest.length > 0 ? (
                <>
                  <li
                    className={styles.selectListDivider}
                    role="separator"
                    aria-hidden
                  />
                  {filteredRest.map((opt) => (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={false}
                      className={styles.selectOption}
                      onPointerDown={(e) => e.preventDefault()}
                      onClick={() => pick(opt)}
                    >
                      <span className={styles.selectOptionLabelRow}>
                        {opt.flag ? (
                          <span className={styles.optionFlag} aria-hidden>
                            {opt.flag}
                          </span>
                        ) : null}
                        <span className={styles.selectOptionLabelText}>
                          {opt.label}
                        </span>
                      </span>
                    </li>
                  ))}
                </>
              ) : (
                <li className={styles.selectRestEmpty} role="none">
                  Другие варианты не найдены
                </li>
              )}
            </>
          ) : filteredRest.length === 0 ? (
            <li className={styles.selectEmpty} role="none">
              Ничего не найдено
            </li>
          ) : (
            filteredRest.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                className={styles.selectOption}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => pick(opt)}
              >
                <span className={styles.selectOptionLabelRow}>
                  {opt.flag ? (
                    <span className={styles.optionFlag} aria-hidden>
                      {opt.flag}
                    </span>
                  ) : null}
                  <span className={styles.selectOptionLabelText}>
                    {opt.label}
                  </span>
                </span>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}

export interface SearchSelectCellProps<T extends SelectValue> {
  icon: ReactNode;
  labelText: string;
  value: T | null;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
  ariaLabel: string;
  cellClass?: string;
  emptyLabel?: string;
  inverse?: boolean;
}

export function SearchSelectCell<T extends SelectValue>({
  icon,
  labelText,
  value,
  onChange,
  options,
  ariaLabel,
  cellClass,
  emptyLabel = "Выберите",
  inverse = false,
}: SearchSelectCellProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selectedLabel = useMemo(() => {
    if (value === null) return emptyLabel;
    return options.find((o) => o.value === value)?.label ?? String(value);
  }, [options, value, emptyLabel]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDocPointer = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      close();
    };
    document.addEventListener("pointerdown", onDocPointer);
    return () => document.removeEventListener("pointerdown", onDocPointer);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const pick = (v: T) => {
    onChange(v);
    close();
  };

  return (
    <div
      ref={rootRef}
      className={`${styles.cell} ${styles.cellSelect} ${inverse ? styles.cellInverse : ""} ${cellClass ?? ""}`.trim()}
    >
      <button
        type="button"
        className={styles.cellSelectTrigger}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-label={`${ariaLabel}: ${selectedLabel}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.labelRow}>
          {icon}
          <span className={styles.label}>{labelText}</span>
        </span>
        <span className={styles.valueRow}>
          <span
            className={`${styles.selectValue} ${value === null ? styles.selectValuePlaceholder : ""}`.trim()}
          >
            {selectedLabel}
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
        <ul
          id={listId}
          className={styles.selectList}
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((opt) => (
            <li
              key={String(opt.value)}
              role="option"
              aria-selected={value !== null && opt.value === value}
              className={styles.selectOption}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => pick(opt.value)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
