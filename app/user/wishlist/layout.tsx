import Header from "@/components/customs/common/UserLayout/Header";
import Footer from "@/components/customs/common/UserLayout/Footer";
import { Toaster } from "@/components/ui/sonner";

export default function WishlistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950 pt-20">
        {children}
      </div>
      <Footer />
      <Toaster richColors closeButton />
    </>
  );
}
