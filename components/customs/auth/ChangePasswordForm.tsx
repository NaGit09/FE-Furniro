/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, CheckCircle, ArrowLeft, AlertCircle } from "lucide-react";

import { AuthApi } from "@/services/api/Auth/auth.service";
import {
  changePasswordSchema,
  ChangePasswordFormData,
} from "@/schema/request/auth/account/change.req";
import "@/style/change-password.css";

export default function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailParam = searchParams.get("email") || "";
  const tokenParam = searchParams.get("token") || "";

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      email: emailParam,
      resetToken: tokenParam,
      password: "",
      confirmPassword: "",
    },
  });

  // Sync parameters from query string into the form values
  useEffect(() => {
    if (emailParam) form.setValue("email", emailParam);
    if (tokenParam) form.setValue("resetToken", tokenParam);
  }, [emailParam, tokenParam, form]);

  // Countdown timer for redirection on success
  useEffect(() => {
    if (isSuccess) {
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/auth/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSuccess, router]);

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", {
        message: "Mật khẩu xác nhận không trùng khớp.",
      });
      return;
    }

    setIsLoading(true);
    form.clearErrors();
    try {
      const res = await AuthApi.changePassword(data);
      if (res?.code === 200) {
        toast.success("Đổi mật khẩu thành công!");
        setIsSuccess(true);
      } else {
        form.setError("root", {
          message: res?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.",
        });
      }
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      form.setError("root", {
        message: serverMessage || "Đã xảy ra lỗi khi đổi mật khẩu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="change-root fade-in-up" style={{ width: "100%", maxWidth: "460px" }}>
        <div className="glass-card" style={{ borderRadius: "24px", padding: "40px 40px 36px", position: "relative" }}>
          
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h1 className="change-heading" style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#1a0a00",
              margin: 0,
              letterSpacing: "-0.5px"
            }}>
              Đặt lại mật khẩu
            </h1>
            <p style={{
              fontSize: "14px",
              color: "#5a3c14",
              marginTop: "8px",
              fontWeight: 500,
              lineHeight: 1.5
            }}>
              Vui lòng nhập mật khẩu mới để hoàn tất việc khôi phục tài khoản của bạn.
            </p>
          </div>

          {form.formState.errors.root?.message && (
            <div className="root-error" style={{ marginBottom: "24px" }} role="alert">
              {form.formState.errors.root.message}
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="password" className="field-label">Mật khẩu mới</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    style={{ paddingRight: "48px" }}
                    className={`input-field${form.formState.errors.password ? " error" : ""}`}
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(90, 60, 20, 0.6)", padding: "4px" }}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {form.formState.errors.password?.message && (
                  <p className="error-msg" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="field-label">Xác nhận mật khẩu</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    style={{ paddingRight: "48px" }}
                    className={`input-field${form.formState.errors.confirmPassword ? " error" : ""}`}
                    {...form.register("confirmPassword")}
                  />
                  <button
                    type="button"
                    style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(90, 60, 20, 0.6)", padding: "4px" }}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {form.formState.errors.confirmPassword?.message && (
                  <p className="error-msg" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: "6px" }}>
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2 inline-block" /> Đang lưu mật khẩu...</> : "Đổi mật khẩu"}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: "center", paddingTop: "8px" }}>
              <div style={{ marginBottom: "20px" }}>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              </div>
              <p style={{ fontSize: "15px", color: "#1a0a00", fontWeight: 500, margin: "0 0 24px" }}>
                Bạn sẽ được tự động chuyển hướng về trang đăng nhập sau <span style={{ color: "#ca8a04", fontWeight: 700 }}>{redirectCountdown}</span> giây.
              </p>
              <Link href="/auth/login" className="btn-primary" style={{ textDecoration: "none" }}>
                Đăng nhập ngay
              </Link>
            </div>
          )}

          {!isSuccess && (
            <div style={{ textAlign: "center", marginTop: "28px", borderTop: "1px solid rgba(202, 138, 4, 0.15)", paddingTop: "20px" }}>
              <Link href="/auth/login" className="link-gold" style={{ fontSize: "14px" }}>
                <ArrowLeft className="w-4 h-4 shrink-0" />
                Quay lại trang Đăng nhập
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
