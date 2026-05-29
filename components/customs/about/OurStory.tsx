import Image from "next/image";

const OurStory = () => {
  return (
    <section className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8 md:gap-14 overflow-hidden max-w-7xl">
      {/* Premium Framed Image Container */}
      <div className="w-full md:w-1/2 p-2.5 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md rounded-[35px] border border-stone-200/40 dark:border-stone-850/40 shadow-md group transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
        <div className="relative h-[320px] sm:h-[380px] w-full rounded-[25px] overflow-hidden">
          <Image
            src="/images/about-story.png"
            alt="Our Craftsmanship"
            fill
            sizes="(max-width: 640px) 100vw, 500px"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
          />
          <div className="absolute inset-0 bg-stone-950/5 group-hover:bg-transparent transition-all duration-500" />
        </div>
      </div>

      {/* Premium Text Container */}
      <div className="w-full md:w-1/2 flex flex-col gap-6 animate-in fade-in slide-in-from-right-10 duration-1000">
        <span className="text-yellow-600 dark:text-yellow-500 font-bold uppercase tracking-[0.2em] text-xs font-sans">
          Since 1995
        </span>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-stone-900 dark:text-stone-50 tracking-tight leading-[1.1]">
          Where Passion <br /> Meets <span className="text-yellow-600 italic font-medium font-heading">Precision</span>
        </h2>
        <div className="h-0.5 w-16 bg-yellow-600 rounded-full mt-1" />

        <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 font-medium leading-relaxed max-w-xl font-sans">
          It all started in a small workshop with a single bench and a deep resonance for wood. Furniro was born from the belief that furniture shouldn't just fill a space—it should inspire the people living in it.
        </p>
        
        <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 font-medium leading-relaxed max-w-xl font-sans">
          Every joint, every grain, and every polish is a testament to our dedication to traditional craftsmanship, infused with modern innovation. We don't just build furniture; we create heirlooms.
        </p>

        <div className="flex gap-3.5 items-center mt-2.5">
          <div className="h-0.5 w-10 bg-yellow-600 rounded-full" />
          <span className="text-stone-900 dark:text-stone-100 font-bold italic font-heading text-sm sm:text-base">
            Founder & Master Craftsman
          </span>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
