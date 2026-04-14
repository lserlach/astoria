"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Envelope, Phone } from "@phosphor-icons/react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";

import { Container } from "@/components/container/container";
import { formatRuPhoneMask } from "@/lib/phone-mask";
import {
  leadRequestSchema,
  type LeadRequestValues,
} from "@/lib/validation/lead-request-schema";

import styles from "./cta-banner.module.css";

/** Lead form hero: portrait with orange circle on dark (PNG) */
const ctaPortraitSrc = "/images/cta/cta-banner-specialist-v3.png";

export function CtaBanner() {
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
    <section className={styles.section}>
      <Container>
        <div className={styles.block}>
          <div className={styles.main}>
            <div className={styles.formSection}>
              <h2 className={styles.title}>
                Оставьте заявку нашему специалисту
              </h2>
              <form
                className={styles.form}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <div className={styles.formRow}>
                  <div className={styles.fields}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="lead-name">
                        Имя
                      </label>
                      <input
                        id="lead-name"
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
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="lead-phone">
                        Номер телефона
                      </label>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <input
                            id="lead-phone"
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
                  </div>
                  <button type="submit" className={styles.submit}>
                    Оставить заявку
                  </button>
                </div>
              </form>
            </div>

            <div className={styles.contactSection}>
              <p className={styles.contactLead}>
                Либо свяжитесь с нами напрямую
              </p>
              <div className={styles.contacts}>
                <a href="tel:+78000000000" className={styles.contactRow}>
                  <span className={styles.contactIcon} aria-hidden>
                    <Phone
                      className={styles.contactIconGlyph}
                      size={18}
                      weight="fill"
                    />
                  </span>
                  <span className={styles.contactText}>8-800-000-00-00</span>
                </a>
                <a
                  href="mailto:info@travelagency.ru"
                  className={styles.contactRow}
                >
                  <span className={styles.contactIcon} aria-hidden>
                    <Envelope
                      className={styles.contactIconGlyph}
                      size={18}
                      weight="fill"
                    />
                  </span>
                  <span className={styles.contactText}>
                    info@travelagency.ru
                  </span>
                </a>
              </div>
              <button
                type="button"
                className={styles.chatLink}
                aria-label="Связаться с менеджером в чате"
              >
                <span className={styles.chatLabel}>связаться с менеджером</span>
                <ArrowRight
                  className={styles.chatArrow}
                  size={24}
                  weight="thin"
                  aria-hidden
                />
              </button>
            </div>
          </div>

          <div className={styles.visual} aria-hidden>
            <div className={styles.portrait}>
              <Image
                src={ctaPortraitSrc}
                alt=""
                fill
                className={styles.portraitImg}
                sizes="(max-width: 1023px) 0px, 486px"
                priority={false}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
