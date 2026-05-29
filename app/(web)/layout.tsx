import Header from "@/components/customs/common/UserLayout/Header";
import Footer from "@/components/customs/common/UserLayout/Footer";
import { Toaster } from "@/components/ui/sonner";

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen">{children}</div>
      <Footer />
      <Toaster richColors closeButton />
    </>
  );
}
