import { useEffect, useId, useRef, useState } from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { useScrolled } from '../hooks/useScrolled.js';
import { navigation } from '../data/navigation.js';
import { media } from '../styles/breakpoints.js';
import './Navbar.css';

const SECTION_IDS = navigation.map((item) => item.id);

export default function Navbar({ name, inert }) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const active = useActiveSection(SECTION_IDS);
  const header = useRef(null);
  const menuButton = useRef(null);
  const firstLink = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    firstLink.current?.focus();

    const close = (returnFocus) => {
      setOpen(false);
      if (returnFocus) menuButton.current?.focus();
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') close(true);
    };
    const onPointerDown = (event) => {
      if (!header.current?.contains(event.target)) close(false);
    };
    const wide = window.matchMedia(media.tablet);
    const onResize = () => wide.matches && close(false);

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    wide.addEventListener('change', onResize);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      wide.removeEventListener('change', onResize);
    };
  }, [open]);

  return (
    <header
      ref={header}
      className="site-header"
      data-scrolled={scrolled || open ? 'true' : undefined}
      data-open={open ? 'true' : undefined}
      inert={inert}
    >
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="site-header__inner container">
        <a className="site-header__brand" href="#top" aria-label={`${name}, back to top`} data-magnetic>
          BS
        </a>

        <nav className="site-nav" aria-label="Main">
          <ul id={menuId} className="site-nav__list">
            {navigation.map((item, index) => (
              <li key={item.id}>
                <a
                  ref={index === 0 ? firstLink : undefined}
                  className="site-nav__link"
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <ThemeToggle />
          <button
            ref={menuButton}
            type="button"
            className="menu-button"
            data-magnetic
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="menu-button__bars" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
