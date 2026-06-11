"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Minus, Plus, Star, ShoppingCart, Repeat, Sparkles, Heart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ProductDetail } from "@/schema/response/product/product.res";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CartApi } from "@/services/api/Order/cart.service";
import { ProductApi } from "@/services/api/Product/product.service";
import { addToWishlistLocal, removeFromWishlistLocal } from "@/stores/slices/wishlist.store";
import { setCart } from "@/stores/slices/cart.store";
import { RootState } from "@/stores/store";

interface ProductInformationProps {
  data: ProductDetail;
}

const ProductInformation = ({ data }: ProductInformationProps) => {
  const rating = 4.8;
  const totalReview = 164;
  
  const [quantity, setQuantity] = useState(1);
  const [colorSelect, chooseColor] = useState(data.colors[0]);
  const [sizeSelect, chooseSize] = useState(data.sizes[0]);

  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((s: RootState) => s.authSlice);
  const cart = useSelector((s: RootState) => s.cartSlice);
  const wishlistProductIds = useSelector((state: RootState) => state.wishlistSlice.productIds);
  const [addingToCart, setAddingToCart] = useState(false);

  const activeId = data.productID || data.productId || 0;
  const isWishlisted = wishlistProductIds.includes(activeId);

  const handleWishlistToggle = async () => {
    if (!auth.isLoggedIn || !auth.UserID) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng yêu thích.");
      router.push("/auth/login");
      return;
    }

    if (!activeId) return;

    try {
      if (isWishlisted) {
        const res = await ProductApi.remove_from_wishlist(activeId);
        if (res.code === 200 || res.data === "Removed product from wishlist successfully") {
          dispatch(removeFromWishlistLocal(activeId));
          toast.success("Đã xóa khỏi danh sách yêu thích");
        } else {
          toast.error(res.message || "Lỗi khi xóa khỏi danh sách yêu thích");
        }
      } else {
        const res = await ProductApi.add_to_wishlist(activeId);
        if (res.code === 200 || res.data === "Added product to wishlist successfully") {
          dispatch(addToWishlistLocal(activeId));
          toast.success("Đã thêm vào danh sách yêu thích");
        } else {
          toast.error(res.message || "Lỗi khi thêm vào danh sách yêu thích");
        }
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      toast.error("Lỗi khi xử lý danh sách yêu thích.");
    }
  };

  const handleAddToCart = async () => {
    if (!auth.isLoggedIn || !auth.UserID) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      router.push("/auth/login");
      return;
    }

    setAddingToCart(true);
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
          console.error("Lazy cart retrieval failed in Detail:", cartErr);
        }
      }

      const res = await CartApi.add_to_cart({
        cartID: activeCartID || 0,
        userID: auth.UserID,
        variantID: data.productID || data.productId || 0,
        quantity,
        price: data.basePrice,
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
      console.error("Add to cart error:", err);
      toast.error("Thêm vào giỏ hàng thất bại. Vui lòng thử lại.", { id: toastId });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleCompare = () => {
    const activeId = data.productID || data.productId || 0;
    if (!activeId) return;

    try {
      const compareRaw = localStorage.getItem("furniro_compare");
      let compareList: number[] = compareRaw ? JSON.parse(compareRaw) : [];

      if (compareList.includes(activeId)) {
        toast.info("Sản phẩm đã có trong danh sách so sánh.");
        router.push("/compare");
        return;
      }

      if (compareList.length >= 3) {
        toast.warning("Bạn chỉ có thể so sánh tối đa 3 sản phẩm. Vui lòng xóa bớt sản phẩm.");
        router.push("/compare");
        return;
      }

      compareList.push(activeId);
      localStorage.setItem("furniro_compare", JSON.stringify(compareList));
      toast.success("Đã thêm vào danh sách so sánh!");
      router.push("/compare");
    } catch (err) {
      console.error("Compare error:", err);
      toast.error("Lỗi khi thêm vào so sánh. Vui lòng thử lại.");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => {
      if (i + 1 <= Math.floor(rating)) {
        return (
          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500 shrink-0" />
        );
      }
      if (i < rating) {
        return <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500 opacity-50 shrink-0" />;
      }
      return <Star key={i} className="w-4 h-4 text-stone-300 dark:text-stone-700 shrink-0" />;
    });
  };

  return (
    <div className="flex flex-col gap-5.5 text-stone-900 dark:text-stone-100">
      {/* Brand & Collection Tags */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="bg-yellow-600/10 dark:bg-yellow-600/15 border border-yellow-600/20 text-yellow-700 dark:text-yellow-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3 animate-pulse" /> {data.brand || "Furniro"}
        </span>
        <span className="bg-stone-100 dark:bg-stone-900/60 border border-stone-200/40 dark:border-stone-800/40 text-stone-500 dark:text-stone-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          Collection 2026
        </span>
      </div>

      {/* Name */}
      <h1 className="text-3xl sm:text-4xl font-bold font-heading text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
        {data.name}
      </h1>

      {/* Price & Rating Deck */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-500 font-sans tracking-tight">
          {data.basePrice.toLocaleString("vi-VN")} ₫
        </div>
        
        <div className="flex items-center gap-2.5 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/30 dark:border-stone-800/30 rounded-full px-3.5 py-1 text-xs sm:text-sm font-semibold shadow-inner">
          <div className="flex items-center gap-0.5">{renderStars(rating)}</div>
          <Separator orientation="vertical" className="h-3 bg-stone-300 dark:bg-stone-700" />
          <span className="text-stone-500 dark:text-stone-400 font-sans">
            {totalReview} đánh giá
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed font-sans max-w-xl">
        {data.description}
      </p>

      {/* Size Selector */}
      <div className="flex flex-col gap-2.5 items-start">
        <Label className="text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest font-sans">
          Size
        </Label>
        <div className="flex gap-2.5 flex-wrap">
          {data.sizes.map((size) => (
            <Button
              key={size}
              onClick={() => chooseSize(size)}
              className={`rounded-full h-10 px-5 text-xs font-bold font-sans transition-all duration-300 cursor-pointer border
                ${
                  size === sizeSelect
                    ? "bg-yellow-600 border-yellow-600 text-white shadow-md shadow-yellow-600/25"
                    : "bg-white dark:bg-stone-900 border-stone-200/60 dark:border-stone-850/60 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850 hover:border-yellow-600/30"
                }`}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Color Selector */}
      <div className="flex flex-col gap-2.5 items-start">
        <Label className="text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest font-sans">
          Color
        </Label>
        <div className="flex gap-3">
          {data.colors.map((color) => (
            <button
              key={color}
              onClick={() => chooseColor(color)}
              style={{ backgroundColor: color }}
              className={`w-8 h-8 rounded-full transition-all duration-300 cursor-pointer relative flex items-center justify-center border border-black/10 dark:border-white/10
                ${
                  color === colorSelect
                    ? "scale-110 shadow-lg ring-2 ring-yellow-600 ring-offset-2 dark:ring-offset-stone-950"
                    : "opacity-80 hover:opacity-100 hover:scale-105"
                }`}
              aria-label={`Color ${color}`}
            >
              {color === colorSelect && (
                <div className="w-1.5 h-1.5 rounded-full bg-white mix-blend-difference" />
              )}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-stone-200 dark:bg-stone-850 my-1" />

      {/* Interaction: Quantity Stepper & Buttons */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-stone-200/60 dark:border-stone-850/60 bg-white dark:bg-stone-900 rounded-full h-13 px-2 shadow-inner">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(quantity - 1)}
            disabled={quantity === 1}
            className="rounded-full w-9 h-9 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 shrink-0 cursor-pointer"
          >
            <Minus size={16} />
          </Button>
          
          <Input
            value={quantity}
            readOnly
            className="w-12 border-none text-center bg-transparent focus-visible:ring-0 p-0 text-sm font-bold font-sans"
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
            className="rounded-full w-9 h-9 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 shrink-0 cursor-pointer"
          >
            <Plus size={16} />
          </Button>
        </div>

        {/* Add To Cart */}
        <Button
          disabled={addingToCart}
          onClick={handleAddToCart}
          className="h-13 px-8 bg-yellow-600 hover:bg-yellow-750 text-white rounded-full font-bold shadow-lg hover:shadow-yellow-600/20 hover:scale-102 active:scale-98 transition-all duration-300 cursor-pointer flex items-center gap-2"
        >
          <ShoppingCart size={18} />
          {addingToCart ? "Adding..." : "Add to cart"}
        </Button>

        {/* Compare */}
        <Button
          variant="outline"
          onClick={handleCompare}
          className="h-13 px-6 rounded-full border-stone-200/60 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850 font-bold font-sans transition-all duration-300 flex items-center gap-2 cursor-pointer"
        >
          <Repeat size={18} />
          Compare
        </Button>

        {/* Wishlist */}
        <Button
          variant="outline"
          onClick={handleWishlistToggle}
          className={`h-13 px-6 rounded-full font-bold font-sans transition-all duration-300 flex items-center gap-2 cursor-pointer
            ${isWishlisted 
              ? "border-red-205 bg-red-50/70 text-red-600 hover:bg-red-100 hover:border-red-300 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400" 
              : "border-stone-200/60 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850"
            }`}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "animate-pulse" : ""} />
          {isWishlisted ? "Wishlisted" : "Wishlist"}
        </Button>
      </div>

      <Separator className="bg-stone-200 dark:bg-stone-850 my-1" />

      {/* Metadata Specification Details */}
      <div className="grid grid-cols-2 gap-y-2 text-xs md:text-sm text-stone-500 dark:text-stone-400 font-sans font-medium">
        <div className="flex gap-2">
          <span className="text-stone-400 dark:text-stone-500">Brand:</span>
          <span className="text-stone-800 dark:text-stone-200 font-semibold">{data.brand || "Furniro"}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-stone-400 dark:text-stone-500">SKU:</span>
          <span className="text-stone-800 dark:text-stone-200 font-semibold">{data.skus[0] || "FN-MILAN-001"}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-stone-400 dark:text-stone-500">Category:</span>
          <span className="text-stone-800 dark:text-stone-200 font-semibold">{data.categoryName}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-stone-400 dark:text-stone-500">Material:</span>
          <span className="text-stone-800 dark:text-stone-200 font-semibold">{data.material || "Organic Oak Wood"}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInformation;
