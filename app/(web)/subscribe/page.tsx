import { Metadata } from "next";
import SubscribeHero from "@/components/customs/subscribe/SubscribeHero";
import SubscribeForm from "@/components/customs/subscribe/SubscribeForm";

export const metadata: Metadata = {
  title: "Join Exclusive Circle | Furniro - Luxury Furniture Milan",
  description: "Join Furniro's Exclusive Circle to receive our curated lookbooks, Milanese styling trends, and premium welcome discounts. Subscribe today to stay ahead of the design curve.",
  keywords: ["Subscribe Furniro", "Furniro Exclusive Club", "Luxury Furniture Newsletter", "Milan Designer Furniture Deals", "Sustainable Wood Campaigns"],
};

export default function SubscribePage() {
  return (
    <div className="flex flex-col bg-white dark:bg-zinc-950 min-h-screen font-sans">
      <main className="w-full flex flex-col gap-0 overflow-hidden pt-0 mt-[-55px] sm:mt-[-64px]">
        {/* Overlap with header slightly for premium look if header is transparent */}
        <SubscribeHero />
        <div className="w-full pb-16">
          <SubscribeForm />
        </div>
      </main>
      
      {/* Visual badge section to emphasize exclusive membership benefits */}
      <section className="bg-yellow-600 py-16 text-center px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white italic mb-10 drop-shadow-xl animate-in zoom-in duration-1000">
            Never Miss <span className="text-zinc-900 drop-shadow-none">A Story</span>
          </h2>
          <p className="text-xl md:text-2xl text-yellow-50 font-bold max-w-2xl mx-auto leading-relaxed mb-12 drop-shadow-md">
            Stay updated with our sustainable wood creations, bespoke collections, and Milan boutique arrivals. 
            Register above to secure your exclusive 10% welcome privilege code.
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            <div className="flex flex-col items-center">
               <span className="text-6xl font-black text-zinc-900 italic transform hover:scale-110 transition-transform cursor-default">50k+</span>
               <span className="text-yellow-100 font-bold uppercase tracking-widest text-sm mt-4">Boutique Lovers</span>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-6xl font-black text-zinc-900 italic transform hover:scale-110 transition-transform cursor-default">Premium</span>
               <span className="text-yellow-100 font-bold uppercase tracking-widest text-sm mt-4">Milan Quality</span>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-6xl font-black text-zinc-900 italic transform hover:scale-110 transition-transform cursor-default">Eco-FSC</span>
               <span className="text-yellow-100 font-bold uppercase tracking-widest text-sm mt-4">Certified Forestry</span>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Text */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-5">
           <span className="text-[20vw] font-black text-white italic whitespace-nowrap">FURNIRO CLUB</span>
        </div>
      </section>
    </div>
  );
}
