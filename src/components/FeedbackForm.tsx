import { useState } from "react";
import { useEntity } from "../hooks/useEntity";
import { feedbackEntityConfig } from "../entities/Feedback";

type Feedback = {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  feedbackType: string;
  category: string;
  industry: string;
  title: string;
  description: string;
  relevanceRating: number;
  utilityRating: number;
  priority: string;
  status: string;
  adminNotes: string;
  isPublic: string;
  created_at: string;
  updated_at: string;
};

export default function FeedbackForm({ onClose }: { onClose: () => void }) {
  const { create, loading } = useEntity<Feedback>(feedbackEntityConfig);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    feedbackType: "suggestion",
    category: "other",
    industry: "technology",
    title: "",
    description: "",
    relevanceRating: 5,
    utilityRating: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await create({
      userId: "user_" + Date.now(),
      userName: formData.userName,
      userEmail: formData.userEmail,
      feedbackType: formData.feedbackType,
      category: formData.category,
      industry: formData.industry,
      title: formData.title,
      description: formData.description,
      relevanceRating: formData.relevanceRating,
      utilityRating: formData.utilityRating,
      priority: "medium",
      status: "new",
      adminNotes: "",
      isPublic: "false",
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">✅</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You!
          </h2>
          <p className="text-gray-600 mb-8">
            Your feedback has been submitted successfully. We review all feedback and use it to improve Lift Metric for everyone.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">💬 Share Your Feedback</h2>
              <p className="text-blue-100">
                Help us make Lift Metric better for your industry
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email (for follow-up)
              </label>
              <input
                type="email"
                value={formData.userEmail}
                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@company.com"
              />
            </div>
          </div>

          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Feedback Type *
            </label>
            <select
              required
              value={formData.feedbackType}
              onChange={(e) => setFormData({ ...formData, feedbackType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="suggestion">💡 Suggestion</option>
              <option value="bug">🐛 Bug Report</option>
              <option value="feature_request">✨ Feature Request</option>
              <option value="industry_feedback">🏢 Industry-Specific Feedback</option>
              <option value="general">💬 General Feedback</option>
            </select>
          </div>

          {/* Category and Industry */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Feature Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ui_ux">🎨 UI/UX</option>
                <option value="calculator">🧮 Calculator</option>
                <option value="reports">📄 Reports & PDFs</option>
                <option value="benchmarking">📊 Benchmarking</option>
                <option value="branding">🎨 Branding</option>
                <option value="performance">⚡ Performance</option>
                <option value="other">📦 Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Industry *
              </label>
              <select
                required
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="technology">💻 Technology</option>
                <option value="finance">💰 Finance</option>
                <option value="healthcare">🏥 Healthcare</option>
                <option value="manufacturing">🏭 Manufacturing</option>
                <option value="retail">🛍️ Retail</option>
                <option value="consulting">💼 Consulting</option>
                <option value="education">🎓 Education</option>
                <option value="other">🌐 Other</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title/Summary *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief summary of your feedback"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Please provide as much detail as possible. For industry feedback, let us know how Lift Metric fits (or doesn't fit) your specific use case..."
            />
          </div>

          {/* Ratings */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Rate Your Experience</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How relevant is Lift Metric to your industry/use case?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, relevanceRating: rating })}
                    className={`w-12 h-12 rounded-lg font-bold transition-all duration-200 ${
                      formData.relevanceRating >= rating
                        ? "bg-blue-600 text-white shadow-lg scale-110"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {rating}
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {formData.relevanceRating === 5 ? "Very Relevant" : 
                   formData.relevanceRating === 4 ? "Relevant" :
                   formData.relevanceRating === 3 ? "Somewhat Relevant" :
                   formData.relevanceRating === 2 ? "Not Very Relevant" : "Not Relevant"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How useful are the current features?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, utilityRating: rating })}
                    className={`w-12 h-12 rounded-lg font-bold transition-all duration-200 ${
                      formData.utilityRating >= rating
                        ? "bg-green-600 text-white shadow-lg scale-110"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {rating}
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {formData.utilityRating === 5 ? "Very Useful" : 
                   formData.utilityRating === 4 ? "Useful" :
                   formData.utilityRating === 3 ? "Somewhat Useful" :
                   formData.utilityRating === 2 ? "Not Very Useful" : "Not Useful"}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
