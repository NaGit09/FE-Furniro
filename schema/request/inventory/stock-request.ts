import { z } from "zod";

const TransactionTypeEnum = z.enum([
  "IN",
  "OUT",
  "RETURN",
  "ADJUST",
  "RESTOCK",
  "SALE",
]);

export const StockReqSchema = z.object({
  stockId: z.number().int().optional(),

  type: TransactionTypeEnum,

  sku: z.string().trim().min(1, { message: "SKU cannot be blank" }),

  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),

  variantId: z.number().int({ message: "Variant ID is required" }),

  warehouseId: z.number().int({ message: "Warehouse ID is required" }),

  totalQuantity: z
    .number()
    .int()
    .min(0, { message: "Total quantity cannot be negative" }),

  lowStockThreshold: z
    .number()
    .int()
    .min(0, { message: "Low stock threshold cannot be negative" }),
});

export type StockReq = z.infer<typeof StockReqSchema>;
