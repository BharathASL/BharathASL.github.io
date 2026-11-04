import Section from '../components/layout/Section.jsx';
import RoleRotator from '../components/RoleRotator.jsx';
import { profile } from '../data/profile.js';
import { contact, socialLinks } from '../data/links.js';
import './Hero.css';

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Hero({ ready, scene, nextId }) {
  return (
    <Section id="top" className="hero" labelledBy="hero-title">
      <div className="hero__layout split">
        <div className="hero__content">
          <p className="hero__eyebrow text-label hero__reveal" style={{ '--i': 0 }}>
            Based in {profile.location} · {profile.yearsOfExperience}+ years building software
          </p>
          <h1 id="hero-title" className="hero__title text-display hero__reveal" style={{ '--i': 1 }}>
            <span className="hero__greeting">Hi, I’m</span> {profile.name}
          </h1>
          <RoleRotator className="hero__roles hero__reveal" style={{ '--i': 2 }} roles={profile.roles} active={ready} />
          <p className="hero__tagline text-lead hero__reveal" style={{ '--i': 3 }}>
            {profile.tagline}
          </p>

          <div className="hero__actions cluster hero__reveal" style={{ '--i': 4 }}>
            <a className="button button--primary" href={`mailto:${contact.email}`} data-magnetic>
              Get in touch
              <ArrowIcon />
            </a>
            {contact.cv ? (
              <a className="button button--ghost" href={contact.cv} download data-magnetic>
                Download CV
                <DownloadIcon />
              </a>
            ) : (
              <a className="button button--ghost" href="#work" data-magnetic>
                See my work
              </a>
            )}
          </div>

          <ul className="hero__social cluster hero__reveal" style={{ '--i': 5 }} aria-label="Profiles">
            {socialLinks.map((link) => (
              <li key={link.id}>
                <a className="hero__social-link" href={link.url} target="_blank" rel="noreferrer">
                  {link.label}
                  <ArrowIcon />
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__scene scene" aria-hidden="true">
          {scene}
        </div>
      </div>

      {nextId && (
        <a className="hero__scroll" href={`#${nextId}`} aria-label="Scroll to the next section">
          <span className="hero__scroll-text" aria-hidden="true">
            Scroll
          </span>
          <span className="hero__scroll-line" aria-hidden="true" />
        </a>
      )}
    </Section>
  );
}
