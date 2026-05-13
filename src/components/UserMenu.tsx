import React, { useState } from 'react';
import { useSession, signOutUser } from '@/lib/auth-client';
import { AuthModal } from './AuthModal';

interface UserMenuProps {
  onOpenSavedAnalysis: () => void;
}

export function UserMenu({ onOpenSavedAnalysis }: UserMenuProps) {
  const { data: session, isPending } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  if (isPending) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (!session) {
    return (
      <>
        <button
          onClick={() => setShowAuthModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
        >
          <span>👤</span>
          <span>Sign In</span>
        </button>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
          {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase() || '?'}
        </div>
        <span className="text-white hidden sm:block">{session.user.name || session.user.email}</span>
        <svg className={`w-4 h-4 text-white transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600">
              <p className="text-white font-medium">{session.user.name || 'User'}</p>
              <p className="text-blue-100 text-sm truncate">{session.user.email}</p>
            </div>
            <div className="p-2">
              <button
                onClick={() => { onOpenSavedAnalysis(); setShowDropdown(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <span className="text-xl">📁</span>
                <div>
                  <div className="font-medium">My Saved Analyses</div>
                  <div className="text-sm text-gray-500">View all your calculations</div>
                </div>
              </button>
              <button
                onClick={() => { onOpenSavedAnalysis(); setShowDropdown(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <span className="text-xl">📊</span>
                <div>
                  <div className="font-medium">Executive Reports</div>
                  <div className="text-sm text-gray-500">Generated reports</div>
                </div>
              </button>
              <hr className="my-2" />
              <button
                onClick={async () => { await signOutUser(); setShowDropdown(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
              >
                <span className="text-xl">🚪</span>
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
