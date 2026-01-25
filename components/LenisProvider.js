"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";

const LenisContext = createContext({ lenis: null });

export function useLenis() {
  return useContext(LenisContext).lenis;
}

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      // Import GSAP only on client
      const gsapModule = await import("gsap");
      const stModule = await import("gsap/ScrollTrigger");

      const gsap = gsapModule.default;
      const ScrollTrigger = stModule.default;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        // tweak if you want
        duration: 1.2,
        smoothWheel: true,
        smoothTouch: false,
      });

      lenisRef.current = lenis;

      // Keep ScrollTrigger updated on Lenis scroll
      lenis.on("scroll", ScrollTrigger.update);

      // Use Lenis RAF loop
      const raf = (time) => {
        lenis.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      };
      rafIdRef.current = requestAnimationFrame(raf);

      // Tell ScrollTrigger to use the real scroll position (Lenis is virtual)
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
          if (typeof value === "number")
            lenis.scrollTo(value, { immediate: true });
          return lenis.scroll?.value ?? window.scrollY;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        // pinType is important for mobile/some layouts
        pinType: document.body.style.transform ? "transform" : "fixed",
      });

      // Refresh after setup
      ScrollTrigger.addEventListener("refresh", () => lenis.resize());
      ScrollTrigger.refresh();

      if (!mounted) {
        lenis.destroy();
      }
    })();

    return () => {
      mounted = false;

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </LenisContext.Provider>
  );
}

// "use client";

// import { useEffect, useRef } from "react";
// import Lenis from "lenis";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";

// export default function LenisProvider({ children }: { children: React.ReactNode }) {
//   const rafRef = useRef<number | null>(null);

//   useEffect(() => {
//     gsap.registerPlugin(ScrollTrigger);

//     const lenis = new Lenis();

//     lenis.on("scroll", ScrollTrigger.update);

//     const raf = (time: number) => {
//       lenis.raf(time);
//       rafRef.current = requestAnimationFrame(raf);
//     };
//     rafRef.current = requestAnimationFrame(raf);

//     // Optional: keep GSAP ticker in sync (some setups prefer this)
//     // gsap.ticker.add((time) => lenis.raf(time * 1000));
//     // gsap.ticker.lagSmoothing(0);

//     return () => {
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//       lenis.destroy();
//     };
//   }, []);

//   return <>{children}</>;
// }
