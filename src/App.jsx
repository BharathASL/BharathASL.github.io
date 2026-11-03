import { lazy, Suspense, useCallback, useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import CharacterFallback from './components/CharacterFallback.jsx';
import Section from './components/layout/Section.jsx';
import { supportsWebGL } from './utils/webgl.js';
import { profile } from './data/profile.js';

const CharacterScene = lazy(() => import('./three/CharacterScene.jsx'));
const LOADED = { progress: 100, loaded: true };

export default function App() {
  const [use3d, setUse3d] = useState(supportsWebGL);
  const [scene, setScene] = useState(() => (use3d ? { progress: 0, loaded: false } : LOADED));
  const handleProgress = useCallback((state) => setScene(state), []);
  const showFallback = useCallback(() => {
    setUse3d(false);
    setScene(LOADED);
  }, []);

  return (
    <main>
      <Section className="placeholder" labelledBy="intro-title">
        <div className="split">
          <div className="placeholder__text stack">
            <p className="text-label">{profile.role}</p>
            <h1 id="intro-title" className="text-display">
              {profile.name}
            </h1>
            <p className="text-lead">{profile.tagline}</p>
            <p className="placeholder__status text-small" aria-live="polite">
              {scene.loaded ? '3D scene ready' : `Loading 3D scene… ${Math.round(scene.progress)}%`}
            </p>
          </div>
          <div className="scene" aria-hidden="true">
            {use3d ? (
              <ErrorBoundary fallback={<CharacterFallback />} onError={showFallback}>
                <Suspense fallback={null}>
                  <CharacterScene onProgress={handleProgress} onContextLost={showFallback} />
                </Suspense>
              </ErrorBoundary>
            ) : (
              <CharacterFallback />
            )}
          </div>
        </div>
      </Section>
    </main>
  );
}
