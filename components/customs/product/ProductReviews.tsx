"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, MessageSquare, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { getCookie } from "@/lib/utils/cookieUtils";
import { ProductApi } from "@/services/api/Product/product.service";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Review {
  reviewID: number;
  productID: number;
  userID: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductReviews({ productID }: { productID: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Check authentication
  const isLoggedIn = typeof window !== "undefined" && (!!getCookie("AccessToken") || !!getCookie("jwt") || !!getCookie("UserID"));

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await ProductApi.get_product_reviews(String(productID));
      if (res?.code === 200 && res.data) {
        setReviews(res.data);
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productID]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá (1-5).");
      return;
    }
    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá của bạn.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Đang gửi đánh giá của bạn...");
    try {
      const res = await ProductApi.add_product_review(String(productID), rating, comment);
      if (res?.code === 200) {
        toast.success("Đánh giá sản phẩm đã được gửi thành công!", { id: toastId });
        setRating(0);
        setComment("");
        fetchReviews();
      } else {
        toast.error(res?.message || "Không thể gửi đánh giá.", { id: toastId });
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      const errMsg = error.response?.data?.message || "Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại.";
      toast.error(errMsg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Aggregate rating & review lists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-50 font-heading">
              Đánh giá từ khách hàng
            </h3>
            <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-xs font-bold rounded-lg flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-yellow-500" />
              {averageRating} / 5.0 ({reviews.length} đánh giá)
            </span>
          </div>

          <Separator className="opacity-40" />

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl border border-stone-200 dark:border-stone-850 bg-stone-50/50 dark:bg-stone-950/40 animate-pulse space-y-3">
                  <div className="h-4 bg-stone-200 dark:bg-stone-850 rounded w-1/4" />
                  <div className="h-3 bg-stone-200 dark:bg-stone-850 rounded w-1/2" />
                  <div className="h-2.5 bg-stone-100 dark:bg-stone-900 rounded w-full" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-stone-400 dark:text-stone-500 border border-dashed border-stone-250 dark:border-stone-800 rounded-2xl bg-white dark:bg-stone-950/30">
              <MessageSquare className="w-10 h-10 mb-3 opacity-60" />
              <p className="text-sm font-semibold">Chưa có đánh giá nào cho sản phẩm này.</p>
              <p className="text-xs mt-1">Hãy là người đầu tiên mua và chia sẻ trải nghiệm về sản phẩm!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {reviews.map((rev) => (
                <div 
                  key={rev.reviewID}
                  className="p-5 rounded-2xl border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-950/40 flex flex-col gap-3 shadow-xs hover:border-stone-300 dark:hover:border-stone-800 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                        Khách hàng #{rev.userID}
                      </span>
                      <div className="flex items-center gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star 
                            key={s} 
                            className={`w-3.5 h-3.5 ${s < rev.rating ? "fill-yellow-500 text-yellow-500" : "text-stone-300 dark:text-stone-800"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {new Date(rev.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-300 font-medium whitespace-pre-wrap">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Leave feedback form */}
        <div className="liquid-glass-card rounded-2xl p-6 border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-950/20 self-start">
          <h4 className="text-lg font-bold text-stone-900 dark:text-stone-50 font-heading mb-4">
            Viết đánh giá của bạn
          </h4>

          {isLoggedIn ? (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Số sao đánh giá *
                </label>
                <div className="flex items-center gap-1.5 py-1">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const starVal = index + 1;
                    const active = starVal <= (hoverRating || rating);
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors cursor-pointer"
                      >
                        <Star 
                          className={`w-6 h-6 transition-all duration-150 ${
                            active 
                              ? "fill-yellow-500 text-yellow-500 scale-110" 
                              : "text-stone-300 dark:text-stone-850"
                          }`} 
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Nội dung đánh giá *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Hãy chia sẻ nhận xét chi tiết của bạn về sản phẩm..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-950/80 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-yellow-600 transition-colors font-medium leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-start gap-2 bg-yellow-500/5 dark:bg-yellow-500/2 border border-yellow-500/10 rounded-xl p-3 text-[10px] leading-relaxed text-yellow-700 dark:text-yellow-500 font-semibold">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Lưu ý: Chỉ những tài khoản đã mua sản phẩm này trên Furniro mới có quyền đăng tải đánh giá.</span>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-50 active:scale-95 shrink-0"
              >
                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold leading-relaxed">
                Bạn cần đăng nhập bằng tài khoản mua hàng để viết nhận xét cho sản phẩm này.
              </p>
              <Link href="/auth/login">
                <Button 
                  className="w-full h-10 bg-stone-900 hover:bg-stone-950 dark:bg-stone-50 dark:hover:bg-stone-100 dark:text-stone-900 text-white rounded-xl font-bold text-xs cursor-pointer"
                >
                  Đăng nhập ngay
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
