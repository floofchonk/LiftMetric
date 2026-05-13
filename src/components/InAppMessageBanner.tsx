import { X, Info, CheckCircle, AlertTriangle, Zap, Lightbulb, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

type InAppMessage = {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'upgrade' | 'feature' | 'tip';
  style: 'banner' | 'toast' | 'modal' | 'inline';
  priority: 'low' | 'medium' | 'high';
  ctaText?: string;
  ctaAction?: string;
};

type Props = {
  message: InAppMessage;
  onDismiss: () => void;
  onCTAClick: () => void;
  onDisplay: () => void;
};

const typeStyles = {
  info: 'bg-blue-50 border-blue-200 text-blue-900',
  success: 'bg-green-50 border-green-200 text-green-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  upgrade: 'bg-purple-50 border-purple-200 text-purple-900',
  feature: 'bg-indigo-50 border-indigo-200 text-indigo-900',
  tip: 'bg-teal-50 border-teal-200 text-teal-900',
};

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  upgrade: TrendingUp,
  feature: Zap,
  tip: Lightbulb,
};

const ctaStyles = {
  info: 'bg-blue-600 hover:bg-blue-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  upgrade: 'bg-purple-600 hover:bg-purple-700 text-white',
  feature: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  tip: 'bg-teal-600 hover:bg-teal-700 text-white',
};

export default function InAppMessageBanner({ message, onDismiss, onCTAClick, onDisplay }: Props) {
  const Icon = typeIcons[message.type];

  useEffect(() => {
    onDisplay();
  }, [message.id, onDisplay]);

  const handleCTAClick = () => {
    onCTAClick();
    if (message.ctaAction) {
      if (message.ctaAction.startsWith('http')) {
        window.open(message.ctaAction, '_blank');
      } else if (message.ctaAction.startsWith('/')) {
        window.location.href = message.ctaAction;
      } else {
        const event = new CustomEvent('inAppMessageAction', { 
          detail: { action: message.ctaAction, messageId: message.id } 
        });
        window.dispatchEvent(event);
      }
    }
  };

  if (message.style === 'banner') {
    return (
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl mx-4 opacity-0 animate-in fade-in duration-300">
        <div className={`${typeStyles[message.type]} border rounded-lg shadow-lg p-4 backdrop-blur-sm`}>
          <div className="flex items-start gap-3">
            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">{message.title}</h3>
              <p className="text-sm opacity-90">{message.content}</p>
              {message.ctaText && (
                <button
                  onClick={handleCTAClick}
                  className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${ctaStyles[message.type]}`}
                >
                  {message.ctaText}
                </button>
              )}
            </div>
            <button
              onClick={onDismiss}
              className="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (message.style === 'toast') {
    return (
      <div className="fixed bottom-4 right-4 z-50 opacity-0 animate-in fade-in duration-300">
        <div className={`${typeStyles[message.type]} border rounded-lg shadow-xl p-4 backdrop-blur-sm max-w-sm`}>
          <div className="flex items-start gap-3">
            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">{message.title}</h3>
              <p className="text-sm opacity-90">{message.content}</p>
              {message.ctaText && (
                <button
                  onClick={handleCTAClick}
                  className={`mt-2 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${ctaStyles[message.type]}`}
                >
                  {message.ctaText}
                </button>
              )}
            </div>
            <button
              onClick={onDismiss}
              className="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (message.style === 'inline') {
    return (
      <div className={`${typeStyles[message.type]} border rounded-lg p-4 my-4`}>
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">{message.title}</h3>
            <p className="text-sm opacity-90">{message.content}</p>
            {message.ctaText && (
              <button
                onClick={handleCTAClick}
                className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${ctaStyles[message.type]}`}
              >
                {message.ctaText}
              </button>
            )}
          </div>
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
