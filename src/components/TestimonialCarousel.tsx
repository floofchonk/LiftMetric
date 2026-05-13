import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { testimonials, type Testimonial } from '../data/testimonials';

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600">
            See how Lift Metric is helping businesses make smarter implementation decisions
          </p>
        </div>

        <div className="relative bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Testimonial Content */}
          <div className="max-w-4xl mx-auto px-8 md:px-12">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="mb-6">
                <img
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                  className="w-24 h-24 rounded-full object-cover shadow-lg ring-4 ring-blue-100"
                />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < currentTestimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed">
                "{currentTestimonial.quote}"
              </blockquote>

              {/* Author Info */}
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {currentTestimonial.name}
                </p>
                <p className="text-gray-600">
                  {currentTestimonial.role} at {currentTestimonial.company}
                </p>
              </div>
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-blue-600'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Join 500+ companies making smarter decisions</p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <div className="text-gray-400 font-semibold text-lg">TechFlow Solutions</div>
            <div className="text-gray-400 font-semibold text-lg">GrowthStart Inc</div>
            <div className="text-gray-400 font-semibold text-lg">Enterprise Global Corp</div>
            <div className="text-gray-400 font-semibold text-lg">InnovateCo</div>
          </div>
        </div>
      </div>
    </div>
  );
}
