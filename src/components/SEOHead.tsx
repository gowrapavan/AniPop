import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'video.movie' | 'video.tv_show';
  noIndex?: boolean;
  canonicalUrl?: string;
  structuredData?: object;
}

export function SEOHead({
  title = 'ANIPOP! - Watch Anime Online Free | HD Quality Anime Streaming',
  description = 'Watch thousands of anime episodes and movies online for free in HD quality. Stream popular anime series, latest releases, and classic titles with subtitles and dubbing on ANIPOP!',
  keywords = 'anime, watch anime online, free anime, anime streaming, anime movies, anime series, subbed anime, dubbed anime, HD anime, manga, otaku',
  image = 'https://anipop.netlify.app/img/og-image.png',
  url = 'https://anipop.netlify.app',
  type = 'website',
  noIndex = false,
  canonicalUrl,
  structuredData,
}: SEOHeadProps) {
  const fullTitle = title.includes('ANIPOP') ? title : `${title} | ANIPOP!`;
  const currentUrl = canonicalUrl || url;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="ANIPOP!" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />
      
      {/* Robots Meta */}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="googlebot" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Favicon */}
      <link rel="icon" type="image/png" href="https://anipop.netlify.app/img/favicon.png" />
      <link rel="apple-touch-icon" href="https://anipop.netlify.app/img/favicon.png" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ANIPOP!" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@anipop" />
      <meta name="twitter:creator" content="@anipop" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="application-name" content="ANIPOP!" />
      
      {/* Language and Region */}
      <meta httpEquiv="content-language" content="en-US" />
      <meta name="geo.region" content="US" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Default Website Structured Data */}
      {!structuredData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ANIPOP!",
            "alternateName": "AniPop Anime Streaming",
            "url": "https://anipop.netlify.app",
            "description": description,
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://anipop.netlify.app/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            },
            "sameAs": [
              "https://twitter.com/anipop",
              "https://facebook.com/anipop",
              "https://instagram.com/anipop"
            ]
          })}
        </script>
      )}
    </Helmet>
  );
}