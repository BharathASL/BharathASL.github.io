import { PROJECT_CATEGORIES } from '../data/projects.js';
import './ProjectCard.css';

const LINK_LABELS = { github: 'Code', live: 'Live site' };

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <path
        d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Until a real cover is added, the card shows a generated one with the project number.
function GeneratedCover({ number }) {
  return (
    <div className="project-card__generated" aria-hidden="true">
      <span>{number}</span>
    </div>
  );
}

// headingLevel follows the page: 3 under a section heading, 2 directly under the page title.
export default function ProjectCard({ project, index, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  const number = String(index + 1).padStart(2, '0');
  const links = Object.entries(project.links ?? {}).filter(([, url]) => url);

  return (
    <article className="project-card" data-category={project.category} aria-labelledby={`project-${project.id}`}>
      <div className="project-card__cover">
        {project.cover ? (
          <>
            <img src={project.cover} alt="" loading="lazy" decoding="async" />
            <span className="project-card__number" aria-hidden="true">
              {number}
            </span>
          </>
        ) : (
          <GeneratedCover number={number} />
        )}
      </div>

      <div className="project-card__body">
        <p className="project-card__meta">
          <span>{PROJECT_CATEGORIES[project.category]}</span>
          {project.status === 'in-progress' && <span className="project-card__status">In progress</span>}
          {project.todo && <span className="project-card__status project-card__status--draft">Draft</span>}
        </p>
        <Heading id={`project-${project.id}`} className="project-card__title">
          {project.title}
        </Heading>
        <p className="project-card__summary">{project.summary}</p>

        {project.tech.length > 0 && (
          <ul className="project-card__tech" aria-label="Tech used">
            {project.tech.map((tech) => (
              <li key={tech} className="chip">
                {tech}
              </li>
            ))}
          </ul>
        )}

        {links.length > 0 && (
          <ul className="project-card__links">
            {links.map(([kind, url]) => (
              <li key={kind}>
                <a href={url} target="_blank" rel="noreferrer">
                  {LINK_LABELS[kind] ?? kind}
                  <span className="visually-hidden"> for {project.title} (opens in a new tab)</span>
                  <ArrowIcon />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
