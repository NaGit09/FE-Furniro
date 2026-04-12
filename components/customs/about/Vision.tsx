import Image from "next/image";

const Vision = () => {
  return (
    <section className="container mx-auto px-4 py-24 mb-24 overflow-hidden">
      <div className="relative h-[600px] w-full rounded-[60px] overflow-hidden group shadow-2xl transition-all duration-1000 transform hover:skew-x-1">
        <Image
          src="/images/about-vision.png"
          alt="Our Vision"
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent flex items-center justify-start p-12 md:p-24">
          <div className="max-w-2xl transform transition-all duration-700 group-hover:translate-x-4">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 drop-shadow-xl italic">
              Future of <span className="text-yellow-600 drop-shadow-none">Living</span>
            </h2>
            <p className="text-xl md:text-2xl text-zinc-100 font-medium drop-shadow-lg max-w-lg leading-relaxed mb-8">
              We envision a world where luxury is sustainable and your home reflects your truest self.
            </p>
            <button className="bg-white text-black px-12 py-5 rounded-full font-bold text-xl transition-all duration-300 hover:bg-yellow-600 hover:text-white transform hover:scale-110 active:scale-95 shadow-xl">
              Explore Our Collection
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
