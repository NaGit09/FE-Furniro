import React from "react";
import { Diamond, Flower2, HeartIcon, Zap } from "lucide-react";

const VALUES_DATA = [
  {
    icon: <Diamond />,
    title: "Premium Quality",
    description: "We use only the finest sustainably sourced materials for pieces that last a lifetime.",
  },
  {
    icon: <Zap />,
    title: "Eco-Friendly",
    description: "Sustainability is at the heart of our design. Our materials and processes protect nature.",
  },
  {
    icon: <HeartIcon />,
    title: "Timeless Design",
    description: "Elegant and functional. Our furniture transcends trends to bring beauty to any generation.",
  },
  {
    icon: <Flower2 />,
    title: "Exquisite Craft",
    description: "Hand-finished details by artisans who treat every piece like a work of art.",
  },
];

const Values = () => {
  return (
    <section className="bg-stone-100/50 dark:bg-stone-900/30 py-16 px-4 shadow-inner border-y border-stone-200/25 dark:border-stone-850/25">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700 flex flex-col gap-2 items-center">
          <h6 className="text-xs font-bold tracking-[0.25em] text-yellow-600 dark:text-yellow-500 uppercase">
            Furniro Creed
          </h6>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-stone-900 dark:text-stone-50 tracking-tight">
            Our Core Values
          </h2>
          <div className="h-0.5 w-16 bg-yellow-600 rounded-full mt-2" />
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {VALUES_DATA.map((value, index) => (
            <div 
              key={index} 
              className="p-6 md:p-8 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-850/40 rounded-[35px] shadow-sm transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] group hover:border-yellow-600/30 cursor-default animate-in fade-in slide-in-from-bottom-10"
            >
              {/* Dynamic Gold Shell */}
              <div className="w-12 h-12 rounded-2xl bg-yellow-600/10 dark:bg-yellow-600/15 border border-yellow-600/10 flex items-center justify-center mb-5 transition-all duration-500 group-hover:bg-yellow-600 group-hover:border-yellow-600 group-hover:shadow-[0_10px_25px_rgba(202,138,4,0.3)]">
                <div className="transition-transform duration-500 group-hover:rotate-12 text-yellow-600 group-hover:text-white">
                  {React.cloneElement(value.icon, {
                    className: "w-6 h-6 transition-colors duration-300",
                  })}
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-stone-900 dark:text-stone-50 font-heading italic group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors duration-300">
                {value.title}
              </h3>
              
              <p className="text-stone-500 dark:text-stone-400 font-medium leading-relaxed font-sans text-xs sm:text-sm">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;
