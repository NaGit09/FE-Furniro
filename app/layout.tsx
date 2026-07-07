import type { Metadata } from "next";
import { Geist, Geist_Mono, Bodoni_Moda, Jost } from "next/font/google";
import "@/style/globals.css";
import StoreProvider from "./StoreProvider";
import ScrollHandler from "@/components/customs/common/SmoothScrollProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/customs/common/LanguageContext";

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
  metadataBase: new URL("https://furniro.com"),
  title: {
    template: "%s | Furniro",
    default: "Furniro — Premium Furniture & Handcrafted Sustainable Design",
  },
  description:
    "Furniro offers high-end, sustainable timber furniture designed in Milan and handcrafted to elevate modern living spaces. Shop tables, chairs, sofas, and custom decor.",
  keywords: [
    "furniture",
    "sustainable design",
    "timber furniture",
    "modern living",
    "luxury furniture",
    "interior design",
    "handcrafted chairs",
    "premium dining tables",
    "Furniro Milan",
  ],
  authors: [{ name: "Furniro Team" }],
  creator: "Furniro",
  publisher: "Furniro",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://furniro.com",
    title: "Furniro — Premium Furniture & Handcrafted Sustainable Design",
    description:
      "Furniro offers high-end, sustainable timber furniture designed in Milan and handcrafted to elevate modern living spaces.",
    siteName: "Furniro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Furniro Premium Furniture Catalog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Furniro — Premium Furniture & Handcrafted Sustainable Design",
    description:
      "Furniro offers high-end, sustainable timber furniture designed in Milan and handcrafted to elevate modern living spaces.",
    images: ["/og-image.jpg"],
    creator: "@furniro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
          <LanguageProvider>
            <ScrollHandler />
            <StoreProvider>{children}</StoreProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
