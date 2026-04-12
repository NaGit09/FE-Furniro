import { Trophy, ShieldCheck, Truck, Headset } from "lucide-react";

const FEATURES_DATA = [
  {
    icon: <Trophy className="w-12 h-12 text-zinc-900 group-hover:text-yellow-600 transition-colors duration-300" />,
    title: "High Quality",
    description: "Crafted from top materials",
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-zinc-900 group-hover:text-yellow-600 transition-colors duration-300" />,
    title: "Warranty Protection",
    description: "Over 2 years support",
  },
  {
    icon: <Truck className="w-12 h-12 text-zinc-900 group-hover:text-yellow-600 transition-colors duration-300" />,
    title: "Free Shipping",
    description: "Order over $150",
  },
  {
    icon: <Headset className="w-12 h-12 text-zinc-900 group-hover:text-yellow-600 transition-colors duration-300" />,
    title: "24 / 7 Support",
    description: "Dedicated support team",
  },
];

const Features = () => {
  return (
    <section className="bg-[#FAF3EA] dark:bg-zinc-900 w-full py-20 px-4 mt-20">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {FEATURES_DATA.map((feature, index) => (
          <div 
            key={index}
            className="flex items-center gap-4 group transition-all duration-300 hover:-translate-y-2 cursor-pointer"
          >
            <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20 shadow-sm transform transition-transform group-hover:rotate-12">
              {feature.icon}
            </div>
            <div>
              <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{feature.title}</h4>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
