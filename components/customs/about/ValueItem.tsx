import React from "react";

interface ValueItemProps {
  value: {
    icon: React.ReactElement;
    title: string;
    description: string;
  };
}
const ValueItem = ({ value }: ValueItemProps) => {
  return (
    <div className="p-6 md:p-8 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-850/40 rounded-[35px] shadow-sm transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] group hover:border-yellow-600/30 cursor-default animate-in fade-in slide-in-from-bottom-10">
      {/* Dynamic Gold Shell */}
      <div className="w-12 h-12 rounded-2xl bg-yellow-600/10 dark:bg-yellow-600/15 border border-yellow-600/10 flex items-center justify-center mb-5 transition-all duration-500 group-hover:bg-yellow-600 group-hover:border-yellow-600 group-hover:shadow-[0_10px_25px_rgba(202,138,4,0.3)]">
        <div className="transition-transform duration-500 group-hover:rotate-12 text-yellow-600 group-hover:text-white">
          {React.cloneElement(
            value.icon as React.ReactElement<{ className?: string }>,
            {
              className: "w-6 h-6 transition-colors duration-300",
            },
          )}
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold mb-3 text-stone-900 dark:text-stone-50 font-heading italic group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors duration-300">
        {value.title}
      </h3>

      <p className="text-stone-500 dark:text-stone-400 font-medium leading-relaxed font-sans text-xs sm:text-sm">
        {value.description}
      </p>
    </div>
  );
};

export default ValueItem;
