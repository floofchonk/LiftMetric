import { useState } from "react";
import { useEntity } from "../hooks/useEntity";
import { testimonialEntityConfig } from "../entities/Testimonial";
import { Star, Check, X, Eye, Clock } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  quote: string;
  rating: number;
  company: string;
  role: string;
  status: "pending" | "approved" | "rejected";
  featured: string;
  userId: string;
  reviewedAt: string;
  reviewedBy: string;
  created_at: string;
  updated_at: string;
};

export default function TestimonialAdmin() {
  const { items: testimonials, loading, update } = useEntity<Testimonial>(testimonialEntityConfig);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const filteredTestimonials = filter === "all" 
    ? testimonials 
    : testimonials.filter((t) => t.status === filter);

  const handleApprove = async (id: number, featured: boolean = false) => {
    await update(id, {
      status: "approved",
      featured: featured ? "true" : "false",
      reviewedAt: new Date().toISOString(),
      reviewedBy: "admin",
    });
  };

  const handleReject = async (id: number) => {
    await update(id, {
      status: "rejected",
      reviewedAt: new Date().toISOString(),
      reviewedBy: "admin",
    });
  };

  const handleToggleFeatured = async (id: number, currentFeatured: string) => {
    await update(id, {
      featured: currentFeatured === "true" ? "false" : "true",
    });
  };

  const pendingCount = testimonials.filter((t) => t.status === "pending").length;
  const approvedCount = testimonials.filter((t) => t.status === "approved").length;
  const rejectedCount = testimonials.filter((t) => t.status === "rejected").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Testimonial Management</h1>
        <p className="text-gray-600">Review and manage user testimonials</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{testimonials.length}</p>
            </div>
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
            </div>
            <Check className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
            </div>
            <X className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({testimonials.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "pending"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "approved"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "rejected"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">No testimonials to show</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-lg shadow p-6 ${
                testimonial.status === "pending" ? "border-l-4 border-yellow-400" :
                testimonial.status === "approved" ? "border-l-4 border-green-400" :
                "border-l-4 border-red-400"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {testimonial.name}
                    </h3>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {(testimonial.role || testimonial.company) && (
                    <p className="text-sm text-gray-600 mb-3">
                      {testimonial.role && testimonial.company
                        ? `${testimonial.role} at ${testimonial.company}`
                        : testimonial.role || testimonial.company}
                    </p>
                  )}
                  <p className="text-gray-700 leading-relaxed mb-3">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-xs text-gray-500">
                    Submitted {new Date(testimonial.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {testimonial.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(testimonial.id, false)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleApprove(testimonial.id, true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Star className="w-4 h-4" />
                        Feature
                      </button>
                      <button
                        onClick={() => handleReject(testimonial.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}

                  {testimonial.status === "approved" && (
                    <button
                      onClick={() => handleToggleFeatured(testimonial.id, testimonial.featured)}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        testimonial.featured === "true"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${testimonial.featured === "true" ? "fill-yellow-600" : ""}`} />
                      {testimonial.featured === "true" ? "Featured" : "Feature"}
                    </button>
                  )}
                </div>
              </div>

              {testimonial.reviewedAt && (
                <div className="text-xs text-gray-500 border-t border-gray-200 pt-3">
                  Reviewed {new Date(testimonial.reviewedAt).toLocaleDateString()} by {testimonial.reviewedBy}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
