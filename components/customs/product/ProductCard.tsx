"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { ProductCardRes } from "@/schema/response/product.res";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  product: ProductCardRes;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Link href={`/product/${product.productID}`}>
      <Card className="group min-w-[300px] overflow-hidden rounded-xl border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white p-0">
        {/* IMAGE */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.url || "https://placehold.co/600x600"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col items-center justify-center gap-3">
            <Button
              size="sm"
              className="bg-primary text-white hover:opacity-90 px-4 rounded-md"
            >
              <ShoppingCart size={16} />
              Add to cart
            </Button>

            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/90 hover:bg-white"
            >
              <Eye size={16} />
            </Button>
          </div>

          {/* Badge */}
          <div className="absolute top-3 right-3 bg-primary text-white text-xs px-3 py-1 rounded-full shadow">
            New
          </div>
        </div>

        {/* CONTENT */}
        <CardContent className="p-4 space-y-2">
          {/* Category (fake) */}
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Product
          </p>

          {/* Name */}
          <h3 className="text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.basePrice)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
