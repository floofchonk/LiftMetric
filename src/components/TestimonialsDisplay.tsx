import { useEntity } from "../hooks/useEntity";
import { testimonialEntityConfig } from "../entities/Testimonial";
import TestimonialsSection from "./TestimonialsSection";

type Testimonial = {
  id: number;
  quote: string;
  authorName: string;
  authorTitle: string;
  company: string;
  industry: string;
  rating: number;
  isAnonymous: string;
  isPublished: string;
  isFeatured: string;
  avatar?: string;
  location?: string;
  created_at: string;
  updated_at: string;
};

export default function TestimonialsDisplay() {
  const { items: testimonials, loading, error } = useEntity<Testimonial>(testimonialEntityConfig);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading success stories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading testimonials: {String(error)}</p>
        </div>
      </div>
    );
  }

  return <TestimonialsSection testimonials={testimonials} showAll={true} />;
}
