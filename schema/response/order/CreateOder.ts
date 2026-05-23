import { z } from "zod";

export const createOrderSchema = z.object({
  paypalOrderId: z.string(),
  approvalUrl: z.string(),
});

export type CreateOrderRes = z.infer<typeof createOrderSchema>;
