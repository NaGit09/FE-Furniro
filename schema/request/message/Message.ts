import { MessageType } from "@/lib/enum/message";
import { z } from "zod";

export const MessageReqSchema = z.object({
  conversationId: z.number(),
  senderId: z.number(),
  receiverId: z.number(),
  content: z.string(),
  messageType: z.enum(Object.values(MessageType)),
  fileId: z.number().nullable().optional(),
});

export type MessageReq = z.infer<typeof MessageReqSchema>;