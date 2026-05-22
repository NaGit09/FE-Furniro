import { z } from "zod";

export const SubscribeReqSchema = z.object({
    email: z.email(),
    phone: z.string().min(10).max(15),
    fullName: z.string().min(1).max(100),
})

export type Subscribe = z.infer<typeof SubscribeReqSchema>;