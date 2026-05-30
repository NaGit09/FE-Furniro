"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Mail,
  User,
  Calendar,
  Phone,
  Search,
  RefreshCw,
  SlidersHorizontal,
  UserCheck,
  AlertTriangle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { SubscribeApi } from "@/services/api/Message/subscribe.service";
import { SubcribeRes } from "@/schema/response/message/Subscribe";

export default function AdminSubscriptionPage() {
  // Page lists & Loading states
  const [subscribers, setSubscribers] = useState<SubcribeRes[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"DATE_DESC" | "DATE_ASC" | "NAME_ASC" | "NAME_DESC">("DATE_DESC");

  // Language state controls
  const [lang, setLang] = useState<"EN" | "VI">("EN");

  useEffect(() => {
    const savedLang = localStorage.getItem("furniro_language") as "EN" | "VI" | null;
    if (savedLang) setLang(savedLang);
  }, []);

  // Translations
  const t = {
    title: lang === "VI" ? "Đăng ký nhận tin" : "Subscription Directory",
    subtitle: lang === "VI" ? "Xem danh sách tài khoản đăng ký nhận tin, tìm kiếm thành viên và theo dõi chỉ số tăng trưởng." : "View registered club members, search user directories, filter signups, and monitor membership metrics.",
    searchPlaceholder: lang === "VI" ? "Tìm tên, email, điện thoại..." : "Search name, email, phone...",
    totalMembers: lang === "VI" ? "Tổng số thành viên" : "Total Members",
    phoneProvide: lang === "VI" ? "Cung cấp số điện thoại" : "Phone Reachability",
    recentSignups: lang === "VI" ? "Thành viên mới (Tuần này)" : "New Members (This Week)",
    syncDb: lang === "VI" ? "Đồng bộ danh sách" : "Sync Directory",
    exportBtn: lang === "VI" ? "Xuất dữ liệu" : "Export List",
    colName: lang === "VI" ? "Họ và tên" : "Member Name",
    colEmail: lang === "VI" ? "Địa chỉ Email" : "Email Address",
    colPhone: lang === "VI" ? "Số điện thoại" : "Phone Number",
    colDate: lang === "VI" ? "Ngày tham gia" : "Date Joined",
    noMembers: lang === "VI" ? "Không có thành viên nào đăng ký" : "No Subscribers Found",
    noMembersDesc: lang === "VI" ? "Danh sách thành viên đăng ký trống. Vui lòng kiểm tra lại sau." : "The subscription directory is currently empty. Verify database status.",
    sortNewest: lang === "VI" ? "Mới nhất trước" : "Newest Joined",
    sortOldest: lang === "VI" ? "Cũ nhất trước" : "Oldest Joined",
    sortNameAZ: lang === "VI" ? "Tên A-Z" : "Name A-Z",
    sortNameZA: lang === "VI" ? "Tên Z-A" : "Name Z-A",
    unspecified: lang === "VI" ? "Không cung cấp" : "Unspecified",
  };

  // Load Subscribers from Backend
  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await SubscribeApi.get_all_subscribe();
      if (res?.data?.code === 200 && res.data?.data?.content) {
        setSubscribers(res.data.data.content);
      } else {
        setSubscribers([]);
        toast.error(res?.data?.message || "Failed to load subscriptions.");
      }
    } catch (err) {
      console.error("Failed to reach subscription backend services.", err);
      setSubscribers([]);
      toast.error("Failed to connect to subscription services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return t.unspecified;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(lang === "VI" ? "vi-VN" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Live client-side searching and sorting
  const filteredSubscribers = useMemo(() => {
    const matched = subscribers.filter((s) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        s.fullName?.toLowerCase().includes(searchLower) ||
        s.email?.toLowerCase().includes(searchLower) ||
        s.phone?.toLowerCase().includes(searchLower)
      );
    });

    // Apply sorting
    return matched.sort((a, b) => {
      if (sortBy === "DATE_DESC") {
        return new Date(b.subscribedAt || 0).getTime() - new Date(a.subscribedAt || 0).getTime();
      }
      if (sortBy === "DATE_ASC") {
        return new Date(a.subscribedAt || 0).getTime() - new Date(b.subscribedAt || 0).getTime();
      }
      if (sortBy === "NAME_ASC") {
        return (a.fullName || "").localeCompare(b.fullName || "");
      }
      if (sortBy === "NAME_DESC") {
        return (b.fullName || "").localeCompare(a.fullName || "");
      }
      return 0;
    });
  }, [subscribers, searchQuery, sortBy]);

  // KPI Statistics
  const totalSubscribers = subscribers.length;
  
  const phonePercentage = useMemo(() => {
    if (totalSubscribers === 0) return 0;
    const withPhone = subscribers.filter((s) => s.phone && s.phone.trim().length > 0).length;
    return Math.round((withPhone / totalSubscribers) * 100);
  }, [subscribers, totalSubscribers]);

  const recentSignupsCount = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return subscribers.filter((s) => {
      if (!s.subscribedAt) return false;
      return new Date(s.subscribedAt).getTime() >= oneWeekAgo.getTime();
    }).length;
  }, [subscribers]);

  // CSV Exporter Simulation
  const handleExportCSV = () => {
    if (filteredSubscribers.length === 0) {
      toast.error("No data available to export.");
      return;
    }
    
    try {
      const headers = "ID,Full Name,Email,Phone,Subscribed At\n";
      const rows = filteredSubscribers.map(
        (s) => `${s.id},"${s.fullName || ""}","${s.email || ""}","${s.phone || ""}","${s.subscribedAt || ""}"`
      ).join("\n");
      
      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `furniro_subscribers_${Date.now()}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV report dispatched successfully!");
    } catch {
      toast.error("Failed to generate export report.");
    }
  };

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

        /* Glassmorphism Liquid Glass Table Card */
        .glass-sub-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(20px) saturate(190%);
          -webkit-backdrop-filter: blur(20px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 
            0 8px 32px rgba(27, 23, 20, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }
        .dark .glass-sub-card {
          background: rgba(24, 22, 20, 0.55);
          backdrop-filter: blur(20px) saturate(190%);
          -webkit-backdrop-filter: blur(20px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.04);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        
        /* Stats card hover rules */
        .glass-kpi-card {
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease;
        }
        .glass-kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(202, 138, 4, 0.06);
        }
        .dark .glass-kpi-card:hover {
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
        }
      `}</style>

      {/* ─── Ambient Glow Blobs ─── */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-radial from-amber-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-radial from-amber-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* ─── Page Title & Action Center ─── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest leading-none block">
            AUDIENCE DIRECTORY
          </span>
          <h1 className="cormorant-heading text-3xl md:text-4.5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-none mt-2">
            {t.title}
          </h1>
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-450 mt-2">
            {t.subtitle}
          </p>
        </div>

        {/* Sync & Export Controls */}
        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <button 
            onClick={() => {
              loadData();
              toast.success("Subscriber directory synced successfully!");
            }}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-300 transition-all cursor-pointer shadow-xs active:scale-95 bg-white/40 dark:bg-stone-900/40"
            title={t.syncDb}
          >
            <RefreshCw className="w-4 h-4 animate-in duration-500" />
          </button>
          
          <button
            onClick={handleExportCSV}
            className="h-11 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 flex items-center gap-2 shadow-md hover:shadow-amber-600/10 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4.5 h-4.5" /> {t.exportBtn}
          </button>
        </div>
      </div>

      {/* ─── KPI Stats Cards ─── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: t.totalMembers, value: totalSubscribers, subtitle: "Total registered club emails", icon: UserCheck, color: "text-amber-600 dark:text-amber-500" },
          { title: t.phoneProvide, value: `${phonePercentage}%`, subtitle: "Subscribers reachable by SMS", icon: Phone, color: "text-emerald-600 dark:text-emerald-500" },
          { title: t.recentSignups, value: recentSignupsCount, subtitle: "New subscriptions logged", icon: Calendar, color: "text-blue-600" },
        ].map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="glass-sub-card glass-kpi-card rounded-2xl p-6 relative overflow-hidden flex items-center justify-between">
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
          );
        })}
      </div>

      {/* ─── Filtering & Searching Toolbar ─── */}
      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-stone-200/40 dark:border-stone-800/40">
          
          {/* Sorting Controller Dropdown */}
          <div className="flex items-center gap-3 bg-stone-100 dark:bg-stone-950 p-1.5 rounded-xl border border-stone-200/50 dark:border-stone-850/50">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-450 focus:outline-none cursor-pointer pr-3"
            >
              <option value="DATE_DESC">{t.sortNewest}</option>
              <option value="DATE_ASC">{t.sortOldest}</option>
              <option value="NAME_ASC">{t.sortNameAZ}</option>
              <option value="NAME_DESC">{t.sortNameZA}</option>
            </select>
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

        {/* ─── DATA RENDERING LIST / TABLE ─── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Loading members directory...</p>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400 border border-dashed border-stone-250 dark:border-stone-850 rounded-[30px] bg-white/20 dark:bg-stone-900/10">
            <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-700 dark:text-stone-300">{t.noMembers}</h4>
            <p className="text-[10px] mt-1 text-center text-stone-400 dark:text-stone-500 max-w-sm">{t.noMembersDesc}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-[24px] glass-sub-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200/50 dark:border-stone-800/40 bg-stone-100/30 dark:bg-stone-950/20">
                      <th className="px-6 py-4.5 text-[10px] font-extrabold uppercase tracking-widest text-stone-450">ID</th>
                      <th className="px-6 py-4.5 text-[10px] font-extrabold uppercase tracking-widest text-stone-450">{t.colName}</th>
                      <th className="px-6 py-4.5 text-[10px] font-extrabold uppercase tracking-widest text-stone-450">{t.colEmail}</th>
                      <th className="px-6 py-4.5 text-[10px] font-extrabold uppercase tracking-widest text-stone-450">{t.colPhone}</th>
                      <th className="px-6 py-4.5 text-[10px] font-extrabold uppercase tracking-widest text-stone-450">{t.colDate}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((s, idx) => (
                      <tr 
                        key={s.id}
                        className={`border-b border-stone-200/30 dark:border-stone-800/20 transition-all hover:bg-stone-100/50 dark:hover:bg-stone-950/30 ${
                          idx % 2 === 1 ? "bg-stone-50/20 dark:bg-stone-900/10" : ""
                        }`}
                      >
                        <td className="px-6 py-4 text-xs font-mono font-bold text-stone-400">#{s.id}</td>
                        <td className="px-6 py-4 text-xs font-bold text-stone-900 dark:text-stone-100">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded bg-amber-500/10 text-amber-600">
                              <User className="w-3.5 h-3.5" />
                            </span>
                            {s.fullName}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-stone-600 dark:text-stone-300">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-stone-400" />
                            {s.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono font-bold text-stone-600 dark:text-stone-350">
                          {s.phone ? (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-stone-400" />
                              {s.phone}
                            </div>
                          ) : (
                            <span className="italic text-stone-400 dark:text-stone-600 font-sans font-medium text-[10px]">
                              {t.unspecified}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-stone-500 dark:text-stone-400">
                          {formatDate(s.subscribedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards View (<768px) */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {filteredSubscribers.map((s) => (
                <div 
                  key={s.id} 
                  className="rounded-2xl p-5 glass-sub-card space-y-4"
                >
                  {/* Title Bar */}
                  <div className="flex items-center justify-between border-b border-stone-250/20 dark:border-stone-850/40 pb-2.5">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 flex items-center gap-1.5">
                      <User className="w-4 h-4 shrink-0" />
                      {s.fullName}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-stone-400">#{s.id}</span>
                  </div>

                  {/* Body Info */}
                  <div className="space-y-2.5 text-xs">
                    {/* Email */}
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-stone-400 dark:text-stone-550 font-bold text-[10px] uppercase tracking-wider shrink-0">{t.colEmail}</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100 truncate max-w-[200px] flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" /> {s.email}
                      </span>
                    </div>

                    {/* Phone */}
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-stone-400 dark:text-stone-555 font-bold text-[10px] uppercase tracking-wider shrink-0">{t.colPhone}</span>
                      {s.phone ? (
                        <span className="font-mono font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" /> {s.phone}
                        </span>
                      ) : (
                        <span className="italic text-stone-400 dark:text-stone-600 text-[10px] font-medium">{t.unspecified}</span>
                      )}
                    </div>

                    {/* Joined At */}
                    <div className="flex justify-between items-center gap-3 border-t border-stone-200/20 dark:border-stone-850/20 pt-2.5">
                      <span className="text-stone-400 dark:text-stone-550 font-bold text-[10px] uppercase tracking-wider shrink-0">{t.colDate}</span>
                      <span className="font-semibold text-stone-500 dark:text-stone-450">{formatDate(s.subscribedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}