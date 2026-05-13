import React from 'react';
import { X, Check, Star, TrendingUp, Save, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SignupPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculationsUsed: number;
  scenariosCount: number;
}

export function SignupPromptModal({ isOpen, onClose, calculationsUsed, scenariosCount }: SignupPromptModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Unlock Full Access</h2>
          </div>
          <p className="text-blue-100 text-lg">
            You've used {calculationsUsed} calculations and created {scenariosCount} scenarios. 
            Sign up to save your work and unlock unlimited features!
          </p>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Free Plan</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">3 calculations per session</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Basic calculator mode</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Session-based storage</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Continue as Guest
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6 relative">
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                RECOMMENDED
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pro Account</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span className="text-gray-700"><strong>Unlimited</strong> calculations</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span className="text-gray-700">Advanced & custom modes</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span className="text-gray-700">Save unlimited scenarios</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span className="text-gray-700">Scenario comparison</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span className="text-gray-700">Email alerts & notifications</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span className="text-gray-700">Custom branding on reports</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span className="text-gray-700">PDF & CSV exports</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/signup')}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-lg"
              >
                Sign Up Free
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 rounded-full p-3">
                <Save className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Don't Lose Your Work!</h4>
                <p className="text-gray-700 text-sm">
                  Your {scenariosCount} scenarios and calculations will be permanently saved when you create an account. 
                  All your guest data will be automatically migrated to your new account.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
