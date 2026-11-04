import Section from '../components/layout/Section.jsx';
import SplitText from '../components/SplitText.jsx';
import { profile } from '../data/profile.js';
import { experience } from '../data/experience.js';
import './About.css';

const projectCount = experience.reduce((total, company) => total + company.projects.length, 0);

const facts = [
  { value: `${profile.yearsOfExperience}+`, label: 'Years of experience' },
  { value: `${projectCount}`, label: 'Projects delivered' },
  { value: `${experience.length}`, label: 'Companies' },
];

export default function About() {
  return (
    <Section id="about" className="about" labelledBy="about-title">
      <div className="about__layout split">
        {/* Empty on purpose: the 3D character moves into this space as the section scrolls in. */}
        <div className="about__stage" data-character-anchor="about" aria-hidden="true" />

        <div className="about__content">
          <p className="about__label text-label" data-reveal="fade">
            About
          </p>
          <h2 id="about-title" className="about__title" data-reveal="words">
            <SplitText text={profile.aboutHeading} />
          </h2>
          <div className="about__body" data-reveal="stagger">
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <dl className="about__facts" data-reveal="stagger">
            {facts.map((fact) => (
              <div key={fact.label} className="about__fact">
                <dt className="about__fact-label">{fact.label}</dt>
                <dd className="about__fact-value">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
