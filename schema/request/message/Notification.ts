import { z } from "zod";

export const NotificationReqSchema = z.object({
  receiverID: z.number(),
  page: z.number().optional(),
  size: z.number().optional(),
  sortBy: z.string().optional(),
});

export type NotificationReq = z.infer<typeof NotificationReqSchema>;
