import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import CharacterFallback from './components/CharacterFallback.jsx';
import Loader from './components/Loader.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import { followSystemTheme } from './theme/theme.js';
import Section from './components/layout/Section.jsx';
import { useDownload } from './hooks/useDownload.js';
import { supportsWebGL } from './utils/webgl.js';
import { CHARACTER_MODEL_URL } from './utils/assets.js';
import { profile } from './data/profile.js';

const CharacterScene = lazy(() => import('./three/CharacterScene.jsx'));
const DOWNLOAD_SHARE = 95;

export default function App() {
  const [use3d, setUse3d] = useState(supportsWebGL);
  const [sceneReady, setSceneReady] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [introReady, setIntroReady] = useState(false);
  const model = useDownload(CHARACTER_MODEL_URL, { enabled: use3d, type: 'model/gltf-binary' });

  const showFallback = useCallback(() => setUse3d(false), []);
  const handleProgress = useCallback(({ loaded }) => setSceneReady(loaded), []);
  const startIntro = useCallback(() => setIntroReady(true), []);
  const hideLoader = useCallback(() => setLoaderVisible(false), []);

  useEffect(() => {
    if (model.error) showFallback();
  }, [model.error, showFallback]);

  useEffect(() => followSystemTheme(), []);

  const loaded = !use3d || sceneReady;
  const progress = loaded ? 100 : model.progress * DOWNLOAD_SHARE;

  return (
    <>
      {loaderVisible && (
        <Loader name={profile.name} progress={progress} loaded={loaded} onExitStart={startIntro} onDone={hideLoader} />
      )}
      <header className="temp-toolbar" inert={!introReady}>
        <ThemeToggle />
      </header>
      <main inert={!introReady} className={introReady ? 'is-ready' : undefined}>
        <Section className="placeholder" labelledBy="intro-title">
          <div className="split">
            <div className="placeholder__text stack">
              <p className="text-label">{profile.role}</p>
              <h1 id="intro-title" className="text-display">
                {profile.name}
              </h1>
              <p className="text-lead">{profile.tagline}</p>
            </div>
            <div className="scene" aria-hidden="true">
              {use3d ? (
                <ErrorBoundary fallback={<CharacterFallback />} onError={showFallback}>
                  <Suspense fallback={null}>
                    <CharacterScene
                      modelUrl={model.objectUrl}
                      onProgress={handleProgress}
                      onContextLost={showFallback}
                    />
                  </Suspense>
                </ErrorBoundary>
              ) : (
                <CharacterFallback />
              )}
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
