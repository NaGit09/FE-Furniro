"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, ShoppingBag, Home } from "lucide-react";
import {OrderApi} from "@/services/api/Order/order.service";
import "@/styles/success.css";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const title = searchParams.get("title") || "Operation Completed Successfully";
  const subtitle = searchParams.get("message") || "Thank you! Your action has been successfully processed by our systems. We are processing everything smoothly.";
  const type = searchParams.get("type") || "success"; 
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (type === "order" && orderId) {
      console.log("Order ID for success:", orderId);
      // call api capture if orderId exists
      OrderApi.capture_paypal_payment(orderId);
    }
  }, [type, orderId]);

  return (
    <div className="success-root relative flex flex-col items-center justify-center min-h-[75vh] py-16 px-4 overflow-hidden">
      {/* Dynamic glow background elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-500/10 blur-[80px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-yellow-600/15 blur-[100px] animate-pulse" />
        {/* Floating particles */}
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
      </div>

      {/* Main glass card container */}
      <div className="glass-success-card relative z-10 w-full max-w-2xl rounded-3xl p-8 md:p-12 text-center transition-all duration-300">
        
        {/* Animated Checkmark Indicator */}
        <div className="flex justify-center mb-8">
          <div className="checkmark-glow flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-tr from-amber-600 to-yellow-400 text-white animate-bounce-slow">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>
        </div>

        {/* Dynamic Headers */}
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-amber-500/10 text-amber-700 dark:text-amber-300 dark:bg-amber-500/20 mb-6">
          Greeting Success
        </span>
        <h1 className="success-heading text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-300 max-w-md mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>

        {/* Divider */}
        <div className="w-24 h-1 bg-amber-500/30 rounded mx-auto mb-10" />

        {/* Buttons / Navigation actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {type === "order" || title.toLowerCase().includes("order") ? (
            <Link href="/user/orders" className="btn-gold flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-medium w-full sm:w-auto text-sm transition-all duration-300 cursor-pointer">
              <ShoppingBag className="w-4 h-4 animate-pulse" />
              View Your Orders
            </Link>
          ) : (
            <Link href="/" className="btn-gold flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-medium w-full sm:w-auto text-sm transition-all duration-300 cursor-pointer">
              <Home className="w-4 h-4" />
              Go to Home
            </Link>
          )}
          <Link href="/product" className="btn-outline-gold flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-medium w-full sm:w-auto text-sm transition-all duration-300 cursor-pointer">
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Back link */}
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center gap-2 mt-8 text-neutral-500 dark:text-neutral-400 hover:text-amber-700 dark:hover:text-amber-400 text-sm font-medium transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>

      </div>
    </div>
  );
}

export default function SuccessPageContent() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[75vh] py-16 px-4">
        <div className="animate-spin w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full" />
        <p className="mt-4 text-amber-700 dark:text-amber-400 font-medium text-sm animate-pulse">Loading feedback state...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
