import Section from '../components/layout/Section.jsx';
import SplitText from '../components/SplitText.jsx';
import CopyButton from '../components/CopyButton.jsx';
import { contact, socialLinks } from '../data/links.js';
import { sections } from '../data/sections.js';
import './Contact.css';

const copy = sections.contact;

function ArrowIcon({ size = 16 }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" focusable="false">
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

export default function Contact() {
  return (
    <Section id="contact" className="contact" labelledBy="contact-title">
      <div className="contact__inner">
        <p className="section-label text-label" data-reveal="fade">
          {copy.label}
        </p>
        <h2 id="contact-title" className="contact__title" data-reveal="words">
          <SplitText text={copy.title} />
        </h2>
        <p className="contact__intro text-lead" data-reveal="fade" style={{ '--reveal-delay': '0.2s' }}>
          {copy.intro}
        </p>

        <div className="contact__email" data-reveal="fade" style={{ '--reveal-delay': '0.3s' }}>
          <a className="contact__email-link" href={`mailto:${contact.email}`}>
            {contact.email}
            <ArrowIcon size={20} />
          </a>
          <CopyButton text={contact.email} label="Copy email" className="button button--ghost contact__copy" />
        </div>

        <ul className="contact__links" data-reveal="stagger" style={{ '--reveal-delay': '0.4s' }}>
          {socialLinks.map((link) => (
            <li key={link.id}>
              <a className="contact__link" href={link.url} target="_blank" rel="noreferrer">
                <span>{link.label}</span>
                <ArrowIcon />
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
          {contact.cv && (
            <li>
              <a className="contact__link" href={contact.cv} download>
                <span>Download CV</span>
                <ArrowIcon />
              </a>
            </li>
          )}
        </ul>
      </div>
    </Section>
  );
}
