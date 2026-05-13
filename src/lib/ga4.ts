// Google Analytics 4 integration for Lift Metric

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || "G-XXXXXXXXXX";

// Initialize GA4
export function initGA4() {
  if (typeof window === "undefined") return;
  
  // Create gtag script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  
  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA4_MEASUREMENT_ID, {
    anonymize_ip: true,
    cookie_flags: "SameSite=None;Secure",
  });
}

// Track page views
export function trackPageView(page: string, title: string) {
  if (!window.gtag) return;
  
  window.gtag("event", "page_view", {
    page_title: title,
    page_path: page,
    page_location: window.location.href,
  });
}

// Track calculation events
export function trackCalculation(mode: "basic" | "scientific", projectSize: string) {
  if (!window.gtag) return;
  
  window.gtag("event", "calculation_submitted", {
    event_category: "calculator",
    event_label: mode,
    calculation_mode: mode,
    project_size: projectSize,
  });
}

// Track mode switches
export function trackModeSwitch(from: string, to: string) {
  if (!window.gtag) return;
  
  window.gtag("event", "mode_switch", {
    event_category: "calculator",
    event_label: `${from}_to_${to}`,
    from_mode: from,
    to_mode: to,
  });
}

// Track history panel interactions
export function trackHistoryAction(action: "open" | "compare" | "export" | "restore") {
  if (!window.gtag) return;
  
  window.gtag("event", "history_interaction", {
    event_category: "history",
    event_label: action,
    action_type: action,
  });
}

// Track referral link actions
export function trackReferralAction(action: "copy" | "share_email" | "share_twitter" | "share_linkedin") {
  if (!window.gtag) return;
  
  window.gtag("event", "referral_action", {
    event_category: "referral",
    event_label: action,
    action_type: action,
  });
}

// Track report generation
export function trackReportGeneration(format: "pdf" | "excel" | "csv", reportType: string) {
  if (!window.gtag) return;
  
  window.gtag("event", "report_generated", {
    event_category: "reports",
    event_label: `${reportType}_${format}`,
    report_type: reportType,
    export_format: format,
  });
}

// Track user engagement
export function trackEngagement(action: string, category: string, label?: string) {
  if (!window.gtag) return;
  
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
  });
}

// Track conversions
export function trackConversion(action: "signup" | "upgrade" | "referral_complete") {
  if (!window.gtag) return;
  
  window.gtag("event", "conversion", {
    event_category: "conversions",
    event_label: action,
    conversion_type: action,
  });
}

// Generic event tracking (for custom events)
export function trackEvent(data: { name: string; properties?: Record<string, any> }) {
  if (!window.gtag) return;
  
  window.gtag("event", data.name, {
    event_category: data.properties?.event_category || "engagement",
    ...data.properties,
  });
}

// Analytics event tracking with flexible parameters
export function trackAnalyticsEvent(
  eventName: string | { name: string; properties?: Record<string, any> },
  eventCategory?: string,
  eventLabel?: string,
  eventValue?: number
) {
  if (!window.gtag) return;
  
  if (typeof eventName === 'object') {
    window.gtag("event", eventName.name, {
      event_category: eventName.properties?.event_category || "engagement",
      ...eventName.properties,
    });
  } else {
    window.gtag("event", eventName, {
      event_category: eventCategory || "engagement",
      event_label: eventLabel,
      value: eventValue,
    });
  }
}

// Track search queries
export function trackSearch(query: string, category: string) {
  if (!window.gtag) return;
  
  window.gtag("event", "search", {
    search_term: query,
    event_category: category,
  });
}

// Track help center interactions
export function trackHelpArticle(articleId: number, articleTitle: string) {
  if (!window.gtag) return;
  
  window.gtag("event", "view_article", {
    event_category: "help_center",
    event_label: articleTitle,
    article_id: articleId,
  });
}

// Track form submissions
export function trackFormSubmission(formType: string) {
  if (!window.gtag) return;
  
  window.gtag("event", "form_submission", {
    event_category: "forms",
    event_label: formType,
    form_type: formType,
  });
}
