"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Home, AlertCircle } from "lucide-react";

import {
  LoginFormData,
  loginSchema,
} from "@/schema/request/auth/account/login.req";
import { AuthApi } from "@/services/api/Auth/auth.service";
import { login as loginAction } from "@/stores/slices/auth.store";
import { removeCookie } from "@/lib/utils/cookieUtils";
import "@/style/login.css";

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

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
              <Home className="w-6.5 h-6.5 text-white" />
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
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
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
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="error-msg" id="password-error" role="alert">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
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
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
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
