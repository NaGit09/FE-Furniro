import React from "react";
import { Diamond, Flower2, HeartIcon, Zap } from "lucide-react";
import ValueItem from "./ValueItem";

const VALUES_DATA = [
  {
    icon: <Diamond />,
    title: "Premium Quality",
    description:
      "We use only the finest sustainably sourced materials for pieces that last a lifetime.",
  },
  {
    icon: <Zap />,
    title: "Eco-Friendly",
    description:
      "Sustainability is at the heart of our design. Our materials and processes protect nature.",
  },
  {
    icon: <HeartIcon />,
    title: "Timeless Design",
    description:
      "Elegant and functional. Our furniture transcends trends to bring beauty to any generation.",
  },
  {
    icon: <Flower2 />,
    title: "Exquisite Craft",
    description:
      "Hand-finished details by artisans who treat every piece like a work of art.",
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
            <ValueItem key={index} value={value} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;
