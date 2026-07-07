/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { AuthApi } from "@/services/api/Auth/auth.service";
import {
  changePasswordSchema,
  ChangePasswordFormData,
} from "@/schema/request/auth/account/change.req";

/* ─────────────────────────────────────────── SVGs & Icons ─── */
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ display: "inline-block" }}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-16 h-16 text-green-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

/* ─────────────────────────────────────────── Component ─── */
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

        .change-root {
          font-family: 'Inter', sans-serif;
        }
        .change-heading {
          font-family: 'Playfair Display', serif;
        }

        /* Glass card styling */
        .glass-card {
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.38);
          box-shadow:
            0 8px 32px rgba(139, 90, 43, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 rgba(255, 255, 255, 0.1);
        }

        .glass-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg,
            rgba(255,255,255,0.6) 0%,
            rgba(202,138,4,0.3) 30%,
            rgba(255,255,255,0.1) 60%,
            rgba(202,138,4,0.4) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .input-field {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.22);
          border: 1.5px solid rgba(202, 138, 4, 0.25);
          border-radius: 12px;
          color: #1a0a00;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          transition: border-color 200ms ease, box-shadow 200ms ease, background 200ms ease;
          outline: none;
        }
        .input-field::placeholder {
          color: rgba(90, 60, 20, 0.45);
        }
        .input-field:focus {
          border-color: #ca8a04;
          background: rgba(255, 255, 255, 0.35);
          box-shadow: 0 0 0 3px rgba(202, 138, 4, 0.15);
        }
        .input-field.error {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }
        .input-field:disabled {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(26, 10, 0, 0.5);
          cursor: not-allowed;
          border-color: rgba(202, 138, 4, 0.1);
        }

        .btn-primary {
          width: 100%;
          padding: 14px 24px;
          background: linear-gradient(135deg, #b45309 0%, #ca8a04 50%, #d97706 100%);
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 150ms ease, box-shadow 150ms ease, filter 150ms ease;
          box-shadow: 0 4px 18px rgba(180, 83, 9, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.3px;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          pointer-events: none;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(180, 83, 9, 0.5);
          filter: brightness(1.05);
        }
        .btn-primary:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(180, 83, 9, 0.35);
        }
        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .shake { animation: shake 0.4s ease; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .error-msg {
          color: #dc2626;
          font-size: 12.5px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 5px;
        }

        .root-error {
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          border-radius: 10px;
          padding: 12px 16px;
          color: #dc2626;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }

        .field-label {
          display: block;
          font-size: 13.5px;
          font-weight: 600;
          color: #5a3c14;
          margin-bottom: 6px;
          letter-spacing: 0.2px;
        }

        .link-gold {
          color: #b45309;
          font-weight: 600;
          text-decoration: none;
          transition: color 200ms;
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .link-gold:hover { color: #ca8a04; }
      `}</style>

      <div className="change-root fade-in-up" style={{ width: "100%", maxWidth: "460px" }}>
        <div className="glass-card" style={{ borderRadius: "24px", padding: "40px 40px 36px", position: "relative" }}>
          
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h1 className="change-heading" style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#1a0a00",
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: "-0.3px"
            }}>
              {isSuccess ? "Thành công!" : "Đặt lại mật khẩu"}
            </h1>
            <p style={{
              fontSize: "14.5px",
              color: "rgba(90, 60, 20, 0.65)",
              marginTop: "8px",
              fontWeight: 400
            }}>
              {isSuccess 
                ? "Mật khẩu của bạn đã được thay đổi thành công." 
                : `Đặt lại mật khẩu mới cho tài khoản ${emailParam || ""}.`}
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {form.formState.errors.root?.message && (
                <div className="root-error shake" role="alert">
                  {form.formState.errors.root.message}
                </div>
              )}

              <div>
                <label className="field-label">Địa chỉ email</label>
                <input
                  type="email"
                  className="input-field"
                  disabled
                  value={emailParam}
                />
              </div>

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
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {form.formState.errors.password?.message && (
                  <p className="error-msg" role="alert">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
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
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {form.formState.errors.confirmPassword?.message && (
                  <p className="error-msg" role="alert">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: "6px" }}>
                {isLoading ? <><SpinnerIcon /> Đang lưu mật khẩu...</> : "Đổi mật khẩu"}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: "center", paddingTop: "8px" }}>
              <div style={{ marginBottom: "20px" }}>
                <CheckCircleIcon />
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
                <BackIcon />
                Quay lại trang Đăng nhập
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
