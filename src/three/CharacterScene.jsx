import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import Character from './Character.jsx';
import Lights from './Lights.jsx';
import FitCamera from './FitCamera.jsx';

const CAMERA = { fov: 35, near: 0.1, far: 50 };

function ProgressReporter({ onProgress }) {
  const { progress, active } = useProgress();
  useEffect(() => {
    onProgress?.({ progress, loaded: !active && progress === 100 });
  }, [progress, active, onProgress]);
  return null;
}

export default function CharacterScene({ onProgress }) {
  return (
    <>
      <ProgressReporter onProgress={onProgress} />
      <Canvas
        dpr={[1, 1.75]}
        frameloop="demand"
        camera={CAMERA}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <FitCamera />
        <Lights />
        <Suspense fallback={null}>
          <Character />
        </Suspense>
      </Canvas>
    </>
  );
}
