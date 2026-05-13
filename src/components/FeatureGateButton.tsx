import React from 'react';
import { Lock, Sparkles } from 'lucide-react';

interface FeatureGateButtonProps {
  featureId: string;
  isAvailable: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'icon';
  showBadge?: boolean;
}

const FeatureGateButton: React.FC<FeatureGateButtonProps> = ({
  featureId,
  isAvailable,
  onClick,
  children,
  className = '',
  variant = 'primary',
  showBadge = true
}) => {
  const baseClasses = {
    primary: 'px-4 py-2 rounded-lg font-semibold transition-all duration-200',
    secondary: 'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
    icon: 'p-2 rounded-lg transition-all duration-200'
  };

  const availableClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    icon: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  };

  const lockedClasses = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-lg transform hover:scale-105 relative',
    secondary: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 relative',
    icon: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 relative'
  };

  const buttonClass = isAvailable 
    ? `${baseClasses[variant]} ${availableClasses[variant]}` 
    : `${baseClasses[variant]} ${lockedClasses[variant]}`;

  return (
    <button
      onClick={onClick}
      className={`${buttonClass} ${className} relative group`}
      title={!isAvailable ? 'Premium feature - Click to upgrade' : ''}
    >
      <span className="flex items-center gap-2">
        {!isAvailable && (
          <Lock className="w-4 h-4 opacity-90" />
        )}
        {children}
        {!isAvailable && showBadge && (
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm">
            PRO
          </span>
        )}
      </span>
      {!isAvailable && (
        <span className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
      )}
    </button>
  );
};

export default FeatureGateButton;
