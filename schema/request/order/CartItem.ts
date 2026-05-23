import { z } from "zod";

export const CartItemSchema = z.object({
  cartID: z.number(),
  userID: z.number(),
  variantID: z.number(),
  quantity: z.number(),
  price: z.number(),
});

export type CartItem = z.infer<typeof CartItemSchema>;
