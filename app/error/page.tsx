import type { Metadata } from "next";
import ErrorPageContent from "@/components/customs/common/ErrorPageContent";

export const metadata: Metadata = {
  title: "Error — Furniro",
  description:
    "An error was encountered during the request. Please review the details or try again.",
};

export default function ErrorPage() {
  return (
    <div className="flex flex-col min-h-[85vh] bg-zinc-50 dark:bg-black">
      <main className="w-full flex-grow">
        <ErrorPageContent />
      </main>
    </div>
  );
}
