import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-stone-900 border-t border-black/10 dark:border-stone-800/60 pt-16 pb-8 mt-10">
      <div className="container mx-auto px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-black dark:text-stone-50 mb-4 font-sans">Furniro.</h2>
            <p className="text-[#9F9F9F] dark:text-stone-400 text-base leading-relaxed max-w-[280px]">
              400 University Drive Suite 200 Coral Gables,
              <br />
              FL 33134 USA
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col">
            <h4 className="text-[#9F9F9F] dark:text-stone-400 font-medium mb-10">Links</h4>
            <ul className="flex flex-col gap-8">
              <li>
                <Link href="/" className="text-black dark:text-stone-300 font-medium hover:text-gray-500 dark:hover:text-amber-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/product" className="text-black dark:text-stone-300 font-medium hover:text-gray-500 dark:hover:text-amber-500 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-black dark:text-stone-300 font-medium hover:text-gray-500 dark:hover:text-amber-500 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-black dark:text-stone-300 font-medium hover:text-gray-500 dark:hover:text-amber-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="flex flex-col">
            <h4 className="text-[#9F9F9F] dark:text-stone-400 font-medium mb-10">Help</h4>
            <ul className="flex flex-col gap-8">
              <li>
                <Link href="#" className="text-black dark:text-stone-300 font-medium hover:text-gray-500 dark:hover:text-amber-500 transition-colors">
                  Payment Options
                </Link>
              </li>
              <li>
                <Link href="#" className="text-black dark:text-stone-300 font-medium hover:text-gray-500 dark:hover:text-amber-500 transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="text-black dark:text-stone-300 font-medium hover:text-gray-500 dark:hover:text-amber-500 transition-colors">
                  Privacy Policies
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col">
            <h4 className="text-[#9F9F9F] dark:text-stone-400 font-medium mb-10">Newsletter</h4>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <input
                type="email"
                placeholder="Enter Your Email Address"
                className="w-full sm:w-[200px] border-b border-black dark:border-stone-600 text-sm pb-1 outline-none focus:border-gray-500 dark:focus:border-amber-500 transition-colors bg-transparent placeholder-[#9F9F9F] text-black dark:text-stone-100"
              />
              <button 
                type="button" 
                className="border-b border-black dark:border-stone-600 text-sm font-medium pb-1 uppercase hover:text-gray-500 dark:hover:text-amber-500 hover:border-gray-500 dark:hover:border-amber-500 transition-colors text-black dark:text-stone-200 cursor-pointer"
              >
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-black/10 dark:border-stone-800/60 pt-8">
          <p className="text-black dark:text-stone-400 font-medium">
            © 2023 furino. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
