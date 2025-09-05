// SEO utility functions for ANIPOP!

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url: string;
  type?: 'website' | 'article' | 'video.movie' | 'video.tv_show';
  noIndex?: boolean;
}

export const defaultSEO: SEOConfig = {
  title: 'ANIPOP! - Watch Anime Online Free | HD Quality Anime Streaming',
  description: 'Watch thousands of anime episodes and movies online for free in HD quality. Stream popular anime series, latest releases, and classic titles with subtitles and dubbing on ANIPOP!',
  keywords: 'anime, watch anime online, free anime, anime streaming, anime movies, anime series, subbed anime, dubbed anime, HD anime, manga, otaku',
  image: 'https://anipop.netlify.app/og-image.png',
  url: 'https://anipop.netlify.app',
  type: 'website',
};

export function generatePageTitle(pageTitle: string, includeBase = true): string {
  if (!includeBase || pageTitle.includes('ANIPOP')) {
    return pageTitle;
  }
  return `${pageTitle} | ANIPOP!`;
}

export function generateMetaDescription(content: string, maxLength = 160): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength - 3) + '...';
}

export function generateKeywords(baseKeywords: string[], additionalKeywords: string[] = []): string {
  const allKeywords = [...baseKeywords, ...additionalKeywords];
  return allKeywords.join(', ');
}

export function generateCanonicalUrl(path: string): string {
  const baseUrl = 'https://anipop.netlify.app';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function generateStructuredData(type: string, data: any) {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return baseStructure;
}

// Common structured data templates
export const structuredDataTemplates = {
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ANIPOP!',
    alternateName: 'AniPop Anime Streaming',
    url: 'https://anipop.netlify.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://anipop.netlify.app/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://twitter.com/anipop',
      'https://facebook.com/anipop',
      'https://instagram.com/anipop',
    ],
  },

  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ANIPOP!',
    url: 'https://anipop.netlify.app',
    logo: 'https://anipop.netlify.app/img/logo.png',
    description: 'Free anime streaming platform with HD quality content',
    sameAs: [
      'https://twitter.com/anipop',
      'https://facebook.com/anipop',
      'https://instagram.com/anipop',
    ],
  },

  breadcrumbList: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),
};

// SEO validation functions
export function validateSEOConfig(config: Partial<SEOConfig>): string[] {
  const errors: string[] = [];

  if (!config.title || config.title.length < 10) {
    errors.push('Title should be at least 10 characters long');
  }

  if (config.title && config.title.length > 60) {
    errors.push('Title should be less than 60 characters for optimal display');
  }

  if (!config.description || config.description.length < 50) {
    errors.push('Description should be at least 50 characters long');
  }

  if (config.description && config.description.length > 160) {
    errors.push('Description should be less than 160 characters for optimal display');
  }

  if (!config.url || !config.url.startsWith('https://')) {
    errors.push('URL should be a valid HTTPS URL');
  }

  return errors;
}