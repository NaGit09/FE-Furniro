/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export default function ScrollHandler() {
useEffect(() => {
  const lenis = new Lenis({
    autoRaf: true,
    anchors: {
      
      offset: 100,
      onComplete: () => {
        console.log("scrolled to anchor");
      },
    },
  });

  const handleScroll = (e: any) => {
  };

  lenis.on("scroll", handleScroll);

  return () => {
    lenis.off("scroll", handleScroll);
    lenis.destroy();
  };
}, []);

  return null;
}
