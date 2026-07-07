"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, ShoppingBag, AlertTriangle, Info, Check, X, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/components/customs/common/LanguageContext";

interface NotificationItem {
  id: string;
  type: "order" | "inventory" | "system";
  unread: boolean;
  time: string;
  data: Record<string, string | number>;
}

export default function NotificationDropdown() {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize with some sensible mock notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1024",
      type: "order",
      unread: true,
      time: "2m ago",
      data: { id: "1024" },
    },
    {
      id: "sofa-stock",
      type: "inventory",
      unread: true,
      time: "1h ago",
      data: { name: "Lux Ottoman Sofa" },
    },
    {
      id: "sys-up",
      type: "system",
      unread: false,
      time: "1d ago",
      data: {},
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

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

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleItemClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const getNotificationText = (item: NotificationItem) => {
    if (item.type === "order") {
      return t("newOrderAlert", item.data);
    }
    if (item.type === "inventory") {
      return t("lowStockAlert", item.data);
    }
    if (item.type === "system") {
      return t("sysUpdateAlert");
    }
    return "";
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-4 h-4 text-amber-600 dark:text-amber-500" />;
      case "inventory":
        return <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />;
      case "system":
        return <Info className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2.5 rounded-xl border border-stone-200/50 dark:border-stone-800/50 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900/60 transition-all cursor-pointer relative focus:outline-none"
        title={t("notificationsLog") || "Notifications Log"}
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-600 ring-2 ring-white dark:ring-stone-950 animate-pulse" />
          </>
        )}
      </button>

      {/* Dropdown List */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-850 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="p-4 border-b border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-150 uppercase tracking-widest">
              {t("notificationsLog") || "Notifications"}
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[9.5px] font-extrabold text-amber-650 dark:text-amber-500 uppercase hover:underline cursor-pointer"
              >
                {t("markAllRead") || "Mark all read"}
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/30">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-stone-400 dark:text-stone-500 text-xs">
                {t("noNotifications") || "No new notifications."}
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-950/30 ${
                    item.unread ? "bg-amber-500/2 dark:bg-amber-500/1" : ""
                  }`}
                >
                  <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-850 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="grow min-w-0">
                    <p className={`text-[11px] leading-relaxed text-stone-800 dark:text-stone-200 ${
                      item.unread ? "font-bold" : "font-semibold"
                    }`}>
                      {getNotificationText(item)}
                    </p>
                    <span className="text-[9px] font-bold text-stone-400 mt-1 block">
                      {item.time}
                    </span>
                  </div>
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-amber-600 self-center shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
