import type { Metadata } from "next";
import ConfirmOTPForm from "@/components/customs/auth/ConfirmOTPForm";

export const metadata: Metadata = {
  title: "Confirm OTP — Furniro",
  description:
    "Confirm your OTP code to complete your account verification on Furniro.",
};

export default function ConfirmOTPPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full flex flex-col items-center justify-center gap-4">
        <ConfirmOTPForm />
      </main>
    </div>
  );
}