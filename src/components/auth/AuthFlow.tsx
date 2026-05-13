/**
 * AuthFlow - Orchestrates the complete authentication experience.
 * Handles transitions between sign-in, sign-up, forgot password,
 * and the personalized welcome screen after successful registration.
 * 
 * Uses Shipper Cloud (Better Auth) for real authentication.
 */
import { useSession } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import { AuthPage } from './AuthPage';

interface AuthFlowProps {
  onAuthSuccess: () => void;
  defaultMode?: 'signin' | 'signup';
}

export function AuthFlow({ onAuthSuccess, defaultMode = 'signin' }: AuthFlowProps) {
  const { data: session, isPending } = useSession();

  // If session is loading, show a centered spinner
  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading your session...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, redirect immediately
  if (session?.user) {
    // Use a microtask to avoid calling setState during render
    queueMicrotask(() => onAuthSuccess());
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <AuthPage onAuthSuccess={onAuthSuccess} defaultMode={defaultMode} />;
}

export default AuthFlow;
