"use client";
import { Button } from "@/components/ui/button";
import { ProductDetail } from "@/schema/response/product/product.res";
import { Minus, Plus, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
const ProductInformation = ({ data }: { data: ProductDetail }) => {
  const rating = 4.5;
  const totalReview = 128;
  const [quantity, setQuantity] = useState(1);
  const [colorSelect, chooseColor] = useState(data.colors[0]);
  const [sizeSelect, chooseSize] = useState(data.sizes[0]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => {
      if (i + 1 <= Math.floor(rating)) {
        return (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      }

      if (i < rating) {
        return <Star key={i} className="w-4 h-4 text-yellow-400 opacity-50" />;
      }

      return <Star key={i} className="w-4 h-4 text-gray-300" />;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Name */}
      <h1 className="text-2xl font-semibold leading-tight">{data.name}</h1>
      {/* Price */}
      <div className="text-3xl font-bold text-gray-400">
        {data.basePrice.toLocaleString()}₫
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-yellow-500 font-semibold">
          {rating.toFixed(1)}
        </span>

        <div className="flex items-center gap-1">{renderStars(rating)}</div>

        <span className="text-gray-500">({totalReview} đánh giá)</span>
      </div>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">{data.description}</p>

      {/* Size */}
      <div className="flex items-start gap-3 flex-col">
        <Label className="font-medium">Size:</Label>
        <div className="flex gap-2">
          {data.sizes.map((size) => (
            <Button
              onClick={() => chooseSize(size)}
              key={size}
              className={` rounded-lg  border-2 transition-all ${size === sizeSelect ? "border-primary bg-yellow-700 text-white" : "border-gray-200 hover:bg-amber-300 hover:text-white"}`}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="flex items-start gap-3 flex-col">
        <Label className="font-medium">Color:</Label>
        <div className="flex gap-2">
          {data.colors.map((color) => (
            <Button
              onClick={() => chooseColor(color)}
              key={color}
              variant={"ghost"}
              style={{ backgroundColor: color }}
              className={`w-8 h-8 rounded-full border-2 transition-all ${color === colorSelect ? "border-primary" : "border-gray-200"}`}
            ></Button>
          ))}
        </div>
      </div>
      {/* {"Feature enter quantity , add to cart , compare"} */}
      <div className="flex items-start gap-3">
        <div className="flex gap-2 items-center  border border-gray-200 rounded-lg h-16 w-53.7">
          <Button
            className="px-3 py-1 bg-transparent text-black hover:text-white transition"
            onClick={() => setQuantity(quantity - 1)}
            disabled={quantity === 1}
          >
            <Minus />
          </Button>
          <Input
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-12 border-none text-center"
          />
          <Button
            className="px-3 py-1 bg-transparent text-black hover:text-white transition"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus />
          </Button>
        </div>
        <Button className="h-16 w-53.7   px-3 py-1 border border-gray-200 bg-transparent text-black hover:bg-yellow-600 hover:text-white transition">
          Add to cart
        </Button>
        <Button className="h-16 w-53.7 px-3 py-1 border border-gray-200 bg-transparent text-black hover:bg-yellow-600 hover:text-white transition">
          Compare
        </Button>
      </div>
      {/* Meta */}
      <Separator />
      <div className="text-sm text-gray-500 flex flex-col gap-1">
        <span>Brand: {data.brand}</span>
        <span>Category: {data.categoryName}</span>
        <span>SKU: {data.skus.join(", ")}</span>
      </div>
    </div>
  );
};

export default ProductInformation;
