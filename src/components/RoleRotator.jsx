import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import './RoleRotator.css';

const INTERVAL_MS = 2600;

export default function RoleRotator({ roles, active = true, className = '', ...rest }) {
  const root = useRef(null);
  const inView = useInView(root);
  const reducedMotion = useReducedMotion();
  const [{ index, previous }, setState] = useState({ index: 0, previous: null });
  const rotating = active && inView && !reducedMotion && roles.length > 1;

  useEffect(() => {
    if (!rotating) return undefined;
    const timer = setInterval(() => {
      if (document.hidden) return;
      setState(({ index: current }) => ({ index: (current + 1) % roles.length, previous: current }));
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [rotating, roles.length]);

  return (
    <p ref={root} className={`role-rotator ${className}`.trim()} {...rest}>
      <span className="visually-hidden">{roles.join(', ')}</span>
      <span className="role-rotator__track" aria-hidden="true">
        {roles.map((role, i) => {
          const state = i === index ? 'is-active' : i === previous ? 'is-leaving' : undefined;
          return (
            <span key={role} className={['role-rotator__item', state].filter(Boolean).join(' ')}>
              {[...role].map((char, charIndex) => (
                <span key={charIndex} className="role-rotator__char" style={{ '--i': charIndex }}>
                  {char === ' ' ? '\u00a0' : char}
                </span>
              ))}
            </span>
          );
        })}
      </span>
    </p>
  );
}
