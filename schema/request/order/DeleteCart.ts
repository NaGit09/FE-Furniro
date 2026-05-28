
import { z } from "zod";

export const DeleteCartSchema = z.object({

    cartID: z.number(),
    variantID: z.number(),
    userID: z.number(),
});

export type DeleteCart = z.infer<typeof DeleteCartSchema>;
