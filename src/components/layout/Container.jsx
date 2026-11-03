const VARIANTS = { default: '', wide: 'container--wide', narrow: 'container--narrow' };

export default function Container({ as: Tag = 'div', size = 'default', className = '', children, ...rest }) {
  const classes = ['container', VARIANTS[size], className].filter(Boolean).join(' ');
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
