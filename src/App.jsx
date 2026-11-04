import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import CharacterFallback from './components/CharacterFallback.jsx';
import Loader from './components/Loader.jsx';
import Navbar from './components/Navbar.jsx';
import Cursor from './components/Cursor.jsx';
import { followSystemTheme } from './theme/theme.js';
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Services from './sections/Services.jsx';
import Career from './sections/Career.jsx';
import Work from './sections/Work.jsx';
import TechStack from './sections/TechStack.jsx';
import Contact from './sections/Contact.jsx';
import Footer from './components/Footer.jsx';
import { useDownload } from './hooks/useDownload.js';
import { useReducedMotion } from './hooks/useReducedMotion.js';
import { useSmoothScroll } from './hooks/useSmoothScroll.js';
import { useScrollReveal } from './hooks/useScrollReveal.js';
import { supportsWebGL } from './utils/webgl.js';
import { CHARACTER_MODEL_URL } from './utils/assets.js';
import { profile } from './data/profile.js';
import { navigation } from './data/navigation.js';

const CharacterScene = lazy(() => import('./three/CharacterScene.jsx'));
const DOWNLOAD_SHARE = 95;

export default function App() {
  const [use3d, setUse3d] = useState(supportsWebGL);
  const [sceneReady, setSceneReady] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [introReady, setIntroReady] = useState(false);
  const [heroAnchor, setHeroAnchor] = useState(null);
  const [aboutAnchor, setAboutAnchor] = useState(null);
  const model = useDownload(CHARACTER_MODEL_URL, { enabled: use3d, type: 'model/gltf-binary' });

  const showFallback = useCallback(() => setUse3d(false), []);
  const handleProgress = useCallback(({ loaded }) => setSceneReady(loaded), []);
  const startIntro = useCallback(() => setIntroReady(true), []);
  const hideLoader = useCallback(() => setLoaderVisible(false), []);

  useEffect(() => {
    if (model.error) showFallback();
  }, [model.error, showFallback]);

  useEffect(() => followSystemTheme(), []);

  // The loader locks scrolling, so a link like /#career from another page can only jump once it has gone.
  useEffect(() => {
    if (!introReady || !window.location.hash) return undefined;
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (!target) return undefined;
    const frame = requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, [introReady]);

  const reducedMotion = useReducedMotion();
  useSmoothScroll({ enabled: !reducedMotion, paused: !introReady });
  useScrollReveal(!reducedMotion);

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
        {use3d && (
          <div className="scene-layer" aria-hidden="true">
            <ErrorBoundary fallback={null} onError={showFallback}>
              <Suspense fallback={null}>
                <CharacterScene
                  modelUrl={model.objectUrl}
                  hero={heroAnchor}
                  about={aboutAnchor}
                  onProgress={handleProgress}
                  onContextLost={showFallback}
                />
              </Suspense>
            </ErrorBoundary>
          </div>
        )}
        <Hero ready={introReady} nextId={navigation[0]?.id} sceneRef={setHeroAnchor} scene={use3d ? null : <CharacterFallback />} />
        <About stageRef={setAboutAnchor} />
        <Services />
        <Career />
        <Work />
        <TechStack />
        <Contact />
      </main>
      <Footer name={profile.name} inert={!introReady} />
    </>
  );
}
