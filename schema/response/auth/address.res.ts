import { z } from "zod";

export const AddressTypeSchema = z.enum(["HOME", "OFFICE"]);

export const AddressSchema = z.object({
  addressID: z.number().int().optional(),
  receiverName: z.string(),
  receiverPhone: z.string(),
  province: z.string(),
  district: z.string(),
  ward: z.string(),
  street: z.string(),
  isDefault: z.boolean().default(false),
  addressType: AddressTypeSchema.default("HOME"),
  userID: z.number().int().optional(),
});

export type Address = z.infer<typeof AddressSchema>;
