import { z } from "zod";

export const PromotionResSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    code: z.string(),
    type: z.enum(["PERCENT", "AMOUNT"]),
    value: z.number(),
    status: z.boolean(),

});

export type PromotionRes = z.infer<typeof PromotionResSchema>;
