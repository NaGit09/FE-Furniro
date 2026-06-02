/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Home as HomeIcon, Briefcase, Save, Loader2 } from "lucide-react";

import { AddressApi } from "@/services/api/Auth/address.service";
import { ProvinceApi } from "@/services/api/Other/Province.service";
import { Address } from "@/schema/response/auth/address.res";

interface AddressFormProps {
  userId: number;
  editingAddress: Address | null;
  provinces: { name: string; code: number }[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddressForm({
  userId,
  editingAddress,
  provinces,
  onSuccess,
  onCancel,
}: AddressFormProps) {
  // Local Form states
  const [recName, setRecName] = useState("");
  const [recPhone, setRecPhone] = useState("");
  const [street, setStreet] = useState("");
  const [provName, setProvName] = useState("");
  const [distName, setDistName] = useState("");
  const [wName, setWName] = useState("");
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [activeAddressType, setActiveAddressType] = useState<"HOME" | "OFFICE">("HOME");
  const [savingAddress, setSavingAddress] = useState(false);

  // Cascading states
  const [districts, setDistricts] = useState<{ name: string; code: number }[]>([]);
  const [wards, setWards] = useState<{ name: string; code: number }[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | null>(null);

  // Load and prefill cascades if editingAddress changes
  useEffect(() => {
    if (editingAddress) {
      setRecName(editingAddress.receiverName);
      setRecPhone(editingAddress.receiverPhone);
      setStreet(editingAddress.street);
      setProvName(editingAddress.province);
      setDistName(editingAddress.district);
      setWName(editingAddress.ward);
      setIsDefaultAddress(editingAddress.isDefault);
      setActiveAddressType(editingAddress.addressType || "HOME");

      const matchedProvince = provinces.find((p) => p.name === editingAddress.province);
      if (matchedProvince) {
        setSelectedProvinceCode(matchedProvince.code);
        const prefillCascades = async () => {
          try {
            const districtList = await ProvinceApi.getDistricts(matchedProvince.code);
            setDistricts(districtList || []);
            const matchedDistrict = districtList.find((d: any) => d.name === editingAddress.district);
            if (matchedDistrict) {
              setSelectedDistrictCode(matchedDistrict.code);
              const wardList = await ProvinceApi.getWards(matchedDistrict.code);
              setWards(wardList || []);
            }
          } catch (err) {
            console.error("Cascade prefill error in AddressForm:", err);
          }
        };
        prefillCascades();
      }
    } else {
      // Reset form states
      setRecName("");
      setRecPhone("");
      setStreet("");
      setProvName("");
      setDistName("");
      setWName("");
      setIsDefaultAddress(false);
      setActiveAddressType("HOME");
      setSelectedProvinceCode(null);
      setSelectedDistrictCode(null);
      setDistricts([]);
      setWards([]);
    }
  }, [editingAddress, provinces]);

  // Fetch districts when selectedProvinceCode changes
  useEffect(() => {
    if (selectedProvinceCode !== null && selectedProvinceCode !== undefined) {
      // Skip if we are pre-filling and it already matches
      const fetchDistricts = async () => {
        try {
          const list = await ProvinceApi.getDistricts(selectedProvinceCode);
          setDistricts(list || []);
          // Only clear if the selected province is different from editing address province
          if (!editingAddress || provinces.find((p) => p.name === editingAddress.province)?.code !== selectedProvinceCode) {
            setWards([]);
            setSelectedDistrictCode(null);
            setDistName("");
            setWName("");
          }
        } catch (err) {
          console.error("Districts fetch error:", err);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
      setDistName("");
      setWName("");
    }
  }, [selectedProvinceCode, provinces, editingAddress]);

  // Fetch wards when selectedDistrictCode changes
  useEffect(() => {
    if (selectedDistrictCode !== null && selectedDistrictCode !== undefined) {
      const fetchWards = async () => {
        try {
          const list = await ProvinceApi.getWards(selectedDistrictCode);
          setWards(list || []);
          if (!editingAddress || districts.find((d) => d.name === editingAddress.district)?.code !== selectedDistrictCode) {
            setWName("");
          }
        } catch (err) {
          console.error("Wards fetch error:", err);
        }
      };
      fetchWards();
    } else {
      setWards([]);
      setWName("");
    }
  }, [selectedDistrictCode, districts, editingAddress]);

  // Submit/Save Address
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (
      !recName.trim() ||
      !recPhone.trim() ||
      !provName ||
      !distName ||
      !wName ||
      !street.trim()
    ) {
      toast.error("Please fill in all address specifications.");
      return;
    }

    setSavingAddress(true);
    const toastId = toast.loading("Syncing delivery address changes...");
    try {
      const payload: Address = {
        addressID: editingAddress?.addressID,
        receiverName: recName.trim(),
        receiverPhone: recPhone.trim(),
        province: provName,
        district: distName,
        ward: wName,
        street: street.trim(),
        isDefault: isDefaultAddress,
        addressType: activeAddressType,
        userID: userId,
      };

      const res = await AddressApi.updateAddress(payload);
      if (res && res.data) {
        toast.success("Delivery address updated successfully!", {
          id: toastId,
        });
        onSuccess();
      } else {
        toast.error("Failed to update delivery address.", { id: toastId });
      }
    } catch (err) {
      console.error("Save address error:", err);
      toast.error("An unexpected error occurred while syncing addresses.", {
        id: toastId,
      });
    } finally {
      setSavingAddress(false);
    }
  };

  return (
    <form onSubmit={handleAddressSubmit} className="flex flex-col gap-6.5 animate-fade">
      <h3 className="profile-heading text-xl font-bold tracking-wide text-stone-900 dark:text-stone-50 border-b border-stone-200/40 dark:border-stone-800/40 pb-2">
        {editingAddress
          ? "Modify Delivery Destination"
          : "Create New Delivery Destination"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Receiver Name */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="recName"
            className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
          >
            Receiver Name
          </label>
          <input
            id="recName"
            type="text"
            value={recName}
            onChange={(e) => setRecName(e.target.value)}
            className="luxury-input"
            placeholder="John Doe"
            required
          />
        </div>

        {/* Receiver Phone */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="recPhone"
            className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
          >
            Receiver Phone Number
          </label>
          <input
            id="recPhone"
            type="tel"
            value={recPhone}
            onChange={(e) => setRecPhone(e.target.value)}
            className="luxury-input"
            placeholder="0987654321"
            required
          />
        </div>

        {/* Province Cascading Dropdown */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="province"
            className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
          >
            Province / City
          </label>
          <select
            id="province"
            value={provinces.find((p) => p.name === provName)?.code || ""}
            onChange={(e) => {
              const code = Number(e.target.value);
              const name = provinces.find((p) => p.code === code)?.name || "";
              setProvName(name);
              setSelectedProvinceCode(code);
            }}
            className="luxury-input cursor-pointer"
            required
          >
            <option value="">-- Select Province/City --</option>
            {provinces.map((prov) => (
              <option key={prov.code} value={prov.code}>
                {prov.name}
              </option>
            ))}
          </select>
        </div>

        {/* District Cascading Dropdown */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="district"
            className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
          >
            District
          </label>
          <select
            id="district"
            value={districts.find((d) => d.name === distName)?.code || ""}
            onChange={(e) => {
              const code = Number(e.target.value);
              const name = districts.find((d) => d.code === code)?.name || "";
              setDistName(name);
              setSelectedDistrictCode(code);
            }}
            className="luxury-input cursor-pointer"
            disabled={selectedProvinceCode === null}
            required
          >
            <option value="">-- Select District --</option>
            {districts.map((dist) => (
              <option key={dist.code} value={dist.code}>
                {dist.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ward Cascading Dropdown */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="ward"
            className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
          >
            Ward
          </label>
          <select
            id="ward"
            value={wName}
            onChange={(e) => setWName(e.target.value)}
            className="luxury-input cursor-pointer"
            disabled={selectedDistrictCode === null}
            required
          >
            <option value="">-- Select Ward --</option>
            {wards.map((w) => (
              <option key={w.code} value={w.name}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Street Address */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label
            htmlFor="street"
            className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
          >
            Street Address / Specific Location
          </label>
          <input
            id="street"
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="luxury-input"
            placeholder="123 Le Loi Street, Building B, Room 405"
            required
          />
        </div>

        {/* Address Type Toggle */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Address Category
          </span>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveAddressType("HOME")}
              className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeAddressType === "HOME"
                  ? "bg-amber-600 text-white border border-amber-600 shadow-sm"
                  : "border border-stone-200 dark:border-stone-850 text-stone-700 dark:text-stone-300"
              }`}
            >
              <HomeIcon className="w-4 h-4 shrink-0" />
              HOME
            </button>
            <button
              type="button"
              onClick={() => setActiveAddressType("OFFICE")}
              className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeAddressType === "OFFICE"
                  ? "bg-amber-600 text-white border border-amber-600 shadow-sm"
                  : "border border-stone-200 dark:border-stone-850 text-stone-700 dark:text-stone-300"
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              OFFICE
            </button>
          </div>
        </div>

        {/* Default Address Checkbox */}
        <div className="flex items-center gap-3.5 mt-6 px-1">
          <input
            id="isDefault"
            type="checkbox"
            checked={isDefaultAddress}
            onChange={(e) => setIsDefaultAddress(e.target.checked)}
            className="w-5 h-5 rounded accent-amber-600 cursor-pointer border-stone-300"
          />
          <label
            htmlFor="isDefault"
            className="text-sm font-semibold text-stone-700 dark:text-stone-300 cursor-pointer select-none"
          >
            Set as Default Destination
          </label>
        </div>
      </div>

      {/* Form Submission Actions */}
      <div className="flex justify-end gap-4 mt-4 border-t border-stone-200/40 dark:border-stone-800/40 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="btn-muted px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={savingAddress}
          className="btn-gold flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-xs font-bold tracking-wider uppercase cursor-pointer min-w-36"
        >
          {savingAddress ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              Save Destination
            </>
          )}
        </button>
      </div>
    </form>
  );
}
