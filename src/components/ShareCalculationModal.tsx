import { useState } from "react";
import { X, Link2, Mail, Users, Copy, Check, Download, Eye, Edit3, MessageSquare, Clock, Shield, Globe, Lock } from "lucide-react";

type ShareCalculationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  calculation: any;
  onShare: (shareData: any) => void;
};

export default function ShareCalculationModal({
  isOpen,
  onClose,
  calculation,
  onShare,
}: ShareCalculationModalProps) {
  const [title, setTitle] = useState(calculation?.title || "Shared Calculation");
  const [description, setDescription] = useState("");
  const [accessLevel, setAccessLevel] = useState<"view" | "comment" | "edit">("view");
  const [privacyLevel, setPrivacyLevel] = useState<"public" | "anyone-with-link" | "specific-users">("anyone-with-link");
  const [allowDownload, setAllowDownload] = useState(true);
  const [allowCopy, setAllowCopy] = useState(true);
  const [expiresIn, setExpiresIn] = useState<"never" | "1day" | "7days" | "30days">("never");
  const [invitedEmails, setInvitedEmails] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);

  if (!isOpen) return null;

  const generateShareLink = () => {
    const shareId = `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const link = `${window.location.origin}/shared/${shareId}`;
    return { shareId, link };
  };

  const handleShare = () => {
    const { shareId, link } = generateShareLink();
    
    let expiresAt = null;
    if (expiresIn !== "never") {
      const days = expiresIn === "1day" ? 1 : expiresIn === "7days" ? 7 : 30;
      expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    }

    const shareData = {
      shareId,
      title,
      description,
      calculationType: calculation?.type || "basic",
      calculationData: JSON.stringify(calculation),
      ownerId: "user_123", // Replace with actual user ID
      ownerName: "Current User",
      ownerEmail: "user@example.com",
      accessLevel,
      privacyLevel,
      allowDownload: allowDownload.toString(),
      allowCopy: allowCopy.toString(),
      expiresAt,
      viewCount: 0,
      isActive: "true",
      invitedUsers: privacyLevel === "specific-users" ? JSON.stringify(invitedEmails.split(",").map(e => e.trim())) : "[]",
      tags: JSON.stringify([calculation?.type || "calculation"]),
    };

    onShare(shareData);
    setShareLink(link);
    setIsShared(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Shared Calculation: ${title}`);
    const body = encodeURIComponent(`I've shared a calculation with you on Lift Metric.\n\n${description}\n\nView it here: ${shareLink}\n\nAccess level: ${accessLevel}`);
    window.location.href = `mailto:${invitedEmails}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Share Calculation</h2>
              <p className="text-blue-100 text-sm">Set up sharing and collaboration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isShared ? (
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="My Shared Calculation"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Add context about this calculation..."
              />
            </div>

            {/* Privacy Settings */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Privacy & Access
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Who can access?
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setPrivacyLevel("public")}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        privacyLevel === "public"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-semibold text-gray-900">Public</div>
                          <div className="text-sm text-gray-600">Anyone can find and view</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setPrivacyLevel("anyone-with-link")}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        privacyLevel === "anyone-with-link"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Link2 className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-semibold text-gray-900">Anyone with link</div>
                          <div className="text-sm text-gray-600">Only people with the link</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setPrivacyLevel("specific-users")}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        privacyLevel === "specific-users"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-semibold text-gray-900">Specific users</div>
                          <div className="text-sm text-gray-600">Only invited people</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {privacyLevel === "specific-users" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Invite by email (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={invitedEmails}
                      onChange={(e) => setInvitedEmails(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="user1@example.com, user2@example.com"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Access level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setAccessLevel("view")}
                      className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        accessLevel === "view"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-300 text-gray-700"
                      }`}
                    >
                      <Eye className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-semibold">View</div>
                    </button>

                    <button
                      onClick={() => setAccessLevel("comment")}
                      className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        accessLevel === "comment"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-300 text-gray-700"
                      }`}
                    >
                      <MessageSquare className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-semibold">Comment</div>
                    </button>

                    <button
                      onClick={() => setAccessLevel("edit")}
                      className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        accessLevel === "edit"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-300 text-gray-700"
                      }`}
                    >
                      <Edit3 className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-semibold">Edit</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Settings</h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowDownload}
                    onChange={(e) => setAllowDownload(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 font-medium">Allow downloads</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowCopy}
                    onChange={(e) => setAllowCopy(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <Copy className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 font-medium">Allow copying</span>
                  </div>
                </label>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    Link expires
                  </label>
                  <select
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="never">Never</option>
                    <option value="1day">In 1 day</option>
                    <option value="7days">In 7 days</option>
                    <option value="30days">In 30 days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Create Share Link
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
              <div className="text-green-600 text-5xl mb-2">✓</div>
              <h3 className="text-xl font-bold text-green-900 mb-2">Share Link Created!</h3>
              <p className="text-green-700">Your calculation is now shareable</p>
            </div>

            {/* Share Link */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Share Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 inline mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 inline mr-2" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Share Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleEmailShare}
                disabled={privacyLevel === "specific-users" && !invitedEmails}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="w-5 h-5" />
                Share via Email
              </button>

              <button
                onClick={() => {
                  // In a real app, this would open a native share dialog
                  if (navigator.share) {
                    navigator.share({
                      title: title,
                      text: description,
                      url: shareLink,
                    });
                  } else {
                    alert("Share feature not supported on this browser");
                  }
                }}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Users className="w-5 h-5" />
                More Options
              </button>
            </div>

            {/* Share Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-gray-900 mb-3">Share Settings</h4>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Privacy:</span>
                <span className="font-semibold text-gray-900 capitalize">{privacyLevel.replace("-", " ")}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Access Level:</span>
                <span className="font-semibold text-gray-900 capitalize">{accessLevel}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Downloads:</span>
                <span className="font-semibold text-gray-900">{allowDownload ? "Allowed" : "Disabled"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Expires:</span>
                <span className="font-semibold text-gray-900">{expiresIn === "never" ? "Never" : expiresIn.replace("days", " days").replace("day", " day")}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
