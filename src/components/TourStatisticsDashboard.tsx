import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEntity } from '../hooks/useEntity';
import { onboardingTourEntityConfig } from '../entities/OnboardingTour';
import { Card } from './ui/card';

type OnboardingTourType = {
  id: number;
  userId: string;
  tourType: 'basic_mode' | 'scientific_mode' | 'history_panel' | 'full_tour';
  currentStep: number;
  totalSteps: number;
  completedAt: string;
  droppedAt: string;
  status: 'in_progress' | 'completed' | 'skipped' | 'dropped_off';
  sessionId: string;
  created_at: string;
  updated_at: string;
};

interface TourStatisticsDashboardProps {
  userId?: string;
}

export const TourStatisticsDashboard: React.FC<TourStatisticsDashboardProps> = ({ userId }) => {
  const { items: tours } = useEntity<OnboardingTourType>(onboardingTourEntityConfig);

  const stats = useMemo(() => {
    const filteredTours = userId ? tours.filter(t => t.userId === userId) : tours;

    // Overall completion rates
    const totalTours = filteredTours.length;
    const completedTours = filteredTours.filter(t => t.status === 'completed').length;
    const skippedTours = filteredTours.filter(t => t.status === 'skipped').length;
    const droppedOffTours = filteredTours.filter(t => t.status === 'dropped_off').length;
    const inProgressTours = filteredTours.filter(t => t.status === 'in_progress').length;

    // By tour type
    const byTourType = ['basic_mode', 'scientific_mode', 'history_panel', 'full_tour'].map(type => {
      const typeTours = filteredTours.filter(t => t.tourType === type);
      const completed = typeTours.filter(t => t.status === 'completed').length;
      return {
        name: type.replace('_', ' ').toUpperCase(),
        total: typeTours.length,
        completed,
        completionRate: typeTours.length ? Math.round((completed / typeTours.length) * 100) : 0,
      };
    });

    // Drop-off analysis
    const dropOffByStep = filteredTours
      .filter(t => t.status === 'dropped_off' || t.status === 'in_progress')
      .reduce((acc, tour) => {
        const step = tour.currentStep;
        const existing = acc.find(s => s.step === step);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ step, count: 1 });
        }
        return acc;
      }, [] as Array<{ step: number; count: number }>)
      .sort((a, b) => a.step - b.step);

    // Status breakdown
    const statusData = [
      { name: 'Completed', value: completedTours, color: '#10b981' },
      { name: 'Skipped', value: skippedTours, color: '#f59e0b' },
      { name: 'Dropped Off', value: droppedOffTours, color: '#ef4444' },
      { name: 'In Progress', value: inProgressTours, color: '#3b82f6' },
    ].filter(s => s.value > 0);

    return {
      totalTours,
      completedTours,
      skippedTours,
      droppedOffTours,
      inProgressTours,
      overallCompletionRate: totalTours ? Math.round((completedTours / totalTours) * 100) : 0,
      byTourType,
      dropOffByStep,
      statusData,
    };
  }, [tours, userId]);

  if (stats.totalTours === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No tour data available yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Total Tours Started</p>
          <p className="text-3xl font-bold text-blue-900">{stats.totalTours}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-900">{stats.completedTours}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <p className="text-sm text-gray-600 mb-1">Skipped</p>
          <p className="text-3xl font-bold text-amber-900">{stats.skippedTours}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <p className="text-sm text-gray-600 mb-1">Dropped Off</p>
          <p className="text-3xl font-bold text-red-900">{stats.droppedOffTours}</p>
        </Card>
      </div>

      {/* Overall Completion Rate */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Completion Rate</h3>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-900">{stats.overallCompletionRate}%</p>
              <p className="text-sm text-blue-700">Tours Completed</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Status Breakdown */}
      {stats.statusData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${Math.round(percent * 100)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Completion Rate by Tour Type */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate by Tour Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.byTourType}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completionRate" fill="#3b82f6" name="Completion Rate (%)" />
            <Bar dataKey="total" fill="#e5e7eb" name="Total Started" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Drop-off Analysis */}
      {stats.dropOffByStep.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Drop-off Points</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.dropOffByStep}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="step" label={{ value: 'Step Number', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Drop-offs', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#ef4444" name="Users Dropped Off" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-4">
            <strong>Insight:</strong> Most users drop off at step {stats.dropOffByStep.length > 0 ? stats.dropOffByStep[0].step : 'N/A'}. 
            Consider simplifying this step or providing additional guidance.
          </p>
        </Card>
      )}

      {/* Tour Type Details Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Type Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tour Type</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Started</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Completed</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {stats.byTourType.map((tour) => (
                <tr key={tour.name} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{tour.name}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{tour.total}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{tour.completed}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 rounded-full font-semibold text-sm">
                      {tour.completionRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TourStatisticsDashboard;
