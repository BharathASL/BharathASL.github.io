import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export default function FrameThrottle({ fps, active }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => invalidate(), 1000 / fps);
    return () => clearInterval(id);
  }, [fps, active, invalidate]);

  return null;
}
