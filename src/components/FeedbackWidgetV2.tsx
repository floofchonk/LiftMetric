import React, { useState } from 'react';
import { MessageSquare, X, Send, CheckCircle, Bug, Lightbulb, Heart, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useEntity } from '../hooks/useEntity';
import { feedbackSubmissionEntityConfig } from '../entities/FeedbackSubmission';
import { useAnalytics } from '../hooks/useAnalytics';

type FeedbackSubmission = {
  id: number;
  category: string;
  message: string;
  email: string;
  userId: string;
  userAgent: string;
  url: string;
  status: string;
  adminNotes: string;
  created_at: string;
  updated_at: string;
};

const feedbackTypes = [
  { id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-500' },
  { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-yellow-500' },
  { id: 'praise', label: 'Praise', icon: Heart, color: 'text-pink-500' },
  { id: 'other', label: 'Other', icon: HelpCircle, color: 'text-gray-500' },
];

export const FeedbackWidgetV2: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { create } = useEntity<FeedbackSubmission>(feedbackSubmissionEntityConfig);
  const { trackEvent } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackType || !message.trim()) return;

    await create({
      category: feedbackType,
      message: message.trim(),
      email: email.trim() || '',
      userId: 'anonymous',
      userAgent: navigator.userAgent,
      url: window.location.href,
      status: 'new',
      adminNotes: '',
    });

    try {
      trackEvent('feedback_submitted', 'engagement', { type: feedbackType });
    } catch (e) {
      console.error('Analytics error:', e);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitted(false);
      setMessage('');
      setEmail('');
      setFeedbackType('');
    }, 2000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-110"
        aria-label="Send Feedback"
      >
        <MessageSquare className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Send Feedback</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-blue-100 mt-1">We&apos;d love to hear from you!</p>
      </div>

      {isSubmitted ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Thank You!</h4>
          <p className="text-sm text-gray-600">Your feedback has been submitted.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4">
          {/* Feedback Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What type of feedback?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {feedbackTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFeedbackType(type.id)}
                  className={`p-2 rounded-lg border text-sm flex items-center gap-2 transition-all ${
                    feedbackType === type.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <type.icon className={`w-4 h-4 ${type.color}`} />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what's on your mind..."
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>

          {/* Email (optional) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">For follow-up if needed</p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!feedbackType || !message.trim()}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Feedback
          </Button>
        </form>
      )}
    </div>
  );
};

export default FeedbackWidgetV2;
