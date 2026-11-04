import Section from '../components/layout/Section.jsx';
import { experience } from '../data/experience.js';
import { sections } from '../data/sections.js';
import { formatDuration, formatMonth } from '../utils/dates.js';
import './Career.css';

const copy = sections.career;

function Period({ start, end }) {
  return (
    <>
      <time dateTime={start}>{formatMonth(start)}</time>
      {' – '}
      {end ? <time dateTime={end}>{formatMonth(end)}</time> : 'Present'}
    </>
  );
}

function Project({ project }) {
  const current = !project.end;

  return (
    <li className="career-project" data-current={current ? 'true' : undefined}>
      <span className="career-project__dot" aria-hidden="true" />
      <p className="career-project__period">
        <Period start={project.start} end={project.end} />
        {current && <span className="career-project__now">Now</span>}
      </p>
      <h4 className="career-project__title">{project.title}</h4>
      <p className="career-project__role">{project.role}</p>
      <p className="career-project__summary">{project.summary}</p>

      {project.highlights.length > 0 && (
        <details className="career-project__more">
          <summary>Key work</summary>
          <ul className="career-project__highlights">
            {project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </details>
      )}

      {project.tech.length > 0 && (
        <ul className="career-project__tech" aria-label="Tech used">
          {project.tech.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Career() {
  return (
    <Section id="career" className="career" labelledBy="career-title">
      <div className="career__header">
        <p className="section-label text-label">{copy.label}</p>
        <h2 id="career-title" className="career__title">
          {copy.title}
        </h2>
      </div>

      <div className="career__companies">
        {experience.map((company) => (
          <article key={company.id} className="career-company" aria-labelledby={`company-${company.id}`}>
            <header className="career-company__info">
              <h3 id={`company-${company.id}`} className="career-company__name">
                {company.company}
              </h3>
              <p className="career-company__meta">
                <Period start={company.start} end={company.end} />
                <span aria-hidden="true"> · </span>
                {formatDuration(company.start, company.end)}
              </p>
              <p className="career-company__meta">{company.location}</p>
            </header>

            <ol className="career-company__projects timeline">
              {company.projects.map((project) => (
                <Project key={project.id} project={project} />
              ))}
            </ol>
          </article>
        ))}
      </div>
    </Section>
  );
}
