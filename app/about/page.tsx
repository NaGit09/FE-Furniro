import { Metadata } from "next";
import AboutHero from "@/components/customs/about/AboutHero";
import OurStory from "@/components/customs/about/OurStory";
import Values from "@/components/customs/about/Values";
import Vision from "@/components/customs/about/Vision";

export const metadata: Metadata = {
  title: "About Us | Furniro - Crafting Comfort Since 1995",
  description: "Learn more about Furniro's history, mission, and our passion for creating premium, sustainable furniture for your home.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans">
      {/* Scroll indicator or other global elements can be here */}
      <main className="w-full flex flex-col gap-0">
        <AboutHero />
        <div className="w-full flex flex-col gap-32 sm:gap-40 md:gap-48 overflow-hidden pt-24 sm:pt-32">
          <OurStory />
          <Values />
          <Vision />
        </div>
      </main>
    </div>
  );
}
