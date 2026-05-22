import { MessageType } from "@/lib/enum/message";
import { z } from "zod";

export const MessageReqSchema = z.object({
  senderId: z.number(),
  receiverId: z.number(),
  content: z.string(),
  type: z.enum(Object.values(MessageType)),
});

export type MessageReq = z.infer<typeof MessageReqSchema>;