import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import Character from './Character.jsx';
import Lights from './Lights.jsx';
import FitCamera from './FitCamera.jsx';
import FrameThrottle from './FrameThrottle.jsx';
import { useInView } from '../hooks/useInView.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { useDeviceProfile } from '../hooks/useDeviceProfile.js';

const CAMERA = { fov: 35, near: 0.1, far: 50 };
const LOW_POWER_FPS = 30;

function ProgressReporter({ onProgress }) {
  const { progress, active } = useProgress();
  useEffect(() => {
    onProgress?.({ progress, loaded: !active && progress === 100 });
  }, [progress, active, onProgress]);
  return null;
}

export default function CharacterScene({ modelUrl, onProgress, onContextLost }) {
  const container = useRef(null);
  const inView = useInView(container);
  const reducedMotion = useReducedMotion();
  const { touch, lowPower } = useDeviceProfile();
  const animate = inView && !reducedMotion;

  return (
    <div ref={container} className="scene__canvas">
      <ProgressReporter onProgress={onProgress} />
      <Canvas
        dpr={lowPower ? [1, 1.25] : [1, 1.75]}
        frameloop={animate && !lowPower ? 'always' : 'demand'}
        camera={CAMERA}
        gl={{ antialias: !lowPower, alpha: true, powerPreference: lowPower ? 'default' : 'high-performance' }}
        onCreated={({ gl }) => gl.domElement.addEventListener('webglcontextlost', () => onContextLost?.(), { once: true })}
      >
        <FrameThrottle fps={LOW_POWER_FPS} active={animate && lowPower} />
        <FitCamera />
        <Lights />
        {modelUrl && (
          <Suspense fallback={null}>
            <Character url={modelUrl} animate={animate} autoLook={touch} />
          </Suspense>
        )}
      </Canvas>
    </div>
  );
}
