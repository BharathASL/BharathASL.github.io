import { useEffect, useRef } from 'react';

const clamp = (value) => Math.max(-1, Math.min(1, value));

// Pointer position relative to the character's face on screen, in the range -1..1 on each axis.
export function usePointerTarget(element, faceHeight = 0.25) {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event) => {
      if (event.pointerType === 'touch') return;
      const rect = element.getBoundingClientRect();
      const faceX = rect.left + rect.width / 2;
      const faceY = rect.top + rect.height * faceHeight;
      target.current.x = clamp((event.clientX - faceX) / (window.innerWidth / 2));
      target.current.y = clamp((event.clientY - faceY) / (window.innerHeight / 2));
    };
    const onLeave = (event) => {
      if (event.relatedTarget) return;
      target.current.x = 0;
      target.current.y = 0;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseout', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseout', onLeave);
    };
  }, [element, faceHeight]);

  return target;
}
