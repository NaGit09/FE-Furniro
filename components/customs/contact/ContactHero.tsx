import Image from "next/image";
import { Sparkles } from "lucide-react";

const ContactHero = () => {
  return (
    <div className="w-full h-[350px] md:h-[400px] relative overflow-hidden flex items-center justify-center">
      {/* Background Image with Overlay */}
      <Image
        src="/images/contact-hero.png"
        alt="Contact Furniro"
        fill
        priority
        className="object-cover z-0 brightness-[0.75] dark:brightness-[0.6] transition-transform duration-1000 hover:scale-105"
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 text-center px-4 max-w-3xl animate-in fade-in slide-in-from-bottom-10 duration-1000 flex flex-col items-center">
        {/* Gold Luxury Tag */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-600/15 border border-yellow-600/25 mb-4 backdrop-blur-md">
          <Sparkles className="text-yellow-500 w-3.5 h-3.5 animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-yellow-500 font-sans">
            Connect With Furniro
          </span>
        </div>

        {/* Serif Editorial Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-heading text-white mb-4 drop-shadow-lg tracking-tight leading-none">
          Let's <span className="text-yellow-600 italic font-medium font-heading">Connect</span>
        </h1>
        <div className="h-0.5 w-16 bg-yellow-600 rounded-full mb-4.5" />

        {/* Muted Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-stone-200 font-medium max-w-xl mx-auto drop-shadow-md leading-relaxed font-sans">
          Your journey to a beautiful home begins with a simple conversation.
        </p>
      </div>
      
      {/* Dark Theme-Aware Gradient Divider Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-stone-50 dark:from-stone-950 to-transparent z-5" />
      
      {/* Dark Ambient Overlay Cover */}
      <div className="absolute inset-0 bg-linear-to-t from-stone-950/40 via-stone-900/20 to-transparent z-4" />
    </div>
  );
};

export default ContactHero;
