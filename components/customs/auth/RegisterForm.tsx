"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Home, AlertCircle } from "lucide-react";

import {
  RegisterFormData,
  registerSchema,
} from "@/schema/request/auth/account/register.req";
import { AuthApi } from "@/services/api/Auth/auth.service";
import { register as registerAction } from "@/stores/slices/auth.store";
import PhoneInput from "./PhoneInput";
import "@/style/login.css";

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function RegisterForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      numberPhone: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      if (data.password !== data.confirmPassword) {
        form.setError("confirmPassword", {
          message: "Passwords do not match.",
        });
        setIsLoading(false);
        return;
      }

      const res = await AuthApi.register(data);

      if (res?.code === 200) {
        dispatch(registerAction(res.data));
        router.push("/auth/login");
      } else {
        form.setError("root", {
          message: res?.message || "Registration failed. Please try again.",
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
  const firstNameError = form.formState.errors.firstName?.message;
  const lastNameError = form.formState.errors.lastName?.message;
  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;
  const confirmPasswordError = form.formState.errors.confirmPassword?.message;
  const phoneError = form.formState.errors.numberPhone?.message;

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
              Create Account
            </h1>
            <p style={{
              fontSize: "14.5px",
              color: "rgba(90, 60, 20, 0.65)",
              marginTop: "6px",
              fontWeight: 400
            }}>
              Register a new Furniro account
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

            {/* Name Fields (2 Column Grid) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {/* First Name */}
              <div>
                <label htmlFor="register-firstname" className="field-label">
                  First Name
                </label>
                <input
                  id="register-firstname"
                  type="text"
                  placeholder="First Name"
                  aria-describedby={firstNameError ? "firstname-error" : undefined}
                  aria-invalid={!!firstNameError}
                  className={`input-field${firstNameError ? " error" : ""}`}
                  {...form.register("firstName")}
                />
                {firstNameError && (
                  <p className="error-msg" id="firstname-error" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {firstNameError}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="register-lastname" className="field-label">
                  Last Name
                </label>
                <input
                  id="register-lastname"
                  type="text"
                  placeholder="Last Name"
                  aria-describedby={lastNameError ? "lastname-error" : undefined}
                  aria-invalid={!!lastNameError}
                  className={`input-field${lastNameError ? " error" : ""}`}
                  {...form.register("lastName")}
                />
                {lastNameError && (
                  <p className="error-msg" id="lastname-error" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {lastNameError}
                  </p>
                )}
              </div>
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="register-email" className="field-label">
                Email address
              </label>
              <input
                id="register-email"
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
              <label htmlFor="register-password" className="field-label">
                Password
              </label>
              <div className="input-wrapper">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
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

            {/* Confirm Password field */}
            <div>
              <label htmlFor="register-confirm-password" className="field-label">
                Confirm Password
              </label>
              <div className="input-wrapper">
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
                  aria-invalid={!!confirmPasswordError}
                  className={`input-field has-toggle${confirmPasswordError ? " error" : ""}`}
                  {...form.register("confirmPassword")}
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="error-msg" id="confirm-password-error" role="alert">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {/* Phone Number Field */}
            <div>
              <label id="phone-input-label" className="field-label">
                Phone Number
              </label>
              <Controller
                control={form.control}
                name="numberPhone"
                render={({ field }) => (
                  <PhoneInput
                    value={field.value}
                    onChange={field.onChange}
                    error={phoneError}
                    id="phone-input"
                    disabled={isLoading}
                  />
                )}
              />
            </div>

            {/* Submit */}
            <button
              id="btn-register-submit"
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              aria-busy={isLoading}
              style={{ marginTop: "4px" }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Registering…
                </>
              ) : (
                "Register"
              )}
            </button>

            {/* Divider */}
            <div className="divider">or continue with</div>

            {/* Google */}
            <button id="btn-register-google" type="button" className="btn-google">
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
            Already have an account?{" "}
            <Link href="/auth/login" className="link-gold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
