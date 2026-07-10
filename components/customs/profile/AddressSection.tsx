import React from "react";
import {
  MapPin,
  Plus,
  Loader2,
  Home as HomeIcon,
  Briefcase,
  Check,
  User,
  Phone,
  Edit2,
} from "lucide-react";
import { Address } from "@/schema/response/auth/address.res";
import AddressForm from "@/components/customs/profile/AddressForm";

interface AddressSectionProps {
  userId: number;
  addresses: Address[];
  addressLoading: boolean;
  editingAddress: Address | null;
  isAddingAddress: boolean;
  setIsAddingAddress: (adding: boolean) => void;
  setEditingAddress: (address: Address | null) => void;
  provinces: { name: string; code: number }[];
  loadAddresses: (id: number) => Promise<void>;
}

export default function AddressSection({
  userId,
  addresses,
  addressLoading,
  editingAddress,
  isAddingAddress,
  setIsAddingAddress,
  setEditingAddress,
  provinces,
  loadAddresses,
}: AddressSectionProps) {
  // Open Create Form
  const handleOpenCreateAddress = () => {
    setEditingAddress(null);
    setIsAddingAddress(true);
  };

  // Open Edit Form
  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setIsAddingAddress(true);
  };

  return (
    <div className="glass-profile-card rounded-3xl overflow-hidden shadow-2xl relative mt-8">
      <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-amber-800 via-amber-500 to-yellow-300" />

      <div className="px-8 md:px-12 py-6 border-b border-stone-200/50 dark:border-stone-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="profile-heading text-2xl font-bold text-stone-900 dark:text-stone-50">
              Delivery Addresses
            </h2>
            <p className="text-xs font-semibold text-stone-400 mt-0.5 dark:text-stone-500 font-sans">
              Configure your physical delivery destinations for custom timber commissions
            </p>
          </div>
        </div>

        {!isAddingAddress && (
          <button
            onClick={handleOpenCreateAddress}
            className="btn-gold shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold tracking-wider uppercase cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        )}
      </div>

      <div className="p-8 md:p-12 flex flex-col gap-8">
        {/* ── ADDRESS LISTING ── */}
        {!isAddingAddress &&
          (addressLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest animate-pulse">
                Syncing addresses...
              </p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-4 bg-stone-50/50 dark:bg-stone-950 p-6 rounded-2xl border border-stone-150 dark:border-stone-800/40">
              <MapPin className="w-10 h-10 text-stone-300 dark:text-stone-650" />
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-stone-850 dark:text-stone-100">
                  No destinations saved
                </h4>
                <p className="text-xs font-medium text-stone-500 dark:text-stone-400 max-w-xs leading-relaxed">
                  Add a shipping address to speed up your bespoke checkout flows.
                </p>
              </div>
              <button
                onClick={handleOpenCreateAddress}
                className="h-10 border border-amber-600/30 text-amber-700 dark:text-amber-500 hover:bg-amber-500/5 rounded-xl text-xs font-bold tracking-wider uppercase px-5 transition-all cursor-pointer"
              >
                Create First Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div
                  key={addr.addressID}
                  className={`p-5 rounded-2xl border transition-all flex flex-col gap-4 relative group ${
                    addr.isDefault
                      ? "bg-amber-500/5 border-amber-600/30 dark:border-amber-500/30"
                      : "bg-white/40 dark:bg-stone-950/20 border-stone-200/40 dark:border-stone-800/40"
                  }`}
                >
                  {/* Header Details: Badge type and Default indicator */}
                  <div className="flex justify-between items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        addr.addressType === "HOME"
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                      }`}
                    >
                      {addr.addressType === "HOME" ? (
                        <HomeIcon className="w-3 h-3" />
                      ) : (
                        <Briefcase className="w-3 h-3" />
                      )}
                      {addr.addressType}
                    </span>

                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-600 text-white text-[10px] font-bold">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        Default Destination
                      </span>
                    )}
                  </div>

                  {/* Receiver Details */}
                  <div className="flex flex-col gap-1.5 text-xs text-stone-600 dark:text-stone-400 font-medium">
                    <div className="flex items-center gap-2.5 text-stone-900 dark:text-stone-100 font-bold text-sm">
                      <User className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{addr.receiverName}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{addr.receiverPhone}</span>
                    </div>
                    <div className="flex items-start gap-2.5 mt-1">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed min-w-0 wrap-break-word text-stone-800 dark:text-stone-250">
                        {addr.street}, {addr.ward}, {addr.district}, {addr.province}
                      </p>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEditAddress(addr)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg border border-stone-200/50 hover:border-amber-600/30 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-900/50 text-stone-500 dark:text-stone-400 cursor-pointer"
                    title="Modify Address"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ))}

        {/* ── ADDRESS EDITOR/CREATOR FORM ── */}
        {isAddingAddress && (
          <AddressForm
            userId={userId}
            editingAddress={editingAddress}
            provinces={provinces}
            onSuccess={async () => {
              setIsAddingAddress(false);
              setEditingAddress(null);
              await loadAddresses(userId);
            }}
            onCancel={() => {
              setIsAddingAddress(false);
              setEditingAddress(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
