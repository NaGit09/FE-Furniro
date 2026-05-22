import { MessageType } from "@/lib/enum/message";
import { z } from "zod";

export const ConversationReqSchema = z.object({
  buyerId: z.number(),
  staffId: z.number(),
  message: z.string(),
  messageType: z.enum(Object.values(MessageType)),
  fileId: z.number().optional(),
});

export type ConversationReq = z.infer<typeof ConversationReqSchema>;