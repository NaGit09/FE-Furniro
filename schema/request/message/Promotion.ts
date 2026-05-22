import { z } from "zod";

export const PromotionReqSchema = z.object({
    title: z.string(),
    description: z.string(),
    code: z.string(),
    type: z.enum(["PERCENT", "AMOUNT"]),
    value: z.number(),
    status: z.boolean(),

});

export type PromotionReq = z.infer<typeof PromotionReqSchema>;