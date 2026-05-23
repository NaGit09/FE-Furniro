/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthApi } from "@/services/api/Auth/auth.service";
import {
  sendOTPSchema,
  SendOTPFormData,
} from "@/schema/request/auth/account/send.req";
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
import { toast } from "sonner";

export default function SendOTPForm() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SendOTPFormData>({
    resolver: zodResolver(sendOTPSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (email: string) => {
    setApiError(null);
    setStatusMessage(null);
    setIsLoading(true);

    try {
      const res = await AuthApi.sendOTP(email);

      console.log("Kết quả gửi OTP:", res);
      if (res?.code === 200) {
        setStatusMessage(
          "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hòm thư.",
        );
        form.reset();
        navigateAfter3Seconds("/auth/confirm-otp");
      } else if (res?.code === 400) {
        toast.info(
          "Bạn đã có mã OTP, chúng tôi sẽ chuyển hướng bạn đến trang xác nhận OTP.",
        );
        navigateAfter3Seconds("/user/confirm");
      } else {
        setApiError(res?.message || "Không thể gửi mã OTP. Vui lòng thử lại.");
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

  return (
    <div className="w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Gửi mã OTP</CardTitle>
          <CardDescription>
            Nhập email để nhận mã OTP xác thực tài khoản / đặt lại mật khẩu.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit((data) => onSubmit(data.email))}
            className="space-y-5"
          >
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

            {apiError ? (
              <p className="text-sm text-red-600">{apiError}</p>
            ) : null}
            {statusMessage ? (
              <p className="text-sm text-green-600">{statusMessage}</p>
            ) : null}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
