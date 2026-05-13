import { useState, useMemo } from "react";
import {
  TrendingUp,
  Users,
  Share2,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
} from "lucide-react";
import { DemoDataGenerator } from "./DemoDataGenerator";
import { useEntity } from "../hooks/useEntity";
import {
  marketingMetricEntityConfig,
  userAcquisitionEntityConfig,
  socialShareEntityConfig,
} from "../entities";

type MarketingMetric = {
  id: number;
  date: string;
  metricType: string;
  source: string;
  value: number;
  metadata: string;
  userId: string;
  campaignId: string;
  created_at: string;
  updated_at: string;
};

type UserAcquisition = {
  id: number;
  userId: string;
  signupDate: string;
  source: string;
  campaign: string;
  referrerId: string;
  landingPage: string;
  tier: string;
  converted: string;
  conversionDate: string;
  lifetimeValue: number;
  created_at: string;
  updated_at: string;
};

type SocialShare = {
  id: number;
  userId: string;
  platform: string;
  shareType: string;
  content: string;
  calculationData: string;
  clicks: number;
  conversions: number;
  shareUrl: string;
  created_at: string;
  updated_at: string;
};

export default function MarketingDashboard() {
  const [dateRange, setDateRange] = useState("30");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const { items: metrics } = useEntity<MarketingMetric>(marketingMetricEntityConfig);
  const { items: acquisitions } = useEntity<UserAcquisition>(userAcquisitionEntityConfig);
  const { items: shares } = useEntity<SocialShare>(socialShareEntityConfig);

  // Filter data by date range
  const filterByDateRange = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const daysAgo = parseInt(dateRange);
    const cutoff = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return date >= cutoff;
  };

  const filteredMetrics = metrics.filter((m) => filterByDateRange(m.date));
  const filteredAcquisitions = acquisitions.filter((a) => filterByDateRange(a.signupDate));
  const filteredShares = shares.filter((s) => filterByDateRange(s.created_at));

  // Calculate key metrics
  const stats = useMemo(() => {
    const totalSignups = filteredAcquisitions.length;
    const totalConversions = filteredAcquisitions.filter((a) => a.converted === "true").length;
    const conversionRate = totalSignups > 0 ? (totalConversions / totalSignups) * 100 : 0;
    const totalShares = filteredShares.length;
    const totalRevenue = filteredAcquisitions.reduce((sum, a) => sum + (a.lifetimeValue || 0), 0);

    // Source breakdown
    const sourceBreakdown = filteredAcquisitions.reduce((acc, a) => {
      acc[a.source] = (acc[a.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Platform breakdown for shares
    const platformBreakdown = filteredShares.reduce((acc, s) => {
      acc[s.platform] = (acc[s.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Daily signups trend
    const dailySignups = filteredAcquisitions.reduce((acc, a) => {
      const date = a.signupDate.split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Previous period comparison
    const prevPeriodStart = new Date(Date.now() - parseInt(dateRange) * 2 * 24 * 60 * 60 * 1000);
    const prevPeriodEnd = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000);
    const prevSignups = acquisitions.filter((a) => {
      const date = new Date(a.signupDate);
      return date >= prevPeriodStart && date < prevPeriodEnd;
    }).length;
    const signupGrowth = prevSignups > 0 ? ((totalSignups - prevSignups) / prevSignups) * 100 : 0;

    return {
      totalSignups,
      totalConversions,
      conversionRate,
      totalShares,
      totalRevenue,
      sourceBreakdown,
      platformBreakdown,
      dailySignups,
      signupGrowth,
    };
  }, [filteredMetrics, filteredAcquisitions, filteredShares, acquisitions, dateRange]);

  const exportData = () => {
    const csvData = [
      ["Date", "Signups", "Conversions", "Shares", "Revenue"],
      ...Object.entries(stats.dailySignups).map(([date, signups]) => [
        date,
        signups,
        filteredAcquisitions.filter((a) => a.signupDate.startsWith(date) && a.converted === "true").length,
        filteredShares.filter((s) => s.created_at.startsWith(date)).length,
        filteredAcquisitions
          .filter((a) => a.signupDate.startsWith(date))
          .reduce((sum, a) => sum + (a.lifetimeValue || 0), 0),
      ]),
    ];

    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marketing-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Marketing Analytics
          </h1>
          <p className="text-gray-600">
            Track user acquisition, conversion rates, and marketing performance
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>

          <DemoDataGenerator />
          <button
            onClick={exportData}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">New Signups</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSignups}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              {stats.signupGrowth >= 0 ? (
                <ArrowUp className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${stats.signupGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                {Math.abs(stats.signupGrowth).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500">vs previous period</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {stats.totalConversions} of {stats.totalSignups} users converted
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Social Shares</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalShares}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Share2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Across {Object.keys(stats.platformBreakdown).length} platforms
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Avg: ${stats.totalSignups > 0 ? (stats.totalRevenue / stats.totalSignups).toFixed(0) : 0} per user
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Acquisition Sources */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                Acquisition Sources
              </h3>
            </div>

            <div className="space-y-3">
              {Object.entries(stats.sourceBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([source, count]) => {
                  const percentage = (count / stats.totalSignups) * 100;
                  return (
                    <div key={source}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {source.replace(/_/g, " ")}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>

            {Object.keys(stats.sourceBreakdown).length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No acquisition data available</p>
                <p className="text-sm text-gray-400 mt-1">Data will appear as users sign up</p>
              </div>
            )}
          </div>

          {/* Social Platform Breakdown */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-purple-600" />
                Social Shares by Platform
              </h3>
            </div>

            <div className="space-y-3">
              {Object.entries(stats.platformBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([platform, count]) => {
                  const percentage = (count / stats.totalShares) * 100;
                  const colors = {
                    twitter: "bg-blue-400",
                    linkedin: "bg-blue-600",
                    facebook: "bg-blue-700",
                    email: "bg-gray-600",
                  };
                  return (
                    <div key={platform}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {platform}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${colors[platform as keyof typeof colors]} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>

            {Object.keys(stats.platformBreakdown).length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No social share data available</p>
                <p className="text-sm text-gray-400 mt-1">Data will appear as users share content</p>
              </div>
            )}
          </div>
        </div>

        {/* Daily Signups Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Daily Signups Trend
            </h3>
          </div>

          {Object.keys(stats.dailySignups).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(stats.dailySignups)
                .sort(([a], [b]) => a.localeCompare(b))
                .slice(-14) // Last 14 days
                .map(([date, count]) => {
                  const maxCount = Math.max(...Object.values(stats.dailySignups));
                  const percentage = (count / maxCount) * 100;
                  return (
                    <div key={date} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 w-24">
                        {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        >
                          <span className="text-sm font-bold text-white">{count}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No signup data available</p>
              <p className="text-sm text-gray-400 mt-1">Chart will populate as users sign up</p>
            </div>
          )}
        </div>

        {/* Demo Data Generator */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Need Demo Data?</h3>
              <p className="text-gray-600 mb-4">
                This dashboard will populate automatically as users sign up, share content, and convert to paid tiers.
                Marketing metrics are tracked in real-time to inform your strategy.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                  Real-time tracking
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                  Source attribution
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                  Conversion funnel
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                  CSV export
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
