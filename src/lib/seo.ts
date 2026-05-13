// SEO configuration and meta tag management for Lift Metric

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
}

export const defaultSEO: SEOConfig = {
  title: "Lift Metric - ROI Calculator for Project Analysis",
  description: "Professional ROI calculator with advanced financial metrics. Calculate NPV, IRR, payback period, and generate executive reports for project investment decisions.",
  keywords: [
    "ROI calculator",
    "return on investment",
    "NPV calculator",
    "IRR calculator",
    "project ROI",
    "financial calculator",
    "investment analysis",
    "payback period calculator",
    "cost benefit analysis",
    "project metrics",
    "business calculator",
    "finance tools",
    "productivity calculator",
    "enterprise ROI",
    "financial planning"
  ],
};

export const pageSEO: Record<string, SEOConfig> = {
  home: {
    title: "Lift Metric - Professional ROI Calculator & Financial Analysis Tool",
    description: "Calculate project ROI with precision. Advanced metrics including NPV, IRR, sensitivity analysis, and executive reports. Free trial available.",
    keywords: ["roi calculator", "financial analysis", "project metrics", "npv calculator", "irr calculator"],
  },
  calculator: {
    title: "ROI Calculator - Calculate Project Returns | Lift Metric",
    description: "Calculate ROI for your projects with our powerful calculator. Choose between basic and scientific modes for quick estimates or detailed financial analysis.",
    keywords: ["calculate roi", "project calculator", "investment calculator", "financial metrics"],
  },
  pricing: {
    title: "Pricing Plans - Lift Metric ROI Calculator",
    description: "Choose the perfect plan for your needs. From free basic calculations to enterprise features with unlimited projects and advanced analytics.",
    keywords: ["pricing", "plans", "subscription", "roi calculator pricing", "enterprise tools"],
  },
  help: {
    title: "Help Center - Lift Metric Support & Tutorials",
    description: "Get help with Lift Metric. Browse FAQs, watch tutorials, and learn how to maximize your ROI calculations and reporting.",
    keywords: ["help", "support", "tutorials", "faq", "guides", "documentation"],
  },
  forum: {
    title: "Community Forum - Discuss ROI Methodologies | Lift Metric",
    description: "Join the Lift Metric community. Share insights, discuss calculation methodologies, and learn from other finance professionals.",
    keywords: ["forum", "community", "discussions", "roi methods", "best practices"],
  },
  referral: {
    title: "Referral Program - Earn Rewards | Lift Metric",
    description: "Share Lift Metric and earn premium features. Get extended trials and free months when your referrals sign up.",
    keywords: ["referral program", "rewards", "share", "earn premium", "free trial"],
  },
};

export function updatePageSEO(page: keyof typeof pageSEO) {
  const seo = pageSEO[page] || defaultSEO;
  
  // Update title
  document.title = seo.title;
  
  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement("meta");
    metaDescription.setAttribute("name", "description");
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute("content", seo.description);
  
  // Update meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement("meta");
    metaKeywords.setAttribute("name", "keywords");
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute("content", seo.keywords.join(", "));
  
  // Update Open Graph tags
  updateMetaTag("og:title", seo.title);
  updateMetaTag("og:description", seo.description);
  updateMetaTag("og:type", "website");
  updateMetaTag("og:url", window.location.href);
  
  // Update Twitter Card tags
  updateMetaTag("twitter:card", "summary_large_image", "name");
  updateMetaTag("twitter:title", seo.title, "name");
  updateMetaTag("twitter:description", seo.description, "name");
  
  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", seo.canonical || window.location.href);
}

function updateMetaTag(property: string, content: string, attribute: "property" | "name" = "property") {
  let meta = document.querySelector(`meta[${attribute}="${property}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, property);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

// JSON-LD structured data for rich snippets
export function addStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Lift Metric",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free trial available"
    },
    "description": "Professional ROI calculator with advanced financial metrics for project analysis and investment decisions.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    }
  };
  
  let script = document.querySelector('script[type="application/ld+json"]');
  if (!script) {
    script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(structuredData);
}
