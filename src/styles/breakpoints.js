// Keep in sync with the media queries documented in src/styles/layout.css.
export const BREAKPOINTS = {
  tablet: 640,
  laptop: 1024,
  wide: 1440,
};

export const media = {
  phone: `(max-width: ${BREAKPOINTS.tablet - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tablet}px)`,
  laptop: `(min-width: ${BREAKPOINTS.laptop}px)`,
  wide: `(min-width: ${BREAKPOINTS.wide}px)`,
};
