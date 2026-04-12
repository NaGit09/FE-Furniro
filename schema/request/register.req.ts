import { z } from "zod";

export const registerSchema = z.object({
    email: z.email("Email không hợp lệ"),
    password: z.string().min(6, "Ít nhất 6 ký tự"),
    numberPhone: z.string().min(10, "Số điện thoại không hợp lệ"),
    confirmPassword: z.string().min(6, "Ít nhất 6 ký tự"),
    firstName: z.string().min(1, "Tên không được để trống"),
    lastName: z.string().min(1, "Họ không được để trống"),
});

export type RegisterFormData = z.infer<typeof registerSchema>; 