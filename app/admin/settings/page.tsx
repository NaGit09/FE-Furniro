"use client";

import React, { useEffect, useState } from "react";
import { Settings, ShieldAlert, Cpu, CheckCircle } from "lucide-react";
import { useLanguage } from "@/components/customs/common/LanguageContext";
import SystemPreferences from "@/components/customs/common/SystemPreferences";

export default function AdminSettingsPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8 admin-root max-w-4xl mx-auto px-4 py-8">
      {/* ─── Header Section ─── */}
      <div>
        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest leading-none block">
          SYSTEM PANEL
        </span>
        <h1 className="cormorant-heading text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-none mt-2">
          {t("adminSettingsTitle") || "Cài Đặt Hệ Thống"}
        </h1>
        <p className="text-xs font-semibold text-stone-500 dark:text-stone-455 mt-2">
          {t("adminSettingsSubtitle") || "Tùy chỉnh giao diện quản trị, cài đặt ngôn ngữ và giám sát cấu hình vi dịch vụ nền."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: General preferences (Theme, Lang) */}
        <div className="liquid-glass-card p-6 rounded-2xl border border-stone-200 dark:border-stone-850 space-y-6">
          <h4 className="text-xs font-bold text-stone-955 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2 border-b border-stone-200/40 dark:border-stone-800/40 pb-2">
            <Settings className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            {t("adminSettingsHeading") || "Cấu hình Giao diện & Ngôn ngữ"}
          </h4>

          {/* SystemPreferences component */}
          <SystemPreferences showTheme={true} showLanguage={true} showCurrency={false} />
        </div>

        {/* Right Side: System Logs & Microservices metadata */}
        <div className="liquid-glass-card p-6 rounded-2xl border border-stone-200 dark:border-stone-850 space-y-6">
          <h4 className="text-xs font-bold text-stone-955 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2 border-b border-stone-200/40 dark:border-stone-800/40 pb-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            {t("microservicesStatus") || "Trạng Thái Vi Dịch Vụ (Microservices)"}
          </h4>

          <div className="space-y-3.5">
            {[
              { service: "AuthService (Cổng xác thực)", port: "8081", status: "HEALTHY" },
              { service: "ProductService (Quản lý sản phẩm)", port: "8083", status: "HEALTHY" },
              { service: "OrderService (Quy trình đơn hàng)", port: "8082", status: "HEALTHY" },
              { service: "InventoryService (Quản lý kho hàng)", port: "8085", status: "HEALTHY" },
              { service: "MessageService (Hộp thư & Khuyến mãi)", port: "8086", status: "HEALTHY" },
              { service: "UploadService (Lưu trữ hình ảnh)", port: "8084", status: "HEALTHY" },
            ].map((s, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 rounded-xl bg-stone-50/50 dark:bg-stone-950/40 border border-stone-200/40 dark:border-stone-800/20"
              >
                <div>
                  <span className="text-[11px] font-bold text-stone-900 dark:text-stone-100 block">
                    {s.service}
                  </span>
                  <span className="text-[9px] font-semibold text-stone-400">
                    Port: {s.port} • REST API Active
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[8.5px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-2.5 h-2.5" />
                  {s.status}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 bg-amber-500/5 dark:bg-amber-500/2 border border-amber-500/15 rounded-xl p-3 text-[10px] leading-relaxed text-amber-700 dark:text-amber-500 font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{t("rootAdminWarning") || "Mọi thay đổi cấu hình sâu bên trong database yêu cầu quyền quản trị Root. Vui lòng liên hệ quản trị hệ thống nếu cần hỗ trợ."}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
