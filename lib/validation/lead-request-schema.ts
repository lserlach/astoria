import { z } from "zod";

import { getPhoneDigits } from "@/lib/phone-mask";

export const leadRequestSchema = z.object({
  name: z.string().trim().min(1, "Введите имя"),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => {
        const d = getPhoneDigits(v);
        return d.length >= 10 && d.length <= 11;
      },
      { message: "Введите полный номер телефона" },
    ),
});

export type LeadRequestValues = z.infer<typeof leadRequestSchema>;
