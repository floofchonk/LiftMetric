import { useEntity } from "../hooks/useEntity";
import { testimonialEntityConfig } from "../entities/Testimonial";
import { Star, Quote } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  quote: string;
  rating: number;
  company: string;
  role: string;
  status: "pending" | "approved" | "rejected";
  featured: string;
  userId: string;
  reviewedAt: string;
  reviewedBy: string;
  created_at: string;
  updated_at: string;
};

export default function TestimonialShowcase() {
  const { items: testimonials, loading } = useEntity<Testimonial>(testimonialEntityConfig);

  const approvedTestimonials = testimonials.filter((t) => t.status === "approved");
  const featuredTestimonials = approvedTestimonials.filter((t) => t.featured === "true");
  const regularTestimonials = approvedTestimonials.filter((t) => t.featured === "false");

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          What Our Users Say
        </h2>
        <p className="text-xl text-gray-600">
          Join thousands of professionals who trust Lift Metric
        </p>
      </div>

      {featuredTestimonials.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Featured Reviews
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 border-2 border-blue-200 relative"
              >
                <Quote className="absolute top-4 right-4 w-12 h-12 text-blue-200" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-800 text-lg mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-blue-200 pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  {testimonial.role && testimonial.company && (
                    <p className="text-gray-600 text-sm">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  )}
                  {testimonial.role && !testimonial.company && (
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  )}
                  {!testimonial.role && testimonial.company && (
                    <p className="text-gray-600 text-sm">{testimonial.company}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {regularTestimonials.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            More Success Stories
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {regularTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-gray-900 text-sm">
                    {testimonial.name}
                  </p>
                  {testimonial.role && testimonial.company && (
                    <p className="text-gray-600 text-xs">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  )}
                  {testimonial.role && !testimonial.company && (
                    <p className="text-gray-600 text-xs">{testimonial.role}</p>
                  )}
                  {!testimonial.role && testimonial.company && (
                    <p className="text-gray-600 text-xs">{testimonial.company}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {approvedTestimonials.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-lg">
            Be the first to share your experience!
          </p>
        </div>
      )}
    </div>
  );
}
