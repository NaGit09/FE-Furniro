import {z} from "zod";

export const OrderCardSchema = z.object({
                orderID: z.number(),
                status: z.string(),
                totalAmount: z.number(),
                currency: z.string(),
                orderedAt: z.string(),
                totalItems: z.number(),
})

export type OrderCard = z.infer<typeof OrderCardSchema>;