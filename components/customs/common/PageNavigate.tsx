import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const PageNavigate = ({
  title,
  category,
  id,
}: {
  title: string;
  category: string;
  id: number;
}) => {
  return (
    <div className="h-[100px] w-full bg-amber-50 flex items-center justify-start">
      <div className="flex items-center gap-2 ml-20 justify-center">
        <Link href="/" className="text-gray-500">Home</Link>
        <ChevronRight />
        <Link href="/product" className="text-gray-500">{category}</Link>
        <ChevronRight />
        <Separator orientation="vertical" />
        <Link href={`/product/${id}`} className="text-gray-500">{title}</Link>
      </div>
    </div>
  );
};

export default PageNavigate;
