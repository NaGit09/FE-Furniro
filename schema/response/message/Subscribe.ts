import { z } from "zod";

export const SubcribeResSchema = z.object({
                id: z.number(),
                fullName: z.string(),
                email: z.string(),
                phone: z.string(),
                subscribedAt: z.string(),
});

export type SubcribeRes = z.infer<typeof SubcribeResSchema>;