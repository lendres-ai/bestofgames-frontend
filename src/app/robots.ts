export default function robots() {
    return {
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://deine-domain.com/sitemap.xml',
    };
  }