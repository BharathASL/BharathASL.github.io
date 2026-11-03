import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';

const SUBJECT = { width: 1.85, height: 1.95, centerY: 0.92 };

export default function FitCamera() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    const halfFov = Math.tan((camera.fov * Math.PI) / 360);
    const aspect = size.width / size.height;
    const fitHeight = SUBJECT.height / 2 / halfFov;
    const fitWidth = SUBJECT.width / 2 / (halfFov * aspect);
    camera.position.set(0, SUBJECT.centerY + 0.15, Math.max(fitHeight, fitWidth));
    camera.lookAt(0, SUBJECT.centerY, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, invalidate]);

  return null;
}
