import { useEffect, useRef } from 'react';

const clamp = (value) => Math.max(-1, Math.min(1, value));

// Pointer position relative to the character's face on screen, in the range -1..1 on each axis.
// `face` is a ref holding the face position in screen pixels, kept up to date by the scene.
export function usePointerTarget(face) {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event) => {
      if (event.pointerType === 'touch') return;
      target.current.x = clamp((event.clientX - face.current.x) / (window.innerWidth / 2));
      target.current.y = clamp((event.clientY - face.current.y) / (window.innerHeight / 2));
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
  }, [face]);

  return target;
}
