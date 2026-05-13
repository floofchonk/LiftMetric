import type { EntityConfig } from "../hooks/useEntity";

export const testimonialEntityConfig: EntityConfig = {
  name: "Testimonial",
  orderBy: "created_at DESC",
  properties: {
    quote: { 
      type: "string", 
      description: "The testimonial text/quote" 
    },
    authorName: { 
      type: "string", 
      description: "Name of the person giving testimonial (or 'Anonymous')" 
    },
    authorTitle: { 
      type: "string", 
      description: "Job title of the author" 
    },
    company: { 
      type: "string", 
      description: "Company or organization name" 
    },
    industry: { 
      type: "string", 
      description: "Business industry/sector" 
    },
    rating: { 
      type: "integer", 
      description: "Star rating 1-5" 
    },
    isAnonymous: { 
      type: "string", 
      description: "Whether to display as anonymous" 
    },
    isPublished: { 
      type: "string", 
      description: "Whether testimonial is live on site" 
    },
    isFeatured: { 
      type: "string", 
      description: "Whether to feature prominently" 
    },
    avatar: { 
      type: "string", 
      description: "URL to avatar image (optional)" 
    },
    location: { 
      type: "string", 
      description: "City/Country location (optional)" 
    }
  },
  required: ["quote", "authorName", "rating", "isPublished"],
};
