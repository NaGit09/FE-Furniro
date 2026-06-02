import { z } from "zod";

export const ConfirmOTPSchema = z.object({
  resetToken: z.string(),
  email: z.string(),
});

export type ConfirmOTP = z.infer<typeof ConfirmOTPSchema>;
