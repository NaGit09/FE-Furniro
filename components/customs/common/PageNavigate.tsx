import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const PageNavigate = ({
  title,
  category,
}: {
  title: string;
  category: string;
  id: number;
}) => {
  return (
    <div className="w-full bg-stone-100/40 dark:bg-stone-900/40 backdrop-blur-md border-b border-stone-200/25 dark:border-stone-800/25 py-4 md:py-5 flex items-center">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center gap-3 text-xs md:text-sm font-medium flex-wrap">
          <Link 
            href="/" 
            className="text-stone-500 dark:text-stone-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors duration-200 font-sans"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          
          <Link 
            href="/product" 
            className="text-stone-500 dark:text-stone-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors duration-200 font-sans"
          >
            {category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          
          <Separator orientation="vertical" className="h-4 bg-stone-300 dark:bg-stone-700 shrink-0" />
          
          <span 
            className="text-stone-800 dark:text-stone-100 font-bold font-heading truncate max-w-50 sm:max-w-xs md:max-w-sm"
          >
            {title}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageNavigate;
