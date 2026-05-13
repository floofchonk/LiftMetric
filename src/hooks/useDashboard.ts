import { useState, useEffect } from "react";
import { useEntity } from "./useEntity";
import {
  dashboardWidgetEntityConfig,
  userActivityEntityConfig,
  userPreferenceEntityConfig,
} from "../entities";

type DashboardWidget = {
  id: number;
  userId: string;
  widgetType: string;
  position: number;
  isVisible: string;
  settings: string;
  created_at: string;
  updated_at: string;
};

type UserActivity = {
  id: number;
  userId: string;
  activityType: string;
  title: string;
  description: string;
  metadata: string;
  created_at: string;
  updated_at: string;
};

type UserPreference = {
  id: number;
  userId: string;
  preferenceKey: string;
  preferenceValue: string;
  created_at: string;
  updated_at: string;
};

const DEFAULT_WIDGETS = [
  { type: "quickStats", position: 0 },
  { type: "recentActivity", position: 1 },
  { type: "frequentCalculations", position: 2 },
  { type: "savedScenarios", position: 3 },
  { type: "quickActions", position: 4 },
  { type: "tips", position: 5 },
];

export const useDashboard = (userId: string) => {
  const {
    items: widgets,
    loading: widgetsLoading,
    create: createWidget,
    update: updateWidget,
  } = useEntity<DashboardWidget>(dashboardWidgetEntityConfig);

  const {
    items: activities,
    loading: activitiesLoading,
    create: createActivity,
  } = useEntity<UserActivity>(userActivityEntityConfig);

  const {
    items: preferences,
    loading: preferencesLoading,
    create: createPreference,
    update: updatePreference,
  } = useEntity<UserPreference>(userPreferenceEntityConfig);

  const [initialized, setInitialized] = useState(false);

  // Initialize default widgets for new users
  useEffect(() => {
    if (!widgetsLoading && !initialized) {
      const userWidgets = widgets.filter((w) => w.userId === userId);
      if (userWidgets.length === 0) {
        DEFAULT_WIDGETS.forEach((widget) => {
          createWidget({
            userId,
            widgetType: widget.type,
            position: widget.position,
            isVisible: "true",
            settings: "{}",
          });
        });
      }
      setInitialized(true);
    }
  }, [widgetsLoading, widgets, userId, initialized, createWidget]);

  // Filter data for current user
  const userWidgets = widgets.filter((w) => w.userId === userId);
  const userActivities = activities
    .filter((a) => a.userId === userId)
    .slice(0, 10);
  const userPreferences = preferences.filter((p) => p.userId === userId);

  const logActivity = async (
    activityType: string,
    title: string,
    description: string,
    metadata?: Record<string, unknown>
  ) => {
    await createActivity({
      userId,
      activityType,
      title,
      description,
      metadata: JSON.stringify(metadata || {}),
    });
  };

  const toggleWidget = async (widgetId: number) => {
    const widget = userWidgets.find((w) => w.id === widgetId);
    if (widget) {
      await updateWidget(widgetId, {
        isVisible: widget.isVisible === "true" ? "false" : "true",
      });
    }
  };

  const reorderWidgets = async (widgetId: number, newPosition: number) => {
    await updateWidget(widgetId, { position: newPosition });
  };

  const updateWidgetSettings = async (
    widgetId: number,
    settings: Record<string, unknown>
  ) => {
    await updateWidget(widgetId, { settings: JSON.stringify(settings) });
  };

  const getPreference = (key: string): string | null => {
    const pref = userPreferences.find((p) => p.preferenceKey === key);
    return pref ? pref.preferenceValue : null;
  };

  const setPreference = async (key: string, value: string) => {
    const existing = userPreferences.find((p) => p.preferenceKey === key);
    if (existing) {
      await updatePreference(existing.id, { preferenceValue: value });
    } else {
      await createPreference({ userId, preferenceKey: key, preferenceValue: value });
    }
  };

  return {
    widgets: userWidgets.sort((a, b) => a.position - b.position),
    activities: userActivities,
    preferences: userPreferences,
    loading: widgetsLoading || activitiesLoading || preferencesLoading,
    logActivity,
    toggleWidget,
    reorderWidgets,
    updateWidgetSettings,
    getPreference,
    setPreference,
  };
};
