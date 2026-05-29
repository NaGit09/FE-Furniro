"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, Eye, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { ProductCardRes } from "@/schema/response/product/product.res";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CartApi } from "@/services/api/Order/cart.service";
import { setCart } from "@/stores/slices/cart.store";
import { RootState } from "@/stores/store";

interface ProductCardProps {
  product: ProductCardRes;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const auth = useSelector((s: RootState) => s.authSlice);
  const cart = useSelector((s: RootState) => s.cartSlice);
  
  const [adding, setAdding] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!auth.isLoggedIn || !auth.UserID) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      router.push("/auth/login");
      return;
    }

    setAdding(true);
    const toastId = toast.loading("Đang thêm vào giỏ hàng...");
    try {
      let activeCartID = cart.cartID;

      // Lazy-loading fallback for CartID
      if (!activeCartID && auth.UserID) {
        try {
          const cartRes = await CartApi.get_cart(auth.UserID);
          if (cartRes && cartRes.data) {
            activeCartID = cartRes.data.cartID;
            dispatch(setCart({
              cartID: cartRes.data.cartID,
              items: cartRes.data.items || [],
            }));
          }
        } catch (cartErr) {
          console.error("Lazy cart retrieval failed in Card:", cartErr);
        }
      }

      const res = await CartApi.add_to_cart({
        cartID: activeCartID || 0,
        userID: auth.UserID,
        variantID: product.productID,
        quantity: 1,
        price: product.basePrice,
      });

      if (res && (res.code === 200 || res.data === true)) {
        toast.success("Thêm vào giỏ hàng thành công!", { id: toastId });
        
        // Refresh cart state globally
        const cartRes = await CartApi.get_cart(auth.UserID);
        if (cartRes && cartRes.data) {
          dispatch(setCart({
            cartID: cartRes.data.cartID,
            items: cartRes.data.items || [],
          }));
        }
      } else {
        toast.error(res?.message || "Không thể thêm sản phẩm.", { id: toastId });
      }
    } catch (err) {
      console.error("Add to cart error in Card:", err);
      toast.error("Lỗi khi thêm sản phẩm. Vui lòng thử lại.", { id: toastId });
    } finally {
      setAdding(false);
    }
  };

  const handleViewDetail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${product.productID}`);
  };

  return (
    <Link href={`/product/${product.productID}`} className="block group">
      {/* Luxury Glassmorphic Card Frame */}
      <Card className="overflow-hidden rounded-[30px] border border-stone-200/40 dark:border-stone-800/40 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md shadow-sm hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] transition-all duration-500 p-3 flex flex-col gap-3.5">
        
        {/* Aspect Frame for Image Inset */}
        <div className="relative aspect-square overflow-hidden rounded-[22px] bg-stone-100 dark:bg-stone-950 border border-stone-200/10 dark:border-stone-800/10">
          <Image
            src={product.url || "https://placehold.co/600x600"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />

          {/* Liquid Glass Overlay Deck on Hover */}
          <div className="absolute inset-0 bg-stone-950/20 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3">
            <Button
              size="sm"
              disabled={adding}
              onClick={handleAddToCart}
              className="bg-yellow-600 hover:bg-yellow-750 text-white rounded-full px-5 py-5 font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer text-sm"
            >
              <ShoppingCart size={16} />
              {adding ? "Adding..." : "Add to cart"}
            </Button>

            <Button
              size="icon"
              variant="secondary"
              onClick={handleViewDetail}
              className="rounded-full w-10 h-10 bg-white/95 dark:bg-stone-900/95 hover:bg-stone-50 dark:hover:bg-stone-850 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md cursor-pointer border border-stone-200/20 dark:border-stone-800/20"
            >
              <Eye size={16} className="text-stone-900 dark:text-stone-100" />
            </Button>
          </div>

          {/* Premium Luxury Badge */}
          <div className="absolute top-3 left-3 bg-yellow-600/90 dark:bg-yellow-600/95 backdrop-blur-md text-white text-[10px] font-bold tracking-[0.15em] px-3 py-1 rounded-full uppercase shadow-md flex items-center gap-1.5 border border-white/20">
            <Sparkles className="w-3 h-3 text-white animate-pulse" />
            New Collection
          </div>
        </div>

        {/* Content Info Section */}
        <CardContent className="p-2 pt-0 flex flex-col gap-1.5">
          {/* Brand/Category Tag */}
          <p className="text-[11px] font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-widest leading-none">
            {product.brand || "Furniro"}
          </p>

          {/* Name with line clamp */}
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 line-clamp-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors duration-300 font-heading tracking-tight leading-tight">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-bold text-stone-900 dark:text-stone-50 font-sans tracking-tight">
              {formatPrice(product.basePrice)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
