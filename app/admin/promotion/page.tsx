"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tag,
  Search,
  RefreshCw,
  Database,
  Calendar,
  X,
  Percent,
  DollarSign,
  AlertTriangle,
  Plus,
  Ticket,
  CheckCircle2,
  Loader2,
  Trash2,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { PromotionApi } from "@/services/api/Message/promotion.service";
import { PromotionReqSchema, PromotionReq } from "@/schema/request/message/Promotion";
import { PromotionRes } from "@/schema/response/message/Promotion";


export default function AdminPromotionPage() {
  // Page Lists & Loading States
  const [promotions, setPromotions] = useState<PromotionRes[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "PERCENT" | "AMOUNT">("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Create Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Language state controls
  const [lang, setLang] = useState<"EN" | "VI">("EN");

  useEffect(() => {
    const savedLang = localStorage.getItem("furniro_language") as "EN" | "VI" | null;
    if (savedLang) setLang(savedLang);
  }, []);

  // Translations object
  const t = {
    title: lang === "VI" ? "Quản lý khuyến mãi" : "Manage Campaigns",
    subtitle: lang === "VI" ? "Xem, kích hoạt các chiến dịch ưu đãi, tạo mới mã coupon giảm giá và theo dõi trạng thái." : "View active promo campaigns, activate coupon structures, monitor statuses, and register new discount events.",
    searchPlaceholder: lang === "VI" ? "Tìm mã, tiêu đề..." : "Search code, campaign title...",
    totalPromo: lang === "VI" ? "Tổng số khuyến mãi" : "Total Campaigns",
    activePromo: lang === "VI" ? "Đang hoạt động" : "Active Campaigns",
    percentPromo: lang === "VI" ? "Giảm theo phần trăm" : "Percentage Discount",
    amountPromo: lang === "VI" ? "Giảm theo số tiền" : "Flat Rate Discount",
    createBtn: lang === "VI" ? "Tạo khuyến mãi mới" : "Create New Campaign",
    syncDb: lang === "VI" ? "Đồng bộ cơ sở dữ liệu" : "Sync Database",
    filterAll: lang === "VI" ? "Tất cả kiểu" : "All Types",
    filterPercent: lang === "VI" ? "Phần trăm (%)" : "Percentage (%)",
    filterAmount: lang === "VI" ? "Số tiền ($)" : "Amount ($)",
    statusAll: lang === "VI" ? "Tất cả trạng thái" : "All Status",
    statusActive: lang === "VI" ? "Đang hoạt động" : "Active",
    statusInactive: lang === "VI" ? "Lưu trữ" : "Archived",
    promoCode: lang === "VI" ? "Mã ưu đãi" : "Promo Code",
    promoValue: lang === "VI" ? "Giá trị giảm" : "Discount Value",
    promoStatus: lang === "VI" ? "Trạng thái" : "Status",
    drawerTitle: lang === "VI" ? "Tạo khuyến mãi mới" : "Register Campaign Invitation",
    formTitle: lang === "VI" ? "Tiêu đề chiến dịch" : "Campaign Title",
    formDesc: lang === "VI" ? "Mô tả chi tiết" : "Detailed Description",
    formCode: lang === "VI" ? "Mã giảm giá" : "Coupon Code",
    formType: lang === "VI" ? "Loại giảm giá" : "Discount Type",
    formValue: lang === "VI" ? "Mức giảm" : "Discount Magnitude",
    formStatus: lang === "VI" ? "Kích hoạt chiến dịch" : "Activate Campaign",
    submitBtn: lang === "VI" ? "Đăng ký khuyến mãi" : "Register Discount Privilege",
    submittingBtn: lang === "VI" ? "Đang đăng ký..." : "Registering...",
    demoBadge: lang === "VI" ? "CHẾ ĐỘ MÔ PHỎNG" : "SIMULATION MODE",
    noCampaign: lang === "VI" ? "Không tìm thấy khuyến mãi nào" : "No Campaigns Registered",
    noCampaignDesc: lang === "VI" ? "Nhấn nút tạo khuyến mãi mới ở góc phải để bắt đầu." : "Click the Create Campaign button to register your first promo event.",
  };

  // Zod backed react-hook-form initialization
  const form = useForm<PromotionReq>({
    resolver: zodResolver(PromotionReqSchema),
    defaultValues: {
      title: "",
      description: "",
      code: "",
      type: "PERCENT",
      value: 10,
      status: true,
    },
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = form;
  const watchType = watch("type");

  // Load promotions list from API
  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await PromotionApi.get_all_promotion();
      if (res?.data?.code === 200 && res.data?.data?.content) {
        setPromotions(res.data.data.content);
      } else {
        setPromotions([]);
        toast.error(res?.data?.message || "Failed to load promotions.");
      }
    } catch (err) {
      console.error("Failed to reach promotion backend.", err);
      setPromotions([]);
      toast.error("Failed to connect to promotion services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Form submission handler
  const onSubmit = async (data: PromotionReq) => {
    setFormSubmitting(true);
    try {
      const res = await PromotionApi.create_promotion(data);
      if (res?.data?.code === 200 || res?.data?.data) {
        toast.success(lang === "VI" ? "Đăng ký khuyến mãi thành công!" : "Privilege campaign registered successfully!");
        reset();
        setDrawerOpen(false);
        loadData(true);
      } else {
        toast.error(res?.data?.message || "Failed to create campaign.");
      }
    } catch (err) {
      console.error("Create promotion error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Live client-side searching and filtering
  const filteredPromotions = useMemo(() => {
    return promotions.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === "ALL" || p.type === filterType;
      
      const matchesStatus =
        filterStatus === "ALL" ||
        (filterStatus === "ACTIVE" && p.status === true) ||
        (filterStatus === "INACTIVE" && p.status === false);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [promotions, searchQuery, filterType, filterStatus]);

  // KPI Valuations
  const totalCount = promotions.length;
  const activeCount = promotions.filter((p) => p.status === true).length;
  const percentCount = promotions.filter((p) => p.type === "PERCENT").length;
  const amountCount = promotions.filter((p) => p.type === "AMOUNT").length;

  return (
    <div className="space-y-8 admin-root relative">
      {/* ─── Montserrat & Cormorant Google Fonts Loader ─── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;550;600;700&display=swap');
        
        .admin-root {
          font-family: 'Montserrat', sans-serif;
        }
        
        .cormorant-heading {
          font-family: 'Cormorant Garamond', serif;
        }

        /* Glassmorphism Liquid Glass Card */
        .glass-promo-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(20px) saturate(190%);
          -webkit-backdrop-filter: blur(20px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 
            0 8px 32px rgba(27, 23, 20, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease, border-color 300ms ease;
        }
        .dark .glass-promo-card {
          background: rgba(24, 22, 20, 0.55);
          backdrop-filter: blur(20px) saturate(190%);
          -webkit-backdrop-filter: blur(20px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.04);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        .glass-promo-card:hover {
          transform: translateY(-2px);
          border-color: rgba(202, 138, 4, 0.3);
          box-shadow: 0 12px 30px rgba(202, 138, 4, 0.06);
        }
        .dark .glass-promo-card:hover {
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
        }

        /* Slide-over creation drawer overlay */
        .glass-drawer-overlay {
          background: rgba(12, 10, 9, 0.45);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .creation-drawer {
          animation: drawerSlideIn 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes drawerSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .shake-err { animation: shake 0.4s ease; }
      `}</style>

      {/* ─── Ambient Glow Blobs ─── */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-radial from-amber-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-radial from-amber-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* ─── Page Title & Action Center ─── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest leading-none block">
              CAMPAIGN OPERATIONS
            </span>

          </div>
          <h1 className="cormorant-heading text-3xl md:text-4.5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-none mt-2">
            {t.title}
          </h1>
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-450 mt-2">
            {t.subtitle}
          </p>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <button 
            onClick={() => {
              loadData();
              toast.success("Promotions synchronized successfully!");
            }}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-300 transition-all cursor-pointer shadow-xs active:scale-95 bg-white/40 dark:bg-stone-900/40"
            title={t.syncDb}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setDrawerOpen(true)}
            className="h-11 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 flex items-center gap-2 shadow-md hover:shadow-amber-600/10 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" /> {t.createBtn}
          </button>
        </div>
      </div>

      {/* ─── KPI Stats Cards ─── */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: t.totalPromo, value: totalCount, subtitle: "Total campaigns registered", icon: Ticket, color: "text-amber-600 dark:text-amber-500" },
          { title: t.activePromo, value: activeCount, subtitle: "Currently active on frontend", icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-500" },
          { title: t.percentPromo, value: percentCount, subtitle: "Percentage voucher structures", icon: Percent, color: "text-blue-600" },
          { title: t.amountPromo, value: amountCount, subtitle: "Flat rate coupon structures", icon: DollarSign, color: "text-rose-600" },
        ].map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="glass-promo-card rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">
                    {c.title}
                  </span>
                  <h3 className="cormorant-heading text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 mt-1.5 leading-none">
                    {c.value}
                  </h3>
                  <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wide mt-2 block">
                    {c.subtitle}
                  </span>
                </div>
                <div className={`p-3 rounded-xl bg-stone-100/60 dark:bg-stone-950/40 shrink-0 ${c.color}`}>
                  <Icon className="w-5.5 h-5.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Filtering & Searching Toolbar ─── */}
      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-stone-200/40 dark:border-stone-800/40">
          
          {/* Status and Type Filtering Pills */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter by Type */}
            <div className="flex bg-stone-100 dark:bg-stone-950 p-1 rounded-xl border border-stone-200/50 dark:border-stone-850/50">
              {([
                { key: "ALL", label: t.filterAll },
                { key: "PERCENT", label: t.filterPercent },
                { key: "AMOUNT", label: t.filterAmount }
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setFilterType(opt.key)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    filterType === opt.key
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-stone-605 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Filter by Status */}
            <div className="flex bg-stone-100 dark:bg-stone-950 p-1 rounded-xl border border-stone-200/50 dark:border-stone-850/50">
              {([
                { key: "ALL", label: t.statusAll },
                { key: "ACTIVE", label: t.statusActive },
                { key: "INACTIVE", label: t.statusInactive }
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setFilterStatus(opt.key)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    filterStatus === opt.key
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative shrink-0 self-start md:self-center">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 text-xs font-semibold focus:outline-none focus:border-amber-600 transition-all dark:text-white"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* ─── DATA RENDERING GRID ─── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Loading campaigns data...</p>
          </div>
        ) : filteredPromotions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400 border border-dashed border-stone-250 dark:border-stone-850 rounded-[30px] bg-white/20 dark:bg-stone-900/10">
            <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-700 dark:text-stone-300">{t.noCampaign}</h4>
            <p className="text-[10px] mt-1 text-center text-stone-400 dark:text-stone-500 max-w-sm">{t.noCampaignDesc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromotions.map((p) => {
              const isPercent = p.type === "PERCENT";
              return (
                <div
                  key={p.id}
                  className="glass-promo-card rounded-[24px] p-6 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header: Status & Code Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider ${
                        p.status
                          ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/20"
                          : "bg-stone-500/15 text-stone-600 border border-stone-500/20 dark:text-stone-400"
                      }`}>
                        {p.status ? t.statusActive : t.statusInactive}
                      </span>
                      
                      <span className={`px-2.5 py-1 text-[9px] font-bold rounded-lg uppercase tracking-wider font-mono flex items-center gap-1.5 ${
                        isPercent 
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}>
                        {isPercent ? <Percent className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
                        {isPercent ? `${p.value}%` : `$${p.value}`}
                      </span>
                    </div>

                    {/* Code Container */}
                    <div className="p-3 bg-stone-100/50 dark:bg-stone-950/40 border border-stone-200/40 dark:border-stone-850/40 rounded-xl flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">{t.promoCode}</span>
                      <span className="font-mono text-sm font-extrabold tracking-widest text-stone-900 dark:text-stone-100 bg-amber-500/15 px-2.5 py-0.5 rounded-md border border-amber-500/20">{p.code}</span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-tight">{p.title}</h4>
                      <p className="text-[10px] text-stone-400 dark:text-stone-500 leading-relaxed font-semibold">{p.description}</p>
                    </div>
                  </div>

                  {/* Footer Stats summary */}
                  <div className="pt-4 border-t border-stone-200/20 dark:border-stone-850/40 flex items-center justify-between text-[9px] font-bold text-stone-400 dark:text-stone-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      ID: #{p.id}
                    </span>
                    
                    <span className="hover:text-amber-650 cursor-default transition-colors">
                      Furniro Campaigns
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================================================== */}
      {/* ─── MODAL: CREATE PROMOTION Slide-over Drawer ───── */}
      {/* ================================================== */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end glass-drawer-overlay">
          {/* Backdrop trigger close */}
          <div onClick={() => setDrawerOpen(false)} className="absolute inset-0 z-10" />

          {/* Right-aligned Drawer panel */}
          <div className="creation-drawer absolute right-0 top-0 bottom-0 z-20 w-full max-w-lg bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Header banner glow */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-amber-600 via-amber-500 to-yellow-500" />
            
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* Title & Close */}
              <div className="flex items-center justify-between p-6 border-b border-stone-200/40 dark:border-stone-800/40">
                <div>
                  <span className="text-[9px] font-extrabold text-amber-650 dark:text-amber-500 uppercase tracking-widest">Register Vouchers</span>
                  <h3 className="cormorant-heading text-2xl font-bold text-stone-900 dark:text-stone-50 mt-1">{t.drawerTitle}</h3>
                </div>
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-xl border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-950 text-stone-600 cursor-pointer dark:text-stone-300 active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label htmlFor="title" className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    {t.formTitle}
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="E.g., Welcome discount code for design week"
                    className={`w-full px-4 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-950 border ${errors.title ? "border-red-500 focus:border-red-500 shake-err" : "border-stone-200 dark:border-stone-800 focus:border-amber-600"} text-xs font-semibold focus:outline-none transition-all dark:text-white`}
                    {...register("title", { required: true })}
                  />
                  {errors.title && <p className="text-red-500 text-[10px] font-bold">Title is required.</p>}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label htmlFor="description" className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    {t.formDesc}
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Enter promotion details, terms and conditions..."
                    className={`w-full p-4 rounded-lg bg-stone-50 dark:bg-stone-950 border ${errors.description ? "border-red-500 focus:border-red-500 shake-err" : "border-stone-200 dark:border-stone-800 focus:border-amber-600"} text-xs font-semibold focus:outline-none transition-all resize-none dark:text-white`}
                    {...register("description", { required: true })}
                  />
                  {errors.description && <p className="text-red-500 text-[10px] font-bold">Description is required.</p>}
                </div>

                {/* Code */}
                <div className="space-y-1.5">
                  <label htmlFor="code" className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    {t.formCode}
                  </label>
                  <input
                    id="code"
                    type="text"
                    placeholder="WELCOME10"
                    className={`w-full px-4 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-950 border ${errors.code ? "border-red-500 focus:border-red-500 shake-err" : "border-stone-200 dark:border-stone-800 focus:border-amber-600"} text-xs font-mono font-bold focus:outline-none transition-all uppercase dark:text-white`}
                    {...register("code", { required: true })}
                    onChange={(e) => {
                      setValue("code", e.target.value.toUpperCase());
                    }}
                  />
                  {errors.code && <p className="text-red-500 text-[10px] font-bold">Promo code is required.</p>}
                </div>

                {/* Type Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                    {t.formType}
                  </label>
                  <div className="flex bg-stone-100 dark:bg-stone-950 p-1 rounded-xl border border-stone-200/50 dark:border-stone-850/50 max-w-xs">
                    {([
                      { key: "PERCENT", label: t.filterPercent },
                      { key: "AMOUNT", label: t.filterAmount }
                    ] as const).map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setValue("type", opt.key)}
                        className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                          watchType === opt.key
                            ? "bg-amber-600 text-white shadow-xs"
                            : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discount Value */}
                <div className="space-y-1.5">
                  <label htmlFor="value" className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    {t.formValue} ({watchType === "PERCENT" ? "%" : "$"})
                  </label>
                  <input
                    id="value"
                    type="number"
                    min={1}
                    placeholder="10"
                    className={`w-full px-4 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-950 border ${errors.value ? "border-red-500 focus:border-red-500 shake-err" : "border-stone-200 dark:border-stone-800 focus:border-amber-600"} text-xs font-semibold focus:outline-none transition-all dark:text-white`}
                    {...register("value", {
                      required: true,
                      valueAsNumber: true,
                      validate: (v) => {
                        if (isNaN(v) || v <= 0) return "Value must be positive";
                        if (watchType === "PERCENT" && v > 100) return "Percentage discount cannot exceed 100%";
                        return true;
                      }
                    })}
                  />
                  {errors.value && <p className="text-red-500 text-[10px] font-bold">{errors.value.message || "Value is required."}</p>}
                </div>

                {/* Status Checkbox */}
                <div className="flex items-center space-x-3 p-4 bg-stone-100/50 dark:bg-stone-950/30 border border-stone-200/20 dark:border-stone-850/20 rounded-2xl hover:border-yellow-600/25 transition-all cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="status" 
                    defaultChecked
                    className="w-5 h-5 accent-yellow-600 rounded cursor-pointer"
                    {...register("status")}
                  />
                  <label htmlFor="status" className="text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer select-none">
                    {t.formStatus}
                  </label>
                </div>

                {/* CTA Button */}
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full h-12 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md hover:shadow-amber-600/10 cursor-pointer duration-300"
                >
                  {formSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.submittingBtn}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      {t.submitBtn}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-stone-200/40 dark:border-stone-800/40 bg-stone-50 dark:bg-stone-950/30 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
