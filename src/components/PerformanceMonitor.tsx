import { useState, useEffect } from 'react';
import { performanceMonitor } from '../lib/performance-monitor';
import type { PerformanceMetric, PerformanceAlert } from '../lib/performance-monitor';
import { Activity, AlertTriangle, Clock, Zap, TrendingUp, AlertCircle } from 'lucide-react';

export default function PerformanceMonitor() {
  const [stats, setStats] = useState(performanceMonitor.getStats());
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [bottlenecks, setBottlenecks] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [selectedMetricType, setSelectedMetricType] = useState<'all' | 'page_load' | 'interaction' | 'api_call' | 'error'>('all');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setStats(performanceMonitor.getStats());
    setAlerts(performanceMonitor.getAlerts().slice(-20).reverse());
    setBottlenecks(performanceMonitor.getBottlenecks());
    
    const allMetrics = performanceMonitor.getMetrics();
    setMetrics(allMetrics.slice(-50).reverse());
  };

  const filteredMetrics = selectedMetricType === 'all' 
    ? metrics 
    : metrics.filter(m => m.metricType === selectedMetricType);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Performance Monitor</h1>
          </div>
          <p className="text-gray-600">Real-time application performance tracking and alerts</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-6 h-6 text-blue-600" />
              <span className="text-sm text-gray-500">Avg Page Load</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {formatDuration(stats.avgPageLoad)}
            </div>
            <div className="text-sm text-gray-500 mt-1">Last 24 hours</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-6 h-6 text-yellow-600" />
              <span className="text-sm text-gray-500">Avg Interaction</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {formatDuration(stats.avgInteraction)}
            </div>
            <div className="text-sm text-gray-500 mt-1">Response time</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <span className="text-sm text-gray-500">API Calls</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {formatDuration(stats.avgApiCall)}
            </div>
            <div className="text-sm text-gray-500 mt-1">Average duration</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <span className="text-sm text-gray-500">Issues</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.errorCount}
            </div>
            <div className="text-sm text-red-600 mt-1">
              {stats.criticalAlerts} critical alerts
            </div>
          </div>
        </div>

        {/* Bottlenecks */}
        {bottlenecks.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              Performance Bottlenecks
            </h2>
            <div className="space-y-3">
              {bottlenecks.slice(0, 5).map((bottleneck, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${getSeverityColor(bottleneck.severity)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{bottleneck.name}</span>
                      <span className="text-xs px-2 py-1 rounded bg-white border">
                        {bottleneck.type.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="font-bold">{formatDuration(bottleneck.avgDuration)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{bottleneck.count} occurrences</span>
                    <span className="capitalize">{bottleneck.severity} severity</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Alerts */}
        {alerts.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              Recent Alerts
            </h2>
            <div className="space-y-2">
              {alerts.slice(0, 10).map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold">{alert.type}</span>
                      <p className="text-sm mt-1">{alert.message}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase font-semibold mb-1">
                        {alert.severity}
                      </div>
                      <div className="text-xs opacity-75">
                        {formatTime(alert.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Metrics */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-600" />
              Recent Metrics
            </h2>
            <div className="flex gap-2">
              {(['all', 'page_load', 'interaction', 'api_call', 'error'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedMetricType(type)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedMetricType === type
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All' : type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Page</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMetrics.slice(0, 20).map((metric) => (
                  <tr key={metric.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatTime(metric.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        metric.metricType === 'error' ? 'bg-red-100 text-red-700' :
                        metric.metricType === 'page_load' ? 'bg-blue-100 text-blue-700' :
                        metric.metricType === 'interaction' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {metric.metricType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {metric.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {metric.duration ? formatDuration(metric.duration) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {metric.page || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Performance Optimization Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span><strong>Page Load:</strong> Keep under 3 seconds for optimal user experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span><strong>Interactions:</strong> Respond within 100ms for smooth interactions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span><strong>API Calls:</strong> Optimize slow endpoints and consider caching</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span><strong>Errors:</strong> Address critical errors immediately to prevent user frustration</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
