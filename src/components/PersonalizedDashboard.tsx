import { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Clock, 
  Star, 
  TrendingUp, 
  Activity, 
  Zap,
  BarChart3,
  Calendar,
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
  Target,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

type CalculationHistoryItem = {
  id: number;
  type: 'basic' | 'scientific' | 'roi';
  expression: string;
  result: string;
  timestamp: string;
  favorite?: boolean;
};

type UsageStats = {
  totalCalculations: number;
  basicCount: number;
  scientificCount: number;
  roiCount: number;
  streak: number;
  lastActive: string;
};

type ActivityData = {
  date: string;
  count: number;
};

type Suggestion = {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
};

export default function PersonalizedDashboard() {
  const { currentUser } = useAuth();
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistoryItem[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    totalCalculations: 0,
    basicCount: 0,
    scientificCount: 0,
    roiCount: 0,
    streak: 0,
    lastActive: new Date().toISOString()
  });
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [favorites, setFavorites] = useState<string[]>(['basic', 'scientific']);

  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      const savedHistory = localStorage.getItem(`calc_history_${currentUser?.id || 'guest'}`);
      const savedStats = localStorage.getItem(`usage_stats_${currentUser?.id || 'guest'}`);
      const savedFavorites = localStorage.getItem(`favorites_${currentUser?.id || 'guest'}`);
      const savedActivity = localStorage.getItem(`activity_data_${currentUser?.id || 'guest'}`);

      if (savedHistory) {
        setCalculationHistory(JSON.parse(savedHistory));
      } else {
        // Demo data
        setCalculationHistory([
          {
            id: 1,
            type: 'basic',
            expression: '1,250 + 3,450',
            result: '4,700',
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            favorite: false
          },
          {
            id: 2,
            type: 'scientific',
            expression: 'sin(45°) × 100',
            result: '70.71',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            favorite: true
          },
          {
            id: 3,
            type: 'roi',
            expression: 'ROI Calculation: $50K investment',
            result: '125% ROI',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            favorite: true
          }
        ]);
      }

      if (savedStats) {
        setUsageStats(JSON.parse(savedStats));
      } else {
        // Demo data
        setUsageStats({
          totalCalculations: 47,
          basicCount: 28,
          scientificCount: 12,
          roiCount: 7,
          streak: 5,
          lastActive: new Date().toISOString()
        });
      }

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }

      if (savedActivity) {
        setActivityData(JSON.parse(savedActivity));
      } else {
        // Generate demo activity data for last 30 days
        const activity: ActivityData[] = [];
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          activity.push({
            date: date.toISOString().split('T')[0],
            count: Math.floor(Math.random() * 10)
          });
        }
        setActivityData(activity);
      }
    };

    loadUserData();
  }, [currentUser]);

  // Generate personalized suggestions
  const suggestions = useMemo<Suggestion[]>(() => {
    const allSuggestions: Suggestion[] = [];

    // Based on usage patterns
    if (usageStats.scientificCount > usageStats.basicCount) {
      allSuggestions.push({
        id: 'advanced-functions',
        title: 'Explore Advanced Functions',
        description: 'Try our new statistical functions and matrix operations',
        action: 'scientific',
        icon: 'zap',
        priority: 'high'
      });
    }

    if (usageStats.roiCount > 0 && usageStats.roiCount < 5) {
      allSuggestions.push({
        id: 'roi-templates',
        title: 'Save ROI Templates',
        description: 'Create reusable templates for your common calculations',
        action: 'roi',
        icon: 'target',
        priority: 'high'
      });
    }

    if (usageStats.streak >= 3) {
      allSuggestions.push({
        id: 'streak-reward',
        title: `${usageStats.streak} Day Streak! 🔥`,
        description: 'Keep it up! Unlock premium features at 7 days',
        action: 'dashboard',
        icon: 'award',
        priority: 'medium'
      });
    }

    // New features
    allSuggestions.push({
      id: 'email-automation',
      title: 'New: Email Automation',
      description: 'Set up automated calculation reports and alerts',
      action: 'email',
      icon: 'sparkles',
      priority: 'medium'
    });

    allSuggestions.push({
      id: 'data-export',
      title: 'Export Your Data',
      description: 'Download your calculation history as CSV or PDF',
      action: 'data',
      icon: 'book',
      priority: 'low'
    });

    if (calculationHistory.filter(c => c.favorite).length === 0) {
      allSuggestions.push({
        id: 'use-favorites',
        title: 'Favorite Calculations',
        description: 'Star important calculations for quick access',
        action: 'dashboard',
        icon: 'star',
        priority: 'medium'
      });
    }

    return allSuggestions.sort((a, b) => {
      const priority = { high: 3, medium: 2, low: 1 };
      return priority[b.priority] - priority[a.priority];
    });
  }, [usageStats, calculationHistory]);

  const toggleFavorite = (id: number) => {
    setCalculationHistory(prev => 
      prev.map(item => 
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      zap: Zap,
      target: Target,
      award: Award,
      sparkles: Sparkles,
      book: BookOpen,
      star: Star
    };
    const Icon = icons[iconName] || Sparkles;
    return <Icon className="w-5 h-5" />;
  };

  const maxActivity = Math.max(...activityData.map(d => d.count), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {currentUser?.name || 'User'}! 👋
              </h1>
              <p className="text-gray-600">
                You've completed {usageStats.totalCalculations} calculations
              </p>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg">
              <Award className="w-6 h-6" />
              <div>
                <div className="text-sm opacity-90">Current Streak</div>
                <div className="text-2xl font-bold">{usageStats.streak} Days 🔥</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Calculator className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">{usageStats.basicCount}</span>
            </div>
            <div className="text-sm text-gray-600">Basic Calculations</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold text-gray-900">{usageStats.scientificCount}</span>
            </div>
            <div className="text-sm text-gray-600">Scientific Calculations</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-gray-900">{usageStats.roiCount}</span>
            </div>
            <div className="text-sm text-gray-600">ROI Analyses</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">
                {calculationHistory.filter(c => c.favorite).length}
              </span>
            </div>
            <div className="text-sm text-gray-600">Favorites</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Calculations */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {calculationHistory.slice(0, 5).map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`p-3 rounded-lg ${
                      item.type === 'basic' ? 'bg-blue-100 text-blue-600' :
                      item.type === 'scientific' ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {item.type === 'basic' ? <Calculator className="w-5 h-5" /> :
                       item.type === 'scientific' ? <Activity className="w-5 h-5" /> :
                       <TrendingUp className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{item.expression}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleString()} • Result: {item.result}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className={`p-2 rounded-lg transition-all ${
                      item.favorite 
                        ? 'text-yellow-500 bg-yellow-50' 
                        : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${item.favorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Quick Access</h2>
            </div>

            <div className="space-y-3">
              <button className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5" />
                  <span className="font-semibold">Basic Calculator</span>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5" />
                  <span className="font-semibold">Scientific Calculator</span>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">ROI Calculator</span>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Favorites</h3>
                <div className="space-y-2">
                  {calculationHistory.filter(c => c.favorite).slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      className="w-full p-3 bg-yellow-50 text-gray-700 rounded-lg hover:bg-yellow-100 transition-colors text-left text-sm flex items-center gap-2 group"
                    >
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="truncate flex-1">{item.expression}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Heatmap & Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Over Time */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">Activity Overview</h2>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Last 30 Days</div>
              <div className="grid grid-cols-15 gap-1">
                {activityData.slice(-30).map((day, index) => (
                  <div
                    key={index}
                    className="group relative"
                  >
                    <div
                      className={`w-full aspect-square rounded transition-all cursor-pointer ${
                        day.count === 0 ? 'bg-gray-100' :
                        day.count <= maxActivity * 0.25 ? 'bg-blue-200 hover:bg-blue-300' :
                        day.count <= maxActivity * 0.5 ? 'bg-blue-400 hover:bg-blue-500' :
                        day.count <= maxActivity * 0.75 ? 'bg-blue-600 hover:bg-blue-700' :
                        'bg-blue-800 hover:bg-blue-900'
                      }`}
                      title={`${day.date}: ${day.count} calculations`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <span>Less</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-100 rounded"></div>
                  <div className="w-3 h-3 bg-blue-200 rounded"></div>
                  <div className="w-3 h-3 bg-blue-400 rounded"></div>
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <div className="w-3 h-3 bg-blue-800 rounded"></div>
                </div>
                <span>More</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Most Active Day</span>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {activityData.length > 0 
                    ? new Date(activityData.reduce((max, d) => d.count > max.count ? d : max).date).toLocaleDateString('en-US', { weekday: 'short' })
                    : 'N/A'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Avg Per Day</span>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {activityData.length > 0 
                    ? (activityData.reduce((sum, d) => sum + d.count, 0) / activityData.length).toFixed(1)
                    : '0'}
                </div>
              </div>
            </div>
          </div>

          {/* Personalized Suggestions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Suggestions for You</h2>
            </div>

            <div className="space-y-3">
              {suggestions.slice(0, 4).map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer group hover:shadow-md ${
                    suggestion.priority === 'high' 
                      ? 'border-orange-200 bg-orange-50 hover:border-orange-300' :
                    suggestion.priority === 'medium'
                      ? 'border-blue-200 bg-blue-50 hover:border-blue-300'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      suggestion.priority === 'high' 
                        ? 'bg-orange-100 text-orange-600' :
                      suggestion.priority === 'medium'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getIcon(suggestion.icon)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        {suggestion.title}
                        {suggestion.priority === 'high' && (
                          <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Learn More <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
