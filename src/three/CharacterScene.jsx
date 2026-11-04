import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import Character from './Character.jsx';
import Lights from './Lights.jsx';
import ScrollRig from './ScrollRig.jsx';
import FrameThrottle from './FrameThrottle.jsx';
import { CAMERA_DISTANCE } from './scrollRig.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { useDeviceProfile } from '../hooks/useDeviceProfile.js';

// A narrow field of view keeps the character from looking stretched near the screen edges.
const CAMERA = { fov: 22, near: 0.1, far: 50, position: [0, 0, CAMERA_DISTANCE] };
const LOW_POWER_FPS = 30;

function ProgressReporter({ onProgress }) {
  const { progress, active } = useProgress();
  useEffect(() => {
    onProgress?.({ progress, loaded: !active && progress === 100 });
  }, [progress, active, onProgress]);
  return null;
}

// Full-screen canvas behind the page. The character follows the hero box and the About space as you scroll.
export default function CharacterScene({ modelUrl, hero, about, onProgress, onContextLost }) {
  const reducedMotion = useReducedMotion();
  const { touch, lowPower } = useDeviceProfile();
  const [onScreen, setOnScreen] = useState(true);
  const faceRef = useRef({ x: 0, y: 0 });
  const animate = onScreen && !reducedMotion;

  return (
    <div className="scene-layer__canvas">
      <ProgressReporter onProgress={onProgress} />
      <Canvas
        dpr={lowPower ? [1, 1.25] : [1, 1.5]}
        frameloop={animate && !lowPower ? 'always' : 'demand'}
        camera={CAMERA}
        gl={{ antialias: !lowPower, alpha: true, powerPreference: lowPower ? 'default' : 'high-performance' }}
        onCreated={({ gl }) =>
          gl.domElement.addEventListener('webglcontextlost', () => onContextLost?.(), { once: true })
        }
      >
        <FrameThrottle fps={LOW_POWER_FPS} active={animate && lowPower} />
        <Lights />
        {modelUrl && (
          <ScrollRig hero={hero} about={about} motion={!reducedMotion} faceRef={faceRef} onVisibleChange={setOnScreen}>
            <Suspense fallback={null}>
              <Character url={modelUrl} faceRef={faceRef} animate={animate} autoLook={touch} />
            </Suspense>
          </ScrollRig>
        )}
      </Canvas>
    </div>
  );
}
