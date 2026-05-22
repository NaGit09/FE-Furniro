import { z } from "zod";

export const confirmOTP = z.object({
    email: z.email("Email không hợp lệ"),
    otp: z.string().min(6, "Mã OTP không hợp lệ"),
});

export type ConfirmOTPFormData = z.infer<typeof confirmOTP>;
