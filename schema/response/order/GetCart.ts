import { z } from "zod";

export const CartSchema = z.object({
  cartID: z.number(),
  items: z.array(
    z.object({
      cartItemID: z.number(),
      createdAt: z.string(),
      price: z.number(),
      quantity: z.number(),
      variantID: z.number(),
    }),
  ),
  updatedAt: z.string(),
  userID: z.number(),
});

export type Cart = z.infer<typeof CartSchema>;
