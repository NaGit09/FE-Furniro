import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Email không hợp lệ"),
    password: z.string().min(6, "Ít nhất 6 ký tự"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
