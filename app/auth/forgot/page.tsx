import type { Metadata } from "next";
import SendOTPForm from "@/components/customs/auth/SendOTPForm";

export const metadata: Metadata = {
  title: "Quên mật khẩu — Furniro",
  description: "Gửi mã OTP đến email để khôi phục mật khẩu hoặc xác thực tài khoản.",
};

export default function ForgotPasswordPage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <main
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <SendOTPForm />
      </main>
    </div>
  );
}
