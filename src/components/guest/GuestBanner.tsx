import React from 'react';
import { UserPlus, Clock, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGuestSessionStats } from '../../lib/guestAccess';

export function GuestBanner() {
  const navigate = useNavigate();
  const stats = getGuestSessionStats();

  if (stats.calculationsRemaining <= 0) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Calculator className="w-6 h-6" />
            <div>
              <p className="font-semibold text-lg">Free Trial Expired</p>
              <p className="text-sm text-red-100">
                You've used all {stats.calculationsUsed} free calculations. Sign up to continue!
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            Sign Up Now
          </button>
        </div>
      </div>
    );
  }

  if (stats.calculationsRemaining <= 1) {
    return (
      <div className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Clock className="w-6 h-6" />
            <div>
              <p className="font-semibold text-lg">Last Free Calculation!</p>
              <p className="text-sm text-orange-100">
                You have {stats.calculationsRemaining} calculation remaining. Sign up to unlock unlimited access!
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
          >
            Get Unlimited Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <UserPlus className="w-6 h-6" />
          <div>
            <p className="font-semibold text-lg">You're using Lift Metric as a guest</p>
            <p className="text-sm text-blue-100">
              {stats.calculationsRemaining} free calculations remaining. Sign up to save your work and get unlimited access!
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/signup')}
          className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Sign Up Free
        </button>
      </div>
    </div>
  );
}
