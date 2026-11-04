import Section from '../components/layout/Section.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { sections } from '../data/sections.js';
import { featuredProjects, visibleProjects, PROJECTS_PAGE_URL } from '../utils/projects.js';
import './Work.css';

const copy = sections.work;

export default function Work() {
  return (
    <Section id="work" className="work" labelledBy="work-title">
      <div className="work__header">
        <p className="section-label text-label">{copy.label}</p>
        <h2 id="work-title" className="work__title">
          {copy.title}
        </h2>
      </div>

      <ol className="work__track">
        {featuredProjects.map((project, index) => (
          <li key={project.id} className="work__item">
            <ProjectCard project={project} index={index} />
          </li>
        ))}
        <li className="work__item">
          <a className="work__all" href={PROJECTS_PAGE_URL} data-cursor="hover">
            <span className="work__all-count">{visibleProjects.length}</span>
            <span className="work__all-label">See all projects</span>
            <span className="work__all-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" focusable="false">
                <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </li>
      </ol>
    </Section>
  );
}
