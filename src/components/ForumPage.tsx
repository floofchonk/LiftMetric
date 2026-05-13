import { useState } from "react";
import { useEntity } from "../hooks/useEntity";
import { forumPostEntityConfig } from "../entities/ForumPost";
import { forumCommentEntityConfig } from "../entities/ForumComment";
import { forumVoteEntityConfig } from "../entities/ForumVote";
import { MessageSquare, TrendingUp, Bug, Lightbulb, Megaphone, ChevronUp, ChevronDown, Pin, MessageCircle, Calendar, X } from "lucide-react";

type ForumPost = {
  id: number;
  title: string;
  content: string;
  author: string;
  authorEmail: string;
  category: "general" | "feature-requests" | "bug-reports" | "tips-tricks" | "announcements";
  status: "open" | "closed" | "resolved" | "archived";
  upvotes: number;
  downvotes: number;
  commentCount: number;
  isPinned: string;
  tags: string;
  created_at: string;
  updated_at: string;
};

type ForumComment = {
  id: number;
  postId: number;
  content: string;
  author: string;
  authorEmail: string;
  upvotes: number;
  downvotes: number;
  isModerated: string;
  created_at: string;
  updated_at: string;
};

const categoryConfig = {
  general: { label: "General Discussion", icon: MessageSquare, color: "bg-blue-100 text-blue-700" },
  "feature-requests": { label: "Feature Requests", icon: Lightbulb, color: "bg-purple-100 text-purple-700" },
  "bug-reports": { label: "Bug Reports", icon: Bug, color: "bg-red-100 text-red-700" },
  "tips-tricks": { label: "Tips & Tricks", icon: TrendingUp, color: "bg-green-100 text-green-700" },
  announcements: { label: "Announcements", icon: Megaphone, color: "bg-yellow-100 text-yellow-700" },
};

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const { items: posts, loading, error, create: createPost, update: updatePost } = useEntity<ForumPost>(forumPostEntityConfig);
  const { items: comments, create: createComment } = useEntity<ForumComment>(forumCommentEntityConfig);
  const { items: votes, create: createVote } = useEntity(forumVoteEntityConfig);

  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const pinnedPosts = filteredPosts.filter(post => post.isPinned === "true");
  const regularPosts = filteredPosts.filter(post => post.isPinned !== "true");

  const handleCreatePost = async (postData: any) => {
    await createPost(postData);
    setShowCreatePost(false);
  };

  const handleVote = async (postId: number, voteType: "upvote" | "downvote") => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const voterEmail = "user@example.com";
    const existingVote = votes.find(v => v.postId === postId && v.voterEmail === voterEmail);

    if (existingVote) {
      alert("You've already voted on this post");
      return;
    }

    await createVote({ postId, commentId: 0, voterEmail, voteType });

    if (voteType === "upvote") {
      await updatePost(postId, { upvotes: post.upvotes + 1 });
    } else {
      await updatePost(postId, { downvotes: post.downvotes + 1 });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading forum...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading forum: {String(error)}</p>
        </div>
      </div>
    );
  }

  if (selectedPost) {
    return (
      <PostDetailView 
        post={selectedPost} 
        comments={comments.filter(c => c.postId === selectedPost.id)}
        onBack={() => setSelectedPost(null)}
        onAddComment={createComment}
        onUpdatePost={updatePost}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Community Forum</h1>
          <p className="text-blue-100 text-lg">
            Share ideas, get help, and connect with other Lift Metric users
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <button
                onClick={() => setShowCreatePost(true)}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 mb-6"
              >
                + New Post
              </button>

              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === "all"
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  All Posts ({posts.length})
                </button>
                {Object.entries(categoryConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  const count = posts.filter(p => p.category === key).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                        selectedCategory === key
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1">{config.label}</span>
                      <span className="text-sm">({count})</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-6">Be the first to start a conversation!</p>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
                >
                  Create First Post
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {pinnedPosts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    isPinned 
                    onVote={handleVote}
                    onClick={() => setSelectedPost(post)}
                  />
                ))}
                {regularPosts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onVote={handleVote}
                    onClick={() => setSelectedPost(post)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreatePost && (
        <CreatePostModal 
          onClose={() => setShowCreatePost(false)}
          onCreate={handleCreatePost}
        />
      )}
    </div>
  );
}

function PostCard({ post, isPinned = false, onVote, onClick }: { 
  post: ForumPost; 
  isPinned?: boolean;
  onVote: (postId: number, voteType: "upvote" | "downvote") => void;
  onClick: () => void;
}) {
  const categoryInfo = categoryConfig[post.category];
  const Icon = categoryInfo.icon;
  const score = post.upvotes - post.downvotes;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onVote(post.id, "upvote"); }}
            className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <span className={`font-semibold ${score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {score}
          </span>
          <button 
            onClick={(e) => { e.stopPropagation(); onVote(post.id, "downvote"); }}
            className="text-gray-400 hover:text-red-600 transition-colors duration-200"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 cursor-pointer" onClick={onClick}>
          <div className="flex items-start gap-3 mb-3">
            {isPinned && <Pin className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                {post.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${categoryInfo.color}`}>
                  <Icon className="w-3 h-3" />
                  {categoryInfo.label}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                <span>by {post.author}</span>
                {post.status !== "open" && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.status === "resolved" ? "bg-green-100 text-green-700" :
                    post.status === "closed" ? "bg-gray-100 text-gray-700" :
                    "bg-orange-100 text-orange-700"
                  }`}>
                    {post.status}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{post.commentCount} comments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostDetailView({ post, comments, onBack, onAddComment, onUpdatePost }: {
  post: ForumPost;
  comments: ForumComment[];
  onBack: () => void;
  onAddComment: (data: any) => Promise<void>;
  onUpdatePost: (id: number, data: any) => Promise<void>;
}) {
  const [newComment, setNewComment] = useState({ author: "", content: "" });
  const [showModeration, setShowModeration] = useState(false);

  const categoryInfo = categoryConfig[post.category];
  const Icon = categoryInfo.icon;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddComment({ postId: post.id, ...newComment, authorEmail: "" });
    await onUpdatePost(post.id, { commentCount: post.commentCount + 1 });
    setNewComment({ author: "", content: "" });
  };

  const handleStatusChange = async (newStatus: string) => {
    await onUpdatePost(post.id, { status: newStatus });
    setShowModeration(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2"
          >
            ← Back to Forum
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${categoryInfo.color}`}>
              <Icon className="w-4 h-4" />
              {categoryInfo.label}
            </span>
            {post.status !== "open" && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                post.status === "resolved" ? "bg-green-100 text-green-700" :
                post.status === "closed" ? "bg-gray-100 text-gray-700" :
                "bg-orange-100 text-orange-700"
              }`}>
                {post.status}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span>by {post.author}</span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <span>{post.upvotes - post.downvotes} votes</span>
          </div>

          <div className="prose max-w-none text-gray-700 mb-6">
            {post.content}
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowModeration(!showModeration)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              Moderate Post
            </button>
          </div>

          {showModeration && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Change Post Status</h4>
              <div className="flex flex-wrap gap-2">
                {["open", "resolved", "closed", "archived"].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      post.status === status
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({comments.length})
          </h2>

          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="space-y-4">
              <input
                type="text"
                value={newComment.author}
                onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                placeholder="Your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <textarea
                value={newComment.content}
                onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                placeholder="Add a comment..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
              >
                Post Comment
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">{comment.author}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreatePostModal({ onClose, onCreate }: { onClose: () => void; onCreate: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    authorEmail: "",
    category: "general" as const,
    tags: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
            <p className="text-gray-600 mt-1">Share your thoughts with the community</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What's your post about?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {Object.entries(categoryConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 resize-none"
              placeholder="Describe your question, idea, or issue in detail..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email (optional)</label>
              <input
                type="email"
                value={formData.authorEmail}
                onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="calculator, export, bug"
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
            >
              Post to Forum
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
