import Container from './Container.jsx';

export default function Section({ id, labelledBy, size = 'default', className = '', children, ...rest }) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={['section', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <Container size={size}>{children}</Container>
    </section>
  );
}
