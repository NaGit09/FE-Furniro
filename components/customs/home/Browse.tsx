import Image from "next/image";
import React from "react";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    id: 1,
    src: "/images/LivingRoom.png",
    title: "Living Room",
    description: "Elegant designs crafted for warmth & comfort.",
  },
  {
    id: 2,
    src: "/images/BedRoom.png",
    title: "Bedroom",
    description: "Serene, minimalist spaces for deep rest.",
  },
  {
    id: 3,
    src: "/images/DinningRoom.png",
    title: "Dining Room",
    description: "Sustainable timber craftsmanship to gather around.",
  },
];

const Browse = () => {
  return (
    <div className="flex flex-col gap-14 items-center justify-center w-full bg-transparent">
      {/* Category Header */}
      <div className="flex flex-col gap-3 items-center text-center px-4 animate-in fade-in slide-in-from-bottom-5 duration-800">
        <h6 className="text-xs font-bold tracking-[0.25em] text-yellow-600 dark:text-yellow-500 uppercase">
          Curated Spaces
        </h6>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-stone-900 dark:text-stone-50 tracking-tight">
          Browse Categories
        </h2>
        <div className="h-0.5 w-16 bg-yellow-600 rounded-full mt-1" />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full max-w-7xl px-4 justify-center">
        {categories.map((category) => (
          <div
            key={category.id}
            className="group flex flex-col gap-4 bg-white/50 dark:bg-stone-900/30 backdrop-blur-md border border-stone-200/40 dark:border-stone-800/40 rounded-[35px] p-4.5 shadow-md hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-500 cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[25px]">
              <Image
                src={category.src}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              {/* Subtle Overlay on Hover */}
              <div className="absolute inset-0 bg-stone-950/10 group-hover:bg-stone-950/20 transition-all duration-500" />
              
              {/* Arrow Up-Right Indicator */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 dark:bg-stone-950/80 backdrop-blur-md flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-md">
                <ArrowUpRight className="w-5 h-5 text-stone-900 dark:text-stone-100" />
              </div>
            </div>

            {/* Info Container */}
            <div className="flex flex-col gap-1.5 px-3 pb-3">
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-stone-900 dark:text-stone-50 tracking-tight group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors duration-300">
                {category.title}
              </h3>
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Browse;
