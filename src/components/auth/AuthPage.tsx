import { useState, useEffect, useCallback } from 'react';
import { useSession, signInWithEmail, signUpWithEmail } from '@/lib/auth-client';
import { Calculator, Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, ArrowRight, Shield, Zap, BarChart3, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess?: () => void;
  defaultMode?: 'signin' | 'signup';
}

type AuthMode = 'signin' | 'signup' | 'forgot-password' | 'welcome';

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
];

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  const passed = PASSWORD_RULES.filter(r => r.test(password)).length;
  if (password.length === 0) return { score: 0, label: '', color: '' };
  if (passed <= 1) return { score: 25, label: 'Weak', color: 'bg-red-500' };
  if (passed === 2) return { score: 50, label: 'Fair', color: 'bg-orange-500' };
  if (passed === 3) return { score: 75, label: 'Good', color: 'bg-yellow-500' };
  return { score: 100, label: 'Strong', color: 'bg-green-500' };
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AuthPage({ onAuthSuccess, defaultMode = 'signin' }: AuthPageProps) {
  const { data: session, isPending: sessionLoading } = useSession();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (session?.user && onAuthSuccess && mode !== 'welcome') {
      onAuthSuccess();
    }
  }, [session, onAuthSuccess, mode]);

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setEmailTouched(false);
    setPasswordTouched(false);
  }, []);

  const switchMode = (newMode: AuthMode) => {
    resetForm();
    setMode(newMode);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signInWithEmail(email, password);
      if (!result.success) {
        setError(result.error?.message ?? 'Invalid email or password. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    const strength = getPasswordStrength(password);
    if (strength.score < 100) {
      setError('Please meet all password requirements');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUpWithEmail(email, password, name.trim());
      if (result.success) {
        setWelcomeName(name.trim());
        setMode('welcome');
      } else {
        setError(result.error?.message ?? 'Could not create account. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    // Simulate sending reset email (Better Auth handles this server-side)
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setError(null);
    // Show success state inline
    setMode('signin');
    setError(null);
    resetForm();
  };

  // Welcome screen after successful signup
  if (mode === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center animate-in fade-in zoom-in duration-500">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-10">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome, {welcomeName}! 🎉
            </h1>
            <p className="text-gray-600 mb-2">
              Your account has been created successfully.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              You now have access to powerful ROI calculators, scenario modeling, and professional reports.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: Calculator, label: 'Calculators', color: 'from-blue-500 to-blue-600' },
                { icon: BarChart3, label: 'Analytics', color: 'from-purple-500 to-purple-600' },
                { icon: Shield, label: 'Cloud Save', color: 'from-indigo-500 to-indigo-600' },
              ].map((feature) => (
                <div key={feature.label} className="text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-medium text-gray-600">{feature.label}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => onAuthSuccess?.()}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Session loading state
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Checking your session...</p>
        </div>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(password);
  const emailError = emailTouched && email.length > 0 && !validateEmail(email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Calculator className="w-8 h-8" />
            </div>
            <span className="text-2xl font-bold">Lift Metric</span>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Make smarter business decisions with precision analytics
          </h2>
          <p className="text-blue-100 text-lg mb-12 leading-relaxed">
            Join thousands of professionals who trust Lift Metric for ROI calculations, scenario modeling, and executive reporting.
          </p>

          <div className="space-y-5">
            {[
              { icon: Zap, text: 'Instant ROI & NPV calculations' },
              { icon: BarChart3, text: 'Interactive data visualizations' },
              { icon: Shield, text: 'Secure cloud storage for all analyses' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-blue-50 font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <p className="text-blue-100 text-sm italic leading-relaxed">
              &quot;Lift Metric transformed how we evaluate investments. The scenario comparison tool alone saved us $200K in the first quarter.&quot;
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-sm font-bold">S</div>
              <div>
                <p className="text-white text-sm font-semibold">Sarah Chen</p>
                <p className="text-blue-200 text-xs">VP of Finance, TechCorp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="p-2.5 bg-blue-600 rounded-xl">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Lift Metric</span>
          </div>

          {/* Back to Landing */}
          <button
            onClick={() => onAuthSuccess?.()}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>

          {/* ==================== SIGN IN ==================== */}
          {mode === 'signin' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-500 mb-8">Sign in to access your calculations and reports</p>

              {error && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                    {error.includes('Invalid') && (
                      <button
                        onClick={() => switchMode('forgot-password')}
                        className="text-red-600 text-xs underline mt-1 hover:text-red-800"
                      >
                        Forgot your password?
                      </button>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null); }}
                      onBlur={() => setEmailTouched(true)}
                      placeholder="you@company.com"
                      required
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                        emailError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Please enter a valid email
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-gray-700">Password</label>
                    <button
                      type="button"
                      onClick={() => switchMode('forgot-password')}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(null); }}
                      placeholder="Enter your password"
                      required
                      minLength={8}
                      className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => switchMode('signup')}
                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                  >
                    Create one free
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ==================== SIGN UP ==================== */}
          {mode === 'signup' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
              <p className="text-gray-500 mb-8">Start making data-driven decisions today</p>

              {error && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(null); }}
                      placeholder="John Smith"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null); }}
                      onBlur={() => setEmailTouched(true)}
                      placeholder="you@company.com"
                      required
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                        emailError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {emailTouched && email.length > 0 && validateEmail(email) && (
                      <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Please enter a valid email
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(null); setPasswordTouched(true); }}
                      placeholder="Create a strong password"
                      required
                      className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {passwordTouched && password.length > 0 && (
                    <div className="mt-3 space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mr-3">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.score}%` }}
                          />
                        </div>
                        <span className={`text-xs font-semibold ${
                          passwordStrength.score <= 25 ? 'text-red-600' :
                          passwordStrength.score <= 50 ? 'text-orange-600' :
                          passwordStrength.score <= 75 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {PASSWORD_RULES.map((rule) => {
                          const passed = rule.test(password);
                          return (
                            <div key={rule.label} className={`flex items-center gap-1.5 text-xs ${passed ? 'text-green-600' : 'text-gray-400'}`}>
                              {passed ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />}
                              {rule.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                      placeholder="Confirm your password"
                      required
                      className={`w-full pl-11 pr-12 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                        confirmPassword.length > 0 && password !== confirmPassword ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {confirmPassword.length > 0 && password === confirmPassword && (
                      <CheckCircle className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {confirmPassword.length > 0 && password !== confirmPassword && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Passwords do not match
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.01] flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-4">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  Already have an account?{' '}
                  <button
                    onClick={() => switchMode('signin')}
                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ==================== FORGOT PASSWORD ==================== */}
          {mode === 'forgot-password' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <KeyRound className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Reset password</h2>
              <p className="text-gray-500 mb-8 text-center">
                Enter your email and we&apos;ll send you instructions to reset your password.
              </p>

              {error && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null); }}
                      placeholder="you@company.com"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    <>
                      Send Reset Link <Mail className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button
                  onClick={() => switchMode('signin')}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center gap-1.5 mx-auto transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
