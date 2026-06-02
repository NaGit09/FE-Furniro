"use client";

import Image from "next/image";

interface PageBannerProps {
  title: string;
  breadcrumb?: string;
}

export default function PageBanner({
  title,
  breadcrumb = "Home > Shop",
}: PageBannerProps) {
  return (
    <div className="relative w-full h-79 mt-4">
      {/* Background Image */}
      <Image
        src={"/images/background_furniro.avif"}
        alt="banner"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay blur + dark */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xs" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
        <h5 className="text-sm md:text-base text-gray-200">{breadcrumb}</h5>
      </div>
    </div>
  );
}
