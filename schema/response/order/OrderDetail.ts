import { z } from "zod";

export const OrderDetailSchema = z.object({
  orderID: z.number(),
  userID: z.number(),
  address: z.string(),
  status: z.string(),
  currency: z.string(),
  totalAmount: z.number(),
  shippingFee: z.number(),
  orderNote: z.string().nullable(),
  promoCode: z.string().nullable().optional(),
  discountAmount: z.number().nullable().optional(),
  orderedAt: z.string(),
  completedAt: z.string().nullable(),
  items: z.array(
    z.object({
      orderItemID: z.number(),
      variant: z.number(),
      quantity: z.number(),
      priceAtPurchase: z.number(),
    }),
  ),
  payments: z.array(
    z.object({
      paymentId: z.number(),
      provider: z.string().nullable(),
      paypalOrderId: z.string().nullable(),
      paypalCaptureId: z.string().nullable(),
      paymentStatus: z.string(),
      paymentMethod: z.string(),
      currency: z.string(),
      amount: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
});

export type OrderDetail = z.infer<typeof OrderDetailSchema>;