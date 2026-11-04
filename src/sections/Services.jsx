import { useId, useRef, useState } from 'react';
import Section from '../components/layout/Section.jsx';
import { services } from '../data/profile.js';
import { sections } from '../data/sections.js';
import './Services.css';

const copy = sections.services;

function ServiceCard({ service, index, open, onToggle, onHover }) {
  const id = useId();
  const number = String(index + 1).padStart(2, '0');

  return (
    <li
      className="service"
      data-open={open ? 'true' : undefined}
      onPointerEnter={(event) => event.pointerType === 'mouse' && onHover(service.id)}
    >
      <span className="service__number" aria-hidden="true">
        {number}
      </span>
      <h3 className="service__title">
        <button
          type="button"
          className="service__toggle"
          aria-expanded={open}
          aria-controls={`${id}-more`}
          onClick={() => onToggle(service.id)}
        >
          {service.title}
          <span className="service__icon" aria-hidden="true" />
        </button>
      </h3>
      <p className="service__description">{service.description}</p>

      <div id={`${id}-more`} className="service__more">
        <div className="service__more-inner">
          <p className="service__details">{service.details}</p>
          <ul className="service__tags" aria-label={`${service.title} tools`}>
            {service.tags.map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

export default function Services() {
  const [openId, setOpenId] = useState(null);
  const pointer = useRef(null);

  // A mouse already opened the card by hovering, so its click keeps it open. Taps and keys toggle it.
  const toggle = (id) => {
    const byMouse = pointer.current === 'mouse';
    pointer.current = null;
    setOpenId((current) => (byMouse || current !== id ? id : null));
  };

  return (
    <Section id="services" className="services" labelledBy="services-title">
      <div className="services__header">
        <p className="section-label text-label">{copy.label}</p>
        <h2 id="services-title" className="services__title">
          {copy.title}
        </h2>
      </div>

      <ul
        className="services__list"
        onPointerDown={(event) => {
          pointer.current = event.pointerType;
        }}
        onPointerLeave={(event) => event.pointerType === 'mouse' && setOpenId(null)}
      >
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index}
            open={openId === service.id}
            onToggle={toggle}
            onHover={setOpenId}
          />
        ))}
      </ul>
    </Section>
  );
}
