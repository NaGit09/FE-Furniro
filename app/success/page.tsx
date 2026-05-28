import type { Metadata } from "next";
import SuccessPageContent from "@/components/customs/common/SuccessPageContent";

export const metadata: Metadata = {
  title: "Success — Furniro",
  description:
    "Your action was successfully completed. Thank you for choosing Furniro premium furniture collections.",
};

export default function SuccessPage() {
  return (
    <div className="flex flex-col min-h-[85vh] bg-zinc-50 dark:bg-black">
      <main className="w-full grow">
        <SuccessPageContent />
      </main>
    </div>
  );
}
