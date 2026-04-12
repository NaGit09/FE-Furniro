"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, Search, ShoppingCart, UserRound, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`w-full h-24 fixed top-0 left-0 z-50 flex items-center justify-center transition-all duration-500 ${
        isScrolled 
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-lg h-20" 
          : "bg-transparent h-24"
      }`}
    >
      <div className="w-full max-w-[1440px] px-8 md:px-20 flex justify-between items-center bg-white">
        {/* Logo & Brand Name */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-12 h-12 overflow-hidden transform group-hover:rotate-360 transition-transform duration-1000">
               <Image src="/images/logo.png" alt="Furniro Logo" fill className="object-contain" />
            </div>
            <span className="text-3xl font-black italic tracking-tighter text-zinc-900 dark:text-white">
              Furniro
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {["Home", "Product", "About", "Contact"].map((item) => (
              <li key={item}>
                <Link 
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="text-zinc-900 dark:text-zinc-100 font-bold text-lg hover:text-yellow-600 transition-colors relative group py-2"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-600 transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Feature Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/user/login">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-yellow-50 dark:hover:bg-zinc-800 transition-all hover:scale-110">
              <LogIn className="w-6 h-6" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-yellow-50 dark:hover:bg-zinc-800 transition-all hover:scale-110">
            <Search className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full hover:bg-yellow-50 dark:hover:bg-zinc-800 transition-all hover:scale-110">
            <Heart className="w-6 h-6" />
          </Button>
          <div className="relative">
             <Button variant="ghost" size="icon" className="rounded-full bg-zinc-900 text-white hover:bg-yellow-600 transition-all hover:scale-110 shadow-lg">
               <ShoppingCart className="w-6 h-6" />
             </Button>
             <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-600 text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-black animate-bounce">
               0
             </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
