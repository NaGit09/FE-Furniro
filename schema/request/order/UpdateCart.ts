import { z } from "zod";

export const UpdateCartSchema = z.object({

    cartID: z.number(),
    quantity: z.number(),
    variantID: z.number(),
    action: z.enum(["ADD", "SUBTRACT"]),
    userID: z.number(),
});

export type UpdateCart = z.infer<typeof UpdateCartSchema>;
