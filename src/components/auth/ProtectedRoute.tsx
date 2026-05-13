import { ReactNode } from 'react';
import { useSession } from '@/lib/auth-client';
import { Loader2, Shield, ArrowRight } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  onSignIn?: () => void;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, onSignIn, fallback }: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sign in required</h3>
          <p className="text-gray-500 text-sm mb-6">
            You need to be signed in to access this feature. Create a free account to get started.
          </p>
          <button
            onClick={onSignIn}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
