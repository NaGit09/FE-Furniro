"use client";

import  { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const title = searchParams.get("title") || "An Unexpected Error Occurred";
  const subtitle = searchParams.get("message") || "We encountered an issue while processing your request. Don't worry, your progress was not lost, and you can try again.";

  return (
    <div className="error-root relative flex flex-col items-center justify-center min-h-[75vh] py-16 px-4 overflow-hidden">
      {/* Dynamic glow background elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-rose-500/10 blur-[80px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-amber-600/15 blur-[100px] animate-pulse" />
        {/* Floating particles */}
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

        .error-root {
          font-family: 'Inter', sans-serif;
        }
        .error-heading {
          font-family: 'Playfair Display', serif;
        }

        /* Glassmorphism main card */
        .glass-error-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 
            0 20px 50px rgba(225, 29, 72, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .dark .glass-error-card {
          background: rgba(24, 24, 27, 0.75);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 
            0 20px 50px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        /* Rose/Dark Gold gradient button */
        .btn-rose {
          background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
          color: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 14px rgba(225, 29, 72, 0.3);
        }
        .btn-rose:hover {
          background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(244, 63, 94, 0.4);
        }

        /* Secondary error action button */
        .btn-outline-dark {
          border: 1.5px solid rgba(24, 24, 27, 0.15);
          color: #18181b;
          background: transparent;
          transition: all 0.3s ease;
        }
        .dark .btn-outline-dark {
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          color: #f4f4f5;
        }
        .btn-outline-dark:hover {
          background: rgba(24, 24, 27, 0.05);
          transform: translateY(-2px);
        }
        .dark .btn-outline-dark:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        /* Dynamic floating animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          filter: blur(2px);
          opacity: 0.3;
          pointer-events: none;
        }
        .particle-1 {
          width: 20px;
          height: 20px;
          background: #e11d48;
          top: 15%;
          right: 15%;
          animation: float 9s ease-in-out infinite;
        }
        .particle-2 {
          width: 25px;
          height: 25px;
          background: #ca8a04;
          bottom: 20%;
          right: 10%;
          animation: float 12s ease-in-out infinite 1s;
        }
        .particle-3 {
          width: 15px;
          height: 15px;
          background: #f43f5e;
          top: 35%;
          left: 12%;
          animation: float 8s ease-in-out infinite 2s;
        }

        /* Animated Error Warning Ring */
        .warning-glow {
          box-shadow: 0 0 30px rgba(225, 29, 72, 0.3);
          animation: pulse-warn-ring 2.5s infinite;
        }
        @keyframes pulse-warn-ring {
          0% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.4); }
          70% { box-shadow: 0 0 0 18px rgba(225, 29, 72, 0); }
          100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
        }
      `}</style>

      {/* Main glass card container */}
      <div className="glass-error-card relative z-10 w-full max-w-2xl rounded-3xl p-8 md:p-12 text-center transition-all duration-300">
        
        {/* Animated Warning Indicator */}
        <div className="flex justify-center mb-8">
          <div className="warning-glow flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-tr from-rose-600 to-amber-500 text-white animate-bounce-slow">
            <AlertTriangle className="w-12 h-12 stroke-[2.5]" />
          </div>
        </div>

        {/* Dynamic Headers */}
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-rose-500/10 text-rose-700 dark:text-rose-300 dark:bg-rose-500/20 mb-6">
          Warn Error
        </span>
        <h1 className="error-heading text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-300 max-w-md mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>

        {/* Divider */}
        <div className="w-24 h-1 bg-rose-500/30 rounded mx-auto mb-10" />

        {/* Buttons / Navigation actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-outline-dark flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-medium w-full sm:w-auto text-sm transition-all duration-300 cursor-pointer">
            <Home className="w-4 h-4" />
            Return to Home
          </Link>
        </div>

        {/* Back link */}
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center gap-2 mt-8 text-neutral-500 dark:text-neutral-400 hover:text-rose-700 dark:hover:text-rose-400 text-sm font-medium transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>

      </div>
    </div>
  );
}

export default function ErrorPageContent() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[75vh] py-16 px-4">
        <div className="animate-spin w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full" />
        <p className="mt-4 text-rose-700 dark:text-rose-400 font-medium text-sm animate-pulse">Loading feedback state...</p>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
