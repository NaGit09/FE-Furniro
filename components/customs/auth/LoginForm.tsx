"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  LoginFormData,
  loginSchema,
} from "@/schema/request/auth/account/login.req";
import { AuthApi } from "@/services/api/Auth/auth.service";
import { login as loginAction } from "@/stores/slices/auth.store";
import { removeCookie } from "@/lib/utils/cookieUtils";

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

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/* ─────────────────────────────────────────── Component ─── */
export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      removeCookie("AccessToken");
      
      const res = await AuthApi.login(data);

      if (res?.code === 200) {
        dispatch(loginAction(res.data));
        
        // Extract role by decoding the AccessToken JWT
        const accessToken = res.data?.AccessToken;
        let role: string | undefined = undefined;
        
        if (accessToken) {
          try {
            const { parseJwt } = await import("@/lib/utils/jwt");
            const decoded = parseJwt(accessToken);
            if (decoded) {
              role = decoded.role || decoded.Role;
            }
          } catch (e) {
            console.error("Failed to decode token for role:", e);
          }
        }

        if (role && String(role).toUpperCase() === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        form.setError("root", {
          message: res?.message || "Invalid email or password. Please try again.",
        });
      }
    } catch (err) {
      form.setError("root", {
        message: err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const rootError = form.formState.errors.root?.message;
  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

        .login-root {
          font-family: 'Inter', sans-serif;
        }
        .login-heading {
          font-family: 'Playfair Display', serif;
        }

        /* Liquid Glass card */
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

        /* Iridescent shimmer on card border */
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

        /* Floating label input */
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

        /* Primary button */
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

        /* Google button */
        .btn-google {
          width: 100%;
          padding: 13px 24px;
          background: rgba(255, 255, 255, 0.55);
          color: #1a0a00;
          font-weight: 600;
          font-size: 15px;
          border: 1.5px solid rgba(202, 138, 4, 0.3);
          border-radius: 12px;
          cursor: pointer;
          transition: background 200ms ease, box-shadow 200ms ease, transform 150ms ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          backdrop-filter: blur(8px);
        }
        .btn-google:hover {
          background: rgba(255, 255, 255, 0.75);
          box-shadow: 0 4px 16px rgba(139, 90, 43, 0.15);
          transform: translateY(-1px);
        }
        .btn-google:active {
          transform: translateY(0);
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(90, 60, 20, 0.5);
          font-size: 13px;
          font-weight: 500;
        }
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(202, 138, 4, 0.3), transparent);
        }

        /* Error shake animation */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .shake { animation: shake 0.4s ease; }

        /* Fade-in animation */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.5s ease forwards; }

        /* Error message */
        .error-msg {
          color: #dc2626;
          font-size: 12.5px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 5px;
        }

        /* Root error banner */
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

        /* Input wrapper */
        .input-wrapper {
          position: relative;
        }
        .input-wrapper .toggle-pw {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(90, 60, 20, 0.6);
          transition: color 200ms;
          display: flex;
          align-items: center;
          padding: 4px;
        }
        .input-wrapper .toggle-pw:hover {
          color: #ca8a04;
        }
        .input-field.has-toggle {
          padding-right: 48px;
        }

        /* Label */
        .field-label {
          display: block;
          font-size: 13.5px;
          font-weight: 600;
          color: #5a3c14;
          margin-bottom: 6px;
          letter-spacing: 0.2px;
        }

        /* Link */
        .link-gold {
          color: #b45309;
          font-weight: 600;
          text-decoration: none;
          transition: color 200ms;
          position: relative;
        }
        .link-gold::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 1px;
          background: #ca8a04;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 200ms ease;
        }
        .link-gold:hover { color: #ca8a04; }
        .link-gold:hover::after { transform: scaleX(1); }

        @media (prefers-reduced-motion: reduce) {
          .fade-in-up, .shake { animation: none; }
          * { transition-duration: 0.01ms !important; }
        }
      `}</style>

      <div
        className="login-root fade-in-up"
        style={{ width: "100%", maxWidth: "460px" }}
      >
        {/* Glass card */}
        <div
          className="glass-card"
          style={{ borderRadius: "24px", padding: "40px 40px 36px", position: "relative" }}
        >
          {/* Logo / Brand */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #b45309, #d97706)",
              marginBottom: "16px",
              boxShadow: "0 4px 16px rgba(180, 83, 9, 0.35)"
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h1 className="login-heading" style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#1a0a00",
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: "-0.3px"
            }}>
              Welcome back
            </h1>
            <p style={{
              fontSize: "14.5px",
              color: "rgba(90, 60, 20, 0.65)",
              marginTop: "6px",
              fontWeight: 400
            }}>
              Sign in to your Furniro account
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            {/* Root error */}
            {rootError && (
              <div className="root-error shake" role="alert" aria-live="assertive">
                {rootError}
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="login-email" className="field-label">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-describedby={emailError ? "email-error" : undefined}
                aria-invalid={!!emailError}
                className={`input-field${emailError ? " error" : ""}`}
                {...form.register("email")}
              />
              {emailError && (
                <p className="error-msg" id="email-error" role="alert">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  {emailError}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <label htmlFor="login-password" className="field-label" style={{ margin: 0 }}>
                  Password
                </label>
                <Link href="/auth/forgot" className="link-gold" style={{ fontSize: "13px" }}>
                  Forgot password?
                </Link>
              </div>
              <div className="input-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-describedby={passwordError ? "password-error" : undefined}
                  aria-invalid={!!passwordError}
                  className={`input-field has-toggle${passwordError ? " error" : ""}`}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {passwordError && (
                <p className="error-msg" id="password-error" role="alert">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  {passwordError}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              id="btn-login-submit"
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              aria-busy={isLoading}
              style={{ marginTop: "4px" }}
            >
              {isLoading ? (
                <>
                  <SpinnerIcon />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="divider">or continue with</div>

            {/* Google */}
            <button id="btn-login-google" type="button" className="btn-google">
              <GoogleIcon />
              Continue with Google
            </button>
          </form>

          {/* Footer */}
          <p style={{
            textAlign: "center",
            fontSize: "14px",
            color: "rgba(90, 60, 20, 0.65)",
            marginTop: "24px",
            marginBottom: 0
          }}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="link-gold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
