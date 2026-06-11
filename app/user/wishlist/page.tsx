"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Sparkles, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/customs/product/ProductCard";
import PaginationControl from "@/components/customs/common/PaginationControl";
import { ProductApi } from "@/services/api/Product/product.service";
import { ProductCardRes } from "@/schema/response/product/product.res";
import { RootState } from "@/stores/store";

export default function WishlistPage() {
  const router = useRouter();
  const auth = useSelector((s: RootState) => s.authSlice);

  const [products, setProducts] = useState<ProductCardRes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!auth.isLoggedIn || !auth.UserID) {
      router.push("/auth/login");
      return;
    }

    const fetchWishlist = async () => {
      setIsLoading(true);
      try {
        const res = await ProductApi.get_wishlist_products(page, 8);
        if (res && res.code === 200 && res.data) {
          setProducts(res.data.content || []);
          setTotalPages(res.data.totalPages || 0);
        }
      } catch (err) {
        console.error("Error fetching wishlist products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [auth.isLoggedIn, auth.UserID, page, router]);

  if (!auth.isLoggedIn) {
    return null; // Route Guard redirects in useEffect
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Title Header Banner */}
      <div className="w-full bg-linear-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-600/10 rounded-[30px] p-8 md:p-12 relative overflow-hidden flex flex-col gap-2.5">
        <div className="flex items-center gap-2 self-start px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500 animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400">
            Saved Items
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-heading text-stone-900 dark:text-stone-50 tracking-tight leading-none flex items-center gap-3">
          Your <span className="text-yellow-600 italic font-medium">Wishlist</span>
        </h1>
        <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 max-w-xl font-sans mt-1">
          Handpick your favorite articles, track availability, and assemble your dream home decor spaces.
        </p>
      </div>

      {/* Grid Content / States */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col gap-4 p-3 border border-stone-200/40 dark:border-stone-850 rounded-[30px] bg-white/50 dark:bg-stone-900/40 backdrop-blur-md">
              <div className="aspect-square bg-stone-200 dark:bg-stone-800 rounded-[22px]" />
              <div className="h-4 w-1/3 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-6 w-3/4 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-5 w-1/2 bg-stone-200 dark:bg-stone-800 rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center gap-6 py-20 bg-white/40 dark:bg-stone-900/30 border border-stone-250/20 dark:border-stone-850/20 rounded-[35px] backdrop-blur-md px-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-500 mb-2">
            <Heart className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-stone-800 dark:text-stone-100">
            Your wishlist is empty
          </h2>
          <p className="text-stone-500 dark:text-stone-400 max-w-md text-sm sm:text-base leading-relaxed">
            Browse our wide collection of handcrafted luxury furniture and save your favorites to view them later.
          </p>
          <Button
            onClick={() => router.push("/product")}
            className="bg-yellow-600 hover:bg-yellow-750 text-white rounded-full px-6 py-6 font-bold shadow-lg hover:scale-103 active:scale-97 transition-all duration-300 flex items-center gap-2 cursor-pointer mt-2"
          >
            Explore Shop
            <ArrowRight size={16} />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.productID} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <PaginationControl
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      )}
    </div>
  );
}
