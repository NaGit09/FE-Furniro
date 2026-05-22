import { z } from "zod";

export const ConversationResSchema = z.object({
        id: z.number(),
        buyerId: z.number(),
        staffId: z.number(),
        lastMessageAt: z.date(),
        lastMessageContent: z.string(),
        latestMessageType: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
});

export type ConversationRes = z.infer<typeof ConversationResSchema>;