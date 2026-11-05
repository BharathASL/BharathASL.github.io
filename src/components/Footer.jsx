import { scrollToTop } from '../motion/scroll.js';
import './Footer.css';

// Scrolls up in every browser without relying on the #top anchor, then puts keyboard focus back at the start
// of the content. The href stays as a fallback for when scripts do not run.
function backToTop(event) {
  event.preventDefault();
  scrollToTop();
  document.getElementById('main')?.focus({ preventScroll: true });
}

export default function Footer({ name, inert }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" inert={inert}>
      <div className="site-footer__inner container">
        <div className="site-footer__row">
          <p className="site-footer__copyright">
            © {year} {name}. Designed and built by me.
          </p>
          <a className="site-footer__top" href="#top" onClick={backToTop}>
            Back to top
            <span aria-hidden="true"> ↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
