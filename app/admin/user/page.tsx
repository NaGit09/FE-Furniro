"use client";
import "@/style/admin-user.css";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Users,
  Shield,
  Search,
  RefreshCw,
  Ban,
  Unlock,
  Trash2,
  Key,
  CheckSquare,
  Square,
  AlertTriangle,
  X,
  Mail,
  User,
  Phone,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { AdminApi } from "@/services/api/Auth/admin.service";
import { AccountRes } from "@/schema/response/auth/account.res";

export default function UserManagementPage() {
  // Page states
  const [users, setUsers] = useState<AccountRes[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Load accounts from API
  const loadAccounts = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await AdminApi.getAllUsers(0, 10);
      
      let rawContent: any = res?.data;
      if (rawContent && typeof rawContent === "object" && "content" in rawContent) {
        rawContent = rawContent.content;
      }

      if (Array.isArray(rawContent)) {
        // Flatten in case the backend returns nested arrays Page<AccountRes[]>
        const flatList = rawContent.flat();
        setUsers(flatList as AccountRes[]);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.warn("Failed to reach administrative user services.", err);
      toast.error("Could not connect to authentication services.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // Multi-select helpers
  const handleSelectToggle = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map((u) => u.AccountID));
    }
  };

  // Batch Operations via AdminApi
  const handleBatchBan = async () => {
    if (selectedIds.length === 0) return;
    const loadId = toast.loading(`Banning ${selectedIds.length} account(s)...`);
    try {
      const res = await AdminApi.banUser(selectedIds);
      if (res?.code === 200) {
        toast.success(`Successfully banned ${selectedIds.length} account(s)!`, { id: loadId });
        
        // Update local status representation
        setUsers((prev) =>
          prev.map((u) =>
            selectedIds.includes(u.AccountID) ? { ...u, Banned: true } : u
          )
        );
        setSelectedIds([]);
      } else {
        toast.error(res?.message || "Failed to execute ban operations.", { id: loadId });
      }
    } catch (err) {
      toast.error("An error occurred during account ban operations.", { id: loadId });
    }
  };

  const handleBatchUnban = async () => {
    if (selectedIds.length === 0) return;
    const loadId = toast.loading(`Unbanning ${selectedIds.length} account(s)...`);
    try {
      const res = await AdminApi.unbanUser(selectedIds);
      if (res?.code === 200) {
        toast.success(`Successfully unbanned ${selectedIds.length} account(s)!`, { id: loadId });
        
        // Update local status representation
        setUsers((prev) =>
          prev.map((u) =>
            selectedIds.includes(u.AccountID) ? { ...u, Banned: false } : u
          )
        );
        setSelectedIds([]);
      } else {
        toast.error(res?.message || "Failed to execute unban operations.", { id: loadId });
      }
    } catch (err) {
      toast.error("An error occurred during account unban operations.", { id: loadId });
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you absolutely sure you want to delete ${selectedIds.length} account(s)? This action is permanent!`)) {
      return;
    }
    const loadId = toast.loading(`Deleting ${selectedIds.length} account(s)...`);
    try {
      const res = await AdminApi.deleteUser(selectedIds);
      if (res?.code === 200) {
        toast.success(`Successfully deleted ${selectedIds.length} account(s)!`, { id: loadId });
        setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.AccountID)));
        setSelectedIds([]);
      } else {
        toast.error(res?.message || "Failed to execute delete operations.", { id: loadId });
      }
    } catch (err) {
      toast.error("An error occurred during account deletions.", { id: loadId });
    }
  };

  const handleBatchResetPassword = async () => {
    if (selectedIds.length === 0) return;
    const loadId = toast.loading(`Resetting passwords for ${selectedIds.length} account(s)...`);
    try {
      const res = await AdminApi.resetPassword(selectedIds);
      if (res?.code === 200) {
        toast.success(`Successfully reset passwords for ${selectedIds.length} account(s)!`, { id: loadId });
        setSelectedIds([]);
      } else {
        toast.error(res?.message || "Failed to execute password resets.", { id: loadId });
      }
    } catch (err) {
      toast.error("An error occurred during password reset operations.", { id: loadId });
    }
  };

  // Searching & Filtering
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const fullName = `${u.FirstName} ${u.LastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        u.UserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(u.AccountID).includes(searchQuery);

      const matchesRole = roleFilter === "All" || u.Role === roleFilter;
      
      const isBanned = u.Banned;
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "BANNED" && isBanned) ||
        (statusFilter === "ACTIVE" && !isBanned);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Statistics calculation
  const totalAccounts = users.length;
  const totalAdmins = users.filter((u) => u.Role === "ADMIN").length;
  const totalBanned = users.filter((u) => u.Banned).length;
  const totalCustomers = users.filter((u) => u.Role === "CUSTOMER").length;

  return (
    <div className="space-y-8 admin-root relative">
      {/* ─── Montserrat & Cormorant Google Fonts Loader ─── */}
      

      {/* ─── Ambient Glow Blobs ─── */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-radial from-amber-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-radial from-amber-650/5 to-transparent blur-3xl pointer-events-none" />

      {/* ─── Page Title & Action Center ─── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest leading-none block">
            SYSTEM ACCOUNT DIRECTORY
          </span>
          <h1 className="cormorant-heading text-3xl md:text-4.5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-none mt-2">
            User Credentials Ledger
          </h1>
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-450 mt-2">
            Manage administrative roles, reset passwords, and lock or terminate accounts across the Furniro network.
          </p>
        </div>

        {/* Reload action */}
        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <button 
            onClick={() => {
              loadAccounts();
              toast.success("User directory synced successfully!");
            }}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-655 dark:text-stone-300 transition-all cursor-pointer shadow-xs active:scale-95 bg-white/40 dark:bg-stone-900/40"
            title="Sync Accounts Directory"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── KPI Stats Cards ─── */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Registered", value: totalAccounts, subtitle: "Active system identifiers", icon: Users, color: "text-amber-600 dark:text-amber-500" },
          { title: "System Admins", value: totalAdmins, subtitle: "Root credentials enabled", icon: Shield, color: "text-emerald-600 dark:text-emerald-505" },
          { title: "Locked Credentials", value: totalBanned, subtitle: "Banned server accounts", icon: Ban, color: totalBanned > 0 ? "text-rose-605 animate-pulse" : "text-stone-400" },
          { title: "Active Customers", value: totalCustomers, subtitle: "Storefront registered clients", icon: Users, color: "text-blue-600" },
        ].map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="glass-user-card rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-stone-405 dark:text-stone-550 uppercase">
                    {c.title}
                  </span>
                  <h3 className="cormorant-heading text-3.5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 mt-1.5 leading-none">
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

      {/* ─── Filtering & Searching ─── */}
      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-stone-200/40 dark:border-stone-800/40">
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Search SKU input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search name, ID, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-855 text-xs font-semibold focus:outline-none focus:border-amber-600 transition-all dark:text-white"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-855 text-xs font-semibold focus:outline-none text-stone-705 dark:text-stone-300 cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="STAFF">STAFF</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-855 text-xs font-semibold focus:outline-none text-stone-705 dark:text-stone-300 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="BANNED">BANNED</option>
            </select>
          </div>
        </div>

        {/* ─── DATA RENDERING ─── */}
        <div className="glass-user-card rounded-2xl p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400">
              <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mb-3" />
              <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Syncing User Directory...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-stone-400">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider">No User Accounts Found</p>
                  <p className="text-[10px] mt-1">Please ensure your system APIs are online and active.</p>
                </div>
              ) : (
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-stone-200/40 dark:border-stone-855/45">
                      <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest w-12">
                        <button onClick={handleSelectAll} className="p-1 text-stone-500 hover:text-amber-650 transition-colors shrink-0">
                          {selectedIds.length === filteredUsers.length && filteredUsers.length > 0 ? (
                            <CheckSquare className="w-4 h-4 text-amber-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">ID</th>
                      <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">FULL NAME</th>
                      <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">EMAIL ADDRESS</th>
                      <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">CONTACT PHONE</th>
                      <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">ROLE</th>
                      <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">STATUS</th>
                      <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest text-right font-bold">OPERATIONAL CONTROLS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100/60 dark:divide-stone-850/30">
                    {filteredUsers.map((u) => {
                      const isSelected = selectedIds.includes(u.AccountID);
                      const isBanned = u.Banned;
                      const initials = `${u.FirstName?.[0] || ""}${u.LastName?.[0] || ""}`.toUpperCase() || "US";
                      
                      return (
                        <tr key={u.AccountID} className={`hover:bg-stone-50/40 dark:hover:bg-stone-950/20 transition-all duration-200 ${isSelected ? "bg-amber-500/5" : ""}`}>
                          <td className="py-4 px-2">
                            <button onClick={() => handleSelectToggle(u.AccountID)} className="p-1 text-stone-500 hover:text-amber-655 transition-colors shrink-0">
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-amber-600" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="py-4 px-2 text-xs font-mono font-bold text-stone-500 dark:text-stone-450">#USR-{u.AccountID}</td>
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-2.5">
                              {u.AvatarUrl ? (
                                <Image
                                  src={u.AvatarUrl}
                                  alt={u.UserName}
                                  width={36}
                                  height={36}
                                  className="w-9 h-9 rounded-full object-cover shadow-xs shrink-0"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-amber-600 to-yellow-500 flex items-center justify-center text-[10.5px] font-bold text-white uppercase shadow-xs shrink-0 font-mono">
                                  {initials}
                                </div>
                              )}
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate">{u.FirstName} {u.LastName}</span>
                                <span className="text-[10px] text-stone-400 dark:text-stone-550 font-mono mt-0.5 leading-none">@{u.UserName}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-xs font-semibold text-stone-700 dark:text-stone-300">
                            <span className="flex items-center gap-1.5 font-mono">
                              <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                              {u.Email}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-xs font-semibold text-stone-605 dark:text-stone-300 font-mono">{u.Phone || "No telephone"}</td>
                          <td className="py-4 px-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              u.Role === "ADMIN" 
                                ? "bg-amber-600/10 text-amber-650"
                                : u.Role === "STAFF"
                                ? "bg-blue-500/10 text-blue-600"
                                : "bg-stone-200/50 dark:bg-stone-850/60 text-stone-600 dark:text-stone-300"
                            }`}>
                              {u.Role}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              isBanned ? "bg-red-500/10 text-red-655 animate-pulse" : "bg-emerald-500/10 text-emerald-600"
                            }`}>
                              {isBanned ? "BANNED" : "ACTIVE"}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <div className="inline-flex gap-1.5 justify-end">
                              {/* Quick ban/unban button */}
                              {isBanned ? (
                                <button
                                  onClick={() => {
                                    setSelectedIds([u.AccountID]);
                                    setTimeout(() => handleBatchUnban(), 0);
                                  }}
                                  className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-600 transition-colors cursor-pointer"
                                  title="Unban Credentials"
                                >
                                  <Unlock className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedIds([u.AccountID]);
                                    setTimeout(() => handleBatchBan(), 0);
                                  }}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-655 transition-colors cursor-pointer"
                                  title="Ban Credentials"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                </button>
                              )}
                              
                              {/* Reset password button */}
                              <button
                                onClick={() => {
                                  setSelectedIds([u.AccountID]);
                                  setTimeout(() => handleBatchResetPassword(), 0);
                                }}
                                className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500 hover:text-white text-blue-600 transition-colors cursor-pointer"
                                  title="Reset User Password"
                              >
                                <Key className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================================================== */}
      {/* ─── STICKY BATCH ACTIONS DRAWER (SLIDE UP) ─────── */}
      {/* ================================================== */}
      {selectedIds.length > 0 && (
        <div className="batch-actions-bar fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-stone-950/95 dark:bg-stone-900/95 border border-stone-850/40 text-white rounded-2xl px-6 py-4.5 flex items-center gap-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3 border-r border-stone-800 pr-5 shrink-0">
            <div className="w-6 h-6 rounded-lg bg-amber-600 flex items-center justify-center text-[10.5px] font-extrabold text-white">
              {selectedIds.length}
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-300 font-mono">Selected IDs</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleBatchResetPassword}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-750 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95"
            >
              <Key className="w-3.5 h-3.5" /> Reset Passwords
            </button>
            
            <button
              onClick={handleBatchBan}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-655/20 hover:bg-red-600 text-red-400 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-xl border border-red-500/25 transition-all cursor-pointer active:scale-95"
            >
              <Ban className="w-3.5 h-3.5" /> Ban
            </button>

            <button
              onClick={handleBatchUnban}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-655/20 hover:bg-emerald-500 text-emerald-405 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-xl border border-emerald-500/25 transition-all cursor-pointer active:scale-95"
            >
              <Unlock className="w-3.5 h-3.5" /> Unban
            </button>

            <button
              onClick={handleBatchDelete}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-red-600 hover:text-white text-stone-305 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>

          <button
            onClick={() => setSelectedIds([])}
            className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 transition-colors ml-2 cursor-pointer"
            title="Clear Selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}