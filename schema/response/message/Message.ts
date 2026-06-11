import { MessageType } from "@/lib/enum/message";
import { z } from "zod";

export const MessageResSchema = z.object({
  id: z.number().optional(),
  conversationId: z.number().optional(),
  content: z.string(),
  senderId: z.number(),
  receiverId: z.number(),
  type: z.enum(Object.values(MessageType)).optional(),
  messageType: z.enum(Object.values(MessageType)).optional(),
  fileId: z.number().nullable().optional(),
  isRead: z.boolean().optional(),
  createdAt: z.string().optional(),
});

export type MessageRes = z.infer<typeof MessageResSchema>;