"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, ShoppingBag, AlertTriangle, Info, CheckCheck, BellOff, Clock } from "lucide-react";
import { useLanguage } from "@/components/customs/common/LanguageContext";
import { useNotifications, NotificationItem } from "@/services/socket/notifications";

const formatTime = (isoString: string) => {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "Just now";
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return "";
  }
};

export default function NotificationDropdown() {
  const { t } = useLanguage();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Consume our real-time notification hook
  const { notifications, markAsRead, isConnected } = useNotifications();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Handle click outside to close
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    const unreadItems = notifications.filter((n) => !n.isRead);
    await Promise.all(unreadItems.map((n) => markAsRead(n.id)));
  };

  const handleItemClick = (item: NotificationItem) => {
    if (!item.isRead) {
      markAsRead(item.id);
    }
    setOpen(false);

    const type = (item.type || "system").toLowerCase();
    const isAdmin = window.location.pathname.startsWith("/admin");

    if (type.includes("order")) {
      const idMatch = (item.title + " " + item.content).match(/#(\d+)\b/) || 
                      (item.title + " " + item.content).match(/\border\s+(\d+)\b/i);
      if (isAdmin) {
        router.push("/admin/order");
      } else {
        if (idMatch && idMatch[1]) {
          router.push(`/user/orders/${idMatch[1]}`);
        } else {
          router.push("/user/orders");
        }
      }
    } else if (type.includes("inventory") || type.includes("stock") || type.includes("alert")) {
      if (isAdmin) {
        router.push("/admin/inventory");
      }
    } else if (type.includes("chat") || type.includes("message")) {
      if (isAdmin) {
        router.push("/admin/chat");
      }
    }
  };

  const getNotificationDetails = (item: NotificationItem) => {
    const title = item.title || "Notification";
    const content = item.content || "";
    if (title.toLowerCase() === content.toLowerCase()) {
      const typeCapitalized = item.type 
        ? item.type.charAt(0).toUpperCase() + item.type.slice(1) 
        : "Notification";
      return { title: typeCapitalized, content };
    }
    return { title, content };
  };

  const getIconWrapper = (type: string) => {
    const t = (type || "system").toLowerCase();
    if (t.includes("order")) {
      return {
        bg: "bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 dark:border-amber-500/30",
        icon: <ShoppingBag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
      };
    }
    if (t.includes("inventory") || t.includes("stock") || t.includes("alert")) {
      return {
        bg: "bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/20 dark:border-rose-500/30",
        icon: <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-450" />
      };
    }
    return {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 dark:border-emerald-500/30",
      icon: <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-450" />
    };
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Dynamic Keyframes for micro-interactions */}
      <style>{`
        @keyframes bellRing {
          0%, 100% { transform: rotate(0); }
          15% { transform: rotate(10deg); }
          30% { transform: rotate(-10deg); }
          45% { transform: rotate(6deg); }
          60% { transform: rotate(-6deg); }
          75% { transform: rotate(3deg); }
          90% { transform: rotate(-3deg); }
        }
        .group:hover .bell-icon {
          animation: bellRing 0.6s ease-in-out;
          transform-origin: top center;
        }
        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .dropdown-animate {
          animation: dropdownIn 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scrollbar-premium::-webkit-scrollbar {
          width: 5px;
        }
        .scrollbar-premium::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-premium::-webkit-scrollbar-thumb {
          background: rgba(202, 138, 4, 0.2);
          border-radius: 99px;
        }
        .scrollbar-premium::-webkit-scrollbar-thumb:hover {
          background: rgba(202, 138, 4, 0.45);
        }
      `}</style>

      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2.5 rounded-xl border border-stone-200/50 dark:border-stone-800/50 text-stone-600 dark:text-stone-400 hover:bg-stone-100/80 dark:hover:bg-stone-900/60 transition-all cursor-pointer relative focus:outline-none group"
        title={t("notificationsLog") || "Notifications Log"}
      >
        <Bell className="w-4.5 h-4.5 bell-icon transition-transform duration-200" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
          </span>
        )}
      </button>

      {/* Dropdown List */}
      {open && (
        <div 
          className="dropdown-animate absolute right-0 mt-3 w-88 sm:w-96 rounded-2xl shadow-2xl border border-stone-200/80 dark:border-stone-850 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl z-50 overflow-hidden transform origin-top-right transition-all"
        >
          {/* Header */}
          <div className="p-4 border-b border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-150 uppercase tracking-widest font-heading">
                {t("notificationsLog") || "Notifications"}
              </h4>
              {unreadCount > 0 && (
                <span className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-[10px] font-bold text-amber-650 dark:text-amber-500 uppercase hover:text-amber-700 dark:hover:text-amber-400 hover:underline cursor-pointer transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                {t("markAllRead") || "Mark all read"}
              </button>
            )}
          </div>

          {/* List */}
          <div 
            data-lenis-prevent
            className="max-h-80 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/30 scrollbar-premium"
          >
            {notifications.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="p-3 rounded-full bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800 mb-2">
                  <BellOff className="w-6 h-6 text-stone-400 dark:text-stone-650" />
                </div>
                <p className="font-heading text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  {t("noNotifications") || "All Caught Up"}
                </p>
                <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-1">
                  You have no new notifications.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const { title, content } = getNotificationDetails(item);
                const { bg, icon } = getIconWrapper(item.type);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`relative p-4 flex items-start gap-3.5 transition-all duration-200 cursor-pointer hover:bg-stone-50/70 dark:hover:bg-stone-950/30 ${
                      !item.isRead 
                        ? "bg-amber-500/[0.015] dark:bg-amber-500/[0.005] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-amber-600 dark:before:bg-amber-500 before:rounded-r-sm" 
                        : ""
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl border ${bg} shrink-0 flex items-center justify-center`}>
                      {icon}
                    </div>
                    <div className="grow min-w-0">
                      <p className={`text-xs text-stone-900 dark:text-stone-100 leading-snug tracking-tight ${
                        !item.isRead ? "font-bold" : "font-medium"
                      }`}>
                        {title}
                      </p>
                      {content && (
                        <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-400 mt-0.5 font-medium line-clamp-2">
                          {content}
                        </p>
                      )}
                      <span className="text-[9.5px] font-bold text-stone-400 dark:text-stone-500 mt-1.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-300 dark:text-stone-600" />
                        {formatTime(item.createdAt)}
                      </span>
                    </div>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-500 self-center shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer status bar */}
          <div className="p-3 bg-stone-50/50 dark:bg-stone-950/50 border-t border-stone-200/50 dark:border-stone-800/40 flex items-center justify-between text-[9px] font-bold text-stone-400 dark:text-stone-500">
            <span className="uppercase tracking-wider">Live Feed</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-stone-400"}`} />
              <span>{isConnected ? "Connected" : "Disconnected"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

