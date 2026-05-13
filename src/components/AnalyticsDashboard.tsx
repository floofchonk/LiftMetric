import { useEffect, useState } from "react";
import { useEntity } from "../hooks/useEntity";
import { analyticsEventEntityConfig } from "../entities/AnalyticsEvent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Users, MousePointer, DollarSign } from "lucide-react";

type AnalyticsEvent = {
  id: number;
  eventType: string;
  eventName: string;
  eventCategory: string;
  eventValue: string;
  userId: string;
  sessionId: string;
  metadata: string;
  created_at: string;
  updated_at: string;
};

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function AnalyticsDashboard() {
  const { items: events, loading } = useEntity<AnalyticsEvent>(analyticsEventEntityConfig);
  const [calculatorStats, setCalculatorStats] = useState<Record<string, number>>({});
  const [featureStats, setFeatureStats] = useState<Record<string, number>>({});
  const [upgradeStats, setUpgradeStats] = useState<Record<string, number>>({});
  const [conversionRate, setConversionRate] = useState(0);

  useEffect(() => {
    if (events.length === 0) return;

    // Calculator usage patterns
    const calcEvents = events.filter(e => e.eventType === "calculator_usage");
    const calcModes: Record<string, number> = {};
    calcEvents.forEach(e => {
      try {
        const data = JSON.parse(e.eventValue);
        const mode = data.mode || "unknown";
        calcModes[mode] = (calcModes[mode] || 0) + 1;
      } catch (error) {
        console.error("Error parsing event value:", error);
      }
    });
    setCalculatorStats(calcModes);

    // Feature engagement
    const featureEvents = events.filter(e => e.eventType === "feature_engagement");
    const features: Record<string, number> = {};
    featureEvents.forEach(e => {
      features[e.eventCategory] = (features[e.eventCategory] || 0) + 1;
    });
    setFeatureStats(features);

    // Upgrade prompt interactions
    const upgradeEvents = events.filter(e => e.eventType === "upgrade_prompt");
    const upgrades: Record<string, number> = {
      shown: 0,
      clicked: 0,
      dismissed: 0,
      converted: 0,
    };
    upgradeEvents.forEach(e => {
      const action = e.eventName.replace("prompt_", "");
      upgrades[action] = (upgrades[action] || 0) + 1;
    });
    setUpgradeStats(upgrades);

    // Calculate conversion rate
    const shown = upgrades.shown || 0;
    const converted = upgrades.converted || 0;
    setConversionRate(shown > 0 ? (converted / shown) * 100 : 0);
  }, [events]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const calculatorChartData = Object.entries(calculatorStats).map(([mode, count]) => ({
    mode: mode.charAt(0).toUpperCase() + mode.slice(1),
    count,
  }));

  const featureChartData = Object.entries(featureStats).map(([feature, count]) => ({
    name: feature,
    value: count,
  }));

  const upgradeChartData = Object.entries(upgradeStats).map(([action, count]) => ({
    action: action.charAt(0).toUpperCase() + action.slice(1),
    count,
  }));

  const uniqueUsers = new Set(events.map(e => e.userId)).size;
  const uniqueSessions = new Set(events.map(e => e.sessionId)).size;
  const totalInteractions = events.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track user behavior and engagement patterns</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers}</div>
            <p className="text-xs text-gray-500 mt-1">Unique users tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sessions</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueSessions}</div>
            <p className="text-xs text-gray-500 mt-1">Active sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Interactions</CardTitle>
            <MousePointer className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInteractions}</div>
            <p className="text-xs text-gray-500 mt-1">Total events tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-500 mt-1">Upgrade conversions</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">Calculator Usage</TabsTrigger>
          <TabsTrigger value="features">Feature Engagement</TabsTrigger>
          <TabsTrigger value="upgrades">Upgrade Prompts</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calculator Mode Usage</CardTitle>
              <CardDescription>Which calculation modes are most popular</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={calculatorChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mode" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(calculatorStats).map(([mode, count]) => (
                    <div key={mode} className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">{mode}</span>
                      <span className="text-sm text-gray-600">{count} calculations</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-700">
                    • <strong>{Object.values(calculatorStats).reduce((a, b) => a + b, 0)}</strong> total calculations performed
                  </p>
                  <p className="text-gray-700">
                    • Most popular mode: <strong>{Object.entries(calculatorStats).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}</strong>
                  </p>
                  <p className="text-gray-700">
                    • Average per session: <strong>{(Object.values(calculatorStats).reduce((a, b) => a + b, 0) / uniqueSessions).toFixed(1)}</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Engagement Distribution</CardTitle>
              <CardDescription>How users interact with different features</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={featureChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {featureChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Usage Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(featureStats)
                  .sort((a, b) => b[1] - a[1])
                  .map(([feature, count]) => (
                    <div key={feature} className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm font-medium">{feature}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{
                              width: `${(count / Math.max(...Object.values(featureStats))) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upgrades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Prompt Performance</CardTitle>
              <CardDescription>Tracking prompt effectiveness and conversion funnel</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={upgradeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="action" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Prompts Shown</span>
                      <span className="text-sm font-bold">{upgradeStats.shown || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Clicked</span>
                      <span className="text-sm font-bold">{upgradeStats.clicked || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: upgradeStats.shown
                            ? `${((upgradeStats.clicked || 0) / upgradeStats.shown) * 100}%`
                            : "0%",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Converted</span>
                      <span className="text-sm font-bold">{upgradeStats.converted || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: upgradeStats.shown
                            ? `${((upgradeStats.converted || 0) / upgradeStats.shown) * 100}%`
                            : "0%",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Dismissed</span>
                      <span className="text-sm font-bold">{upgradeStats.dismissed || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-400 h-2 rounded-full"
                        style={{
                          width: upgradeStats.shown
                            ? `${((upgradeStats.dismissed || 0) / upgradeStats.shown) * 100}%`
                            : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                    <p className="text-3xl font-bold text-green-700">{conversionRate.toFixed(1)}%</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Click-Through Rate</p>
                    <p className="text-3xl font-bold text-blue-700">
                      {upgradeStats.shown
                        ? (((upgradeStats.clicked || 0) / upgradeStats.shown) * 100).toFixed(1)
                        : 0}%
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Dismissal Rate</p>
                    <p className="text-3xl font-bold text-purple-700">
                      {upgradeStats.shown
                        ? (((upgradeStats.dismissed || 0) / upgradeStats.shown) * 100).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
