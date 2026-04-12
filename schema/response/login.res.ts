import { z } from "zod";

export const loginResSchema = z.object({
  AccessToken: z.string(),
  RefreshToken: z.string(),
  UserName: z.string(),
  FirstName: z.string(),
  LastName: z.string(),
  Email: z.string(),
  AvatarUrl: z.string(),
});

export type LoginRes = z.infer<typeof loginResSchema>;
