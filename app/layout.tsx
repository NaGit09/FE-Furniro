import type { Metadata } from "next";
import { Geist, Geist_Mono, Bodoni_Moda, Jost } from "next/font/google";
import "@/style/globals.css";
import StoreProvider from "./StoreProvider";
import ScrollHandler from "@/components/customs/common/SmoothScrollProvider";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Furniro",
  description:
    "Furniro — Premium Furniture for Modern Living & Sustainable Design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} 
                    ${geistMono.variable} 
                    ${bodoniModa.variable} 
                    ${jost.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ScrollHandler />
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
