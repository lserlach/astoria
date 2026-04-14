"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  subscribeSchema,
  type SubscribeFormValues,
} from "@/lib/validation/subscribe-schema";

import styles from "./subscribe-inline-form.module.css";

export function SubscribeInlineForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscribeFormValues>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: SubscribeFormValues) => {
    void data;
    reset();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <label className={styles.label} htmlFor="subscribe-email">
        E-mail для акций
      </label>
      <div className={styles.row}>
        <input
          id="subscribe-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={styles.input}
          aria-invalid={errors.email ? true : undefined}
          {...register("email")}
        />
        <button type="submit" className={styles.btn}>
          Подписаться
        </button>
      </div>
      {errors.email ? (
        <p className={styles.error} role="alert">
          {errors.email.message}
        </p>
      ) : null}
    </form>
  );
}
