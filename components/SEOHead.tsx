import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}

const defaultSEO = {
  title: 'JigsawTechie - Professional Web Development & Design Services',
  description: 'Custom web development, responsive design, and digital solutions for businesses. Expert React, Next.js, and modern web technologies. Get your professional website today.',
  keywords: [
    'web development',
    'web design',
    'react development',
    'nextjs development',
    'responsive design',
    'custom websites',
    'business websites',
    'professional web services',
    'frontend development',
    'fullstack development',
    'jigsawtechie',
    'tyler williams'
  ],
  image: '/images/jigsawtechie-og.jpg',
  url: 'https://jigsawtechie.com',
  type: 'website' as const,
  author: 'Tyler Williams - JigsawTechie',
};

export default function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  noIndex = false,
}: SEOHeadProps) {
  const seo = {
    title: title ? `${title} | JigsawTechie` : defaultSEO.title,
    description: description || defaultSEO.description,
    keywords: [...defaultSEO.keywords, ...keywords],
    image: image || defaultSEO.image,
    url: url || defaultSEO.url,
    type,
    author: author || defaultSEO.author,
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords.join(', ')} />
      <meta name="author" content={seo.author} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={seo.type} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:site_name" content="JigsawTechie" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:creator" content="@jigsawtechie" />
      
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Additional SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#3B82F6" />
      <link rel="canonical" href={seo.url} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "JigsawTechie",
            "description": seo.description,
            "url": "https://jigsawtechie.com",
            "logo": "https://jigsawtechie.com/images/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-XXX-XXX-XXXX",
              "contactType": "customer service",
              "email": "twilliams@jigsawtechie.com"
            },
            "founder": {
              "@type": "Person",
              "name": "Tyler Williams"
            },
            "sameAs": [
              "https://linkedin.com/company/jigsawtechie",
              "https://github.com/jigsawtechie"
            ]
          })
        }}
      />
    </Head>
  );
}

// Pre-configured SEO for common pages
export const pageSEO = {
  home: {
    title: 'Professional Web Development Services',
    description: 'Custom web development and design services for businesses. Expert React, Next.js development with modern responsive design.',
    keywords: ['web development services', 'custom websites', 'business web design']
  },
  
  templates: {
    title: 'Website Templates & Demos',
    description: 'Browse our collection of professional website templates and live demos. See examples of our web development work.',
    keywords: ['website templates', 'web design examples', 'demo websites']
  },
  
  about: {
    title: 'About JigsawTechie - Web Development Experts',
    description: 'Learn about JigsawTechie and our mission to provide exceptional web development services for businesses of all sizes.',
    keywords: ['about jigsawtechie', 'web development company', 'tyler williams developer']
  },
  
  contact: {
    title: 'Contact Us - Get Your Web Project Started',
    description: 'Ready to start your web project? Contact JigsawTechie for a free consultation and quote for your custom website.',
    keywords: ['contact web developer', 'web development quote', 'hire web developer']
  },
  
  quote: {
    title: 'Get a Free Web Development Quote',
    description: 'Request a free, detailed quote for your web development project. Custom websites, web applications, and digital solutions.',
    keywords: ['web development quote', 'website cost', 'custom web development pricing']
  }
};
