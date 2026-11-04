import { useLayoutEffect, useRef } from 'react';
import Section from '../components/layout/Section.jsx';
import SplitText from '../components/SplitText.jsx';
import { experience } from '../data/experience.js';
import { sections } from '../data/sections.js';
import { formatDuration, formatMonth } from '../utils/dates.js';
import { gsap, ScrollTrigger } from '../motion/gsap.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import './Career.css';

const copy = sections.career;
// The line fills up to this point on screen, and each dot lights up as the line reaches it.
const DRAW_POINT = 'top 60%';

// Grows each company's timeline line with the scroll and marks the projects it has reached.
function useTimelineDraw(root, enabled) {
  useLayoutEffect(() => {
    if (!enabled || !root.current) return undefined;
    const context = gsap.context(() => {
      root.current.querySelectorAll('.timeline').forEach((timeline) => {
        timeline.classList.add('is-drawing');
        ScrollTrigger.create({
          trigger: timeline,
          start: DRAW_POINT,
          end: 'bottom 60%',
          onUpdate: (self) => timeline.style.setProperty('--line-progress', self.progress.toFixed(4)),
          onRefresh: (self) => timeline.style.setProperty('--line-progress', self.progress.toFixed(4)),
        });
        timeline.querySelectorAll('.career-project').forEach((project) => {
          ScrollTrigger.create({
            trigger: project,
            start: DRAW_POINT,
            onEnter: () => project.classList.add('is-reached'),
            onLeaveBack: () => project.classList.remove('is-reached'),
          });
        });
      });
    }, root);
    return () => {
      context.revert();
      root.current?.querySelectorAll('.timeline').forEach((timeline) => {
        timeline.classList.remove('is-drawing');
        timeline.style.removeProperty('--line-progress');
      });
      root.current?.querySelectorAll('.is-reached').forEach((project) => project.classList.remove('is-reached'));
    };
  }, [root, enabled]);
}

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
    <li className="career-project" data-current={current ? 'true' : undefined} data-reveal="fade">
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
  const root = useRef(null);
  const reducedMotion = useReducedMotion();
  useTimelineDraw(root, !reducedMotion);

  return (
    <Section ref={root} id="career" className="career" labelledBy="career-title">
      <div className="career__header">
        <p className="section-label text-label" data-reveal="fade">
          {copy.label}
        </p>
        <h2 id="career-title" className="career__title" data-reveal="words">
          <SplitText text={copy.title} />
        </h2>
      </div>

      <div className="career__companies">
        {experience.map((company) => (
          <article key={company.id} className="career-company" aria-labelledby={`company-${company.id}`}>
            <header className="career-company__info" data-reveal="fade">
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
