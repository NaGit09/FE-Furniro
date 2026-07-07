"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { UploadApi } from "@/services/api/Upload/upload.service";
import { useLanguage } from "@/components/customs/common/LanguageContext";

interface UploadFileProps {
  userId: number;
  currentUrl?: string;
  avatarID?: number | null;
  onUploadSuccess: (url: string, fileId: number) => void;
  onUploadError?: (error: any) => void;
  label?: string;
  isCircular?: boolean;
  maxSizeMB?: number;
}

export default function UploadFile({
  userId,
  currentUrl = "",
  avatarID = null,
  onUploadSuccess,
  onUploadError,
  label = "",
  isCircular = false,
  maxSizeMB = 5,
}: UploadFileProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];

  const handleFile = async (file: File) => {
    if (!file || !userId) return;

    if (!allowedTypes.includes(file.type)) {
      toast.error(t("invalidFormatError") || "Please select an allowed file format.");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(t("maxSizeError") || `File size should be less than ${maxSizeMB}MB.`);
      return;
    }

    setUploading(true);
    const toastId = toast.loading(t("uploadingAvatar") || "Uploading file...");

    try {
      let res;
      // If we have an existing custom avatar, update it; otherwise upload new
      if (avatarID && avatarID > 4) {
        res = await UploadApi.update_file(file, String(userId), avatarID);
      } else {
        res = await UploadApi.upload_file(file, String(userId));
      }

      if (res && res.data) {
        toast.success(t("uploadSuccess") || "File uploaded successfully!", { id: toastId });
        const fileId = res.data.id ?? res.data.fileId ?? 1;
        const fileUrl = res.data.url ?? res.data.fileUrl ?? "";
        onUploadSuccess(fileUrl, fileId);
      } else {
        toast.error(t("uploadError") || "Failed to upload file.", { id: toastId });
      }
    } catch (err: any) {
      console.error("File upload error:", err);
      toast.error(
        err?.message || t("uploadError") || "Could not upload file. Please try again.",
        { id: toastId }
      );
      if (onUploadError) {
        onUploadError(err);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-none">
          {label}
        </span>
      )}

      {isCircular ? (
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-stone-300 dark:border-stone-700 overflow-hidden flex items-center justify-center bg-stone-50 dark:bg-stone-900 group shadow-sm transition-all hover:border-amber-500">
            {currentUrl ? (
              <img
                src={currentUrl}
                alt="Upload preview"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-stone-300 dark:text-stone-700" />
            )}

            {uploading && (
              <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center sm:items-start gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleChange}
              disabled={uploading}
            />
            <button
              type="button"
              onClick={onButtonClick}
              disabled={uploading}
              className="px-4 py-2 text-[11px] font-bold tracking-wide uppercase bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200/50 dark:border-stone-850 rounded-xl transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {uploading ? t("loading") : (t("dragDropText") ? t("dragDropText").split(" or ")[1] : "Browse File")}
            </button>
            <span className="text-[9px] text-stone-400 font-semibold tracking-wide">
              {t("allowedFormats") || "Allowed formats: JPG, PNG, WEBP, GIF (Max 5MB)"}
            </span>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[160px] ${
            dragActive
              ? "border-amber-600 bg-amber-600/5"
              : "border-stone-300 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/20 hover:border-amber-500/70 hover:bg-amber-600/2"
          } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
              <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400 animate-pulse tracking-wide uppercase">
                {t("loading") || "Uploading..."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-650 dark:text-amber-500 shadow-sm">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-bold text-stone-750 dark:text-stone-200 tracking-wide uppercase">
                {t("dragDropText") || "Drag & drop file here or click to browse"}
              </p>
              <p className="text-[9px] font-semibold text-stone-400">
                {t("allowedFormats") || "Allowed: JPEG, PNG, WEBP, GIF, SVG (max. 5MB)"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
