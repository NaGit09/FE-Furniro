import { z } from "zod";

export const AccountResSchema = z.object({
  AccountID: z.number().int(),
  Active: z.boolean(),
  AvatarUrl: z.url(),
  Banned: z.boolean(),
  Email: z.email(),
  FirstName: z.string().min(1),
  LastName: z.string().min(1),
  Phone: z.string().min(1),
  Role: z.enum(["ADMIN", "CUSTOMER", "STAFF"]), 
  UserName: z.string().min(1),
});

export type AccountRes = z.infer<typeof AccountResSchema>;