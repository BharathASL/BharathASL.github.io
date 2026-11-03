import { lazy, Suspense, useCallback, useState } from 'react';

const CharacterScene = lazy(() => import('./three/CharacterScene.jsx'));

export default function App() {
  const [scene, setScene] = useState({ progress: 0, loaded: false });
  const handleProgress = useCallback((state) => setScene(state), []);

  return (
    <main className="placeholder">
      <div className="placeholder__text">
        <h1>Bharath S</h1>
        <p>Portfolio v2 is under construction.</p>
        <p className="placeholder__status" aria-live="polite">
          {scene.loaded ? '3D scene ready' : `Loading 3D scene… ${Math.round(scene.progress)}%`}
        </p>
      </div>
      <div className="scene" aria-hidden="true">
        <Suspense fallback={null}>
          <CharacterScene onProgress={handleProgress} />
        </Suspense>
      </div>
    </main>
  );
}
