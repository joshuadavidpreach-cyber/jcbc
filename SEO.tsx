
import React, { useEffect } from 'react';
import { SiteConfig } from '../types';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  schema?: object; // JSON-LD
  config: SiteConfig;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  schema,
  config 
}) => {
  const siteTitle = config.churchName || "Jesus Culture Bible Church";
  const metaTitle = `${title} | ${siteTitle}`;
  const metaDescription = description || config.seoDescription || "Apostolic and Pentecostal Church in Chattaroy, near Spokane WA.";
  const metaKeywords = keywords || config.seoKeywords || "Churches near Spokane WA, Chattaroy Churches, John G. Lake, JGLM";
  const metaImage = image || config.ogImage || config.logoImageUrl;
  const currentUrl = url || window.location.href;

  useEffect(() => {
    // 1. Update Title
    document.title = metaTitle;

    // 2. Helper to update/create meta tags
    const updateMeta = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // 3. Update Standard Meta
    updateMeta('description', metaDescription);
    updateMeta('keywords', metaKeywords);

    // 4. Update Open Graph (Facebook/Social)
    updateMeta('og:title', metaTitle, 'property');
    updateMeta('og:description', metaDescription, 'property');
    updateMeta('og:image', metaImage, 'property');
    updateMeta('og:url', currentUrl, 'property');
    updateMeta('og:type', 'website', 'property');
    updateMeta('og:site_name', siteTitle, 'property');

    // 5. Inject JSON-LD Schema (Structured Data)
    const scriptId = 'seo-schema-json-ld';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    // Default Church Schema if none provided
    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "Church",
      "name": config.churchName,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": config.locationAddress,
        "addressLocality": "Chattaroy",
        "addressRegion": "WA",
        "postalCode": "99003",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 47.9, 
        "longitude": -117.3
      },
      "url": window.location.origin,
      "telephone": config.locationPhone,
      "description": config.seoDescription,
      "founder": {
        "@type": "Person",
        "name": "Pastor Joshua David"
      },
      "sameAs": [
        config.facebookUrl,
        config.youtubeUrl
      ]
    };

    const finalSchema = schema || defaultSchema;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(finalSchema);

  }, [metaTitle, metaDescription, metaKeywords, metaImage, currentUrl, schema, config]);

  return null;
};

export default SEO;
