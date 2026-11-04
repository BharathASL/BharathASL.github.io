// Adds the tags every page shares: icons, plus Open Graph and Twitter cards built from each page's own
// <title>, description and canonical link, so those are written once per page in its HTML file.
const read = (html, pattern) => html.match(pattern)?.[1];

export function seoHead({ siteUrl, image, imageAlt, siteName }) {
  return {
    name: 'seo-head',
    transformIndexHtml(html) {
      return pageTags(html).map((tag) => ({ ...tag, injectTo: 'head' }));
    },
  };

  function pageTags(html) {
    const tags = [
      { tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico', sizes: '48x48' } },
      { tag: 'link', attrs: { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' } },
      { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
      { tag: 'link', attrs: { rel: 'manifest', href: '/site.webmanifest' } },
    ];

    // Pages that ask not to be indexed (the 404 page) get no social cards.
    if (/<meta name="robots" content="noindex"/.test(html)) return tags;

    const title = read(html, /<title>([^<]*)<\/title>/);
    const description = read(html, /<meta name="description" content="([^"]*)"/);
    const url = read(html, /<link rel="canonical" href="([^"]*)"/);
    if (!title || !description || !url)
      throw new Error('Each page needs a <title>, a description and a canonical link');

    const property = (name, content) => ({ tag: 'meta', attrs: { property: name, content } });
    const named = (name, content) => ({ tag: 'meta', attrs: { name, content } });
    const imageUrl = new URL(image.src, siteUrl).href;
    return [
      ...tags,
      property('og:type', 'website'),
      property('og:site_name', siteName),
      property('og:title', title),
      property('og:description', description),
      property('og:url', url),
      property('og:image', imageUrl),
      property('og:image:width', String(image.width)),
      property('og:image:height', String(image.height)),
      property('og:image:alt', imageAlt),
      named('twitter:card', 'summary_large_image'),
      named('twitter:title', title),
      named('twitter:description', description),
      named('twitter:image', imageUrl),
      named('twitter:image:alt', imageAlt),
    ];
  }
}
