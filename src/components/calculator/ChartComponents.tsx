import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

interface TimelinePhase {
  name: string;
  duration: number;
  cost: number;
  startDate: string;
  endDate: string;
}

interface TimelineData {
  phases: TimelinePhase[];
  totalDuration: number;
  goLiveDate: string;
  meetsTarget: boolean;
}

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface CostBreakdownProps {
  results: any;
  chartType: 'bar' | 'pie';
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function getPhaseColor(phaseName: string): string {
  const index = phaseName.charCodeAt(0) % COLORS.length;
  return COLORS[index];
}

export function TimelineChart({ results }: { results: any }) {
  const timeline = Array.isArray(results.timeline) ? results.timeline : (results.timeline as TimelineData)?.phases || [];
  
  const data = timeline.map((phase: any, idx: number) => ({
    name: phase.name || `Phase ${idx + 1}`,
    duration: phase.duration || 0,
    cost: phase.cost || 0,
  }));

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Project Timeline</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="duration" fill="#3b82f6" name="Duration (months)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CostBreakdownChart({ results, chartType }: CostBreakdownProps) {
  const timeline = Array.isArray(results.timeline) ? results.timeline : (results.timeline as TimelineData)?.phases || [];
  const data = timeline.map((p: any) => ({
    label: p.name || 'Phase',
    value: p.cost || 0,
    color: getPhaseColor(p.name || 'Phase')
  }));

  const total = data.reduce((sum: number, d: ChartData) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <p className="text-gray-500 text-center">No cost data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <PieChartIcon className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">Cost Breakdown</h3>
      </div>
      {chartType === 'pie' ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Bar dataKey="value" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function ROITrendChart({ scenarios }: { scenarios: any[] }) {
  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <p className="text-gray-500 text-center">No scenarios to compare</p>
      </div>
    );
  }

  const data: any[] = scenarios.map((s: any, idx: number) => ({
    name: s.name || `Scenario ${idx + 1}`,
    roi: typeof s.roi === 'number' ? s.roi : (s.roi as any)?.value || 0,
  }));

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h3 className="font-semibold text-gray-900">ROI Comparison</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
          <Line type="monotone" dataKey="roi" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
