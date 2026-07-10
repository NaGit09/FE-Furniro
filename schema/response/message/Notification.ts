import z from "zod";

export const NotificationResSchema = z.object({
id: z.number(),
userID: z.number(),
type: z.string(),
title: z.string(),
content: z.string(),
isRead: z.boolean(),
createdAt: z.string(),
updatedAt: z.string(),
});

export type NotificationRes = z.infer<typeof NotificationResSchema>;