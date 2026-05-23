import { z } from "zod";

export const createOrderSchema = z.object({
  userID: z.number(),
  note: z.string().optional(),
  address: z.string(),
  shippingFee: z.number(),
  paymentMethod: z.enum(["COD", "PAYPAL", "VNPAY", "MOMO"]),
  paymentStatus: z.literal("PENDING").default("PENDING"),
  currency: z.string(),
  orderItems: z.array(
    z.object({
      variantID: z.number(),
      quantity: z.number(),
      price: z.number(),
    }),
  ),
});

export type CreateOrderRequest = z.infer<typeof createOrderSchema>;
