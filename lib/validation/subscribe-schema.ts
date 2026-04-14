import { z } from "zod";

export const subscribeSchema = z.object({
  email: z.string().email("Введите корректный email"),
});

export type SubscribeFormValues = z.infer<typeof subscribeSchema>;
