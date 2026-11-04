import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import './Loader.css';

const MIN_VISIBLE_MS = 800;
const MAX_WAIT_MS = 4000;
const EXIT_MS = 700;
const EASING = 0.12;

export default function Loader({ name, progress, loaded, onExitStart, onDone }) {
  const reducedMotion = useReducedMotion();
  const [timedOut, setTimedOut] = useState(false);
  const [exiting, setExiting] = useState(false);
  const root = useRef(null);
  const counter = useRef(null);
  const bar = useRef(null);
  const target = useRef(0);
  const finished = loaded || timedOut;

  useEffect(() => {
    target.current = finished ? 100 : Math.max(target.current, progress);
  }, [finished, progress]);

  useEffect(() => {
    const id = setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    document.documentElement.classList.add('is-loading');
    return () => {
      clearTimeout(id);
      document.documentElement.classList.remove('is-loading');
    };
  }, []);

  useEffect(() => {
    const startedAt = performance.now();
    let shown = 0;
    let frame;
    const tick = (now) => {
      const goal = target.current;
      shown = reducedMotion || goal - shown < 0.5 ? goal : shown + (goal - shown) * EASING;
      const value = Math.round(shown);
      counter.current.textContent = String(value);
      bar.current.style.transform = `scaleX(${shown / 100})`;
      root.current.setAttribute('aria-valuenow', String(value));
      if (shown >= 100 && now - startedAt >= MIN_VISIBLE_MS) {
        setExiting(true);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  useEffect(() => {
    if (!exiting) return undefined;
    onExitStart?.();
    const id = setTimeout(() => onDone?.(), reducedMotion ? 0 : EXIT_MS);
    return () => clearTimeout(id);
  }, [exiting, reducedMotion, onExitStart, onDone]);

  return (
    <div
      ref={root}
      className={`loader${exiting ? ' is-exiting' : ''}`}
      role="progressbar"
      aria-label="Loading the site"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div className="loader__inner container">
        <p className="loader__name text-label">{name}</p>
        <p className="loader__count" aria-hidden="true">
          <span ref={counter}>0</span>
          <span className="loader__percent">%</span>
        </p>
        <div className="loader__track" aria-hidden="true">
          <div ref={bar} className="loader__bar" />
        </div>
      </div>
    </div>
  );
}
