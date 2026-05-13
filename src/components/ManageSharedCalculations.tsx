import { useState } from "react";
import { useEntity } from "../hooks/useEntity";
import { sharedCalculationEntityConfig } from "../entities/SharedCalculation";
import { X, Link2, Users, Eye, Clock, Trash2, Power, Copy, Check, ExternalLink, Edit3, MessageSquare, Download } from "lucide-react";

type SharedCalculation = {
  id: number;
  shareId: string;
  title: string;
  description: string;
  calculationType: string;
  calculationData: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  accessLevel: string;
  privacyLevel: string;
  allowDownload: string;
  allowCopy: string;
  expiresAt: string | null;
  viewCount: number;
  isActive: string;
  invitedUsers: string;
  tags: string;
  created_at: string;
  updated_at: string;
};

type ManageSharedCalculationsProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ManageSharedCalculations({ isOpen, onClose }: ManageSharedCalculationsProps) {
  const { items: shares, loading, error, remove, update } = useEntity<SharedCalculation>(sharedCalculationEntityConfig);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopyLink = (share: SharedCalculation) => {
    const link = `${window.location.origin}/shared/${share.shareId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(share.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleActive = async (share: SharedCalculation) => {
    await update(share.id, {
      isActive: share.isActive === "true" ? "false" : "true",
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this shared calculation?")) {
      await remove(id);
    }
  };

  const activeShares = shares.filter(s => s.isActive === "true");
  const inactiveShares = shares.filter(s => s.isActive === "false");
  const totalViews = shares.reduce((sum, s) => sum + s.viewCount, 0);

  const getAccessIcon = (level: string) => {
    switch (level) {
      case "view": return <Eye className="w-4 h-4" />;
      case "comment": return <MessageSquare className="w-4 h-4" />;
      case "edit": return <Edit3 className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getPrivacyBadge = (level: string) => {
    const styles = {
      public: "bg-green-100 text-green-800 border-green-200",
      "anyone-with-link": "bg-blue-100 text-blue-800 border-blue-200",
      "specific-users": "bg-purple-100 text-purple-800 border-purple-200",
    };
    return styles[level as keyof typeof styles] || styles["anyone-with-link"];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Manage Shared Calculations</h2>
                <p className="text-blue-100 text-sm">View and control all your shared calculations</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="text-blue-600 text-2xl font-bold">{shares.length}</div>
              <div className="text-blue-800 text-sm font-medium">Total Shares</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="text-green-600 text-2xl font-bold">{activeShares.length}</div>
              <div className="text-green-800 text-sm font-medium">Active</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="text-purple-600 text-2xl font-bold">{totalViews}</div>
              <div className="text-purple-800 text-sm font-medium">Total Views</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="text-orange-600 text-2xl font-bold">
                {shares.filter(s => s.accessLevel === "edit").length}
              </div>
              <div className="text-orange-800 text-sm font-medium">Collaborative</div>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading shares...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              Error loading shares: {String(error)}
            </div>
          )}

          {!loading && !error && shares.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Shared Calculations</h3>
              <p className="text-gray-600">Start sharing calculations to collaborate with others</p>
            </div>
          )}

          {!loading && !error && shares.length > 0 && (
            <div className="space-y-4">
              {shares.map((share) => (
                <div
                  key={share.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{share.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPrivacyBadge(share.privacyLevel)}`}>
                          {share.privacyLevel.replace("-", " ")}
                        </span>
                        {share.isActive === "false" && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                            Inactive
                          </span>
                        )}
                      </div>
                      {share.description && (
                        <p className="text-gray-600 text-sm mb-3">{share.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          {getAccessIcon(share.accessLevel)}
                          <span className="capitalize">{share.accessLevel} access</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Eye className="w-4 h-4" />
                          <span>{share.viewCount} views</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(share.created_at).toLocaleDateString()}</span>
                        </div>
                        {share.allowDownload === "true" && (
                          <div className="flex items-center gap-2 text-green-600">
                            <Download className="w-4 h-4" />
                            <span>Downloads allowed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Share Link */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={`${window.location.origin}/shared/${share.shareId}`}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700"
                      />
                      <button
                        onClick={() => handleCopyLink(share)}
                        className={`px-4 py-2 rounded font-semibold text-sm transition-all duration-200 ${
                          copiedId === share.id
                            ? "bg-green-500 text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {copiedId === share.id ? (
                          <>
                            <Check className="w-4 h-4 inline mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 inline mr-1" />
                            Copy
                          </>
                        )}
                      </button>
                      <a
                        href={`${window.location.origin}/shared/${share.shareId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-600 text-white rounded font-semibold text-sm hover:bg-gray-700 transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4 inline mr-1" />
                        Open
                      </a>
                    </div>
                  </div>

                  {/* Invited Users */}
                  {share.privacyLevel === "specific-users" && share.invitedUsers && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-gray-700 mb-2">Invited Users:</div>
                      <div className="flex flex-wrap gap-2">
                        {JSON.parse(share.invitedUsers).map((email: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-50 text-purple-800 rounded-full text-xs font-medium border border-purple-200"
                          >
                            {email}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => handleToggleActive(share)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        share.isActive === "true"
                          ? "bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
                      }`}
                    >
                      <Power className="w-4 h-4" />
                      {share.isActive === "true" ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDelete(share.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-200 transition-all duration-200 border border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
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
