/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, CheckCircle, ArrowLeft, AlertCircle } from "lucide-react";

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
import "@/style/forgot-password.css";

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
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {step1Form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: "6px" }}>
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2 inline-block" /> Đang gửi mã...</> : "Gửi mã OTP"}
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
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {step2Form.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
                <button type="button" className="btn-primary" style={{ background: "rgba(90, 60, 20, 0.1)", color: "#5a3c14", boxShadow: "none" }} onClick={() => setStep(1)} disabled={isLoading}>
                  Quay lại
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={isLoading}>
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2 inline-block" /> Đang xác thực...</> : "Xác nhận OTP"}
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
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {step3Form.formState.errors.password?.message && (
                  <p className="error-msg" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
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
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {step3Form.formState.errors.confirmPassword?.message && (
                  <p className="error-msg" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {step3Form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: "6px" }}>
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2 inline-block" /> Đang lưu mật khẩu...</> : "Đổi mật khẩu"}
              </button>
            </form>
          )}

          {/* STEP 4: Success Countdown Redirect */}
          {step === 4 && (
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

          {/* Back to Login Link Footer (Only shown in Step 1, 2, 3) */}
          {step <= 3 && (
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
