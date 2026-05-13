import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { CheckCircle2, Lightbulb, X } from 'lucide-react';
import { useEntity } from '../hooks/useEntity';
import { featureSuggestionEntityConfig } from '../entities/FeatureSuggestion';

interface FeatureSuggestionFormProps {
  isOpen: boolean;
  onClose: () => void;
  userTier?: string;
}

export function FeatureSuggestionForm({ isOpen, onClose, userTier = 'Free' }: FeatureSuggestionFormProps) {
  const [formData, setFormData] = useState({
    featureName: '',
    description: '',
    email: '',
    wouldPay: 'Maybe' as const,
    category: 'General',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { create } = useEntity(featureSuggestionEntityConfig);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await create({
        featureName: formData.featureName,
        description: formData.description,
        email: formData.email || undefined,
        userTier,
        wouldPay: formData.wouldPay,
        category: formData.category,
        status: 'new',
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          featureName: '',
          description: '',
          email: '',
          wouldPay: 'Maybe',
          category: 'General',
        });
        onClose();
      }, 2500);
    } catch (error) {
      console.error('Failed to submit feature suggestion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank you!</h3>
              <p className="text-gray-600 mb-4">
                Your feature suggestion has been received. Our team will review it and consider it for future releases.
              </p>
              {formData.email && (
                <p className="text-sm text-gray-500">
                  We'll contact you at {formData.email} if we have questions.
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-bold text-gray-900">Suggest a Feature</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feature Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Dark mode theme"
                    value={formData.featureName}
                    onChange={(e) => setFormData({ ...formData, featureName: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <Textarea
                    placeholder="Tell us more about this feature and how it would help you..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="w-full min-h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>General</option>
                    <option>Analytics</option>
                    <option>Export</option>
                    <option>Collaboration</option>
                    <option>Integration</option>
                    <option>Performance</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Would you pay for this feature?
                  </label>
                  <select
                    value={formData.wouldPay}
                    onChange={(e) => setFormData({ ...formData, wouldPay: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Yes</option>
                    <option>Maybe</option>
                    <option>No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (optional - for follow-up)
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.featureName || !formData.description}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Your feedback helps us build better products
                </p>
              </form>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
