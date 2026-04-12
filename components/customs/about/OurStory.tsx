import Image from "next/image";

const OurStory = () => {
  return (
    <section className="container mx-auto px-4 py-24 flex flex-col md:flex-row items-center gap-16 overflow-hidden">
      {/* Image Container */}
      <div className="w-full md:w-1/2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <Image
          src="/images/about-story.png"
          alt="Our Craftsmanship"
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-yellow-900/10 transition-all duration-500 group-hover:bg-transparent" />
      </div>

      {/* Text Container */}
      <div className="w-full md:w-1/2 flex flex-col gap-8 animate-in fade-in slide-in-from-right-10 duration-1000">
        <span className="text-yellow-600 font-bold uppercase tracking-widest text-sm">
          Since 1995
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight">
          Where Passion <br /> Meets <span className="text-yellow-800">Precision</span>
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
          It all started in a small workshop with a single bench and a deep resonance for wood. Furniro was born from the belief that furniture shouldn't just fill a space—it should inspire the people living in it.
        </p>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
          Every joint, every grain, and every polish is a testament to our dedication to traditional craftsmanship, infused with modern innovation. We don't just build furniture; we create heirlooms.
        </p>
        <div className="flex gap-4 items-center mt-4">
          <div className="h-[2px] w-12 bg-yellow-600" />
          <span className="text-zinc-900 dark:text-zinc-100 font-bold italic">
            Founder & Master Craftsman
          </span>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
