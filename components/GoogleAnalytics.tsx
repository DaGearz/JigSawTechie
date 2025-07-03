'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const GA_TRACKING_ID = 'G-V69Y5S6YL2'; // Your Google Analytics tracking ID

// Google Analytics tracking function
export const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag(...args);
  }
};

// Track page views
export const trackPageView = (url: string) => {
  gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track business events
export const trackBusinessEvent = {
  quoteSubmitted: (projectType: string, budget: string) => {
    trackEvent('quote_submitted', 'business', `${projectType}_${budget}`);
  },
  
  demoViewed: (projectId: string, projectName: string) => {
    trackEvent('demo_viewed', 'engagement', `${projectId}_${projectName}`);
  },
  
  contactFormSubmitted: (source: string) => {
    trackEvent('contact_form_submitted', 'lead_generation', source);
  },
  
  templateViewed: (templateName: string) => {
    trackEvent('template_viewed', 'engagement', templateName);
  },
  
  clientRegistered: (source: string) => {
    trackEvent('client_registered', 'conversion', source);
  },
  
  projectRequested: (projectType: string) => {
    trackEvent('project_requested', 'business', projectType);
  },
};

// Google Analytics component
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  // Only load in production
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              send_page_view: false
            });
          `,
        }}
      />
    </>
  );
}

// Hook for tracking events in components
export function useAnalytics() {
  return {
    trackEvent,
    trackBusinessEvent,
    trackPageView,
  };
}
