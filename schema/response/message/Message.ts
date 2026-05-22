import { MessageType } from "@/lib/enum/message";
import { z } from "zod";

export const MessageResSchema = z.object({
conversationId: z.number(),
content: z.string(),
senderId: z.number(),
receiverId: z.number(),
messageType: z.enum(Object.values(MessageType)),
fileId: z.number().nullable().optional(),
});

export type MessageRes = z.infer<typeof MessageResSchema>;