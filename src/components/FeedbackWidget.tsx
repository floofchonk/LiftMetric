import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const feedbackStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shrink {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('feedback-styles')) {
  const style = document.createElement('style');
  style.id = 'feedback-styles';
  style.textContent = feedbackStyles;
  document.head.appendChild(style);
}

type FeedbackState = 'closed' | 'open' | 'submitted';

interface FeedbackData {
  message: string;
  email?: string;
  name?: string;
}

export function FeedbackWidget() {
  const [state, setState] = useState<FeedbackState>('closed');
  const [feedback, setFeedback] = useState<FeedbackData>({
    message: '',
    email: '',
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => setState('open');

  const handleClose = () => {
    setState('closed');
    setFeedback({ message: '', email: '', name: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.message.trim()) {
      alert('Please enter your feedback');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call - in production, send to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store feedback in localStorage for demonstration
      const feedbackHistory = JSON.parse(localStorage.getItem('lift_metric_feedback') || '[]');
      feedbackHistory.push({
        ...feedback,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('lift_metric_feedback', JSON.stringify(feedbackHistory));

      setState('submitted');
      
      // Auto-close after 4 seconds
      setTimeout(() => {
        handleClose();
      }, 4000);
    } catch (error) {
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* Feedback Button */}
      {state === 'closed' && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 z-40 group"
          aria-label="Open feedback widget"
        >
          <MessageCircle size={24} />
          <span className="absolute bottom-full right-0 mb-3 whitespace-nowrap bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Share your feedback
          </span>
        </button>
      )}

      {/* Feedback Panel */}
      {state === 'open' && (
        <div 
          className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl z-50 transform transition-all duration-300"
          style={{
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <h3 className="font-bold text-lg">Send us your feedback</h3>
            <button
              onClick={handleClose}
              className="hover:bg-white/20 p-1 rounded-lg transition-colors duration-200"
              aria-label="Close feedback widget"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Feedback Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                Your feedback *
              </label>
              <textarea
                id="message"
                name="message"
                value={feedback.message}
                onChange={handleInputChange}
                placeholder="Tell us what you think, what features you'd like to see, or any issues you've encountered..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {feedback.message.length}/500
              </p>
            </div>

            {/* Optional Contact Info */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                📧 <span className="font-medium">Optional:</span> Leave your contact info if you'd like us to respond
              </p>

              <input
                type="text"
                name="name"
                value={feedback.name}
                onChange={handleInputChange}
                placeholder="Your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />

              <input
                type="email"
                name="email"
                value={feedback.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !feedback.message.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send size={16} />
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success Message */}
      {state === 'submitted' && (
        <div 
          className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl z-50 transform transition-all duration-300 overflow-hidden"
          style={{
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 text-center">
            <div className="text-5xl mb-3">✨</div>
            <h3 className="font-bold text-xl mb-1">Thank you!</h3>
            <p className="text-green-50">We appreciate your feedback</p>
          </div>

          {/* Success Message */}
          <div className="p-6 text-center space-y-3">
            <p className="text-gray-700 font-medium">
              Your feedback has been received and will help us improve Lift Metric.
            </p>
            {feedback.email && (
              <p className="text-sm text-gray-600">
                We'll be in touch at <span className="font-semibold">{feedback.email}</span>
              </p>
            )}
            <p className="text-xs text-gray-500 mt-4">
              This panel will close automatically...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-200">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              style={{
                animation: 'shrink 4s linear forwards',
              }}
            ></div>
          </div>
        </div>
      )}
    </>
  );
}
