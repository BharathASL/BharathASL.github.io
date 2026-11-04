import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { computeRig } from './scrollRig.js';

// Places its children on screen from the page layout and scroll position (see scrollRig.js).
export default function ScrollRig({ hero, about, motion, face, onVisibleChange, children }) {
  const group = useRef();
  const visible = useRef(null);
  const invalidate = useThree((state) => state.invalidate);

  // In on-demand mode nothing redraws by itself, so redraw whenever the page scrolls or resizes.
  useEffect(() => {
    window.addEventListener('scroll', invalidate, { passive: true });
    window.addEventListener('resize', invalidate);
    return () => {
      window.removeEventListener('scroll', invalidate);
      window.removeEventListener('resize', invalidate);
    };
  }, [invalidate]);

  useFrame((state) => {
    if (!hero || !group.current) return;
    const rig = computeRig({ hero, about, viewport: state.size, fov: state.camera.fov, motion });
    group.current.position.set(rig.x, rig.y, 0);
    group.current.scale.setScalar(rig.scale);
    group.current.rotation.set(rig.rotationX, rig.rotationY, 0);
    face.current = rig.face;
    if (visible.current !== rig.visible) {
      visible.current = rig.visible;
      onVisibleChange?.(rig.visible);
    }
  });

  return <group ref={group}>{children}</group>;
}
