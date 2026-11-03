import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { MathUtils } from 'three';
import { usePointerTarget } from './usePointerTarget.js';

const PIVOT_HEIGHT = 0.9;
const MAX_YAW = 0.5;
const MAX_PITCH = 0.16;
const FOLLOW_SMOOTHING = 4;
const FLOAT = { height: 0.025, speed: 1.3 };
const SWAY = { angle: 0.012, speed: 0.7 };
const LOOK_AROUND = { x: 0.6, y: 0.4, speedX: 0.35, speedY: 0.23 };

export default function Character({ url, animate = true, autoLook = false }) {
  const { scene } = useGLTF(url, false, true);
  const body = useRef();
  const canvas = useThree((state) => state.gl.domElement);
  const pointer = usePointerTarget(canvas);

  useFrame((state, delta) => {
    const group = body.current;
    if (!group || !animate) return;
    const time = state.clock.elapsedTime;
    const step = Math.min(delta, 0.1);
    const lookX = autoLook ? Math.sin(time * LOOK_AROUND.speedX) * LOOK_AROUND.x : pointer.current.x;
    const lookY = autoLook ? Math.sin(time * LOOK_AROUND.speedY) * LOOK_AROUND.y : pointer.current.y;
    group.rotation.y = MathUtils.damp(group.rotation.y, lookX * MAX_YAW, FOLLOW_SMOOTHING, step);
    group.rotation.x = MathUtils.damp(group.rotation.x, lookY * MAX_PITCH, FOLLOW_SMOOTHING, step);
    group.rotation.z = Math.sin(time * SWAY.speed) * SWAY.angle;
    group.position.y = PIVOT_HEIGHT + Math.sin(time * FLOAT.speed) * FLOAT.height;
  });

  return (
    <group ref={body} position={[0, PIVOT_HEIGHT, 0]}>
      <primitive object={scene} position={[0, -PIVOT_HEIGHT, 0]} />
    </group>
  );
}
