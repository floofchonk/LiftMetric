import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export function OfflineIndicator() {
  const { isOnline } = usePWA();

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
        isOnline
          ? 'bg-green-600 text-white translate-y-20 opacity-0'
          : 'bg-orange-600 text-white translate-y-0 opacity-100'
      }`}
    >
      <div className="flex items-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Back Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Offline Mode - Calculations Still Work</span>
          </>
        )}
      </div>
    </div>
  );
}
