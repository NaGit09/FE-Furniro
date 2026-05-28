import Browse from "@/components/customs/home/Browse";
import Promote from "@/components/customs/home/Promote";
import Features from "@/components/customs/home/Features";
import Inspiration from "@/components/customs/home/Inspiration";
import ProductListCard from "@/components/customs/product/ProductListCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Furniro | Premium Furniture Milan - Modern Living & Sustainable Design",
  description: "Experience the next evolution of home design. Furniro brings you high-end, sustainable furniture crafted for comfort and minimalist elegance.",
};

export default function Home() {
  return (
    <div className="flex flex-col bg-stone-50 dark:bg-stone-950 min-h-screen font-sans overflow-hidden">
      <main className="w-full flex flex-col gap-0 items-center justify-center relative">
        {/* Dynamic Hero Section */}
        <section className="w-full h-screen relative">
          <Promote />
        </section>
        
        {/* Trust & Support Section - Floating over Hero transition */}
        <div className="w-full relative z-20 -mt-20">
          <Features />
        </div>

        {/* Categories Section */}
        <section className="w-full py-28 px-4 flex justify-center bg-transparent">
          <div className="container mx-auto">
             <Browse />
          </div>
        </section>

        {/* Featured Products */}
        <section className="w-full px-4 py-28 bg-stone-100/50 dark:bg-stone-900/30 border-y border-stone-200/30 dark:border-stone-900/40 overflow-hidden" id="product">
           <div className="container mx-auto">
              <div className="text-center mb-16 flex flex-col items-center gap-2.5 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                 <h6 className="text-xs font-bold tracking-[0.25em] text-yellow-600 dark:text-yellow-500 uppercase">
                   Premium Showcase
                 </h6>
                 <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-stone-900 dark:text-stone-50 tracking-tight">
                   Curated <span className="text-yellow-600 italic font-medium font-heading">Masterpieces</span>
                 </h2>
                 <p className="max-w-xl text-stone-500 dark:text-stone-400 font-medium font-sans">
                   Handselected sustainable pieces that define the new standard of premium modern living.
                 </p>
                 <div className="h-0.5 w-16 bg-yellow-600 rounded-full mt-2" />
              </div>
              <ProductListCard />
           </div>
        </section>

        {/* Brand Inspiration / Lifestyle Section */}
        <Inspiration />

        {/* Newsletter / CTA Section */}
        <section className="w-full bg-stone-950 dark:bg-stone-950 py-28 text-center text-white relative overflow-hidden group border-t border-stone-900">
           <div className="container mx-auto max-w-3xl relative z-10 px-4 flex flex-col items-center gap-6">
              <h6 className="text-xs font-bold tracking-[0.25em] text-yellow-600 dark:text-yellow-500 uppercase">
                Newsletter
              </h6>
              <h2 className="text-4xl md:text-6xl font-bold font-heading italic text-stone-50 tracking-tight">
                Crafting <span className="text-yellow-600 not-italic font-normal font-heading">Your Story</span>
              </h2>
              <p className="text-base md:text-lg text-stone-400 font-sans max-w-xl mx-auto leading-relaxed">
                Join our exclusive Milan design circle for early collection access, sustainable styling stories, and modern home insights.
              </p>
              
              {/* Refined Glassmorphic Input & CTA Form */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full max-w-lg mx-auto mt-4">
                 <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="w-full h-13 bg-white/5 backdrop-blur-md rounded-full border border-white/10 px-6 text-sm font-medium outline-none focus:border-yellow-600/50 focus:bg-white/10 transition-all placeholder:text-stone-500 text-stone-100"
                 />
                 <button className="h-13 px-8 bg-yellow-600 hover:bg-stone-50 hover:text-stone-950 rounded-full text-sm font-bold tracking-wide transition-all active:scale-95 shadow-lg whitespace-nowrap cursor-pointer text-white">
                   Join Family
                 </button>
              </div>
           </div>
           
           {/* Decorative Luxury Brand Elements */}
           <div className="absolute top-[10%] left-[5%] text-[14vw] font-bold italic text-white/2 opacity-25 pointer-events-none select-none tracking-tighter font-heading">FURNIRO</div>
           <div className="absolute bottom-[10%] right-[5%] text-[14vw] font-bold italic text-white/2 opacity-25 pointer-events-none select-none tracking-tighter font-heading">MILAN</div>
        </section>
      </main>
    </div>
  );
}
