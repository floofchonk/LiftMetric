import { useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { useAuth } from "../hooks/useAuth";
import { useEntity } from "../hooks/useEntity";
import { scenarioEntityConfig } from "../entities/Scenario";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import {
  Activity,
  Calculator,
  Clock,
  TrendingUp,
  Save,
  Settings,
  Eye,
  EyeOff,
  Zap,
  BookOpen,
  BarChart3,
  FileSpreadsheet,
} from "lucide-react";

type Scenario = {
  id: number;
  userId: string;
  name: string;
  description: string;
  inputs: string;
  results: string;
  created_at: string;
  updated_at: string;
};

const WIDGET_CONFIG = {
  quickStats: {
    title: "Quick Stats",
    icon: TrendingUp,
    description: "Your usage at a glance",
  },
  recentActivity: {
    title: "Recent Activity",
    icon: Activity,
    description: "Your latest actions",
  },
  frequentCalculations: {
    title: "Frequent Calculations",
    icon: Calculator,
    description: "Your most used calculations",
  },
  savedScenarios: {
    title: "Saved Scenarios",
    icon: Save,
    description: "Quick access to your scenarios",
  },
  quickActions: {
    title: "Quick Actions",
    icon: Zap,
    description: "Common tasks",
  },
  tips: {
    title: "Pro Tips",
    icon: BookOpen,
    description: "Get the most out of Lift Metric",
  },
};

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const userId = currentUser?.id?.toString() || "demo-user";
  const { widgets, activities, loading, toggleWidget } = useDashboard(userId);
  const { items: scenarios } = useEntity<Scenario>(scenarioEntityConfig);
  const [showSettings, setShowSettings] = useState(false);

  const userScenarios = scenarios.filter((s) => s.userId === userId).slice(0, 5);
  const visibleWidgets = widgets.filter((w) => w.isVisible === "true");

  const stats = {
    totalCalculations: activities.filter((a) => a.activityType === "calculation")
      .length,
    savedScenarios: userScenarios.length,
    exportsCreated: activities.filter((a) => a.activityType === "export").length,
    activeDays: new Set(
      activities.map((a) => new Date(a.created_at).toDateString())
    ).size,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {currentUser?.name || "User"}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your calculations
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            {showSettings ? "Done" : "Customize"}
          </Button>
        </div>

        {/* Widget Settings Panel */}
        {showSettings && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Dashboard Settings
              </CardTitle>
              <CardDescription>
                Show or hide widgets to customize your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {widgets.map((widget) => {
                  const config =
                    WIDGET_CONFIG[widget.widgetType as keyof typeof WIDGET_CONFIG];
                  if (!config) return null;

                  return (
                    <div
                      key={widget.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <config.icon className="w-5 h-5 text-blue-600" />
                        <div>
                          <Label className="text-sm font-medium">
                            {config.title}
                          </Label>
                          <p className="text-xs text-gray-500">
                            {config.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {widget.isVisible === "true" ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                        <Switch
                          checked={widget.isVisible === "true"}
                          onCheckedChange={() => toggleWidget(widget.id)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleWidgets.map((widget) => {
            const config =
              WIDGET_CONFIG[widget.widgetType as keyof typeof WIDGET_CONFIG];
            if (!config) return null;

            switch (widget.widgetType) {
              case "quickStats":
                return (
                  <Card
                    key={widget.id}
                    className="col-span-1 md:col-span-2 lg:col-span-3"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <config.icon className="w-5 h-5 text-blue-600" />
                        {config.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <Calculator className="w-5 h-5" />
                            <span className="text-sm font-medium">
                              Calculations
                            </span>
                          </div>
                          <p className="text-3xl font-bold text-gray-900">
                            {stats.totalCalculations}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-green-600 mb-2">
                            <Save className="w-5 h-5" />
                            <span className="text-sm font-medium">Scenarios</span>
                          </div>
                          <p className="text-3xl font-bold text-gray-900">
                            {stats.savedScenarios}
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-purple-600 mb-2">
                            <FileSpreadsheet className="w-5 h-5" />
                            <span className="text-sm font-medium">Exports</span>
                          </div>
                          <p className="text-3xl font-bold text-gray-900">
                            {stats.exportsCreated}
                          </p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-orange-600 mb-2">
                            <Clock className="w-5 h-5" />
                            <span className="text-sm font-medium">Active Days</span>
                          </div>
                          <p className="text-3xl font-bold text-gray-900">
                            {stats.activeDays}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );

              case "recentActivity":
                return (
                  <Card key={widget.id} className="col-span-1 md:col-span-1">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <config.icon className="w-5 h-5 text-blue-600" />
                        {config.title}
                      </CardTitle>
                      <CardDescription>Your latest actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {activities.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">
                          No recent activity yet. Start by creating a calculation!
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {activities.slice(0, 5).map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex-shrink-0 mt-1">
                                {activity.activityType === "calculation" && (
                                  <Calculator className="w-4 h-4 text-blue-600" />
                                )}
                                {activity.activityType === "scenario_saved" && (
                                  <Save className="w-4 h-4 text-green-600" />
                                )}
                                {activity.activityType === "export" && (
                                  <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {activity.title}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {activity.description}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(activity.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );

              case "savedScenarios":
                return (
                  <Card key={widget.id} className="col-span-1 md:col-span-1">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <config.icon className="w-5 h-5 text-blue-600" />
                        {config.title}
                      </CardTitle>
                      <CardDescription>
                        Quick access to your scenarios
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {userScenarios.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">
                          No saved scenarios yet. Save your first calculation!
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {userScenarios.map((scenario) => (
                            <div
                              key={scenario.id}
                              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {scenario.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {scenario.description}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(scenario.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );

              case "quickActions":
                return (
                  <Card key={widget.id} className="col-span-1">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <config.icon className="w-5 h-5 text-blue-600" />
                        {config.title}
                      </CardTitle>
                      <CardDescription>Common tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full justify-start" variant="outline">
                        <Calculator className="w-4 h-4 mr-2" />
                        New Calculation
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Analytics
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Save className="w-4 h-4 mr-2" />
                        My Scenarios
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </CardContent>
                  </Card>
                );

              case "tips":
                return (
                  <Card key={widget.id} className="col-span-1 md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <config.icon className="w-5 h-5 text-blue-600" />
                        {config.title}
                      </CardTitle>
                      <CardDescription>
                        Get the most out of Lift Metric
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <Badge className="bg-blue-600">Tip</Badge>
                          <p className="text-sm text-gray-700">
                            Save your calculations as scenarios to compare different
                            options side-by-side
                          </p>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <Badge className="bg-green-600">Pro</Badge>
                          <p className="text-sm text-gray-700">
                            Use keyboard shortcuts: Ctrl+S to save, Ctrl+E to export
                          </p>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                          <Badge className="bg-purple-600">New</Badge>
                          <p className="text-sm text-gray-700">
                            Try the advanced analytics dashboard for deeper insights
                            into your data
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}
