import { useState } from "react";
import { useEntity } from "../hooks/useEntity";
import { testimonialEntityConfig } from "../entities/Testimonial";
import { Star } from "lucide-react";

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

export default function TestimonialSubmission() {
  const { create, loading } = useEntity<Testimonial>(testimonialEntityConfig);
  const [formData, setFormData] = useState({
    name: "",
    quote: "",
    rating: 5,
    company: "",
    role: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await create({
      ...formData,
      status: "pending",
      featured: "false",
      userId: `user-${Date.now()}`,
      reviewedAt: "",
      reviewedBy: "",
    });

    setSubmitted(true);
    setFormData({ name: "", quote: "", rating: 5, company: "", role: "" });
    
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Share Your Experience</h2>
      <p className="text-gray-600 mb-6">
        Help others discover Lift Metric by sharing your experience
      </p>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">
            Thank you for your testimonial!
          </h3>
          <p className="text-green-700">
            Your feedback is being reviewed and will be published soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company (Optional)
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Acme Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role (Optional)
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="CFO"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= formData.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Testimonial *
            </label>
            <textarea
              required
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell us about your experience with Lift Metric..."
            />
            <p className="text-sm text-gray-500 mt-2">
              {formData.quote.length} characters
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Testimonial"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Your testimonial will be reviewed before being published
          </p>
        </form>
      )}
    </div>
  );
}
