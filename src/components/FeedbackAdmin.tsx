import { useState } from "react";
import { useEntity } from "../hooks/useEntity";
import { feedbackEntityConfig } from "../entities/Feedback";

type Feedback = {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  feedbackType: string;
  category: string;
  industry: string;
  title: string;
  description: string;
  relevanceRating: number;
  utilityRating: number;
  priority: string;
  status: string;
  adminNotes: string;
  isPublic: string;
  created_at: string;
  updated_at: string;
};

export default function FeedbackAdmin({ onClose }: { onClose: () => void }) {
  const { items: feedback, loading, error, update, remove } = useEntity<Feedback>(feedbackEntityConfig);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredFeedback = feedback.filter((item) => {
    if (filterType !== "all" && item.feedbackType !== filterType) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    total: feedback.length,
    new: feedback.filter((f) => f.status === "new").length,
    inProgress: feedback.filter((f) => f.status === "in_progress").length,
    completed: feedback.filter((f) => f.status === "completed").length,
    avgRelevance: feedback.length > 0 
      ? (feedback.reduce((sum, f) => sum + f.relevanceRating, 0) / feedback.length).toFixed(1)
      : "0",
    avgUtility: feedback.length > 0 
      ? (feedback.reduce((sum, f) => sum + f.utilityRating, 0) / feedback.length).toFixed(1)
      : "0",
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-blue-100 text-blue-800",
      reviewing: "bg-yellow-100 text-yellow-800",
      planned: "bg-purple-100 text-purple-800",
      in_progress: "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
      wont_fix: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const handleStatusChange = async (feedbackId: number, newStatus: string) => {
    await update(feedbackId, { status: newStatus });
  };

  const handlePriorityChange = async (feedbackId: number, newPriority: string) => {
    await update(feedbackId, { priority: newPriority });
  };

  const handleDelete = async (feedbackId: number) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      await remove(feedbackId);
      setSelectedFeedback(null);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="text-center">Loading feedback...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="text-red-600">Error loading feedback</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">📊 Feedback Management</h2>
              <p className="text-purple-100">Review and manage user feedback</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Feedback</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{stats.new}</div>
              <div className="text-sm text-gray-600">New</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-indigo-600">{stats.avgRelevance}</div>
              <div className="text-sm text-gray-600">Avg Relevance</div>
            </div>
            <div className="bg-pink-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-pink-600">{stats.avgUtility}</div>
              <div className="text-sm text-gray-600">Avg Utility</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-4 flex-wrap">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="suggestion">Suggestions</option>
              <option value="bug">Bug Reports</option>
              <option value="feature_request">Feature Requests</option>
              <option value="industry_feedback">Industry Feedback</option>
              <option value="general">General</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="reviewing">Reviewing</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="wont_fix">Won't Fix</option>
            </select>

            <div className="ml-auto text-sm text-gray-600 flex items-center">
              Showing {filteredFeedback.length} of {feedback.length} items
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {filteredFeedback.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedFeedback(item)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                        {item.status.replace("_", " ").toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                        {item.priority.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        {item.feedbackType.replace("_", " ")}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>👤 {item.userName || "Anonymous"}</span>
                      <span>🏢 {item.industry}</span>
                      <span>📂 {item.category}</span>
                      <span>⭐ Relevance: {item.relevanceRating}/5</span>
                      <span>💡 Utility: {item.utilityRating}/5</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={item.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(item.id, e.target.value);
                      }}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="new">New</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="planned">Planned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="wont_fix">Won't Fix</option>
                    </select>

                    <select
                      value={item.priority}
                      onChange={(e) => {
                        e.stopPropagation();
                        handlePriorityChange(item.id, e.target.value);
                      }}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredFeedback.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-lg">No feedback found matching your filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Modal */}
        {selectedFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Feedback Details</h3>
                  <button
                    onClick={() => setSelectedFeedback(null)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{selectedFeedback.title}</h4>
                  <div className="flex gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedFeedback.status)}`}>
                      {selectedFeedback.status.replace("_", " ").toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(selectedFeedback.priority)}`}>
                      {selectedFeedback.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedFeedback.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Contact Information</h5>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>👤 Name: {selectedFeedback.userName || "Not provided"}</p>
                      <p>📧 Email: {selectedFeedback.userEmail || "Not provided"}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Details</h5>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>🏢 Industry: {selectedFeedback.industry}</p>
                      <p>📂 Category: {selectedFeedback.category}</p>
                      <p>📝 Type: {selectedFeedback.feedbackType.replace("_", " ")}</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Relevance Rating</h5>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-2xl ${i < selectedFeedback.relevanceRating ? "text-blue-600" : "text-gray-300"}`}>
                          ⭐
                        </span>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {selectedFeedback.relevanceRating}/5
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Utility Rating</h5>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-2xl ${i < selectedFeedback.utilityRating ? "text-green-600" : "text-gray-300"}`}>
                          ⭐
                        </span>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {selectedFeedback.utilityRating}/5
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  <p>Submitted: {new Date(selectedFeedback.created_at).toLocaleString()}</p>
                  <p>Updated: {new Date(selectedFeedback.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
