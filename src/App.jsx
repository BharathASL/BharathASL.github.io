import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import CharacterFallback from './components/CharacterFallback.jsx';
import Loader from './components/Loader.jsx';
import Navbar from './components/Navbar.jsx';
import Cursor from './components/Cursor.jsx';
import { followSystemTheme } from './theme/theme.js';
import Section from './components/layout/Section.jsx';
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Services from './sections/Services.jsx';
import Career from './sections/Career.jsx';
import Work from './sections/Work.jsx';
import TechStack from './sections/TechStack.jsx';
import { useDownload } from './hooks/useDownload.js';
import { useReducedMotion } from './hooks/useReducedMotion.js';
import { useSmoothScroll } from './hooks/useSmoothScroll.js';
import { supportsWebGL } from './utils/webgl.js';
import { CHARACTER_MODEL_URL } from './utils/assets.js';
import { profile } from './data/profile.js';
import { navigation } from './data/navigation.js';

const CharacterScene = lazy(() => import('./three/CharacterScene.jsx'));
const DOWNLOAD_SHARE = 95;
const BUILT_SECTIONS = new Set(['about', 'career', 'work']);

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

  const reducedMotion = useReducedMotion();
  useSmoothScroll({ enabled: !reducedMotion, paused: !introReady });

  const loaded = !use3d || sceneReady;
  const progress = loaded ? 100 : model.progress * DOWNLOAD_SHARE;

  return (
    <>
      {loaderVisible && (
        <Loader name={profile.name} progress={progress} loaded={loaded} onExitStart={startIntro} onDone={hideLoader} />
      )}
      <Cursor />
      <Navbar name={profile.name} inert={!introReady} />
      <main id="main" tabIndex={-1} inert={!introReady} className={introReady ? 'is-ready' : undefined}>
        <Hero
          ready={introReady}
          nextId={navigation[0]?.id}
          scene={
            use3d ? (
              <ErrorBoundary fallback={<CharacterFallback />} onError={showFallback}>
                <Suspense fallback={null}>
                  <CharacterScene modelUrl={model.objectUrl} onProgress={handleProgress} onContextLost={showFallback} />
                </Suspense>
              </ErrorBoundary>
            ) : (
              <CharacterFallback />
            )
          }
        />
        <About />
        <Services />
        <Career />
        <Work />
        <TechStack />
        {navigation
          .filter((item) => !BUILT_SECTIONS.has(item.id))
          .map((item) => (
            <Section key={item.id} id={item.id} className="placeholder-section" labelledBy={`${item.id}-title`}>
              <h2 id={`${item.id}-title`}>{item.label}</h2>
              <p>Coming soon.</p>
            </Section>
          ))}
      </main>
    </>
  );
}
