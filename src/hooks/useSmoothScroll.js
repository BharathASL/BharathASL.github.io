import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger } from '../motion/gsap.js';
import { setSmoothScroller } from '../motion/scroll.js';

const easeOutExpo = (t) => Math.min(1, 1.001 - 2 ** (-10 * t));

// Lenis smooths wheel scrolling; GSAP's ticker drives it so ScrollTrigger reads the same frame.
export function useSmoothScroll({ enabled, paused }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const lenis = new Lenis({
      duration: 1.2,
      easing: easeOutExpo,
      anchors: true,
    });
    lenisRef.current = lenis;
    setSmoothScroller(lenis);

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      setSmoothScroller(null);
    };
  }, [enabled]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (paused) lenis.stop();
    else lenis.start();
  }, [paused, enabled]);
}
