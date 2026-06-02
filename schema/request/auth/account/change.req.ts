import z from "zod"

export const changePasswordSchema = z.object({
    email: z.email("Email không hợp lệ"),
    resetToken : z.string(),
    password: z.string().min(6, "Mật khẩu không hợp lệ"),
    confirmPassword: z.string().min(6, "Xác nhận mật khẩu không hợp lệ"),
    
})

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;