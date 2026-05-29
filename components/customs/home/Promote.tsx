"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoveRight, Sparkles } from "lucide-react";

const Promote = () => {
  return (
    <div className="w-full h-screen relative overflow-hidden flex items-center justify-center -top25 mb-25">
      {/* Background Image with Slow Zoom & Blur */}
      <div className="absolute inset-0 scale-105 animate-pulse duration-10000">
        <Image
          src="/images/background.png"
          alt="Premium Milanese Home Interior"
          fill
          priority
          className="object-cover z-0 brightness-[0.85] dark:brightness-[0.7]"
        />
      </div>

      {/* Dynamic Overlay Gradient */}
      <div className="absolute inset-0 bg-linear-to-tr from-stone-950/65 via-stone-900/30 to-transparent z-10" />

      {/* Floating Decorative Orbs for Liquid Glass Theme */}
      <div className="absolute left-[8%] top-[15%] w-64 h-64 bg-yellow-600/10 rounded-full blur-3xl animate-pulse pointer-events-none z-10" />
      <div className="absolute right-[15%] bottom-[12%] w-96 h-96 bg-stone-900/10 dark:bg-stone-50/5 rounded-full blur-3xl animate-bounce duration-10000 pointer-events-none z-10" />

      {/* Main Content Box (Liquid Glass Panel) */}
      <div className="absolute top-1/2 -translate-y-1/2 right-[5%] md:right-[8%] w-[90%] max-w-155 bg-white/75 dark:bg-stone-900/75 backdrop-blur-2xl text-stone-900 dark:text-stone-100 rounded-[40px] p-6 md:p-10 flex flex-col gap-5 z-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border border-white/30 dark:border-stone-800/40 animate-in fade-in slide-in-from-right-20 duration-1000">
        
        {/* Sparkle Subtitle */}
        <div className="flex items-center gap-2.5 self-start px-4 py-1.5 rounded-full bg-yellow-600/10 dark:bg-yellow-600/15 border border-yellow-600/25">
          <Sparkles className="text-yellow-600 w-4 h-4 animate-spin-slow" />
          <h6 className="text-[11px] font-bold tracking-[0.25em] uppercase text-yellow-700 dark:text-yellow-500 font-sans">
            Evolution of Comfort
          </h6>
        </div>

        {/* Headings with Bodoni Moda */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading text-stone-900 dark:text-stone-50 leading-none tracking-tight">
            Discover Our <br />
            <span className="text-yellow-600 italic font-medium">New Era</span>
          </h1>
          <div className="h-0.5 w-16 bg-yellow-600 rounded-full mt-3" />
        </div>

        {/* Description with Jost */}
        <p className="text-base md:text-lg text-stone-600 dark:text-stone-300 font-normal leading-relaxed font-sans max-w-md">
          Crafting living spaces that aren&apos;t just seen, but deeply felt. Discover furniture defined by minimalist Milanese precision, organic warmth, and sustainable craft.
        </p>

        {/* Call to Action & Avatars Grid */}
        <div className="flex flex-wrap gap-6 items-center mt-2">
          <Link href="/product">
            <Button className="group h-12 px-6 rounded-full bg-yellow-600 hover:bg-stone-950 dark:hover:bg-stone-50 dark:hover:text-stone-950 text-white text-base font-semibold tracking-wide transition-all duration-300 hover:shadow-[0_15px_30px_rgba(202,138,4,0.35)] flex items-center gap-3 active:scale-95 cursor-pointer">
              Shop The Collection
              <MoveRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-3.5">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-stone-900 bg-stone-200 dark:bg-stone-800 overflow-hidden shadow-md hover:-translate-y-1 hover:z-30 transition-all duration-300 cursor-pointer"
                >
                  <Image
                    src={`/images/avatars/designer-1.png`}
                    width={40}
                    height={40}
                    alt="Satisfied Furniro Client"
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white dark:border-stone-900 bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 flex items-center justify-center font-bold text-[10px] shadow-md">
                +2k
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 leading-tight">
                Joined the Family
              </span>
              <span className="text-[10px] text-yellow-600 dark:text-yellow-500 font-medium italic animate-pulse">
                Exclusive Milan Craft
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promote;
