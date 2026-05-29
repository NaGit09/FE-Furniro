"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

interface ProductImageGalleryProps {
  images: string[];
}

export default function ProductImageGallery({
  images,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [fade, setFade] = useState(true);

  const handleSelectImage = (img: string) => {
    if (img === selectedImage) return;
    setFade(false);
    setTimeout(() => {
      setSelectedImage(img);
      setFade(true);
    }, 150);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
      {/* Thumbnail Decks */}
      <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-y-auto max-h-[450px] pr-1 py-1 scrollbar-thin scrollbar-thumb-stone-300">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => handleSelectImage(img)}
            className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer
              ${
                selectedImage === img
                  ? "border-yellow-600 ring-2 ring-yellow-600/30 scale-95 shadow-md"
                  : "border-stone-200/60 dark:border-stone-800/60 opacity-60 hover:opacity-100 hover:scale-105"
              }`}
          >
            <Image
              src={img}
              alt={`thumbnail-${index}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Apple-Style Inset Viewport */}
      <div className="md:col-span-4 order-1 md:order-2">
        <Card className="p-3 overflow-hidden rounded-[30px] border border-stone-200/40 dark:border-stone-850/40 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md shadow-lg flex items-center justify-center">
          <div className="relative w-full aspect-square overflow-hidden rounded-[22px] bg-stone-50 dark:bg-stone-950 border border-stone-250/10 dark:border-stone-800/10">
            <Image
              src={selectedImage}
              alt="main-product-image"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 500px"
              className={`object-cover transition-all duration-300 ease-out ${
                fade ? "opacity-100 scale-100" : "opacity-0 scale-98"
              }`}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
