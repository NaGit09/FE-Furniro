import { z } from "zod";

export const WarehouseSchema = z.object({
  warehouseID: z.number(),
  isDefault: z.boolean(),
  location: z.string(),
  name: z.string(),
});

export type Warehouse = z.infer < typeof WarehouseSchema >