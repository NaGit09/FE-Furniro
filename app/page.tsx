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
    <div className="flex flex-col bg-white dark:bg-zinc-950 min-h-screen font-sans overflow-hidden">
      <main className="w-full flex flex-col gap-0 items-center justify-center relative">
        {/* Dynamic Hero Section */}
        <section className="w-full h-screen relative">
          <Promote />
        </section>
        
        {/* Trust & Support Section - Now at the top for better conversion */}
        <div className="w-full relative z-20 -mt-20">
          <Features />
        </div>

        {/* Categories Section */}
        <section className="w-full py-32 px-4 flex justify-center bg-white dark:bg-zinc-950">
          <div className="container mx-auto">
             <Browse />
          </div>
        </section>

        {/* Featured Products */}
        <section className="w-full px-4 py-24 bg-zinc-50 dark:bg-zinc-900 overflow-hidden" id="product">
           <div className="container mx-auto">
              <div className="text-center mb-16 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                 <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white italic tracking-tighter">
                   Curated <span className="text-yellow-600">Masterpieces</span>
                 </h2>
                 <p className="max-w-xl text-zinc-500 font-medium italic">Handselected pieces that define the new standard of modern living.</p>
                 <div className="h-1 w-24 bg-yellow-600 rounded-full" />
              </div>
              <ProductListCard page={1} size={10} />
           </div>
        </section>

        {/* Brand Inspiration / Lifestyle Section */}
        <Inspiration />

        {/* Newsletter / CTA Section */}
        <section className="w-full bg-zinc-900 py-32 text-center text-white relative overflow-hidden group">
           <div className="container mx-auto max-w-4xl relative z-10 px-4">
              <h2 className="text-5xl md:text-7xl font-black italic mb-8 drop-shadow-2xl animate-in fade-in duration-1000">
                Crafting <span className="text-yellow-600">Your Story</span>
              </h2>
              <p className="text-xl md:text-2xl text-zinc-400 font-medium mb-12 max-w-xl mx-auto italic leading-relaxed">
                Join our exclusive design newsletter for weekly inspiration and first access to new collections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-2xl mx-auto group-hover:scale-105 transition-all duration-700">
                 <div className="relative w-full h-20">
                    <input 
                       type="email" 
                       placeholder="your@email.com" 
                       className="w-full h-full bg-white/10 backdrop-blur-md rounded-[30px] border border-white/20 px-10 text-xl font-medium outline-none focus:bg-white/20 transition-all placeholder:text-zinc-600 animate-in fade-in slide-in-from-left-10 duration-1000"
                    />
                 </div>
                 <button className="h-20 px-12 bg-yellow-600 hover:bg-white hover:text-black rounded-[30px] text-xl font-black transition-all active:scale-95 shadow-xl animate-in fade-in slide-in-from-right-10 duration-1000 whitespace-nowrap">
                   Join Family
                 </button>
              </div>
           </div>
           
           {/* Decorative Design Elements */}
           <div className="absolute top-[10%] left-[5%] text-[15vw] font-black italic text-white/5 opacity-10 pointer-events-none select-none tracking-tighter">FURNIRO</div>
           <div className="absolute bottom-[10%] right-[5%] text-[15vw] font-black italic text-white/5 opacity-10 pointer-events-none select-none tracking-tighter">MILAN</div>
        </section>
      </main>
    </div>
  );
}
