/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { AuthApi } from "@/services/api/Auth/auth.service";
import {
  sendOTPSchema,
  SendOTPFormData,
} from "@/schema/request/auth/account/send.req";
import {
  confirmOTP as confirmOTPSchema,
  ConfirmOTPFormData,
} from "@/schema/request/auth/account/confirm.req";
import {
  changePasswordSchema,
  ChangePasswordFormData,
} from "@/schema/request/auth/account/change.req";

/* ─────────────────────────────────────────── SVG Icons ─── */
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className="w-5 h-5">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className="w-5 h-5">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
export default function ForgotPasswordForm() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // Forms setup
  const step1Form = useForm<SendOTPFormData>({
    resolver: zodResolver(sendOTPSchema),
    defaultValues: { email: "" },
  });

  const step2Form = useForm<ConfirmOTPFormData>({
    resolver: zodResolver(confirmOTPSchema),
    defaultValues: { email: "", otp: "" },
  });

  const step3Form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { email: "", resetToken: "", password: "", confirmPassword: "" },
  });

  // Sync email into step2 and step3 forms whenever email state changes
  useEffect(() => {
    if (email) {
      step2Form.setValue("email", email);
      step3Form.setValue("email", email);
    }
  }, [email, step2Form, step3Form]);

  // Sync resetToken into step3 form
  useEffect(() => {
    if (resetToken) {
      step3Form.setValue("resetToken", resetToken);
    }
  }, [resetToken, step3Form]);

  // Countdown timer for step 4 success page
  useEffect(() => {
    if (step === 4) {
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
  }, [step, router]);

  // STEP 1: Send OTP
  const onSendOTP = async (data: SendOTPFormData) => {
    setIsLoading(true);
    step1Form.clearErrors();
    try {
      const res = await AuthApi.sendOTP(data.email);
      if (res?.code === 200) {
        toast.success("Mã OTP đã được gửi thành công đến email của bạn.");
        setEmail(data.email);
        setStep(2);
      } else if (res?.code === 400) {
        toast.info("Bạn đã có mã OTP chưa sử dụng. Vui lòng kiểm tra email.");
        setEmail(data.email);
        setStep(2);
      } else {
        step1Form.setError("root", {
          message: res?.message || "Không thể gửi mã OTP. Vui lòng thử lại.",
        });
      }
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      step1Form.setError("root", {
        message: serverMessage || "Đã xảy ra lỗi khi gửi mã OTP.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Confirm OTP
  const onConfirmOTP = async (data: ConfirmOTPFormData) => {
    setIsLoading(true);
    step2Form.clearErrors();
    try {
      const res = await AuthApi.confirmOTP(data);
      if (res?.code === 200 && res.data) {
        toast.success("Xác nhận mã OTP thành công.");
        setResetToken(res.data.resetToken);
        setStep(3);
      } else {
        step2Form.setError("root", {
          message: res?.message || "Mã OTP không chính xác hoặc đã hết hạn.",
        });
      }
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      step2Form.setError("root", {
        message: serverMessage || "Đã xảy ra lỗi khi xác thực mã OTP.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 3: Change Password
  const onChangePassword = async (data: ChangePasswordFormData) => {
    if (data.password !== data.confirmPassword) {
      step3Form.setError("confirmPassword", {
        message: "Mật khẩu xác nhận không trùng khớp.",
      });
      return;
    }

    setIsLoading(true);
    step3Form.clearErrors();
    try {
      const res = await AuthApi.changePassword(data);
      if (res?.code === 200) {
        toast.success("Đổi mật khẩu thành công!");
        setStep(4);
      } else {
        step3Form.setError("root", {
          message: res?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.",
        });
      }
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      step3Form.setError("root", {
        message: serverMessage || "Đã xảy ra lỗi khi đổi mật khẩu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Dynamic Styling to align with LoginForm */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

        .forgot-root {
          font-family: 'Inter', sans-serif;
        }
        .forgot-heading {
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

        /* Iridescent border shimmer */
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

        /* Premium Floating/Custom Inputs */
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

        /* Primary action button */
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

        /* Shake animation for errors */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .shake { animation: shake 0.4s ease; }

        /* Fade-in-up transition */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        /* Error typography */
        .error-msg {
          color: #dc2626;
          font-size: 12.5px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 5px;
        }

        /* Banner error container */
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

        /* Step circle indicators */
        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .step-dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13.5px;
          font-weight: 700;
          transition: all 300ms ease;
        }
        .step-dot.active {
          background: #ca8a04;
          color: white;
          box-shadow: 0 0 0 4px rgba(202, 138, 4, 0.25);
        }
        .step-dot.completed {
          background: #b45309;
          color: white;
        }
        .step-dot.upcoming {
          background: rgba(202, 138, 4, 0.15);
          color: #5a3c14;
          border: 1px dashed rgba(202, 138, 4, 0.4);
        }
        .step-line {
          flex: 1;
          height: 2px;
          background: rgba(202, 138, 4, 0.2);
          max-width: 48px;
          border-radius: 2px;
          transition: background 300ms ease;
        }
        .step-line.completed {
          background: #b45309;
        }
      `}</style>

      <div className="forgot-root fade-in-up" style={{ width: "100%", maxWidth: "460px" }}>
        <div className="glass-card" style={{ borderRadius: "24px", padding: "40px 40px 36px", position: "relative" }}>
          
          {/* Visual Step Progress Indicator */}
          {step <= 3 && (
            <div className="step-indicator">
              <div className={`step-dot ${step === 1 ? "active" : "completed"}`}>1</div>
              <div className={`step-line ${step > 1 ? "completed" : ""}`} />
              <div className={`step-dot ${step === 2 ? "active" : step > 2 ? "completed" : "upcoming"}`}>2</div>
              <div className={`step-line ${step > 2 ? "completed" : ""}`} />
              <div className={`step-dot ${step === 3 ? "active" : "upcoming"}`}>3</div>
            </div>
          )}

          {/* Header Title & Subtitle */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h1 className="forgot-heading" style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#1a0a00",
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: "-0.3px"
            }}>
              {step === 1 && "Quên mật khẩu"}
              {step === 2 && "Xác nhận OTP"}
              {step === 3 && "Đặt lại mật khẩu"}
              {step === 4 && "Thành công!"}
            </h1>
            <p style={{
              fontSize: "14.5px",
              color: "rgba(90, 60, 20, 0.65)",
              marginTop: "8px",
              fontWeight: 400
            }}>
              {step === 1 && "Nhập email của bạn để nhận mã OTP khôi phục tài khoản."}
              {step === 2 && `Mã xác thực đã gửi tới ${email}. Vui lòng nhập mã 6 số.`}
              {step === 3 && "Tạo mật khẩu mới có độ dài tối thiểu 6 ký tự."}
              {step === 4 && "Mật khẩu của bạn đã được thay đổi thành công."}
            </p>
          </div>

          {/* STEP 1: Send OTP Form */}
          {step === 1 && (
            <form onSubmit={step1Form.handleSubmit(onSendOTP)} noValidate style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {step1Form.formState.errors.root?.message && (
                <div className="root-error shake" role="alert">
                  {step1Form.formState.errors.root.message}
                </div>
              )}

              <div>
                <label htmlFor="email" className="field-label">Địa chỉ email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`input-field${step1Form.formState.errors.email ? " error" : ""}`}
                  {...step1Form.register("email")}
                />
                {step1Form.formState.errors.email?.message && (
                  <p className="error-msg" role="alert">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    {step1Form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: "6px" }}>
                {isLoading ? <><SpinnerIcon /> Đang gửi mã...</> : "Gửi mã OTP"}
              </button>
            </form>
          )}

          {/* STEP 2: Confirm OTP Form */}
          {step === 2 && (
            <form onSubmit={step2Form.handleSubmit(onConfirmOTP)} noValidate style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {step2Form.formState.errors.root?.message && (
                <div className="root-error shake" role="alert">
                  {step2Form.formState.errors.root.message}
                </div>
              )}

              <div>
                <label className="field-label">Email</label>
                <input
                  type="email"
                  className="input-field"
                  disabled
                  value={email}
                />
              </div>

              <div>
                <label htmlFor="otp" className="field-label">Mã OTP</label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Nhập mã OTP"
                  maxLength={6}
                  className={`input-field${step2Form.formState.errors.otp ? " error" : ""}`}
                  {...step2Form.register("otp")}
                />
                {step2Form.formState.errors.otp?.message && (
                  <p className="error-msg" role="alert">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    {step2Form.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
                <button type="button" className="btn-primary" style={{ background: "rgba(90, 60, 20, 0.1)", color: "#5a3c14", boxShadow: "none" }} onClick={() => setStep(1)} disabled={isLoading}>
                  Quay lại
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={isLoading}>
                  {isLoading ? <><SpinnerIcon /> Đang xác thực...</> : "Xác nhận OTP"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Change Password Form */}
          {step === 3 && (
            <form onSubmit={step3Form.handleSubmit(onChangePassword)} noValidate style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {step3Form.formState.errors.root?.message && (
                <div className="root-error shake" role="alert">
                  {step3Form.formState.errors.root.message}
                </div>
              )}

              <div>
                <label htmlFor="password" className="field-label">Mật khẩu mới</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    style={{ paddingRight: "48px" }}
                    className={`input-field${step3Form.formState.errors.password ? " error" : ""}`}
                    {...step3Form.register("password")}
                  />
                  <button
                    type="button"
                    style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(90, 60, 20, 0.6)", padding: "4px" }}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {step3Form.formState.errors.password?.message && (
                  <p className="error-msg" role="alert">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    {step3Form.formState.errors.password.message}
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
                    className={`input-field${step3Form.formState.errors.confirmPassword ? " error" : ""}`}
                    {...step3Form.register("confirmPassword")}
                  />
                  <button
                    type="button"
                    style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(90, 60, 20, 0.6)", padding: "4px" }}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {step3Form.formState.errors.confirmPassword?.message && (
                  <p className="error-msg" role="alert">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    {step3Form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: "6px" }}>
                {isLoading ? <><SpinnerIcon /> Đang lưu mật khẩu...</> : "Đổi mật khẩu"}
              </button>
            </form>
          )}

          {/* STEP 4: Success Countdown Redirect */}
          {step === 4 && (
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

          {/* Back to Login Link Footer (Only shown in Step 1, 2, 3) */}
          {step <= 3 && (
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
