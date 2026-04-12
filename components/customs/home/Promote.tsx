"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoveRight, Sparkles } from "lucide-react";

const Promote = () => {
  return (
    <div className="w-full h-screen relative overflow-hidden flex items-center justify-center -top-[100px] mb-[-100px]">
      {/* Background Image with Slow Zoom */}
      <div className="absolute inset-0 scale-110 animate-pulse duration-10000">
        <Image
          src="/images/background.png"
          alt="Promote"
          fill
          priority
          className="object-cover z-0"
        />
      </div>

      {/* Dynamic Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent z-11" />

      {/* Main Content Box */}
      <div className="absolute top-1/2 -translate-y-1/2 right-[5%] md:right-[10%] w-full max-w-[700px] bg-white/90 backdrop-blur-xl dark:bg-black/80 text-black dark:text-white rounded-[50px] p-12 md:p-20 flex flex-col gap-10 z-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 animate-in fade-in slide-in-from-right-20 duration-1000">
        <div className="flex items-center gap-3 animate-bounce">
          <Sparkles className="text-yellow-600 w-5 h-5" />
          <h6 className="text-sm font-black tracking-[0.4em] uppercase text-zinc-600 dark:text-zinc-400">
            Evolution of Comfort
          </h6>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-zinc-900 dark:text-zinc-100 leading-[0.9] italic tracking-tighter transform hover:skew-x-2 transition-transform duration-500">
          Discover Our <br />
          <span className="text-yellow-600">New Era</span>
        </h1>

        <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium max-w-lg leading-relaxed">
          Crafting spaces that aren't just seen, but felt. Furniture that
          defines your lifestyle through minimalist precision and organic
          warmth.
        </p>

        <div className="flex flex-wrap gap-6 items-center">
          <Link href="/product">
            <Button className="group h-24 px-12 rounded-[30px] bg-yellow-600 hover:bg-zinc-900 text-white text-2xl font-black transition-all duration-300 hover:shadow-2xl shadow-yellow-600/20 flex items-center gap-4 active:scale-95">
              Shop Now{" "}
              <MoveRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>

          <div className="flex -space-x-4">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-full border-4 border-white dark:border-black bg-zinc-200 overflow-hidden shadow-xl hover:-translate-y-2 transition-transform cursor-pointer"
              >
                <Image
                  src={`/images/avatars/designer-1.png`}
                  width={64}
                  height={64}
                  alt="Review"
                  className="object-cover"
                />
              </div>
            ))}
            <div className="w-16 h-16 rounded-full border-4 border-white dark:border-black bg-black text-white flex items-center justify-center font-bold text-xs shadow-xl cursor-help">
              +2k
            </div>
          </div>
          <span className="text-zinc-500 text-sm font-bold animate-pulse italic">
            Already joined the family
          </span>
        </div>
      </div>

      {/* Floating Elements for Premium Feel */}
      <div className="absolute left-[10%] top-[20%] w-32 h-32 bg-yellow-600/10 blur-3xl animate-pulse rounded-full z-2" />
      <div className="absolute right-[20%] bottom-[15%] w-64 h-64 bg-zinc-900/5 blur-3xl animate-bounce duration-8000 rounded-full z-2" />
    </div>
  );
};

export default Promote;
