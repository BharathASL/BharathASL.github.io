import { useLayoutEffect, useRef } from 'react';
import Section from '../components/layout/Section.jsx';
import SplitText from '../components/SplitText.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { sections } from '../data/sections.js';
import { featuredProjects, visibleProjects, PROJECTS_PAGE_URL } from '../utils/projects.js';
import { gsap } from '../motion/gsap.js';
import './Work.css';

const copy = sections.work;
// Same condition as the strip layout in Work.css. Phones, short screens and reduced motion keep the plain grid.
const STRIP = '(min-width: 1024px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)';

// Pins the section and moves the cards sideways as you scroll down.
function useWorkStrip(section, viewport, track, progress) {
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(STRIP, () => {
      section.current.classList.add('is-strip');
      const distance = () => Math.max(0, track.current.scrollWidth - viewport.current.clientWidth);
      gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => progress.current?.style.setProperty('--strip-progress', self.progress.toFixed(4)),
        },
      });
      return () => section.current?.classList.remove('is-strip');
    });
    return () => media.revert();
  }, [section, viewport, track, progress]);
}

export default function Work() {
  const section = useRef(null);
  const viewport = useRef(null);
  const track = useRef(null);
  const progress = useRef(null);
  useWorkStrip(section, viewport, track, progress);

  return (
    <Section ref={section} id="work" className="work" labelledBy="work-title">
      <div className="work__header">
        <p className="section-label text-label" data-reveal="fade">
          {copy.label}
        </p>
        <h2 id="work-title" className="work__title" data-reveal="words">
          <SplitText text={copy.title} />
        </h2>
      </div>

      <div ref={viewport} className="work__viewport">
        <ol ref={track} className="work__track" data-reveal="stagger">
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
      </div>
      <div ref={progress} className="work__progress" aria-hidden="true">
        <span className="work__progress-bar" />
      </div>
    </Section>
  );
}
