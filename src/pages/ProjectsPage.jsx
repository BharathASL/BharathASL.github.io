import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Cursor from '../components/Cursor.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Section from '../components/layout/Section.jsx';
import SplitText from '../components/SplitText.jsx';
import { profile } from '../data/profile.js';
import { sections } from '../data/sections.js';
import { PROJECT_CATEGORIES } from '../data/projects.js';
import { followSystemTheme } from '../theme/theme.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { useSmoothScroll } from '../hooks/useSmoothScroll.js';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { visibleProjects } from '../utils/projects.js';
import './ProjectsPage.css';

const HOME = import.meta.env.BASE_URL;
const copy = sections.projects;
const ALL = 'all';

// Only categories that have projects get a filter. With fewer than two, there is nothing to filter.
const filters = [
  { id: ALL, label: 'All', count: visibleProjects.length },
  ...Object.entries(PROJECT_CATEGORIES)
    .map(([id, label]) => ({ id, label, count: visibleProjects.filter((p) => p.category === id).length }))
    .filter((filter) => filter.count > 0),
];
const showFilters = filters.length > 2;

function readFilter() {
  const value = new URLSearchParams(window.location.search).get('category');
  return filters.some((filter) => filter.id === value) ? value : ALL;
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState(readFilter);
  const reducedMotion = useReducedMotion();
  useSmoothScroll({ enabled: !reducedMotion, paused: false });
  useScrollReveal();

  useEffect(() => followSystemTheme(), []);

  // Keep the chosen filter in the address, so the link can be shared.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (filter === ALL) url.searchParams.delete('category');
    else url.searchParams.set('category', filter);
    window.history.replaceState(null, '', url);
  }, [filter]);

  const shown = filter === ALL ? visibleProjects : visibleProjects.filter((p) => p.category === filter);

  return (
    <>
      <Cursor />
      <Navbar name={profile.name} homeHref={HOME} />
      <main id="main" tabIndex={-1} className="projects-page is-ready">
        <Section id="top" labelledBy="projects-title" className="projects-page__section">
          <a className="projects-page__back" href={HOME}>
            <span aria-hidden="true">←</span> Back to home
          </a>

          <div className="projects-page__header">
            <p className="section-label text-label" data-reveal="fade">
              {copy.label}
            </p>
            <h1 id="projects-title" className="projects-page__title" data-reveal="words">
              <SplitText text={copy.title} />
            </h1>
            <p className="projects-page__intro text-lead" data-reveal="fade" style={{ '--reveal-delay': '0.3s' }}>
              {copy.intro}
            </p>
          </div>

          {showFilters && (
            <div className="projects-filter" role="group" aria-label="Filter projects">
              {filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="projects-filter__button"
                  aria-pressed={filter === item.id}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                  <span className="projects-filter__count">{item.count}</span>
                </button>
              ))}
            </div>
          )}

          <p className="visually-hidden" role="status">
            {`Showing ${shown.length} ${shown.length === 1 ? 'project' : 'projects'}`}
          </p>

          <ul className="projects-grid">
            {shown.map((project, index) => (
              <li key={project.id} className="projects-grid__item">
                <ProjectCard project={project} index={index} />
              </li>
            ))}
          </ul>
        </Section>
      </main>
      <Footer name={profile.name} />
    </>
  );
}
