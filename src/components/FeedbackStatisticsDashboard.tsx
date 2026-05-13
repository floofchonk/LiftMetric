import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEntity } from '../hooks/useEntity';
import { userFeedbackEntityConfig } from '../entities/UserFeedback';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

type UserFeedbackType = {
  id: number;
  userId: string;
  feedbackType: 'bug_report' | 'feature_suggestion' | 'general_feedback';
  message: string;
  email: string;
  rating: number;
  sessionId: string;
  pageUrl: string;
  status: 'new' | 'reviewed' | 'in_progress' | 'resolved' | 'closed';
  adminNotes: string;
  created_at: string;
  updated_at: string;
};

interface FeedbackStatisticsDashboardProps {
  limit?: number;
}

export const FeedbackStatisticsDashboard: React.FC<FeedbackStatisticsDashboardProps> = ({ limit = 50 }) => {
  const { items: feedbacks } = useEntity<UserFeedbackType>(userFeedbackEntityConfig);

  const stats = useMemo(() => {
    const recentFeedback = feedbacks.slice(0, limit);

    // Status breakdown
    const statuses = {
      new: recentFeedback.filter(f => f.status === 'new').length,
      reviewed: recentFeedback.filter(f => f.status === 'reviewed').length,
      in_progress: recentFeedback.filter(f => f.status === 'in_progress').length,
      resolved: recentFeedback.filter(f => f.status === 'resolved').length,
      closed: recentFeedback.filter(f => f.status === 'closed').length,
    };

    // Type breakdown
    const types = {
      bug_report: recentFeedback.filter(f => f.feedbackType === 'bug_report').length,
      feature_suggestion: recentFeedback.filter(f => f.feedbackType === 'feature_suggestion').length,
      general_feedback: recentFeedback.filter(f => f.feedbackType === 'general_feedback').length,
    };

    // Average rating
    const ratedFeedback = recentFeedback.filter(f => f.rating > 0);
    const averageRating = ratedFeedback.length > 0 
      ? (ratedFeedback.reduce((sum, f) => sum + f.rating, 0) / ratedFeedback.length).toFixed(1)
      : 'N/A';

    // Rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: ratedFeedback.filter(f => f.rating === rating).length,
      label: '⭐'.repeat(rating),
    }));

    // Type chart data
    const typeChartData = [
      { name: 'Bug Reports', value: types.bug_report, color: '#ef4444' },
      { name: 'Feature Suggestions', value: types.feature_suggestion, color: '#3b82f6' },
      { name: 'General Feedback', value: types.general_feedback, color: '#10b981' },
    ].filter(t => t.value > 0);

    // Status chart data
    const statusChartData = [
      { name: 'New', count: statuses.new, color: '#f59e0b' },
      { name: 'Reviewed', count: statuses.reviewed, color: '#3b82f6' },
      { name: 'In Progress', count: statuses.in_progress, color: '#8b5cf6' },
      { name: 'Resolved', count: statuses.resolved, color: '#10b981' },
      { name: 'Closed', count: statuses.closed, color: '#6b7280' },
    ].filter(s => s.count > 0);

    return {
      totalFeedback: recentFeedback.length,
      statuses,
      types,
      averageRating,
      ratingDistribution,
      typeChartData,
      statusChartData,
      ratedFeedback: ratedFeedback.length,
      recentFeedback: recentFeedback.slice(0, 10),
    };
  }, [feedbacks, limit]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-amber-100 text-amber-800',
      reviewed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getFeedbackTypeEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      bug_report: '🐛',
      feature_suggestion: '💡',
      general_feedback: '💬',
    };
    return emojis[type] || '📝';
  };

  if (stats.totalFeedback === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No feedback collected yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Total Feedback</p>
          <p className="text-3xl font-bold text-blue-900">{stats.totalFeedback}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <p className="text-sm text-gray-600 mb-1">Awaiting Review</p>
          <p className="text-3xl font-bold text-amber-900">{stats.statuses.new}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <p className="text-sm text-gray-600 mb-1">Resolved</p>
          <p className="text-3xl font-bold text-green-900">{stats.statuses.resolved}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
          <p className="text-3xl font-bold text-purple-900">{stats.averageRating}</p>
        </Card>
      </div>

      {/* Feedback Type Distribution */}
      {stats.typeChartData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.typeChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${Math.round(percent * 100)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.typeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Status Distribution */}
      {stats.statusChartData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.statusChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" name="Number of Feedbacks" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Rating Distribution */}
      {stats.ratedFeedback > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Satisfaction (⭐ Ratings)</h3>
          <div className="space-y-3">
            {stats.ratingDistribution.map((rating) => (
              <div key={rating.rating} className="flex items-center gap-4">
                <span className="text-lg w-12">{rating.label}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full transition-all"
                    style={{ width: `${stats.ratedFeedback > 0 ? (rating.count / stats.ratedFeedback) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{rating.count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Feedback */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h3>
        <div className="space-y-4">
          {stats.recentFeedback.length > 0 ? (
            stats.recentFeedback.map((feedback) => (
              <div key={feedback.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getFeedbackTypeEmoji(feedback.feedbackType)}</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {feedback.feedbackType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(feedback.status)}>
                      {feedback.status}
                    </Badge>
                    {feedback.rating > 0 && (
                      <span className="text-sm">{'⭐'.repeat(feedback.rating)}</span>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-2">{feedback.message}</p>
                <div className="flex justify-between items-end">
                  <p className="text-xs text-gray-500">
                    {feedback.email && `From: ${feedback.email}`}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(feedback.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent feedback</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FeedbackStatisticsDashboard;
