import { RefreshCw } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export function PWAUpdateNotification() {
  const { updateAvailable, applyUpdate } = usePWA();

  if (!updateAvailable) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <div className="bg-blue-600 text-white rounded-lg shadow-2xl p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <RefreshCw className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold mb-1">Update Available</h4>
            <p className="text-sm text-blue-100 mb-3">
              A new version of Lift Metric is ready to install.
            </p>
            <button
              onClick={applyUpdate}
              className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
            >
              Update Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
