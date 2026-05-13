import { useState } from 'react';
import { X, Send, CheckCircle, AlertCircle, Bug, Lightbulb, MessageSquare, Heart, HelpCircle } from 'lucide-react';
import { useEntity } from '../hooks/useEntity';
import { feedbackEntityConfig } from '../entities/Feedback';

type FeedbackCategory = 'bug' | 'feature' | 'suggestion' | 'praise' | 'other';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Feedback = {
  id: number;
  category: FeedbackCategory;
  message: string;
  email: string;
  status: string;
  userAgent: string;
  url: string;
  created_at: string;
  updated_at: string;
};

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { create, loading } = useEntity<Feedback>(feedbackEntityConfig);
  const [category, setCategory] = useState<FeedbackCategory>('suggestion');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: 'bug' as const, label: 'Bug Report', icon: Bug, color: 'red' },
    { value: 'feature' as const, label: 'Feature Request', icon: Lightbulb, color: 'yellow' },
    { value: 'suggestion' as const, label: 'Suggestion', icon: MessageSquare, color: 'blue' },
    { value: 'praise' as const, label: 'Praise', icon: Heart, color: 'pink' },
    { value: 'other' as const, label: 'Other', icon: HelpCircle, color: 'gray' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError('Please enter your feedback message');
      return;
    }

    try {
      await create({
        category,
        message: message.trim(),
        email: email.trim(),
        status: 'new',
        userAgent: navigator.userAgent,
        url: window.location.href,
      });

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (err) {
      setError('Failed to submit feedback. Please try again or check your connection.');
      console.error('Feedback submission error:', err);
    }
  };

  const resetForm = () => {
    setCategory('suggestion');
    setMessage('');
    setEmail('');
    setSubmitted(false);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Send Feedback</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Thank You!
              </h3>
              <p className="text-gray-600">
                Your feedback has been submitted successfully. We appreciate your input!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Feedback Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? `border-${cat.color}-500 bg-${cat.color}-50`
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 mx-auto mb-2 ${
                            isSelected ? `text-${cat.color}-600` : 'text-gray-400'
                          }`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            isSelected ? `text-${cat.color}-700` : 'text-gray-600'
                          }`}
                        >
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be as detailed as possible to help us understand your feedback better.
                </p>
              </div>

              {/* Email (optional) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide your email if you'd like us to follow up with you.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
