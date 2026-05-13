import { Star, Quote, Building2, MapPin, TrendingUp } from "lucide-react";

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

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
  showAll?: boolean;
  featuredOnly?: boolean;
};

export default function TestimonialsSection({
  testimonials,
  showAll = false,
  featuredOnly = false,
}: TestimonialsSectionProps) {
  // Filter testimonials
  const filteredTestimonials = testimonials.filter((t) => {
    if (t.isPublished !== "true") return false;
    if (featuredOnly && t.isFeatured !== "true") return false;
    return true;
  });

  // Limit display unless showAll is true
  const displayTestimonials = showAll
    ? filteredTestimonials
    : filteredTestimonials.slice(0, 6);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getIndustryIcon = (industry: string) => {
    const icons: Record<string, string> = {
      Technology: "💻",
      Finance: "💰",
      Healthcare: "🏥",
      Education: "🎓",
      Retail: "🛍️",
      Manufacturing: "🏭",
      Consulting: "📊",
      Real_Estate: "🏢",
      Marketing: "📱",
      Other: "🌟",
    };
    return icons[industry] || "🌟";
  };

  if (displayTestimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <Quote className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No testimonials available yet.</p>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of professionals who trust Lift Metric for their
            business calculations
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial) => {
            const displayName =
              testimonial.isAnonymous === "true"
                ? "Anonymous User"
                : testimonial.authorName;
            const displayTitle =
              testimonial.isAnonymous === "true"
                ? "Verified User"
                : testimonial.authorTitle;

            return (
              <div
                key={testimonial.id}
                className={`bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  testimonial.isFeatured === "true"
                    ? "ring-2 ring-blue-500 lg:col-span-1"
                    : ""
                }`}
              >
                {/* Featured Badge */}
                {testimonial.isFeatured === "true" && (
                  <div className="flex justify-end mb-2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Featured
                    </span>
                  </div>
                )}

                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-blue-500 mb-4 opacity-50" />

                {/* Rating */}
                <div className="mb-3">{renderStars(testimonial.rating)}</div>

                {/* Testimonial Quote */}
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>

                {/* Author Info */}
                <div className="flex items-start gap-4 pt-4 border-t border-gray-100">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {testimonial.isAnonymous === "true"
                          ? "?"
                          : getInitials(testimonial.authorName)}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {displayName}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">
                      {displayTitle}
                    </p>

                    {/* Company & Industry */}
                    {!testimonial.isAnonymous && testimonial.company && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <Building2 className="w-3 h-3" />
                        <span className="truncate">{testimonial.company}</span>
                      </div>
                    )}

                    {testimonial.industry && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <span>{getIndustryIcon(testimonial.industry)}</span>
                        <span>{testimonial.industry.replace("_", " ")}</span>
                      </div>
                    )}

                    {/* Location */}
                    {testimonial.location && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{testimonial.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistics Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {testimonials.filter((t) => t.isPublished === "true").length}+
            </div>
            <div className="text-gray-600">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {(
                testimonials
                  .filter((t) => t.isPublished === "true")
                  .reduce((sum, t) => sum + t.rating, 0) /
                Math.max(
                  testimonials.filter((t) => t.isPublished === "true").length,
                  1
                )
              ).toFixed(1)}
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {
                new Set(
                  testimonials
                    .filter((t) => t.isPublished === "true")
                    .map((t) => t.industry)
                ).size
              }+
            </div>
            <div className="text-gray-600">Industries</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
            <div className="text-gray-600">Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
}
