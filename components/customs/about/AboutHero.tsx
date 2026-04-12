import Image from "next/image";

const AboutHero = () => {
  return (
    <div className="w-full h-[600px] relative overflow-hidden flex items-center justify-center">
      {/* Background Image with Overlay */}
      <Image
        src="/images/about-hero.png"
        alt="Furniro Showroom"
        fill
        priority
        className="object-cover z-0 brightness-75 transition-transform duration-1000 hover:scale-105"
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl">
          Crafting <span className="text-yellow-500">Comfort</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-100 font-medium max-w-2xl mx-auto drop-shadow-lg leading-relaxed">
          From our hands to your home. We believe every piece of furniture tells a unique story of elegance and warmth.
        </p>
      </div>
      
      {/* Decorative Gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-5" />
    </div>
  );
};

export default AboutHero;
