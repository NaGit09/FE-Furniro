/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { UploadCloud, Loader2 } from "lucide-react";

import { UploadApi } from "@/services/api/Upload/upload.service";

interface FileUploadProps {
  uploadedBy: string;
  onUploadSuccess: (fileId: number, fileUrl: string) => void;
  onUploadStart?: () => void;
  onUploadError?: (err: any) => void;
  currentFileId?: number;
  label?: string;
  allowedTypes?: string[];
  maxSizeMB?: number;
  accept?: string;
  className?: string;
}

export default function FileUpload({
  uploadedBy,
  onUploadSuccess,
  onUploadStart,
  onUploadError,
  currentFileId,
  label = "Upload File",
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  maxSizeMB = 5,
  accept = "image/*",
  className = "",
}: FileUploadProps) {

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadedBy) return;

    // Validation: Mime Type
    const isAllowedType = allowedTypes.some((type) => {
      if (type.endsWith("/*")) {
        const baseType = type.split("/")[0];
        return file.type.startsWith(baseType + "/");
      }
      return file.type === type;
    });

    if (!isAllowedType) {
      toast.error(
        `Please select an allowed file format (${allowedTypes.join(", ")}).`,
      );
      return;
    }

    // Validation: File Size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size should be less than ${maxSizeMB}MB.`);
      return;
    }

    // Call start callback
    if (onUploadStart) onUploadStart();
    setUploading(true);

    const toastId = toast.loading("Uploading asset to Cloudinary...");

    try {
      let res;
      // If updating an existing custom file, call update; otherwise call upload
      if (currentFileId && currentFileId > 4) {
        res = await UploadApi.update_file(file, uploadedBy, currentFileId);
      } else {
        res = await UploadApi.upload_file(file, uploadedBy);
      }

      if (res && res.data) {
        toast.success("File uploaded successfully!", { id: toastId });
        onUploadSuccess(res.data.fileId, res.data.fileUrl);
      } else {
        const errMsg = "Failed to upload file.";
        toast.error(errMsg, { id: toastId });
        if (onUploadError) onUploadError(new Error(errMsg));
      }
    } catch (err) {
      console.error("File upload component error:", err);
      toast.error("Could not upload file. Please try again.", { id: toastId });
      if (onUploadError) onUploadError(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-3.5 ${className}`}>
      {label && (
        <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          {label}
        </span>
      )}

      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          uploading
            ? "border-amber-600/40 bg-amber-500/5 cursor-not-allowed"
            : "border-stone-200/50 hover:border-amber-600/40 hover:bg-stone-50/50 dark:border-stone-800/50 dark:hover:border-amber-600/40 dark:hover:bg-stone-900/30"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept={accept}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
            <div className="text-sm font-semibold text-amber-700 dark:text-amber-500 animate-pulse">
              Uploading to Cloudinary...
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="p-3.5 rounded-full bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-500">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-500 hover:underline">
                Click to upload
              </span>
              <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
                {" "}
                or drag and drop your file
              </span>
            </div>
            <p className="text-xs font-semibold text-stone-400 dark:text-stone-500">
              Supports JPG, PNG, WEBP (Max. {maxSizeMB}MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
