import Image from "next/image";
import { Sparkles } from "lucide-react";

const AboutHero = () => {
  return (
    <div className="w-full h-87.5 md:h-100 relative overflow-hidden flex items-center justify-center">
      {/* Background Image with Overlay */}
      <Image
        src="/images/about-hero.png"
        alt="Furniro Showroom"
        fill
        priority
        className="object-cover z-0 brightness-[0.75] dark:brightness-[0.6] transition-transform duration-1000 hover:scale-105"
      />
      
      {/* Premium Content Overlay */}
      <div className="relative z-10 text-center px-4 max-w-3xl animate-in fade-in slide-in-from-bottom-10 duration-1000 flex flex-col items-center">
        {/* Gold Luxury Tag */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-600/15 border border-yellow-600/25 mb-4 backdrop-blur-md">
          <Sparkles className="text-yellow-500 w-3.5 h-3.5 animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-yellow-500 font-sans">
            Furniro Story Since 1995
          </span>
        </div>

        {/* Serif Editorial Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-heading text-white mb-4 drop-shadow-lg tracking-tight leading-none">
          Crafting <span className="text-yellow-600 italic font-medium font-heading">Comfort</span>
        </h1>
        <div className="h-0.5 w-16 bg-yellow-600 rounded-full mb-4.5" />

        {/* Readable Muted Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-stone-200 font-medium max-w-xl mx-auto drop-shadow-md leading-relaxed font-sans">
          From our hands to your home. We believe every piece of furniture tells a unique story of elegance, precision, and organic warmth.
        </p>
      </div>
      
      {/* Rich Dark Gradient Cover */}
      <div className="absolute inset-0 bg-linear-to-t from-stone-950/70 via-stone-900/30 to-transparent z-5" />
    </div>
  );
};

export default AboutHero;
