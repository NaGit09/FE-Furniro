import { z } from "zod";

export const sendOTPSchema = z.object({
  email: z.email("Email không hợp lệ"),
});

export type SendOTPFormData = z.infer<typeof sendOTPSchema>;
