import { useState } from "react";
import { useEntity } from "../hooks/useEntity";
import { testimonialEntityConfig } from "../entities/Testimonial";
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Award,
  X,
  Save,
  Building2,
  MapPin,
} from "lucide-react";

type Testimonial = {
  id: number;
  quote: string;
  authorName: string;
  authorTitle: string;
  company: string;
  industry: string;
  rating: number;
  isAnonymous: string;
  isPublished: string;
  isFeatured: string;
  avatar?: string;
  location?: string;
  created_at: string;
  updated_at: string;
};

type FormData = {
  quote: string;
  authorName: string;
  authorTitle: string;
  company: string;
  industry: string;
  rating: number;
  isAnonymous: string;
  isPublished: string;
  isFeatured: string;
  avatar: string;
  location: string;
};

export default function TestimonialsAdmin() {
  const { items: testimonials, loading, error, create, update, remove } = useEntity<Testimonial>(testimonialEntityConfig);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    quote: "",
    authorName: "",
    authorTitle: "",
    company: "",
    industry: "Technology",
    rating: 5,
    isAnonymous: "false",
    isPublished: "true",
    isFeatured: "false",
    avatar: "",
    location: "",
  });

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Consulting",
    "Real_Estate",
    "Marketing",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      await update(editingId, formData);
    } else {
      await create(formData);
    }

    resetForm();
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      quote: testimonial.quote,
      authorName: testimonial.authorName,
      authorTitle: testimonial.authorTitle,
      company: testimonial.company,
      industry: testimonial.industry,
      rating: testimonial.rating,
      isAnonymous: testimonial.isAnonymous,
      isPublished: testimonial.isPublished,
      isFeatured: testimonial.isFeatured,
      avatar: testimonial.avatar || "",
      location: testimonial.location || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      await remove(id);
    }
  };

  const togglePublished = async (testimonial: Testimonial) => {
    await update(testimonial.id, {
      isPublished: testimonial.isPublished === "true" ? "false" : "true",
    });
  };

  const toggleFeatured = async (testimonial: Testimonial) => {
    await update(testimonial.id, {
      isFeatured: testimonial.isFeatured === "true" ? "false" : "true",
    });
  };

  const resetForm = () => {
    setFormData({
      quote: "",
      authorName: "",
      authorTitle: "",
      company: "",
      industry: "Technology",
      rating: 5,
      isAnonymous: "false",
      isPublished: "true",
      isFeatured: "false",
      avatar: "",
      location: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>Error loading testimonials: {String(error)}</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: testimonials.length,
    published: testimonials.filter((t) => t.isPublished === "true").length,
    featured: testimonials.filter((t) => t.isFeatured === "true").length,
    avgRating: (
      testimonials.reduce((sum, t) => sum + t.rating, 0) /
      Math.max(testimonials.length, 1)
    ).toFixed(1),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Testimonials Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage customer success stories and reviews
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {showForm ? "Cancel" : "Add New"}
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Testimonials</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {stats.published}
              </div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {stats.featured}
              </div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600 flex items-center gap-1">
                {stats.avgRating} <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? "Edit Testimonial" : "Add New Testimonial"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quote */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Testimonial Quote *
                  </label>
                  <textarea
                    value={formData.quote}
                    onChange={(e) =>
                      setFormData({ ...formData, quote: e.target.value })
                    }
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter the testimonial text..."
                  />
                </div>

                {/* Author Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) =>
                      setFormData({ ...formData, authorName: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                {/* Author Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.authorTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, authorTitle: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CEO, Product Manager, etc."
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Acme Corp"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) =>
                      setFormData({ ...formData, industry: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="San Francisco, CA"
                  />
                </div>

                {/* Avatar URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) =>
                      setFormData({ ...formData, avatar: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating (1-5) *
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Star{r !== 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="md:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous === "true"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isAnonymous: e.target.checked ? "true" : "false",
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Display as Anonymous</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished === "true"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isPublished: e.target.checked ? "true" : "false",
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Publish on Site</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured === "true"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isFeatured: e.target.checked ? "true" : "false",
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Feature Prominently</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                  <Save className="w-5 h-5" />
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Testimonials List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            All Testimonials ({testimonials.length})
          </h2>

          {testimonials.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No testimonials yet. Click "Add New" to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Quote */}
                      <p className="text-gray-700 mb-3 italic">
                        "{testimonial.quote}"
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center gap-4 mb-2">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {testimonial.isAnonymous === "true"
                              ? "Anonymous User"
                              : testimonial.authorName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {testimonial.authorTitle}
                          </div>
                        </div>
                        {renderStars(testimonial.rating)}
                      </div>

                      {/* Company & Location */}
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        {testimonial.company && (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {testimonial.company}
                          </div>
                        )}
                        {testimonial.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {testimonial.location}
                          </div>
                        )}
                        <div className="text-blue-600">
                          {testimonial.industry.replace("_", " ")}
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex gap-2 mt-3">
                        {testimonial.isPublished === "true" && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Published
                          </span>
                        )}
                        {testimonial.isFeatured === "true" && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            Featured
                          </span>
                        )}
                        {testimonial.isAnonymous === "true" && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            Anonymous
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => togglePublished(testimonial)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          testimonial.isPublished === "true"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title={
                          testimonial.isPublished === "true"
                            ? "Unpublish"
                            : "Publish"
                        }
                      >
                        {testimonial.isPublished === "true" ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        onClick={() => toggleFeatured(testimonial)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          testimonial.isFeatured === "true"
                            ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title={
                          testimonial.isFeatured === "true"
                            ? "Remove Featured"
                            : "Make Featured"
                        }
                      >
                        <Award className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-200"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
