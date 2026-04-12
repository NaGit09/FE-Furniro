import { Diamond, Flower2, HeartIcon, Zap } from "lucide-react";

const VALUES_DATA = [
  {
    icon: <Diamond className="w-10 h-10 text-yellow-600 mb-6" />,
    title: "Premium Quality",
    description: "We use only the finest sustainably sourced materials for pieces that last a lifetime.",
    color: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: <Zap className="w-10 h-10 text-yellow-600 mb-6" />,
    title: "Eco-Friendly",
    description: "Sustainability is at the heart of our design. Our materials and processes protect nature.",
    color: "bg-green-50 dark:bg-green-900/20",
  },
  {
    icon: <HeartIcon className="w-10 h-10 text-yellow-600 mb-6" />,
    title: "Timeless Design",
    description: "Elegant and functional. Our furniture transcends trends to bring beauty to any generation.",
    color: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    icon: <Flower2 className="w-10 h-10 text-yellow-600 mb-6" />,
    title: "Exquisite Craft",
    description: "Hand-finished details by artisans who treat every piece like a work of art.",
    color: "bg-purple-50 dark:bg-purple-900/20",
  },
];

const Values = () => {
  return (
    <section className="bg-zinc-50 dark:bg-zinc-950 py-32 px-4 shadow-inner">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-zinc-900 dark:text-zinc-100">
            Our Core Values
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
            At Furniro, we stand for excellence in every detail. 
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {VALUES_DATA.map((value, index) => (
            <div 
              key={index} 
              className={`p-10 ${value.color} rounded-[40px] shadow-sm transition-all duration-500 hover:scale-[1.05] hover:shadow-xl group border border-transparent hover:border-yellow-200 cursor-default animate-in fade-in slide-in-from-bottom-10 delay-[${index * 150}ms]`}
            >
              <div className="transition-transform duration-500 group-hover:rotate-12">
                {value.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100 italic">
                {value.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
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
