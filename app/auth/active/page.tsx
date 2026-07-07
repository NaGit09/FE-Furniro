import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ActiveAccountContent from "@/components/customs/auth/ActiveAccountContent";

export const metadata: Metadata = {
  title: "Kích hoạt tài khoản",
  description: "Xác thực và kích hoạt thành công tư cách hội viên độc quyền Furniro của bạn.",
};

export default function ActiveAccountPage() {
  return (
    <div className="active-root min-h-screen py-24 px-4 flex flex-col items-center justify-center bg-radial-gradient(circle at 10% 20%, rgba(254, 252, 232, 0.4) 0%, rgba(250, 250, 249, 1) 90%) dark:bg-radial-gradient(circle at 10% 20%, rgba(28, 25, 23, 0.8) 0%, rgba(12, 10, 9, 1) 90%) font-sans overflow-hidden">
      {/* Visual background luxury graphics */}
      <div className="absolute top-[10%] left-[10%] text-[10vw] font-bold italic text-amber-500/2 dark:text-white/2 pointer-events-none select-none tracking-tighter font-serif">FURNIRO</div>
      <div className="absolute bottom-[10%] right-[10%] text-[10vw] font-bold italic text-amber-500/2 dark:text-white/2 pointer-events-none select-none tracking-tighter font-serif">MILAN</div>

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center p-12 bg-white/70 dark:bg-stone-900/60 backdrop-blur-2xl rounded-3xl border border-white/25 dark:border-stone-800/40">
          <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
          <p className="mt-4 text-stone-500 dark:text-stone-400 font-medium animate-pulse">Initializing exclusive portal...</p>
        </div>
      }>
        <ActiveAccountContent />
      </Suspense>
    </div>
  );
}