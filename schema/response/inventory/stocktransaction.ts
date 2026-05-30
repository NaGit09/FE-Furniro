
import { z } from "zod";

const TransactionTypeEnum = z.enum(["IN", "OUT", "RETURN", "ADJUST", "RESTOCK", "SALE"]);

export const StockTransactionSchema = z.object({
  transactionID: z.number().int(),
  
  sku: z.string().min(1),
  
  type: TransactionTypeEnum,
  
  quantity: z.number().int(),
  
  // referenceID có thể là null
  referenceID: z.number().int().nullable(),
  
  // note có thể là null hoặc string
  note: z.string().nullable().optional(),
  
  // Validate định dạng ISO 8601
  createdAt: z.date(),
});

export type StockTransaction = z.infer<typeof StockTransactionSchema>;