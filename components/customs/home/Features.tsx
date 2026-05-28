import { Trophy, ShieldCheck, Truck, Headset } from "lucide-react";

const FEATURES_DATA = [
  {
    Icon: Trophy,
    title: "High Quality",
    description: "Crafted from top materials",
  },
  {
    Icon: ShieldCheck,
    title: "Warranty Protection",
    description: "Over 2 years support",
  },
  {
    Icon: Truck,
    title: "Free Shipping",
    description: "Order over $150",
  },
  {
    Icon: Headset,
    title: "24 / 7 Support",
    description: "Dedicated support team",
  },
];

const Features = () => {
  return (
    <section className="w-full px-4 max-w-7xl mx-auto">
      {/* Floating Glassmorphic Deck */}
      <div className="w-full bg-white/70 dark:bg-stone-900/75 backdrop-blur-2xl rounded-[35px] border border-white/40 dark:border-stone-800/50 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] py-10 px-8 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {FEATURES_DATA.map((feature, index) => {
            const Icon = feature.Icon;
            return (
              <div 
                key={index}
                className="flex items-center gap-5 group transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Icon Container with subtle morphing glow */}
                <div className="p-3.5 rounded-2xl bg-yellow-600/10 dark:bg-yellow-600/15 border border-yellow-600/10 transition-all duration-500 group-hover:bg-yellow-600 group-hover:border-yellow-600 group-hover:shadow-[0_10px_25px_rgba(202,138,4,0.3)]">
                  <div className="transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-105">
                    <Icon className="w-10 h-10 text-yellow-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-lg font-bold font-sans text-stone-900 dark:text-stone-50 tracking-tight group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
