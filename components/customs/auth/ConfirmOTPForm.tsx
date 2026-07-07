/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthApi } from "@/services/api/Auth/auth.service";
import {
  confirmOTP,
  ConfirmOTPFormData,
} from "@/schema/request/auth/account/confirm.req";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { navigateAfter3Seconds } from "@/lib/utils/navigateUtils";

export default function ConfirmOTPForm() {

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [apiError, setApiError] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ConfirmOTPFormData>({
    resolver: zodResolver(confirmOTP),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const onSubmit = async (data: ConfirmOTPFormData) => {
    setApiError(null);
    setStatusMessage(null);
    setIsLoading(true);

    try {
      console.log("Xác nhận OTP cho email:", data.email);
      const res = await AuthApi.confirmOTP(data);

      if (res?.code === 200) {
        const resetToken = res.data?.resetToken;
        if (resetToken) {
          setStatusMessage(
            "Xác nhận OTP thành công. Đang chuyển hướng đến trang đổi mật khẩu...",
          );
          form.reset();
          navigateAfter3Seconds(
            `/auth/change-password?email=${encodeURIComponent(data.email)}&token=${encodeURIComponent(resetToken)}`
          );
        } else {
          setStatusMessage(
            "Xác nhận OTP thành công. Tài khoản của bạn đã được kích hoạt.",
          );
          form.reset();
          navigateAfter3Seconds("/auth/login");
        }
      } else {
        setApiError(
          res?.message || "Không thể xác nhận OTP. Vui lòng thử lại.",
        );
      }
    } catch (error) {
      let message = "Đã xảy ra lỗi khi gửi yêu cầu.";
      const serverMessage = (error as any)?.response?.data?.message;
      if (serverMessage) {
        message = serverMessage;
      } else if (error instanceof Error) {
        message = error.message;
      }
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const emailError = form.formState.errors.email?.message;
  const otpError = form.formState.errors.otp?.message;

  return (
    <div className="w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Xác nhận mã OTP</CardTitle>
          <CardDescription>
            Nhập email và mã OTP để xác thực tài khoản của bạn.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...form.register("email")}
                aria-invalid={!!emailError}
                required
              />
              {emailError ? (
                <p className="text-sm text-red-600">{emailError}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="otp">Mã OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Nhập mã OTP 6 chữ số"
                {...form.register("otp")}
                aria-invalid={!!otpError}
                required
              />
              {otpError ? (
                <p className="text-sm text-red-600">{otpError}</p>
              ) : null}
            </div>

            {apiError ? (
              <p className="text-sm text-red-600">{apiError}</p>
            ) : null}
            {statusMessage ? (
              <p className="text-sm text-green-600">{statusMessage}</p>
            ) : null}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xác nhận..." : "Xác nhận OTP"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
