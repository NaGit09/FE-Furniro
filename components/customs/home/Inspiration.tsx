import Image from "next/image";

const Inspiration = () => {
  return (
    <section className="container mx-auto px-4 py-28 w-full max-w-7xl">
      {/* Header */}
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-5 duration-800 flex flex-col gap-2.5 items-center">
        <h6 className="text-xs font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-[0.25em]">
          Lifestyle Stories
        </h6>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-stone-900 dark:text-stone-50 tracking-tight italic">
          #Furniro<span className="text-yellow-600 not-italic">Furniture</span>
        </h2>
        <div className="h-0.5 w-16 bg-yellow-600 rounded-full mt-1.5" />
      </div>

      {/* Modern Collage Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 h-[720px] overflow-hidden">
        {/* Column 1 */}
        <div className="flex flex-col gap-6">
          <div className="relative h-1/2 w-full rounded-[25px] overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500">
            <Image src="/images/LivingRoom.png" alt="Living Room Comfort" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-108" />
            <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-xs font-bold bg-white/80 dark:bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-stone-900 dark:text-stone-50 border border-white/20 dark:border-stone-800/30 shadow-md">
                #livingroom
              </span>
            </div>
          </div>
          <div className="relative h-1/2 w-full rounded-[25px] overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500">
            <Image src="/images/about-vision.png" alt="Sustainable Design" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-108" />
            <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-xs font-bold bg-white/80 dark:bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-stone-900 dark:text-stone-50 border border-white/20 dark:border-stone-800/30 shadow-md">
                #vision
              </span>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-6 -mt-12">
          <div className="relative h-2/3 w-full rounded-[25px] overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500">
            <Image src="/images/background.png" alt="Modern Interiors" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-108" />
            <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-xs font-bold bg-white/80 dark:bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-stone-900 dark:text-stone-50 border border-white/20 dark:border-stone-800/30 shadow-md">
                #modernspace
              </span>
            </div>
          </div>
          <div className="relative h-1/3 w-full rounded-[25px] overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500">
            <Image src="/images/BedRoom.png" alt="Cosy Bedroom" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-108" />
            <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-xs font-bold bg-white/80 dark:bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-stone-900 dark:text-stone-50 border border-white/20 dark:border-stone-800/30 shadow-md">
                #cosyrest
              </span>
            </div>
          </div>
        </div>

        {/* Column 3 - Centerpiece */}
        <div className="col-span-2 relative h-full w-full rounded-[35px] overflow-hidden group shadow-2xl border border-white/10">
          <Image src="/images/background_furniro.avif" alt="Premium Designer Collection" fill className="object-cover transition-transform duration-1000 ease-out group-hover:scale-108" />
          <div className="absolute inset-0 bg-stone-950/30 group-hover:bg-stone-950/40 transition-all duration-500 flex flex-col justify-end p-8 md:p-12">
            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out flex flex-col gap-2 items-start">
              <span className="text-xs font-bold bg-yellow-600 text-white px-4 py-1.5 rounded-full shadow-lg">
                Milanese Collection
              </span>
              <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold font-heading italic drop-shadow-lg tracking-tight">
                Sustainable Luxury
              </h3>
              <p className="text-sm font-medium text-stone-200/90 dark:text-stone-300 max-w-sm font-sans drop-shadow-md leading-relaxed">
                Experience high-end design crafted for absolute durability, luxury comfort, and timeless home style.
              </p>
            </div>
          </div>
        </div>

        {/* Column 4 */}
        <div className="flex flex-col gap-6 mt-12">
          <div className="relative h-1/3 w-full rounded-[25px] overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500">
            <Image src="/images/DinningRoom.png" alt="Dining Craft" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-108" />
            <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-xs font-bold bg-white/80 dark:bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-stone-900 dark:text-stone-50 border border-white/20 dark:border-stone-800/30 shadow-md">
                #diningtable
              </span>
            </div>
          </div>
          <div className="relative h-2/3 w-full rounded-[25px] overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500">
            <Image src="/images/about-hero.png" alt="Craftsmanship Story" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-108" />
            <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-xs font-bold bg-white/80 dark:bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-stone-900 dark:text-stone-50 border border-white/20 dark:border-stone-800/30 shadow-md">
                #story
              </span>
            </div>
          </div>
        </div>

        {/* Column 5 */}
        <div className="hidden lg:flex flex-col gap-6">
          <div className="relative h-1/2 w-full rounded-[25px] overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500">
            <Image src="/images/about-story.png" alt="Design Process" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-108" />
            <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-xs font-bold bg-white/80 dark:bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-stone-900 dark:text-stone-50 border border-white/20 dark:border-stone-800/30 shadow-md">
                #workspace
              </span>
            </div>
          </div>
          <div className="relative h-1/2 w-full rounded-[25px] overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500">
            <Image src="/images/contact-hero.png" alt="Furniro Lifestyle" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-108" />
            <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-xs font-bold bg-white/80 dark:bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-stone-900 dark:text-stone-50 border border-white/20 dark:border-stone-800/30 shadow-md">
                #lifestyle
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Inspiration;
