import Image from "next/image";

const Vision = () => {
  return (
    <section className="container mx-auto px-4 py-12 mb-12 overflow-hidden max-w-7xl">
      <div className="relative h-87.5 md:h-100 w-full rounded-[40px] overflow-hidden group shadow-xl">
        <Image
          src="/images/about-vision.png"
          alt="Our Vision"
          fill
          sizes="(max-width: 640px) 100vw, 1000px"
          className="object-cover transition-transform duration-1000 group-hover:scale-108"
        />
        
        {/* Luxury Glassmorphic dark overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-stone-950/85 via-stone-900/40 to-transparent flex items-center justify-start p-8 sm:p-12 md:p-20">
          <div className="max-w-2xl transform transition-transform duration-700 group-hover:translate-x-3.5 flex flex-col items-start gap-4">
            
            {/* Title */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-white tracking-tight leading-none mb-2">
              Future of <span className="text-yellow-600 italic font-medium font-heading">Living</span>
            </h2>
            <div className="h-0.5 w-16 bg-yellow-600 rounded-full mb-2" />

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-stone-200 font-medium font-sans leading-relaxed max-w-md mb-4 drop-shadow-md">
              We envision a world where luxury is sustainable and your home reflects your truest self.
            </p>

            {/* Premium Button */}
            <button className="px-8 py-3.5 bg-white hover:bg-yellow-600 text-stone-950 hover:text-white rounded-full font-bold text-sm tracking-wide transition-all active:scale-95 shadow-lg transform hover:scale-105 cursor-pointer duration-300">
              Explore Our Collection
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
