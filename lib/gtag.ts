// Google Analytics configuration
export const GA_TRACKING_ID = "G-V69Y5S6YL2";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_location: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track quote form submissions
export const trackQuoteSubmission = (projectType: string) => {
  event({
    action: "submit_quote",
    category: "engagement",
    label: projectType,
  });
};

// Track page views
export const trackPageView = (pageName: string) => {
  event({
    action: "page_view",
    category: "engagement",
    label: pageName,
  });
};

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
