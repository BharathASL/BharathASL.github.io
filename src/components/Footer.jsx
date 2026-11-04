import { credits } from '../data/credits.js';
import './Footer.css';

export default function Footer({ name, inert }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" inert={inert}>
      <div className="site-footer__inner container">
        <div className="site-footer__row">
          <p className="site-footer__copyright">
            © {year} {name}. Designed and built by me.
          </p>
          <a className="site-footer__top" href="#top">
            Back to top
            <span aria-hidden="true"> ↑</span>
          </a>
        </div>

        {credits.length > 0 && (
          <div className="site-footer__credits">
            <h2 className="site-footer__credits-title">Credits</h2>
            <ul>
              {credits.map((credit) => (
                <li key={credit.work}>
                  {credit.url ? (
                    <a href={credit.url} target="_blank" rel="noreferrer">
                      {credit.work}
                    </a>
                  ) : (
                    credit.work
                  )}{' '}
                  by {credit.author}, licensed under{' '}
                  <a href={credit.licenseUrl} target="_blank" rel="noreferrer">
                    {credit.license}
                  </a>
                  .{credit.note && ` ${credit.note}`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </footer>
  );
}
