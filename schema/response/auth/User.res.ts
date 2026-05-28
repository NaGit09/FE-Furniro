import { z } from "zod";
import { AddressSchema } from "./address.res";

export const UserResSchema = z.object({
  userID: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  avatarID: z.number(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  avatar: z.string(),
  dateOfBirth: z.date(),
  addresses: z.object(AddressSchema),
});

export type UserRes = z.infer<typeof UserResSchema>;

export const UserReqSchema = z.object({
  userID: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  username : z.string(),
  avatarID: z.number(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  avatar: z.string(),
  dateOfBirth: z.date(),
  accountID : z.number()
});

export type UserReq = z.infer<typeof UserReqSchema>;
