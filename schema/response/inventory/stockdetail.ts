import { z } from "zod";
import { WarehouseSchema } from "./warehouse";

export const StockDetailSchema = z.object({
  stockID: z.number(),
  variantID: z.number(),
  sku: z.string(),
  totalQuantity: z.number(),
  lowStockThreshold: z.number(),
  warehouse: z.object(WarehouseSchema),
  reservedQuantity: z.number(),
  availableQuantity: z.number(),
  updatedAt: z.date(),
});

export type StockDetail = z.infer <typeof StockDetailSchema>
