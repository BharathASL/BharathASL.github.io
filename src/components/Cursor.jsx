import { useEffect, useRef } from 'react';
import { gsap } from '../motion/gsap.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import './Cursor.css';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const INTERACTIVE = 'a[href], button, [role="button"], label, summary, [data-cursor="hover"]';
const TEXT_ENTRY = 'input, textarea, select, [contenteditable="true"]';
const MAGNET = { strength: 0.3, max: 10 };

export default function Cursor() {
  const finePointer = useMediaQuery(FINE_POINTER);
  const reducedMotion = useReducedMotion();
  const enabled = finePointer && !reducedMotion;
  const root = useRef(null);
  const ring = useRef(null);
  const dot = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const html = document.documentElement;
    html.classList.add('has-custom-cursor');
    gsap.set([ring.current, dot.current], { xPercent: -50, yPercent: -50 });
    const ringX = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' });
    const ringY = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' });
    const dotX = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' });
    const dotY = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' });
    let magnet = null;
    const setState = (name, on) => root.current?.classList.toggle(name, on);

    const releaseMagnet = () => {
      if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      magnet = null;
    };

    const onMove = (event) => {
      if (event.pointerType !== 'mouse') return;
      setState('is-visible', true);
      ringX(event.clientX);
      ringY(event.clientY);
      dotX(event.clientX);
      dotY(event.clientY);

      const target = event.target instanceof Element ? event.target : null;
      setState('is-hover', Boolean(target?.closest(INTERACTIVE)));
      setState('is-hidden', Boolean(target?.closest(`${TEXT_ENTRY}, [data-cursor="hide"]`)));

      const magnetic = target?.closest('[data-magnetic]');
      if (magnetic !== magnet) releaseMagnet();
      if (magnetic) {
        magnet = magnetic;
        const rect = magnetic.getBoundingClientRect();
        const pull = (offset) => gsap.utils.clamp(-MAGNET.max, MAGNET.max, offset * MAGNET.strength);
        gsap.to(magnetic, {
          x: pull(event.clientX - (rect.left + rect.width / 2)),
          y: pull(event.clientY - (rect.top + rect.height / 2)),
          duration: 0.3,
          ease: 'power3',
        });
      }
    };
    const onLeaveWindow = (event) => {
      if (event.relatedTarget) return;
      setState('is-visible', false);
      releaseMagnet();
    };
    const onDown = () => setState('is-pressed', true);
    const onUp = () => setState('is-pressed', false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseout', onLeaveWindow);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      html.classList.remove('has-custom-cursor');
      releaseMagnet();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseout', onLeaveWindow);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={root} className="cursor" aria-hidden="true">
      <div ref={ring} className="cursor__ring" />
      <div ref={dot} className="cursor__dot" />
    </div>
  );
}
