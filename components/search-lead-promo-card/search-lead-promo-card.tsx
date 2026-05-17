"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";

import { formatRuPhoneMask } from "@/lib/phone-mask";
import {
  leadRequestSchema,
  type LeadRequestValues,
} from "@/lib/validation/lead-request-schema";

import styles from "./search-lead-promo-card.module.css";

/** Same specialist portrait as home `CtaBanner` (Frame 4). */
const PORTRAIT_SRC = "/images/cta/cta-lead-specialist-frame4.png";

interface SearchLeadPromoCardProps {
  layout: "list" | "grid";
}

export function SearchLeadPromoCard({ layout }: SearchLeadPromoCardProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadRequestValues>({
    resolver: zodResolver(leadRequestSchema),
    defaultValues: { name: "", phone: "" },
  });

  const onSubmit = (data: LeadRequestValues) => {
    void data;
    reset();
  };

  return (
    <article
      className={`${styles.root} ${layout === "grid" ? styles.rootGrid : ""}`.trim()}
      aria-label="Заявка менеджеру"
    >
      <div className={styles.block}>
        <div className={styles.content}>
          <h2 className={styles.title}>Оставьте заявку нашему специалисту</h2>
          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className={styles.formRow}>
              <div className={`${styles.field} ${styles.fieldName}`.trim()}>
                <label className={styles.label} htmlFor="search-lead-name">
                  Имя
                </label>
                <input
                  id="search-lead-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Иван"
                  className={styles.input}
                  aria-invalid={errors.name ? true : undefined}
                  {...register("name")}
                />
                {errors.name ? (
                  <p className={styles.fieldError} role="alert">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>
              <div className={`${styles.field} ${styles.fieldGrow}`.trim()}>
                <label className={styles.label} htmlFor="search-lead-phone">
                  Номер телефона
                </label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <input
                      id="search-lead-phone"
                      ref={ref}
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="8 (800) 000 - 00 - 00"
                      className={styles.input}
                      aria-invalid={errors.phone ? true : undefined}
                      value={value}
                      onBlur={onBlur}
                      onChange={(e) => {
                        onChange(formatRuPhoneMask(e.target.value));
                      }}
                    />
                  )}
                />
                {errors.phone ? (
                  <p className={styles.fieldError} role="alert">
                    {errors.phone.message}
                  </p>
                ) : null}
              </div>
              <button type="submit" className={styles.submit}>
                Оставить заявку
              </button>
            </div>
          </form>
        </div>

        <div className={styles.visual} aria-hidden>
          <div className={styles.portrait}>
            <Image
              src={PORTRAIT_SRC}
              alt=""
              fill
              className={styles.portraitImg}
              sizes="(max-width: 1023px) 0px, 486px"
              unoptimized
            />
          </div>
        </div>
      </div>
    </article>
  );
}
