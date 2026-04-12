import Image from "next/image";

const Inspiration = () => {
  return (
    <section className="container mx-auto px-4 py-24 w-full">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <h6 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">
          Lifestyle
        </h6>
        <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 italic">
          #Furniro<span className="text-yellow-600">Furniture</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 h-[700px] overflow-hidden">
        {/* Column 1 */}
        <div className="flex flex-col gap-6">
          <div className="relative h-1/2 w-full rounded-2xl overflow-hidden group">
            <Image src="/images/LivingRoom.png" alt="Inspiration 1" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div className="relative h-1/2 w-full rounded-2xl overflow-hidden group">
            <Image src="/images/about-vision.png" alt="Inspiration 2" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-6 -mt-12">
          <div className="relative h-2/3 w-full rounded-2xl overflow-hidden group">
             <Image src="/images/background.png" alt="Inspiration 3" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div className="relative h-1/3 w-full rounded-2xl overflow-hidden group">
             <Image src="/images/BedRoom.png" alt="Inspiration 4" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
        </div>

        {/* Column 3 - Centerpiece */}
        <div className="col-span-2 relative h-full w-full rounded-3xl overflow-hidden group shadow-2xl">
           <Image src="/images/background_furniro.avif" alt="Inspiration 5" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
           <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500 flex items-center justify-center">
              <h3 className="text-white text-5xl font-black italic opacity-0 group-hover:opacity-100 transition-opacity duration-700 drop-shadow-2xl tracking-tighter">
                Dream Home
              </h3>
           </div>
        </div>

        {/* Column 4 */}
        <div className="flex flex-col gap-6 mt-12">
           <div className="relative h-1/3 w-full rounded-2xl overflow-hidden group">
              <Image src="/images/DinningRoom.png" alt="Inspiration 6" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
           </div>
           <div className="relative h-2/3 w-full rounded-2xl overflow-hidden group">
              <Image src="/images/about-hero.png" alt="Inspiration 7" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
           </div>
        </div>

        {/* Column 5 */}
        <div className="hidden lg:flex flex-col gap-6">
           <div className="relative h-1/2 w-full rounded-2xl overflow-hidden group">
              <Image src="/images/about-story.png" alt="Inspiration 8" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
           </div>
           <div className="relative h-1/2 w-full rounded-2xl overflow-hidden group">
              <Image src="/images/contact-hero.png" alt="Inspiration 9" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
           </div>
        </div>
      </div>
    </section>
  );
};

export default Inspiration;
