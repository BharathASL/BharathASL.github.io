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
      </div>
    </footer>
  );
}
