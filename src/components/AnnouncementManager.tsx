import { useState, useEffect } from "react";
import { useEntity } from "../hooks/useEntity";
import { announcementEntityConfig } from "../entities/Announcement";
import { Bell, Plus, Edit2, Trash2, Eye, EyeOff, Calendar } from "lucide-react";

type Announcement = {
  id: number;
  title: string;
  message: string;
  type: string;
  priority: string;
  linkText: string;
  linkUrl: string;
  targetPages: string;
  status: string;
  startDate: string;
  endDate: string;
  created_at: string;
  updated_at: string;
};

export default function AnnouncementManager() {
  const { items: announcements, loading, error, create, update, remove } = useEntity<Announcement>(announcementEntityConfig);
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "news",
    priority: "medium",
    linkText: "",
    linkUrl: "",
    targetPages: "all",
    status: "draft",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      await update(editingId, formData);
      setEditingId(null);
    } else {
      await create(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      type: "news",
      priority: "medium",
      linkText: "",
      linkUrl: "",
      targetPages: "all",
      status: "draft",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setIsCreating(true);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      priority: announcement.priority,
      linkText: announcement.linkText,
      linkUrl: announcement.linkUrl,
      targetPages: announcement.targetPages,
      status: announcement.status,
      startDate: announcement.startDate,
      endDate: announcement.endDate,
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      await remove(id);
    }
  };

  const activeAnnouncements = announcements.filter(a => a.status === "active");
  const scheduledAnnouncements = announcements.filter(a => a.status === "scheduled");
  const draftAnnouncements = announcements.filter(a => a.status === "draft");

  if (loading) return <div className="p-8 text-center">Loading announcements...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error loading announcements</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcement Manager</h1>
          <p className="text-gray-600 mt-2">Create and manage in-app announcements</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Announcement
        </button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Edit Announcement" : "Create New Announcement"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="alert">Alert</option>
                  <option value="update">Update</option>
                  <option value="feature">Feature</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="news">News</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Text (Optional)</label>
                <input
                  type="text"
                  value={formData.linkText}
                  onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (Optional)</label>
                <input
                  type="url"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Pages</label>
                <select
                  value={formData.targetPages}
                  onChange={(e) => setFormData({ ...formData, targetPages: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Pages</option>
                  <option value="home">Home</option>
                  <option value="calculator">Calculator</option>
                  <option value="dashboard">Dashboard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? "Update" : "Create"} Announcement
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {activeAnnouncements.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-600" />
              Active Announcements ({activeAnnouncements.length})
            </h2>
            <div className="space-y-3">
              {activeAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {scheduledAnnouncements.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Scheduled Announcements ({scheduledAnnouncements.length})
            </h2>
            <div className="space-y-3">
              {scheduledAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {draftAnnouncements.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-gray-600" />
              Drafts ({draftAnnouncements.length})
            </h2>
            <div className="space-y-3">
              {draftAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {announcements.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No announcements yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AnnouncementCard({
  announcement,
  onEdit,
  onDelete,
}: {
  announcement: Announcement;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: number) => void;
}) {
  const typeColors = {
    alert: "bg-red-100 text-red-800",
    update: "bg-blue-100 text-blue-800",
    feature: "bg-green-100 text-green-800",
    maintenance: "bg-yellow-100 text-yellow-800",
    news: "bg-purple-100 text-purple-800",
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[announcement.type as keyof typeof typeColors] || typeColors.news}`}>
              {announcement.type}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[announcement.priority as keyof typeof priorityColors] || priorityColors.medium}`}>
              {announcement.priority}
            </span>
          </div>
          <p className="text-gray-600 mb-2">{announcement.message}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Status: {announcement.status}</span>
            <span>Start: {announcement.startDate}</span>
            {announcement.targetPages && <span>Pages: {announcement.targetPages}</span>}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(announcement)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(announcement.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
