import { useState } from 'react';
import { useSession, signOutUser } from '@/lib/auth-client';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  ArrowLeft, User, Mail, Shield, Bell, CreditCard, Trash2,
  Save, Loader2, CheckCircle, Eye, EyeOff, Lock, LogOut, Calculator
} from 'lucide-react';

interface AccountSettingsProps {
  onBack?: () => void;
}

type SettingsTab = 'profile' | 'security' | 'notifications' | 'billing' | 'danger';

export function AccountSettings({ onBack }: AccountSettingsProps) {
  const { data: session } = useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile fields
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [profileEmail] = useState(user?.email || '');

  // Security fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Notification prefs
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSignOut = async () => {
    await signOutUser();
    onBack?.();
  };

  const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Please sign in to access settings</p>
        </div>
      </div>
    );
  }

  const userInitial = (user.name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-600 rounded-lg">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Account Settings</h1>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {userInitial}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name || 'User'}</h2>
              <p className="text-gray-500">{user.email}</p>
              <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                Free Plan
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <nav className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-3 border-blue-600'
                      : tab.id === 'danger'
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4.5 h-4.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Success Toast */}
              {saved && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 text-sm font-medium">Settings saved successfully</span>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Profile Information</h3>
                    <p className="text-sm text-gray-500">Update your personal details</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Display Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <input
                          type="email"
                          value={profileEmail}
                          disabled
                          className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all flex items-center gap-2 shadow-md"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Security Settings</h3>
                    <p className="text-sm text-gray-500">Manage your password and security preferences</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <input
                          type={showCurrentPw ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full pl-11 pr-12 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                        />
                        <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showCurrentPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <input
                          type={showNewPw ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full pl-11 pr-12 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                        />
                        <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showNewPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <input
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      {confirmNewPassword.length > 0 && newPassword !== confirmNewPassword && (
                        <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={isSaving || !currentPassword || !newPassword || newPassword !== confirmNewPassword}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all flex items-center gap-2 shadow-md"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                    {isSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Notification Preferences</h3>
                    <p className="text-sm text-gray-500">Choose what updates you receive</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Email Notifications', desc: 'Receive important account updates via email', value: emailNotifs, setter: setEmailNotifs },
                      { label: 'Weekly Digest', desc: 'Get a weekly summary of your calculation activity', value: weeklyDigest, setter: setWeeklyDigest },
                      { label: 'Product Updates', desc: 'Be notified about new features and improvements', value: productUpdates, setter: setProductUpdates },
                    ].map((pref) => (
                      <div key={pref.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{pref.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{pref.desc}</p>
                        </div>
                        <button
                          onClick={() => pref.setter(!pref.value)}
                          className={`relative w-11 h-6 rounded-full transition-colors ${pref.value ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${pref.value ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all flex items-center gap-2 shadow-md"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Billing & Subscription</h3>
                    <p className="text-sm text-gray-500">Manage your plan and payment methods</p>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Free Plan</p>
                        <p className="text-sm text-gray-600 mt-0.5">Basic calculators and limited history</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">CURRENT</span>
                    </div>
                    <button className="mt-4 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
                      Upgrade to Pro
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-700 mb-2">Pro Plan includes:</p>
                    <ul className="space-y-1.5">
                      {['Unlimited calculations', 'Advanced scenario modeling', 'Professional report exports', 'Priority support', 'Team collaboration'].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === 'danger' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-1">Danger Zone</h3>
                    <p className="text-sm text-gray-500">Irreversible actions for your account</p>
                  </div>

                  <div className="p-5 border-2 border-red-200 rounded-xl bg-red-50/50">
                    <h4 className="font-semibold text-gray-900 mb-1">Delete Account</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button className="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors">
                      Delete My Account
                    </button>
                  </div>

                  <div className="p-5 border border-gray-200 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-1">Export Data</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Download all your calculations, reports, and settings as a ZIP file.
                    </p>
                    <button className="px-5 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                      Export All Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
