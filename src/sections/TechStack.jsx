import Section from '../components/layout/Section.jsx';
import SplitText from '../components/SplitText.jsx';
import { skillGroups } from '../data/skills.js';
import { sections } from '../data/sections.js';
import './TechStack.css';

const copy = sections.stack;
const allSkills = [...new Set(skillGroups.flatMap((group) => group.skills))];

// Decorative only: the same skills are listed in full below for everyone, screen readers included.
function Marquee() {
  return (
    <div className="stack-marquee" aria-hidden="true">
      {[0, 1].map((copyIndex) => (
        <ul key={copyIndex} className="stack-marquee__track">
          {allSkills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export default function TechStack() {
  return (
    <Section id="stack" className="stack-section" labelledBy="stack-title">
      <div className="stack-section__header">
        <p className="section-label text-label" data-reveal="fade">
          {copy.label}
        </p>
        <h2 id="stack-title" className="stack-section__title" data-reveal="words">
          <SplitText text={copy.title} />
        </h2>
      </div>

      <div data-reveal="fade">
        <Marquee />
      </div>

      <div className="stack-groups">
        {skillGroups.map((group) => (
          <section key={group.id} className="stack-group" aria-labelledby={`stack-${group.id}`} data-reveal="fade">
            <h3 id={`stack-${group.id}`} className="stack-group__title">
              {group.title}
              <span className="stack-group__count" aria-hidden="true">
                {String(group.skills.length).padStart(2, '0')}
              </span>
            </h3>
            <ul className="stack-group__skills">
              {group.skills.map((skill) => (
                <li key={skill} className="chip stack-group__skill">
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Section>
  );
}
