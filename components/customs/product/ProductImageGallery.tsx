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

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Thumbnail list */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[500px] pr-1">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border transition-all
          ${
            selectedImage === img
              ? "border-primary ring-2 ring-primary"
              : "border-gray-200 opacity-70 hover:opacity-100 hover:scale-105"
          }`}
          >
            <Image
              src={img}
              alt={`thumbnail-${index}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="md:col-span-4">
        <Card className="p-0 overflow-hidden rounded-xl">
          <div className="relative w-full aspect-square">
            <Image
              src={selectedImage}
              alt="main-product-image"
              fill
              className="object-cover"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
