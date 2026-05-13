import { useEntity } from '../hooks/useEntity';
import { analyticsEventEntityConfig } from '../entities/AnalyticsEvent';
import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, DollarSign, Zap, Target, AlertCircle } from 'lucide-react';

type AnalyticsEvent = {
  id: number;
  eventType: string;
  eventName: string;
  category: string;
  userId: string;
  userPlan: string;
  metadata: string;
  value: number;
  sessionId: string;
  created_at: string;
  updated_at: string;
};

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function BusinessAnalyticsDashboard() {
  const { items: events, loading } = useEntity<AnalyticsEvent>(analyticsEventEntityConfig);

  const insights = useMemo(() => {
    if (!events.length) return null;

    // Feature usage tracking
    const featureUsage = events
      .filter(e => e.eventName === 'feature_used')
      .reduce((acc, e) => {
        try {
          const meta = JSON.parse(e.metadata);
          const feature = meta.feature || 'unknown';
          if (!acc[feature]) {
            acc[feature] = { total: 0, premium: 0, free: 0 };
          }
          acc[feature].total++;
          if (e.userPlan === 'free') acc[feature].free++;
          else acc[feature].premium++;
        } catch {}
        return acc;
      }, {} as Record<string, { total: number; premium: number; free: number }>);

    // Upgrade prompt analytics
    const promptAnalytics = events
      .filter(e => e.eventName.startsWith('upgrade_prompt_'))
      .reduce((acc, e) => {
        try {
          const action = e.eventName.split('_').pop();
          const meta = JSON.parse(e.metadata);
          const promptType = meta.promptType || 'unknown';
          
          if (!acc[promptType]) {
            acc[promptType] = { shown: 0, clicked: 0, dismissed: 0 };
          }
          if (action === 'shown') acc[promptType].shown++;
          if (action === 'clicked') acc[promptType].clicked++;
          if (action === 'dismissed') acc[promptType].dismissed++;
        } catch {}
        return acc;
      }, {} as Record<string, { shown: number; clicked: number; dismissed: number }>);

    // Conversion tracking
    const conversions = events.filter(e => e.eventName === 'conversion');
    const conversionRate = promptAnalytics['scenario_limit']
      ? (promptAnalytics['scenario_limit'].clicked / promptAnalytics['scenario_limit'].shown) * 100
      : 0;

    // User engagement by plan
    const usersByPlan = events.reduce((acc, e) => {
      acc[e.userPlan] = (acc[e.userPlan] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculator usage patterns
    const calculatorUsage = events
      .filter(e => e.eventName === 'calculation_performed')
      .reduce((acc, e) => {
        try {
          const meta = JSON.parse(e.metadata);
          const type = meta.calculationType || 'unknown';
          acc[type] = (acc[type] || 0) + 1;
        } catch {}
        return acc;
      }, {} as Record<string, number>);

    // Daily active users
    const uniqueUsers = new Set(events.map(e => e.userId)).size;
    const uniqueSessions = new Set(events.map(e => e.sessionId)).size;

    // Feature drop-off analysis
    const scenariosSaved = events.filter(e => e.eventName === 'scenario_saved').length;
    const scenariosCompared = events.filter(e => e.eventName === 'scenario_compared').length;
    const comparisonRate = scenariosSaved > 0 ? (scenariosCompared / scenariosSaved) * 100 : 0;

    // Premium feature interest
    const premiumFeatureAttempts = events.filter(e => {
      try {
        const meta = JSON.parse(e.metadata);
        return meta.isPremium === true && e.userPlan === 'free';
      } catch {
        return false;
      }
    }).length;

    // Time-based engagement
    const last24Hours = events.filter(e => 
      new Date(e.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000
    ).length;

    const last7Days = events.filter(e => 
      new Date(e.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length;

    return {
      featureUsage,
      promptAnalytics,
      conversions,
      conversionRate,
      usersByPlan,
      calculatorUsage,
      uniqueUsers,
      uniqueSessions,
      scenariosSaved,
      scenariosCompared,
      comparisonRate,
      premiumFeatureAttempts,
      last24Hours,
      last7Days,
    };
  }, [events]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!insights || events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Business Analytics</h1>
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Analytics Data Yet</h2>
            <p className="text-gray-600">Start using Lift Metric to see insights about feature engagement and monetization opportunities.</p>
          </div>
        </div>
      </div>
    );
  }

  const featureChartData = Object.entries(insights.featureUsage).map(([feature, data]) => ({
    name: feature.replace(/_/g, ' '),
    total: data.total,
    free: data.free,
    premium: data.premium,
  }));

  const promptChartData = Object.entries(insights.promptAnalytics).map(([type, data]) => ({
    name: type.replace(/_/g, ' '),
    shown: data.shown,
    clicked: data.clicked,
    dismissed: data.dismissed,
    ctr: data.shown > 0 ? ((data.clicked / data.shown) * 100).toFixed(1) : 0,
  }));

  const planDistribution = Object.entries(insights.usersByPlan).map(([plan, count]) => ({
    name: plan.charAt(0).toUpperCase() + plan.slice(1),
    value: count,
  }));

  const calculatorData = Object.entries(insights.calculatorUsage).map(([type, count]) => ({
    name: type.replace(/_/g, ' '),
    uses: count,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Business Analytics Dashboard</h1>
          <p className="text-gray-600">Actionable insights for feature adoption and monetization strategy</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-purple-600" />
              <span className="text-sm text-gray-500">Total Users</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{insights.uniqueUsers}</p>
            <p className="text-sm text-gray-600 mt-1">{insights.uniqueSessions} sessions</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8 text-blue-600" />
              <span className="text-sm text-gray-500">Engagement</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{insights.last24Hours}</p>
            <p className="text-sm text-gray-600 mt-1">Events (24h) | {insights.last7Days} (7d)</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-green-600" />
              <span className="text-sm text-gray-500">Conversion Rate</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{insights.conversionRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-600 mt-1">{insights.conversions.length} conversions</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-orange-600" />
              <span className="text-sm text-gray-500">Premium Interest</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{insights.premiumFeatureAttempts}</p>
            <p className="text-sm text-gray-600 mt-1">Free users hitting limits</p>
          </div>
        </div>

        {/* Feature Usage */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
            Feature Usage by Plan
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="free" fill="#3b82f6" name="Free Users" />
              <Bar dataKey="premium" fill="#8b5cf6" name="Premium Users" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Insight:</strong> Features with high free user engagement are prime candidates for premium gating. 
              Monitor which features free users use most to inform your monetization strategy.
            </p>
          </div>
        </div>

        {/* Upgrade Prompt Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upgrade Prompt Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={promptChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="shown" fill="#cbd5e1" name="Shown" />
                <Bar dataKey="clicked" fill="#10b981" name="Clicked" />
                <Bar dataKey="dismissed" fill="#ef4444" name="Dismissed" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {promptChartData.map((prompt, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{prompt.name}</span>
                  <span className="text-green-600 font-bold">{prompt.ctr}% CTR</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Distribution by Plan</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Opportunity:</strong> {((planDistribution.find(p => p.name === 'Free')?.value || 0) / insights.uniqueUsers * 100).toFixed(0)}% of users are on free plan. 
                Focus conversion efforts on high-engagement free users.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator Usage & Feature Drop-off */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculator Usage Patterns</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={calculatorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="uses" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Usage Insight:</strong> Most popular calculation modes indicate which features drive the most value. 
                Consider highlighting these in your marketing.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Funnel Analysis</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Scenarios Saved</span>
                  <span className="text-2xl font-bold text-purple-600">{insights.scenariosSaved}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-600 h-3 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Scenarios Compared</span>
                  <span className="text-2xl font-bold text-blue-600">{insights.scenariosCompared}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${insights.comparisonRate}%` }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{insights.comparisonRate.toFixed(1)}% comparison rate</p>
              </div>

              <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Drop-off Alert:</strong> {insights.comparisonRate < 30 ? 'Low comparison rate suggests users may not understand the value of this feature. Consider improving onboarding or making it more prominent.' : 'Good engagement with comparison feature! This is a strong candidate for premium positioning.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">💡 Monetization Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3">🎯 High-Value Features</h3>
              <ul className="space-y-2 text-white/90">
                <li>• Scenario comparison shows {insights.comparisonRate.toFixed(0)}% engagement rate</li>
                <li>• {insights.premiumFeatureAttempts} free users attempted premium features</li>
                <li>• Consider gating features with high free user demand</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3">📈 Conversion Opportunities</h3>
              <ul className="space-y-2 text-white/90">
                <li>• {insights.conversionRate.toFixed(1)}% prompt-to-upgrade conversion rate</li>
                <li>• Optimize prompts with lower CTR for better messaging</li>
                <li>• Target high-engagement free users for upgrades</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3">🚀 Growth Levers</h3>
              <ul className="space-y-2 text-white/90">
                <li>• {insights.last7Days} events in last 7 days shows strong engagement</li>
                <li>• {insights.uniqueSessions} unique sessions indicate repeat usage</li>
                <li>• Build on popular calculator modes for feature expansion</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3">⚠️ Areas to Improve</h3>
              <ul className="space-y-2 text-white/90">
                <li>• {insights.comparisonRate < 30 ? 'Boost comparison feature awareness' : 'Comparison feature performing well'}</li>
                <li>• Focus on reducing prompt dismissal rates</li>
                <li>• A/B test different upgrade messaging strategies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
