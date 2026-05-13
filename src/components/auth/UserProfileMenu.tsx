import { useState, useRef, useEffect } from 'react';
import { useSession, signOutUser } from '@/lib/auth-client';
import { User, Settings, LogOut, CreditCard, History, ChevronDown, Crown, Bell, HelpCircle, Loader2 } from 'lucide-react';

interface UserProfileMenuProps {
  onNavigate?: (view: string) => void;
  onSignIn?: () => void;
}

export function UserProfileMenu({ onNavigate, onSignIn }: UserProfileMenuProps) {
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOutUser();
    setSigningOut(false);
    setIsOpen(false);
  };

  if (isPending) {
    return <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <button
        onClick={onSignIn}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-sm"
      >
        Sign In
      </button>
    );
  }

  const user = session.user;
  const userInitial = (user.name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase();
  const displayName = user.name || 'User';

  const menuItems = [
    { icon: User, label: 'My Profile', action: () => onNavigate?.('account-settings') },
    { icon: History, label: 'Calculation History', action: () => onNavigate?.('calculation-history') },
    { icon: CreditCard, label: 'Billing & Plans', action: () => onNavigate?.('pricing') },
    { icon: Bell, label: 'Notifications', action: () => onNavigate?.('account-settings') },
    { icon: Settings, label: 'Settings', action: () => onNavigate?.('account-settings') },
    { icon: HelpCircle, label: 'Help Center', action: () => onNavigate?.('help') },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
          {userInitial}
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
          {displayName}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 truncate">{displayName}</p>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between p-2 bg-white/70 rounded-lg">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-gray-700">Free Plan</span>
              </div>
              <button
                onClick={() => { onNavigate?.('pricing'); setIsOpen(false); }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Upgrade
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => { item.action(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <item.icon className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Sign Out */}
          <div className="border-t py-2">
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
            >
              {signingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
              <span className="text-sm font-medium">{signingOut ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfileMenu;
