import { Metadata } from "next";
import ContactHero from "@/components/customs/contact/ContactHero";
import ContactForm from "@/components/customs/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Furniro - Luxury Furniture Milan",
  description: "Reach out to Furniro for premium furniture inquiries, custom design consultations, or to join our exclusive design news circle. We're here to help you build your dream home.",
  keywords: ["Contact Furniro", "Furniture Italy", "Milan Designer Furniture", "Modern Living Room Contact", "Sustainable Design Consultations"],
};

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-white dark:bg-zinc-950 min-h-screen font-sans">
      <main className="w-full flex flex-col gap-0 overflow-hidden pt-0 mt-[-55px] sm:mt-[-64px]">
        {/* Adjusted margin to overlap with header slightly for more premium look if header is transparent */}
        <ContactHero />
        <div className="w-full pb-32">
           <ContactForm />
        </div>
      </main>
      
      {/* Visual touch to emphasize the "News Register" aspect */}
      <section className="bg-yellow-600 py-24 text-center px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white italic mb-10 drop-shadow-xl animate-in zoom-in duration-1000">
            Never Miss <span className="text-zinc-900 drop-shadow-none">A Story</span>
          </h2>
          <p className="text-xl md:text-2xl text-yellow-50 font-bold max-w-2xl mx-auto leading-relaxed mb-12 drop-shadow-md">
            Stay updated with our latest collections and sustainable design insights. 
            Register through the contact form above to become a part of our exclusive design community.
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            <div className="flex flex-col items-center">
               <span className="text-6xl font-black text-zinc-900 italic transform hover:scale-110 transition-transform cursor-default">50k+</span>
               <span className="text-yellow-100 font-bold uppercase tracking-widest text-sm mt-4">Design Lovers</span>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-6xl font-black text-zinc-900 italic transform hover:scale-110 transition-transform cursor-default">Modern</span>
               <span className="text-yellow-100 font-bold uppercase tracking-widest text-sm mt-4">Milan Style</span>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-6xl font-black text-zinc-900 italic transform hover:scale-110 transition-transform cursor-default">Eco</span>
               <span className="text-yellow-100 font-bold uppercase tracking-widest text-sm mt-4">Certified Wood</span>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Text */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-5">
           <span className="text-[20vw] font-black text-white italic whitespace-nowrap">FURNIRO NEWS</span>
        </div>
      </section>
    </div>
  );
}
