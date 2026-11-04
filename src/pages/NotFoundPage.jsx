import { useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Cursor from '../components/Cursor.jsx';
import { profile } from '../data/profile.js';
import { followSystemTheme } from '../theme/theme.js';
import { PROJECTS_PAGE_URL } from '../utils/projects.js';
import './NotFoundPage.css';

const HOME = import.meta.env.BASE_URL;

// GitHub Pages serves this page for any address that does not exist.
export default function NotFoundPage() {
  useEffect(() => followSystemTheme(), []);

  return (
    <>
      <Cursor />
      <Navbar name={profile.name} homeHref={HOME} />
      <main id="main" tabIndex={-1} className="not-found">
        <div className="not-found__inner container">
          <p className="not-found__code" aria-hidden="true">
            404
          </p>
          <h1 className="not-found__title">This page doesn’t exist.</h1>
          <p className="not-found__text text-lead">The link may be old, or the address may have a typo.</p>
          <div className="not-found__actions cluster">
            <a className="button button--primary" href={HOME} data-magnetic>
              Back to home
            </a>
            <a className="button button--ghost" href={PROJECTS_PAGE_URL} data-magnetic>
              See all projects
            </a>
          </div>
        </div>
      </main>
      <Footer name={profile.name} />
    </>
  );
}
