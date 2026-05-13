import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from './components/ui/button';
import SubscriptionPlans from './components/SubscriptionPlans';
import PricingWithCheckout from './components/PricingWithCheckout';
import UpgradePromptDemo from './components/UpgradePromptDemo';
import ForumPage from './components/ForumPage';
import DashboardPage from './components/DashboardPage';
import { FeedbackWidget } from './components/FeedbackWidget';
import OnboardingFlow from './components/OnboardingFlow';
import OnboardingTriggerButton from './components/OnboardingTriggerButton';
import SubscriptionManagement from './components/SubscriptionManagement';
import ReportGenerator from './components/ReportGenerator';
import PremiumFeatures from './components/PremiumFeatures';
import ROICalculator from './components/ROICalculator';
import { CalculatorPage } from './pages/CalculatorPage';
import HelpCenter from './components/HelpCenter';
import ReferralProgram from './components/ReferralProgram';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import AnnouncementManager from './components/AnnouncementManager';
import { initGA4, trackPageView } from './lib/ga4';
import { updatePageSEO, addStructuredData } from './lib/seo';
import { useOnboarding } from './hooks/useOnboarding';
import { OnboardingTour } from './components/OnboardingTour';
import { InteractiveOnboarding } from './components/InteractiveOnboarding';
import { FeedbackWidgetV2 } from './components/FeedbackWidgetV2';
import { TourStatisticsDashboard } from './components/TourStatisticsDashboard';
import { FeedbackStatisticsDashboard } from './components/FeedbackStatisticsDashboard';
import TestimonialSubmission from './components/TestimonialSubmission';
import TestimonialShowcase from './components/TestimonialShowcase';
import TestimonialAdmin from './components/TestimonialAdmin';
import SocialShareButton from './components/SocialShareButton';
import MarketingDashboard from './components/MarketingDashboard';
import { ExportCalculationsModal } from './components/ExportCalculationsModal';
import { FeedbackPortal } from './components/FeedbackPortal';
import { FeedbackAdminPanel } from './components/FeedbackAdminPanel';
import ScientificCalculator from './components/ScientificCalculator';
import ScenarioModeling from './components/ScenarioModeling';
import BrandingStudio from './components/BrandingStudio';
import EmailMarketingAutomation from './components/EmailMarketingAutomation';
import EmailAutomationDashboard from './components/EmailAutomationDashboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import LandingPage from './components/LandingPage';
import DataExportPage from './components/DataExportPage';
import AppStoreAssets from './components/AppStoreAssets';
import TestimonialsDisplay from './components/TestimonialsDisplay';
import TestimonialsAdmin from './components/TestimonialsAdmin';
import PersonalizedDashboard from './components/PersonalizedDashboard';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { PWAUpdateNotification } from './components/PWAUpdateNotification';
import { OfflineIndicator } from './components/OfflineIndicator';
import { FeedbackButton } from './components/FeedbackButton';
import { ChartVisualization } from './components/ChartVisualization';
import BrandSettingsPanel from './components/BrandSettingsPanel';
import { CalculationHistory } from './components/CalculationHistory';
import CalculatorWithFeatures from './components/CalculatorWithFeatures';
import FeedbackForm from './components/FeedbackForm';
import FeedbackAdmin from './components/FeedbackAdmin';
import ShareCalculationModal from './components/ShareCalculationModal';
import ManageSharedCalculations from './components/ManageSharedCalculations';
import CollaborationView from './components/CollaborationView';
import ReportTemplateBuilder from './components/ReportTemplateBuilder';
import ApiIntegrationManager from './components/ApiIntegrationManager';
import LiveDataFeed from './components/LiveDataFeed';
import DataVisualization from './components/DataVisualization';
import PricingComparison from './components/PricingComparison';
import { SideBySideComparison } from './components/SideBySideComparison';
import { ProfessionalReportGenerator } from './components/ProfessionalReportGenerator';
import { PresentationView } from './components/PresentationView';
import { UserMenu } from './components/UserMenu';
import { AuthPage, AuthFlow, AccountSettings, UserProfileMenu, ProtectedRoute } from './components/auth';
import { SavedAnalysisView } from './components/SavedAnalysisView';
import { CloudSaveButton } from './components/CloudSaveButton';
import { MySavedAnalysis } from './components/MySavedAnalysis';
import { SaveCalculationModal } from './components/SaveCalculationModal';
import { AutoSaveIndicator } from './components/AutoSaveIndicator';

export type ImplementationOption = 'direct-hire' | 'contractors' | 'outsource' | 'hybrid';

export interface CalculatorInputs {
  companySize: string;
  industry: string;
  projectScope: string;
  annualVolume: string;
  currentSpend: string;
  timelineMonths?: number;
  customCosts?: DynamicLineItem[];
  customBenefits?: DynamicLineItem[];
}

export interface DynamicLineItem {
  id: string;
  label: string;
  value: string | number;
}

export interface StaffingOption {
  type: ImplementationOption;
  label: string;
  yearOneTotal: number;
  yearThreeTotal: number;
  setupTime: number;
  ongoingMonthly: number;
  riskLevel: 'low' | 'medium' | 'high';
  flexibilityScore: number;
  qualityScore: number;
  breakdown: Record<string, number>;
  pros: string[];
  cons: string[];
}

export interface CalculatorResults {
  options: StaffingOption[];
  staffingOptions?: StaffingOption[];
  recommendations: string[];
  bestOption: ImplementationOption;
  paybackPeriod: number;
}

export interface Scenario {
  id: string;
  name: string;
  inputs: CalculatorInputs;
  results: CalculatorResults;
  createdAt: string;
}

type View = 
  | 'landing'
  | 'home' 
  | 'calculator' 
  | 'roi-calculator' 
  | 'pricing' 
  | 'plans' 
  | 'upgrade-demo' 
  | 'forum' 
  | 'dashboard' 
  | 'checkout' 
  | 'subscription' 
  | 'staffing-calculator' 
  | 'help' 
  | 'referral' 
  | 'announcements' 
  | 'tour-stats' 
  | 'feedback-stats' 
  | 'testimonials' 
  | 'testimonial-submit' 
  | 'testimonial-admin' 
  | 'marketing-analytics' 
  | 'feedback-portal' 
  | 'feedback-admin' 
  | 'scientific-calculator' 
  | 'email-automation'
  | 'email-dashboard'
  | 'privacy'
  | 'terms'
  | 'data-export'
  | 'app-store'
  | 'testimonials-section'
  | 'testimonials-mgmt'
  | 'personalized-dashboard'
  | 'brand-settings'
  | 'advanced-calculator'
  | 'branding-studio'
  | 'scenario-modeling'
  | 'chart-visualization'
  | 'data-visualization'
  | 'pricing-comparison'
  | 'calculation-history'
  | 'auth'
  | 'account-settings';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showFeedbackAdmin, setShowFeedbackAdmin] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showManageShares, setShowManageShares] = useState(false);
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [showApiIntegration, setShowApiIntegration] = useState(false);
  const [showLiveDataFeed, setShowLiveDataFeed] = useState(false);
  const [showSideBySideComparison, setShowSideBySideComparison] = useState(false);
  const [showSavedAnalysis, setShowSavedAnalysis] = useState(false);
  const [showScenarioModeling, setShowScenarioModeling] = useState(false);
  const [showProfessionalReport, setShowProfessionalReport] = useState(false);
  const [showPresentationView, setShowPresentationView] = useState(false);
  const [calculationToShare, setCalculationToShare] = useState<any>(null);
  const [tourType, setTourType] = useState<'basic_mode' | 'scientific_mode' | 'history_panel' | 'full_tour'>('full_tour');
  const userId = 'demo-user-123';
  const userTier: 'free' | 'basic' | 'pro' = 'free';
  const { shouldShowOnboarding, isLoading } = useOnboarding(userId);

  useEffect(() => {
    if (!isLoading && shouldShowOnboarding) {
      setShowOnboarding(true);
    }
  }, [shouldShowOnboarding, isLoading]);

  useEffect(() => {
    initGA4();
    addStructuredData();
  }, []);

  useEffect(() => {
    const pageMap: Record<View, string> = {
      landing: 'home',
      home: 'home',
      calculator: 'calculator',
      'staffing-calculator': 'calculator',
      'roi-calculator': 'calculator',
      pricing: 'pricing',
      plans: 'pricing',
      'upgrade-demo': 'pricing',
      forum: 'forum',
      dashboard: 'home',
      checkout: 'pricing',
      subscription: 'pricing',
      help: 'help',
      referral: 'referral',
      announcements: 'home',
      'tour-stats': 'analytics',
      'personalized-dashboard': 'home',
      'feedback-stats': 'analytics',
      'testimonials': 'home',
      'testimonial-submit': 'home',
      'testimonial-admin': 'home',
      'marketing-analytics': 'analytics',
      'feedback-portal': 'feedback',
      'feedback-admin': 'feedback',
      'scientific-calculator': 'calculator',
      'email-automation': 'email',
      'email-dashboard': 'email',
      'privacy': 'privacy',
      'terms': 'terms',
      'data-export': 'privacy',
      'app-store': 'home',
      'testimonials-section': 'testimonials',
      'testimonials-mgmt': 'testimonials',
      'brand-settings': 'settings',
      'advanced-calculator': 'calculator',
      'branding-studio': 'settings',
      'scenario-modeling': 'calculator',
      'chart-visualization': 'calculator',
      'data-visualization': 'calculator',
      'pricing-comparison': 'pricing',
      'calculation-history': 'calculator',
      'auth': 'auth',
      'account-settings': 'settings',
    };
    const seoPage = pageMap[view] as any;
    updatePageSEO(seoPage);
    trackPageView(`/${view}`, document.title);
  }, [view]);

  const handleOnboardingComplete = (settings: any) => {
    setShowOnboarding(false);
    console.log('User settings:', settings);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
  };

  const handleUpgradeClick = () => {
    setShowOnboarding(false);
    setView('pricing');
  };

  // Show landing page first, then dashboard after login
  if (view === 'landing') {
    return (
      <LandingPage 
        onGetStarted={() => setView('dashboard')} 
        onLogin={() => setView('auth')}
      />
    );
  }

  // Authentication page
  if (view === 'auth') {
    return (
      <AuthFlow 
        onAuthSuccess={() => setView('dashboard')}
        defaultMode="signin"
      />
    );
  }

  // Account settings page (protected)
  if (view === 'account-settings') {
    return (
      <AccountSettings 
        onBack={() => setView('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
              <div className="p-2 bg-blue-600 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lift Metric</h1>
                <p className="text-sm text-gray-600">Implementation ROI Calculator</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <UserProfileMenu 
                onNavigate={(v) => setView(v as View)} 
                onSignIn={() => setView('auth')}
              />
              <Button
                variant="outline"
                onClick={() => setShowSavedAnalysis(true)}
                size="sm"
              >
                📁 My Analyses
              </Button>
              <Button
                variant={view === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setView('dashboard')}
                size="sm"
              >
                Dashboard
              </Button>
              <Button
                variant={view === 'staffing-calculator' ? 'default' : 'outline'}
                onClick={() => setView('staffing-calculator')}
                size="sm"
              >
                Staffing
              </Button>
              <Button
                variant={view === 'roi-calculator' ? 'default' : 'outline'}
                onClick={() => setView('roi-calculator')}
                size="sm"
              >
                ROI
              </Button>
              <Button
                variant={view === 'scientific-calculator' ? 'default' : 'outline'}
                onClick={() => setView('scientific-calculator')}
                size="sm"
              >
                🔬 Scientific
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowScenarioModeling(true)}
                size="sm"
              >
                📊 Scenarios
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowProfessionalReport(true)}
                size="sm"
              >
                📄 Report
              </Button>
              <Button
                variant={view === 'data-visualization' ? 'default' : 'outline'}
                onClick={() => setView('data-visualization')}
                size="sm"
              >
                📈 Visualizations
              </Button>
              <Button
                variant="outline"
                onClick={() => setView('branding-studio')}
                size="sm"
              >
                🎨 Branding
              </Button>
              <Button
                variant={view === 'pricing-comparison' ? 'default' : 'outline'}
                onClick={() => setView('pricing-comparison')}
                size="sm"
              >
                💎 Pricing
              </Button>
              <Button
                variant={view === 'calculation-history' ? 'default' : 'outline'}
                onClick={() => setView('calculation-history')}
                size="sm"
              >
                📜 History
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPresentationView(true)}
                size="sm"
              >
                🎯 Present
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSideBySideComparison(true)}
                size="sm"
              >
                ⚖️ Compare
              </Button>
              <Button
                variant={view === 'pricing' ? 'default' : 'outline'}
                onClick={() => setView('pricing')}
                size="sm"
              >
                Pricing
              </Button>
              <Button
                variant={view === 'forum' ? 'default' : 'outline'}
                onClick={() => setView('forum')}
                size="sm"
              >
                Forum
              </Button>
              <Button
                variant={view === 'help' ? 'default' : 'outline'}
                onClick={() => setView('help')}
                size="sm"
              >
                Help
              </Button>
              <Button
                variant={view === 'referral' ? 'default' : 'outline'}
                onClick={() => setView('referral')}
                size="sm"
              >
                Refer
              </Button>
              <Button
                variant={view === 'tour-stats' ? 'default' : 'outline'}
                onClick={() => setView('tour-stats')}
                size="sm"
              >
                📊 Tours
              </Button>
              <Button
                variant={view === 'feedback-stats' ? 'default' : 'outline'}
                onClick={() => setView('feedback-stats')}
                size="sm"
              >
                💬 Feedback
              </Button>
              <Button
                variant={view === 'testimonials' ? 'default' : 'outline'}
                onClick={() => setView('testimonials')}
                size="sm"
              >
                ⭐ Reviews
              </Button>
              <Button
                variant={view === 'marketing-analytics' ? 'default' : 'outline'}
                onClick={() => setView('marketing-analytics')}
                size="sm"
              >
                📈 Analytics
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowApiIntegration(true)}
                size="sm"
              >
                🔌 API Hub
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowLiveDataFeed(true)}
                size="sm"
              >
                📡 Live Data
              </Button>
              <Button
                variant={view === 'feedback-portal' ? 'default' : 'outline'}
                onClick={() => setView('feedback-portal')}
                size="sm"
              >
                💭 Feedback
              </Button>
              <Button
                variant={view === 'email-automation' ? 'default' : 'outline'}
                onClick={() => setView('email-automation')}
                size="sm"
              >
                📧 Email Auto
              </Button>
              <Button
                variant={view === 'personalized-dashboard' ? 'default' : 'outline'}
                onClick={() => setView('personalized-dashboard')}
                size="sm"
              >
                🎯 My Dashboard
              </Button>
              <Button
                variant={view === 'brand-settings' ? 'default' : 'outline'}
                onClick={() => setView('brand-settings')}
                size="sm"
              >
                🎨 Branding
              </Button>
              <Button
                variant={view === 'advanced-calculator' ? 'default' : 'outline'}
                onClick={() => setView('advanced-calculator')}
                size="sm"
              >
                🚀 Advanced Calc
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowOnboarding(true)}
                size="sm"
              >
                🎓 Take Tour
              </Button>
              <Button
                variant={view === 'chart-visualization' ? 'default' : 'outline'}
                onClick={() => setView('chart-visualization')}
                size="sm"
              >
                📊 Charts
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFeedbackForm(true)}
                size="sm"
              >
                💬 Give Feedback
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFeedbackAdmin(true)}
                size="sm"
              >
                📊 Manage Feedback
              </Button>
              <Button
                variant={view === 'email-dashboard' ? 'default' : 'outline'}
                onClick={() => setView('email-dashboard')}
                size="sm"
              >
                📊 Email Dash
              </Button>
              <Button
                variant={view === 'privacy' ? 'default' : 'outline'}
                onClick={() => setView('privacy')}
                size="sm"
              >
                🔒 Privacy
              </Button>
              <Button
                variant={view === 'terms' ? 'default' : 'outline'}
                onClick={() => setView('terms')}
                size="sm"
              >
                📄 Terms
              </Button>
              <Button
                variant={view === 'data-export' ? 'default' : 'outline'}
                onClick={() => setView('data-export')}
                size="sm"
              >
                💾 Data
              </Button>
              <Button
                variant={view === 'app-store' ? 'default' : 'outline'}
                onClick={() => setView('app-store')}
                size="sm"
              >
                📱 Store
              </Button>
              <Button
                variant={view === 'testimonials-section' ? 'default' : 'outline'}
                onClick={() => setView('testimonials-section')}
                size="sm"
              >
                ⭐ Success Stories
              </Button>
              <Button
                variant={view === 'testimonials-mgmt' ? 'default' : 'outline'}
                onClick={() => setView('testimonials-mgmt')}
                size="sm"
              >
                📝 Manage Reviews
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCalculationToShare({ type: 'roi', title: 'Sample ROI Calculation', result: 45000 });
                  setShowShareModal(true);
                }}
                size="sm"
              >
                🔗 Share
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowManageShares(true)}
                size="sm"
              >
                👥 My Shares
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowTemplateBuilder(true)}
                size="sm"
              >
                📄 Report Templates
              </Button>
              <OnboardingTriggerButton onClick={() => setShowOnboarding(true)} />
            </div>
          </div>
        </div>
      </header>

      {/* Onboarding Flow */}
      {showOnboarding && (
        <OnboardingFlow
          onClose={() => setShowOnboarding(false)}
        />
      )}

      {/* Interactive Onboarding Tour */}
      {showTour && (
        <OnboardingTour
          tourType={tourType}
          isOpen={showTour}
          onClose={() => setShowTour(false)}
          userId={userId}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {view === 'home' && (
          <>
            <div className="text-center">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Make Data-Driven Staffing Decisions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                Understand the full cost of implementing your solution and compare different staffing options side by side.
              </p>
              <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100">
                <p className="text-lg text-gray-600 mb-8">
                  Calculate your implementation ROI instantly
                </p>
                <Button 
                  onClick={() => setView('calculator')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Get Started
                </Button>
              </div>
            </div>
            <div className="mt-16">
              <TestimonialShowcase />
            </div>
            <div className="mt-12 text-center">
              <Button
                onClick={() => setView('testimonial-submit')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Share Your Experience
              </Button>
            </div>
          </>
        )}

        {view === 'dashboard' && <DashboardPage />}
        {view === 'staffing-calculator' && <CalculatorPage />}
        {view === 'roi-calculator' && <ROICalculator />}
        {view === 'scientific-calculator' && <ScientificCalculator />}
        {view === 'pricing' && <PricingWithCheckout />}
        {view === 'plans' && <SubscriptionPlans />}
        {view === 'upgrade-demo' && <UpgradePromptDemo />}
        {view === 'forum' && <ForumPage />}
        {view === 'subscription' && <SubscriptionManagement />}
        {view === 'help' && <HelpCenter />}
        {view === 'referral' && <ReferralProgram />}
        {view === 'announcements' && <AnnouncementManager />}
        {view === 'tour-stats' && <TourStatisticsDashboard userId={userId} />}
        {view === 'feedback-stats' && <FeedbackStatisticsDashboard />}
        {view === 'testimonials' && <TestimonialShowcase />}
        {view === 'testimonial-submit' && <TestimonialSubmission />}
        {view === 'testimonial-admin' && <TestimonialAdmin />}
        {view === 'marketing-analytics' && <MarketingDashboard />}
        {view === 'feedback-portal' && <FeedbackPortal />}
        {view === 'feedback-admin' && <FeedbackAdminPanel />}
        {view === 'email-automation' && <EmailMarketingAutomation />}
        {view === 'email-dashboard' && <EmailAutomationDashboard />}
        {view === 'privacy' && <PrivacyPolicy />}
        {view === 'terms' && <TermsOfService />}
        {view === 'data-export' && <DataExportPage />}
        {view === 'app-store' && <AppStoreAssets />}
        {view === 'testimonials-section' && <TestimonialsDisplay />}
        {view === 'testimonials-mgmt' && <TestimonialsAdmin />}
        {view === 'personalized-dashboard' && <PersonalizedDashboard />}
        {view === 'brand-settings' && <BrandSettingsPanel />}
        {view === 'branding-studio' && <BrandingStudio />}
        {view === 'pricing-comparison' && <PricingComparison />}
        {view === 'calculation-history' && <CalculationHistory />}
        {view === 'data-visualization' && <DataVisualization onClose={() => setView('home')} />}
        {view === 'advanced-calculator' && <CalculatorWithFeatures />}
        {view === 'chart-visualization' && <ChartVisualization />}

        {/* Quick Tour Buttons */}
        {view === 'dashboard' && (
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Interactive Learning Tours</h3>
            <p className="text-gray-600 mb-6">New to Lift Metric? Start with one of our guided tours:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => {
                  setTourType('basic_mode');
                  setShowTour(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white h-12"
              >
                🎓 Basic Mode Tour
              </Button>
              <Button
                onClick={() => {
                  setTourType('scientific_mode');
                  setShowTour(true);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white h-12"
              >
                🔬 Scientific Mode Tour
              </Button>
              <Button
                onClick={() => {
                  setTourType('history_panel');
                  setShowTour(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white h-12"
              >
                📜 History Panel Tour
              </Button>
              <Button
                onClick={() => {
                  setTourType('full_tour');
                  setShowTour(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white h-12"
              >
                🚀 Full Feature Tour
              </Button>
            </div>
          </div>
        )}

        {/* Premium Features Section */}
        {view === 'dashboard' && (
          <div className="mt-16">
            <PremiumFeatures />
          </div>
        )}
      </main>

      {/* Feedback Widget - Always Accessible */}
      <FeedbackWidgetV2 />

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <FeedbackForm onClose={() => setShowFeedbackForm(false)} />
      )}

      {/* Feedback Admin Modal */}
      {showFeedbackAdmin && (
        <FeedbackAdmin onClose={() => setShowFeedbackAdmin(false)} />
      )}

      {/* Share Calculation Modal */}
      {showShareModal && calculationToShare && (
        <ShareCalculationModal
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setCalculationToShare(null);
          }}
          calculation={calculationToShare}
          onShare={async (shareData) => {
            // In a real app, this would save to database
            console.log('Share created:', shareData);
          }}
        />
      )}

      {/* Manage Shared Calculations Modal */}
      {showManageShares && (
        <ManageSharedCalculations
          isOpen={showManageShares}
          onClose={() => setShowManageShares(false)}
        />
      )}

      {/* Report Template Builder Modal */}
      {showTemplateBuilder && (
        <ReportTemplateBuilder onClose={() => setShowTemplateBuilder(false)} />
      )}

      {/* API Integration Manager Modal */}
      {showApiIntegration && (
        <ApiIntegrationManager />
      )}

      {/* Live Data Feed Modal */}
      {showLiveDataFeed && (
        <LiveDataFeed />
      )}

      {/* Scenario Modeling Modal */}
      {showScenarioModeling && (
        <ScenarioModeling onClose={() => setShowScenarioModeling(false)} />
      )}

      {/* Side-by-Side Comparison Modal */}
      {showSideBySideComparison && (
        <SideBySideComparison
          isOpen={showSideBySideComparison}
          onClose={() => setShowSideBySideComparison(false)}
        />
      )}

      {/* Professional Report Generator */}
      {showProfessionalReport && (
        <ProfessionalReportGenerator
          results={{
            projectName: 'Investment Analysis',
            totalInvestment: 150000,
            annualBenefit: 75000,
            netBenefit: 225000,
            roi: 50,
            paybackPeriod: 2,
            npv: 180000,
            irr: 35,
            discountRate: 10,
            projectDuration: 5,
            operatingCosts: 15000,
          }}
          isOpen={showProfessionalReport}
          onClose={() => setShowProfessionalReport(false)}
        />
      )}

      {/* Saved Analysis View */}
      {showSavedAnalysis && (
        <SavedAnalysisView
          onClose={() => setShowSavedAnalysis(false)}
          onLoadCalculation={(data) => {
            console.log('Load calculation:', data);
            setShowSavedAnalysis(false);
          }}
          onCompare={(calcA, calcB) => {
            console.log('Compare:', calcA, calcB);
            setShowSavedAnalysis(false);
            setShowSideBySideComparison(true);
          }}
        />
      )}

      {/* Presentation View */}
      {showPresentationView && (
        <PresentationView
          calculation={{
            name: 'Investment Analysis',
            description: 'Comprehensive ROI analysis for strategic investment decision',
            inputs: {
              initialInvestment: 150000,
              annualBenefit: 75000,
              projectDuration: 5,
              discountRate: 10,
              operatingCosts: 15000,
            },
            results: {
              roi: 150,
              npv: 180000,
              paybackPeriod: 2,
              irr: 35,
            },
            tags: ['Q4 2024', 'High Priority'],
            notes: 'Strategic investment for digital transformation initiative.',
          }}
          onClose={() => setShowPresentationView(false)}
        />
      )}

      {/* PWA Components */}
      <InteractiveOnboarding />
      <PWAInstallPrompt />
      <PWAUpdateNotification />
      <OfflineIndicator />
      <FeedbackButton />
    </div>
  );
}
