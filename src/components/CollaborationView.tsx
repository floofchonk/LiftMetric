import { useState, useEffect } from "react";
import { useEntity } from "../hooks/useEntity";
import { collaborationVersionEntityConfig } from "../entities/CollaborationVersion";
import { shareCommentEntityConfig } from "../entities/ShareComment";
import { Clock, User, MessageSquare, Edit3, RotateCcw, Send, Check } from "lucide-react";

type CollaborationVersion = {
  id: number;
  sharedCalculationId: string;
  versionNumber: number;
  calculationData: string;
  changedBy: string;
  changedByName: string;
  changeDescription: string;
  changeType: string;
  previousVersionId: string | null;
  created_at: string;
  updated_at: string;
};

type ShareComment = {
  id: number;
  sharedCalculationId: string;
  userId: string;
  userName: string;
  userEmail: string;
  comment: string;
  isResolved: string;
  parentCommentId: string | null;
  created_at: string;
  updated_at: string;
};

type CollaborationViewProps = {
  sharedCalculationId: string;
  currentData: any;
  accessLevel: "view" | "comment" | "edit";
  onRestore?: (versionData: any) => void;
};

export default function CollaborationView({
  sharedCalculationId,
  currentData,
  accessLevel,
  onRestore,
}: CollaborationViewProps) {
  const [activeTab, setActiveTab] = useState<"versions" | "comments">("versions");
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);

  const { items: versions, loading: versionsLoading, create: createVersion } =
    useEntity<CollaborationVersion>(collaborationVersionEntityConfig);

  const { items: comments, loading: commentsLoading, create: createComment, update: updateComment } =
    useEntity<ShareComment>(shareCommentEntityConfig);

  const filteredVersions = versions.filter(v => v.sharedCalculationId === sharedCalculationId);
  const filteredComments = comments.filter(c => c.sharedCalculationId === sharedCalculationId);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    await createComment({
      sharedCalculationId,
      userId: "user_123",
      userName: "Current User",
      userEmail: "user@example.com",
      comment: newComment,
      isResolved: "false",
      parentCommentId: replyTo?.toString() || null,
    });

    setNewComment("");
    setReplyTo(null);
  };

  const handleResolveComment = async (comment: ShareComment) => {
    await updateComment(comment.id, {
      isResolved: comment.isResolved === "true" ? "false" : "true",
    });
  };

  const handleRestoreVersion = (version: CollaborationVersion) => {
    if (onRestore && accessLevel === "edit") {
      const data = JSON.parse(version.calculationData);
      onRestore(data);
    }
  };

  const getChangeTypeColor = (type: string) => {
    const colors = {
      created: "bg-blue-100 text-blue-800 border-blue-200",
      edited: "bg-green-100 text-green-800 border-green-200",
      commented: "bg-purple-100 text-purple-800 border-purple-200",
      restored: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return colors[type as keyof typeof colors] || colors.edited;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab("versions")}
            className={`flex-1 px-6 py-4 font-semibold transition-all duration-200 ${
              activeTab === "versions"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Clock className="w-5 h-5 inline mr-2" />
            Version History ({filteredVersions.length})
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex-1 px-6 py-4 font-semibold transition-all duration-200 ${
              activeTab === "comments"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <MessageSquare className="w-5 h-5 inline mr-2" />
            Comments ({filteredComments.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "versions" && (
          <div className="space-y-4">
            {versionsLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            )}

            {!versionsLoading && filteredVersions.length === 0 && (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No version history yet</p>
              </div>
            )}

            {!versionsLoading && filteredVersions.map((version) => (
              <div
                key={version.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        Version {version.versionNumber}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getChangeTypeColor(version.changeType)}`}>
                        {version.changeType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <User className="w-4 h-4" />
                      <span>{version.changedByName}</span>
                      <span>•</span>
                      <Clock className="w-4 h-4" />
                      <span>{new Date(version.created_at).toLocaleString()}</span>
                    </div>
                    {version.changeDescription && (
                      <p className="text-gray-700 text-sm">{version.changeDescription}</p>
                    )}
                  </div>
                  {accessLevel === "edit" && onRestore && (
                    <button
                      onClick={() => handleRestoreVersion(version)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all duration-200"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restore
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "comments" && (
          <div className="space-y-4">
            {/* Add Comment */}
            {(accessLevel === "comment" || accessLevel === "edit") && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3">
                  {replyTo && (
                    <span className="text-sm text-gray-600">
                      Replying to comment #{replyTo}
                      <button
                        onClick={() => setReplyTo(null)}
                        className="ml-2 text-blue-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </span>
                  )}
                  <div className="flex-1"></div>
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Send className="w-4 h-4" />
                    Post Comment
                  </button>
                </div>
              </div>
            )}

            {/* Comments List */}
            {commentsLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            )}

            {!commentsLoading && filteredComments.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No comments yet</p>
              </div>
            )}

            {!commentsLoading && filteredComments.map((comment) => (
              <div
                key={comment.id}
                className={`rounded-lg p-4 border ${
                  comment.isResolved === "true"
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{comment.userName}</div>
                      <div className="text-xs text-gray-600">
                        {new Date(comment.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {comment.isResolved === "true" && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold border border-green-200 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Resolved
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-3 pl-13">{comment.comment}</p>
                <div className="flex gap-2 pl-13">
                  {(accessLevel === "comment" || accessLevel === "edit") && (
                    <>
                      <button
                        onClick={() => handleResolveComment(comment)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-200 ${
                          comment.isResolved === "true"
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {comment.isResolved === "true" ? "Unresolve" : "Resolve"}
                      </button>
                      <button
                        onClick={() => setReplyTo(comment.id)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200 transition-all duration-200"
                      >
                        Reply
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
